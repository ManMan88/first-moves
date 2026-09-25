export const meta = {
  name: 'write-lessons-9-17',
  description: 'Write First Moves lessons 9–17 (writer → adversarial fact-checker per group of lessons)',
  phases: [
    { title: 'Write', detail: '4 writers' },
    { title: 'Verify', detail: '4 fact-checkers against the manual text' },
  ],
}

const REPO = '/home/ron/projects/move'

const COMMON = `
You are writing lessons for "First Moves", a free, unofficial, hands-on course that teaches brand-new Ableton Move owners (who are ALSO new to making music) to use their Move. The learner holds a Move that is NOT connected to a computer and follows the lesson on a phone or laptop. The site highlights the controls to press on an SVG drawing of Move for each step.

Repository: ${REPO} (Astro 7 + MDX). Lessons 1–8 already exist in src/content/lessons/ — read 06-playing-pads.mdx and 08-choosing-sounds.mdx as style examples, do not re-teach what earlier lessons cover (link back to them instead, e.g. [Lesson 6](/first-moves/lessons/06-playing-pads/)), and keep terminology consistent with them. Read these first:
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
3. PRESET FAMILIES. Manual 6.1.1: a brand-new Set gets a Drums preset on the TOP track, a Bass preset on the second track, a Pad/Synth Keys/Plucked/Rhythmic preset on the third, and a Synth Lead/Winds preset on the bottom track; only the exact preset is random. You may rely on this for a brand-new Set (e.g. "press the top track button: in a new Set it holds a drum kit"), with a tip that demo Sets or swapped sounds can differ. Never assume a specific preset or which drum sound sits on which pad — have the learner find the kick/snare/hi-hat by ear.
4. NO INVENTED SCREEN TEXT. Only use <Screen> (or quote display text) for words the manual text states in words (e.g. a menu entry named in the text). Otherwise describe the screen in plain words ("the display shows the Setup menu").
4b. ONE STEPS BLOCK. Exactly one <Steps> block per lesson (progress is saved per lesson), and every <Step> must have a press= attribute. Aim for 6–10 steps.
5. BEGINNERS. Second person, short sentences, friendly, no jargon without explanation. Explain the music idea behind what they press. Name controls in **bold** exactly as in controls.ts names (Shift, Step 2, Play, the wheel, Back, Note/Session, a track button, knobs, Volume knob...). Each Step is ONE action (one combo). 5–9 steps per lesson is typical. Include a <Tip> where beginners commonly get stuck.
6. The lesson layout already renders the title, summary, needs, the video (from frontmatter), the sources list and prev/next links — do NOT repeat those in the body.
7. Do not create or modify any file except your own lesson files — no notes, handoff or progress files (put everything in your return value; the orchestrator records progress). Do NOT run "astro build", "npm run build" or "npm run dev" (other agents are working in parallel and builds would clash).

VALIDATE your files (these are safe to run in parallel):
- npx vitest run tests/unit/lesson-controls.test.ts   (control ids, sources, file name)
- MANUAL_TXT=.cache/move-manual.txt npx vitest run tests/content/overlap.test.ts   (copying check — must pass for your files; failures for OTHER lesson files are not yours)
Fix anything that fails in your files and re-run until clean.
`

