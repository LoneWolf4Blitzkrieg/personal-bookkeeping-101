# Personal Bookkeeping 101

A free, self-paced course in personal bookkeeping for people just starting to earn their own money. Every example is a page of classic double-entry ledger paper, kept by hand or on screen.

The course covers keeping your books, budgeting with logic instead of emotion, planning ahead and building an emergency fund, with add-on modules on the Federal Reserve, inflation and IRAs. It follows the teaching standard in [`docs/proposal.txt`](docs/proposal.txt); the full course design is in [`docs/design.md`](docs/design.md).

## What is in the course

- **16 modules**, about 2.5 hours each (1 hour of lessons, 90 minutes of practice), in four phases: foundations, core bookkeeping, proving and planning, and saving ahead with the final project.
- **A check at the end of every module**: 10 questions, passed at 80% of the points. Checkpoints after Modules 4, 8 and 12, and an optional two-stage placement test for people who already keep books.
- **A final project** (Modules 15 and 16): one full month of books, planned, kept, proved, reconciled with the bank and reported, using your own month or a fictional sample month.
- **Three add-on modules**: the Federal Reserve, inflation and its causes, and IRAs.
- **A 50-question final exam** (80% to pass), an unofficial certificate of completion, and a four-week review.

Every real-world figure (tax rates, the minimum wage, interest and inflation rates, company results, IRA limits) comes from a public source, cited on the page where it appears. The sources are listed in [`content/sources.js`](content/sources.js).

## Opening the course

The course is a static website with no installation, no accounts and no tracking. It must be opened from a web address, not by double-clicking a file. To run it on your own computer, serve the folder with any static web server, for example:

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000/>.

Progress is saved in your own browser (local storage) and never leaves it. To move to another computer or keep a backup, use **Save a progress file** on the home page, then **Load a progress file** on the other computer.

## Publishing on GitHub Pages

1. Push this repository to GitHub.
2. On GitHub, open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then the **main** branch and the **/ (root)** folder, and save.
4. After a minute or two, the course is live at `https://<your-user-name>.github.io/<repository-name>/`.

Keep the empty [`.nojekyll`](.nojekyll) file at the top of the repository: it tells GitHub Pages to publish the files exactly as they are, without rebuilding them.

## Accessibility

- Ledgers and reports are real HTML tables with headers, so screen readers can read them.
- Everything works with the keyboard; nothing is timed.
- A **Larger text** button in the top bar makes all text 25% larger, and the choice is remembered.
- Pages work on phones (the ledger is pinned above the lesson text). Each ledger sheet prints whole on one page, with the answers hidden; the certificate prints on one page.

## Running the tests

The tests use Node's built-in test runner (Node 18 or later) and have no dependencies:

```bash
node --test tests/
```

They check the code and the content: every ledger balances, every running balance is right, every example uses only ideas already taught, every source and link resolves, every check has exactly 10 questions, and no question shows another question's answer.

## License

*Personal Bookkeeping 101* by Raul Bautista is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (free for non-commercial use).

This covers everything in this repository, lessons and code alike, except the one file named below. You may use, share and adapt it for non-commercial purposes, provided you credit Raul Bautista and release your adaptations under the same license. The full legal text is in [`LICENSE`](LICENSE).

**One exception:** the celebration music, [`media/ode-to-joy-finale.mp3`](media/ode-to-joy-finale.mp3), is a third-party recording. Beethoven's music and Schiller's words are public domain, but the recording is not, and it is not covered by this license. See [`media/NOTICE.md`](media/NOTICE.md).
