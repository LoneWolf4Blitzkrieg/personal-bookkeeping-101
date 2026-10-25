// The final exam (author's rules, October 24, 2026): 50 questions, pass at
// 80% of the points, untimed, taken after the add-on. At most 20% of the
// questions and of the points come from the add-on (here 8 of 50). Every
// core module is represented: each module's checkpoint questions, Modules 13
// and 14's own, and one more read-and-predict question for each module that
// gives a checkpoint only two. The author's note on honest work is shown
// before the first question (js/app/assess.js).

import { MODULES } from '../course.js';
import { M01_CHECKPOINT, M01_GATE } from '../modules/m01.js';
import { M02_CHECKPOINT } from '../modules/m02.js';
import { M03_CHECKPOINT } from '../modules/m03.js';
import { M04_CHECKPOINT, M04_GATE } from '../modules/m04.js';
import { M05_CHECKPOINT } from '../modules/m05.js';
import { M06_CHECKPOINT, M06_GATE } from '../modules/m06.js';
import { M07_CHECKPOINT, M07_GATE } from '../modules/m07.js';
import { M08_CHECKPOINT } from '../modules/m08.js';
import { M09_CHECKPOINT, M09_GATE } from '../modules/m09.js';
import { M10_CHECKPOINT, M10_GATE } from '../modules/m10.js';
import { M11_CHECKPOINT } from '../modules/m11.js';
import { M12_CHECKPOINT } from '../modules/m12.js';
import { M13_GATE } from '../modules/m13.js';
import { M14_GATE } from '../modules/m14.js';
import { A1_GATE } from '../modules/a1.js';
import { A2_GATE } from '../modules/a2.js';
import { A3_GATE } from '../modules/a3.js';

const byId = (gate, id) => {
  const t = gate.templates.find((x) => x.id === id);
  if (!t) throw new Error(`No template ${id} in ${gate.id}`);
  return t;
};
// The first read-and-predict question of a gate that is not already used and
// is not a fluency drill.
const anotherInterpreting = (gate, used) => gate.templates.find((t) => t.part === 'interpreting' && !/-drill-/.test(t.id) && !used.some((u) => u.id === t.id));

const CHECKPOINT_QUESTIONS = [
  M01_CHECKPOINT, M02_CHECKPOINT, M03_CHECKPOINT, M04_CHECKPOINT, M05_CHECKPOINT, M06_CHECKPOINT,
  M07_CHECKPOINT, M08_CHECKPOINT, M09_CHECKPOINT, M10_CHECKPOINT, M11_CHECKPOINT, M12_CHECKPOINT,
];
const EXTRA = [[M01_GATE, M01_CHECKPOINT], [M04_GATE, M04_CHECKPOINT], [M06_GATE, M06_CHECKPOINT], [M07_GATE, M07_CHECKPOINT], [M09_GATE, M09_CHECKPOINT], [M10_GATE, M10_CHECKPOINT]]
  .map(([gate, used]) => anotherInterpreting(gate, used));

export const EXAM_CORE = [
  ...CHECKPOINT_QUESTIONS.flat(),
  ...EXTRA,
  byId(M13_GATE, 'm13-essential-total'), byId(M13_GATE, 'm13-minimum-fund'), byId(M13_GATE, 'm13-record-fund'),
  byId(M14_GATE, 'm14-price-after'), byId(M14_GATE, 'm14-sinking-monthly'), byId(M14_GATE, 'm14-record-plan'),
];
export const EXAM_ADDON = [
  byId(A1_GATE, 'a1-fed-buys'), byId(A1_GATE, 'a1-m2-growth'), byId(A1_GATE, 'a1-record-fed'),
  byId(A2_GATE, 'a2-cpi-per-100'), byId(A2_GATE, 'a2-borrowed-per-100'), byId(A2_GATE, 'a2-profit-per-100'),
  byId(A3_GATE, 'a3-max-contribution'), byId(A3_GATE, 'a3-traditional-kept'),
];

// Questions in course order, so the exam reads like the course.
const order = (t) => MODULES.findIndex((m) => m.id === t.module);
export const FINAL_EXAM = {
  id: 'exam',
  kind: 'exam',
  title: 'Final exam',
  templates: [...EXAM_CORE, ...EXAM_ADDON].sort((a, b) => order(a) - order(b)),
};
