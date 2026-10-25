import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage } from '../js/storage.js';

function memoryBackend() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: (k) => { data.delete(k); },
  };
}

test('values round-trip through a working backend', () => {
  const s = createStorage(memoryBackend());
  assert.equal(s.available, true);
  assert.equal(s.set('k', { a: [1, 2] }), true);
  assert.deepEqual(s.get('k'), { a: [1, 2] });
});

test('a missing key reads as null', () => {
  assert.equal(createStorage(memoryBackend()).get('nothing'), null);
});

test('a backend that refuses to save makes storage unavailable without throwing', () => {
  const backend = { ...memoryBackend(), setItem: () => { throw new Error('QuotaExceededError'); } };
  const s = createStorage(backend);
  assert.equal(s.available, false);
  assert.equal(s.set('k', 1), false);
});

test('no backend at all (storage blocked) is unavailable', () => {
  const s = createStorage(undefined);
  assert.equal(s.available, false);
  assert.equal(s.get('k'), null);
  assert.equal(s.set('k', 1), false);
});

test('a backend that fails later reports the failure', () => {
  const backend = memoryBackend();
  const s = createStorage(backend);
  backend.setItem = () => { throw new Error('full'); };
  assert.equal(s.set('k', 1), false);
});

test('corrupt saved text reads as null instead of throwing', () => {
  const backend = memoryBackend();
  backend.setItem('k', '{not json');
  assert.equal(createStorage(backend).get('k'), null);
});

test('a backend whose reads throw is handled', () => {
  const backend = { ...memoryBackend(), getItem: () => { throw new Error('SecurityError'); } };
  assert.equal(createStorage(backend).get('k'), null);
});

test('the window-name backend keeps values across pages in one tab', async () => {
  const { windowNameBackend } = await import('../js/storage.js');
  const win = { name: '' };
  const a = createStorage(windowNameBackend(win));
  assert.equal(a.available, true);
  a.set('k', { x: 1 });
  const b = createStorage(windowNameBackend(win)); // the next page in the same tab
  assert.deepEqual(b.get('k'), { x: 1 });
});

test('the window-name backend ignores a name set by someone else', async () => {
  const { windowNameBackend } = await import('../js/storage.js');
  const s = createStorage(windowNameBackend({ name: 'some-other-site' }));
  assert.equal(s.get('k'), null);
});

test('raw text is available when saved data cannot be parsed', () => {
  const data = new Map([['k', '{broken']]);
  const s = createStorage({ getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) });
  assert.equal(s.get('k'), null);
  assert.equal(s.getRaw('k'), '{broken');
});
