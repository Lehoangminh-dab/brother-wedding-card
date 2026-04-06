/**
 * Export cover names as SVG path outlines (Canva-friendly, no font required).
 *
 * Notes:
 * - Uses WindSong weight 400 from Google Fonts (fetched programmatically).
 * - Generates tight, centered outlines on an equal-size canvas for both exports.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const opentype = require("opentype.js");

const GOOGLE_FONTS_CSS_URL =
  "https://fonts.googleapis.com/css2?family=WindSong:wght@400&display=swap";
const IE9_USER_AGENT =
  "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)";

// Requested: bigger than cover and equal-size outputs.
const FONT_SIZE_PX = Number(process.env.FONT_SIZE_PX || 200);
const NAMES = [
  { text: "Lê Hoàng Phúc", filename: "HoangPhuc.svg" },
  { text: "Nguyễn Thị Hồng Vân", filename: "HongVan.svg" },
];

let cachedFontPromise = null;

function fetchUrl(url, userAgent) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: userAgent ? { "User-Agent": userAgent } : {} },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      },
    );
    req.on("error", reject);
  });
}

function extractFontUrlFromCss(cssBuffer) {
  const css = cssBuffer.toString("utf8");
  const match = css.match(/url\s*\(\s*([^)]+)\s*\)/);
  if (!match) throw new Error("No font url found in Google Fonts CSS");
  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

function loadFontFromUrl(url) {
  return fetchUrl(url).then((buffer) => {
    // opentype.js expects an ArrayBuffer; Buffer.buffer may include extra bytes.
    const ab = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
    return opentype.parse(ab);
  });
}

function getWindSongFont() {
  if (!cachedFontPromise) {
    cachedFontPromise = fetchUrl(GOOGLE_FONTS_CSS_URL, IE9_USER_AGENT)
      .then(extractFontUrlFromCss)
      .then(loadFontFromUrl);
  }
  return cachedFontPromise;
}

function textToSvgPath(font, text, fontSize) {
  const path = font.getPath(text, 0, fontSize, fontSize);
  const svgPathD = path.toPathData(2);
  const bbox = path.getBoundingBox();
  const { x1, y1, x2, y2 } = bbox;
  const width = x2 - x1;
  const height = y2 - y1;
  if (width <= 0 || height <= 0) throw new Error("Empty path bounds");
  return {
    d: svgPathD,
    x1,
    y1,
    y2,
    width,
    height,
  };
}

function buildSvgEqualCanvas(pathInfo, canvas, fill = "#ffffff") {
  const { d, x1, y1, width, height } = pathInfo;
  const { viewW, viewH, pad, maxW, maxH } = canvas;

  // Center path bounds directly in SVG coordinates.
  // No y-axis flip is applied, so text orientation stays upright.
  const dx = (maxW - width) / 2;
  const dy = (maxH - height) / 2;
  const tx = pad + dx - x1;
  const ty = pad + dy - y1;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" width="${viewW}" height="${viewH}">
  <g transform="translate(${tx}, ${ty})">
    <path fill="${fill}" d="${d}"/>
  </g>
</svg>
`;
}

function filenameFromText(text) {
  const cleaned = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${cleaned || "windsong-text"}.svg`;
}

async function createWindSongSvg(text, options = {}) {
  const fontSize = Number(options.fontSize || FONT_SIZE_PX);
  const fill = options.fill || "#ffffff";
  const pad = Number(options.pad || 2);
  const font = options.font || (await getWindSongFont());

  const pathInfo = textToSvgPath(font, text, fontSize);
  const canvas = {
    pad,
    maxW: pathInfo.width,
    maxH: pathInfo.height,
    viewW: pathInfo.width + 2 * pad,
    viewH: pathInfo.height + 2 * pad,
  };

  return buildSvgEqualCanvas(pathInfo, canvas, fill);
}

function parseArgs(argv) {
  const args = {
    text: null,
    outDir: null,
    outFile: null,
    fontSize: null,
    fill: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if ((token === "--text" || token === "-t") && argv[i + 1]) {
      args.text = argv[i + 1];
      i += 1;
      continue;
    }
    if ((token === "--out" || token === "-o") && argv[i + 1]) {
      args.outFile = argv[i + 1];
      i += 1;
      continue;
    }
    if ((token === "--out-dir" || token === "-d") && argv[i + 1]) {
      args.outDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--font-size" && argv[i + 1]) {
      args.fontSize = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token === "--fill" && argv[i + 1]) {
      args.fill = argv[i + 1];
      i += 1;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args.outDir
    ? path.resolve(process.cwd(), args.outDir)
    : path.join(__dirname, "..", "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const font = await getWindSongFont();

  if (args.text) {
    const svg = await createWindSongSvg(args.text, {
      font,
      fontSize: args.fontSize || FONT_SIZE_PX,
      fill: args.fill || "#ffffff",
    });
    const outFile = args.outFile || filenameFromText(args.text);
    const outPath = path.join(outDir, outFile);
    fs.writeFileSync(outPath, svg, "utf8");
    console.log("Wrote %s", outPath);
    return;
  }

  const pad = 2;
  const paths = NAMES.map(({ text, filename }) => ({
    filename,
    text,
    pathInfo: textToSvgPath(font, text, FONT_SIZE_PX),
  }));

  const maxW = Math.max(...paths.map((p) => p.pathInfo.width));
  const maxH = Math.max(...paths.map((p) => p.pathInfo.height));
  const canvas = {
    pad,
    maxW,
    maxH,
    viewW: maxW + 2 * pad,
    viewH: maxH + 2 * pad,
  };

  for (const { filename, pathInfo } of paths) {
    const svg = buildSvgEqualCanvas(pathInfo, canvas);
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, svg, "utf8");
    console.log("Wrote %s", outPath);
  }
}

module.exports = {
  createWindSongSvg,
  filenameFromText,
  getWindSongFont,
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
