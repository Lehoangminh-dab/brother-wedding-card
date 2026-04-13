const QRCode = require("qrcode");

function normalizeQrRequest(data) {
  const link = String(data.link || "").trim();
  const format =
    String(data.format || "png").toLowerCase() === "svg" ? "svg" : "png";
  const size = Number(data.size || 512);
  const margin = Number(data.margin || 2);
  const dark = String(data.dark || "#000000").trim() || "#000000";
  const light = String(data.light || "#ffffff").trim() || "#ffffff";

  return {
    link,
    format,
    options: {
      width: Number.isFinite(size) && size > 0 ? Math.floor(size) : 512,
      margin: Number.isFinite(margin) && margin >= 0 ? Math.floor(margin) : 2,
      color: { dark, light },
    },
  };
}

async function generateQrPayload(link, format, options) {
  if (format === "svg") {
    const svg = await QRCode.toString(link, { ...options, type: "svg" });
    return {
      mimeType: "image/svg+xml; charset=utf-8",
      data: svg,
    };
  }

  const pngBuffer = await QRCode.toBuffer(link, options);
  return {
    mimeType: "image/png",
    data: pngBuffer,
  };
}

module.exports = {
  normalizeQrRequest,
  generateQrPayload,
};
