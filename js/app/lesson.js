// The lesson page controller: course map, lock notice, time on the module
// and step progress. Task 5 adds the step-by-step lesson renderer.

import { MODULES, PHASES } from '../../content/course.js';
import { renderCourseMap, moduleIdFromParam } from './nav.js';
import { isUnlocked, markStep } from '../progress.js';
import { escapeHTML } from '../html.js';
import { store, update, mountChrome, onExternalChange, trackTime } from './chrome.js';

const CHECK_NAMES = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C', a3: 'Add-on A3' };

function nextLink(next) {
  if (!next) return '';
  if (/^c[abc]$/.test(next)) {
    return `<p><a class="button" href="assess.html?id=${next}">Go to ${CHECK_NAMES[next]}</a> or <a href="assess.html?id=placement-${next}">take the placement test</a> if you already know this material.</p>`;
  }
  const m = MODULES.find((x) => x.id === next);
  return m ? `<p><a class="button" href="lesson.html?m=${m.id}">Go to ${escapeHTML(m.title)}</a></p>` : '';
}

export function startLessonPage(search) {
  mountChrome();

  const param = new URLSearchParams(search).get('m');
  const id = param === null ? 'm01' : moduleIdFromParam(param);
  const module = MODULES.find((m) => m.id === id);
  const mapBox = document.getElementById('course-map');
  const title = document.getElementById('module-title');
  const body = document.getElementById('lesson-body');

  if (!module) {
    renderCourseMap(mapBox, store.load(), null, { headingLevel: 3 });
    title.textContent = 'Module not found';
    body.innerHTML = '<p>There is no module with that name. Choose one from the course map.</p>';
    return;
  }
  title.textContent = module.title;
  document.getElementById('crumb').textContent = PHASES[module.phase];
  document.title = `${module.title} · Personal Bookkeeping 101`;

  function draw() {
    const progress = store.load();
    renderCourseMap(mapBox, progress, module.id, { headingLevel: 3 });
    const access = isUnlocked(module.id, progress);
    if (!access.unlocked) {
      body.innerHTML = `<div class="lock-notice"><p><strong>This module is locked.</strong> ${escapeHTML(access.reason)}</p>
        <p>Each module opens when you pass the check at the end of the one before it, so you never build on a gap.</p>${nextLink(access.next)}</div>`;
      document.getElementById('ledger').textContent = 'The ledger page appears when the module opens.';
      return false;
    }
    // Placeholder first step until Task 5 renders real lesson steps.
    const done = progress.modules[module.id]?.steps.includes(0);
    body.innerHTML = `<p>This module's lessons are being written.</p>
      <p><button class="button" type="button" id="mark-step" ${done ? 'disabled' : ''}>${done ? 'Introduction read ✓' : 'Mark the introduction as read'}</button></p>`;
    document.getElementById('mark-step')?.addEventListener('click', () => {
      update((p) => markStep(p, module.id, 0));
      draw();
    });
    return true;
  }

  const opened = draw();
  onExternalChange(draw);
  if (opened) trackTime(module.id);
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
