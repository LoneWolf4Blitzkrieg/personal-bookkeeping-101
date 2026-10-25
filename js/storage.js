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
      const text = this.getRaw(key);
      if (text == null) return null;
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    },
    getRaw(key) {
      if (!backend) return null;
      try {
        return backend.getItem(key);
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

// A fallback for when localStorage is blocked: keeps values in window.name,
// which survives moving between pages in the same tab (but not closing it).
const NAME_PREFIX = 'pb101:';

export function windowNameBackend(win = globalThis.window) {
  const read = () => {
    try {
      return win.name.startsWith(NAME_PREFIX) ? JSON.parse(win.name.slice(NAME_PREFIX.length)) : {};
    } catch {
      return {};
    }
  };
  const write = (data) => { win.name = NAME_PREFIX + JSON.stringify(data); };
  return {
    getItem: (k) => read()[k] ?? null,
    setItem: (k, v) => { const d = read(); d[k] = String(v); write(d); },
    removeItem: (k) => { const d = read(); delete d[k]; write(d); },
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
