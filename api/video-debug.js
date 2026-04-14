/**
 * Vercel Serverless endpoint for cover video telemetry.
 *
 * Usage: POST /api/video-debug
 * Body: JSON payload from the browser (see main.js createCoverVideoDebugLogger)
 */

function toSafeString(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

function normalizePayload(raw) {
  if (!raw || typeof raw !== "object") return {};

  var normalized = {
    event: toSafeString(raw.event, 64),
    timestamp: toSafeString(raw.timestamp, 64),
    sessionId: toSafeString(raw.sessionId, 64),
    href: toSafeString(raw.href, 512),
    userAgent: toSafeString(raw.userAgent, 512),
    platform: toSafeString(raw.platform, 128),
    language: toSafeString(raw.language, 32),
    online: !!raw.online,
    viewport: raw.viewport || null,
    dpr: typeof raw.dpr === "number" ? raw.dpr : null,
    visibilityState: toSafeString(raw.visibilityState, 32),
    connection: raw.connection || null,
    detail: raw.detail || null,
  };

  return normalized;
}

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  var body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      body = {};
    }
  }

  var payload = normalizePayload(body);
  var meta = {
    vercelRegion: req.headers["x-vercel-id"] || "",
    ipCountry: req.headers["x-vercel-ip-country"] || "",
    ipCity: req.headers["x-vercel-ip-city"] || "",
    ipCountryRegion: req.headers["x-vercel-ip-country-region"] || "",
  };

  // This line is the main debugging output you'll inspect in Vercel logs.
  console.log("[cover-video-debug]", JSON.stringify({ payload: payload, meta: meta }));

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
};
