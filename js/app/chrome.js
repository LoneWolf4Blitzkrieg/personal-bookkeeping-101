// Shared page furniture for saving: the progress store, the "Saved"
// indicator in the top bar and the banner shown when saving is blocked.

import { createStorage, browserBackend } from '../storage.js';
import { createProgressStore } from '../progressStore.js';

export const store = createProgressStore(createStorage(browserBackend()));

let indicator = null;
let hideTimer = null;

export function mountChrome() {
  const topbar = document.querySelector('.topbar');
  if (topbar && !indicator) {
    indicator = document.createElement('span');
    indicator.className = 'saved-indicator';
    indicator.setAttribute('role', 'status');
    topbar.insertBefore(indicator, topbar.querySelector('.map-toggle'));
  }
  if (!store.available && !document.querySelector('.storage-banner')) {
    const banner = document.createElement('p');
    banner.className = 'storage-banner';
    banner.textContent = 'Your browser is not letting this course save progress (for example in a private window). You can keep learning, but your progress will be lost when you close the page. To keep it, open the course in a normal window, or use "Save a progress file" on the home page.';
    (topbar ?? document.body.firstElementChild)?.insertAdjacentElement('afterend', banner);
  }
}

export function save(progress) {
  const ok = store.save(progress);
  if (indicator) {
    indicator.textContent = ok ? 'Saved' : 'Not saved';
    indicator.classList.toggle('not-saved', !ok);
    indicator.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => indicator.classList.remove('visible'), 2500);
  }
  return ok;
}
