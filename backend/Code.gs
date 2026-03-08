/**
 * Google Apps Script — Wedding Card Backend
 *
 * This script turns a Google Sheet into a simple API for storing
 * wedding wishes and RSVP responses.
 *
 * ===================== SETUP INSTRUCTIONS =====================
 *
 * 1. Create a new Google Sheet:
 *    - Go to https://sheets.new
 *    - Rename the first sheet tab (bottom) to: Wishes
 *    - Add headers in row 1:  Timestamp | Author Name | Message
 *    - Create a second sheet tab and name it: RSVP
 *    - Add headers in row 1:  Timestamp | Guest Name | Attendance
 *
 * 2. Copy the Sheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/  <<SHEET_ID>>  /edit
 *    Paste it into the SHEET_ID constant below.
 *
 * 3. Open Apps Script:
 *    - In your Google Sheet, go to Extensions > Apps Script
 *    - Delete any existing code in Code.gs
 *    - Paste this entire file
 *    - Save (Ctrl+S)
 *
 * 4. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Click the gear icon, select "Web app"
 *    - Set "Execute as": Me
 *    - Set "Who has access": Anyone
 *    - Click "Deploy"
 *    - Authorize the app when prompted
 *    - Copy the Web App URL (looks like:
 *      https://script.google.com/macros/s/XXXXXXXXX/exec )
 *
 * 5. Paste that URL into your config.js:
 *    api: {
 *      baseUrl: "https://script.google.com/macros/s/XXXXXXXXX/exec",
 *    }
 *
 * ===================== UPDATING =====================
 *
 * If you edit this script after deploying, you must create a
 * NEW deployment version for changes to take effect:
 *    Deploy > Manage deployments > Edit (pencil icon) >
 *    Version: "New version" > Deploy
 *
 * ==============================================================
 */

// ── Replace with YOUR Google Sheet ID ──
var SHEET_ID = "1tk2JSOc33m5gCNfekp57984CJvpfYurD2vEqcQxv9rI";

// ── Sheet tab names (must match exactly) ──
var WISHES_SHEET = "Wishes";
var RSVP_SHEET   = "RSVP";

// ─────────────────────────────────────────────────────────────
// GET handler — returns all wishes as JSON
// Called via:  GET <webAppUrl>?action=getWishes
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "";

    if (action === "getWishes") {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(WISHES_SHEET);
      var rows  = sheet.getDataRange().getValues();

      // Skip header row (index 0)
      var wishes = [];
      for (var i = rows.length - 1; i >= 1; i--) {
        wishes.push({
          author_name: rows[i][1],
          content:     rows[i][2],
        });
      }

      return jsonResponse({ status: "ok", data: wishes });
    }

    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ─────────────────────────────────────────────────────────────
// POST handler — saves a wish or RSVP to the sheet
// Body must be JSON with an "action" field: "wish" or "rsvp"
// RSVP payload fields: guest_name, attendance
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var now  = new Date();

    if (body.action === "wish") {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(WISHES_SHEET);
      sheet.appendRow([
        now,
        body.author_name || "",
        body.content     || "",
      ]);
      return jsonResponse({ status: "ok" });
    }

    if (body.action === "rsvp") {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(RSVP_SHEET);
      sheet.appendRow([
        now,
        body.guest_name  || "",
        body.attendance  || "",
      ]);
      return jsonResponse({ status: "ok" });
    }

    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ─────────────────────────────────────────────────────────────
// Helper — build a JSON response with proper MIME type
// ─────────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
