# First Moves: progress and handoff

**Read this first if you are an agent continuing this work.** Update it (and commit) at every milestone.

## What this is

First Moves is a free, unofficial, hands-on course that teaches brand-new Ableton Move owners, who are also new to music-making, to use their Move step by step.

- **Hosting:** GitHub Pages at `ManMan88/first-moves`, served at https://manman88.github.io/first-moves/.
- **Owner:** Ron Danon.
- **Git identity:** set locally in this repo to `Ron Danon <rondanon@gmail.com>`. The global config is Ron's work identity; never change it and never commit with it.

## Key documents

| Doc | Purpose |
|---|---|
| `docs/research/2026-09-25-prior-art-and-device-research.md` | Prior art, copyright and branding rules, Move 2.x documentation status, Shift + Step table verified against the manual text, parked Web MIDI facts |
| `docs/superpowers/specs/2026-09-25-first-moves-design.md` | The design spec (approved/delegated) |
| `docs/superpowers/plans/2026-09-25-first-moves-stage1.md` | Stage 1 implementation plan: tasks with checkboxes |
| `docs/hardware-checklist.md` | Claims Ron must verify on a real Move (created in Stage 1, Task 8) |

## Decisions made (and by whom)

- **By Ron:**
  - Audience: new Move owners who are new to music.
  - Guided mode only: the Move is **not** connected to the computer. Web MIDI is parked.
  - Stack: Astro + Markdown/MDX.
  - The learner experience and curriculum sections.
- **Delegated by Ron to Claude on 2026-09-25** ("decide for yourself"; he went offline):
  - Name "First Moves" and repo `first-moves`.
  - Staging: 3 stages.
  - Target firmware 2.1.
  - Content accuracy and copying rules.
  - Test strategy.
  - Build the site itself natively; write lessons with an Opus **medium-effort** workflow (writer → verifier per lesson).
- **Ron's standing instructions:**
  - Helper agents run on Opus at **medium** effort.
  - Save progress and plans in `.md` files so another agent can continue.

## The manual text (needed for writing lessons and the copying check)

- **Never commit** the manual PDF or its text: Ableton's copyright forbids reproducing it.
- Run `scripts/fetch-manual.sh` (created in Stage 1, Task 1). It downloads the PDF and extracts `.cache/move-manual.txt`; `.cache/` is git-ignored.
- `npm run check:overlap` reads `.cache/move-manual.txt`.
- Manual URL: https://cdn-resources.ableton.com/resources/pdfs/move-manual/1/2025-07-25/move1-manual-en.pdf (the 1.x manual). Features added in 2.x come from https://www.ableton.com/en/release-notes/move-1/.

## Status

Legend: ✅ done · 🔄 in progress · ⬜ not started

### Setup and design
- ✅ Local git identity set; repo initialised on `main`.
- ✅ Research doc committed (`f1f7fcf`).
- ✅ Spec committed (`c40fec7`).
- ✅ Stage 1 plan committed.

### Stage 1: site + lessons 1–8 (plan: `docs/superpowers/plans/2026-09-25-first-moves-stage1.md`)
Work happens on branch `stage-1`; it is fast-forwarded to `main` before publishing (Task 9).
- ✅ Task 1: Scaffold, base-path helper, CI
- ✅ Task 2: Controls registry and drawing geometry
- ✅ Task 3: Move drawing and controls reference page
- ✅ Task 4: Progress store
- ✅ Task 5: Lesson collection, step components, stepper
- ✅ Task 6: Home, course map, glossary, about, 404
- ✅ Task 7: End-to-end tests and copying check
- ✅ Task 8: Lessons 1–8 written (4 writers → 4 fact-checkers) and edited; hardware checklist at `docs/hardware-checklist.md`.
- ✅ Task 9: Published. `ManMan88/first-moves` is public; Pages is deployed by GitHub Actions on every push to `main`; the live pages and the step player are verified.
- ✅ Task 10: Whole-branch review. Verdict: "With fixes", with 0 critical and 6 important findings. All important findings, plus 4 minors graded up, are fixed with tests (commit `0af6b4f`).

### Stage 2: lessons 9–17 ✅
- Written (4 writers → 4 fact-checkers), then reviewed and committed (`7858b0a`); live.
- Workflow script: `docs/superpowers/workflows/write-lessons-9-17.js`.
### Stage 3: lessons 18–26 ✅
- Written (4 writers → 4 fact-checkers) and committed (`734b27d`); all 26 lessons live.
- Workflow script: `docs/superpowers/workflows/write-lessons-18-26.js`.
- Added `row-N`/`column-N` aliases so a scene slide lights as one action.

### Final course-continuity review ✅
- One reviewer-editor read all 26 lessons in order and made 20 small fixes: links to where skills are taught, consistent track-button naming, one course Set used from Lesson 9 onwards, warnings before earlier work gets overwritten, and a phone headphone-adapter note.
- Left as is:
  - the example columns in Lessons 18 and 20 (the text says "your column may differ");
  - Lesson 24 converting the bottom track (it already warns and suggests copying the Set first).

