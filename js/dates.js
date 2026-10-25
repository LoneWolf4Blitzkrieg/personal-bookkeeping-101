// Dates written out in words, the way the course writes them everywhere:
// "2026-10-25T08:00:00.000Z" -> "October 25, 2026", in the learner's own
// time zone.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function longDate(when) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
