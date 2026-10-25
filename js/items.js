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
      const count = Math.floor((s.max - s.min) / step) + 1;
      params[key] = s.min + step * Math.floor(rand() * count);
    }
  }
  return params;
}

export function generateItem(template, seed) {
  const params = sampleParams(template.params ?? {}, mulberry32(seed));
  return {
    templateId: template.id,
    module: template.module,
    kind: template.kind,
    part: template.part,
    points: template.points,
    seed,
    params,
    ...template.build(params),
  };
}

const GATE_PARTS = { interpreting: 4, producing: 4, explaining: 2 };
const VERSIONS = 4;
const MAX_TRIES = 64;

function checkGateShape(templates, gateId) {
  for (const [part, needed] of Object.entries(GATE_PARTS)) {
    const has = templates.filter((t) => t.part === part).reduce((sum, t) => sum + t.points, 0);
    if (has !== needed) throw new Error(`Gate ${gateId} needs ${part} items worth ${needed} points, has ${has}.`);
  }
}

// Four versions of a gate (one per attempt). Templates with parameters get
// different parameters in every version; the structure never changes.
export function gateVersions(templates, gateId) {
  checkGateShape(templates, gateId);
  const versions = [];
  for (let v = 0; v < VERSIONS; v++) {
    versions.push(templates.map((template, t) => {
      const varies = Object.keys(template.params ?? {}).length > 0;
      for (let salt = 0; salt < MAX_TRIES; salt++) {
        const item = generateItem(template, seedFor(gateId, v, t, salt));
        const key = JSON.stringify(item.params);
        if (!varies || versions.every((earlier) => JSON.stringify(earlier[t].params) !== key)) return item;
      }
      throw new Error(`Template ${template.id} cannot produce ${VERSIONS} different versions; widen its parameter ranges.`);
    }));
  }
  return versions;
}
