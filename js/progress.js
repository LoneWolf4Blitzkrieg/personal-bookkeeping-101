// A learner's progress: what they have done, what is unlocked, and what to
// do after a failed check. Plain data, changed only by these functions,
// which always return a new object.

import { MODULES, CHECKPOINTS } from '../content/course.js';
import { longDate } from './dates.js';

export const PROGRESS_VERSION = 1;
const APP = 'personal-bookkeeping-101';
const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = 28;
const RECALL_SETS = 3;

export function emptyProgress(started = new Date().toISOString()) {
  return {
    version: PROGRESS_VERSION,
    started,
    modules: {},
    checkpoints: {},
    placement: {},
    exam: { attempts: [] },
    examPassedAt: null,
    sessions: {},
    recall: {},
    other: {},
    remedialNeeded: false,
    errorLog: [],
    ledgers: {},
  };
}

const clone = (p) => structuredClone(p);
const moduleRecord = (p, id) => (p.modules[id] ??= { steps: [], timeMs: 0, gateAttempts: [], passed: false });

const moduleTitle = (id) => {
  const m = MODULES.find((x) => x.id === id);
  if (!m) return id;
  return id.startsWith('m') ? `Module ${Number(id.slice(1))}` : `Add-on ${id.toUpperCase()}`;
};
const CHECKPOINT_NAMES = { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C' };

const modulePassed = (p, id) => Boolean(p.modules[id]?.passed);
const moduleIndex = (id) => MODULES.findIndex((m) => m.id === id);

// The furthest checkpoint passed, as a checkpoint or as a placement test.
// Passing a later checkpoint counts every earlier one.
function furthestCheckpoint(p) {
  let best = -1;
  CHECKPOINTS.forEach((c, i) => {
    if (p.checkpoints[c.id]?.passed || p.placement[c.id]?.passed) best = Math.max(best, i);
  });
  return best;
}
const checkpointPassed = (p, id) => furthestCheckpoint(p) >= CHECKPOINTS.findIndex((c) => c.id === id);
// Modules up to the furthest passed checkpoint stay open for review.
const coveredModule = (p, id) => {
  const best = furthestCheckpoint(p);
  return best >= 0 && moduleIndex(id) <= moduleIndex(CHECKPOINTS[best].after);
};

const open = { unlocked: true };
const locked = (reason, next) => ({ unlocked: false, reason, ...(next ? { next } : {}) });

export function isUnlocked(id, progress, now = Date.now()) {
  if (id === 'prereq' || id === 'placement' || id === 'm01' || id === 'placement-ca') return open;
  // The Module 9 placement test is a second stage: it covers Modules 5–8 and
  // opens once Modules 1–4 are counted as passed.
  if (id === 'placement-cb') return checkpointPassed(progress, 'ca') ? open : locked('Pass the Module 5 placement test (or Checkpoint A) first.', 'placement-ca');

  const cp = CHECKPOINTS.find((c) => c.id === id);
  if (cp) return modulePassed(progress, cp.after) || checkpointPassed(progress, id) ? open : locked(`Pass the check at the end of ${moduleTitle(cp.after)} first.`, cp.after);

  if (id === 'exam') return modulePassed(progress, 'a3') ? open : locked('Finish the add-on modules first.', 'a3');
  if (id === 'retention') {
    if (!progress.examPassedAt) return locked('This review opens four weeks after you pass the final exam.');
    const opens = Date.parse(progress.examPassedAt) + RETENTION_DAYS * DAY_MS;
    return now >= opens ? open : locked(`This review opens on ${longDate(opens)}, four weeks after your final exam.`);
  }

  const index = moduleIndex(id);
  if (index <= 0) return locked('There is no such module.');
  if (coveredModule(progress, id)) return open;
  const gateCheckpoint = CHECKPOINTS.find((c) => MODULES[index - 1].id === c.after);
  if (gateCheckpoint) {
    return checkpointPassed(progress, gateCheckpoint.id) ? open : locked(`Pass ${CHECKPOINT_NAMES[gateCheckpoint.id]} first${gateCheckpoint.id === 'cc' ? '' : ' (or the placement test)'}.`, gateCheckpoint.id);
  }
  const previous = MODULES[index - 1].id;
  return modulePassed(progress, previous) ? open : locked(`Finish ${moduleTitle(previous)} first.`, previous);
}

// items: per-question results [{ templateId, module, part, points, max, selfMarked }],
// kept for the evaluation plan (self-marking accuracy, per-module results).
export function recordGate(progress, moduleId, score, at, version, items = []) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  m.gateAttempts.push({ at, version, points: score.points, max: score.max, passed: score.passed, items });
  if (score.passed) m.passed = true;
  else p.recall[moduleId] = RECALL_SETS;
  delete p.sessions[moduleId];
  return p;
}

