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

The course has no installation, no accounts and no tracking. There are three ways to open it:

- **On the web**, at its web address once it is published (see [Publishing on GitHub Pages](#publishing-on-github-pages)).
- **By double-clicking**, with no internet needed: download the course (on GitHub, **Code → Download ZIP**), unzip it, open the folder and double-click `index.html`. It is tested only in Chrome and Firefox. See [Using the course without internet](#using-the-course-without-internet).
- **From a local web server**, for example:

  ```bash
  python3 -m http.server 8000
  ```

  then open <http://localhost:8000/>.

Your progress is saved in your own browser (local storage) and never leaves it. To move to another computer or keep a backup, use **Save a progress file** on the home page, then **Load a progress file** on the other computer.

### Using the course without internet

A browser limits what a page opened straight from a file can do. So when you open `index.html` that way, the whole course runs inside that one page, using [`offline/course.js`](offline/course.js). Each page's address then includes `#/`, for example `index.html#/lesson.html?m=m03`. The lessons, the checks, printing, the certificate and the music all work.

Good to know:

- **Keep the whole folder together.** If you open `index.html` on its own, it shows a message that part of the course is missing.
- **Progress in the downloaded copy is separate** from progress on the website. To carry it across, use **Save a progress file** in one, then **Load a progress file** in the other.
- **In Firefox, progress belongs to the place where the folder is.** If you move or rename the folder, the course starts with no progress. Use **Save a progress file** first, then **Load a progress file** after the move.
- **In Chrome, every copy of the course on the computer shares the same progress**, for example an old download and a new one.
- In a private window, progress lasts only until you close the window, as on the web.

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

They check the code and the content, and that the double-click version is up to date: every ledger balances, every running balance is right, every example uses only ideas already taught, every source and link resolves, every check has exactly 10 questions, and no question shows another question's answer.

## Changing the course

After you change any file in `js/` or `content/`, or any of the five course pages (`index.html`, `lesson.html`, `assess.html`, `print.html`, `certificate.html`), rebuild the double-click version:

```bash
node tools/build-offline.mjs
```

Run the tests before you publish: they fail until you run this command, so you will notice when the downloaded copy is out of date.

## License

*Personal Bookkeeping 101* by Raul Bautista is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (free for non-commercial use).

This covers everything in this repository, lessons and code alike, except the one file named below. You may use, share and adapt it for non-commercial purposes, provided you credit Raul Bautista and release your adaptations under the same license. The full legal text is in [`LICENSE`](LICENSE).

**One exception:** the celebration music, [`media/ode-to-joy-finale.mp3`](media/ode-to-joy-finale.mp3), is a third-party recording. Beethoven's music and Schiller's words are public domain, but the recording is not, and it is not covered by this license. See [`media/NOTICE.md`](media/NOTICE.md).
