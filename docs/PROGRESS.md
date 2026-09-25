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
- 🔄 Task 7: End-to-end tests and copying check
- ⬜ Task 8: Lessons 1–8 (content workflow) and hardware checklist
- ⬜ Task 9: Publish (create public repo, Pages) and verify live
- ⬜ Task 10: Whole-branch review

### Stage 2: lessons 9–17 ⬜ (plan to be written after Stage 1 is live)
### Stage 3: lessons 18–26, glossary links, final review ⬜

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
    - the manual doesn't say which track button is Track 1: `track-1` is assumed to be the top one and goes on the hardware checklist.
