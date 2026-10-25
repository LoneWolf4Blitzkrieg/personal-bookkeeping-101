import { test } from 'node:test';
import assert from 'node:assert/strict';
import { courseMapHTML } from '../js/app/nav.js';
import { MODULES, PHASES } from '../content/course.js';

test('course map links every module to its lesson page', () => {
  const html = courseMapHTML({}, 'm01');
  for (const m of MODULES) {
    assert.ok(html.includes(`href="lesson.html?m=${m.id}"`), `${m.id} link`);
    assert.ok(html.includes(m.title), `${m.id} title`);
  }
});

test('course map groups modules under their phase headings, in order', () => {
  const html = courseMapHTML({}, 'm01');
  const positions = Object.values(PHASES).map((label) => html.indexOf(label));
  assert.ok(positions.every((p) => p >= 0), 'every phase heading present');
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'phases in order');
});

test('course map marks only the current module with aria-current', () => {
  const html = courseMapHTML({}, 'm07');
  assert.equal(html.match(/aria-current="page"/g).length, 1);
  assert.match(html, /href="lesson.html\?m=m07"[^>]*aria-current="page"/);
});

test('checkpoints appear right after modules 4, 8 and 12', () => {
  const html = courseMapHTML({}, 'm01');
  for (const [after, next, label] of [['m04', 'm05', 'Checkpoint A'], ['m08', 'm09', 'Checkpoint B'], ['m12', 'm13', 'Checkpoint C']]) {
    const a = html.indexOf(`m=${after}"`);
    const c = html.indexOf(label);
    const n = html.indexOf(`m=${next}"`);
    assert.ok(a < c && c < n, `${label} between ${after} and ${next}`);
  }
});

test('module titles are HTML-escaped', () => {
  const html = courseMapHTML({}, 'm01', [{ id: 'x1', title: 'Cash & <cards>', phase: 'core', ideas: [] }]);
  assert.ok(html.includes('Cash &amp; &lt;cards&gt;'));
});
