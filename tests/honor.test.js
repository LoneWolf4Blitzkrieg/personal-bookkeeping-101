import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HONOR_NOTE_ORIGINAL, HONOR_NOTES, HONOR_SIGNATURE, honorNoteHTML } from '../content/honor.js';
import { escapeHTML } from '../js/html.js';

test('the author\'s own words are kept, and both adapted notes end the same way', () => {
  assert.match(HONOR_NOTE_ORIGINAL, /^Do not use AI for answers or ask other people for answers\./);
  assert.match(HONOR_NOTE_ORIGINAL, /Earn your certificate\.$/);
  for (const which of ['start', 'exam']) {
    const text = HONOR_NOTES[which].paragraphs.join(' ');
    for (const part of ['AI', 'Alexander the Great', 'Marcus Aurelius', 'ancestors']) assert.ok(text.includes(part), `${which}: ${part}`);
    assert.match(text, /Earn your certificate\.$/, which);
  }
  assert.equal(HONOR_SIGNATURE, '— Raul Bautista, author of Personal Bookkeeping 101');
});

test('a note is drawn as a labelled section with every paragraph and the signature', () => {
  const html = honorNoteHTML('exam');
  assert.match(html, /<section class="author-note" aria-labelledby="author-note-exam">/);
  assert.match(html, /<h2 id="author-note-exam">/);
  for (const p of HONOR_NOTES.exam.paragraphs) assert.ok(html.includes(`<p>${escapeHTML(p)}</p>`), p);
  assert.ok(html.includes(escapeHTML(HONOR_SIGNATURE)));
});

test('the home page shows the start note exactly as written in content/honor.js', () => {
  const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(page.includes(honorNoteHTML('start')), 'index.html must contain honorNoteHTML("start") verbatim');
  assert.ok(page.indexOf('class="author-note"') < page.indexOf('Start Module 1'), 'the note comes before the start button');
});
