/**
 * Verify optimized image payload budgets.
 *
 * Run after optimize-images to ensure mobile payload targets remain healthy.
 */

const fs = require("fs/promises");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OPTIMIZED_DIR = path.join(ROOT_DIR, "assets", "images", "optimized");

const BUDGETS = {
  portraitMobileMb: 2.5,
  landscapeMobileMb: 1.2,
  sectionsMobileMb: 1.0,
  mobileTotalMb: 4.5,
};

const SECTION_MOBILE_SUFFIX = "-640.jpg";

function toMb(bytes) {
  return bytes / (1024 * 1024);
}

async function sumDirectoryBytes(dirPath, suffixFilter = "") {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  let totalBytes = 0;
  let fileCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nested = await sumDirectoryBytes(fullPath, suffixFilter);
      totalBytes += nested.totalBytes;
      fileCount += nested.fileCount;
      continue;
    }

    if (!entry.isFile()) continue;
    if (suffixFilter && !entry.name.endsWith(suffixFilter)) continue;

    const stat = await fs.stat(fullPath);
    totalBytes += stat.size;
    fileCount += 1;
  }

  return { totalBytes, fileCount };
}

function printBucket(label, bytes, fileCount, budgetMb) {
  const sizeMb = toMb(bytes);
  const ok = sizeMb <= budgetMb;
  console.log(
    "[verify-image-budget] %s: %d files | %s MB / %s MB %s",
    label,
    fileCount,
    sizeMb.toFixed(2),
    budgetMb.toFixed(2),
    ok ? "OK" : "OVER",
  );

  return ok;
}

async function main() {
  const portraitPath = path.join(OPTIMIZED_DIR, "gallery", "portrait");
  const landscapePath = path.join(OPTIMIZED_DIR, "gallery", "landscape");
  const sectionsPath = path.join(OPTIMIZED_DIR, "sections");

  const portrait = await sumDirectoryBytes(portraitPath, "-480.jpg");
  const landscape = await sumDirectoryBytes(landscapePath, "-640.jpg");
  const sections = await sumDirectoryBytes(
    sectionsPath,
    SECTION_MOBILE_SUFFIX,
  );

  const totalBytes =
    portrait.totalBytes + landscape.totalBytes + sections.totalBytes;

  const checks = [
    printBucket(
      "gallery portrait",
      portrait.totalBytes,
      portrait.fileCount,
      BUDGETS.portraitMobileMb,
    ),
    printBucket(
      "gallery landscape",
      landscape.totalBytes,
      landscape.fileCount,
      BUDGETS.landscapeMobileMb,
    ),
    printBucket(
      "section backgrounds",
      sections.totalBytes,
      sections.fileCount,
      BUDGETS.sectionsMobileMb,
    ),
    printBucket(
      "overall mobile tier",
      totalBytes,
      portrait.fileCount + landscape.fileCount + sections.fileCount,
      BUDGETS.mobileTotalMb,
    ),
  ];

  const fullPortrait = await sumDirectoryBytes(portraitPath);
  const fullLandscape = await sumDirectoryBytes(landscapePath);
  const fullSections = await sumDirectoryBytes(sectionsPath);
  const fullTotal =
    fullPortrait.totalBytes +
    fullLandscape.totalBytes +
    fullSections.totalBytes;
  console.log(
    "[verify-image-budget] info: full optimized set = %s MB (%d files)",
    toMb(fullTotal).toFixed(2),
    fullPortrait.fileCount + fullLandscape.fileCount + fullSections.fileCount,
  );

  if (checks.every(Boolean)) {
    console.log("[verify-image-budget] PASS");
    return;
  }

  console.error("[verify-image-budget] FAIL: one or more budgets exceeded");
  process.exit(1);
}

main().catch((error) => {
  console.error("[verify-image-budget] failed:\n", error);
  process.exit(1);
});
