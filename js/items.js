// Exercise and gate items are generated from templates, so every gate can
// have several equivalent versions with different names and amounts.
//
// A template:
//   { id, module, kind: 'numeric'|'entry'|'explain', part: 'interpreting'|'producing'|'explaining',
//     points, params: { name: { min, max, step } | { pick: [...] } }, build(params) -> fields }
// build() returns the item's prompt and answer fields (see js/grade.js).

// mulberry32: a small, fast, seeded pseudo-random generator.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A stable 32-bit seed from any list of keys (FNV-1a).
export function seedFor(...parts) {
  let h = 0x811c9dc5;
  for (const ch of parts.join('\u0000')) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function sampleParams(spec, rand) {
  const params = {};
  for (const key of Object.keys(spec).sort()) {
    const s = spec[key];
    if (Array.isArray(s.pick)) {
      params[key] = s.pick[Math.floor(rand() * s.pick.length)];
    } else {
      const step = s.step ?? 1;
      if (![s.min, s.max, step].every(Number.isSafeInteger) || step <= 0) {
        throw new Error(`Parameter "${key}" must use whole-number min, max and step (use cents for money).`);
      }
      const count = Math.floor((s.max - s.min) / step) + 1;
      params[key] = s.min + step * Math.floor(rand() * count);
    }
  }
  return params;
}

export function generateItem(template, seed) {
  const params = sampleParams(template.params ?? {}, mulberry32(seed));
  return {
    ...template.build(params),
    templateId: template.id,
    module: template.module,
    kind: template.kind,
    part: template.part,
    points: template.points,
    seed,
    params,
  };
}

// A module gate (proposal: "What a gate contains"): two 2-point interpreting
// items, one 4-point producing item, one 2-point explaining item.
const GATE_SHAPE = { interpreting: [2, 2], producing: [4], explaining: [2] };
const PARTS = new Set(['interpreting', 'producing', 'explaining']);
const MAX_TRIES = 200;

function checkTemplates(templates, id) {
  for (const t of templates) {
    if (!PARTS.has(t.part)) throw new Error(`Template ${t.id} in ${id} has unknown part "${t.part}".`);
    if (t.kind === 'entry' && t.points !== 4) throw new Error(`Entry template ${t.id} must be worth 4 points (one per rubric line).`);
  }
}

function checkGateShape(templates, id) {
  for (const [part, points] of Object.entries(GATE_SHAPE)) {
    const has = templates.filter((t) => t.part === part).map((t) => t.points).sort();
    if (JSON.stringify(has) !== JSON.stringify(points)) {
      throw new Error(`Gate ${id} needs ${part} items worth ${points.join(' + ')} points, has ${has.length ? has.join(' + ') : 'none'}.`);
    }
  }
}

// What must differ between versions: the answer, or for explanation items the prompt.
const versionKey = (item) => JSON.stringify(item.answer ?? item.prompt);

// count versions of an assessment. Every version of every item has a
// different answer, unless its template is marked fixed. Seeds come from
// the assessment id, version and template id, so reordering templates
// changes nothing.
export function assessmentVersions(templates, id, { count = 4, shape = null } = {}) {
  checkTemplates(templates, id);
  if (shape === 'gate') checkGateShape(templates, id);
  const versions = Array.from({ length: count }, () => []);
  templates.forEach((template, t) => {
    const used = new Set();
    for (let v = 0; v < count; v++) {
      let chosen = null;
      for (let salt = 0; salt < MAX_TRIES && !chosen; salt++) {
        const item = generateItem(template, seedFor(id, v, template.id, salt));
        if (template.fixed || !used.has(versionKey(item))) chosen = item;
      }
      if (!chosen) throw new Error(`Template ${template.id} gives the same answer too often to make ${count} versions; widen its parameter ranges or mark it fixed.`);
      used.add(versionKey(chosen));
      versions[v][t] = chosen;
    }
  });
  return versions;
}

// Four versions of a module gate, one per attempt.
export function gateVersions(templates, gateId) {
  return assessmentVersions(templates, gateId, { count: 4, shape: 'gate' });
}
