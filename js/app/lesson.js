// The lesson page controller: course map, lock notice, time on the module
// and step progress. Task 5 adds the step-by-step lesson renderer.

import { MODULES, PHASES } from '../../content/course.js';
import { renderCourseMap, moduleIdFromParam } from './nav.js';
import { isUnlocked, markStep, addTime } from '../progress.js';
import { escapeHTML } from '../html.js';
import { store, save, mountChrome } from './chrome.js';

export function startLessonPage(search) {
  mountChrome();
  let progress = store.load();

  const param = new URLSearchParams(search).get('m');
  const id = param === null ? 'm01' : moduleIdFromParam(param);
  const module = MODULES.find((m) => m.id === id);
  const mapBox = document.getElementById('course-map');
  const drawMap = () => renderCourseMap(mapBox, progress, module ? module.id : null, { headingLevel: 3 });
  drawMap();

  const title = document.getElementById('module-title');
  const body = document.getElementById('lesson-body');
  if (!module) {
    title.textContent = 'Module not found';
    body.innerHTML = '<p>There is no module with that name. Choose one from the course map.</p>';
    return;
  }
  title.textContent = module.title;
  document.getElementById('crumb').textContent = PHASES[module.phase];
  document.title = `${module.title} · Personal Bookkeeping 101`;

  const access = isUnlocked(module.id, progress);
  if (!access.unlocked) {
    body.innerHTML = `<div class="lock-notice"><p><strong>This module is locked.</strong> ${escapeHTML(access.reason)}</p>
      <p>Each module opens when you pass the check at the end of the one before it, so you never build on a gap.</p></div>`;
    document.getElementById('ledger').textContent = 'The ledger page appears when the module opens.';
    return;
  }

  // Placeholder first step until Task 5 renders real lesson steps.
  const done = () => progress.modules[module.id]?.steps.includes(0);
  const drawStep = () => {
    body.innerHTML = `<p>This module's lessons are being written.</p>
      <p><button class="button" type="button" id="mark-step" ${done() ? 'disabled' : ''}>${done() ? 'Introduction read ✓' : 'Mark the introduction as read'}</button></p>`;
    document.getElementById('mark-step')?.addEventListener('click', () => {
      progress = markStep(progress, module.id, 0);
      save(progress);
      drawStep();
    });
  };
  drawStep();

  // Time on the module, saved whenever the page is hidden or closed.
  let shownAt = document.visibilityState === 'visible' ? Date.now() : null;
  const flushTime = () => {
    if (shownAt === null) return;
    progress = addTime(store.load(), module.id, Date.now() - shownAt);
    shownAt = null;
    store.save(progress);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushTime();
    else shownAt = Date.now();
  });
  window.addEventListener('pagehide', flushTime);
}

export function wireLayoutButtons() {
  const layout = document.getElementById('layout');
  const menu = document.querySelector('.menu-button');
  menu.addEventListener('click', () => {
    const open = layout.classList.toggle('map-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  const toggle = document.querySelector('.map-toggle');
  toggle.addEventListener('click', () => {
    const hidden = layout.classList.toggle('map-hidden');
    toggle.setAttribute('aria-expanded', String(!hidden));
    toggle.textContent = hidden ? 'Show course map' : 'Hide course map';
  });
}
