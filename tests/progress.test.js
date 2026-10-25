import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress, isUnlocked, recordGate, recordCheckpoint, recordPlacement, recordExam, completeModule,
  failureStep, nextVersion, saveSession, openSession, clearSession, markStep, addTime, addErrorEntry,
  saveLedger, recallDue, completePracticeSet, exportProgress, importProgress, recordOther, sessionMatches,
} from '../js/progress.js';

const T0 = '2026-07-01T12:00:00.000Z';
const pass = { points: 9, max: 10, passed: true };
const fail = { points: 6, max: 10, passed: false };

function passGates(p, ids) {
  return ids.reduce((acc, id) => recordGate(acc, id, pass, T0, 1), p);
}
const core = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => `m${String(from + i).padStart(2, '0')}`);

test('a new learner can open module 1 only', () => {
  const p = emptyProgress(T0);
  assert.equal(isUnlocked('m01', p).unlocked, true);
  const m2 = isUnlocked('m02', p);
  assert.equal(m2.unlocked, false);
  assert.match(m2.reason, /Module 1/);
});

test('module 2 unlocks when module 1\'s gate is passed, not when it is failed', () => {
  let p = recordGate(emptyProgress(T0), 'm01', fail, T0, 1);
  assert.equal(isUnlocked('m02', p).unlocked, false);
  p = recordGate(p, 'm01', pass, T0, 2);
  assert.equal(isUnlocked('m02', p).unlocked, true);
});

test('module 5 waits for Checkpoint A, which waits for module 4', () => {
  let p = passGates(emptyProgress(T0), core(1, 3));
  assert.equal(isUnlocked('ca', p).unlocked, false);
  p = passGates(p, ['m04']);
  assert.equal(isUnlocked('ca', p).unlocked, true);
  assert.equal(isUnlocked('m05', p).unlocked, false);
  p = recordCheckpoint(p, 'ca', { percent: 85, passed: true, missedModules: [] }, T0, 1);
  assert.equal(isUnlocked('m05', p).unlocked, true);
});

test('passing Checkpoint A as a placement test unlocks module 5 directly', () => {
  const p = recordPlacement(emptyProgress(T0), 'ca', { percent: 90, passed: true, missedModules: [] }, T0, 1);
  assert.equal(isUnlocked('m05', p).unlocked, true);
  assert.equal(isUnlocked('m06', p).unlocked, false);
});

test('a failed placement test unlocks nothing', () => {
  const p = recordPlacement(emptyProgress(T0), 'cb', { percent: 60, passed: false, missedModules: ['m06'] }, T0, 1);
  assert.equal(isUnlocked('m09', p).unlocked, false);
});

test('the add-on unlocks after the final project, the exam after the add-on', () => {
  let p = passGates(emptyProgress(T0), core(1, 14));
  p = ['ca', 'cb', 'cc'].reduce((acc, id) => recordCheckpoint(acc, id, { percent: 90, passed: true, missedModules: [] }, T0, 1), p);
  assert.equal(isUnlocked('m15', p).unlocked, true);
  assert.equal(isUnlocked('a1', p).unlocked, false);
  p = completeModule(completeModule(p, 'm15', T0), 'm16', T0);
  assert.equal(isUnlocked('a1', p).unlocked, true);
  assert.equal(isUnlocked('exam', p).unlocked, false);
  p = passGates(p, ['a1', 'a2']);
  assert.equal(isUnlocked('exam', p).unlocked, false);
  p = passGates(p, ['a3']);
  assert.equal(isUnlocked('exam', p).unlocked, true);
});

test('the retention test unlocks 28 days after the exam is passed', () => {
  const p = recordExam(emptyProgress(T0), { percent: 85, passed: true }, '2026-08-01T10:00:00.000Z', 1);
  assert.equal(isUnlocked('retention', p, Date.parse('2026-08-28T10:00:00.000Z')).unlocked, false);
  assert.equal(isUnlocked('retention', p, Date.parse('2026-08-29T10:00:00.000Z')).unlocked, true);
  assert.equal(isUnlocked('retention', emptyProgress(T0)).unlocked, false);
});