const LESSONS = {
  '09-first-beat': `09-first-beat.mdx — part 2, order 9, "Beats, bars & steps". Goal: build a first drum beat with the step buttons. Music ideas: beat (the pulse), bar (4 beats), step (by default a 16th note: 4 steps per beat, 16 steps = 1 bar); steps 1, 5, 9 and 13 start the beats (they have a line under their light). Use <StepGrid on={[1, 5, 9, 13]} /> for a four-on-the-floor kick and a second StepGrid for the snare on beats 2 and 4 (steps 5 and 13). Read Manual 9.5 Sequencing Notes, 13.2 Step Grid, 20 (Step Buttons) and 6.1.1. Steps: in a new Set press the top track button (drums); tap drum pads to find a deep kick; with that pad selected press steps 1, 5, 9, 13; press Play; pick a snare/clap pad by ear and press steps 5 and 13; pick a hi-hat and place it on the off-beats (e.g. 3, 7, 11, 15); remove a hit the way the manual text says; stop with Play. video: id aGjZ2HGK0mw, title "Making a beat and recording". Sources accordingly.`,
  '10-tempo-metronome-groove': `10-tempo-metronome-groove.mdx — part 2, order 10, "Tempo, metronome & groove". Goal: change how fast the music goes and how it feels. Music ideas: tempo/BPM (with everyday examples), metronome click, groove/swing (every other 16th note a little late). Read Manual 10 Tempo, Groove, and Metronome Settings: 10.1 Tempo (Shift + Step 5), 10.2 Groove (Shift + Step 7), 10.3 Metronome (Shift + Step 6). Steps: play the beat from Lesson 9, open Tempo and change it with the wheel exactly as the manual text says, back out, open Groove and add swing, compare, turn the metronome on and off. Only claim display details the manual text states. Sources accordingly. No video.`,
  '11-record-live': `11-record-live.mdx — part 2, order 11, "Record live". Goal: record what you play in real time, with a count-in, and tidy the timing. Read Manual 14.1 Recording Notes, 14.1.1 Recording with Count-In and Metronome, 13 Workflow Settings (13.1 Quantize, 13.3 Count-In; Shift + Step 3), 11.7 Quantizing Notes (Shift + Step 16), 20 (Record). Music ideas: recording vs step sequencing, count-in, overdub (adding on top of what's there), quantize (snap to the grid). Steps: pick a melodic track (second track = bass in a new Set), prepare an empty clip if needed as the manual text says, press Record, play along after the count-in, stop recording, listen, overdub more notes, quantize. Add <Note kind="newer" firmware="2.0"> that pressing Record again stops recording (research doc §4, 2.0 beta notes) and that Workflow Settings has a Max Length setting (2.1) — only as described in research §4. Sources accordingly. No video.`,
  '12-capture': `12-capture.mdx — part 2, order 12, "Capture: never lose an idea". Goal: use Capture to keep something you played without having pressed Record. Read Manual 14.3 Capturing Notes and Automation and 20 (Capture: tempo detection when the transport isn't running; captured notes go into empty or existing clips). Also check whether the manual text mentions clearing Capture with Shift (the hardware diagram labels "Clear Capture"; only state it if the text supports it, otherwise make it a hardware check). Steps: with Move stopped, play a short phrase freely on the pads, press Capture, hear it loop and notice the tempo followed your playing; then with music running, jam over it and Capture again to add. Sources accordingly. No video.`,
  '13-edit-steps': `13-edit-steps.mdx — part 2, order 13, "Edit steps: velocity, length, nudge". Goal: fine-tune the notes on individual steps. Read Manual 11 Editing Notes and Steps: 11.1 Velocity, 11.2 Note Transposition, 11.3 Note Length, 11.4 Note Nudge, 11.9 Adding or Removing Multiple Notes from Steps, and 20 (Volume knob with a step held = note velocity; arrows with a step held = nudge; plus/minus with a step held = transpose). Music ideas: accents (louder hits), note length (short vs long notes), nudging off the grid for feel. Steps: hold a step and change velocity exactly as the manual text says, make a note longer, nudge a hi-hat slightly, transpose a melodic step with plus/minus. Use the hold= attribute for held steps. Sources accordingly. No video.`,
  '14-loops': `14-loops.mdx — part 2, order 14, "Loop length & Loop Mode". Goal: make clips longer than one bar and work with whole bars. Read Manual 12 Editing Clips: 12.1 Loop Length, 12.2 Doubling the Loop (Shift + Step 15), 12.3 Duplicating Clips, 12.4 Deleting Clips and Notes, and 11.5 Adjusting Notes in Loop Mode, 20 (Loop button; arrows navigate bars). Music ideas: loop, why 2- or 4-bar patterns feel less repetitive, variation in the last bar. Steps: press Loop and see bars on the step buttons, lengthen the loop to 2 bars as the manual text says, double the loop, move between bars with the arrows, change a hit in bar 2 for variation, leave Loop Mode, (warn before deleting; mention Undo only where the manual supports it). Add <Note kind="newer" firmware="2.1"> about time signatures and extra step pages per research doc §4. Sources accordingly. No video.`,
  '15-bassline-and-chords': `15-bassline-and-chords.mdx — part 3, order 15, "Bassline & chords". Goal: step-sequence a bassline and chords on melodic tracks. Read Manual 9.5 Sequencing Notes (melodic: hold one or more pads, then press a step), 11.8 Copying Notes and Step Ranges, 11.9 Adding or Removing Multiple Notes from Steps, 6.1.1 (second track = Bass, third = Pad/Keys/Plucked/Rhythmic in a new Set). Music ideas: bassline (low notes that lock with the kick), root note, chord (3 notes together), using In-Key so every chord fits. Steps: select the second track, sequence a simple bassline on the kick steps using root notes, select the third track, hold three pads and press steps to place chords, copy a range of steps as the manual text says, listen with the drums. Sources accordingly. No video.`,
  '16-arp-and-repeat': `16-arp-and-repeat.mdx — part 3, order 16, "Arpeggiator & note repeat". Goal: turn held chords into patterns and play fast drum rolls. Read Manual 11.6 Arpeggiator and Repeat (Shift + Step 11) and research doc/release notes 1.1.2 (Arp modes Up, Down, Random). Music ideas: arpeggio (a chord played one note at a time), rate (how fast), note repeat for hi-hat rolls. Steps follow the manual text: open the Repeat/Arp menu, turn arp on for a melodic track, hold a chord, change mode/rate, turn it off; on a drum track use repeat to play rolls. Sources accordingly. No video.`,
  '17-shape-the-sound': `17-shape-the-sound.mdx — part 3, order 17, "Shape the sound: knobs & automation". Goal: change sounds with the knobs and record those changes. Read Manual 7 Using Instruments and Effects (the 8 encoders control the selected device's parameters; touching shows the name), 14.2 Recording Automation, 14.2.1 Deactivating Automation, 14.2.2 Checking Automation Status, 14.2.3 Deleting Automation (hold Delete + touch the encoder), 14.2.4 Per-Step Automation (hold a step and turn an encoder), 20 (Encoders; Shift = fine adjust). Music ideas: filter/cutoff (bright vs dull), automation = the knob moving by itself as the loop plays, using it to build tension. Steps: touch a knob to read its name, turn it while playing, Shift for fine adjust, record a knob movement with Record while the loop plays, listen, delete that automation, add per-step automation on one step. Sources accordingly. No video.`,
}

