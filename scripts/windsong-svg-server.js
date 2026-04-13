const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  readBody,
  sendJson,
  startServerWithFallback,
} = require("./utils/server-utils");
const { normalizeQrRequest, generateQrPayload } = require("./utils/qr-utils");
const {
  createWindSongSvg,
  filenameFromText,
} = require("./export-cover-names-to-svg");

const START_PORT = Number(process.env.WINDSONG_SVG_PORT || 8787);
const MAX_PORT_TRIES = Number(process.env.WINDSONG_SVG_MAX_PORT_TRIES || 25);
const PAGE_PATH = path.join(__dirname, "..", "windsong-svg-tool.html");
const QR_PAGE_PATH = path.join(__dirname, "..", "qr-generator-tool.html");

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Missing URL" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(PAGE_PATH, "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (req.method === "GET" && req.url === "/qr") {
    const html = fs.readFileSync(QR_PAGE_PATH, "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (req.method === "POST" && req.url === "/api/windsong-svg") {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw || "{}");

      const text = String(data.text || "").trim();
      if (!text) {
        sendJson(res, 400, { error: "Text is required" });
        return;
      }

      const fontSize = Number(data.fontSize || 200);
      const fill =
        typeof data.fill === "string" && data.fill.trim()
          ? data.fill.trim()
          : "#ffffff";
      const requestedFilename =
        typeof data.filename === "string" ? data.filename.trim() : "";
      const safeFilename = requestedFilename.endsWith(".svg")
        ? requestedFilename
        : requestedFilename
          ? `${requestedFilename}.svg`
          : filenameFromText(text);

      const svg = await createWindSongSvg(text, { fontSize, fill });

      res.writeHead(200, {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Access-Control-Allow-Origin": "*",
      });
      res.end(svg);
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Failed to generate SVG" });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/qr") {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw || "{}");

      const { link, format, options } = normalizeQrRequest(data);
      if (!link) {
        sendJson(res, 400, { error: "Link is required" });
        return;
      }

      const qrPayload = await generateQrPayload(link, format, options);
      res.writeHead(200, {
        "Content-Type": qrPayload.mimeType,
        "Access-Control-Allow-Origin": "*",
      });
      res.end(qrPayload.data);
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Failed to generate QR" });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

startServerWithFallback(server, START_PORT, MAX_PORT_TRIES, (activePort) => {
  console.log(`WindSong SVG server running at http://localhost:${activePort}`);
});
