# Follow Church – Sunday Morning Songs: handoff

Song usage infographic and online dashboard built from a Planning Center Services song usage export. Built in Claude (Cowork) on Oct 30, 2026.

## Where things live

- **Online dashboard (the live version):** https://claude.ai/artifact/PWaBfHf867v9kxXxYKxG3J
  It's a claude.ai Dashboard artifact. Its page and data are stored in the artifact itself, not in this folder. Edit it by asking Claude to change it. `dashboard/index.html` is a copy of the page for reference only, and it won't run on its own: it relies on the dashboard's `dash` runtime (`dash.calc`, `dash.draw`, `dash.data`, `dash.params`) and d3.
- **Printable infographic:** `infographic/` (one 8.5 x 11 page; the PDF is the print version, the HTML is its source).
- **Data:** `data/`
  - `Sunday_Morning_Service_Songs (original export).csv`: the export as it came from Planning Center (one row per song, a ✓ column per service date).
  - `song-uses-by-service.csv`: the same data reshaped to one row per song per service (`date, song, new, row`), with years added. This is the file the dashboard uses.
- **Scripts:** `scripts/`
  - `build.py <export.csv>`: checks counts, applies the cleanup rules, writes `songs.json`.
  - `render.py`: builds the infographic HTML from `songs.json`.
  - `shot.js`: renders the HTML to PDF with Playwright and flags any song name that overlaps its dots.

## Rules from Brendan

