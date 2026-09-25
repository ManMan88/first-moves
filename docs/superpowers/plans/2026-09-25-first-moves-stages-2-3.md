# First Moves, Stages 2–3: Lessons 9–26 Plan

> **For agentic workers:** the site itself is frozen. This plan only **adds lesson files** (plus glossary links and hardware-checklist entries afterwards, edited one file at a time). Use the same workflow shape as Stage 1, Task 8: a writer, then an adversarial fact-checker, Opus at **medium** effort, and 2 lessons per writer.

**Goal:** Write lessons 9–26 so the whole curriculum in the spec is live.

**Spec:** `docs/superpowers/specs/2026-09-25-first-moves-design.md` (section 4, content rules, is binding). Research: `docs/research/2026-09-25-prior-art-and-device-research.md` (section 4 has the 2.x changes and the Shift + Step table).

**Writer brief:**
- Reuse the `COMMON` brief from the Stage 1 lesson workflow, whose content is copied into "Writer brief (shared)" below.
- Add the per-lesson outline from this file.
- The manual text is at `.cache/move-manual.txt`; run `scripts/fetch-manual.sh` first if it's missing.

## Global Constraints

- Lesson files are named `src/content/lessons/NN-slug.mdx`. Frontmatter follows `src/content.config.ts`; `part` and `order` are exactly as listed below.
- Original wording only: no run of 8 or more words shared with the manual (`npm run check:overlap`).
- Button combinations come from the manual *text* or the research doc's §4, never from the diagram.
- New Sets get **random** presets, so a lesson never assumes a track's sound.
- `<Screen>` shows only display text that the source material states in words.
- Anything not confirmed by the manual text goes on `docs/hardware-checklist.md`.
- Internal links are absolute: `/first-moves/...`.
- Writers never run `astro build` in parallel. Validate with `npx vitest run tests/unit/lesson-controls.test.ts` and `npm run check:overlap`.

## Review Focus

1. **2.x changes inside 1.x workflows.** Recording now stops with Record (beta 2.0.0b2); time signatures add step pages (2.1); Session Mode hides Key & Scale and Full Velocity (2.0); a clip launched close to the next quantization point waits for the one after (2.0.5). Lessons 11, 14, 18 and 20 must reflect these with `<Note kind="newer">`.
2. **Solo and track-menu combos postdate the manual.** Solo is Shift + Mute + track button (1.3); Shift + track button opens the track menu (1.4/1.5). Both go on the hardware checklist.
3. **Sampling paths changed.** USB-C sampling (1.3), slicing (1.5), Shift + press the wheel for Slice/Reverse (1.6), mono mic and "Line in – Mono" (2.1). Lessons 21–23 must not contradict these.
4. **Audio tracks (lesson 24) have no manual at all.**
   - Base it only on the research doc's §4 and the release notes / Help Center FAQ (Zendesk API URL in research §4).
   - Mark every step as coming from the release notes.
   - Put every step on the checklist.
5. **Destructive actions** (delete clip, delete Set, clear automation) need a warning and an Undo tip where the manual supports Undo.

---

## Lesson outlines

**Part 2 · Make a beat**