// For modules without a gate (the final project).
export function completeModule(progress, moduleId, at) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  m.passed = true;
  m.completedAt = at;
  return p;
}

// The final project's working state for one module: which month the learner
// keeps ('sample' or 'own'), whether the sample month's key figures were all
// right, and the checklist and rubric items ticked (by index).
export function saveProject(progress, moduleId, { path, figuresOk, checklist, rubric }) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  const before = m.project ?? { path: null, figuresOk: false, checklist: [], rubric: [] };
  m.project = {
    path: path ?? before.path,
    figuresOk: figuresOk ?? before.figuresOk,
    checklist: [...new Set(checklist ?? before.checklist)].sort((x, y) => x - y),
    rubric: [...new Set(rubric ?? before.rubric)].sort((x, y) => x - y),
  };
  return p;
}

// The name the learner wants on the certificate (kept with their progress,
// so it travels in a progress file).
export function saveCertificateName(progress, name) {
  const p = clone(progress);
  p.certificateName = String(name);
  return p;
}

export function recordCheckpoint(progress, id, score, at, version, items = []) {
  const p = clone(progress);
  const c = (p.checkpoints[id] ??= { attempts: [], passed: false });
  c.attempts.push({ at, version, percent: score.percent, passed: score.passed, missedModules: score.missedModules ?? [], items });
  if (score.passed) c.passed = true;
  delete p.sessions[id];
  return p;
}

// A placement test is a checkpoint taken early; passing it unlocks the
// module after that checkpoint.
// Placement tests have the ids "placement-ca" and "placement-cb".
export function recordPlacement(progress, checkpointId, score, at, version, items = []) {
  const p = clone(progress);
  const record = (p.placement[checkpointId] ??= { attempts: [], passed: false });
  record.attempts.push({ at, version, percent: score.percent, passed: score.passed, missedModules: score.missedModules ?? [], items });
  if (score.passed) record.passed = true;
  delete p.sessions[`placement-${checkpointId}`];
  return p;
}

// Other recorded checks: the prerequisite check ("prereq") and the
// four-week retention test ("retention"). A failed prerequisite check puts
// the learner in the group that needed the remedial unit.
export function recordOther(progress, id, score, at, version, items = []) {
  const p = clone(progress);
  const record = (p.other[id] ??= { attempts: [], passed: false });
  record.attempts.push({ at, version, percent: score.percent, passed: score.passed, items });
  if (score.passed) record.passed = true;
  if (id === 'prereq' && !score.passed) p.remedialNeeded = true;
  delete p.sessions[id];
  return p;
}

export function recordExam(progress, score, at, version, items = []) {
  const p = clone(progress);
  p.exam.attempts.push({ at, version, percent: score.percent, passed: score.passed, items });
  if (score.passed && !p.examPassedAt) p.examPassedAt = at;
  delete p.sessions.exam;
  return p;
}

// After a failed gate: 1st -> retake (after a fresh practice set),
// 2nd -> rework the worked example, 3rd and later -> remediation and help.
export function failureStep(failedAttempts) {
  if (failedAttempts <= 1) return 'retake';
  if (failedAttempts === 2) return 'rework-example';
  return 'remediation';
}

export function attemptsFor(progress, id) {
  if (id === 'exam') return progress.exam.attempts.length;
  const placement = /^placement-(c[abc])$/.exec(id);
  if (placement) return progress.placement[placement[1]]?.attempts.length ?? 0;
  if (progress.modules[id]) return progress.modules[id].gateAttempts.length;
  if (progress.checkpoints[id]) return progress.checkpoints[id].attempts.length;
  if (progress.other[id]) return progress.other[id].attempts.length;
  return 0;
}

// The version for the next sitting: an open session keeps its version;
// otherwise each attempt gets the next version number (1, 2, 3, ...).
export function nextVersion(progress, id) {
  const openOne = progress.sessions[id];
  if (openOne) return openOne.meta.version;
  return attemptsFor(progress, id) + 1;
}

// Before saving an answer: true only if no other tab has changed this
// sitting since this page started it (same version, same number of saved
// answers, and no attempt finished in the meantime).
export function sessionMatches(progress, meta, resultsBefore, attemptsAtStart) {
  if (attemptsFor(progress, meta.assessmentId) !== attemptsAtStart) return false;
  const stored = progress.sessions[meta.assessmentId];
  if (!stored) return resultsBefore === 0;
  return stored.meta.version === meta.version && stored.results.length === resultsBefore;
}

export function saveSession(progress, meta, results) {
  const p = clone(progress);
  p.sessions[meta.assessmentId] = { meta, results };
  return p;
}

export function openSession(progress, id) {
  return progress.sessions[id] ?? null;
}