- Title: "Follow Church - Sunday Morning Songs". White background, one printable 8.5 x 11 page, no text smaller than about 9pt.
- Infographic: show no dates, only how often each song was used. (The dashboard has a date range filter at Brendan's request, so its data file now includes dates.)
- One dot per service a song was used.
- Stats row: number of different songs, total song slots, new songs, % of songs sung only once.
- Banner: "Most-sung song", or "Most-sung songs (tie)" when two songs tie.
- Groups: Core Rotation (6+), Regulars (4–5), Occasional (2–3), Sung Once (1). For small exports (about 12 services or fewer), use "Repeated" and "Sung once".
- Mark new songs with a NEW tag. In the sung-once list, new songs are bold.
- Leave out Christmas songs (carols, Advent songs, Christmas mashups). Keep songs that only share a word with a Christmas song.
- Combine songs that appear on two rows, and report it.
- Check every count against the export's "total" column before building.
- Shorten titles that are too long (drop "(feat. …)", "[Live]", artist names), and report which.
- Say how many services the report covers (e.g. "75 Sundays plus Christmas Eve").

## Decisions made on this export (Jun 2025 – Dec 2026)

- **Counts:** all 77 rows matched their "total" column. 291 uses before cleanup.
- **Services:** 86 date columns (83 Sundays, Christmas Eve 2025, Christmas Eve 2026, Good Friday 2026). 76 had songs: 75 Sundays (through Nov 1, 2026) plus Christmas Eve 2025.
- **Years:** the export only has month and day. Jun 1–Dec 28 is 2025, and Jan 4 on is 2026. The dates all land on Sundays apart from the three special services.
- **Left out as Christmas songs:** Angels (Glory To God); Joy To The World (Joyful Joyful).
- **Kept but worth a check:** King Of Kings (sung on Christmas Eve) and Messiah (sung Dec 21). Neither is clearly a carol.
- **Combined:** Great Are You Lord (1 + 1 = 2) and Trust In God (5 + 8 = 13). Each had one row marked new and one not, and they're treated as not new.
- **Shortened:** All The Time, By Faith, I Got Saved, Jesus Be The Name, Your Ways Better. In the infographic only, the Who Else / Jesus Be The Name / What A Beautiful Name mashup is shown as "Who Else medley". The dashboard keeps its full name.
- **Result (all dates):** 73 songs, 288 song slots, 34 new songs, 32% sung once. Most-sung song: Abide (16).

## Possible next step

Planning Center is connected as a connector (Services: songs, plans, plan items). The dashboard could read song usage straight from Planning Center instead of the attached CSV, so it stays current. Each viewer would then need their own Planning Center access.

## Public page with full song details (added Oct 30, 2026)

- **Public page:** `public/index.html` is a standalone copy of the dashboard (no claude.ai runtime needed), published privately at https://claude.ai/artifact/YSqbo2zeZNuKASHSSU4Mch. To make it truly public, drag the `public` folder onto https://app.netlify.com/drop.
- **Data:** `data/pco/` holds a read-only pull from Planning Center: `uses-*.json` (every song item in the 77 Sunday Morning Service plans, Jun 1, 2025 – Nov 1, 2026, with key, length, BPM, time signature, arrangement and place in the set), `songs.json` (all 218 library songs: author, CCLI, themes, date added) and `plans.json` (dates, series, titles).
- **Checked:** 291 unique song-per-service uses on 76 dates and 77 songs, the same as the export on every date. A song sung twice in one service counts once. NEW flags still come from the export (`data/song-uses-by-service.csv`).
- **All songs table:** sortable by times used, first/last used, weeks since last used, key, BPM, time, length, average place in the set, times used as the opener, author, CCLI number, themes and date added. Search, key/theme/group/new filters, CSV download.
- **Blank cells are blank in Planning Center:** BPM is missing for 101 uses (default arrangements) and length for 22.
- **Rebuild:** `osascript -l JavaScript scripts/build_public.jxa.js "$PWD"` from the project folder, then republish/re-upload `public/`.

## Full history back to 2014 (added Oct 30, 2026)

- **Coverage:** every Sunday Morning Service plan from Sep 14, 2014 to Nov 1, 2026: 600 Sundays plus 8 Christmas Eve services (608 with linked songs), 2,257 song uses, 186 songs. Older plans are in `data/pco/old/` (`plans-old.json` lists all 720 older plans; `plans-old-kept.json` the 556 pulled; `batches/` the split used for pulling).
- **Left out:** about 165 mid-week plans (mostly unnamed Wed/Fri rehearsal plans, 2014–2018). Songs typed into plans as plain text, not linked to the library, can't be counted. This mostly affects 2014–2016 (1.4–2.7 linked songs per service against about 4 later). 24 kept plans had no linked songs.
- **Checked:** no batch mixing, dates match the plan list, every song id is in the library, no duplicate rows. The Jun 2025 – Nov 2026 window still gives 73 songs, 288 slots, 32% sung once, Abide (16).
- **Christmas songs:** the list in `public/template.html` (`CHRISTMAS`) now has 25 carols, Christmas mashups and Christmas-album songs. Kept: Agnus Dei, Hosanna (Praise Is Rising), Jesus Messiah, What Mercy Did For Me, King Of Kings, Messiah.
- **NEW:** now worked out from the history (first sung within the chosen range), no longer from the export. It matched the export except How Great Is Our God (sung since 2014) and By Faith (older record from Feb 2025). NEW is left out for ranges starting in the first year of records (before Sep 14, 2015).
- **Groups:** 6+/4–5/2–3 apply up to 76 services; longer ranges raise the cutoffs in proportion (e.g. last 5 years: 20+, 14–19, 2–13).
- **Combined:** Trust In God, Great Are You Lord, Thank You Jesus For The Blood, How Great Is Our God and Forever each have two library records. "No One" (2023–2025) is the library record "Yahweh". Key changes like "D-E" are filed under the starting key.

## Weekly automatic update on GitHub (added Oct 30, 2026)

Every Monday at 12:00 UTC, `.github/workflows/update-songs.yml` pulls new Sunday Morning services and the song library from Planning Center, rebuilds `public/index.html`, commits the new data to the repo and publishes `public/` to GitHub Pages. It can also be run any time from the repo's **Actions** tab → **Update song dashboard** → **Run workflow**.

- **Scripts:** `scripts/update-from-pco.mjs` (read-only Planning Center pull; writes `data/pco/uses-auto.json` and `data/pco/songs.json`), `scripts/build.mjs` (Node build for GitHub), `scripts/build_public.jxa.js` (Mac build). Both builds share `scripts/build-core.js`.
- **What each run pulls:** services from the last 8 weeks (or since the newest saved service, if that's earlier), held on or before the run date. Services in `uses-auto.json` replace older copies of the same date, so edits made to a plan after the fact get picked up.
- **Same rules as before:** Sundays, Christmas Eve and Good Friday only; Christmas songs, combined songs and NEW come from `public/template.html`. New carols must be added to the `CHRISTMAS` list there.
- **Secrets:** `PCO_APP_ID` and `PCO_SECRET` (a Planning Center Personal Access Token) in **Settings → Secrets and variables → Actions**. If the token is revoked, the run fails and nothing changes on the site.
- **Pages setting:** **Settings → Pages → Source: GitHub Actions** (not "Deploy from a branch").
- **Not tested against Planning Center yet:** the first run on GitHub is the real test. If it fails, the log in the Actions tab says why.
