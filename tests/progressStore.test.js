import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgressStore, PROGRESS_KEY } from '../js/progressStore.js';
import { createStorage } from '../js/storage.js';
import { emptyProgress, markStep } from '../js/progress.js';

function memory() {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: (k) => data.delete(k), data };
}

test('a fresh store starts with empty progress', () => {
  const store = createProgressStore(createStorage(memory()), () => '2026-07-01T00:00:00.000Z');
  assert.deepEqual(store.load(), emptyProgress('2026-07-01T00:00:00.000Z'));
});

test('saved progress comes back after a reload', () => {
  const backend = memory();
  const first = createProgressStore(createStorage(backend));
  const p = markStep(first.load(), 'm01', 0);
  assert.equal(first.save(p), true);
  const second = createProgressStore(createStorage(backend));
  assert.deepEqual(second.load(), p);
});

test('damaged saved progress is set aside, not thrown away silently', () => {
  const backend = memory();
  backend.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, modules: 'broken' }));
  const store = createProgressStore(createStorage(backend), () => '2026-07-01T00:00:00.000Z');
  assert.deepEqual(store.load(), emptyProgress('2026-07-01T00:00:00.000Z'));
  assert.ok([...backend.data.keys()].some((k) => k.startsWith(`${PROGRESS_KEY}-damaged-`)), 'the damaged copy is kept for recovery');
});

test('saving reports failure when storage is unavailable', () => {
  const store = createProgressStore(createStorage(undefined));
  assert.equal(store.available, false);
  assert.equal(store.save(emptyProgress()), false);
});

test('update applies changes to the latest saved progress, not an old copy', () => {
  const backend = memory();
  const tabA = createProgressStore(createStorage(backend));
  const tabB = createProgressStore(createStorage(backend));
  tabA.update((p) => markStep(p, 'm01', 0));
  tabB.update((p) => markStep(p, 'm02', 1));
  const p = tabA.load();
  assert.deepEqual(p.modules.m01.steps, [0]);
  assert.deepEqual(p.modules.m02.steps, [1]);
});

test('unreadable saved text is kept aside and reported', () => {
  const backend = memory();
  backend.setItem(PROGRESS_KEY, '{not json at all');
  const store = createProgressStore(createStorage(backend), () => '2026-07-01T00:00:00.000Z');
  store.load();
  assert.equal(store.recovered, true);
  const keptKey = [...backend.data.keys()].find((k) => k.startsWith(`${PROGRESS_KEY}-damaged`));
  assert.equal(backend.getItem(keptKey), JSON.stringify('{not json at all'));
});

test('a store can use its own key', () => {
  const backend = memory();
  const store = createProgressStore(createStorage(backend), undefined, 'pb101-save-check');
  store.save(markStep(store.load(), 'm01', 0));
  assert.equal(backend.getItem(PROGRESS_KEY), null);
  assert.ok(backend.getItem('pb101-save-check'));
});

test('full storage: the store moves to a same-tab fallback, keeps the learner place, says so, and writes back when there is room', async () => {
  const { createFallingStore, PROGRESS_KEY } = await import('../js/progressStore.js');
  const { markStep } = await import('../js/progress.js');
  const T = '2026-07-01T00:00:00.000Z';
  let room = 1e9;
  const data = new Map();
  const local = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => { if (String(v).length > room) throw new Error('QuotaExceededError'); data.set(k, String(v)); },
    removeItem: (k) => data.delete(k),
  };
  const side = new Map();
  const tab = { getItem: (k) => side.get(k) ?? null, setItem: (k, v) => side.set(k, String(v)), removeItem: (k) => side.delete(k) };
  let told = 0;
  const open = () => createFallingStore(createStorage(local), [tab], { onFallBack: () => { told++; }, now: () => T });

  const store = open();
  store.update((p) => markStep(p, 'm01', 's1'));
  assert.equal(store.available, true);
  assert.equal(side.size, 0, 'the fallback is not touched while storage works');
  const saved = data.get(PROGRESS_KEY).length;

  room = saved + 1; // storage fills up: the record can be rewritten, not grown
  store.update((p) => markStep(p, 'm01', 's2'));
  assert.equal(told, 1);
  assert.equal(store.available, false);
  assert.ok(store.load().modules.m01.steps.includes('s2'));

  // The next page in the same tab, storage still full: the newer progress in
  // the fallback is used, and the learner is told again.
  const next = open();
  assert.equal(next.available, false);
  assert.equal(told, 2);
  assert.ok(next.load().modules.m01.steps.includes('s2'));

  // Room again: the next page writes the progress back and clears the fallback.
  room = 1e9;
  const later = open();
  assert.equal(later.available, true);
  assert.ok(later.load().modules.m01.steps.includes('s2'));
  assert.equal(side.size, 0);

  // Storage with a little room left still saves: no fallback for that.
  room = data.get(PROGRESS_KEY).length + 200;
  const tight = open();
  tight.update((p) => markStep(p, 'm01', 's3'));
  assert.equal(tight.available, true);

  // Blocked from the start: what the main storage holds is carried over.
  const blocked = createFallingStore(createStorage({ getItem: local.getItem, setItem() { throw new Error('blocked'); }, removeItem() {} }), [tab], { now: () => T });
  assert.equal(blocked.available, false);
  assert.ok(blocked.load().modules.m01.steps.includes('s3'));
});
