// The certificate of completion (author's request, October 24, 2026):
// unofficial and unaccredited, and it says so on its face. It opens once the
// final exam is passed and both parts of the final project are marked
// complete. Pure functions: the page (js/app/certificate.js) puts them on
// screen, prints them and offers the download.

import { escapeHTML } from './html.js';

export const COURSE_TITLE = 'Personal Bookkeeping 101';
export const UNOFFICIAL = 'This certificate is unofficial and unaccredited. It is not a degree, diploma, license or credential from any school, employer or government agency.';
export const LICENCE_CREDIT = 'Personal Bookkeeping 101 by Raul Bautista is licensed under CC BY-NC-SA 4.0 (free for non-commercial use).';
const LICENCE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
const MAX_NAME = 80;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// "2026-10-25T08:00:00.000Z" -> "October 25, 2026", in the learner's own time zone.
export function longDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// The name as the learner types it, trimmed, with runs of spaces closed up.
export function cleanName(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

// Whether the certificate is open, and if not, what is still to do.
export function certificateStatus(progress) {
  const missing = [];
  if (!progress?.modules?.m15?.passed || !progress?.modules?.m16?.passed) missing.push('mark both parts of the final project complete (Modules 15 and 16)');
  if (!progress?.examPassedAt) missing.push('pass the final exam');
  return missing.length
    ? { ready: false, reason: `To get your certificate, ${missing.join(' and ')}.` }
    : { ready: true, date: progress.examPassedAt };
}

// The certificate itself. Every text the learner typed is escaped.
export function certificateHTML({ name, date }) {
  return `<article class="certificate" aria-label="Certificate of completion">
  <p class="certificate-kicker">Certificate of completion</p>
  <h2 class="certificate-course">${escapeHTML(COURSE_TITLE)}</h2>
  <p class="certificate-presented">This is to say that</p>
  <p class="certificate-name">${escapeHTML(cleanName(name))}</p>
  <p class="certificate-body">kept, proved and reported a full month of books, passed the check at the end of each of the 16 modules and the three add-on modules, and passed the 50-question final exam with at least 80% of the points.</p>
  <p class="certificate-date">Completed on ${escapeHTML(longDate(date))}</p>
  <p class="certificate-unofficial">${escapeHTML(UNOFFICIAL)}</p>
  <p class="certificate-credit"><i>${escapeHTML(COURSE_TITLE)}</i> by Raul Bautista is licensed under <a href="${LICENCE_URL}" rel="license">CC BY-NC-SA 4.0</a> (free for non-commercial use).</p>
</article>`;
}

// Styles shared by the course page and the downloaded file. Plain, printable
// on one landscape page, no images and nothing loaded from elsewhere.
export const CERTIFICATE_CSS = `
.certificate { box-sizing: border-box; max-width: 9.5in; margin: 0 auto; padding: .6in .7in; border: 6px double #2f5d46; background: #f7fbf6; color: #1d2a22; font-family: Georgia, 'Times New Roman', serif; text-align: center; }
.certificate p { margin: .5em 0; }
.certificate-kicker { font-variant: small-caps; letter-spacing: .12em; font-size: 1.1rem; color: #2f5d46; }
.certificate .certificate-course { font-size: 2.1rem; margin: .2em 0 .4em; }
.certificate-presented { font-style: italic; }
.certificate .certificate-name { font-size: 2rem; border-bottom: 1px solid #2f5d46; display: inline-block; min-width: 60%; padding: 0 .5em .1em; margin: .3em 0 .6em; overflow-wrap: anywhere; }
.certificate-body { max-width: 34em; margin-left: auto; margin-right: auto; line-height: 1.5; }
.certificate-date { font-weight: bold; margin-top: 1em; }
.certificate-unofficial { font-size: .85rem; max-width: 40em; margin: 1.4em auto .4em; }
.certificate-credit { font-size: .8rem; }
.certificate-credit a { color: inherit; }
@media print { @page { size: letter landscape; margin: .4in; } .certificate { page-break-inside: avoid; } }
`;

// A complete, self-contained HTML file for download: it opens on its own,
// without the course.
export function certificateDocument({ name, date }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(`Certificate: ${COURSE_TITLE} (${cleanName(name)})`)}</title>
<style>body { margin: 0; padding: .5in .3in; background: #fff; }${CERTIFICATE_CSS}</style>
</head>
<body>
${certificateHTML({ name, date })}
</body>
</html>
`;
}

export const certificateFileName = (name) => `certificate-personal-bookkeeping-101-${cleanName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'learner'}.html`;
