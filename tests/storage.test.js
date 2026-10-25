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
