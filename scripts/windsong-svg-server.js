const http = require("http");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const {
  createWindSongSvg,
  filenameFromText,
} = require("./export-cover-names-to-svg");

const START_PORT = Number(process.env.WINDSONG_SVG_PORT || 8787);
const MAX_PORT_TRIES = Number(process.env.WINDSONG_SVG_MAX_PORT_TRIES || 25);
const PAGE_PATH = path.join(__dirname, "..", "windsong-svg-tool.html");
const QR_PAGE_PATH = path.join(__dirname, "..", "qr-generator-tool.html");

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

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

      const link = String(data.link || "").trim();
      if (!link) {
        sendJson(res, 400, { error: "Link is required" });
        return;
      }

      const format =
        String(data.format || "png").toLowerCase() === "svg" ? "svg" : "png";
      const size = Number(data.size || 512);
      const margin = Number(data.margin || 2);
      const dark = String(data.dark || "#000000").trim() || "#000000";
      const light = String(data.light || "#ffffff").trim() || "#ffffff";

      const options = {
        width: Number.isFinite(size) && size > 0 ? Math.floor(size) : 512,
        margin: Number.isFinite(margin) && margin >= 0 ? Math.floor(margin) : 2,
        color: { dark, light },
      };

      if (format === "svg") {
        const svg = await QRCode.toString(link, { ...options, type: "svg" });
        res.writeHead(200, {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(svg);
        return;
      }

      const pngBuffer = await QRCode.toBuffer(link, options);
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(pngBuffer);
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Failed to generate QR" });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

function startServerWithFallback(startPort, maxTries) {
  let currentPort = startPort;
  let tries = 0;

  const tryListen = () => {
    const onError = (error) => {
      server.off("listening", onListening);

      if (error.code === "EADDRINUSE" && tries < maxTries) {
        tries += 1;
        currentPort += 1;
        console.warn(
          `Port ${currentPort - 1} is busy, trying ${currentPort}...`,
        );
        tryListen();
        return;
      }

      console.error(error);
      process.exit(1);
    };

    const onListening = () => {
      server.off("error", onError);
      const address = server.address();
      const activePort =
        address && typeof address === "object" ? address.port : currentPort;
      console.log(
        `WindSong SVG server running at http://localhost:${activePort}`,
      );
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(currentPort);
  };

  tryListen();
}

startServerWithFallback(START_PORT, MAX_PORT_TRIES);
