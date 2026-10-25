// Loads and saves a learner's progress through a storage wrapper
// (js/storage.js). Damaged saved data is kept aside, never silently lost.
// Every change should go through update(), which applies it to the latest
// saved progress so a page holding an old copy cannot overwrite newer work
// (another tab, or a page restored with the Back button).

import { emptyProgress, validateProgress } from './progress.js';
import { createStorage } from './storage.js';

export const PROGRESS_KEY = 'pb101-progress';

export function createProgressStore(storage, now = () => new Date().toISOString(), key = PROGRESS_KEY) {
  const store = {
    available: storage.available,
    recovered: false,
    load() {
      const raw = storage.getRaw(key);
      if (raw == null) return emptyProgress(now());
      const saved = storage.get(key);
      if (saved == null || validateProgress(saved)) {
        storage.set(`${key}-damaged-${now()}`, saved ?? raw);
        storage.set(key, emptyProgress(now()));
        store.recovered = true;
        return emptyProgress(now());
      }
      return saved;
    },
    save(progress) {
      return storage.set(key, progress);
    },
    update(change) {
      const next = change(store.load());
      store.save(next);
      return next;
    },
  };
  return store;
}

// A progress store that moves to a same-tab fallback when the main storage is
// blocked or full, or fills up later, and says so through onFallBack. The
// fallback is the first of `fallbacks` (raw backends: sessionStorage, then
// window.name) that works, opened only when needed. Progress is carried over,
// so the learner keeps their place, and is written back to the main storage
// as soon as it has room again.
export function createFallingStore(primary, fallbacks, { onFallBack = () => {}, now, key = PROGRESS_KEY } = {}) {
  const valid = (p) => p != null && !validateProgress(p);
  const readFrom = (backend) => {
    try {
      const text = backend?.getItem(key);
      return text == null ? null : JSON.parse(text);
    } catch {
      return null;
    }
  };
  const clearFallbacks = () => {
    for (const backend of fallbacks) {
      try { if (backend?.getItem(key) != null) backend.removeItem(key); } catch { /* nothing to clear */ }
    }
  };
  let active = createProgressStore(primary, now, key);
  let fellBack = false;
  const fallBack = (carried) => {
    if (fellBack) return;
    fellBack = true;
    const fallback = fallbacks.map((backend) => createStorage(backend)).find((s) => s.available) ?? createStorage(undefined);
    active = createProgressStore(fallback, now, key);
    if (valid(carried)) active.save(carried);
    onFallBack();
  };

  // An earlier page in this tab may have left newer progress in the fallback.
  const left = fallbacks.map(readFrom).find(valid);
  const saved = primary.get(key);
  if (!primary.available) fallBack(left ?? saved);
  else if (left) {
    if (primary.set(key, left)) clearFallbacks();
    else fallBack(left);
  } else if (valid(saved) && !primary.set(key, saved)) {
    // Present but cannot be rewritten: the storage is full.
    fallBack(saved);
  }

  const store = {
    get available() { return !fellBack; },
    get recovered() { return active.recovered; },
    load: () => active.load(),
    save(progress) {
      if (active.save(progress)) return true;
      if (fellBack) return false;
      fallBack(progress);
      return active.save(progress);
    },
    update(change) {
      const next = change(store.load());
      store.save(next);
      return next;
    },
  };
  return store;
}
