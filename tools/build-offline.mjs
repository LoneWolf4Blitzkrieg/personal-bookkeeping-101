// Builds offline/course.js, the double-click version of the course: every
// module the five pages use, bundled into one ordinary script that index.html
// loads when it is opened straight from a file (browsers refuse module scripts
// there). The page bodies come from the real HTML files, so both versions
// share the same markup. No dependencies.
//
//   node tools/build-offline.mjs
//
// A test rebuilds the bundle and fails if offline/course.js is out of date.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const OUTPUT = 'offline/course.js';
export const PAGES = ['index.html', 'lesson.html', 'assess.html', 'print.html', 'certificate.html'];
const ROUTER = 'js/offlineRouter.js';
const ADDRESS = /\b(location\.(search|hash|href|pathname|assign|replace|reload)|history\.(pushState|replaceState|back|forward|go|state))\b/;

// Windows checkouts may hold CRLF line endings; the bundle always uses LF.
export const read = (path) => readFileSync(ROOT + path, 'utf8').replace(/\r\n/g, '\n');
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const unescapeHTML = (text) => text.replace(/&(amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m]);

function resolve(from, specifier) {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    throw new Error(`${from}: only relative imports can be bundled (${specifier})`);
  }
  return posix.normalize(posix.join(posix.dirname(from), specifier));
}

// Rewrites one module's import and export statements for the bundle's own
// little module system. Returns the code and the modules it needs.
export function rewrite(id, source, { page = false } = {}) {
  const deps = [];
  const requires = [];
  const exported = [];
  let code = source
    .replace(/^[ \t]*import\s*\{([^}]*)\}\s*from\s*'([^']+)';?[ \t]*$/gm, (_, names, specifier) => {
      const dep = resolve(id, specifier);
      deps.push(dep);
      const parts = names.split(',').map((n) => n.trim()).filter(Boolean).map((n) => {
        const m = n.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
        if (!m) throw new Error(`${id}: cannot read the import "${n}"`);
        return m[2] ? `${m[1]}: ${m[2]}` : m[1];
      });
      requires.push(`const { ${parts.join(', ')} } = require(${JSON.stringify(dep)});`);
      return '';
    })
    .replace(/^[ \t]*import\s*\*\s*as\s+(\w+)\s+from\s*'([^']+)';?[ \t]*$/gm, (_, name, specifier) => {
      const dep = resolve(id, specifier);
      deps.push(dep);
      requires.push(`const ${name} = require(${JSON.stringify(dep)});`);
      return '';
    })
    .replace(/^[ \t]*export\s+(async\s+function\*?|function\*?|const|let|class)\s+(\w+)/gm, (_, kind, name) => {
      exported.push([name, name]);
      return `${kind} ${name}`;
    })
    .replace(/^[ \t]*export\s*\{([^}]*)\};?[ \t]*$/gm, (_, names) => {
      for (const n of names.split(',').map((x) => x.trim()).filter(Boolean)) {
        const m = n.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
        if (!m) throw new Error(`${id}: cannot read the export "${n}"`);
        exported.push([m[2] ?? m[1], m[1]]);
      }
      return '';
    });
  const left = code.match(/^\s*(import|export)\b.*$/m) ?? code.match(/\bimport\s*\(|\bimport\.meta\b/);
  if (left) throw new Error(`${id}: cannot bundle "${left[0].trim()}"`);
  // In the bundle every page lives at index.html#/page, so a module that read
  // or changed the address would see or break index.html's own.
  const address = id === ROUTER || page ? null : code.match(ADDRESS);
  if (address) throw new Error(`${id}: the double-click version cannot use "${address[0]}"`);
  const getters = exported.map(([name, local]) => `${name}: () => ${local}`).join(', ');
  if (getters) code = `define(exports, { ${getters} });\n${code}`;
  return { deps, code: `${requires.join('\n')}\n${code.replace(/^\n+/, '')}` };
}

