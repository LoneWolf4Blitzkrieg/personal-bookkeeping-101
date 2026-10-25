// Draws one lesson step (pure: returns HTML strings). The pinned ledger is
// drawn separately by ledgerPanelHTML so it can sit beside the text.

import { escapeHTML } from './html.js';
import { ledgerHTML, journalHTML } from './ledgerView.js';
import { gradeItem } from './grade.js';
import { formatCents } from './money.js';
import { SOURCES } from '../content/sources.js';
import { RESOURCES } from '../content/resources.js';

export function gradePrediction(step, typed) {
  return gradeItem({ kind: 'numeric', points: 1, answer: step.answer, misconceptions: step.misconceptions, explanation: step.explanation }, typed);
}

// A source document drawn beside the ledger: a pay stub, receipt, check or
// bank statement, as { kind, title, lines: [[label, value], ...], note }.
// Numbers are whole cents and are written as money; text is shown as is.
export function sourceDocHTML(doc) {
  const rows = doc.lines.map(([label, value]) => {
    const shown = typeof value === 'number' ? `$${formatCents(value)}` : value;
    return `<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(shown)}</td></tr>`;
  }).join('');
  return `<figure class="source-doc source-${escapeHTML(doc.kind)}"><figcaption>${escapeHTML(doc.title)}</figcaption><table>${rows}</table>${doc.note ? `<p class="source-note">${escapeHTML(doc.note)}</p>` : ''}</figure>`;
}

// Everything drawn beside a step or a question: source document, journal
// page, and one or more ledger pages. Used by lessons and checks alike.
export function ledgerPanelHTML(step, { revealed = false } = {}) {
  const parts = [];
  if (step.sourceDoc) parts.push(sourceDocHTML(step.sourceDoc));
  if (step.journalPage) parts.push(journalHTML(step.journalPage, { highlightEntry: step.highlightEntry ?? null }));
  const pages = [...(step.ledger ? [step.ledger] : []), ...(step.ledgers ?? [])];
  pages.forEach((page, i) => parts.push(ledgerHTML(page, { highlightRow: i === 0 ? (step.highlightRow ?? null) : null, showAnswers: revealed })));
  return parts.join('');
}

function citationHTML(step) {
  const ids = [step.source, ...(step.sources ?? [])].filter((id) => typeof id === 'string' && SOURCES[id]);
  if (ids.length === 0) return '';
  const items = ids.map((id) => {
    const s = SOURCES[id];
    return `<a href="${escapeHTML(s.url)}" rel="noopener">${escapeHTML(s.title)}</a>, ${escapeHTML(s.publisher)} (checked ${escapeHTML(s.accessed)})`;
  });
  return `<p class="citation">Source: ${items.join('; ')}</p>`;
}

export function lessonEndHTML(module) {
  const check = escapeHTML(module.checkId ?? module.id);
  const practice = escapeHTML(module.practiceId ?? `${module.id}-practice`);
  const links = (module.resources ?? []).map((id) => RESOURCES[id]).filter(Boolean)
    .map((r) => `<li><a href="${escapeHTML(r.url)}" rel="noopener">${escapeHTML(r.title)}</a> (${escapeHTML(r.publisher)})</li>`).join('');
  return `<div class="lesson-end"><p><strong>You have finished the lesson.</strong> Next, do the practice set, then take the module check. You need 8 of 10 points to move on.</p>
    <p class="lesson-end-links"><a class="button" href="assess.html?id=${practice}">Do the practice set</a> <a class="button button-secondary" href="assess.html?id=${check}">Take the module check</a></p>
    ${links ? `<h3>Free help from official sites</h3><p>Stuck? First reread the worked example and rework it by hand. Then try these:</p><ul class="help-links">${links}</ul>` : ''}</div>`;
}

export function stepHTML(module, index, { revealed = false, feedback = null } = {}) {
  const step = module.steps[index];
  const last = index === module.steps.length - 1;
  const core = index === 0 && module.coreIdea ? `<p class="core-idea"><strong>Core idea:</strong> ${escapeHTML(module.coreIdea)}</p>` : '';
  const text = (step.text ?? []).map((p) => `<p>${escapeHTML(p)}</p>`).join('');
  const title = step.title ? `<h2 class="step-title" id="step-title" tabindex="-1">${escapeHTML(step.title)}</h2>` : `<h2 class="visually-hidden" id="step-title" tabindex="-1">Step ${index + 1}</h2>`;
  let body = core + text + citationHTML(step);
  if (step.prompt) {
    body += `<div class="self-explain"><label for="self-explain">${escapeHTML(step.prompt)}</label><textarea id="self-explain" rows="3" placeholder="Say it in your own words before you go on."></textarea></div>`;
  }
  const waiting = step.kind === 'predict' && !revealed;
  if (waiting) {
    const invalid = feedback?.invalid;
    const noteAttrs = invalid ? ' aria-invalid="true" aria-describedby="prediction-note"' : '';
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
  const finish = last && !waiting ? lessonEndHTML(module) : '';
  return `<p class="crumb">Step ${index + 1} of ${module.steps.length}</p>${title}${body}<div class="step-nav">${back}${reread}${next}</div>${finish}`;
}
