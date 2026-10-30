// Builds public/index.html with Node (used by the GitHub workflow). Same logic as the Mac build:
// both load scripts/build-core.js.
// Usage: node scripts/build.mjs
import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const list = (dir) => readdirSync(join(root, dir))
  .filter((f) => /^uses-.*\.json$/.test(f) && f !== 'uses-auto.json').sort().map((f) => join(dir, f));

const buildDashboard = new Function(read('scripts/build-core.js') + '\nreturn buildDashboard;')();
const out = buildDashboard({
  template: read('public/template.html'),
  library: JSON.parse(read('data/pco/songs.json')),
  files: list('data/pco/old').concat(list('data/pco')).map((f) => JSON.parse(read(f))),
  autoRows: existsSync(join(root, 'data/pco/uses-auto.json')) ? JSON.parse(read('data/pco/uses-auto.json')) : [],
  today: new Date().toISOString().slice(0, 10)
});
writeFileSync(join(root, 'public/index.html'), out.html);
console.log(out.summary + ' written to public/index.html');
