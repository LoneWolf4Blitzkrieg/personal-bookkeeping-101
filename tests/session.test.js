import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessmentVersions } from '../js/items.js';
import { createSession, submit, currentItem, isComplete, summary } from '../js/session.js';
import { fourTemplates } from './fixtures/templates.js';
import { formatCents } from '../js/money.js';

const items = assessmentVersions(fourTemplates, 'm03', { count: 4 })[0];

function answerAllCorrectly(session) {
  let s = session;
  s = submit(s, formatCents(items[0].answer));
  s = submit(s, formatCents(items[1].answer));
  s = submit(s, items[2].answer.map((l) => ({ ...l })));
  s = submit(s, { text: 'Saving is an asset; assets increase with a debit.' });
  s = submit(s, { text: 'Saving is an asset; assets increase with a debit.', ticks: [true, true] });
  return s;
}

test('a session remembers which assessment and version it is', () => {
  const s = createSession(items, { assessmentId: 'm03', kind: 'gate', version: 2 });
  assert.deepEqual(s.meta, { assessmentId: 'm03', kind: 'gate', version: 2 });
});

test('checkpoint and exam sessions are scored with their own rules', () => {
  let s = createSession(items, { assessmentId: 'ca', kind: 'checkpoint', version: 1 });
  s = submit(s, formatCents(items[0].answer));
  s = submit(s, '0.01'); // valid but wrong
  s = submit(s, items[2].answer);
  s = submit(s, { text: 'x' });
  s = submit(s, { text: 'x', ticks: [true, true] });
  const r = summary(s);
  assert.equal(r.percent, 80);
  assert.equal(r.passed, true);
  assert.deepEqual(r.missedModules, ['m01']);
});

test('a session walks through the items in order', () => {
  let s = createSession(items);
  assert.equal(currentItem(s), items[0]);
  s = submit(s, formatCents(items[0].answer));
  assert.equal(currentItem(s), items[1]);
  assert.equal(s.results[0].correct, true);
});

test('invalid input is reported but does not use up the question', () => {
  const s = submit(createSession(items), 'lots');
  assert.equal(currentItem(s), items[0]);
  assert.equal(s.results.length, 0);
  assert.equal(s.last.invalid, true);
});

test('an explanation item waits for the learner\'s ticks before it counts', () => {
  let s = createSession(items);
  s = submit(s, formatCents(items[0].answer));
  s = submit(s, formatCents(items[1].answer));
  s = submit(s, items[2].answer);
  s = submit(s, { text: 'Because it is an asset.' });
  assert.equal(currentItem(s), items[3], 'still on the explanation');
  assert.equal(s.last.selfMarked, true);
  assert.ok(s.last.modelAnswer);
  s = submit(s, { text: 'Because it is an asset.', ticks: [true, false] });
  assert.equal(isComplete(s), true);
  assert.equal(s.results[3].points, 1);
});

test('the summary scores the gate', () => {
  const s = answerAllCorrectly(createSession(items));
  assert.deepEqual(summary(s), { points: 10, max: 10, producing: 4, passed: true });
});

test('sessions are not changed in place', () => {
  const s = createSession(items);
  submit(s, formatCents(items[0].answer));
  assert.equal(s.results.length, 0);
});

test('a saved session resumes at the next unanswered item', async () => {
  const { resumeSession } = await import('../js/session.js');
  let s = createSession(items, { assessmentId: 'm03', kind: 'gate', version: 1 });
  s = submit(s, formatCents(items[0].answer));
  const resumed = resumeSession(items, s.meta, s.results);
  assert.equal(currentItem(resumed), items[1]);
  assert.deepEqual(resumed.results, s.results);
});

test('resuming ignores saved results that do not match the items', async () => {
  const { resumeSession } = await import('../js/session.js');
  const resumed = resumeSession(items, { assessmentId: 'm03', kind: 'gate', version: 1 }, [{ templateId: 'something-else', points: 2, max: 2 }]);
  assert.equal(resumed.results.length, 0);
});