const PAIRS = [
  ['09-first-beat', '10-tempo-metronome-groove'],
  ['11-record-live', '12-capture'],
  ['13-edit-steps', '14-loops'],
  ['15-bassline-and-chords', '16-arp-and-repeat', '17-shape-the-sound'],
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
    `${COMMON}\n\nYOUR ASSIGNMENT: write these lessons, in order, as files in ${REPO}/src/content/lessons/:\n\n${pair.map((id, i) => `${i + 1}. ${LESSONS[id]}`).join('\n\n')}\n\nWhen done, return: the file paths, every claim that needs checking on real hardware (anything not stated in the manual text or the research doc), the glossary slugs each lesson teaches (as "slug:lesson-id"), the validation results, and brief notes.`,
    { label: `write ${pair.join(' + ')}`, phase: 'Write', schema: WRITER_SCHEMA, effort: 'medium' },
  ),
  (written, pair) => agent(
    `${COMMON}\n\nYOUR ROLE: adversarial fact-checker and editor for the lessons another writer just produced: ${pair.map((p) => `${REPO}/src/content/lessons/${p}.mdx`).join(' and ')}.\n\nThe writer reported:\n${JSON.stringify(written, null, 2)}\n\nCheck, with the manual text open (grep .cache/move-manual.txt) and the research doc:\n- EVERY button combination and press/hold order: is it stated in the manual TEXT (or research doc 2.x section)? Wrong or unsupported combos are the worst possible defect for a beginner course — fix or remove them.\n- Every factual claim about behaviour, menus, LEDs, limits. Unsupported → rephrase so it does not depend on it, or keep it and list it as a hardware check.\n- Any assumption about which sounds a track has beyond the Manual 6.1.1 preset families (and only for brand-new Sets), or about which drum sound is on which pad → fix.\n- Any <Screen> or quoted display text not stated in the manual text → replace with a plain description.\n- Copied phrasing: run the overlap check and also look for close paraphrase of whole manual sentences → rewrite in fresh words.\n- Step quality: one action per Step, press ids match the text of the step, hold ids are the ones held, see/hear are accurate, tips are useful. Beginner clarity: music terms explained, short sentences.\n- Frontmatter: sources listed, video only where assigned, part/order right.\nEdit the files directly to fix problems (only these files). Then run both validation commands and make sure they pass for these files. Return every fix you made, the final list of hardware checks (merge the writer's list with yours, drop any that you confirmed in the manual text), the validation results, and any remaining concerns.`,
    { label: `verify ${pair.join(' + ')}`, phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'medium' },
  ),
)

return results