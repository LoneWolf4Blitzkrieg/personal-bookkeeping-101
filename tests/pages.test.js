import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { MODULES } from '../content/course.js';
import { ASSESSMENTS } from '../content/assess/index.js';
import { MODULE_CONTENT } from '../content/modules/index.js';

const root = new URL('../', import.meta.url);
const PAGES = readdirSync(root).filter((f) => f.endsWith('.html'));
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const FOOTER = '<p><i>Personal Bookkeeping 101</i> by Raul Bautista is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>';

test('every page is in English, has a title and carries the exact licence footer', () => {
  assert.ok(PAGES.length >= 5, PAGES.join());
  for (const f of PAGES) {
    const html = read(f);
    assert.match(html, /<html lang="en">/, f);
    assert.match(html, /<title>[^<]+<\/title>/, f);
    assert.ok(html.includes(FOOTER), `${f}: licence footer`);
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/, f);
  }
});

test('no page says "Copyright", and none loads a script or stylesheet from another site', () => {
  for (const f of PAGES) {
    const html = read(f);
    assert.ok(!/copyright/i.test(html), `${f}: says Copyright`);
    for (const m of html.matchAll(/<(script|link)\b[^>]*\b(src|href)="([^"]+)"/g)) {
      if (m[1] === 'link' && !/rel="stylesheet"/.test(m[0])) continue;
      assert.ok(!/^(https?:)?\/\//.test(m[3]), `${f}: loads ${m[3]}`);
    }
  }
});

test('every internal link on every page leads somewhere that exists', () => {
  const ids = new Set(MODULES.map((m) => m.id));
  for (const f of PAGES) {
    for (const [, href] of read(f).matchAll(/href="([^"#]+?)(?:#[^"]*)?"/g)) {
      if (/^(https?:|mailto:|data:)/.test(href)) continue;
      const [path, query = ''] = href.split('?');
      assert.ok(existsSync(new URL(path, root)), `${f}: ${href} (no such file)`);
      const params = new URLSearchParams(query);
      if (params.has('m')) {
        const m = params.get('m');
        assert.ok(ids.has(m) || m === 'prereq' || m === 'demo' || MODULE_CONTENT[m], `${f}: ${href} (no such module)`);
      }
      if (params.has('id')) assert.ok(ASSESSMENTS[params.get('id')], `${f}: ${href} (no such check)`);
    }
  }
});

test('every module has its lesson and every lesson link in the course map would open', () => {
  for (const m of MODULES) assert.ok(MODULE_CONTENT[m.id], `${m.id} has no lesson`);
});

test('the large-text choice is read and written safely, and the button says whether it is on', async () => {
  const { readLargeText, writeLargeText, textSizeButtonHTML } = await import('../js/textSize.js');
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(readLargeText(storage), false);
  writeLargeText(storage, true);
  assert.equal(readLargeText(storage), true);
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(readLargeText(broken), false);
  assert.doesNotThrow(() => writeLargeText(broken, true));
  assert.match(textSizeButtonHTML(true), /aria-pressed="true"/);
  assert.match(textSizeButtonHTML(false), /type="button"/);
});
