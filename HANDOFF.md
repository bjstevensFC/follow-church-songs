# Follow Church – Sunday Morning Songs: handoff

A public dashboard of every song sung in Follow Church's Sunday Morning services since Sep 2014, built from Planning Center Services and updated automatically every Monday. Also a printable one-page infographic of Jun 2025 – Nov 2026. Built with Claude, Oct 30, 2026.

## Where things live

- **Live public dashboard:** https://bjstevensfc.github.io/follow-church-songs/
  Published by GitHub Pages from the repo https://github.com/bjstevensFC/follow-church-songs (the `public/` folder). Anyone with the link can view it.
- **The GitHub repo is the up-to-date copy.** The weekly job commits new data there. A local folder (like `Documents/Follow Church Song Dashboard`) falls behind after each Monday; before editing locally, download the repo (**Code → Download ZIP**).
- **Older copies, not updated automatically:**
  - https://claude.ai/artifact/YSqbo2zeZNuKASHSSU4Mch: a private claude.ai snapshot of the public page from Oct 30, 2026.
  - https://claude.ai/artifact/PWaBfHf867v9kxXxYKxG3J: the first claude.ai Dashboard artifact, built from the Jun 2025 – Dec 2026 export only. `dashboard/index.html` is a reference copy of its page; it only runs inside claude.ai.
  - `index.html` at the top of the repo: the first upload, no longer used (Pages publishes `public/` now). Safe to delete.
- **Printable infographic:** `infographic/` (one 8.5 x 11 page of Jun 2025 – Nov 2026; the PDF is the print version, the HTML its source).

## What the dashboard shows

- **Date filter:** From/To dates and presets (last 3, 6, 12 months, 2 years, 5 years, all dates). Opens on all dates. The chosen range is kept in the link (`#from=…&to=…`), so a filtered view can be shared.
- **Stats:** different songs, total song slots, new songs, % sung only once. Banner for the most-sung song (or a tie).
- **Groups:** Core rotation, Regulars, Occasional, Sung once, with one dot per service a song was used.
- **All songs table:** sortable by times used, first/last used, weeks since last used, key, BPM, time signature, length, average place in the set, times used as the opener, author, CCLI number, themes and date added to Planning Center. Search, key/theme/group/new filters, CSV download.

## Rules from Brendan

- Title: "Follow Church - Sunday Morning Songs".
- Infographic: white background, one printable 8.5 x 11 page, no text smaller than about 9pt, no dates (only how often each song was used).
- One dot per service a song was used.
- Stats row: number of different songs, total song slots, new songs, % of songs sung only once.
- Banner: "Most-sung song", or "Most-sung songs (tie)" when songs tie.
- Groups: Core Rotation (6+), Regulars (4–5), Occasional (2–3), Sung Once (1). For about 12 services or fewer, use "Repeated" and "Sung once". *Dashboard only:* for ranges longer than 76 services the cutoffs rise in proportion (e.g. last 5 years: 20+, 14–19, 2–13).
- Mark new songs with a NEW tag. In the sung-once list, new songs are bold.
- Leave out Christmas songs (carols, Advent songs, Christmas mashups). Keep songs that only share a word with a Christmas song.
- Combine songs that appear twice, and report it.
- Shorten titles that are too long (drop "(feat. …)", "[Live]", artist names), and report which.
- Say how many services the report covers (e.g. "75 Sundays plus Christmas Eve").
- Dashboard opens on all dates since 2014.

## The data

- **Source:** Planning Center Services, service type "Sunday Morning Service" (id 394647), read-only.
- **Counted:** Sundays, Christmas Eve and Good Friday. About 165 mid-week plans (mostly unnamed Wed/Fri rehearsal plans, 2014–2018) are left out.
- **Only songs linked to the Song Library count.** Songs typed into a plan as plain text can't be counted. This mostly affects 2014–2016 (1.4–2.7 linked songs per service against about 4 later), so those years undercount.
- **A song sung twice in one service counts once.**
- **Coverage on Oct 30, 2026:** Sep 14, 2014 – Nov 1, 2026: 600 Sundays plus 8 Christmas Eve services, 2,257 song uses, 186 songs (155 after leaving out Christmas songs). Most-sung overall: Glorious Day (56).
- **Blank cells are blank in Planning Center:** many older songs and default arrangements have no BPM, time signature or length.
- **Files in `data/pco/`:**
  - `uses-auto.json`: services pulled by the weekly job. These replace older copies of the same dates.
  - `uses-a.json` … `uses-d.json`: Jun 2025 – Nov 2026 (first pull).
  - `old/uses-*.json`: Sep 2014 – May 2025.
  - `songs.json`: song details (author, CCLI, themes, date added).
  - `plans.json`, `plans-old.json`, `plans-old-kept.json`, `batches/`: plan lists used for the pulls.