test('the prerequisite check and placement test are always open', () => {
  assert.equal(isUnlocked('prereq', emptyProgress(T0)).unlocked, true);
  assert.equal(isUnlocked('placement', emptyProgress(T0)).unlocked, true);
});

test('unknown ids are locked with a reason', () => {
  const r = isUnlocked('m99', emptyProgress(T0));
  assert.equal(r.unlocked, false);
  assert.ok(r.reason);
});

test('failureStep follows the proposal\'s sequence', () => {
  assert.equal(failureStep(1), 'retake');
  assert.equal(failureStep(2), 'rework-example');
  assert.equal(failureStep(3), 'remediation');
  assert.equal(failureStep(7), 'remediation');
});

test('each new attempt gets the next version number', () => {
  let p = emptyProgress(T0);
  assert.equal(nextVersion(p, 'm01'), 1);
  for (let v = 1; v <= 4; v++) p = recordGate(p, 'm01', fail, T0, v);
  assert.equal(nextVersion(p, 'm01'), 5, 'a fifth attempt gets a fifth version, not a repeat');
  assert.equal(nextVersion(p, 'ca'), 1);
});

test('gate attempts are recorded with time, version and score', () => {
  const p = recordGate(emptyProgress(T0), 'm03', fail, T0, 2);
  assert.deepEqual(p.modules.m03.gateAttempts, [{ at: T0, version: 2, points: 6, max: 10, passed: false, items: [] }]);
});

test('a failed gate schedules that module\'s recall questions into the next three practice sets', () => {
  let p = recordGate(emptyProgress(T0), 'm03', fail, T0, 1);
  assert.deepEqual(recallDue(p), ['m03']);
  p = completePracticeSet(p);
  p = completePracticeSet(p);
  assert.deepEqual(recallDue(p), ['m03']);
  p = completePracticeSet(p);
  assert.deepEqual(recallDue(p), []);
});

test('an open session is saved and resumed, then cleared', () => {
  let p = saveSession(emptyProgress(T0), { assessmentId: 'm03', kind: 'gate', version: 2 }, [{ points: 2, max: 2 }]);
  assert.deepEqual(openSession(p, 'm03'), { meta: { assessmentId: 'm03', kind: 'gate', version: 2 }, results: [{ points: 2, max: 2 }] });
  assert.equal(nextVersion(p, 'm03'), 2, 'an open session keeps its version');
  p = clearSession(p, 'm03');
  assert.equal(openSession(p, 'm03'), null);
});

test('steps, time, error log and ledgers are recorded', () => {
  let p = markStep(emptyProgress(T0), 'm01', 2);
  p = markStep(p, 'm01', 2);
  p = addTime(p, 'm01', 60000);
  p = addTime(p, 'm01', 30000);
  p = addErrorEntry(p, { moduleId: 'm01', error: 'Wrote 10% as 1%', cause: 'Moved the point the wrong way', correction: '10% of $1,000 is $100' }, T0);
  p = saveLedger(p, 'saving', [{ date: '2026-06-06', debit: 100, credit: 0 }]);
  assert.deepEqual(p.modules.m01.steps, [2]);
  assert.equal(p.modules.m01.timeMs, 90000);
  assert.equal(p.errorLog.length, 1);
  assert.equal(p.errorLog[0].at, T0);
  assert.deepEqual(p.ledgers.saving, [{ date: '2026-06-06', debit: 100, credit: 0 }]);
});

test('progress functions never change their input', () => {
  const p = emptyProgress(T0);
  const before = JSON.stringify(p);
  recordGate(p, 'm01', pass, T0, 1);
  markStep(p, 'm01', 0);
  addErrorEntry(p, { moduleId: 'm01', error: 'e', cause: 'c', correction: 'x' }, T0);
  assert.equal(JSON.stringify(p), before);
});

test('export then import gives back exactly the same progress', () => {
  let p = passGates(emptyProgress(T0), ['m01', 'm02']);
  p = addErrorEntry(p, { moduleId: 'm02', error: 'e', cause: 'c', correction: 'x' }, T0);
  const r = importProgress(exportProgress(p));
  assert.equal(r.ok, true);
  assert.deepEqual(r.progress, p);
});

