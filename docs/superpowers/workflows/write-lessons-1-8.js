export const meta = {
  name: 'write-lessons-1-8',
  description: 'Write First Moves lessons 1–8 (writer → adversarial fact-checker per pair of lessons)',
  phases: [
    { title: 'Write', detail: '4 writers, 2 lessons each' },
    { title: 'Verify', detail: '4 fact-checkers against the manual text' },
  ],
}

const REPO = '/home/ron/projects/move'

const COMMON = `
You are writing lessons for "First Moves", a free, unofficial, hands-on course that teaches brand-new Ableton Move owners (who are ALSO new to making music) to use their Move. The learner holds a Move that is NOT connected to a computer and follows the lesson on a phone or laptop. The site highlights the controls to press on an SVG drawing of Move for each step.

Repository: ${REPO} (Astro 7 + MDX). Read these first:
- docs/superpowers/specs/2026-09-25-first-moves-design.md (section 4 "Content rules" is binding)
- docs/research/2026-09-25-prior-art-and-device-research.md (section 3 copyright/branding; section 4 has Move 2.x changes and the Shift+Step table verified against the manual text)
- src/data/controls.ts (every valid control id and alias; names and what each control does)
- src/components/Steps.astro, Step.astro, Tip.astro, Screen.astro, Note.astro, concepts/StepGrid.astro, concepts/PadNotes.astro, concepts/SetMap.astro (component props)
- src/content.config.ts (frontmatter schema)
- The Move manual text (Move software 1.x, dated 2025-07-25): .cache/move-manual.txt (4213 lines, pdftotext layout). grep it for the sections you need. Current Move software is 2.1; 2.x additions are only in research doc section 4 and https://www.ableton.com/en/release-notes/move-1/ (you may WebFetch it).

LESSON FILE FORMAT (src/content/lessons/NN-slug.mdx):
---
title: Short title
part: <0-6>
order: <1-26>
summary: One sentence: what the learner will be able to do.
needs:            # optional, plain phrases
  - A Move that is switched on
video:            # only if given below
  id: <youtube id>
  title: <video title>
sources:          # at least one; manual sections by number and name, and release notes by version
  - Manual 9.1 Pad Layouts, Keys, and Scales
firmware: "2.0"   # only if the lesson depends on a 2.x feature
---

## The idea
Plain-language explanation of the music or Move concept (2–5 short paragraphs), with a concept component where it helps.

<Steps>            (view="both" to also show the back edge; view="back" for ports only)
  <Step press="shift step-2" hold="shift" see="What appears or changes.">
    Hold **Shift**, then press **Step 2**.
    <Tip>What to try if it didn't work.</Tip>
  </Step>
  ...
</Steps>

## Try it yourself
A small open challenge (a short paragraph or a few bullets).

(Optional "## Good to know" section with 1–3 short notes, or <Note kind="tip|info|newer" firmware="2.0">...</Note> callouts.)

COMPONENTS (no imports needed; they are provided automatically): Steps, Step, Tip, Screen, Note, Video, StepGrid, PadNotes, SetMap.
- Step props: press = control ids/aliases in the ORDER to press them, space-separated (each token becomes one numbered action on the drawing; an alias like "drum-pads" lights a whole block as one action). hold = the ids that must be held down (they must also appear in press, first). see / hear = the expected result in one sentence. Every Step should light at least one control; a step with nothing to press is not a step (put it in prose instead).
- Aliases: pads (all 32), drum-pads (left 4x4), right-pads (right 4x4), steps, encoders, tracks. Pad ids are pad-ROW-COL with row 1 = TOP row and col 1 = left (pad-4-1 is bottom-left). Track buttons: track-1..track-4 (track-1 is drawn as the TOP one; the manual does not say this, so never tell the learner "the top track button is Track 1" as a fact — say "the track buttons" or "the track button next to the row").
- StepGrid: on (step numbers lit), accent, showBeats, caption. PadNotes: rows (array of 4 arrays of 8 labels, TOP row first), highlight (labels to accent), caption. SetMap: no props. Screen: lines (array of strings). Note: kind ('newer' | 'tip' | 'info'), firmware, title.
- Internal links must be absolute with the base path, e.g. [controls page](/first-moves/controls/), [glossary](/first-moves/glossary/#scale), [Lesson 3](/first-moves/lessons/03-sets-tracks-clips/). Never relative links.
- MDX: do not put raw "<" or "{" characters in prose. Headings are "##" or "###" only (the title is rendered as the h1).

BINDING CONTENT RULES:
1. ORIGINAL WORDING ONLY. The manual is copyrighted and may not be reproduced. Read it for facts, then write in your own words. No run of 8+ consecutive words may match the manual; the checker will fail the lesson otherwise. Do not copy Ableton's tutorials either.
2. ACCURACY. Every button combination must come from the manual TEXT (not the controls diagram) or the research doc's 2.x section / release notes. List what you relied on in "sources". If something is not stated in the manual text (e.g. which row of pads is the lowest octave, exact menu wording, LED colors), either leave it out, phrase it so it does not depend on the detail, or include it and report it as a hardware check.
3. RANDOM PRESETS. New Sets get RANDOM Track Presets. Never assume "track 1 is drums" or "the kick is bottom-left". Teach how to recognise a drum kit vs a melodic sound, or how to browse to one.
4. NO INVENTED SCREEN TEXT. Only use <Screen> (or quote display text) for words the manual text states in words (e.g. a menu entry named in the text). Otherwise describe the screen in plain words ("the display shows the Setup menu").
5. BEGINNERS. Second person, short sentences, friendly, no jargon without explanation. Explain the music idea behind what they press. Name controls in **bold** exactly as in controls.ts names (Shift, Step 2, Play, the wheel, Back, Note/Session, a track button, knobs, Volume knob...). Each Step is ONE action (one combo). 5–9 steps per lesson is typical. Include a <Tip> where beginners commonly get stuck.
6. The lesson layout already renders the title, summary, needs, the video (from frontmatter), the sources list and prev/next links — do NOT repeat those in the body.
7. Do not modify any file except your own lesson files. Do NOT run "astro build", "npm run build" or "npm run dev" (other agents are working in parallel and builds would clash).

VALIDATE your files (these are safe to run in parallel):
- npx vitest run tests/unit/lesson-controls.test.ts   (control ids, sources, file name)
- MANUAL_TXT=.cache/move-manual.txt npx vitest run tests/content/overlap.test.ts   (copying check — must pass for your files; failures for OTHER lesson files are not yours)
Fix anything that fails in your files and re-run until clean.
`

