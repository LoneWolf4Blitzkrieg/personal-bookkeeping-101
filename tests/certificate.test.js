import { test } from 'node:test';
import assert from 'node:assert/strict';
import { certificateStatus, certificateHTML, certificateDocument, certificateFileName, cleanName, longDate, UNOFFICIAL } from '../js/certificate.js';
import { emptyProgress, completeModule, recordExam } from '../js/progress.js';

const T0 = '2026-10-25T18:00:00.000Z';

test('the certificate stays locked until the final project and the final exam are both done', () => {
  let p = emptyProgress(T0);
  assert.equal(certificateStatus(p).ready, false);
  assert.match(certificateStatus(p).reason, /final project.*final exam/);
  p = recordExam(p, { percent: 86, passed: true }, T0, 1);
  assert.equal(certificateStatus(p).ready, false, 'the exam alone is not enough');
  assert.match(certificateStatus(p).reason, /final project/);
  p = completeModule(completeModule(p, 'm15', T0), 'm16', T0);
  assert.deepEqual(certificateStatus(p), { ready: true, date: T0 });
});

test('the certificate says it is unofficial and unaccredited, and shows name, course, date and licence credit', () => {
  const html = certificateHTML({ name: '  Ana   María  López ', date: T0 });
  assert.ok(html.includes(UNOFFICIAL));
  assert.match(UNOFFICIAL, /unofficial and unaccredited/);
  assert.ok(html.includes('Ana María López'), 'the name as typed, spaces tidied');
  assert.ok(html.includes('Personal Bookkeeping 101'));
  assert.ok(html.includes(`Completed on ${longDate(T0)}`));
  assert.match(html, /by Raul Bautista is licensed under <a href="https:\/\/creativecommons.org\/licenses\/by-nc-sa\/4.0\/" rel="license">CC BY-NC-SA 4.0<\/a> \(free for non-commercial use\)/);
  assert.ok(!/copyright/i.test(html), 'no "Copyright" line anywhere');
});

test('a typed name cannot inject markup, and is capped in length', () => {
  const html = certificateHTML({ name: '<script>alert(1)</script>', date: T0 });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.equal(cleanName('x'.repeat(200)).length, 80);
});

test('the download is one self-contained HTML file that opens without the course', () => {
  const doc = certificateDocument({ name: 'Riley', date: T0 });
  assert.match(doc, /^<!doctype html>/);
  assert.match(doc, /<html lang="en">/);
  assert.match(doc, /<style>[\s\S]*\.certificate[\s\S]*<\/style>/);
  assert.ok(!/<script|<link|src=/.test(doc), 'no scripts, stylesheets or images loaded from elsewhere');
  assert.match(doc, /@page \{ size: landscape/, 'prints on one landscape page');
  assert.match(doc, /\.certificate \{ font-size: 12pt/, 'fixed print sizes, whatever the browser\'s text size');
  assert.equal(certificateFileName('Ana María López'), 'certificate-personal-bookkeeping-101-ana-maria-lopez.html');
  assert.equal(certificateFileName('   '), 'certificate-personal-bookkeeping-101-learner.html');
});

test('the certificate claims only what is true on every path, and long names print smaller', async () => {
  const { CERTIFICATE_BODY } = await import('../js/certificate.js');
  assert.ok(!/check at the end of each/.test(CERTIFICATE_BODY), 'Modules 15–16 have no check, and placement skips early checks');
  assert.match(CERTIFICATE_BODY, /final project/);
  assert.match(certificateHTML({ name: 'A'.repeat(41), date: T0 }), /certificate-name certificate-name-long/);
  assert.ok(!certificateHTML({ name: 'Ana', date: T0 }).includes('certificate-name-long'));
});