- **Original export:** `data/Sunday_Morning_Service_Songs (original export).csv` and `data/song-uses-by-service.csv` (Jun 2025 – Dec 2026). Used only for checking now; every date matched the Planning Center pull.

## Cleanup rules (in `public/template.html`)

- **Christmas songs (`CHRISTMAS` list, 25 songs):** carols, Christmas mashups and Christmas-album songs, e.g. Silent Night, O Holy Night, all three Joy To The World versions, Midnight Clear, let us adore, Mary Did You Know, He Shall Reign Forevermore, Noel/Jesus Paid It All. Kept on purpose: Agnus Dei, Hosanna (Praise Is Rising), Jesus Messiah, What Mercy Did For Me, King Of Kings, Messiah. **A new Christmas song is counted until it's added to this list.**
- **Combined:** songs with the same title are combined: Trust In God, Great Are You Lord, Thank You Jesus For The Blood, How Great Is Our God and Forever each have two library records. "No One" (2023–2025) is the library record "Yahweh".
- **Shortened (`SHORT` list):** All The Time, By Faith, I Got Saved, Jesus Be The Name, Your Ways Better. Shortening also combines By Faith's two records.
- **NEW:** a song is NEW if it was first sung within the chosen date range. Left out for ranges starting before Sep 14, 2015, because the first year of records is too sparse. (For Jun 2025 – Nov 2026 this matches the export's NEW flags except How Great Is Our God and By Faith, which were sung earlier under older records.)
- **Keys:** a key change like "D-E" is filed under its starting key.

## Weekly automatic update

Every **Monday at 12:00 UTC** (6–7 am Central), `.github/workflows/update-songs.yml`:
1. pulls services from the last 8 weeks (or since the newest saved service, if that's earlier), held on or before the run date;
2. rebuilds `public/index.html`;
3. commits the new data as "Song update YYYY-MM-DD" by `github-actions[bot]`;
4. publishes `public/` to GitHub Pages.

- **Run it any time:** repo → **Actions** → **Update song dashboard** → **Run workflow**.
- **Secrets:** `PCO_APP_ID` and `PCO_SECRET`, a Planning Center Personal Access Token, under **Settings → Secrets and variables → Actions**. If the token is revoked, runs fail and the site stays as it was. To replace it, create a new token at https://api.planningcenteronline.com/oauth/applications and update both secrets.
- **Song Library permission:** the token's Planning Center user can read plans but not the Song Library. The script takes song details from the services instead, and each run shows a harmless warning. New songs get no "Added to PCO" date until that user is given Song Library access; after that, runs refresh the whole library automatically.
- **Pages setting:** **Settings → Pages → Source: GitHub Actions**.
- **If a run fails:** open it and read **Annotations** on its summary page; the script writes its errors there in plain language.
- **First successful run:** Oct 30, 2026 (8 services, Sep 6 – Oct 25).

## Scripts

- `scripts/update-from-pco.mjs`: the Planning Center pull (GitHub, Node).
- `scripts/build.mjs`: builds `public/index.html` on GitHub (Node).
- `scripts/build_public.jxa.js`: builds `public/index.html` on a Mac with nothing to install:
  `osascript -l JavaScript scripts/build_public.jxa.js "$PWD"`
- `scripts/build-core.js`: the build logic both builds share.
- `public/template.html`: the page itself (layout, cleanup rules, table). The data is filled in by the build.
- `scripts/build.py`, `render.py`, `shot.js`: the infographic (Python and Playwright; not installed on the Mac this was built on).

## Making changes

- **Small changes** (add a Christmas song, change a label): edit `public/template.html` on GitHub (**pencil icon → Commit changes**). Committing a change to `public/template.html`, `scripts/` or `data/` rebuilds and republishes the site automatically, without a Planning Center pull.
- **Bigger changes:** download the repo, ask Claude to make the change, then upload the changed files to the same folders on GitHub.
- **Hidden folder:** `.github` doesn't show in Finder (press Cmd+Shift+. to show it). To change the workflow, edit it on GitHub directly.

## History: the original export (Jun 2025 – Dec 2026)

- All 77 rows matched their "total" column; 291 uses before cleanup.
- 86 date columns (83 Sundays, Christmas Eve 2025 and 2026, Good Friday 2026); 76 had songs: 75 Sundays (through Nov 1, 2026) plus Christmas Eve 2025. The export had only month and day: Jun 1 – Dec 28 is 2025, Jan 4 on is 2026.
- Result: 73 songs, 288 song slots, 34 new (export flags), 32% sung once. Most-sung: Abide (16). The dashboard gives the same for that range, except 32 new (see NEW above).
- Infographic only: the Who Else / Jesus Be The Name / What A Beautiful Name mashup is shown as "Who Else medley".
