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

function startServerWithFallback(server, startPort, maxTries, onListeningLog) {
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

      if (typeof onListeningLog === "function") {
        onListeningLog(activePort);
      }
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(currentPort);
  };

  tryListen();
}

module.exports = {
  readBody,
  sendJson,
  startServerWithFallback,
};
