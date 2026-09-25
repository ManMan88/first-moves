# First Moves: design

A free, unofficial, hands-on course that teaches brand-new Ableton Move owners to use their Move, one step at a time.
It's hosted on GitHub Pages.

- **Status:** approved.
- **Sections 1 and 2** (learner experience, architecture) were approved by Ron in chat on 2026-09-25.
- **Section 3** (name, hosting, quality process, staging): Ron delegated these ("decide for yourself") on the same day, as he was leaving.
  - The written-spec review and plan-review gates were delegated too. The decisions below are Claude's, taken on his behalf.

Background research: `docs/research/2026-09-25-prior-art-and-device-research.md`.

## 1. Goal and audience

- **Learner:** someone who has just got a Move and has little or no music-making background.
- **Setting:** they hold the Move, which is not connected to a computer, and follow the site on a phone or laptop next to it.
- **Success:**
  - a learner goes lesson by lesson from unboxing to a finished track with their own samples;
  - they can look up what any control does in seconds.
- **Firmware:** the course targets Move **2.1**, the current firmware. The official manual is still 1.x, so 2.x features are taught from release notes and Help Center FAQs.

**Not in scope:**
- device connectivity (Web MIDI; parked, see research §5);
- in-browser audio;
- quizzes;
- accounts;
- translations.

## 2. Learner experience

### Pages
- **Home:** what the site is, plus a "Start" / "Continue where you left off" button.
- **Course map:** parts and lessons, with a tick next to finished lessons.
- **One page per lesson.**
- **Controls reference:** a drawing you can tap; the matching explanation is highlighted.
- **Glossary.**
- **About:** the disclaimer, sources and credits.

### Lesson anatomy
1. **What you'll learn** and what you need first.
2. **The idea:** the music concept in plain language, with a concept drawing where it helps.
3. **Steps:** one instruction per step, with:
   - the controls to press lit up and numbered in order on the Move drawing;
   - what you should see or hear;
   - optional "Didn't work?" tips;
   - Back / I did it buttons.
4. **Try it yourself:** a small open challenge.
5. **Watch:** Ableton's official video for the topic, where one exists, loaded only when clicked.
6. **Next lesson.**

### Behaviour
- Progress is saved per lesson (current step, done/not done) in `localStorage`.
- Everything still works if storage is blocked.
- There's a reset button.
- Lessons are ordered but not locked.
- The layout is mobile-first:
  - on phones the drawing sits at the top with the current step card below it;
  - on wide screens they sit side by side.
- Light and dark themes follow the system setting.
- A footer on every page says "Unofficial. Not affiliated with or endorsed by Ableton AG." and links to the official manual.

### Curriculum (26 lessons in 7 parts, 0–6)

| Part | Lessons |
|---|---|
| 0 · Meet your Move | 1 Tour of the hardware · 2 Power, charging, Wi-Fi & updates |
| 1 · First sounds | 3 Sets, tracks & clips · 4 The three views · 5 Start a new Set · 6 Playing the pads · 7 Scales & octaves · 8 Choosing sounds |
| 2 · Make a beat | 9 Beats, bars & steps · 10 Tempo, metronome & groove · 11 Record live · 12 Capture · 13 Edit steps · 14 Loop length & Loop Mode |
| 3 · Melody & bass | 15 Bassline & chords · 16 Arpeggiator & note repeat · 17 Shape the sound: knobs & automation |
| 4 · Build a song | 18 Session Mode: clips & scenes · 19 Mixing: volume, mute, solo · 20 Main effects & performing |
| 5 · Sampling & audio | 21 Sample with the mic · 22 Line-in sampling & slicing · 23 Resampling · 24 Audio tracks (2.x) |
| 6 · Beyond the box | 25 Move Manager · 26 Cloud, Link, MIDI & Control Live (overview) |

**Reference pages:** controls, including every Shift function; glossary.

## 3. Architecture

- **Stack:**
  - Astro 7, static output;
  - `@astrojs/mdx` for lessons;
  - TypeScript;
  - plain CSS with custom properties;
  - no UI framework.
- **Client-side code:** small vanilla-TS scripts, used only where interaction is needed.

### Units (one job each)
| Unit | Job | Depends on |
|---|---|---|
| `src/data/controls.ts` | Registry of every control: `id`, name, group, what it does, Shift function, drawing geometry key. Single source of truth. | none |
| `src/components/MoveDiagram.astro` | Our own SVG of Move's top panel, plus a back-panel view for the ports. Every control is an element with `data-control="<id>"`. No behaviour of its own. | controls |
| `src/components/Screen.astro` | Mock of the 128×64 display, showing only text stated in the source material. | none |
| `src/components/Steps.astro`, `Step.astro`, `Tip.astro` | Lesson step markup. `Step` props: `press` (control ids in order), `hold` (ids held down), `see`, `hear`. **Throws at build time on an unknown control id.** | controls |
| `src/scripts/stepper.ts` | Progressive enhancement: one step at a time, lights up the diagram, Back / I did it, saves progress. Without JS, all steps show as a numbered list. | progress |
| `src/scripts/progress.ts` | `localStorage` store (key `first-moves:v1`). Every access is wrapped in try/catch. | none |
| `src/components/concepts/*` | Concept drawings: `StepGrid` (steps/beats/bars), `PadNotes` (scale on the pads), `SetMap` (Set → tracks → clips). | none |
| `src/components/Video.astro` | Click-to-load YouTube (youtube-nocookie) placeholder. | none |
| `src/content.config.ts` | `lessons` collection (glob loader, MDX). Frontmatter schema below. | none |
| `src/data/parts.ts`, `src/data/glossary.ts` | Part titles; glossary entries. | none |

