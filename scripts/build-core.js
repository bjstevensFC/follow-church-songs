// Shared build logic for the public dashboard page. Used by both
// scripts/build_public.jxa.js (on a Mac) and scripts/build.mjs (on GitHub).
// Plain script, no imports: the caller loads it and gets buildDashboard back.
function buildDashboard(input) {
  // input: {template, library: [song], files: [[row]], autoRows: [row], today: 'YYYY-MM-DD'}
  const songs = {}, titles = {};
  for (const s of input.library) {
    titles[s.id] = String(s.title).trim();
    songs[s.id] = {author: s.author, ccli: s.ccli, themes: s.themes, added: s.created_at ? s.created_at.slice(0, 10) : null};
  }

  // Services refreshed by the weekly update replace whatever the older files have for that date
  const autoDates = new Set(input.autoRows.map((u) => u.date));
  const all = input.files.flatMap((rows) => rows.filter((u) => !autoDates.has(u.date))).concat(input.autoRows);

  // One row per song per service (a song sung twice in one service counts once)
  const seen = new Set(), uses = [], used = {};
  for (const u of all) {
    const id = String(u.song_id), k = u.date + '|' + id;
    if (u.song_id == null || seen.has(k)) continue;
    seen.add(k);
    used[id] = songs[id] || null;
    uses.push({date: u.date, song: titles[id] || String(u.item_title).trim(), row: id, pos: u.pos, key: u.key,
      length: u.length || null, bpm: u.bpm || null, meter: u.meter, arrangement: u.arrangement});
  }
  uses.sort((a, b) => a.date.localeCompare(b.date) || a.pos - b.pos);

  const js = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');
  const html = input.template
    .replace('/*DATA*/[]', () => js(uses))
    .replace('/*SONGS*/{}', () => js(used))
    .replace('/*UPDATED*/', input.today);
  const services = new Set(uses.map((u) => u.date));
  return {html, summary: uses.length + ' song uses, ' + Object.keys(used).length + ' songs, ' + services.size + ' services'};
}
