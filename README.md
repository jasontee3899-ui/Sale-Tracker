# Threemiles Sales Tracker — PWA + Central Shared Data

Installable web app (PWA) for GitHub Pages. By default each browser keeps its OWN
copy of the data. To make ALL users share ONE central, always-latest dataset,
connect ONE of the options below. Pick whichever you prefer.

## A) Deploy the app on GitHub Pages
1. Create a public repo, upload all files to the root, commit.
2. Settings -> Pages -> Source: Deploy from a branch -> Branch: main -> Folder: / (root) -> Save.
3. Live at https://<username>.github.io/<repo>/ after ~1 minute.

Files to upload: index.html, manifest.webmanifest, sw.js,
icon-192.png, icon-512.png, icon-512-maskable.png
(GoogleDrive-AppsScript.gs is only for setup — it does NOT need to be uploaded.)

---

## Option 1 — GOOGLE DRIVE (keeps the data as a file in your Drive)
No database signup; uses a small Google Apps Script tied to your Google account.

1. Open **GoogleDrive-AppsScript.gs** (included) and follow the steps at the top:
   - script.google.com -> New project -> paste the file -> Save.
   - Deploy -> New deployment -> Web app -> Execute as **Me**, Access **Anyone** -> Deploy.
   - Authorize (allow Drive access) and copy the **Web app URL** (ends with `/exec`).
2. In `index.html`, near the top of the script, set:

   ```js
   const GAS={ url:'https://script.google.com/macros/s/xxxxx/exec' };
   ```

3. Commit `index.html` to GitHub. Reopen the app — the login page should show
   **"Central sync is ON (Google Drive)"**.
4. The data appears in your Google Drive in a folder **"Threemiles Tracker Data"**.
   You can share that folder with your team in Drive if you want them to see the raw files.

Notes: the app talks to Google through the script, so everyone shares one dataset
without each person signing into Google. If a browser ever blocks the request
(CORS), use Option 2 instead.

---

## Option 2 — SUPABASE (free database)
1. supabase.com -> New project.
2. SQL Editor -> run:

   ```sql
   create table if not exists kv (
     key text primary key, value text, updated_at timestamptz default now()
   );
   alter table kv enable row level security;
   create policy "app access" on kv for all to anon using (true) with check (true);
   ```

3. Project Settings -> API: copy Project URL and anon public key.
4. In `index.html`:

   ```js
   const CLOUD={ url:'https://xxxx.supabase.co', anonKey:'eyJ...anon-key...' };
   ```

5. Commit to GitHub. Login page shows **"Central sync is ON (Supabase)"**.

(If both options are filled in, Google Drive is used.)

---

## How central sync behaves
- The whole tracker is stored as one record/file centrally.
- On login the app pulls the latest central data first; on edit/logout it writes back.
- The single-session lock now works across devices: while one person is in, others
  wait until that person logs out, so edits never collide.

## Updating the app later
Replace index.html, bump the cache name in sw.js (e.g. v5 -> v6), commit.

## Login
- Default password 33633 (changeable on the login page with the authorized password).
- Pick your name (Jason / Belle / Treece / Admin) for the access log.

## Security note
Both options put an access URL/key in the page, so anyone with the app URL could
reach the data store. That's acceptable for a small trusted team behind the app
password, but it is not strong security. Keep backups via Save as PDF / Download Excel.
