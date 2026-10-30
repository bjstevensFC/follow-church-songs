// Pulls recent Sunday Morning Service songs and the song library from Planning Center (read-only).
// Writes data/pco/uses-auto.json (recent services; these replace older copies of the same dates)
// and data/pco/songs.json (the whole library).
// Needs PCO_APP_ID and PCO_SECRET (a Planning Center Personal Access Token) in the environment.
// Usage: node scripts/update-from-pco.mjs
import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SERVICE_TYPE = '394647'; // Sunday Morning Service
const REFRESH_DAYS = 56;       // re-pull the last 8 weeks each run, in case plans were edited after the fact
const API = 'https://api.planningcenteronline.com/services/v2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = (p) => join(root, p);
const readJson = (p) => JSON.parse(readFileSync(path(p), 'utf8'));
const writeJson = (p, v) => writeFileSync(path(p), JSON.stringify(v, null, 1) + '\n');

// Problems also go to the run's Annotations list on GitHub, which is easier to find than the log
const annotate = (level, msg) => console.log('::' + level + ' title=Planning Center update::' +
  String(msg).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A'));
const fail = (e) => { annotate('error', (e && e.stack) || e); process.exit(1); };
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);

const {PCO_APP_ID, PCO_SECRET} = process.env;
if (!PCO_APP_ID || !PCO_SECRET) fail('PCO_APP_ID and PCO_SECRET must be set (GitHub: Settings → Secrets and variables → Actions).');
const auth = 'Basic ' + Buffer.from(PCO_APP_ID + ':' + PCO_SECRET).toString('base64');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {headers: {Authorization: auth, Accept: 'application/json'}});
    if (res.status === 429 && attempt <= 5) {
      await sleep((Number(res.headers.get('retry-after')) || 20) * 1000);
      continue;
    }
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText + ' for ' + url + '\n' + (await res.text()).slice(0, 500));
    return res.json();
  }
}

async function getAll(url) {
  const data = [], included = [];
  for (let next = url; next; ) {
    const page = await get(next);
    data.push(...page.data);
    included.push(...(page.included || []));
    next = page.links && page.links.next;
  }
  return {data, included};
}

const day = (iso) => iso.slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return day(t.toISOString()); };
const today = day(new Date().toISOString());

// Start from the earlier of: 8 weeks ago, or the day after the newest service already saved
const saved = ['data/pco/old', 'data/pco'].flatMap((dir) => readdirSync(path(dir))
  .filter((f) => /^uses-.*\.json$/.test(f)).flatMap((f) => readJson(join(dir, f)).map((u) => u.date)));
const newest = saved.sort().pop() || '2014-01-01';
const from = [addDays(today, -REFRESH_DAYS), addDays(newest, 1)].sort()[0];
console.log('Newest saved service: ' + newest + '. Pulling services from ' + from + ' to ' + today + '.');

// Services held so far, newest first, until we pass the start date
const plans = [];
for (let next = API + '/service_types/' + SERVICE_TYPE + '/plans?filter=past&order=-sort_date&per_page=25'; next; ) {
  const page = await get(next);
  let done = false;
  for (const p of page.data) {
    const date = day(p.attributes.sort_date || '');
    if (!date || date < from) { done = true; break; }
    const a = p.attributes;
    const sunday = new Date(date + 'T00:00:00Z').getUTCDay() === 0;
    const special = date.slice(5) === '12-24' || /good friday/i.test((a.series_title || '') + ' ' + (a.title || ''));
    if (date <= today && (sunday || special)) plans.push({id: p.id, date});
  }
  next = done ? null : page.links && page.links.next;
}
console.log('Found ' + plans.length + ' services.');

// Song items in each service
const rows = [];
for (const plan of plans.reverse()) {
  const {data, included} = await getAll(API + '/service_types/' + SERVICE_TYPE + '/plans/' + plan.id + '/items?include=song,arrangement&per_page=100');
  const arrangements = new Map(included.filter((x) => x.type === 'Arrangement').map((x) => [x.id, x.attributes]));
  const songItems = data.filter((i) => i.attributes.item_type === 'song').sort((a, b) => a.attributes.sequence - b.attributes.sequence);
  songItems.forEach((i, n) => {
    const songRel = i.relationships.song && i.relationships.song.data;
    const arrRel = i.relationships.arrangement && i.relationships.arrangement.data;
    const arr = (arrRel && arrangements.get(arrRel.id)) || {};
    rows.push({
      date: plan.date, plan_id: plan.id, item_title: i.attributes.title, song_id: songRel ? songRel.id : null, pos: n + 1,
      key: i.attributes.key_name ?? null, length: i.attributes.length ?? null,
      bpm: arr.bpm ?? null, meter: arr.meter ?? null, arrangement: arr.name ?? null
    });
  });
  console.log(plan.date + ': ' + songItems.length + ' songs');
}

// Keep earlier auto-pulled services; replace the dates pulled this time
const pulled = new Set(plans.map((p) => p.date));
const previous = existsSync(path('data/pco/uses-auto.json')) ? readJson('data/pco/uses-auto.json') : [];
const merged = previous.filter((u) => !pulled.has(u.date)).concat(rows)
  .sort((a, b) => a.date.localeCompare(b.date) || a.pos - b.pos);
writeJson('data/pco/uses-auto.json', merged);

// Whole song library (new songs, edited authors and themes)
const library = (await getAll(API + '/songs?per_page=100&order=title')).data.map((s) => ({
  id: s.id, title: s.attributes.title, author: s.attributes.author, ccli: s.attributes.ccli_number,
  themes: s.attributes.themes, hidden: s.attributes.hidden, created_at: s.attributes.created_at,
  last_scheduled_at: s.attributes.last_scheduled_at
}));
if (library.length < 50) throw new Error('Song library came back with only ' + library.length + ' songs; not saving it.');
writeJson('data/pco/songs.json', library);
annotate('notice', 'Saved ' + rows.length + ' song uses from ' + plans.length + ' services (' + from + ' to ' + today + ') and ' + library.length + ' library songs.');
