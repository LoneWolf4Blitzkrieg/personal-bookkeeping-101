// The lesson page controller: course map, lock notice, the lesson's steps
// with the ledger pinned beside them, step progress and time on the module.

import { MODULES, PHASES, PREREQUISITE } from '../../content/course.js';
import { renderCourseMap, moduleIdFromParam } from './nav.js';
import { isUnlocked, markStep, saveProject, completeModule } from '../progress.js';
import { parseAmount } from '../money.js';
import { escapeHTML } from '../html.js';
import { MODULE_CONTENT } from '../../content/modules/index.js';
import { DEMO_LESSON } from '../../content/modules/demo.js';
import { stepHTML, ledgerPanelHTML, gradePrediction } from '../lessonView.js';
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
  const isDemo = param === 'demo';
  const isPrereq = param === 'prereq';
  const id = param === null ? 'm01' : isDemo || isPrereq ? param : moduleIdFromParam(param);
  const module = isDemo ? { id: 'demo', title: DEMO_LESSON.title, phase: null }
    : isPrereq ? { id: 'prereq', title: PREREQUISITE.title, phase: null }
      : MODULES.find((m) => m.id === id);
  const content = isDemo ? DEMO_LESSON : MODULE_CONTENT[id];
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
  document.getElementById('crumb').textContent = isDemo ? 'Sample lesson' : isPrereq ? 'Before you start' : PHASES[module.phase];
  document.title = `${module.title} · Personal Bookkeeping 101`;

  const ledgerBox = document.getElementById('ledger');
  let index = null;
  const revealed = new Set();
  const feedback = {};
  let figureResults = null;

  // The saved final-project record, with whether the module is complete.
  const projectState = () => {
    const record = store.load().modules[module.id];
    return { ...(record?.project ?? {}), completed: Boolean(record?.passed), figureResults };
  };

  function drawStep(focus) {
    const step = content.steps[index];
    body.innerHTML = stepHTML(content, index, { revealed: revealed.has(index), feedback: feedback[index], project: step.kind === 'project' ? projectState() : null });
    const panel = ledgerPanelHTML(step, { revealed: revealed.has(index) });
    ledgerBox.className = panel ? 'ledger-content' : 'ledger-placeholder';
    ledgerBox.innerHTML = panel
      ? `${panel}<p class="print-link"><a href="print.html?lesson=${encodeURIComponent(content.id)}&amp;step=${encodeURIComponent(step.id)}">Print this page</a></p>`
      : 'No ledger page for this step.';
    if (focus) (body.querySelector('#prediction-feedback') ?? body.querySelector('#prediction') ?? body.querySelector('#step-title'))?.focus();
    // Reaching the end of the lesson counts the last step as done.
    const last = index === content.steps.length - 1;
    const waiting = step.kind === 'predict' && !revealed.has(index);
    if (!isDemo && last && !waiting && !store.load().modules[module.id]?.steps.includes(step.id)) update((p) => markStep(p, module.id, step.id));
  }

  body.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action || index === null) return;
    if (action === 'next') {
      if (!isDemo) update((p) => markStep(p, module.id, content.steps[index].id));
      index += 1;
      drawStep(true);
    }
    if (action === 'back') { index -= 1; drawStep(true); }
    if (action === 'complete-project') {
      const step = content.steps[index];
      const state = projectState();
      const ready = (state.path === 'own' || state.figuresOk) && state.checklist?.length === step.checklist.length && state.rubric?.length === step.rubric.length;
      if (ready && !state.completed) update((p) => completeModule(p, module.id, new Date().toISOString()));
      renderCourseMap(mapBox, store.load(), module.id, { headingLevel: 3 });
      drawStep(false);
      body.querySelector('.project-check [role="status"]')?.focus();
    }
    if (action === 'reread') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      body.querySelector('#step-title')?.focus();
    }
  });

  // Final project: the month chosen and each tick are saved as they change.
  body.addEventListener('change', (e) => {
    if (index === null || isDemo || content.steps[index].kind !== 'project') return;
    const input = e.target;
    if (input.name === 'project-path') {
      figureResults = null;
      update((p) => saveProject(p, module.id, { path: input.value }));
    } else if (input.dataset.list) {
      const list = input.dataset.list;
      const ticked = new Set(projectState()[list] ?? []);
      if (input.checked) ticked.add(Number(input.value)); else ticked.delete(Number(input.value));
      update((p) => saveProject(p, module.id, { [list]: [...ticked] }));
    } else return;
    drawStep(false);
    // Redrawing replaced the control, so put the focus back on its copy.
    body.querySelector(input.dataset.list ? `[data-list="${input.dataset.list}"][value="${input.value}"]` : `[name="${input.name}"][value="${input.value}"]`)?.focus();
  });

  body.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.dataset.kind === 'project-figures') {
      const step = content.steps[index];
      const typed = [...e.target.querySelectorAll('[name="figure"]')].map((x) => parseAmount(x.value));
      figureResults = step.figures.map((f, i) => typed[i].ok && typed[i].cents === f.answer);
      if (figureResults.every(Boolean)) update((p) => saveProject(p, module.id, { figuresOk: true }));
      const values = typed.map((t, i) => e.target.querySelectorAll('[name="figure"]')[i].value);
      drawStep(false);
      body.querySelectorAll('[name="figure"]').forEach((x, i) => { x.value = values[i]; });
      (body.querySelector('.figure-wrong')?.closest('.amount-field')?.querySelector('input') ?? body.querySelector('.project-list input'))?.focus();
      return;
    }
    if (e.target.dataset.kind !== 'predict') return;
    const result = gradePrediction(content.steps[index], e.target.prediction.value);
    feedback[index] = result;
    if (!result.invalid) revealed.add(index);
    drawStep(!result.invalid);
    if (result.invalid) body.querySelector('#prediction')?.focus();
  });

  function draw() {
    const progress = store.load();
    renderCourseMap(mapBox, progress, isDemo || isPrereq ? null : module.id, { headingLevel: 3 });
    const access = isDemo ? { unlocked: true } : isUnlocked(module.id, progress);
    if (!access.unlocked) {
      body.innerHTML = `<div class="lock-notice"><p><strong>This module is locked.</strong> ${escapeHTML(access.reason)}</p>
        <p>Each module opens when you pass the check at the end of the one before it, so you never build on a gap.</p>${nextLink(access.next)}</div>`;
      document.getElementById('ledger').textContent = 'The ledger page appears when the module opens.';
      return false;
    }
    if (!content) {
      body.innerHTML = '<p>This module\'s lessons are being written.</p>';
      return true;
    }
    if (index === null) {
      // Pick up at the first step not yet done (steps are saved by id, so
      // a step added later is not skipped).
      const done = new Set(progress.modules[module.id]?.steps ?? []);
      index = content.steps.findIndex((s) => !done.has(s.id));
      if (index === -1) index = 0;
    }
    drawStep(false);
    return true;
  }

  const opened = draw();
  onExternalChange(() => { if (index === null || !content) draw(); else renderCourseMap(mapBox, store.load(), isDemo ? null : module.id, { headingLevel: 3 }); });
  if (opened && !isDemo) trackTime(module.id);
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
