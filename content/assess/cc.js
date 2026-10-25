// Checkpoint C: everything from Modules 9–12. Each question keeps its module
// tag, so a learner who fails is sent back to the earliest module missed.

import { M09_CHECKPOINT } from '../modules/m09.js';
import { M10_CHECKPOINT } from '../modules/m10.js';
import { M11_CHECKPOINT } from '../modules/m11.js';
import { M12_CHECKPOINT } from '../modules/m12.js';

export const CHECKPOINT_C_TEMPLATES = [...M09_CHECKPOINT, ...M10_CHECKPOINT, ...M11_CHECKPOINT, ...M12_CHECKPOINT];

export const CHECKPOINT_C = {
  id: 'cc',
  kind: 'checkpoint',
  title: 'Checkpoint C: Modules 9–12',
  templates: CHECKPOINT_C_TEMPLATES,
};
