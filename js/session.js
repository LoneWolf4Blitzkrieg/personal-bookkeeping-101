// One sitting of a gate, checkpoint or exam: the learner answers the items in
// order. Pure and immutable so it can be tested and saved.

import { gradeItem, scoreGate } from './grade.js';

export function createSession(items) {
  return { items, results: [], last: null };
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

export function summary(session) {
  return scoreGate(session.results);
}
