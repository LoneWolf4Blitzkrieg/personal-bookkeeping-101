// Every check in the course, by id: module gates, checkpoints, placement
// tests, the prerequisite check, the final exam and the retention test.

import { DEMO_GATE } from './demo.js';
import { PREREQ_CHECK } from './prereq.js';
import { M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL } from '../modules/m01.js';
import { M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL } from '../modules/m02.js';
import { M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL } from '../modules/m03.js';
import { M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL } from '../modules/m04.js';
import { CHECKPOINT_A } from './ca.js';

const byId = (...list) => Object.fromEntries(list.map((a) => [a.id, a]));

export const ASSESSMENTS = byId(
  DEMO_GATE, PREREQ_CHECK,
  M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL,
  M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL,
  M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL,
  M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL,
  CHECKPOINT_A,
);
