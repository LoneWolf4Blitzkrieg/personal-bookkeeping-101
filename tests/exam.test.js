import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINAL_EXAM, EXAM_ADDON } from '../content/assess/exam.js';
import { RETENTION } from '../content/assess/retention.js';
import { MODULES, PHASES } from '../content/course.js';
import { HONOR_NOTES, honorNoteHTML } from '../content/honor.js';
import { examIntroHTML } from '../js/examView.js';
import { celebrationHTML } from '../js/celebration.js';
import { CELEBRATION, AUTHOR_WORDS } from '../content/celebration.js';
import { assessmentVersions } from '../js/items.js';
import { emptyProgress, isUnlocked, recordExam, recordGate } from '../js/progress.js';

const isAddon = (t) => /^a\d$/.test(t.module);
const points = (list) => list.reduce((s, t) => s + t.points, 0);

test('the final exam has exactly 50 questions, and the add-on is at most 20% of its questions and points', () => {
  const t = FINAL_EXAM.templates;
  assert.equal(t.length, 50);
  assert.equal(new Set(t.map((x) => x.id)).size, 50, 'no question twice');
  const addon = t.filter(isAddon);
  assert.deepEqual(addon.map((x) => x.id).sort(), EXAM_ADDON.map((x) => x.id).sort());
  assert.ok(addon.length <= 0.2 * t.length, `${addon.length} add-on questions`);
  assert.ok(points(addon) <= 0.2 * points(t), `${points(addon)} of ${points(t)} points from the add-on`);
  assert.ok(addon.length > 0, 'the add-on is on the exam (it is required)');
});

test('every module of the main course and every phase is on the final exam', () => {
  const modules = new Set(FINAL_EXAM.templates.map((t) => t.module));
  for (const m of MODULES.filter((x) => x.ideas.length > 0)) assert.ok(modules.has(m.id), `${m.id} is missing`);
  for (const phase of Object.keys(PHASES)) assert.ok(MODULES.some((m) => m.phase === phase && modules.has(m.id)), `${phase} is missing`);
  assert.ok(FINAL_EXAM.templates.some((t) => t.part === 'producing') && FINAL_EXAM.templates.some((t) => t.part === 'explaining'), 'interpretation, production and explanation, like the gates');
});

test('the exam makes two different versions, and its questions run in course order', () => {
  const [v1, v2] = assessmentVersions(FINAL_EXAM.templates, FINAL_EXAM.id, { count: 2 });
  assert.equal(v1.length, 50);
  assert.ok(v1.some((item, i) => JSON.stringify(item.answer ?? item.prompt) !== JSON.stringify(v2[i].answer ?? v2[i].prompt)));
  const order = FINAL_EXAM.templates.map((t) => MODULES.findIndex((m) => m.id === t.module));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test('the exam opens after the add-on, and the four-week review 28 days after the exam is passed', () => {
  let p = emptyProgress('2026-10-01T00:00:00.000Z');
  assert.equal(isUnlocked('exam', p).unlocked, false);
  p = recordGate(p, 'a3', { points: 24, max: 24, passed: true }, '2026-10-01T00:00:00.000Z', 1);
  assert.equal(isUnlocked('exam', p).unlocked, true);
  p = recordExam(p, { percent: 85, passed: true }, '2026-10-02T00:00:00.000Z', 1);
  assert.equal(isUnlocked('retention', p, Date.parse('2026-10-20T00:00:00.000Z')).unlocked, false);
  assert.equal(isUnlocked('retention', p, Date.parse('2026-10-30T00:00:01.000Z')).unlocked, true);
});

test('the four-week review is 10 questions from the main course only', () => {
  assert.equal(RETENTION.templates.length, 10);
  assert.ok(RETENTION.templates.every((t) => t && !isAddon(t)), 'no add-on questions');
  assert.equal(new Set(RETENTION.templates.map((t) => t.id)).size, 10);
});

test('before the first question, the exam shows the author\'s note on honest work', () => {
  const html = examIntroHTML();
  assert.ok(html.includes(honorNoteHTML('exam')));
  assert.match(HONOR_NOTES.exam.paragraphs.join(' '), /Earn your certificate\.$/);
  assert.match(html, /data-action="begin-exam"/);
});

test('the celebration keeps the author\'s words, starts only from a click, and can be stopped', () => {
  for (const words of ['You have passed!', 'your ancestors and God almighty are proud of your accomplishment', 'It\'s okay to smile now!']) assert.ok(CELEBRATION.message.includes(words), words);
  assert.match(AUTHOR_WORDS, /^Congratulations! You have passed!/);
  const html = celebrationHTML();
  assert.match(html, /data-action="celebrate"/);
  assert.match(html, /data-action="stop-celebration" hidden/);
  assert.ok(!/<audio[^>]*autoplay/.test(html), 'no autoplay');
  assert.ok(html.includes('href="certificate.html"'));
  assert.ok(html.includes('not covered by the course license'));
  assert.match(html, /<a href="media\/notice.html">/);
});
