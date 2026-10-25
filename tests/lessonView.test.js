import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepHTML, gradePrediction } from '../js/lessonView.js';
import { goodModule } from './fixtures/modules.js';

const predict = {
  ...goodModule,
  steps: [
    goodModule.steps[0],
    { kind: 'predict', text: ['What will the balance read after the second deposit?'], uses: ['debit-credit-rules'],
      ledger: { ...goodModule.steps[0].ledger, rows: [goodModule.steps[0].ledger.rows[0], { date: '2026-06-20', items: 'From paycheck', folio: 'J2', debit: 18180, credit: 0, posted: [true, false], ask: ['balance', 'side'] }] },
      highlightRow: 1, answer: 36360, explanation: 'Each debit adds to an asset: 181.80 + 181.80 = 363.60.' },
  ],
};

test('a step shows its position, text and a reread button', () => {
  const html = stepHTML(predict, 0);
  assert.match(html, /Step 1 of 2/);
  assert.ok(html.includes('Assets increase on the debit side.'));
  assert.match(html, /data-action="reread"/);
});

test('a predict step asks for a prediction before showing the answer', () => {
  const html = stepHTML(predict, 1);
  assert.match(html, /<form[^>]*data-kind="predict"/);
  assert.ok(!html.includes('363.60'), 'the answer is not on the page before the prediction');
});

test('a prediction is checked like a numeric question', () => {
  assert.equal(gradePrediction(predict.steps[1], '363.60').correct, true);
  assert.equal(gradePrediction(predict.steps[1], '181.80').correct, false);
  assert.equal(gradePrediction(predict.steps[1], 'abc').invalid, true);
});

test('step text is escaped', () => {
  const html = stepHTML({ ...goodModule, steps: [{ kind: 'explain', text: ['<b>hi</b> & bye'], uses: [] }] }, 0);
  assert.ok(html.includes('&lt;b&gt;hi&lt;/b&gt; &amp; bye'));
});

test('the last step leads to the practice set and the module check', () => {
  const html = stepHTML(predict, 1, { revealed: true });
  assert.match(html, /href="assess.html\?id=m03"/);
});