### Lesson frontmatter (validated by zod)
- `title`
- `part` (0–6)
- `order` (1–26)
- `summary`
- `needs?` (string[])
- `video?` (`{ id, title }`)
- `sources` (string[], at least one; e.g. `"Manual 9.5"`, `"Release notes 2.1.0"`)
- `firmware?` (for example `"2.0"`)

Lesson files are named `src/content/lessons/NN-slug.mdx`, and the page URL is `/first-moves/lessons/NN-slug/`.

### Data flow
1. At build time: MDX → HTML with `data-press`, `data-hold` and `data-step` attributes.
2. On the lesson page, `stepper.ts` reads those attributes and toggles `data-active` / `data-order` on the diagram's controls.
3. Progress lives only in the browser.

## 4. Content rules (accuracy and copyright)

1. **Original work only.**
   - All text and illustrations are our own.
   - No copied manual sentences, and none of Ableton's images or photos.
   - Nothing from move-anything, whose license forbids AI-made derivatives.
   - The manual PDF and its extracted text stay outside the repo.
2. **Every instruction has a source.**
   - Each lesson's `sources` lists the manual sections and release notes it's based on.
   - Button combinations must match the manual's *text*, not its diagram. The Shift + Step table is in research §4.
3. **Unverified claims go on the hardware checklist.** Anything based on beta notes, forum posts or 2.x release notes goes in `docs/hardware-checklist.md` for Ron to check on his Move.
4. **Don't assume which sounds a new Set has.** The manual says new Sets get *random* Track Presets. Lessons never assume "track 1 is drums". They teach how to tell a drum kit from a melodic sound, or how to browse to one.
5. **No invented screen text.** The `Screen` mock shows only display text the source material states in words. Otherwise the step describes the screen in plain words.
6. **Copying check.** `npm run check:overlap` flags any run of 8 or more words shared by a lesson and the manual text (path given in `MANUAL_TXT`). It runs locally before content is committed; CI skips it when the file isn't available.
7. **Linking and embedding.**
   - Link to the official manual for depth.
   - Official videos are embedded with Ableton's own YouTube IDs:
     - `_c4lz85pOLc`: views
     - `_UQj8c6MaZU`: new Set
     - `5Q1EHEjbuhA`: browsing
     - `CdoT5YuVO1Q`: playing
     - `aGjZ2HGK0mw`: beat and recording
     - `p96WElRlYmw`: Session Mode
     - `OOd4-qFlum8`: mic sampling
     - `EJwGnDdFXBI`: line-in sampling
     - `rch9hLGBGfw`: Move Manager
8. **Branding.**
   - No "Ableton" in the name or domain.
   - An unofficial disclaimer on every page.
   - Ableton product names are used only to describe the product.

## 5. Quality and testing

- **Build-time guards:**
  - the zod frontmatter schema;
  - unknown control id → build error;
  - a build failure blocks deploy.
- **Unit tests (Vitest):**
  - controls registry integrity: ids are unique, every drawn control has an entry and vice versa;
  - the progress store, including when storage throws;
  - the overlap checker;
  - a scan of lesson MDX to confirm every `press` / `hold` id exists.
- **End-to-end tests (Playwright, run locally against `astro preview` with the real base path):**
  - home → lesson;
  - the stepper advances and lights the right controls;
  - progress survives a reload;
  - the course map shows the tick;
  - the controls reference highlights a control when tapped;
  - with JS off, the lesson shows every step.
- **After each deploy:** curl the live URL for the home page, a lesson, CSS and JS (all 200), and check that one lesson works in a browser.
- **CI (GitHub Actions):** install → `astro check` → unit tests → build → deploy to Pages (`withastro/action` + `actions/deploy-pages`), on push to `main`.

## 6. Hosting and repo

- **Repo:** `ManMan88/first-moves`, public.
- **Commit identity:** local git identity Ron Danon <rondanon@gmail.com>.
- **Astro config:** `site: 'https://manman88.github.io'`, `base: '/first-moves'`. Internal links always go through a `url()` helper that adds the base path.
- **License:**
  - code under MIT;
  - lesson text and illustrations under CC BY 4.0;
  - trademarks belong to their owners.

## 7. Staging

1. **Stage 1:**
   - the site itself: all units above, CI/deploy, the controls reference and glossary pages;
   - Parts 0–1 (lessons 1–8);
   - deploy and check on the live URL before starting Stage 2.
2. **Stage 2:** Parts 2–3 (lessons 9–17).
3. **Stage 3:** Parts 4–6 (lessons 18–26); fill in the glossary; final accuracy and copying review of the whole course.

**Parallel writing:** writers for Stages 2–3 may work in parallel, but they only **add lesson files**. Shared files (controls registry, components, glossary) are frozen during the fan-out and edited one at a time afterwards.
