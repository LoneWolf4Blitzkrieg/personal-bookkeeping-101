# Personal Bookkeeping 101 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (the author's rules below replace subagent-driven development). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Personal Bookkeeping 101 as a free, public, static HTML course: 16 core modules, 3 add-on modules, gates, checkpoints, placement test, final exam and retention test, with every example on a double-entry ledger page.

**Architecture:** A dependency-free static site. Pure logic (money, ledger math, item generation, grading, progress) lives in small ES modules that run in both the browser and Node, so it is unit-tested with Node's built-in test runner. Course content (lessons, ledger examples, exercises, gate templates, sources) is stored as JavaScript data, rendered by one lesson page, and validated by automated content tests that prove every ledger balances and every example uses only ideas already taught.

**Tech Stack:** HTML, CSS, JavaScript ES modules; Node 18 `node --test` for tests; git; GitHub Pages for hosting. No frameworks, no build step, no runtime or dev dependencies.

**Spec:** `Personal_Bookkeeping_101_Design.md` (copied into the repo as `docs/design.md` in Task 1). The governing standard is `40_Hour_Course_Proposal_v3_phonics.txt` (copied as `docs/proposal.txt`).

## Global Constraints

- Repository: `personal-bookkeeping-101/`, local git only. **Never push or create a remote until Raul Bautista says so.**
- Licence: the whole repository (lessons and code) under CC BY-NC-SA 4.0 (`LICENSE`, legal code fetched verbatim from creativecommons.org). No "Copyright" line anywhere. Every page footer and the README carry exactly: "*Personal Bookkeeping 101* by Raul Bautista is licensed under CC BY-NC-SA 4.0 (free for non-commercial use)." with a link to https://creativecommons.org/licenses/by-nc-sa/4.0/
- Work split: Claude writes all code and drafts all content. Sonnet agents are used only to polish English wording and prose. Exactly one Opus reviewer checks each task when it is finished; its findings are fixed before the next task. No separate final review.
- Every example is a double-entry ledger page with the columns, in order: Date, Items, Folio, ✓, Debits, ✓, Credits, Dr/Cr, Balance; header fields Sheet No., Account No., Name, Account. Source documents (pay stubs, checks, receipts, bank statements) may appear beside a ledger only as the thing being recorded.
- All money is held as integer cents. Never use floating-point dollars in logic.
- Rounding to the cent looks at the thousandths of a dollar: "4 and below, keep it below; 5 and above, give it a shove" ($75.144 → $75.14; $1.005 → $1.01). Later digits never matter.
- Every real-world figure carries a `source` id that resolves in `content/sources.js` (title, publisher, URL, date accessed); the page shows the citation.
- Standard paycheck: Arizona minimum wage $15.15/h × 80 h = $1,212.00 gross; 2026 Social Security 6.2%, Medicare 1.45%, federal withholding per IRS Pub. 15-T 2026 (single, standard), Arizona default withholding rate. Each figure verified against the official source before use.
- Suggested bucket split: Spending 60%, Saving 15%, Investing 10%, Charity 5%, Blow money 10%.
- Checks (author's rule, October 24, 2026): every quiz and test is exactly 10 questions and every check passes at 80% of its points, with no other condition. Module gates: 7 interpreting (2 points each; at most one a fluency drill), 2 producing (4 points each), 1 explaining (2 points) = 24 points, pass at 20; four versions per gate. Checkpoints A–C, both placement tests and the prerequisite money check: 10 questions each, pass 80%, items tagged by module, two versions. Final exam: 50 questions, pass 80%, add-on items ≤ 20% of items and of points.
- Tone: calm, no shame. Debated claims never appear as graded questions.
- Official help links only (`.gov` sites, consumerfinance.gov, federalreserve.gov, investor.gov, bls.gov, azdor.gov, azica.gov, irs.gov, ssa.gov); no forum.
- Saving: progress autosaves to `localStorage` after every change, shows a "Saved" indicator, survives closing and reopening the browser, and must work in current Firefox and Chrome. Verified in Firefox (installed, 158) and in Chromium (the built-in browser pane, Chrome's engine).
- Accessibility: ledgers are real `<table>` elements with headers; keyboard operable; contrast meets WCAG AA; large-text toggle; nothing timed.

## Review Focus

- **Browser storage blocked** (private window, storage full): the course still loads and teaches; a banner says progress will not be saved; nothing throws.
- **Amounts typed loosely** ("1,212.00", "$1212", " 75.14 ", "75.1"): parsed to cents correctly; text that is not a number is rejected with a gentle message, not marked wrong.
- **Cent rounding** on percentages (6.2% of $1,212.00 = $75.144): rounded by the thousandths digit (4 and below down, 5 and above up) consistently in examples, generated items and grading.
- **Corrupt or outdated progress file imported**: rejected with an explanation; existing progress untouched.
- **Locked module opened by URL** (`lesson.html?m=9` before Checkpoint B): shows the lock notice and the way to unlock, not the content.

Each line has its test in the task that owns the code (Tasks 2, 3, 4).

---

## File Structure

```
personal-bookkeeping-101/
  index.html               home: welcome, prerequisite check, placement, course start
  lesson.html              one page renders any module (?m=1..16, a1..a3)
  assess.html              gates, checkpoints, placement, final exam, retention (?id=)
  print.html               printable blank or filled ledger sheets (?sheet=)
  css/site.css             layout: course map, text column, pinned ledger, phone layout
  css/ledger.css           the green ledger sheet
  css/print.css            print rules (sheet kept on one page, answers hidden)
  js/money.js              cents parsing, formatting, rounding
  js/paycheck.js           paycheck calculation from tax data
  js/ledger.js             ledger math: normal sides, running balances, posting, balance checks
  js/ledgerView.js         ledger page → HTML string; editable mode markup
  js/items.js              seeded generation of exercise and gate items from templates
  js/grade.js              marking items, scoring gates/checkpoints/exam
  js/progress.js           progress state, unlock rules, failure ladder, export/import
  js/storage.js            safe wrapper over localStorage
  js/app/*.js              browser-only page controllers (lesson, assess, nav, print)
  content/course.js        module list, ideas per module, order, checkpoints
  content/sources.js       citation registry
  content/tax2026.js       sourced 2026 rates and the AZ minimum wage
  content/resources.js     official help links per module
  content/modules/m01.js … m16.js, a1.js … a3.js
  content/assess/*.js      checkpoints A–C, placement, prerequisite, final exam, retention
  content/sampleMonth.js   fictional month for the final project
  tests/*.test.js          unit tests and content validation
  docs/design.md, docs/proposal.txt
  LICENSE, README.md, package.json, .gitignore
```

**Content data shape** (defined in Task 2, used by every content task):

```js
// a ledger page
{ id, sheetNo, accountNo, name, account, type: 'asset'|'liability'|'income'|'expense'|'networth',
  rows: [{ date: '2026-06-06', items, folio, debit: 24000, credit: 0, posted: [true,false] }],
  activeColumns?: ['date','items','balance'],   // modules 1–2 only
  source?: 'id' }
// a module
{ id: 'm01', title, coreIdea, ideas: ['money-uses', ...], steps: [
    { kind: 'explain'|'predict'|'guided'|'independent', text, ledger, highlightRow, uses: [ideaIds],
      answer?, sourceDocs?: [...] } ],
  practice: { recall, drill, interpret, complete, produce }, gate: [templateIds], resources: [ids] }
```

---

### Task 1: Repository, licence and site shell

**Files:**
- Create: `package.json`, `.gitignore`, `LICENSE`, `README.md`, `docs/design.md`, `docs/proposal.txt`, `index.html`, `lesson.html`, `css/site.css`, `js/app/nav.js`, `content/course.js`, `tests/course.test.js`

**Interfaces:**
- Produces: `content/course.js` exports `MODULES` (array of `{id, title, phase, ideas: string[]}` for m01–m16, a1–a3 in order) and `CHECKPOINTS` (`[{id:'ca', after:'m04'}, {id:'cb', after:'m08'}, {id:'cc', after:'m12'}]`); `nav.js` exports `renderCourseMap(container, progress, currentId)`.

- [ ] **Step 1:** `git init` the repository; `package.json` with `"type": "module"`, `"scripts": {"test": "node --test tests/"}`, no dependencies; `.gitignore` excludes nothing but OS junk.
- [ ] **Step 2:** Fetch the CC BY-NC-SA 4.0 legal code from `https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt` into `LICENSE`. README carries the licence notice from Global Constraints.
- [ ] **Step 3: Write failing test** `tests/course.test.js`: `MODULES` has 19 entries with ids `m01`…`m16`, `a1`…`a3`; every teaching module (m01–m14, a1–a3) has 2 or 3 ideas; m15–m16 have 0; idea ids are unique across the course; core idea total ≤ 42.
- [ ] **Step 4:** Run `npm test`. Expected: FAIL (module not found).
- [ ] **Step 5:** Write `content/course.js` from the design's module table (idea ids are short kebab names of each listed idea).
- [ ] **Step 6:** Run `npm test`. Expected: PASS.
- [ ] **Step 7:** Build `index.html`, `lesson.html`, `css/site.css` and `nav.js` to the approved A + C layout (course map, text column, pinned ledger area; phone layout below 760 px). Footer on every page carries the licence notice. Open both pages with `python3 -m http.server` and check in the browser pane at desktop and 375 px widths.
- [ ] **Step 8:** Commit "Set up repository, licence and site shell".
- [ ] **Step 9:** Opus review of Task 1; fix findings; commit.

### Task 2: Money, ledger math and the ledger sheet

**Files:**
- Create: `js/money.js`, `js/ledger.js`, `js/ledgerView.js`, `css/ledger.css`, `css/print.css`, `print.html`, `js/app/print.js`, `tests/money.test.js`, `tests/ledger.test.js`, `tests/ledgerView.test.js`

**Interfaces:**
- Produces:
  - `parseAmount(text: string) -> {ok: true, cents: number} | {ok: false, reason: string}`
  - `formatCents(cents: number) -> string` ("1,212.00")
  - `percentOf(cents: number, rate: number) -> number` (rate as decimal; rounds to the cent by the thousandths digit: 4 and below down, 5 and above up)
  - `normalSide(type) -> 'Dr'|'Cr'`
  - `runningBalances(page) -> [{balance: number, side: 'Dr'|'Cr'}]` (one per row)
  - `entryBalances(entry) -> boolean` (journal entry: total debits = total credits, > 0)
  - `postEntry(entry, pages) -> {pages, entry}` (throws unless the entry balances; new objects; ✓ on posted ledger rows with the journal folio; returned entry lines carry the ledger account number as folio and `posted: true`)
  - `readLedgerInputs(pairs: [name, value][]) -> {rows, errors}` (reads an editable sheet's `r{i}-{column}` fields back into rows)
  - `trialBalance(pages) -> {debits, credits, balanced}`
  - `ledgerHTML(page, {highlightRow, editable, showAnswers, minRows}) -> string`; `blankPage(rows) -> page`

- [ ] **Step 1: Write failing tests.**
  - `parseAmount`: "1,212.00"→121200; "$1212"→121200; " 75.14 "→7514; "75.1"→7510; "abc", "", "1.234" → `ok:false`.
  - `percentOf(121200, 0.062)` → 7514; `percentOf(121200, 0.0145)` → 1757; `percentOf(5, 0.5)` → 3 (half-up).
  - `formatCents(121200)` → "1,212.00"; `formatCents(0)` → "0.00".
  - `runningBalances` on an asset page with debits 24000, 24000 and credit 5000 → balances 24000, 48000, 43000 all 'Dr'; on a liability page a credit balance shows 'Cr'; a balance crossing zero flips side.
  - `entryBalances` true for paycheck split entry, false for one-sided entry.
  - `trialBalance` balanced after posting a balanced entry; unbalanced after a transposed amount.
  - `ledgerHTML` output contains a `<table>` with nine `<th>` in the design's order, `aria-label` with the account title, the highlight class on the requested row, `<input>` cells when `editable`, and greyed columns when `activeColumns` is set.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the five files. `ledger.css` reproduces the green sheet (column rules, header lines, Dr/Cr column) in an original style; `print.css` keeps a sheet on one page and hides answers.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** `print.html?sheet=blank` prints a blank sheet; check print preview in the browser pane.
- [ ] **Step 6:** Commit "Add money and ledger logic and the ledger sheet".
- [ ] **Step 7:** Opus review; fix; commit.

### Task 3: Items, grading and the assessment page

**Files:**
- Create: `js/items.js`, `js/grade.js`, `assess.html`, `js/app/assess.js`, `tests/items.test.js`, `tests/grade.test.js`

**Interfaces:**
- Consumes: Task 2 money and ledger functions.
- Produces:
  - `generateItem(template, seed: number) -> item` (deterministic; template defines kind, parameter ranges, answer function, module tag)
  - `gateVersions(templateIds, gateId) -> item[][]` (exactly 4 versions; seeds derived from gateId and version)
  - `gradeItem(item, response) -> {points, max, feedback, misconception?}`
  - `scoreGate(results) -> {points, passed}`; `scoreCheckpoint(results) -> {percent, passed, missedModules: string[]}`; `scoreExam(results) -> {percent, passed}`

- [ ] **Step 1: Write failing tests.**
  - Same template and seed give identical items; four gate versions differ in at least one amount and keep the same structure.
  - Numeric items accept every loose format from Task 2 and reject non-numbers without counting a wrong attempt.
  - Production items: a learner's journal rows grade fully correct only when accounts, sides and cents all match; partial credit per rubric line.
  - `scoreGate`: 9/10 with producing 4/4 passes; 9/10 with producing 3/4 fails; 7/10 fails.
  - `scoreCheckpoint` returns the earliest-first list of modules whose items were missed; 80.0% passes, 79.9% fails.
  - Explanation items return `{selfMarked: true}` with the model answer and rubric, scored from the learner's ticks.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `items.js` (seeded PRNG such as mulberry32) and `grade.js`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** `assess.html` renders a gate with prediction-before-check flow, then results with explanations; check in the browser pane using a stub template.
- [ ] **Step 6:** Commit; Opus review; fix; commit.

### Task 4: Progress, unlocking and the two speeds

**Files:**
- Create: `js/storage.js`, `js/progress.js`, `tests/progress.test.js`, `tests/storage.test.js`
- Modify: `js/app/nav.js`, `js/app/assess.js`, `index.html`

**Interfaces:**
- Produces:
  - `createStorage(backend) -> {get(key), set(key, value), available: boolean}` (never throws)
  - `emptyProgress() -> Progress` (`{version: 1, started, modules: {[id]: {steps, timeMs, gateAttempts: [], passed}}, checkpoints, errorLog: [], ledgers: {}, placement, examPassedAt}`)
  - `isUnlocked(id, progress) -> {unlocked: boolean, reason?: string}`
  - `recordGate(progress, moduleId, score) -> Progress`
  - `failureStep(attempts: number) -> 'retake'|'rework-example'|'remediation'`
  - `exportProgress(progress) -> string`; `importProgress(text) -> {ok: true, progress} | {ok: false, reason}`

- [ ] **Step 1: Write failing tests.**
  - `createStorage` with a backend whose `setItem` throws → `available:false`, `set` returns false, no exception.
  - m02 locked until m01's gate passes; m05 locked until Checkpoint A passes; placement pass on Checkpoint A unlocks m05; a1 locked until m16 done; exam locked until a3 passes; retention test unlocks 28 days after `examPassedAt`.
  - `failureStep`: attempts 1→'retake', 2→'rework-example', 3+→'remediation'.
  - Export then import round-trips exactly; importing invalid JSON, a wrong `version`, or a missing field returns `ok:false` and leaves the caller's progress untouched.
  - A failed gate schedules that module's recall questions into the next three practice sets.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement; autosave progress after every change with a brief "Saved" indicator in the top bar; wire nav (ticks, locks), the lock notice on `lesson.html` for locked ids, the storage-unavailable banner, export/import buttons, and the error log page section.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Check a locked URL and a private-window load in the browser pane.
- [ ] **Step 5: Cross-browser save check.** Create `tests/browser/save-check.html`: it writes a progress record through `createStorage(localStorage)`, reloads itself, reads the record back, and reports the result by requesting `/save-check-result?engine=<name>&ok=<true|false>` from the local server. Run it in Chromium (browser pane) and in Firefox (`firefox --headless http://127.0.0.1:8101/tests/browser/save-check.html`, using a fresh profile via `-profile` in the workspace), and read both result requests in the server log. Expected: `ok=true` from both. Then, in the browser pane, complete a step, close the tab, reopen the lesson, and confirm the step is still marked done and the "Saved" indicator appeared.
- [ ] **Step 6:** Commit; Opus review; fix; commit.

### Task 5: Content validation and the lesson renderer

**Files:**
- Create: `content/sources.js`, `content/tax2026.js`, `content/resources.js`, `js/paycheck.js`, `js/app/lesson.js`, `tests/paycheck.test.js`, `tests/content.test.js`

**Interfaces:**
- Produces:
  - `paycheck({rateCents, hours, tax}) -> {gross, socialSecurity, medicare, federal, arizona, net}` (cents)
  - `tests/content.test.js` loads every module and assessment and checks the rules below; later content tasks only add data.

- [ ] **Step 1: Verify and record figures.** Fetch from official sources and record in `sources.js` and `tax2026.js`: AZ 2026 minimum wage (azica.gov), 2026 Social Security and Medicare rates and wage base (ssa.gov / irs.gov), IRS Pub. 15-T 2026 percentage-method table for biweekly single, AZ Form A-4 default rate (azdor.gov). If any figure differs from the design (for example the $15.15 wage), stop and tell Raul Bautista before continuing.
- [ ] **Step 2: Write failing tests.**
  - `paycheck` for $15.15 × 80 h gives gross 121200, Social Security 7514, Medicare 1757, federal and Arizona amounts equal to values computed by hand from the recorded tables (written into the test with the working shown in a comment), and net = gross − deductions.
  - Content rules over every module and assessment: each ledger's journal entries balance; every stored balance matches `runningBalances`; every step's `uses` contains only ideas from this or earlier modules (decodable rule); every `source` id exists; every resource link is on the official allowlist; every gate has templates for interpreting, producing and explaining.
- [ ] **Step 3:** Run `npm test`. Expected: FAIL (paycheck missing; content rules vacuous until Task 6 adds modules, so add a stub module fixture that violates each rule and confirm each rule catches it).
- [ ] **Step 4:** Implement `paycheck.js`, `lesson.js` (steps, reread button, prediction box, pinned ledger with highlight, phone layout).
- [ ] **Step 5:** Run `npm test`. Expected: PASS.
- [ ] **Step 6:** Commit; Opus review; fix; commit.

### Tasks 6–9: Core modules (one task per phase)

| Task | Content | Extra files |
|---|---|---|
| 6 | m01–m04, Checkpoint A, prerequisite check and remedial unit | `content/assess/prereq.js`, `content/assess/ca.js` |
| 7 | m05–m08, Checkpoint B, placement test | `content/assess/cb.js`, `content/assess/placement.js` |
| 8 | m09–m12, Checkpoint C | `content/assess/cc.js` |
| 9 | m13–m16, sample month, final project rubric and checklist | `content/sampleMonth.js` |

Each module file follows the content data shape and the proposal's module standard: core idea sentence; retrieval warm-up; explicit instruction with worked example and self-explanation prompt; interpretation and prediction (including one misconception item); guided practice (faded examples); independent task; exit check; 90-minute practice set (recall, 5-minute fluency drill, interpretation, completion, production); gate templates; supplementary practice set; official resource links. Modules 1–2 use `activeColumns: ['date','items','balance']`.

Steps for each of Tasks 6–9:

- [ ] **Step 1:** Draft the phase's module files and assessments as data, with ledger examples, source documents where needed, and gate templates.
- [ ] **Step 2:** Run `npm test`. Expected: PASS (every ledger balances, decodable rule holds, sources resolve). Fix content until it does.
- [ ] **Step 3:** Sonnet agent polishes the English of the phase's lesson text only (prompt: keep meaning, numbers, idea order and tone; plain language for slow and fast readers; return edited text fields only). Apply edits; run `npm test` again.
- [ ] **Step 4:** Work through each module once in the browser pane as a learner, including one failed gate, and fix anything awkward.
- [ ] **Step 5:** Commit "Add modules X–Y"; Opus review of the phase (content accuracy, ledger correctness, tone, decodability); fix; commit.

Task 9 adds a test: the sample month's books close, reconcile to its bank statement and produce an income statement and net-worth statement that agree.

### Task 10: Add-on modules A1–A3

**Files:** `content/modules/a1.js`, `a2.js`, `a3.js`; additions to `content/sources.js`

- [ ] **Step 1:** Research and record sources: Federal Reserve Act of 1913 and Fed basics (federalreserve.gov); CPI history (bls.gov); 2019, 2021 and 2022 revenue and net income for the five largest US drug companies and five largest US health insurers by 2019 revenue, from their annual reports; published studies on both sides of the corporate-pricing debate; insulin price cuts (2023) and the Medicare $35 cap; 2026 IRA contribution limits (irs.gov).
- [ ] **Step 2:** Draft A1–A3 as data. Company ledgers compute profit margins learners can check. Debated material is ungraded and shows both sides with sources.
- [ ] **Step 3:** Add a content test: no graded item in A2 carries the tag `debated`.
- [ ] **Step 4:** `npm test` passes; Sonnet prose polish; browser check.
- [ ] **Step 5:** Commit; Opus review (with a specific check that every figure matches its cited source); fix; commit.

### Task 11: Final exam and retention test

**Files:** `content/assess/exam.js`, `content/assess/retention.js`, `tests/exam.test.js`, `certificate.html`, `js/certificate.js`, `tests/certificate.test.js`

- [ ] **Step 1: Write failing tests:** the exam has exactly 50 items; add-on items ≤ 20% of items and ≤ 20% of points; every core phase is represented; the retention test draws only on core items and is unlocked 28 days after the exam. The exam page shows the author's pre-exam note (`content/honor.js`, `HONOR_NOTES.exam`) before the first question. The certificate (added at the author's request, October 24, 2026) is locked until the final exam is passed and the final project is marked complete; it states that it is unofficial and unaccredited, and shows the learner's typed name, the course title, the completion date and the licence credit; it prints on one page, and its download is a self-contained file that opens without the course.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Write the exam and retention item sets from existing templates.
- [ ] **Step 4:** Run `npm test`. Expected: PASS. Take the exam once in the browser pane, then print and download the certificate.
- [ ] **Step 5:** Commit; Opus review; fix; commit.

### Task 12: Accessibility, print and publishing readiness

**Files:** Modify `css/*.css`, `js/app/*.js`, `README.md`; create `tests/pages.test.js`

- [ ] **Step 1: Write failing test** `tests/pages.test.js`: every HTML page has `lang="en"`, a `<title>`, the exact licence footer text from Global Constraints, and does not contain the word "Copyright", and no external script or stylesheet URLs; every internal link and `?m=` id resolves to a known module or assessment.
- [ ] **Step 2:** Run; fix until PASS.
- [ ] **Step 3:** Manual checks in the browser pane: keyboard-only pass through a lesson and a gate; large-text toggle; 375 px phone layout; print preview of a blank sheet and a filled example with answers hidden.
- [ ] **Step 4:** README: what the course is, how to open it, licence and credit, how to run tests, how to enable GitHub Pages (Settings → Pages → deploy from main branch root).
- [ ] **Step 5:** Commit; Opus review; fix; commit.
- [ ] **Step 6:** Ask Raul Bautista whether to create the GitHub repository and push. Do nothing further until they answer.
