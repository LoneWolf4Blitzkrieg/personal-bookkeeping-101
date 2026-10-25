// Shared page furniture for saving: the progress store (localStorage, or a
// same-tab fallback when storage is blocked or full), the "Saved" indicator, the
// banners, time tracking, and refreshing when progress changes elsewhere.

import { createStorage, browserBackend, sessionBackend, windowNameBackend } from '../storage.js';
import { createFallingStore } from '../progressStore.js';
import { addTime } from '../progress.js';
import { readLargeText, writeLargeText, textSizeButtonHTML, LARGE_CLASS } from '../textSize.js';

let mounted = false; // set before the store, which may fall back at once
const primary = createStorage(browserBackend());
// When localStorage is blocked or full, progress still follows the learner from
// page to page in the same tab (sessionStorage, or window.name when that is
// blocked too), but is lost when the tab closes.
export const store = createFallingStore(primary, [sessionBackend(), windowNameBackend()], {
  onFallBack: () => { if (mounted) storageBanner(); },
});

let indicator = null;
let hideTimer = null;
let flip = false;

function banner(className, text) {
  if (document.querySelector(`.${className}`)) return;
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  const topbar = document.querySelector('.topbar');
  (topbar ?? document.body.firstElementChild)?.insertAdjacentElement('afterend', p);
}

function storageBanner() {
  banner('storage-banner', 'Your browser is not letting this course save progress (storage is blocked or full). Your progress is kept while this tab stays open, but it will be lost when you close the tab. To keep it, use "Save a progress file" on the home page before closing, or open the course in a normal browser window.');
}

function safeLocalStorage() {
  try { return window.localStorage; } catch { return null; }
}

// The "Larger text" button, at the end of the top bar.
function mountTextSize(topbar) {
  if (!topbar || topbar.querySelector('.text-size-toggle')) return;
  const storage = safeLocalStorage();
  let on = readLargeText(storage);
  document.documentElement.classList.toggle(LARGE_CLASS, on);
  topbar.insertAdjacentHTML('beforeend', textSizeButtonHTML(on));
  const button = topbar.querySelector('.text-size-toggle');
  button.addEventListener('click', () => {
    on = !on;
    document.documentElement.classList.toggle(LARGE_CLASS, on);
    button.setAttribute('aria-pressed', String(on));
    writeLargeText(storage, on);
  });
}

export function mountChrome() {
  const topbar = document.querySelector('.topbar');
  mountTextSize(topbar);
  if (topbar && !indicator) {
    indicator = document.createElement('span');
    indicator.className = 'saved-indicator';
    indicator.setAttribute('role', 'status');
    topbar.insertBefore(indicator, topbar.querySelector('.map-toggle'));
  }
  mounted = true;
  if (!store.available) storageBanner();
  store.load();
  if (store.recovered) {
    banner('storage-banner recovered-banner', 'Your saved progress could not be read, so the course started fresh. A copy of the damaged data was kept in this browser. If you saved a progress file, you can load it on the home page.');
  }
}

function flash(ok) {
  if (!indicator) return;
  flip = !flip;
  // Alternate the text so screen readers announce every save.
  indicator.textContent = ok ? (flip ? 'Saved' : 'Saved.') : 'Not saved';
  indicator.classList.toggle('not-saved', !ok);
  indicator.classList.add('visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => indicator.classList.remove('visible'), 2500);
}

// Applies a change to the latest saved progress and saves it.
export function update(change) {
  const before = store.load();
  const next = change(before);
  const ok = store.save(next);
  flash(ok);
  return next;
}

// Replaces progress outright (loading a progress file).
export function replace(progress) {
  const ok = store.save(progress);
  flash(ok);
  return ok;
}

// Calls back when progress may have changed elsewhere: another tab saved,
// or this page was restored from the browser's back/forward cache.
export function onExternalChange(callback) {
  window.addEventListener('storage', (e) => { if (e.key === null || e.key?.startsWith('pb101-progress')) callback(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) callback(); });
}

// Adds the time this page is visible to a module's total.
export function trackTime(moduleId) {
  let shownAt = document.visibilityState === 'visible' ? Date.now() : null;
  const flushTime = () => {
    if (shownAt === null) return;
    const ms = Date.now() - shownAt;
    shownAt = null;
    store.update((p) => addTime(p, moduleId, ms));
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushTime();
    else shownAt = Date.now();
  });
  window.addEventListener('pagehide', flushTime);
}
