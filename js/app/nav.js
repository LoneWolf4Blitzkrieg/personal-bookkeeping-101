// The course map: every module grouped by phase, with the checkpoints in
// place and the current module marked. courseMapHTML is pure so it can be
// tested in Node; renderCourseMap puts it on the page.

import { MODULES, PHASES, CHECKPOINTS } from '../../content/course.js';
import { escapeHTML } from '../html.js';
import { isUnlocked, emptyProgress } from '../progress.js';

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

function state(progress, id, done) {
  if (done) return { cls: ' done', note: ' (done)' };
  if (!isUnlocked(id, progress).unlocked) return { cls: ' locked', note: ' (locked)' };
  return { cls: '', note: '' };
}

export function courseMapHTML(progress, currentId, modules = MODULES, { headingLevel = 2 } = {}) {
  progress = { ...emptyProgress(''), ...(progress ?? {}) };
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
    const s = state(progress, m.id, progress.modules[m.id]?.passed);
    const note = s.note ? `<span class="visually-hidden">${s.note}</span>` : '';
    parts.push(`<li><a class="map-module${s.cls}" href="lesson.html?m=${escapeHTML(m.id)}"${current}>${escapeHTML(moduleLabel(m))}${note}</a></li>`);
    const cp = CHECKPOINTS.find((c) => c.after === m.id);
    if (cp) {
      const c = state(progress, cp.id, progress.checkpoints[cp.id]?.passed || progress.placement[cp.id]?.passed);
      const cnote = c.note ? `<span class="visually-hidden">${c.note}</span>` : '';
      parts.push(`<li><a class="map-checkpoint${c.cls}" href="assess.html?id=${cp.id}">${CHECKPOINT_LABELS[cp.id]}${cnote}</a></li>`);
    }
  }
  if (phase !== null) parts.push('</ol>');
  // After the add-on: the final exam, the certificate and the four-week review.
  if (modules === MODULES) {
    const exam = state(progress, 'exam', Boolean(progress.examPassedAt));
    const certificate = progress.examPassedAt && progress.modules.m15?.passed && progress.modules.m16?.passed ? { cls: '', note: '' } : { cls: ' locked', note: ' (locked)' };
    const review = state(progress, 'retention', progress.other.retention?.attempts?.length > 0);
    const item = (href, label, s) => `<li><a class="map-checkpoint${s.cls}" href="${href}">${label}${s.note ? `<span class="visually-hidden">${s.note}</span>` : ''}</a></li>`;
    parts.push(`<${h} class="map-phase">The finish</${h}><ol class="map-list">${item('assess.html?id=exam', 'Final exam', exam)}${item('certificate.html', 'Your certificate', certificate)}${item('assess.html?id=retention', 'Four-week review', review)}</ol>`);
  }
  return parts.join('');
}

export function renderCourseMap(container, progress, currentId, options) {
  container.innerHTML = courseMapHTML(progress, currentId, MODULES, options);
}