| # | Slug | Title | Manual / sources | Video | Must cover |
|---|---|---|---|---|---|
| 9 | `09-first-beat` | Beats, bars & steps | 9.5 Sequencing Notes; 13.2 Step Grid; 20 (step buttons) | `aGjZ2HGK0mw` "Making a beat and recording" | `<StepGrid>` concept (4 steps per beat, steps 1/5/9/13 start beats); pick a drum track by ear; select a drum pad, then press steps to place hits; Play; a basic kick on 1/5/9/13 and a snare on 5 and 13 (beats 2 and 4); remove a hit by pressing its step again |
| 10 | `10-tempo-metronome-groove` | Tempo, metronome & groove | 10.1 Tempo (Shift + Step 5); 10.2 Groove (Shift + Step 7); 10.3 Metronome (Shift + Step 6) | – | What BPM means; change tempo with the wheel; groove/swing by ear; metronome on and off |
| 11 | `11-record-live` | Record live | 14.1 Recording Notes; 14.1.1 Count-In and Metronome; 13.1 Quantize; 13.3 Count-In; 11.7 Quantizing Notes (Shift + Step 16) | – | Record button; count-in; overdub; quantize afterwards. `<Note kind="newer">`: Record stops recording (2.x) and Max Length in Workflow Settings (2.1) |
| 12 | `12-capture` | Capture: never lose an idea | 14.3 Capturing Notes and Automation; 20 (Capture) | – | Play freely, then press Capture; tempo detection when stopped; Shift + Capture clears |
| 13 | `13-edit-steps` | Edit steps: velocity, length, nudge | 11.1 Velocity; 11.2 Note Transposition; 11.3 Note Length; 11.4 Note Nudge; 11.9 Adding or Removing Multiple Notes | – | Hold a step and turn the encoder or Volume knob (velocity, per the manual); plus/minus to transpose; arrows to nudge; length |
| 14 | `14-loops` | Loop length & Loop Mode | 12.1 Loop Length; 12.2 Doubling the Loop (Shift + Step 15); 12.3 Duplicating Clips; 12.4 Deleting Clips and Notes; 11.5 Adjusting Notes in Loop Mode | – | Loop button; bars on the steps; lengthen, double and duplicate. `<Note kind="newer" firmware="2.1">`: time signatures and step pages |

**Part 3 · Melody & bass**

| # | Slug | Title | Manual / sources | Video | Must cover |
|---|---|---|---|---|---|
| 15 | `15-bassline-and-chords` | Bassline & chords | 9.5 Sequencing Notes (melodic: hold pads, press a step); 11.8 Copying Notes and Step Ranges; 11.9 | – | What a bassline and a chord are; sequence single notes, then chords (several pads held, then a step); copy steps |
| 16 | `16-arp-and-repeat` | Arpeggiator & note repeat | 11.6 Arpeggiator and Repeat (Shift + Step 11) | – | What an arpeggio is; turn it on; the modes; note repeat on drums |
| 17 | `17-shape-the-sound` | Shape the sound: knobs & automation | 7 Using Instruments and Effects (parameters on the encoders); 14.2 Recording Automation; 14.2.1–14.2.4 (per-step automation); 20 (encoders) | – | Touch a knob to see its name; turn to change; Shift for fine adjustment; record a knob move; delete automation (hold Delete and touch the encoder) |

**Part 4 · Build a song**

| # | Slug | Title | Manual / sources | Video | Must cover |
|---|---|---|---|---|---|
| 18 | `18-session-mode` | Session Mode: clips & scenes | 17 Session Mode; 17.1.1–17.1.5 | `p96WElRlYmw` "Session Mode" | Rows are tracks and columns are scenes; create and launch clips; slide down a column to play a scene; copy and delete clips. `<Note kind="newer">`: launch quantization (2.0.5) |
| 19 | `19-mixing` | Mixing: volume, mute, solo | 16.1–16.8 | – | Output, track, pad and Set volume; mute a track or pad; solo (Shift + Mute + track, release notes 1.3); the limiter explained simply |
| 20 | `20-main-effects` | Main effects & performing | 17.2 Adjusting a Set's Main Effects; 17.1.2; 17.1.5 Retriggering Clips (Shift + Play) | – | What main effects do; performing by launching scenes; retriggering |

**Part 5 · Sampling & audio**

