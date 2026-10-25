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
