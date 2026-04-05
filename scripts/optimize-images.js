/**
 * Build web-optimized image assets for mobile/desktop delivery.
 *
 * Outputs are written to assets/images/optimized and are intended to be
 * referenced by runtime path remapping in main.js.
 */

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT_DIR, "assets", "images");
const OUTPUT_DIR = path.join(IMAGES_DIR, "optimized");

const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

const GALLERY_JOBS = [
  {
    name: "gallery-portrait",
    sourceDir: path.join(IMAGES_DIR, "gallery", "portrait"),
    outputDir: path.join(OUTPUT_DIR, "gallery", "portrait"),
    maxWidth: 900,
    maxHeight: 1400,
    quality: 72,
  },
  {
    name: "gallery-landscape",
    sourceDir: path.join(IMAGES_DIR, "gallery", "landscape"),
    outputDir: path.join(OUTPUT_DIR, "gallery", "landscape"),
    maxWidth: 1280,
    maxHeight: 820,
    quality: 72,
  },
];

const SECTION_JOBS = [
  {
    sourceFile: path.join(IMAGES_DIR, "ocean_waves_background.png"),
    outputFile: path.join(OUTPUT_DIR, "sections", "ocean_waves_background.jpg"),
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 74,
  },
  {
    sourceFile: path.join(IMAGES_DIR, "hon_dau_resort.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "hon_dau_resort.jpg"),
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 74,
  },
  {
    sourceFile: path.join(
      IMAGES_DIR,
      "phuc_van_pics",
      "phuc_van_1",
      "Album 30 x 30 Phuc Van",
      "HL.jpg",
    ),
    outputFile: path.join(OUTPUT_DIR, "sections", "until_the_day.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(IMAGES_DIR, "phuc_van_pics", "phuc_van_1", "DSC_6293.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "save_the_date.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(IMAGES_DIR, "phuc_van_pics", "phuc_van_1", "BRS06403.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "wishes.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(
      IMAGES_DIR,
      "phuc_van_pics",
      "phuc_van_1",
      "Album 30 x 30 Phuc Van",
      "G.jpg",
    ),
    outputFile: path.join(OUTPUT_DIR, "sections", "thank_you.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
];

function isImageFile(fileName) {
  return IMAGE_EXT_RE.test(fileName);
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function toRelative(absPath) {
  return path.relative(ROOT_DIR, absPath).replace(/\\/g, "/");
}

async function optimizeImage(sourceFile, outputFile, options) {
  await ensureDir(path.dirname(outputFile));

  const beforeStat = await fs.stat(sourceFile);

  await sharp(sourceFile)
    .rotate()
    .resize(options.maxWidth, options.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .flatten({ background: "#ffffff" })
    .jpeg({
      quality: options.quality,
      progressive: true,
      mozjpeg: true,
      chromaSubsampling: "4:2:0",
    })
    .toFile(outputFile);

  const afterStat = await fs.stat(outputFile);

  return {
    sourceBytes: beforeStat.size,
    outputBytes: afterStat.size,
  };
}

async function optimizeGalleryFolder(job) {
  const entries = await fs.readdir(job.sourceDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort();

  let sourceTotal = 0;
  let outputTotal = 0;

  for (const fileName of files) {
    const sourceFile = path.join(job.sourceDir, fileName);
    const outputFile = path.join(
      job.outputDir,
      path.parse(fileName).name + ".jpg",
    );

    const stats = await optimizeImage(sourceFile, outputFile, job);
    sourceTotal += stats.sourceBytes;
    outputTotal += stats.outputBytes;
  }

  return {
    fileCount: files.length,
    sourceTotal,
    outputTotal,
  };
}

async function optimizeSectionImages() {
  let sourceTotal = 0;
  let outputTotal = 0;
  let fileCount = 0;

  for (const job of SECTION_JOBS) {
    const stats = await optimizeImage(job.sourceFile, job.outputFile, job);
    sourceTotal += stats.sourceBytes;
    outputTotal += stats.outputBytes;
    fileCount += 1;
  }

  return {
    fileCount,
    sourceTotal,
    outputTotal,
  };
}

function formatMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  let totalSource = 0;
  let totalOutput = 0;

  for (const job of GALLERY_JOBS) {
    const result = await optimizeGalleryFolder(job);
    totalSource += result.sourceTotal;
    totalOutput += result.outputTotal;

    console.log(
      "[optimize-images] %s: %d files | %s MB -> %s MB",
      job.name,
      result.fileCount,
      formatMb(result.sourceTotal),
      formatMb(result.outputTotal),
    );
  }

  const sections = await optimizeSectionImages();
  totalSource += sections.sourceTotal;
  totalOutput += sections.outputTotal;

  console.log(
    "[optimize-images] sections: %d files | %s MB -> %s MB",
    sections.fileCount,
    formatMb(sections.sourceTotal),
    formatMb(sections.outputTotal),
  );

  const reductionPct =
    totalSource > 0 ? ((1 - totalOutput / totalSource) * 100).toFixed(1) : "0.0";

  console.log(
    "[optimize-images] done: %s MB -> %s MB (%s%% smaller)",
    formatMb(totalSource),
    formatMb(totalOutput),
    reductionPct,
  );
  console.log("[optimize-images] output root: %s", toRelative(OUTPUT_DIR));
}

main().catch((error) => {
  console.error("[optimize-images] failed:\n", error);
  process.exit(1);
});
