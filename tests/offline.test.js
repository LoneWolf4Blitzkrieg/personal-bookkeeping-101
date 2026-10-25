import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildOffline, rewrite, OUTPUT, PAGES } from '../tools/build-offline.mjs';
import { routeFromHash, offlineHref, PAGE_NAMES } from '../js/offlineRouter.js';

const root = new URL('../', import.meta.url);
// Windows checkouts may hold CRLF line endings; the bundle is built with LF.
const read = (f) => readFileSync(new URL(f, root), 'utf8').replace(/\r\n/g, '\n');

// A plain picture of a value that can be compared across the sandbox and this
// process: data as it is, functions by their source text.
function picture(value, seen = new Set()) {
  if (typeof value === 'function') return `function ${value.toString()}`;
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return '[repeat]';
  seen.add(value);
  const tag = Object.prototype.toString.call(value);
  if (tag === '[object Map]') return { map: [...value].map(([k, v]) => [picture(k, seen), picture(v, seen)]) };
  if (tag === '[object Set]') return { set: [...value].map((v) => picture(v, seen)) };
  if (tag === '[object Date]') return { date: value.getTime() };
  if (tag === '[object RegExp]') return { regexp: String(value) };
  // Array.from, not map: a sandbox array's map would build a sandbox array.
  if (Array.isArray(value)) return Array.from(value, (v) => picture(v, seen));
  return Object.fromEntries(Object.keys(value).map((k) => [k, picture(value[k], seen)]));
}

test('the double-click bundle is up to date (run node tools/build-offline.mjs after any change)', () => {
  assert.ok(buildOffline() === read(OUTPUT), `${OUTPUT} is out of date: run node tools/build-offline.mjs`);
});

test('every bundled module runs and exports exactly what the real module exports, value for value', async () => {
  const context = { URL, URLSearchParams };
  vm.runInNewContext(read(OUTPUT), context);
  const { require, pages, modules } = context.pb101Offline;
  assert.ok(modules.length > 50, String(modules.length));
  for (const id of modules) {
    const bundled = require(id);
    const real = await import(new URL(id, root));
    assert.deepEqual(Object.keys(bundled).sort(), Object.keys(real).sort(), id);
    for (const name of Object.keys(real)) assert.deepEqual(picture(bundled[name]), picture(real[name]), `${id}: ${name}`);
  }
  assert.deepEqual(Object.keys(pages), PAGES);
  for (const [file, page] of Object.entries(pages)) {
    assert.ok(!/<script\b/.test(page.body), `${file}: the bundled body still holds a script`);
    assert.ok(page.body.includes('class="site-footer"'), `${file}: the bundled body has no footer`);
    assert.ok(page.styles.includes('css/site.css'), file);
  }
});

test('the bundler refuses what the double-click version could not carry over', () => {
  assert.throws(() => rewrite('js/x.js', "history.replaceState(null, '', '?m=m03');"), /cannot use "history.replaceState"/);
  assert.throws(() => rewrite('js/x.js', 'const q = location.search;'), /cannot use "location.search"/);
  assert.throws(() => rewrite('js/x.js', "import x from './y.js';"), /cannot bundle/);
  assert.throws(() => rewrite('js/x.js', "export default 1;"), /cannot bundle/);
  assert.throws(() => rewrite('js/x.js', "const m = await import('./y.js');"), /cannot bundle/);
  assert.throws(() => rewrite('js/x.js', "import { a } from 'lib';"), /only relative imports/);
  const ok = rewrite('js/app/x.js', "import { a as b, c } from '../y.js';\nexport function f() { return b + c; }\nexport { f as g };");
  assert.deepEqual(ok.deps, ['js/y.js']);
  assert.match(ok.code, /const \{ a: b, c \} = require\("js\/y\.js"\);/);
  assert.match(ok.code, /define\(exports, \{ f: \(\) => f, g: \(\) => f \}\);/);
});

test('index.html loads the bundle only from a file, and the other pages send the learner there', () => {
  assert.deepEqual(PAGE_NAMES, PAGES);
  assert.match(read('index.html'), /if \(location\.protocol === 'file:'\) document\.write\('<script src="offline\/course\.js"><\\\/script>'\);/);
  for (const f of PAGES.slice(1)) {
    assert.ok(read(f).includes("if (location.protocol === 'file:') location.replace('index.html#/' + location.pathname.split('/').pop() + location.search);"), f);
  }
});

test('the address after "#/" names the page; any other "#name" is a place on the home page', () => {
  assert.deepEqual(routeFromHash(''), { page: 'index.html', search: '', anchor: null });
  assert.deepEqual(routeFromHash('#/'), { page: 'index.html', search: '', anchor: null });
  assert.deepEqual(routeFromHash('#/lesson.html?m=m03'), { page: 'lesson.html', search: '?m=m03', anchor: null });
  assert.deepEqual(routeFromHash('#/print.html?lesson=m15&step=s2'), { page: 'print.html', search: '?lesson=m15&step=s2', anchor: null });
  assert.deepEqual(routeFromHash('#/certificate.html'), { page: 'certificate.html', search: '', anchor: null });
  assert.deepEqual(routeFromHash('#/nowhere.html?x=1'), { page: 'index.html', search: '', anchor: null });
  assert.deepEqual(routeFromHash('#course-map'), { page: 'index.html', search: '', anchor: 'course-map' });
  assert.deepEqual(routeFromHash('#%E0%A4%A'), { page: 'index.html', search: '', anchor: '%E0%A4%A' });
});

test('course links become moves inside index.html; other links are left to the browser', () => {
  const home = new URL('file:///C:/Users/Ana%20Mar%C3%ADa/Downloads/course/index.html#/lesson.html?m=m02');
  const link = (href) => offlineHref(new URL(href, home), home);
  assert.equal(link('lesson.html?m=m03'), '#/lesson.html?m=m03');
  assert.equal(link('assess.html?id=exam'), '#/assess.html?id=exam');
  assert.equal(link('print.html?lesson=m15&step=s2'), '#/print.html?lesson=m15&step=s2');
  assert.equal(link('certificate.html'), '#/certificate.html');
  assert.equal(link('index.html#course-map'), '#course-map');
  assert.equal(link('index.html'), null);
  assert.equal(link('media/notice.html'), null);
  assert.equal(link('media/ode-to-joy-finale.mp3'), null);
  assert.equal(link('../other/lesson.html?m=m01'), null);
  assert.equal(link('https://creativecommons.org/licenses/by-nc-sa/4.0/'), null);
});
