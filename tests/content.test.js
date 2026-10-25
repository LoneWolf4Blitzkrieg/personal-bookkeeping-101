import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkModule, checkAssessment } from '../js/contentRules.js';
import { MODULE_CONTENT } from '../content/modules/index.js';
import { ASSESSMENTS } from '../content/assess/index.js';
import { goodModule, badModules } from './fixtures/modules.js';
import { gateTemplates } from './fixtures/templates.js';

test('a well-formed module passes every rule', () => {
  assert.deepEqual(checkModule(goodModule), []);
});

const expectations = {
  unbalancedJournal: /does not balance/,
  wrongStoredBalance: /balance/,
  wrongStoredSide: /side/,
  untaughtIdea: /trial-balance.*not taught yet/,
  unknownIdea: /made-up-idea/,
  missingSource: /no-such-source/,
  unofficialResource: /official/,
  unknownResource: /no-such-resource/,
  askGivesAwayAnswer: /gives away/,
  earlyColumnsInModule1: /activeColumns/,
  stepWithoutUses: /uses/,
  folioTooEarly: /[Ff]olio/,
  ticksTooEarly: /posted/,
  journalTooEarly: /journal/,
  promptWithoutAnswer: /model answer/,
  stepWithoutId: /id/,
  duplicateStepIds: /duplicate/,
  noSteps: /no steps/,
  predictAnswerShown: /shows the answer/,
  predictWithoutAnswer: /answer/,
  askBalanceThenLaterShown: /gives away/,
  journalInModule1: /journal/,
  emptyActiveColumnsModule1: /activeColumns/,
  untaughtIdeaInPractice: /trial-balance.*not taught yet/,
  sourceDocNotCents: /cents/,
};

for (const [name, pattern] of Object.entries(expectations)) {
  test(`content rule catches: ${name}`, () => {
    const problems = checkModule(badModules[name]);
    assert.ok(problems.some((p) => pattern.test(p)), `${name}: ${JSON.stringify(problems)}`);
  });
}

test('a gate\'s questions must belong to that module', () => {
  const stray = gateTemplates.map((t) => ({ ...t, module: 'm03' }));
  stray[0] = { ...stray[0], module: 'm09' };
  const problems = checkAssessment({ id: 'm03', kind: 'gate', templates: stray });
  assert.ok(problems.some((p) => /m09/.test(p)), JSON.stringify(problems));
});

test('prerequisite ideas are usable from the prerequisite check onward', () => {
  const m = { id: 'prereq', position: 'prereq', steps: [{ id: 'd', kind: 'explain', text: ['x'], uses: ['decimals', 'percentages'] }] };
  assert.deepEqual(checkModule(m), []);
});

test('a gate must have interpreting, producing and explaining templates', () => {
  assert.deepEqual(checkAssessment({ id: 'fx-gate', kind: 'gate', templates: gateTemplates }), []);
  const problems = checkAssessment({ id: 'fx-gate', kind: 'gate', templates: gateTemplates.slice(0, 3) });
  assert.ok(problems.some((p) => /explaining/.test(p)));
});

test('every module in the course passes the content rules', () => {
  for (const [id, module] of Object.entries(MODULE_CONTENT)) {
    assert.deepEqual(checkModule(module), [], id);
  }
});

test('every assessment in the course passes the content rules', () => {
  for (const [id, a] of Object.entries(ASSESSMENTS)) {
    assert.deepEqual(checkAssessment(a), [], id);
  }
});

test('the sample lesson passes the content rules', async () => {
  const { DEMO_LESSON } = await import('../content/modules/demo.js');
  assert.deepEqual(checkModule(DEMO_LESSON), []);
});

test('Modules 1–8 each have a lesson, a gate, a practice set, extra and remedial practice, and recall questions', async () => {
  for (const id of ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08']) {
    assert.ok(MODULE_CONTENT[id], `${id} lesson`);
    assert.ok(MODULE_CONTENT[id].recallTemplates?.length >= 1, `${id} recall`);
    for (const suffix of ['', '-practice', '-extra', '-remedial']) assert.ok(ASSESSMENTS[id + suffix], `${id}${suffix}`);
  }
});

test('Checkpoint A covers every module from 1 to 4 and has two versions', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const ca = ASSESSMENTS.ca;
  assert.deepEqual([...new Set(ca.templates.map((t) => t.module))], ['m01', 'm02', 'm03', 'm04']);
  assert.equal(assessmentVersions(ca.templates, 'ca', { count: 2 }).length, 2);
});

test('Checkpoint B covers every module from 5 to 8 and has two versions', async () => {
  const { assessmentVersions } = await import('../js/items.js');
  const cb = ASSESSMENTS.cb;
  assert.equal(cb.kind, 'checkpoint');
  assert.deepEqual([...new Set(cb.templates.map((t) => t.module))], ['m05', 'm06', 'm07', 'm08']);
  assert.equal(assessmentVersions(cb.templates, 'cb', { count: 2 }).length, 2);
});

test('the placement tests cover every module they skip', () => {
  const a = ASSESSMENTS['placement-ca'];
  const b = ASSESSMENTS['placement-cb'];
  assert.deepEqual([a.kind, a.checkpointId, b.kind, b.checkpointId], ['placement', 'ca', 'placement', 'cb']);
  assert.deepEqual([...new Set(a.templates.map((t) => t.module))], ['m01', 'm02', 'm03', 'm04']);
  assert.deepEqual([...new Set(b.templates.map((t) => t.module))], ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08']);
});

test('from Module 5, practice sets mix in recall and a production task from earlier modules', () => {
  for (const id of ['m05', 'm06', 'm07', 'm08']) {
    const set = ASSESSMENTS[`${id}-practice`].templates;
    const earlier = set.filter((t) => t.module !== id);
    assert.ok(earlier.length / set.length >= 0.2, `${id}: ${earlier.length} of ${set.length} from earlier modules`);
    assert.ok(earlier.some((t) => t.part === 'producing'), `${id}: no earlier production task`);
  }
});

test('ledger pages in Modules 5–8 use the account numbers from the chart of accounts', async () => {
  const { CHART } = await import('../content/helpers.js');
  const byName = new Map(Object.values(CHART).map((a) => [a.name, a]));
  const pages = [];
  const walk = (o) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (Array.isArray(o.rows) && o.type) pages.push(o); Object.values(o).forEach(walk); }
  };
  for (const id of ['m02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08']) walk(MODULE_CONTENT[id]);
  for (const p of pages) {
    const a = byName.get(p.account);
    if (a) assert.equal(p.accountNo, a.no, `${p.account} should be account ${a.no}`);
  }
});
