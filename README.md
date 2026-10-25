# Personal Bookkeeping 101

A free, self-paced course in personal bookkeeping for people just starting to earn their own money. Every example is a page of classic double-entry ledger paper, kept by hand or on screen.

The course covers keeping your books, budgeting with logic instead of emotion, planning ahead and building an emergency fund, with add-on modules on the Federal Reserve, inflation and IRAs. It follows the teaching standard in [`docs/proposal.txt`](docs/proposal.txt); the full course design is in [`docs/design.md`](docs/design.md).

## Opening the course

The course is a static website with no installation and no accounts. To run it locally, serve the folder with any static web server, for example:

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000/>.

## Running the tests

The tests use Node's built-in test runner (Node 18 or later) and have no dependencies:

```bash
node --test tests/
```

## Licence

*Personal Bookkeeping 101* by Raul Bautista is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (free for non-commercial use).

This covers everything in this repository, lessons and code alike, except the one file named below. You may use, share and adapt it for non-commercial purposes, provided you credit Raul Bautista and release your adaptations under the same licence. The full legal text is in [`LICENSE`](LICENSE).

**One exception:** the celebration music, [`media/ode-to-joy-finale.mp3`](media/ode-to-joy-finale.mp3), is a third-party recording. Beethoven's music and Schiller's words are public domain, but the recording is not, and it is not covered by this licence. See [`media/NOTICE.md`](media/NOTICE.md).
