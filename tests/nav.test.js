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

test('moduleIdFromParam accepts 9, 09, m09 and A1 forms', async () => {
  const { moduleIdFromParam } = await import('../js/app/nav.js');
  assert.equal(moduleIdFromParam('9'), 'm09');
  assert.equal(moduleIdFromParam('09'), 'm09');
  assert.equal(moduleIdFromParam('m09'), 'm09');
  assert.equal(moduleIdFromParam('M16'), 'm16');
  assert.equal(moduleIdFromParam('A1'), 'a1');
  assert.equal(moduleIdFromParam(' a3 '), 'a3');
  assert.equal(moduleIdFromParam('17'), null);
  assert.equal(moduleIdFromParam('zz'), null);
  assert.equal(moduleIdFromParam(null), null);
});

test('renderCourseMap fills the container and accepts a progress object', async () => {
  const { renderCourseMap } = await import('../js/app/nav.js');
  const container = { innerHTML: '' };
  renderCourseMap(container, { modules: {} }, 'm02');
  assert.match(container.innerHTML, /href="lesson.html\?m=m02"[^>]*aria-current="page"/);
});

test('phase heading level can be set, defaulting to h2', () => {
  assert.match(courseMapHTML({}, 'm01'), /<h2 class="map-phase">/);
  assert.match(courseMapHTML({}, 'm01', undefined, { headingLevel: 3 }), /<h3 class="map-phase">/);
});

test('module ids are escaped inside links', () => {
  const html = courseMapHTML({}, null, [{ id: 'x"1', title: 'T', phase: 'core', ideas: [] }]);
  assert.ok(html.includes('m=x&quot;1"'));
});

test('passed modules are ticked and locked ones are marked locked', async () => {
  const { emptyProgress, recordGate } = await import('../js/progress.js');
  const p = recordGate(emptyProgress('2026-07-01T00:00:00.000Z'), 'm01', { points: 9, max: 10, passed: true }, '2026-07-01T00:00:00.000Z', 1);
  const html = courseMapHTML(p, 'm02');
  assert.match(html, /<a class="map-module done" href="lesson.html\?m=m01"[^>]*>[^<]*<span class="visually-hidden"> \(done\)<\/span>/);
  assert.match(html, /<a class="map-module" href="lesson.html\?m=m02"/);
  assert.match(html, /<a class="map-module locked" href="lesson.html\?m=m03"[^>]*>[^<]*<span class="visually-hidden"> \(locked\)<\/span>/);
});

test('an empty progress object still draws the map', () => {
  assert.doesNotThrow(() => courseMapHTML({}, 'm01'));
  assert.match(courseMapHTML({}, 'm01'), /class="map-module locked" href="lesson.html\?m=m02"/);
});
