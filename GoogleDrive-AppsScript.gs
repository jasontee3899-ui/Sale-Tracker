/**
 * Threemiles Sales Tracker — Google Drive backend (Google Apps Script Web App).
 * Stores the whole tracker as JSON files in the Drive of whoever deploys this.
 *
 * SETUP
 * 1. Go to https://script.google.com  ->  New project.
 * 2. Delete any sample code, paste ALL of this file, and Save.
 * 3. Click Deploy -> New deployment -> type "Web app".
 *      - Description: threemiles
 *      - Execute as:  Me
 *      - Who has access: Anyone
 *    Click Deploy, authorize when prompted (allow Drive access).
 * 4. Copy the "Web app URL" (ends with /exec).
 * 5. In index.html, set:   const GAS={ url:'PASTE_THE_/exec_URL_HERE' };
 * 6. Commit index.html to GitHub. The app's login page should show
 *    "Central sync is ON (Google Drive)".
 *
 * The data files (threemiles_threemiles_data.json etc.) will appear in your
 * Google Drive (My Drive). You can move them into a shared folder if you like;
 * the app reaches them through this script regardless of location.
 */

var FOLDER_NAME = 'Threemiles Tracker Data'; // files are kept in this Drive folder

function getFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function fileFor_(key) {
  var name = 'threemiles_' + String(key).replace(/[^a-zA-Z0-9]/g, '_') + '.json';
  var folder = getFolder_();
  var it = folder.getFilesByName(name);
  if (it.hasNext()) return it.next();
  return folder.createFile(name, '', 'application/json');
}

function readVal_(key) {
  var f = fileFor_(key);
  var s = f.getBlob().getDataAsString();
  return (s && s.length) ? s : null;
}

function writeVal_(key, value) {
  var f = fileFor_(key);
  f.setContent(value == null ? '' : String(value));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var key = (e && e.parameter && e.parameter.key) ? e.parameter.key : '';
    return json_({ value: readVal_(key) });
  } catch (err) {
    return json_({ value: null, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    writeVal_(body.key, body.value);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
