// The large-text option (proposal's accessibility rule): one button in the
// top bar makes all text 25% larger; the choice is remembered in this
// browser. Every size in the course's styles is relative, so ledgers grow too.

export const TEXT_SIZE_KEY = 'pb101-large-text';
export const LARGE_CLASS = 'large-text';

// Reading or writing browser storage can throw (private windows, blocked
// storage); the option then simply lasts for this page.
export function readLargeText(storage) {
  try { return storage?.getItem(TEXT_SIZE_KEY) === '1'; } catch { return false; }
}
export function writeLargeText(storage, on) {
  try { storage?.setItem(TEXT_SIZE_KEY, on ? '1' : '0'); } catch { /* not kept; still applied on this page */ }
}

export function textSizeButtonHTML(on) {
  return `<button class="text-size-toggle" type="button" aria-pressed="${on ? 'true' : 'false'}">Larger text</button>`;
}
