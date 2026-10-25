// The course map: every module grouped by phase, with the checkpoints in
// place and the current module marked. courseMapHTML is pure so it can be
// tested in Node; renderCourseMap puts it on the page.

import { MODULES, PHASES, CHECKPOINTS } from '../../content/course.js';

const CHECKPOINT_LABELS = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C' };

export function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function moduleLabel(m) {
  return m.id.startsWith('m') ? `${Number(m.id.slice(1))}. ${m.title}` : `${m.id.toUpperCase()}. ${m.title}`;
}

export function courseMapHTML(progress, currentId, modules = MODULES) {
  const parts = [];
  let phase = null;
  for (const m of modules) {
    if (m.phase !== phase) {
      if (phase !== null) parts.push('</ol>');
      phase = m.phase;
      parts.push(`<h2 class="map-phase">${escapeHTML(PHASES[phase] ?? phase)}</h2><ol class="map-list">`);
    }
    const current = m.id === currentId ? ' aria-current="page"' : '';
    parts.push(`<li><a class="map-module" href="lesson.html?m=${m.id}"${current}>${escapeHTML(moduleLabel(m))}</a></li>`);
    const cp = CHECKPOINTS.find((c) => c.after === m.id);
    if (cp) {
      parts.push(`<li><a class="map-checkpoint" href="assess.html?id=${cp.id}">${CHECKPOINT_LABELS[cp.id]}</a></li>`);
    }
  }
  if (phase !== null) parts.push('</ol>');
  return parts.join('');
}

export function renderCourseMap(container, progress, currentId) {
  container.innerHTML = courseMapHTML(progress, currentId);
}
