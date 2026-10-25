// The four-week review (retention test): 10 questions from the main course
// only, opened 28 days after the final exam is passed (js/progress.js). It
// measures what stuck, for the course's evaluation; nothing is locked by it.

import { M02_GATE } from '../modules/m02.js';
import { M03_GATE } from '../modules/m03.js';
import { M04_GATE } from '../modules/m04.js';
import { M05_GATE } from '../modules/m05.js';
import { M07_GATE } from '../modules/m07.js';
import { M08_GATE } from '../modules/m08.js';
import { M10_GATE } from '../modules/m10.js';
import { M11_GATE } from '../modules/m11.js';
import { M12_GATE } from '../modules/m12.js';
import { M13_GATE } from '../modules/m13.js';

// From each gate, its last read-and-predict question that is not a drill
// (the exam draws from the start of the lists).
const lastInterpreting = (gate) => gate.templates.filter((t) => t.part === 'interpreting' && !/-drill-/.test(t.id)).at(-1);

export const RETENTION = {
  id: 'retention',
  kind: 'retention',
  title: 'Four-week review',
  templates: [M02_GATE, M03_GATE, M04_GATE, M05_GATE, M07_GATE, M08_GATE, M10_GATE, M11_GATE, M12_GATE, M13_GATE].map(lastInterpreting),
};
