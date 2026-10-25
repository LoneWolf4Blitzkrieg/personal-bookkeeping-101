import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, CHECKPOINTS } from '../content/course.js';

const CORE_IDS = Array.from({ length: 16 }, (_, i) => `m${String(i + 1).padStart(2, '0')}`);
const ADDON_IDS = ['a1', 'a2', 'a3'];

test('MODULES lists m01-m16 then a1-a3, in order', () => {
  assert.deepEqual(MODULES.map((m) => m.id), [...CORE_IDS, ...ADDON_IDS]);
});

test('every module has a title and a phase', () => {
  for (const m of MODULES) {
    assert.ok(typeof m.title === 'string' && m.title.length > 0, `${m.id} title`);
    assert.ok(typeof m.phase === 'string' && m.phase.length > 0, `${m.id} phase`);
  }
});

test('teaching modules introduce 2 or 3 ideas; project modules introduce none', () => {
  for (const m of MODULES) {
    const n = m.ideas.length;
    if (m.id === 'm15' || m.id === 'm16') assert.equal(n, 0, m.id);
    else assert.ok(n === 2 || n === 3, `${m.id} has ${n} ideas`);
  }
});

test('idea ids are unique kebab-case names across the course', () => {
  const all = MODULES.flatMap((m) => m.ideas);
  assert.equal(new Set(all).size, all.length);
  for (const id of all) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('core course introduces no more than 42 ideas', () => {
  const core = MODULES.filter((m) => CORE_IDS.includes(m.id)).flatMap((m) => m.ideas);
  assert.ok(core.length <= 42, `core has ${core.length} ideas`);
});

test('checkpoints follow modules 4, 8 and 12', () => {
  assert.deepEqual(CHECKPOINTS, [
    { id: 'ca', after: 'm04' },
    { id: 'cb', after: 'm08' },
    { id: 'cc', after: 'm12' },
  ]);
});

test('the prerequisite check has its own ideas, outside the 42-idea budget', async () => {
  const { PREREQUISITE } = await import('../content/course.js');
  assert.equal(PREREQUISITE.id, 'prereq');
  assert.ok(PREREQUISITE.ideas.includes('decimals'));
  const coreIdeas = new Set(MODULES.flatMap((m) => m.ideas));
  assert.ok(PREREQUISITE.ideas.every((i) => !coreIdeas.has(i)));
});
