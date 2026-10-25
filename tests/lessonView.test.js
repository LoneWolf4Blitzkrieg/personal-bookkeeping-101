import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepHTML, gradePrediction, ledgerPanelHTML, lessonEndHTML } from '../js/lessonView.js';
import { goodModule } from './fixtures/modules.js';

const predict = {
  ...goodModule,
  steps: [
    goodModule.steps[0],
    { id: 'predict', kind: 'predict', text: ['What will the balance read after the second deposit?'], uses: ['debit-credit-rules'],
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
  const html = stepHTML(predict, 1) + ledgerPanelHTML(predict.steps[1], { revealed: false });
  assert.match(html, /<form[^>]*data-kind="predict"/);
  assert.ok(!html.includes('363.60'), 'the answer is not on the page before the prediction');
  assert.ok(ledgerPanelHTML(predict.steps[1], { revealed: true }).includes('363.60'));
});

test('prediction feedback is announced and invalid input is tied to the field', () => {
  const after = stepHTML(predict, 1, { revealed: true, feedback: gradePrediction(predict.steps[1], '181.80') });
  assert.match(after, /class="feedback[^"]*"[^>]*role="status"/);
  const invalid = stepHTML(predict, 1, { feedback: gradePrediction(predict.steps[1], 'abc') });
  assert.match(invalid, /<input[^>]*aria-invalid="true"[^>]*aria-describedby="prediction-note"/);
  assert.match(invalid, /id="prediction-note"/);
});

test('a step shows the source of its real-world figures', () => {
  const html = stepHTML(goodModule, 0);
  assert.match(html, /Source:.*Internal Revenue Service/);
  assert.match(html, /href="https:\/\/www\.irs\.gov\/publications\/p15t"/);
});

test('the first step states the module\'s core idea', () => {
  assert.ok(stepHTML(goodModule, 0).includes(goodModule.coreIdea));
});

test('a step can show several ledger pages', () => {
  const step = { ...goodModule.steps[0], ledger: undefined, journalPage: undefined, ledgers: [goodModule.steps[0].ledger, { ...goodModule.steps[0].ledger, account: 'Checking', id: 'checking' }] };
  const html = ledgerPanelHTML(step);
  assert.equal((html.match(/<table class="ledger"/g) || []).length, 2);
});

test('the lesson end links the practice set, the module check and official help', () => {
  const html = lessonEndHTML(goodModule);
  assert.match(html, /href="assess.html\?id=m06-practice"/);
  assert.match(html, /href="assess.html\?id=m06"/);
  assert.match(html, /consumerfinance\.gov/);
});

test('a prediction is checked like a numeric question', () => {
  assert.equal(gradePrediction(predict.steps[1], '363.60').correct, true);
  assert.equal(gradePrediction(predict.steps[1], '181.80').correct, false);
  assert.equal(gradePrediction(predict.steps[1], 'abc').invalid, true);
});

test('a self-explanation prompt offers a model answer to compare with', () => {
  const html = stepHTML({ ...goodModule, steps: [{ ...goodModule.steps[0], prompt: 'Why?', promptAnswer: 'Because assets rise with debits.' }] }, 0);
  assert.match(html, /<details class="model-answer"><summary>Compare with a model answer<\/summary><p>Because assets rise with debits\.<\/p><\/details>/);
});

test('step text is escaped', () => {
  const html = stepHTML({ ...goodModule, steps: [{ kind: 'explain', text: ['<b>hi</b> & bye'], uses: [] }] }, 0);
  assert.ok(html.includes('&lt;b&gt;hi&lt;/b&gt; &amp; bye'));
});

test('the last step leads to the practice set and the module check', () => {
  const html = stepHTML(predict, 1, { revealed: true });
  assert.match(html, /href="assess.html\?id=m06"/);
  assert.match(html, /href="assess.html\?id=m06-practice"/);
});

test('citations can be drawn for any step or question that names its sources', async () => {
  const { citationHTML } = await import('../js/lessonView.js');
  assert.match(citationHTML({ sources: ['fed-g19-2026q2'] }), /Source: .*22\.15%.*Federal Reserve/);
  assert.equal(citationHTML({ sources: [] }), '');
});

test('reports are drawn beside a step with the other pages, and a statement shows money in and out', async () => {
  const { sourceDocHTML } = await import('../js/lessonView.js');
  const report = { report: 'net-worth', name: 'Jordan', date: '2026-06-30', assets: [{ no: 2, name: 'Spending bucket', amount: 41200 }], liabilities: [], ask: ['net'] };
  const html = ledgerPanelHTML({ reports: [report] });
  assert.match(html, /Net-worth statement/);
  assert.match(html, /to work out/);
  assert.match(ledgerPanelHTML({ report }, { revealed: true }), /class="money col-money answer">412\.00/);
  const doc = sourceDocHTML({ kind: 'statement', title: 'Bank statement', lines: [['Jun 5 Paycheck', 5000, 'in'], ['Jun 9 Debit card', 2000, 'out']] });
  assert.match(doc, /\+\$50\.00/);
  assert.match(doc, /−\$20\.00/);
});

test('the final project step opens step by step: month, then figures, then the lists, then the button', async () => {
  const { projectHTML } = await import('../js/lessonView.js');
  const step = { kind: 'project', figures: [{ label: 'Net worth', answer: 1000 }], checklist: ['A', 'B'], rubric: ['C'], completeLabel: 'Final project I', sampleLabel: 'The sample' };
  const none = projectHTML(step, {});
  assert.match(none, /name="project-path"/);
  assert.ok(!none.includes('data-kind="project-figures"') && !none.includes('data-list'), 'nothing else before the month is chosen');
  const sample = projectHTML(step, { path: 'sample' });
  assert.match(sample, /data-kind="project-figures"/);
  assert.ok(!sample.includes('data-list'), 'the lists wait until the figures are right');
  assert.ok(!sample.includes('10.00'), 'the figure is not shown');
  const wrong = projectHTML(step, { path: 'sample', figureResults: [false] });
  assert.match(wrong, /Not yet/);
  const own = projectHTML(step, { path: 'own', checklist: [0], rubric: [] });
  assert.ok(!own.includes('project-figures'), 'own-month learners skip the figures');
  assert.match(own, /data-action="complete-project" disabled/);
  const ready = projectHTML(step, { path: 'sample', figuresOk: true, checklist: [0, 1], rubric: [0] });
  assert.match(ready, /data-action="complete-project">/);
  const done = projectHTML(step, { path: 'own', checklist: [0, 1], rubric: [0], completed: true });
  assert.match(done, /is marked complete/);
  assert.ok(!done.includes('data-action="complete-project"'));
});

test('a final-project module ends with a link onward only once it is complete', () => {
  const module = { id: 'm15', title: 'P', project: true, next: { id: 'm16', title: 'Final project II' }, resources: [],
    steps: [{ id: 'p', kind: 'project', uses: [], figures: [{ label: 'x', answer: 1 }], checklist: ['a'], rubric: ['b'] }] };
  const open = stepHTML(module, 0, { project: { path: 'own', completed: false } });
  assert.ok(!open.includes('lesson.html?m=m16'));
  assert.ok(!open.includes('Take the module check'), 'no module check');
  assert.match(stepHTML(module, 0, { project: { path: 'own', completed: true } }), /href="lesson.html\?m=m16"/);
});
