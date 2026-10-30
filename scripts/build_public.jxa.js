// Builds public/index.html on a Mac (no installs needed). The logic lives in scripts/build-core.js.
// Usage: osascript -l JavaScript scripts/build_public.jxa.js "<project folder>"
ObjC.import('Foundation');
function run(argv) {
  const root = argv[0];
  const read = (p) => $.NSString.stringWithContentsOfFileEncodingError(p, $.NSUTF8StringEncoding, null).js;
  const write = (p, s) => $(s).writeToFileAtomicallyEncodingError(p, true, $.NSUTF8StringEncoding, null);
  const exists = (p) => $.NSFileManager.defaultManager.fileExistsAtPath(p);
  const list = (dir) => (ObjC.deepUnwrap($.NSFileManager.defaultManager.contentsOfDirectoryAtPathError(dir, null)) || [])
    .filter((f) => /^uses-.*\.json$/.test(f) && f !== 'uses-auto.json').sort().map((f) => dir + '/' + f);

  const buildDashboard = new Function(read(root + '/scripts/build-core.js') + '\nreturn buildDashboard;')();
  const auto = root + '/data/pco/uses-auto.json';
  const out = buildDashboard({
    template: read(root + '/public/template.html'),
    library: JSON.parse(read(root + '/data/pco/songs.json')),
    files: list(root + '/data/pco/old').concat(list(root + '/data/pco')).map((f) => JSON.parse(read(f))),
    autoRows: exists(auto) ? JSON.parse(read(auto)) : [],
    today: new Date().toISOString().slice(0, 10)
  });
  write(root + '/public/index.html', out.html);
  return out.summary + ' written to public/index.html';
}
