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
