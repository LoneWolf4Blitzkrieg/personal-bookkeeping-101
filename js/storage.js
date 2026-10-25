// A safe wrapper over localStorage (or any object with getItem/setItem/
// removeItem). It never throws: private windows, blocked storage and full
// storage all just report that saving is unavailable or failed.

const PROBE = '__pb101_probe__';

export function createStorage(backend) {
  let available = false;
  if (backend) {
    try {
      backend.setItem(PROBE, '1');
      backend.removeItem(PROBE);
      available = true;
    } catch {
      available = false;
    }
  }

  return {
    available,
    get(key) {
      if (!backend) return null;
      try {
        const text = backend.getItem(key);
        return text == null ? null : JSON.parse(text);
      } catch {
        return null;
      }
    },
    set(key, value) {
      if (!available) return false;
      try {
        backend.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };
}

// The browser's localStorage, if the page is allowed to touch it at all.
export function browserBackend() {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}
