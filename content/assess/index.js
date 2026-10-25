// Every check in the course, by id: module gates, checkpoints, placement
// tests, the prerequisite check, the final exam and the retention test.

import { DEMO_GATE } from './demo.js';
import { PREREQ_CHECK } from './prereq.js';
import { M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL } from '../modules/m01.js';
import { M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL } from '../modules/m02.js';
import { M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL } from '../modules/m03.js';
import { M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL } from '../modules/m04.js';
import { M05_GATE, M05_PRACTICE, M05_EXTRA, M05_REMEDIAL } from '../modules/m05.js';
import { M06_GATE, M06_PRACTICE, M06_EXTRA, M06_REMEDIAL } from '../modules/m06.js';
import { M07_GATE, M07_PRACTICE, M07_EXTRA, M07_REMEDIAL } from '../modules/m07.js';
import { M08_GATE, M08_PRACTICE, M08_EXTRA, M08_REMEDIAL } from '../modules/m08.js';
import { M09_GATE, M09_PRACTICE, M09_EXTRA, M09_REMEDIAL } from '../modules/m09.js';
import { M10_GATE, M10_PRACTICE, M10_EXTRA, M10_REMEDIAL } from '../modules/m10.js';
import { M11_GATE, M11_PRACTICE, M11_EXTRA, M11_REMEDIAL } from '../modules/m11.js';
import { M12_GATE, M12_PRACTICE, M12_EXTRA, M12_REMEDIAL } from '../modules/m12.js';
import { M13_GATE, M13_PRACTICE, M13_EXTRA, M13_REMEDIAL } from '../modules/m13.js';
import { M14_GATE, M14_PRACTICE, M14_EXTRA, M14_REMEDIAL } from '../modules/m14.js';
import { A1_GATE, A1_PRACTICE, A1_EXTRA, A1_REMEDIAL } from '../modules/a1.js';
import { A2_GATE, A2_PRACTICE, A2_EXTRA, A2_REMEDIAL } from '../modules/a2.js';
import { A3_GATE, A3_PRACTICE, A3_EXTRA, A3_REMEDIAL } from '../modules/a3.js';
import { CHECKPOINT_A } from './ca.js';
import { CHECKPOINT_B } from './cb.js';
import { CHECKPOINT_C } from './cc.js';
import { PLACEMENT_A, PLACEMENT_B } from './placement.js';
import { FINAL_EXAM } from './exam.js';
import { RETENTION } from './retention.js';

const byId = (...list) => Object.fromEntries(list.map((a) => [a.id, a]));

export const ASSESSMENTS = byId(
  DEMO_GATE, PREREQ_CHECK,
  M01_GATE, M01_PRACTICE, M01_EXTRA, M01_REMEDIAL,
  M02_GATE, M02_PRACTICE, M02_EXTRA, M02_REMEDIAL,
  M03_GATE, M03_PRACTICE, M03_EXTRA, M03_REMEDIAL,
  M04_GATE, M04_PRACTICE, M04_EXTRA, M04_REMEDIAL,
  CHECKPOINT_A,
  M05_GATE, M05_PRACTICE, M05_EXTRA, M05_REMEDIAL,
  M06_GATE, M06_PRACTICE, M06_EXTRA, M06_REMEDIAL,
  M07_GATE, M07_PRACTICE, M07_EXTRA, M07_REMEDIAL,
  M08_GATE, M08_PRACTICE, M08_EXTRA, M08_REMEDIAL,
  CHECKPOINT_B, PLACEMENT_A, PLACEMENT_B,
  M09_GATE, M09_PRACTICE, M09_EXTRA, M09_REMEDIAL,
  M10_GATE, M10_PRACTICE, M10_EXTRA, M10_REMEDIAL,
  M11_GATE, M11_PRACTICE, M11_EXTRA, M11_REMEDIAL,
  M12_GATE, M12_PRACTICE, M12_EXTRA, M12_REMEDIAL,
  CHECKPOINT_C,
  M13_GATE, M13_PRACTICE, M13_EXTRA, M13_REMEDIAL,
  M14_GATE, M14_PRACTICE, M14_EXTRA, M14_REMEDIAL,
  A1_GATE, A1_PRACTICE, A1_EXTRA, A1_REMEDIAL,
  A2_GATE, A2_PRACTICE, A2_EXTRA, A2_REMEDIAL,
  A3_GATE, A3_PRACTICE, A3_EXTRA, A3_REMEDIAL,
  FINAL_EXAM, RETENTION,
);
