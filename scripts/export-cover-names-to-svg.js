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

function fetchUrl(url, userAgent) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: userAgent ? { "User-Agent": userAgent } : {} },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
  });
}

function extractFontUrlFromCss(cssBuffer) {
  const css = cssBuffer.toString("utf8");
  const match = css.match(/url\s*\(\s*([^)]+)\s*\)/);
  if (!match) throw new Error("No font url found in Google Fonts CSS");
  return match[1].trim();
}

function loadFontFromUrl(url) {
  return fetchUrl(url).then((buffer) => {
    // opentype.js expects an ArrayBuffer; Buffer.buffer may include extra bytes.
    const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    return opentype.parse(ab);
  });
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
  const { d, x1, y1, y2, width, height } = pathInfo;
  const { viewW, viewH, pad, maxW, maxH } = canvas;

  // opentype.js coordinates are y-up; SVG is y-down.
  // Use a canonical transform that:
  // - flips y with scale(1,-1)
  // - translates the path so its bbox sits inside a (0..viewW, 0..viewH) viewBox
  // - centers the text on an equal-size canvas (same viewBox for both outputs)
  //
  // After scale(1,-1), bbox y-range becomes [-y2, -y1].
  // To place the *top* at pad (y=pad), translate by (pad + y2).
  // For x, place left at pad: translate by (pad - x1).
  //
  // Centering adjustment:
  // - x: add half of remaining space (maxW - width)/2
  // - y: add half of remaining space (maxH - height)/2
  const dx = (maxW - width) / 2;
  const dy = (maxH - height) / 2;
  const tx = pad + dx - x1;
  const ty = pad + dy + y2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" width="${viewW}" height="${viewH}">
  <g transform="translate(${tx}, ${ty}) scale(1, -1)">
    <path fill="${fill}" d="${d}"/>
  </g>
</svg>
`;
}

async function main() {
  const outDir = path.join(__dirname, "..", "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const cssBuffer = await fetchUrl(GOOGLE_FONTS_CSS_URL, IE9_USER_AGENT);
  const fontUrl = extractFontUrlFromCss(cssBuffer);
  const font = await loadFontFromUrl(fontUrl);

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
