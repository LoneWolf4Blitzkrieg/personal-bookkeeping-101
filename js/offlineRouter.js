// The router for the double-click version (offline/course.js). Browsers refuse
// module scripts in a page opened straight from a file, and Firefox keeps the
// saved data of each file apart, so that version runs the whole course inside
// index.html: each page is shown by its address after "#/"
// (index.html#/lesson.html?m=m03), and the course's own links become moves
// within index.html. On the website none of this runs.

export const PAGE_NAMES = ['index.html', 'lesson.html', 'assess.html', 'print.html', 'certificate.html'];

function decoded(text) {
  try { return decodeURIComponent(text); } catch { return text; }
}

// Which page the address after "#" asks for. "#/lesson.html?m=m03" is a page;
// any other "#name" is a place on the home page (index.html#course-map).
export function routeFromHash(hash) {
  if (hash.startsWith('#/')) {
    const rest = hash.slice(2);
    const q = rest.indexOf('?');
    const page = q === -1 ? rest : rest.slice(0, q);
    if (!PAGE_NAMES.includes(page)) return { page: 'index.html', search: '', anchor: null };
    return { page, search: q === -1 ? '' : rest.slice(q), anchor: null };
  }
  return { page: 'index.html', search: '', anchor: hash.length > 1 ? decoded(hash.slice(1)) : null };
}

// Where a link to `url` should go inside index.html (`home` is index.html's
// own address): "#/page?query" for one of the course's pages, "#name" for a
// place on the home page, or null when the browser should follow the link
// itself (index.html with no place, other files, other sites).
export function offlineHref(url, home) {
  if (url.protocol !== home.protocol || url.host !== home.host) return null;
  const dir = home.pathname.slice(0, home.pathname.lastIndexOf('/') + 1);
  if (!url.pathname.startsWith(dir)) return null;
  const name = url.pathname.slice(dir.length);
  if (!PAGE_NAMES.includes(name)) return null;
  if (name === 'index.html') return url.hash.length > 1 && !url.hash.startsWith('#/') ? url.hash : null;
  return `#/${name}${url.search}`;
}

// Runs in the browser, from offline/course.js in index.html's head, before the
// body is read. `pages` holds each page's title, stylesheets, body and start.
export function startOffline(pages) {
  const route = routeFromHash(location.hash);
  const page = pages[route.page];
  document.title = page.title;
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) link.remove();
  for (const href of page.styles) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.append(link);
  }
  // Hide index.html's own body until the right page has replaced it.
  const hide = document.createElement('style');
  hide.textContent = 'body { visibility: hidden; }';
  document.head.append(hide);
  // Each move reloads index.html, so the browser's own scroll memory would
  // carry the last page's position over. Each page's position is kept in its
  // history entry instead, and brought back on Back, Forward and Reload.
  history.scrollRestoration = 'manual';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = page.body;
    // Show the page before it starts: browsers will not focus anything in a
    // hidden page, and the checks put focus in the first answer box.
    hide.remove();
    page.start(route.search);
    // A page coming back (Back, Forward, Reload) returns to where it was left.
    // A page opened fresh stays where its start left it (the focused answer
    // box), unless the address names a place on it.
    const saved = history.state?.pb101Scroll;
    const place = route.anchor && document.getElementById(route.anchor);
    if (saved != null) window.scrollTo(0, saved);
    else if (place) goTo(place);
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(saveScroll, 150);
    }, { passive: true });
    window.addEventListener('pagehide', () => { clearTimeout(timer); saveScroll(); });
  });

  // Keeps this page's position in its own history entry, never in the entry
  // of a page the learner is already moving to.
  let timer = null;
  let openingFresh = false;
  function saveScroll() {
    if (openingFresh) return;
    const now = routeFromHash(location.hash);
    if (now.page !== route.page || now.search !== route.search) return;
    history.replaceState({ ...history.state, pb101Scroll: window.scrollY }, '');
  }

  // Moves to a place on the page the way a followed link does, so the next
  // Tab continues from there.
  function goTo(place) {
    if (!place.matches('a[href], button, input, select, textarea, [tabindex]')) place.setAttribute('tabindex', '-1');
    place.scrollIntoView(); // its top at the top, as a followed link puts it
    place.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest?.('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const raw = link.getAttribute('href');
    if (raw.startsWith('#') && !raw.startsWith('#/')) {
      // A skip link or another place on this same page: go there without
      // changing the address, which names the page being shown.
      e.preventDefault();
      const place = document.getElementById(decoded(raw.slice(1)));
      if (place) goTo(place);
      return;
    }
    const to = offlineHref(new URL(link.href), new URL(location.href));
    if (!to) return;
    e.preventDefault();
    clearTimeout(timer);
    if (to === location.hash) {
      // A link to the page already shown opens it fresh, at the top.
      history.replaceState({ ...history.state, pb101Scroll: null }, '');
      openingFresh = true;
      location.reload();
      return;
    }
    saveScroll();
    location.assign(to); // the hashchange below shows the new page
  });

  // A followed link, Back or Forward: show the page the address now names.
  window.addEventListener('hashchange', () => {
    const next = routeFromHash(location.hash);
    if (next.page === route.page && next.search === route.search) return;
    clearTimeout(timer);
    location.reload();
  });
}