const LESSONS = {
  '01-tour': `01-tour.mdx — part 0, order 1, "Tour of the hardware". REPLACE the existing draft file. Goal: the learner can find every group of controls before making a sound. Cover: what Move is (a standalone instrument with battery and speaker; 1 short paragraph), then a tour with one step per area: the 32 pads, the 16 step buttons, the 4 track buttons, the 8 knobs and the Volume knob, the wheel and display, Shift (and the small icons under the step buttons that Shift unlocks), Back and Note/Session, Play and Record, the column of function buttons (Capture, Sampling, Loop, Mute, Delete, Copy, Undo), the arrows and plus/minus, and the connections on the back edge (use view="both" on Steps). Steps here are "find and touch" steps (no need for anything to happen) — use see= to say what to notice. Point to /first-moves/controls/ for the full reference. Sources: Manual 1.2 Hardware Overview, Manual 20 Move Control Reference. No video.`,
  '02-power-and-setup': `02-power-and-setup.mdx — part 0, order 2, "Power, charging, Wi-Fi & updates". Goal: switch on/off, charge, and use the Setup menu for battery, Wi-Fi, software update and brightness. Read Manual 2 Setup and 2.1.x (Battery Status, Connect to Wi-Fi, Update Move's Software, Adjust Brightness) carefully; also research doc (1.7 added lower brightness levels Dim/Min). Cover: turning on (the power button on the back), charging over USB-C, the first-boot onboarding (you can skip steps), turning off (press power, then press the wheel; Back cancels), force-off (hold power 10 s) as a Good-to-know, opening Setup with Shift + Step 2, navigating with the wheel (turn to scroll, press to open), Back to leave. Wi-Fi and updates: describe as the manual text does; keep it simple (a phone keyboard-style text entry details only if the manual text describes it). Use view="both". Sources as appropriate. No video.`,
  '03-sets-tracks-clips': `03-sets-tracks-clips.mdx — part 1, order 3, "Sets, tracks & clips". Concept lesson: what a Set is (one piece of music; Move stores up to 32; saved automatically), a track (4 per Set, each with a Track Preset = one instrument + two effects, chosen at random for new Sets), and a clip (a container of notes; up to 8 per track). Use <SetMap />. Steps: select each track with its track button and play some pads to hear that track's sound; hold a track button that isn't selected to peek at it without switching; notice drum kits vs melodic sounds as you go (describe how to tell by ear: separate drum hits vs pitched notes). Read Manual 20 definitions, Manual 5 Navigating Between Set Modes, Manual 17 intro (in Session Mode each row of pads is a track's clip slots, each column a scene). Sources accordingly. No video.`,
  '04-three-views': `04-three-views.mdx — part 1, order 4, "The three views". Goal: move between Set Overview, Note Mode and Session Mode, and open a demo Set. Read Manual 2 (four demo Sets after setup), Manual 5 Navigating Between Set Modes, Manual 6 Set Overview (intro), Manual 8 Note Mode, Manual 17 Session Mode (intro). Cover: Set Overview = where Sets live (Shift + Step 1 from other modes); opening a Set (per the manual text); Note Mode = building one track; Session Mode = all clips, a row per track; the Note/Session toggle and holding it to peek; pressing Play to hear a demo Set; Back behaviour where the manual states it. video: id _c4lz85pOLc, title "Getting started with Move's views". Sources accordingly.`,
  '05-new-set': `05-new-set.mdx — part 1, order 5, "Start a new Set". Goal: create a new Set, give it a colour, and copy or delete Sets safely. Read Manual 6.1 Set Options in the Overview, 6.1.1 Creating New Sets, 6.1.2 Changing a Pad's Color, 6.1.4 Copying Sets, 6.1.5 Deleting Sets, and Manual 20 (Set definition: up to 32 Sets, autosave). Cover: go to Set Overview (Shift + Step 1), create a new Set exactly as the manual text describes, hear that the new Set's four tracks have random sounds, change the Set's pad colour, copy a Set, delete a Set (mention Undo only if the manual says undo works there; otherwise warn that deleting is permanent unless the manual says otherwise). video: id _UQj8c6MaZU, title "Making a new Set". Sources accordingly.`,
  '06-playing-pads': `06-playing-pads.mdx — part 1, order 6, "Playing the pads". Goal: play drums and melodies, softly and loudly. Read Manual 8 Note Mode, Manual 9 Playing and Sequencing Notes (intro), 9.2 16 Pitches Layout, 9.3 Full Velocity, 9.4 Expressive Playing with Polyphonic Aftertouch, Manual 20 (Pads). Music ideas to explain: velocity (how hard you hit), drum kit (one sound per pad; on drum tracks the left 16 pads play the kit) vs melodic instrument (pads are notes). Steps: pick a track that plays drums (by ear, via the track buttons — presets are random, so if none of the four tracks is a drum kit, point forward to Lesson 8 to choose one), play drum pads soft vs hard, turn Full Velocity on and off (Shift + Step 10), pick a melodic track and play a few notes, press and hold a pad and push harder (aftertouch shapes some sounds — Drift and Wavetable based presets per the manual), and optionally 16 Pitches (Shift + Step 8) on a drum track. video: id CdoT5YuVO1Q, title "Playing an instrument". Sources accordingly.`,
  '07-scales-and-octaves': `07-scales-and-octaves.mdx — part 1, order 7, "Scales & octaves". Goal: understand key, scale and octave, and change them on Move. Read Manual 9.1 Pad Layouts, Keys, and Scales (In-Key vs Chromatic; default In-Key, C Major, arranged by octaves; each row an octave with the root note lit in the track colour; 4ths option; Keys & Scales menu = Shift + Step 9; wheel to choose), Manual 20 Plus and Minus buttons (octave up/down). Music ideas: note names, octave, key/root, scale (major bright vs minor darker), why In-Key means "no wrong notes". Use <PadNotes> to show the default C major octave layout (8 pads per row: C D E F G A B C; highlight C). IMPORTANT: the manual text does not say which row is the lowest octave — draw rows so the diagram does not claim it (e.g. caption "each row is one octave") and add a hardware check. Steps: select a melodic track, play a row left to right (a scale), use plus/minus to change octave, open Keys & Scales (Shift + Step 9), change the key or scale with the wheel, try Chromatic vs In-Key. Sources accordingly. No video.`,
  '08-choosing-sounds': `08-choosing-sounds.mdx — part 1, order 8, "Choosing sounds". Goal: browse and swap a track's sound (Track Preset), and save one you like. Read Manual 7 Using Instruments and Effects, 7.1 Track Presets, 7.2 Browsing and Swapping Presets, 7.2.1 Browser Categories, 7.2.2 Autoload, 7.3 Saving Presets, Manual 13.3 Count-In and Autoload (Workflow Settings = Shift + Step 3). Also research doc: in 2.x the top of the browser has an "Audio Track" entry (mention briefly that audio tracks come later in the course; mark with <Note kind="newer" firmware="2.0">). Music ideas: instrument vs effect; a preset is a starting point. Steps must follow the manual text for opening the browser, moving through categories with the wheel, previewing/loading a preset, going Back, and saving. video: id 5Q1EHEjbuhA, title "Browsing for instruments". Sources accordingly.`,
}