// Takes a page apart, and refuses anything the double-click version would
// otherwise silently leave out.
function pageParts(file) {
  const html = read(file);
  const body = html.match(/<body>([\s\S]*)<\/body>/)?.[1];
  if (!body) throw new Error(`${file}: no <body>`);
  const scripts = [...body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const modules = scripts.filter((m) => m[1] === ' type="module"');
  if (modules.length !== 1) throw new Error(`${file}: needs exactly one module script in its body, not ${modules.length}`);
  for (const m of scripts) {
    // index.html's own check for a missing offline/course.js is the one other script allowed.
    if (m !== modules[0] && !(file === 'index.html' && m[1] === '' && m[2].includes('!window.pb101Offline'))) {
      throw new Error(`${file}: the double-click version would leave out a script in the body`);
    }
  }
  const links = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  const styles = links.map((link) => {
    const m = link.match(/^<link rel="stylesheet" href="([^"]+)">$/);
    if (!m) throw new Error(`${file}: cannot carry over the stylesheet ${link}`);
    return m[1];
  });
  const title = unescapeHTML(html.match(/<title>([^<]*)<\/title>/)[1]);
  if (/&[#\w]+;/.test(title)) throw new Error(`${file}: the title holds an entity the build does not know`);
  return {
    title,
    styles,
    body: body.replace(/[ \t]*<script\b[^>]*>[\s\S]*?<\/script>\n?/g, '').trim(),
    start: modules[0][2],
  };
}

const dedent = (text) => {
  const depth = Math.min(...text.split('\n').filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return text.replace(new RegExp(`^ {${depth}}`, 'gm'), '');
};

export function buildOffline() {
  const modules = new Map();
  const visit = (id, trail) => {
    if (trail.includes(id)) throw new Error(`import cycle: ${[...trail, id].join(' -> ')}`);
    if (modules.has(id)) return;
    const mod = rewrite(id, read(id));
    for (const dep of mod.deps) visit(dep, [...trail, id]);
    modules.set(id, mod);
  };

  const pages = PAGES.map((file) => {
    const parts = pageParts(file);
    const start = rewrite(file, dedent(parts.start), { page: true });
    for (const dep of start.deps) visit(dep, []);
    // The page's own address after "#/" takes the place of location.search.
    const code = start.code.replace(/\blocation\.search\b/g, 'search');
    if (/\b(location|history)\b/.test(code)) throw new Error(`${file}: its start script uses the address beyond location.search`);
    return `  ${JSON.stringify(file)}: {
    title: ${JSON.stringify(parts.title)},
    styles: ${JSON.stringify(parts.styles)},
    body: ${JSON.stringify(parts.body)},
    start(search) {
${code.trim()}
    },
  },`;
  });
  visit(ROUTER, []);

  const defs = [...modules.keys()].sort().map((id) =>
    `defs[${JSON.stringify(id)}] = function (exports, require, define) {\n${modules.get(id).code.trim()}\n};`);

  return `// Personal Bookkeeping 101 by Raul Bautista, licensed under CC BY-NC-SA 4.0.
// The double-click version of the course: built from the course's own files by
// tools/build-offline.mjs. Do not edit by hand; run that tool instead.
(function () {
'use strict';
const defs = {};
${defs.join('\n\n')}

const done = {};
const loading = new Set();
function define(exports, getters) {
  for (const [name, get] of Object.entries(getters)) Object.defineProperty(exports, name, { enumerable: true, get });
}
function require(id) {
  if (done[id]) return done[id];
  if (loading.has(id)) throw new Error('import cycle at ' + id);
  loading.add(id);
  const exports = {};
  defs[id](exports, require, define);
  loading.delete(id);
  done[id] = exports;
  return exports;
}

const pages = {
${pages.join('\n')}
};

globalThis.pb101Offline = { require, pages, modules: Object.keys(defs) };
if (typeof document !== 'undefined') require(${JSON.stringify(ROUTER)}).startOffline(pages);
})();
`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  mkdirSync(ROOT + posix.dirname(OUTPUT), { recursive: true });
  const text = buildOffline();
  writeFileSync(ROOT + OUTPUT, text);
  console.log(`Wrote ${OUTPUT} (${Math.round(text.length / 1024)} KB).`);
}
