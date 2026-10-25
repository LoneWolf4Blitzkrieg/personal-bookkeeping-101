// One sitting of a gate, checkpoint or exam: the learner answers the items in
// order. Pure and immutable so it can be tested and saved.

import { gradeItem, scoreGate, scoreCheckpoint, scoreExam } from './grade.js';

// meta: { assessmentId, kind: 'gate'|'checkpoint'|'exam'|'placement'|'retention', version }
export function createSession(items, meta = { kind: 'gate' }) {
  return { items, meta, results: [], last: null };
}

// Rebuilds a sitting from saved results. Results are kept only while they
// line up with the items (same template, same order).
export function resumeSession(items, meta, savedResults = []) {
  const results = [];
  for (const r of savedResults) {
    if (items[results.length]?.templateId !== r.templateId) break;
    results.push(r);
  }
  return { items, meta, results, last: null };
}

export function currentItem(session) {
  return session.items[session.results.length] ?? null;
}

export function isComplete(session) {
  return session.results.length === session.items.length;
}

// Grades the response to the current item. Invalid input and the first step
// of a self-marked explanation (showing the model answer) leave the learner
// on the same item; everything else records a result and moves on.
export function submit(session, response) {
  const item = currentItem(session);
  if (!item) return session;
  const result = gradeItem(item, response);
  if (result.invalid || (result.selfMarked && result.points === undefined)) {
    return { ...session, last: result };
  }
  const recorded = { ...result, module: item.module, part: item.part, templateId: item.templateId, response };
  return { ...session, results: [...session.results, recorded], last: recorded };
}

const SCORERS = { gate: scoreGate, checkpoint: scoreCheckpoint, placement: scoreCheckpoint, exam: scoreExam, retention: scoreExam, prereq: scoreExam, practice: scoreExam };

export function summary(session) {
  return (SCORERS[session.meta?.kind] ?? scoreGate)(session.results);
}
