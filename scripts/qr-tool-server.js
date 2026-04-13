const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  readBody,
  sendJson,
  startServerWithFallback,
} = require("./utils/server-utils");
const { normalizeQrRequest, generateQrPayload } = require("./utils/qr-utils");

const START_PORT = Number(process.env.QR_TOOL_PORT || 8790);
const MAX_PORT_TRIES = Number(process.env.QR_TOOL_MAX_PORT_TRIES || 25);

const ROOT_DIR = path.join(__dirname, "..");
const QR_PAGE_PATH = path.join(ROOT_DIR, "qr-generator-tool.html");
function sendFile(res, filePath, contentType) {
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer((req, res) => {
  const url = req.url || "/";

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && (url === "/" || url === "/qr")) {
    sendFile(res, QR_PAGE_PATH, "text/html; charset=utf-8");
    return;
  }

  if (req.method === "POST" && url === "/api/qr") {
    readBody(req)
      .then(async (raw) => {
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
      })
      .catch((error) => {
        sendJson(res, 500, { error: error.message || "Failed to generate QR" });
      });
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

startServerWithFallback(server, START_PORT, MAX_PORT_TRIES, (activePort) => {
  console.log(`QR tool server running at http://localhost:${activePort}/qr`);
});
