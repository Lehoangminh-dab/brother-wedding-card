const http = require("http");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

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
  });
  res.end(JSON.stringify(payload));
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
        const link = String(data.link || "").trim();
        const format =
          String(data.format || "png").toLowerCase() === "svg" ? "svg" : "png";
        const size = Number(data.size || 512);
        const margin = Number(data.margin || 2);
        const dark = String(data.dark || "#000000").trim() || "#000000";
        const light = String(data.light || "#ffffff").trim() || "#ffffff";

        if (!link) {
          sendJson(res, 400, { error: "Link is required" });
          return;
        }

        const options = {
          width: Number.isFinite(size) && size > 0 ? Math.floor(size) : 512,
          margin:
            Number.isFinite(margin) && margin >= 0 ? Math.floor(margin) : 2,
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

function startWithFallback(startPort, maxTries) {
  let port = startPort;
  let tries = 0;

  const tryListen = () => {
    const onError = (error) => {
      server.off("listening", onListening);

      if (error.code === "EADDRINUSE" && tries < maxTries) {
        tries += 1;
        port += 1;
        console.warn(`Port ${port - 1} is busy, trying ${port}...`);
        tryListen();
        return;
      }

      console.error(error);
      process.exit(1);
    };

    const onListening = () => {
      server.off("error", onError);
      const addr = server.address();
      const activePort = addr && typeof addr === "object" ? addr.port : port;
      console.log(
        `QR tool server running at http://localhost:${activePort}/qr`,
      );
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port);
  };

  tryListen();
}

startWithFallback(START_PORT, MAX_PORT_TRIES);
