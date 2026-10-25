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
};

for (const [name, pattern] of Object.entries(expectations)) {
  test(`content rule catches: ${name}`, () => {
    const problems = checkModule(badModules[name]);
    assert.ok(problems.some((p) => pattern.test(p)), `${name}: ${JSON.stringify(problems)}`);
  });
}

test('a gate must have interpreting, producing and explaining templates', () => {
  assert.deepEqual(checkAssessment({ id: 'm03', kind: 'gate', templates: gateTemplates }), []);
  const problems = checkAssessment({ id: 'm03', kind: 'gate', templates: gateTemplates.slice(0, 3) });
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