## What's next (ideas, not started)
1. **Ron checks `docs/hardware-checklist.md` on his Move.** Start with the 🔴 items. Fix any lesson that differs; the checklist names the file.
2. **Deferred accessibility items:**
   - the step player's double announcement;
   - a roving tabindex and screen-reader feedback on the controls page.
3. **Optional:** a "connected mode" using Web MIDI. It's parked; see research §5, which also lists what to verify on hardware first.
  - merge the hardware checks into the checklist;
  - add glossary links;
  - run a final course-continuity review of all 26 lessons.

## How to resume

1. Read the spec, then the current plan. Find the first unchecked task in the plan and the first ⬜/🔄 in the Status list above.
2. Run `git log --oneline` to see what actually landed. Trust git over this file if they disagree, then fix this file.
3. Run `npm ci` (once `package.json` exists), then `npm run check && npm test`.
4. Continue the task. After each task: run the checks, commit, tick the plan checkbox, and update this Status list.

## Log

- 2026-09-25:
  - Research, spec and Stage 1 plan written and committed.
  - Ron approved the curriculum and architecture sections, then delegated the rest.
  - Tasks 1–6 done on `stage-1`:
    - scaffold and CI;
    - controls registry and SVG drawing;
    - controls page;
    - progress store;
    - lesson system with step player;
    - home, course, glossary, about and 404 pages.
  - Lesson 1 is still a pipeline-proof draft; real content comes in Task 8.
  - Decisions logged during the work:
    - `@types/node` added (dev) for type-checking tests;
    - the "Lesson complete" panel reads the next-lesson link from `data-next-href` on the lesson `<article>`;
    - back-panel ports are drawn further apart than on the real device so their labels don't overlap;
    - the manual doesn't say which track button is Track 1: `track-1` is assumed to be the top one and goes on the hardware checklist. Manual 6.1.1's "top track" wording later made this very likely.
  - Task 7:
    - The e2e tests serve `dist/` with `scripts/serve-dist.mjs`. Astro 7's `astro preview` puts itself in the background when not on a TTY, so Playwright can't manage it.
    - The e2e tests also run in CI.
  - Task 8:
    - A fact-checker found Manual 6.1.1: a new Set's preset *families* are fixed by track (Drums top, Bass second, Pad/Keys/Plucked/Rhythmic third, Lead/Winds bottom). Spec rule 4 was relaxed to match, and lessons 3, 6 and 7 now use it.
    - Added tests: exactly one `<Steps>` per lesson, and a `press` on every `<Step>`.
    - Fixed a phone bug found in review: the next step scrolled under the sticky drawing.
    - The writers' handoff notes were merged into the checklist and removed.
  - Stage 1 review fixes (`0af6b4f`):
    - progress no longer lost across tabs;
    - Continue goes to where you left off;
    - the sticky drawing no longer covers steps on landscape phones or without JS;
    - order badges are readable (sized in screen pixels, one per action);
    - AA contrast in light mode;
    - the copying check covers visible frontmatter and manual page breaks;
    - the unsourced "double-press Shift to lock" claim was removed.
  - **Deferred minors** (not fixed yet):
    - the step player announces twice for screen readers (`aria-live` plus focus);
    - the controls page has about 70 tab stops (needs a roving tabindex) and gives no screen-reader feedback when a control is chosen;
    - lesson MDX hardcodes `/first-moves/` (guarded by the e2e crawler).
  - Stage 2: fact-checkers corrected the research doc (Max Length arrived in 2.0.0, not 2.1). Standalone Shift + Step 14 (new clip) comes from release notes 1.4; the manual only shows it for Control Live. It's on the checklist.

## Decisions made on Ron's behalf (from the Stage 1 execution log)

| Decision | Why | Cost if wrong |
|---|---|---|
| Work on branch `stage-1`, fast-forwarded to `main` | New repo, no parallel work | None |
| Pin actions/checkout and setup-node to v7 | Latest releases | None |
| Draw the back-edge ports further apart than on the real device | So the labels don't overlap | Cosmetic |
| Add `@types/node` as a dev dependency | Type-checking the tests | One dev dependency |
| The "Lesson complete" panel reads the next-lesson link from `data-next-*` on the lesson article | Simpler than a component wrapper | None |
| e2e tests serve `dist/` with `scripts/serve-dist.mjs` instead of `astro preview` | Astro 7's preview puts itself in the background without a TTY | None |
| e2e tests also run in CI | Base-path bugs only show on Pages | About 1 min of CI time |
| Spec rule 4 relaxed per Manual 6.1.1 (preset families fixed per track) | Primary source | A step might point at the wrong track in a demo Set (each such step has a caveat) |
| Lessons 2, 5 and 8 keep 12–16 steps in a single `<Steps>` block | Progress is saved per lesson | Longer lessons |
| CI token scope not changed | The deploy job never runs on pull requests | Low |
