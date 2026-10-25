// Draws one lesson step (pure: returns HTML strings). The pinned ledger is
// drawn separately by ledgerPanelHTML so it can sit beside the text.

import { escapeHTML } from './html.js';
import { ledgerHTML, journalHTML } from './ledgerView.js';
import { reportHTML } from './reports.js';
import { gradeItem } from './grade.js';
import { formatCents } from './money.js';
import { SOURCES } from '../content/sources.js';
import { RESOURCES } from '../content/resources.js';

export function gradePrediction(step, typed) {
  return gradeItem({ kind: 'numeric', points: 1, answer: step.answer, misconceptions: step.misconceptions, explanation: step.explanation }, typed);
}

// A source document drawn beside the ledger: a pay stub, receipt, check or
// bank statement, as { kind, title, lines: [[label, value, direction?], ...], note }.
// Numbers are whole cents and are written as money; text is shown as is. A
// statement line marked 'in' or 'out' shows its sign.
const SIGNS = { in: '+', out: '−' };
export function sourceDocHTML(doc) {
  const rows = doc.lines.map(([label, value, direction]) => {
    const shown = typeof value === 'number' ? `${SIGNS[direction] ?? ''}$${formatCents(value)}` : value;
    return `<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(shown)}</td></tr>`;
  }).join('');
  return `<figure class="source-doc source-${escapeHTML(doc.kind)}"><figcaption>${escapeHTML(doc.title)}</figcaption><table>${rows}</table>${doc.note ? `<p class="source-note">${escapeHTML(doc.note)}</p>` : ''}</figure>`;
}

// Everything drawn beside a step or a question: source document, journal
// page, reports, and one or more ledger pages. Used by lessons and checks alike.
export function ledgerPanelHTML(step, { revealed = false } = {}) {
  const parts = [];
  if (step.sourceDoc) parts.push(sourceDocHTML(step.sourceDoc));
  if (step.journalPage) parts.push(journalHTML(step.journalPage, { highlightEntry: step.highlightEntry ?? null }));
  for (const report of [...(step.report ? [step.report] : []), ...(step.reports ?? [])]) parts.push(reportHTML(report, { showAnswers: revealed }));
  const pages = [...(step.ledger ? [step.ledger] : []), ...(step.ledgers ?? [])];
  pages.forEach((page, i) => parts.push(ledgerHTML(page, { highlightRow: i === 0 ? (step.highlightRow ?? null) : null, showAnswers: revealed })));
  return parts.join('');
}

export function citationHTML(step) {
  const ids = [step.source, ...(step.sources ?? [])].filter((id) => typeof id === 'string' && SOURCES[id]);
  if (ids.length === 0) return '';
  const items = ids.map((id) => {
    const s = SOURCES[id];
    return `<a href="${escapeHTML(s.url)}" rel="noopener">${escapeHTML(s.title)}</a>, ${escapeHTML(s.publisher)} (checked ${escapeHTML(s.accessed)})`;
  });
  return `<p class="citation">Source: ${items.join('; ')}</p>`;
}

const PRINT_SHEETS = { blank: 'a blank ledger sheet', journal: 'a blank journal page', 'sample-month': 'the sample month (what happened, pay stubs, bank statement)' };
function printLinksHTML(ids) {
  const links = ids.filter((id) => PRINT_SHEETS[id]).map((id) => `<a href="print.html?sheet=${escapeHTML(id)}">${escapeHTML(PRINT_SHEETS[id])}</a>`);
  return links.length ? `<p class="print-links">Print: ${links.join(' · ')}</p>` : '';
}

const helpLinksHTML = (module) => {
  const links = (module.resources ?? []).map((id) => RESOURCES[id]).filter(Boolean)
    .map((r) => `<li><a href="${escapeHTML(r.url)}" rel="noopener">${escapeHTML(r.title)}</a> (${escapeHTML(r.publisher)})</li>`).join('');
  return links ? `<h3>Free help from official sites</h3><p>Stuck? First reread the worked example and rework it by hand. Then try these:</p><ul class="help-links">${links}</ul>` : '';
};

