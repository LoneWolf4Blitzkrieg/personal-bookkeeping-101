// Loads and saves a learner's progress through a storage wrapper
// (js/storage.js). Damaged saved data is kept aside, never silently lost.
// Every change should go through update(), which applies it to the latest
// saved progress so a page holding an old copy cannot overwrite newer work
// (another tab, or a page restored with the Back button).

import { emptyProgress, validateProgress } from './progress.js';

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
