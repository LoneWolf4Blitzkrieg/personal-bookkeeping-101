// The course map: every module grouped by phase, with the checkpoints in
// place and the current module marked. courseMapHTML is pure so it can be
// tested in Node; renderCourseMap puts it on the page.

import { MODULES, PHASES, CHECKPOINTS } from '../../content/course.js';
import { escapeHTML } from '../html.js';

const CHECKPOINT_LABELS = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C' };

function moduleLabel(m) {
  return m.id.startsWith('m') ? `${Number(m.id.slice(1))}. ${m.title}` : `${m.id.toUpperCase()}. ${m.title}`;
}

// Accepts the forms a learner or link might use: "9", "09", "m09", "A1".
// Canonical ids are the MODULES ids ("m09", "a1").
export function moduleIdFromParam(text, modules = MODULES) {
  if (text == null) return null;
  const raw = String(text).trim().toLowerCase();
  const id = /^\d{1,2}$/.test(raw) ? `m${raw.padStart(2, '0')}` : raw;
  return modules.some((m) => m.id === id) ? id : null;
}

export function courseMapHTML(progress, currentId, modules = MODULES, { headingLevel = 2 } = {}) {
  const h = `h${headingLevel}`;
  const parts = [];
  let phase = null;
  for (const m of modules) {
    if (m.phase !== phase) {
      if (phase !== null) parts.push('</ol>');
      phase = m.phase;
      parts.push(`<${h} class="map-phase">${escapeHTML(PHASES[phase] ?? phase)}</${h}><ol class="map-list">`);
    }
    const current = m.id === currentId ? ' aria-current="page"' : '';
    parts.push(`<li><a class="map-module" href="lesson.html?m=${escapeHTML(m.id)}"${current}>${escapeHTML(moduleLabel(m))}</a></li>`);
    const cp = CHECKPOINTS.find((c) => c.after === m.id);
    if (cp) {
      parts.push(`<li><a class="map-checkpoint" href="assess.html?id=${cp.id}">${CHECKPOINT_LABELS[cp.id]}</a></li>`);
    }
  }
  if (phase !== null) parts.push('</ol>');
  return parts.join('');
}

export function renderCourseMap(container, progress, currentId, options) {
  container.innerHTML = courseMapHTML(progress, currentId, MODULES, options);
}
