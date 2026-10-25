import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateItem, gateVersions, assessmentVersions, seedFor } from '../js/items.js';
import { splitBalance, gateTemplates, explainDebit } from './fixtures/templates.js';

test('the same template and seed always give the same item', () => {
  assert.deepEqual(generateItem(splitBalance, 12345), generateItem(splitBalance, 12345));
});

test('generated items carry the template id, module, kind, part, points and parameters', () => {
  const item = generateItem(splitBalance, 7);
  assert.equal(item.templateId, 'fx-split-balance');
  assert.equal(item.module, 'm01');
  assert.equal(item.kind, 'numeric');
  assert.equal(item.part, 'interpreting');
  assert.equal(item.points, 2);
  assert.ok(item.params.pay >= 80000 && item.params.pay <= 150000 && item.params.pay % 100 === 0);
  assert.ok([0.1, 0.15, 0.2].includes(item.params.rate));
  assert.equal(typeof item.answer, 'number');
});

test('different seeds explore the parameter ranges', () => {
  const pays = new Set(Array.from({ length: 30 }, (_, i) => generateItem(splitBalance, i).params.pay));
  assert.ok(pays.size > 10);
});

test('seedFor is stable and depends on every part of its key', () => {
  assert.equal(seedFor('m03', 1, 2), seedFor('m03', 1, 2));
  assert.notEqual(seedFor('m03', 1, 2), seedFor('m03', 2, 2));
  assert.notEqual(seedFor('m03', 1, 2), seedFor('m04', 1, 2));
});

test('a gate has exactly four versions with the same structure', () => {
  const versions = gateVersions(gateTemplates, 'm03');
  assert.equal(versions.length, 4);
  for (const v of versions) {
    assert.deepEqual(v.map((i) => [i.templateId, i.kind, i.part, i.points]), gateTemplates.map((t) => [t.id, t.kind, t.part, t.points]));
  }
});

test('every version of every item has a different answer (or prompt, for explanations)', () => {
  const versions = gateVersions(gateTemplates, 'm03');
  for (let t = 0; t < gateTemplates.length; t++) {
    const keys = versions.map((v) => JSON.stringify(v[t].answer ?? v[t].prompt));
    assert.equal(new Set(keys).size, 4, `${gateTemplates[t].id} has 4 distinct versions`);
  }
});

test('a template that cannot vary its answer is refused, unless marked fixed', () => {
  const sameAnswer = { ...splitBalance, id: 'same', params: { name: { pick: ['A', 'B', 'C', 'D', 'E'] } }, build: (p) => ({ prompt: p.name, answer: 100 }) };
  assert.throws(() => assessmentVersions([sameAnswer], 'x', { count: 4 }), /same/);
  assert.equal(assessmentVersions([{ ...sameAnswer, fixed: true }], 'x', { count: 4 }).length, 4);
});

test('reordering templates does not change their versions', () => {
  const a = gateVersions(gateTemplates, 'm03');
  const b = gateVersions([gateTemplates[1], gateTemplates[0], ...gateTemplates.slice(2)], 'm03');
  assert.deepEqual(b[2][0].params, a[2][1].params);
});

test('checkpoints can ask for two versions without the gate shape', () => {
  const v = assessmentVersions([splitBalance, explainDebit], 'ca', { count: 2 });
  assert.equal(v.length, 2);
  assert.equal(v[0].length, 2);
});

test('template metadata cannot be overwritten by build()', () => {
  const sneaky = { ...splitBalance, build: (p) => ({ ...splitBalance.build(p), points: 99, module: 'zz' }) };
  const item = generateItem(sneaky, 1);
  assert.equal(item.points, 2);
  assert.equal(item.module, 'm01');
});

test('parameter ranges must be whole numbers', () => {
  assert.throws(() => generateItem({ ...splitBalance, params: { r: { min: 0.1, max: 0.5, step: 0.1 } } }, 1), /whole/);
});

test('gate versions are deterministic', () => {
  assert.deepEqual(gateVersions(gateTemplates, 'm03'), gateVersions(gateTemplates, 'm03'));
});

test('a gate must total 10 points: interpreting 4, producing 4, explaining 2', () => {
  assert.throws(() => gateVersions(gateTemplates.slice(0, 3), 'm03'), /explaining/);
});

test('a gate needs two 2-point interpreting items and rejects unknown parts', () => {
  const [a, b, c, d] = gateTemplates;
  assert.throws(() => gateVersions([{ ...a, points: 4 }, c, d], 'm03'), /interpreting/);
  assert.throws(() => gateVersions([a, { ...b, part: 'interpretting' }, c, d], 'm03'), /interpretting/);
});

test('an amounts template must have one field per point', () => {
  const t = { id: 'amt', module: 'm01', kind: 'amounts', part: 'producing', points: 4, params: { p: { min: 1000, max: 9000, step: 100 } },
    build: (p) => ({ prompt: 'x', fields: [{ label: 'a', answer: p.p }, { label: 'b', answer: p.p + 1 }, { label: 'c', answer: p.p + 2 }] }) };
  assert.throws(() => assessmentVersions([t], 'x', { count: 2 }), /field/);
});

test('a byVersion parameter picks its value by version, so each version gets its own scenario', async () => {
  const t = { ...splitBalance, id: 'fx-by-version', params: { ...splitBalance.params, scene: { byVersion: ['a', 'b', 'c'] } }, build: (p) => ({ ...splitBalance.build(p), scene: p.scene }) };
  const versions = assessmentVersions([t], 'fx', { count: 4 });
  assert.deepEqual(versions.map((v) => v[0].scene), ['a', 'b', 'c', 'a']);
  // Outside a versioned check (content rules, previews) it is picked at random from the same list.
  const seen = new Set(Array.from({ length: 40 }, (_, s) => generateItem(t, s).params.scene));
  assert.deepEqual([...seen].sort(), ['a', 'b', 'c']);
});

test('withRecall puts scheduled recall first, with its own ids so its numbers differ', async () => {
  const { withRecall } = await import('../js/items.js');
  const set = withRecall([splitBalance, explainDebit], [splitBalance]);
  assert.deepEqual(set.map((t) => t.id), ['fx-split-balance-due', 'fx-split-balance', explainDebit.id]);
  const [due, own] = assessmentVersions(set, 'fx-practice', { count: 1 })[0];
  assert.notDeepEqual(due.params, own.params);
  assert.deepEqual(withRecall([splitBalance], []).map((t) => t.id), ['fx-split-balance']);
});