// The end of a final-project module: no practice set or check; the next
// module opens once the project is marked complete.
function projectEndHTML(module, completed) {
  const next = module.next ? `<a class="button" href="lesson.html?m=${escapeHTML(module.next.id)}">Go to ${escapeHTML(module.next.title)}</a>` : '';
  const lead = completed
    ? `<p><strong>This part of the final project is complete.</strong></p>${next ? `<p class="lesson-end-links">${next}</p>` : ''}`
    : '<p><strong>You have reached the end of this part of the final project.</strong> Choose your month above. If you used the sample month, enter its figures. Then tick every item and mark this part complete to open the next module.</p>';
  return `<div class="lesson-end">${lead}${helpLinksHTML(module)}</div>`;
}

// True when the project step's conditions are met: a month chosen, the
// sample month's figures right if it was chosen, and every item ticked (only
// indices that exist on this step count).
export function projectReady(step, { path = null, figuresOk = false, checklist = [], rubric = [] } = {}) {
  const count = (ticked, items) => new Set(ticked.filter((i) => Number.isInteger(i) && i >= 0 && i < items.length)).size;
  return (path === 'own' || (path === 'sample' && figuresOk))
    && count(checklist, step.checklist) === step.checklist.length && count(rubric, step.rubric) === step.rubric.length;
}

// The final project's last step: which month the learner kept, the sample
// month's key figures (all must be right), then the checklist and rubric,
// then the button that marks the module complete. state is the saved
// project record plus { completed, figureResults }.
export function projectHTML(step, state = {}) {
  const { path = null, figuresOk = false, checklist = [], rubric = [], completed = false, figureResults = null } = state;
  const radio = (value, label) => `<label><input type="radio" name="project-path" value="${value}"${path === value ? ' checked' : ''}${completed ? ' disabled' : ''}> ${escapeHTML(label)}</label>`;
  let html = `<fieldset class="project-path"><legend>Which month did you keep?</legend>${radio('sample', step.sampleLabel ?? 'The sample month')}${radio('own', 'My own month')}<p class="fieldset-note">Choose the month you really kept. The checks only help you if you answer them honestly.</p></fieldset>`;
  if (path === 'sample' && !figuresOk) {
    const fields = step.figures.map((f, i) => {
      const r = figureResults?.[i];
      const note = r == null ? '' : r ? `<span class="figure-note figure-right" id="figure-note-${i}">✓ Matches</span>` : `<span class="figure-note figure-wrong" id="figure-note-${i}">Not yet: recheck this figure in your books</span>`;
      const describe = r == null ? '' : ` aria-describedby="figure-note-${i}"${r ? '' : ' aria-invalid="true"'}`;
      return `<div class="amount-field"><label for="figure-${i}">${escapeHTML(f.label)}</label><div class="answer-row"><span aria-hidden="true">$</span><input id="figure-${i}" name="figure" inputmode="decimal" autocomplete="off" required${describe}></div>${note}</div>`;
    }).join('');
    html += `<form class="answer-form project-figures" data-kind="project-figures"><p>Enter these figures from your own work on the sample month. All of them must match before the checklist opens.</p>${fields}<button class="button" type="submit">Check my figures</button></form>`;
  }
  if (path === 'sample' && figuresOk) html += '<p class="feedback feedback-right" role="status" tabindex="-1">All your figures match the sample month\'s books.</p>';
  const ready = path === 'own' || (path === 'sample' && figuresOk);
  if (ready) {
    const box = (list, ticked, i, text) => `<li><label><input type="checkbox" data-list="${list}" value="${i}"${ticked.includes(i) ? ' checked' : ''}${completed ? ' disabled' : ''}> ${escapeHTML(text)}</label></li>`;
    html += `<fieldset class="project-list"><legend>Checklist: tick each one you have done</legend><ul class="ticks">${step.checklist.map((c, i) => box('checklist', checklist, i, c)).join('')}</ul></fieldset>`;
    html += `<fieldset class="project-list"><legend>Rubric: tick each one your work meets</legend><ul class="ticks">${step.rubric.map((c, i) => box('rubric', rubric, i, c)).join('')}</ul></fieldset>`;
    const all = projectReady(step, state);
    html += completed
      ? `<p class="feedback feedback-right" role="status" tabindex="-1">${escapeHTML(step.completeLabel ?? 'Project')} is marked complete.</p>`
      : `<p><button class="button" type="button" data-action="complete-project"${all ? '' : ' disabled aria-describedby="complete-note"'}>Mark ${escapeHTML(step.completeLabel ?? 'the project')} complete</button></p>${all ? '' : '<p class="feedback-note" id="complete-note">Tick every item in the checklist and the rubric first.</p>'}`;
  }
  return `<div class="project-check">${html}</div>`;
}

