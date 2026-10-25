// Loads and saves a learner's progress through a storage wrapper
// (js/storage.js). Damaged saved data is kept aside, never silently lost.

import { emptyProgress, validateProgress } from './progress.js';

export const PROGRESS_KEY = 'pb101-progress';

export function createProgressStore(storage, now = () => new Date().toISOString()) {
  return {
    available: storage.available,
    load() {
      const saved = storage.get(PROGRESS_KEY);
      if (saved == null) return emptyProgress(now());
      if (validateProgress(saved)) {
        storage.set(`${PROGRESS_KEY}-damaged`, saved);
        return emptyProgress(now());
      }
      return saved;
    },
    save(progress) {
      return storage.set(PROGRESS_KEY, progress);
    },
  };
}
