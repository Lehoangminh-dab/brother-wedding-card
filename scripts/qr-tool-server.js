const http = require("http");
const fs = require("fs");
const path = require("path");

const START_PORT = Number(process.env.QR_TOOL_PORT || 8790);
const MAX_PORT_TRIES = Number(process.env.QR_TOOL_MAX_PORT_TRIES || 25);

const ROOT_DIR = path.join(__dirname, "..");
const QR_PAGE_PATH = path.join(ROOT_DIR, "qr-generator-tool.html");
const QR_LIB_PATH = path.join(
  ROOT_DIR,
  "node_modules",
  "qrcode",
  "build",
  "qrcode.min.js",
);

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

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  if (url === "/" || url === "/qr") {
    sendFile(res, QR_PAGE_PATH, "text/html; charset=utf-8");
    return;
  }

  if (url === "/qrcode.min.js") {
    sendFile(res, QR_LIB_PATH, "application/javascript; charset=utf-8");
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
      console.log(`QR tool server running at http://localhost:${activePort}/qr`);
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port);
  };

  tryListen();
}

startWithFallback(START_PORT, MAX_PORT_TRIES);