export function lessonEndHTML(module) {
  const check = escapeHTML(module.checkId ?? module.id);
  const practice = escapeHTML(module.practiceId ?? `${module.id}-practice`);
  const next = module.practiceId === null ? 'Take the check again when you are ready.' : 'Next, do the practice set, then take the module check: 10 questions, and you need 80% of the points to move on.';
  return `<div class="lesson-end"><p><strong>You have finished the lesson.</strong> ${next}</p>
    <p class="lesson-end-links">${module.practiceId === null ? '' : `<a class="button" href="assess.html?id=${practice}">Do the practice set</a> `}<a class="button button-secondary" href="assess.html?id=${check}">${module.practiceId === null ? 'Take the check again' : 'Take the module check'}</a></p>
    ${helpLinksHTML(module)}</div>`;
}

export function stepHTML(module, index, { revealed = false, feedback = null, project = null } = {}) {
  const step = module.steps[index];
  const last = index === module.steps.length - 1;
  const core = index === 0 && module.coreIdea ? `<p class="core-idea"><strong>Core idea:</strong> ${escapeHTML(module.coreIdea)}</p>` : '';
  // The last paragraph of a prediction step is its question; the answer box points to it.
  const paras = step.text ?? [];
  const text = paras.map((p, i) => `<p${step.kind === 'predict' && i === paras.length - 1 ? ' id="step-question"' : ''}>${escapeHTML(p)}</p>`).join('');
  const title = step.title ? `<h2 class="step-title" id="step-title" tabindex="-1">${escapeHTML(step.title)}</h2>` : `<h2 class="visually-hidden" id="step-title" tabindex="-1">Step ${index + 1}</h2>`;
  let body = core + text + citationHTML(step) + printLinksHTML(step.printLinks ?? []);
  if (step.prompt) {
    const model = step.promptAnswer ? `<details class="model-answer"><summary>Compare with a model answer</summary><p>${escapeHTML(step.promptAnswer)}</p></details>` : '';
    body += `<div class="self-explain"><label for="self-explain">${escapeHTML(step.prompt)}</label><textarea id="self-explain" rows="3" placeholder="Say it in your own words before you go on."></textarea>${model}</div>`;
  }
  if (step.kind === 'project') body += projectHTML(step, project ?? {});
  const waiting = step.kind === 'predict' && !revealed;
  if (waiting) {
    const invalid = feedback?.invalid;
    const described = paras.length ? 'step-question' : '';
    const noteAttrs = invalid ? ` aria-invalid="true" aria-describedby="${described} prediction-note"` : described ? ` aria-describedby="${described}"` : '';
    body += `<form class="answer-form predict-form" data-kind="predict">
      <label for="prediction">Your prediction (in dollars)</label>
      <div class="answer-row"><span aria-hidden="true">$</span><input id="prediction" name="prediction" inputmode="decimal" autocomplete="off" required${noteAttrs}></div>
      ${invalid ? `<p class="feedback feedback-note" id="prediction-note">${escapeHTML(feedback.feedback)}</p>` : ''}
      <button class="button" type="submit">Check my prediction</button>
    </form>`;
  } else if (step.kind === 'predict' && feedback) {
    body += `<div class="feedback ${feedback.correct ? 'feedback-right' : 'feedback-wrong'}" id="prediction-feedback" role="status" tabindex="-1"><p>${escapeHTML(feedback.correct ? 'Your prediction was right.' : 'Not quite.')} ${escapeHTML(feedback.feedback)}</p></div>`;
  }
  const back = index > 0 ? '<button class="button button-secondary" type="button" data-action="back">◀ Back</button>' : '';
  const reread = '<button class="button button-secondary" type="button" data-action="reread">Reread this step</button>';
  const next = !last && !waiting ? '<button class="button" type="button" data-action="next">Next ▶</button>' : '';
  const finish = last && !waiting ? (module.project ? projectEndHTML(module, Boolean(project?.completed)) : lessonEndHTML(module)) : '';
  return `<p class="crumb">Step ${index + 1} of ${module.steps.length}</p>${title}${body}<div class="step-nav">${back}${reread}${next}</div>${finish}`;
}