test('bad progress files are rejected with a reason', () => {
  const good = JSON.parse(exportProgress(emptyProgress(T0)));
  const cases = {
    'not json': '{oops',
    'not a course file': JSON.stringify({ hello: 1 }),
    'wrong version': JSON.stringify({ ...good, version: 99 }),
    'missing field': JSON.stringify((({ modules, ...rest }) => rest)(good)),
    'wrong type': JSON.stringify({ ...good, errorLog: 'nope' }),
  };
  for (const [name, text] of Object.entries(cases)) {
    const r = importProgress(text);
    assert.equal(r.ok, false, name);
    assert.equal(typeof r.reason, 'string', name);
  }
});

test('placement tests are separate per checkpoint, keep attempts and clear their own session', () => {
  let p = saveSession(emptyProgress(T0), { assessmentId: 'placement-ca', kind: 'placement', checkpointId: 'ca', version: 1 }, []);
  assert.equal(isUnlocked('placement-ca', p).unlocked, true);
  assert.equal(isUnlocked('placement-cb', p).unlocked, true);
  p = recordPlacement(p, 'ca', { percent: 50, passed: false, missedModules: ['m02'] }, T0, 1);
  assert.equal(openSession(p, 'placement-ca'), null);
  assert.equal(p.placement.ca.attempts.length, 1);
  assert.equal(nextVersion(p, 'placement-ca'), 2);
});

test('passing a later checkpoint counts the earlier ones and opens earlier modules for review', () => {
  const p = recordPlacement(emptyProgress(T0), 'cb', { percent: 90, passed: true, missedModules: [] }, T0, 1);
  for (const id of ['m02', 'm05', 'm06', 'm08', 'm09', 'ca', 'cb']) assert.equal(isUnlocked(id, p).unlocked, true, id);
  assert.equal(isUnlocked('m10', p).unlocked, false);
  assert.equal(isUnlocked('cc', p).unlocked, false);
});

test('a locked item says what to do next', () => {
  assert.equal(isUnlocked('m02', emptyProgress(T0)).next, 'm01');
  const p = passGates(emptyProgress(T0), core(1, 4));
  assert.equal(isUnlocked('m05', p).next, 'ca');
});

test('attempts keep per-item results for the evaluation plan', () => {
  const items = [{ templateId: 't1', module: 'm03', part: 'explaining', points: 1, max: 2, selfMarked: true }];
  const p = recordCheckpoint(emptyProgress(T0), 'ca', { percent: 80, passed: true, missedModules: [] }, T0, 1, items);
  assert.deepEqual(p.checkpoints.ca.attempts[0].items, items);
});

test('prerequisite and retention results are recorded, and remedial need follows the prerequisite', () => {
  let p = recordOther(emptyProgress(T0), 'prereq', { percent: 50, passed: false }, T0, 1, []);
  assert.equal(p.other.prereq.attempts.length, 1);
  assert.equal(p.remedialNeeded, true);
  p = recordOther(p, 'prereq', { percent: 90, passed: true }, T0, 2, []);
  assert.equal(p.remedialNeeded, true, 'once needed, the pilot keeps the learner in that group');
  assert.equal(openSession(p, 'prereq'), null);
});

test('a sitting only saves if no other tab has changed it', () => {
  const meta = { assessmentId: 'm03', kind: 'gate', version: 1 };
  let p = saveSession(emptyProgress(T0), meta, [{ templateId: 'a' }]);
  assert.equal(sessionMatches(p, meta, 1, 0), true, 'one answer saved, about to save the second');
  assert.equal(sessionMatches(p, meta, 0, 0), false, 'another tab already saved an answer');
  p = recordGate(p, 'm03', fail, T0, 1);
  assert.equal(sessionMatches(p, meta, 1, 0), false, 'another tab already finished this attempt');
  assert.equal(sessionMatches(emptyProgress(T0), meta, 0, 0), true, 'first answer of a new sitting');
});

test('imported files with damaged module records are rejected', () => {
  const good = JSON.parse(exportProgress(emptyProgress(T0)));
  const r = importProgress(JSON.stringify({ ...good, modules: { m01: {} } }));
  assert.equal(r.ok, false);
});