const PAIRS = [
  ['01-tour', '02-power-and-setup'],
  ['03-sets-tracks-clips', '04-three-views'],
  ['05-new-set', '06-playing-pads'],
  ['07-scales-and-octaves', '08-choosing-sounds'],
]

const HW = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lesson: { type: 'string' },
      claim: { type: 'string' },
      based_on: { type: 'string' },
      why_unverified: { type: 'string' },
    },
    required: ['lesson', 'claim', 'based_on', 'why_unverified'],
  },
}

const WRITER_SCHEMA = {
  type: 'object',
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    hardware_checks: HW,
    glossary_terms: { type: 'array', items: { type: 'string' }, description: 'slugs from src/data/glossary.ts that these lessons teach, as "slug:lesson-id"' },
    validation: { type: 'string', description: 'the validation commands you ran and their final results' },
    notes: { type: 'string' },
  },
  required: ['files', 'hardware_checks', 'glossary_terms', 'validation', 'notes'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    fixes: { type: 'array', items: { type: 'string' }, description: 'each change you made and why' },
    hardware_checks: HW,
    validation: { type: 'string' },
    remaining_concerns: { type: 'array', items: { type: 'string' } },
  },
  required: ['files', 'fixes', 'hardware_checks', 'validation', 'remaining_concerns'],
}

