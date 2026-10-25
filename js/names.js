// Plain names for modules and checks, as learners see them: "m05" ->
// "Module 5", "a1" -> "Add-on A1".

export const moduleName = (id) => (/^m\d\d$/.test(id) ? `Module ${Number(id.slice(1))}`
  : /^a\d$/.test(id) ? `Add-on ${id.toUpperCase()}`
    : id === 'prereq' ? 'Money arithmetic refresher'
      : { ca: 'Checkpoint A', cb: 'Checkpoint B', cc: 'Checkpoint C', exam: 'Final exam', retention: 'Four-week review', demo: 'Sample check', 'placement-ca': 'Placement test (Module 5)', 'placement-cb': 'Placement test (Module 9)' }[id] ?? id);
