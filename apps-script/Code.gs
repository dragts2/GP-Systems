/**
 * GP Systems: Founding Partner Program applications
 *
 * Receives applications from the website form, adds each one as a row in
 * this Google Sheet, and emails an alert. Paste this whole file into
 * Extensions > Apps Script of the applications sheet, then deploy it as a
 * web app (Execute as: Me, Who has access: Anyone).
 */

// Where alert emails go. Leave empty ('') to turn alerts off.
const NOTIFY_EMAIL = 'GP_Systems@outlook.com';

// Name of the tab that holds the applications.
const SHEET_NAME = 'Applications';

// Form fields, in column order, with their column titles.
const FIELDS = [
  ['business', 'Business'],
  ['contact_name', 'Contact name'],
  ['role', 'Role'],
  ['phone', 'Phone (WhatsApp)'],
  ['venue_type', 'Venue type'],
  ['governorate', 'Governorate'],
  ['area', 'Town or area'],
  ['current_system', 'Current system']
];

// Extra columns for your own follow-up, filled in by you, not the form.
const TRACKING_COLUMNS = ['Status', 'Notes'];

/** Handles each application sent from the website. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = (e && e.parameter) || {};

    // Spam trap: bots fill this hidden field, real people never see it.
    if (p._gotcha) return json_({ result: 'success' });

    if (!clean_(p.business) || !clean_(p.phone)) {
      return json_({ result: 'error', error: 'Missing business name or phone' });
    }

    const sheet = getSheet_();
    const row = [new Date()]
      .concat(FIELDS.map(function (f) { return clean_(p[f[0]]); }))
      .concat(['New', '']);
    sheet.appendRow(row);

    notify_(p);
    return json_({ result: 'success' });
  } catch (err) {
    console.error(err);
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the web app URL in a browser shows this, to confirm it is live. */
function doGet() {
  return ContentService.createTextOutput('GP Systems application endpoint is running.');
}

/**
 * Run this once from the editor (select testSetup, press Run) to create the
 * Applications tab, grant permissions, and send yourself a test alert.
 */
function testSetup() {
  getSheet_();
  notify_({
    business: 'Test Venue',
    contact_name: 'Test Person',
    role: 'Owner',
    phone: '+961 70 000 000',
    venue_type: 'Restaurant',
    governorate: 'Beirut',
    area: 'Test area',
    current_system: 'No system'
  });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    const headers = ['Submitted at']
      .concat(FIELDS.map(function (f) { return f[1]; }))
      .concat(TRACKING_COLUMNS);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#2f3819')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.setColumnWidths(1, headers.length, 160);
  }
  return sheet;
}

function notify_(p) {
  if (!NOTIFY_EMAIL) return;
  try {
    const lines = FIELDS.map(function (f) { return f[1] + ': ' + text_(p[f[0]]); });
    lines.push('', 'Open the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New Founding Partner application: ' + text_(p.business),
      body: lines.join('\n')
    });
  } catch (err) {
    // An email failure should never lose the application itself.
    console.error('Alert email failed: ' + err);
  }
}

/**
 * Trims and shortens text, and stops anything starting with = + - @ from
 * being read by Sheets as a formula (it is stored as plain text instead).
 */
function clean_(value) {
  const text = text_(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** Trims and shortens text, for the alert email. */
function text_(value) {
  return String(value == null ? '' : value).trim().slice(0, 200);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