const results = await pipeline(
  PAIRS,
  (pair) => agent(
    `${COMMON}\n\nYOUR ASSIGNMENT: write these two lessons, in order, as files in ${REPO}/src/content/lessons/:\n\n1. ${LESSONS[pair[0]]}\n\n2. ${LESSONS[pair[1]]}\n\nWhen done, return: the file paths, every claim that needs checking on real hardware (anything not stated in the manual text or the research doc), the glossary slugs each lesson teaches (as "slug:lesson-id"), the validation results, and brief notes.`,
    { label: `write ${pair.join(' + ')}`, phase: 'Write', schema: WRITER_SCHEMA, effort: 'medium' },
  ),
  (written, pair) => agent(
    `${COMMON}\n\nYOUR ROLE: adversarial fact-checker and editor for two lessons another writer just produced: ${pair.map((p) => `${REPO}/src/content/lessons/${p}.mdx`).join(' and ')}.\n\nThe writer reported:\n${JSON.stringify(written, null, 2)}\n\nCheck, with the manual text open (grep .cache/move-manual.txt) and the research doc:\n- EVERY button combination and press/hold order: is it stated in the manual TEXT (or research doc 2.x section)? Wrong or unsupported combos are the worst possible defect for a beginner course — fix or remove them.\n- Every factual claim about behaviour, menus, LEDs, limits. Unsupported → rephrase so it does not depend on it, or keep it and list it as a hardware check.\n- Any assumption about which sounds a new Set/track has (presets are random) → fix.\n- Any <Screen> or quoted display text not stated in the manual text → replace with a plain description.\n- Copied phrasing: run the overlap check and also look for close paraphrase of whole manual sentences → rewrite in fresh words.\n- Step quality: one action per Step, press ids match the text of the step, hold ids are the ones held, see/hear are accurate, tips are useful. Beginner clarity: music terms explained, short sentences.\n- Frontmatter: sources listed, video only where assigned, part/order right.\nEdit the files directly to fix problems (only these two files). Then run both validation commands and make sure they pass for these files. Return every fix you made, the final list of hardware checks (merge the writer's list with yours, drop any that you confirmed in the manual text), the validation results, and any remaining concerns.`,
    { label: `verify ${pair.join(' + ')}`, phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'medium' },
  ),
)

return results