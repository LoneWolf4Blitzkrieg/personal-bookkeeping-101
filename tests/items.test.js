import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateItem, gateVersions, seedFor } from '../js/items.js';
import { splitBalance, gateTemplates } from './fixtures/templates.js';

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

test('every pair of versions differs in at least one amount for each varying template', () => {
  const versions = gateVersions(gateTemplates, 'm03');
  for (let t = 0; t < gateTemplates.length; t++) {
    if (Object.keys(gateTemplates[t].params).length === 0) continue;
    const params = versions.map((v) => JSON.stringify(v[t].params));
    assert.equal(new Set(params).size, 4, `${gateTemplates[t].id} has 4 distinct versions`);
  }
});

test('gate versions are deterministic', () => {
  assert.deepEqual(gateVersions(gateTemplates, 'm03'), gateVersions(gateTemplates, 'm03'));
});

test('a gate must total 10 points: interpreting 4, producing 4, explaining 2', () => {
  assert.throws(() => gateVersions(gateTemplates.slice(0, 3), 'm03'), /explaining/);
});