export function clearSession(progress, id) {
  const p = clone(progress);
  delete p.sessions[id];
  return p;
}

export function markStep(progress, moduleId, step) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  if (!m.steps.includes(step)) m.steps.push(step);
  if (m.steps.every((s) => typeof s === 'number')) m.steps.sort((a, b) => a - b);
  return p;
}

export function addTime(progress, moduleId, ms) {
  const p = clone(progress);
  moduleRecord(p, moduleId).timeMs += Math.max(0, Math.round(ms));
  return p;
}

export function addErrorEntry(progress, { moduleId, error, cause, correction }, at) {
  const p = clone(progress);
  p.errorLog.push({ at, moduleId, error, cause, correction });
  return p;
}

export function saveLedger(progress, pageId, rows) {
  const p = clone(progress);
  p.ledgers[pageId] = structuredClone(rows);
  return p;
}

// A finished practice set: kept for the evaluation plan, and it counts down
// any recall questions scheduled after a failed gate.
// recalled lists the modules whose scheduled recall this set carried; only
// those count down. Without it (sittings saved before this rule), all do.
export function recordPractice(progress, moduleId, score, at, recalled = null) {
  const p = clone(progress);
  const m = moduleRecord(p, moduleId);
  (m.practice ??= []).push({ at, percent: score.percent });
  return completePracticeSet(p, recalled);
}

// Modules whose recall questions should be added to the next practice sets.
export function recallDue(progress) {
  return Object.entries(progress.recall).filter(([, n]) => n > 0).map(([id]) => id);
}

export function completePracticeSet(progress, recalled = null) {
  const p = clone(progress);
  for (const id of Object.keys(p.recall).filter((m) => recalled === null || recalled.includes(m))) {
    p.recall[id] -= 1;
    if (p.recall[id] <= 0) delete p.recall[id];
  }
  return p;
}

export function exportProgress(progress) {
  return JSON.stringify({ app: APP, ...progress }, null, 2);
}

const FIELDS = {
  started: 'string', modules: 'object', checkpoints: 'object', placement: 'object', exam: 'object',
  sessions: 'object', recall: 'object', other: 'object', remedialNeeded: 'boolean', errorLog: 'array', ledgers: 'object',
};

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

export function validateProgress(data) {
  if (typeOf(data) !== 'object') return 'This is not a progress file.';
  if (data.version !== PROGRESS_VERSION) return `This progress file is from a different version of the course (${data.version ?? 'unknown'}).`;
  for (const [field, type] of Object.entries(FIELDS)) {
    if (!(field in data)) return `This progress file is missing "${field}".`;
    if (typeOf(data[field]) !== type) return `This progress file has a damaged "${field}".`;
  }
  if (!(data.examPassedAt === null || typeof data.examPassedAt === 'string')) return 'This progress file has a damaged "examPassedAt".';
  if (data.certificateName !== undefined && typeof data.certificateName !== 'string') return 'This progress file has a damaged "certificateName".';
  if (!Array.isArray(data.exam.attempts)) return 'This progress file has a damaged "exam".';
  for (const [id, m] of Object.entries(data.modules)) {
    if (typeOf(m) !== 'object' || !Array.isArray(m.steps) || typeof m.timeMs !== 'number' || !Array.isArray(m.gateAttempts) || typeof m.passed !== 'boolean') {
      return `This progress file has a damaged record for ${id}.`;
    }
    if (m.project !== undefined) {
      const pr = m.project;
      const indices = (list) => Array.isArray(list) && list.every((i) => Number.isInteger(i) && i >= 0);
      if (typeOf(pr) !== 'object' || ![null, 'sample', 'own'].includes(pr.path) || typeof pr.figuresOk !== 'boolean' || !indices(pr.checklist) || !indices(pr.rubric)) {
        return `This progress file has a damaged final-project record for ${id}.`;
      }
    }
  }
  for (const group of ['checkpoints', 'placement', 'other']) {
    for (const [id, c] of Object.entries(data[group])) {
      if (typeOf(c) !== 'object' || !Array.isArray(c.attempts) || typeof c.passed !== 'boolean') return `This progress file has a damaged record for ${id}.`;
    }
  }
  for (const [id, s] of Object.entries(data.sessions)) {
    if (typeOf(s) !== 'object' || typeOf(s.meta) !== 'object' || !Array.isArray(s.results)) return `This progress file has a damaged sitting for ${id}.`;
  }
  return null;
}

export function importProgress(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'This file could not be read. Choose a progress file saved from this course.' };
  }
  if (typeOf(data) !== 'object' || data.app !== APP) return { ok: false, reason: 'This is not a Personal Bookkeeping 101 progress file.' };
  const { app, ...progress } = data;
  const problem = validateProgress(progress);
  if (problem) return { ok: false, reason: problem };
  return { ok: true, progress };
}