| # | Slug | Title | Manual / sources | Video | Must cover |
|---|---|---|---|---|---|
| 21 | `21-sample-with-mic` | Sample with the mic | 15.1 Sampling Mode; 15.2 Input Source; 15.3 Recording Samples; 15.4 Mic and Line In Sampling (15.4.1 gain, 15.4.2 monitoring) | `OOd4-qFlum8` "Sampling with the microphone" | What sampling is; the Sampling button; pick the mic; record to a pad; play it. `<Note kind="newer" firmware="2.1">`: mic recordings are mono |
| 22 | `22-line-in-and-slicing` | Line-in sampling & slicing | 15.4; 15.8 Sample Slicing; 15.9 Adjusting Sample Parameters | `EJwGnDdFXBI` "Sampling with the audio input" | Plug into Audio in; set the gain; slice across pads; adjust start and length. Slice/Reverse menu via Shift + press the wheel (1.6) goes on the checklist |
| 23 | `23-resampling` | Resampling | 15.5 Resampling; 15.6 Sampling Audio via USB-C; 15.7 Multi-pad recording | – | Record Move's own output; why it's useful |
| 24 | `24-audio-tracks` | Audio tracks | Release notes 2.0.0, 2.1.0; Help Center "Audio Tracks on Move FAQ"; research §4 | – | `firmware: "2.0"`. Make an audio track (browser top → "Audio Track"); record audio (Sampling arms the track, wheel picks the source, Record starts and stops); warping in plain words; bounce a clip to audio (2.1). Every step goes on the checklist |

**Part 6 · Beyond the box**

| # | Slug | Title | Manual / sources | Video | Must cover |
|---|---|---|---|---|---|
| 25 | `25-move-manager` | Move Manager | 3 Move Manager (3.1–3.9); 2.1.9 | `rch9hLGBGfw` "Move Manager" | Open move.local in a browser on the same Wi-Fi; the code shown on Move; download and back up Sets; upload samples; update. This is a computer step, so steps light the display or wheel where Move is involved |
| 26 | `26-cloud-link-midi-live` | Cloud, Link, MIDI & Live | 4.1–4.3; 18 Control Live Mode (overview only); 19 USB Operation Modes; release notes 1.5 and 1.7 (MIDI per track, USB-C MIDI) | – | An overview of where to go next: Cloud sync to Note/Live; Link; MIDI keyboards (USB-A) and USB-C MIDI; Control Live Mode (Shift + Step 2 → Control Live). Keep it short and link to the manual |

## Tasks

### Task A: Stage 2 (lessons 9–17)
- [ ] Run the workflow with pairs (9, 10), (11, 12), (13, 14), (15, 16) and a single writer for 17: writer then fact-checker, medium effort, 9 agents.
- [ ] Merge the hardware checks into `docs/hardware-checklist.md`. Add glossary `lesson` links (one file, afterwards).
- [ ] Run `npm run check && npm test && npm run check:overlap && npm run test:e2e`. Commit, push, check the live site.

### Task B: Stage 3 (lessons 18–26)
- [ ] Run the same workflow with pairs (18, 19), (20, 21), (22, 23), (24, 25) and a single writer for 26.
- [ ] Same merge, checks and deploy as Task A.

### Task C: Final course review
- [ ] One fresh reviewer reads all 26 lessons in order for continuity, repeated or contradictory instructions, and difficulty jumps. Fix confirmed issues, then run all checks and deploy.

## Writer brief (shared)

The shared brief is the `COMMON` constant in `docs/superpowers/workflows/write-lessons-1-8.js` (the Stage 1 lesson workflow; reuse it with a new `LESSONS`/`PAIRS` table). Its essentials:
- **Files to read:**
  - spec §4;
  - research §3–4;
  - `src/data/controls.ts`;
  - the components under `src/components/`;
  - `src/content.config.ts`;
  - the manual text.
- **Format:** frontmatter, then `## The idea`, then `<Steps>…</Steps>`, then `## Try it yourself`, then optionally `## Good to know`.
- **`Step` props:** `press` is ordered ids or aliases; `hold` lists held ids; `see`/`hear` give the result.
- **Pads:** row 1 is the top row. The claim that track 1 is the top button is unverified.
- **Links and MDX syntax:** internal links use `/first-moves/`; no raw `<` or `{` in prose; headings are `##` or `###`.
- **Rules:**
  - original wording;
  - combinations from the manual text;
  - random presets;
  - no invented screen text;
  - write for beginners;
  - one action per step, 5–9 steps;
  - don't repeat what the layout already renders;
  - touch only your own files;
  - no builds.
- **Validation:** `npx vitest run tests/unit/lesson-controls.test.ts` and `MANUAL_TXT=.cache/move-manual.txt npx vitest run tests/content/overlap.test.ts`.
