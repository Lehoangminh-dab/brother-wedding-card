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
const SOURCE_IMAGES_DIR = path.join(ROOT_DIR, "source-images");
const IMAGES_DIR = path.join(ROOT_DIR, "assets", "images");
const OUTPUT_DIR = path.join(IMAGES_DIR, "optimized");

const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

const GALLERY_JOBS = [
  {
    name: "gallery-portrait",
    sourceDir: path.join(SOURCE_IMAGES_DIR, "gallery", "portrait"),
    outputDir: path.join(OUTPUT_DIR, "gallery", "portrait"),
    variants: [
      { suffix: "480", maxWidth: 480, maxHeight: 720 },
      { suffix: "768", maxWidth: 768, maxHeight: 1152 },
      { suffix: "960", maxWidth: 960, maxHeight: 1400 },
    ],
    quality: 72,
  },
  {
    name: "gallery-landscape",
    sourceDir: path.join(SOURCE_IMAGES_DIR, "gallery", "landscape"),
    outputDir: path.join(OUTPUT_DIR, "gallery", "landscape"),
    variants: [
      { suffix: "640", maxWidth: 640, maxHeight: 420 },
      { suffix: "960", maxWidth: 960, maxHeight: 620 },
      { suffix: "1280", maxWidth: 1280, maxHeight: 820 },
    ],
    quality: 72,
  },
];

const SECTION_JOBS = [
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "ocean_waves_background.png"),
    outputFile: path.join(OUTPUT_DIR, "sections", "ocean_waves_background.jpg"),
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 74,
  },
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "hon_dau_resort.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "hon_dau_resort.jpg"),
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 74,
  },
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "HL.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "until_the_day.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "DSC_6293.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "save_the_date.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "BRS06403.jpg"),
    outputFile: path.join(OUTPUT_DIR, "sections", "wishes.jpg"),
    maxWidth: 1280,
    maxHeight: 1920,
    quality: 74,
  },
  {
    sourceFile: path.join(SOURCE_IMAGES_DIR, "sections", "G.jpg"),
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
  return afterStat.size;
}

function toVariantFilePath(baseFilePath, suffix) {
  return baseFilePath.replace(/\.jpg$/i, "-" + suffix + ".jpg");
}

async function optimizeVariants(sourceFile, outputFile, variants, quality) {
  let outputBytes = 0;

  for (const variant of variants) {
    const variantOutputPath = toVariantFilePath(outputFile, variant.suffix);
    const variantBytes = await optimizeImage(sourceFile, variantOutputPath, {
      maxWidth: variant.maxWidth,
      maxHeight: variant.maxHeight,
      quality,
    });
    outputBytes += variantBytes;
  }

  const defaultVariant = variants[variants.length - 1];
  const defaultVariantPath = toVariantFilePath(outputFile, defaultVariant.suffix);
  await fs.copyFile(defaultVariantPath, outputFile);
  const baseStat = await fs.stat(outputFile);
  outputBytes += baseStat.size;

  return outputBytes;
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

    const sourceStat = await fs.stat(sourceFile);
    sourceTotal += sourceStat.size;

    const bytes = await optimizeVariants(
      sourceFile,
      outputFile,
      job.variants,
      job.quality,
    );
    outputTotal += bytes;
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
    const sourceStat = await fs.stat(job.sourceFile);
    sourceTotal += sourceStat.size;

    const variants = [
      {
        suffix: "768",
        maxWidth: 768,
        maxHeight: Math.min(job.maxHeight, 1280),
      },
      {
        suffix: "1280",
        maxWidth: 1280,
        maxHeight: job.maxHeight,
      },
      {
        suffix: "1600",
        maxWidth: job.maxWidth,
        maxHeight: job.maxHeight,
      },
    ];

    const bytes = await optimizeVariants(
      job.sourceFile,
      job.outputFile,
      variants,
      job.quality,
    );
    outputTotal += bytes;
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
    totalSource > 0
      ? ((1 - totalOutput / totalSource) * 100).toFixed(1)
      : "0.0";

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
