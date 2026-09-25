export const meta = {
  name: 'write-lessons-18-26',
  description: 'Write First Moves lessons 18–26 (writer → adversarial fact-checker per group of lessons)',
  phases: [
    { title: 'Write', detail: '4 writers' },
    { title: 'Verify', detail: '4 fact-checkers against the manual text' },
  ],
}

const REPO = '/home/ron/projects/move'

const COMMON = `
You are writing lessons for "First Moves", a free, unofficial, hands-on course that teaches brand-new Ableton Move owners (who are ALSO new to making music) to use their Move. The learner holds a Move that is NOT connected to a computer and follows the lesson on a phone or laptop. The site highlights the controls to press on an SVG drawing of Move for each step.

Repository: ${REPO} (Astro 7 + MDX). Lessons 1–17 already exist in src/content/lessons/ — read 06-playing-pads.mdx and 08-choosing-sounds.mdx as style examples, do not re-teach what earlier lessons cover (link back to them instead, e.g. [Lesson 6](/first-moves/lessons/06-playing-pads/)), and keep terminology consistent with them. Read these first:
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
  '18-session-mode': `18-session-mode.mdx — part 4, order 18, "Session Mode: clips & scenes". Goal: arrange ideas as clips and scenes and launch them. Read Manual 17 Session Mode, 17.1 Working with Clips (pad LED meanings), 17.1.1 Creating New Clips, 17.1.2 Launching Clips and Playing Scenes (slide a finger down a column while playing), 17.1.3 Copying Clips, 17.1.4 Deleting Clips, and research doc §4 (2.0.5: a launch too close to the next quantization point waits for the following one; 2.0: Key & Scale and Full Velocity hidden in Session Mode). Music ideas: song sections (verse, chorus), a scene = one section, launching clips on the next bar keeps things in time. Steps: open Session Mode with Note/Session, read the pads (row = track, lit = clip), make a second clip in an empty slot and fill it in Note Mode as the manual text says, launch clips, play a scene by sliding down a column, copy a clip, stop playback. video: id p96WElRlYmw, title "Session Mode". Sources accordingly.`,
  '19-mixing': `19-mixing.mdx — part 4, order 19, "Mixing: volume, mute, solo". Goal: balance the tracks. Read Manual 16 Mixing: 16.1 Output Volume, 16.2 Track Volume (hold a track button + Volume knob), 16.2.1 Track Volume Activity, 16.3 Soloing Tracks, 16.4 Muting Tracks, 16.5 Muting Drum Rack Pads, 16.6 Sample Gain, 16.7 Set Volume, 16.8 Built-in Limiter; research doc §4 (Solo = Shift + Mute + track button since 1.3 — use the manual text if it describes solo; if the two disagree, follow the newer release notes and add a hardware check). Music ideas: mixing = making every part heard; muting to build arrangements; solo to listen closely. Sources accordingly. No video.`,
  '20-main-effects': `20-main-effects.mdx — part 4, order 20, "Main effects & performing". Goal: use the Set's main effects and perform a simple arrangement live. Read Manual 17.2 Adjusting a Set's Main Effects, 17.1.2 (launching/scenes), 17.1.5 Retriggering Clips (Shift + Play restarts active clips), 20 (Play). Music ideas: build-ups and drops, effects on the whole mix, performing = choosing what plays when. Steps: in Session Mode open/adjust the main effects exactly as the manual text says, perform: launch scenes one after another, mute/unmute a track for a drop, retrigger with Shift + Play, stop. Sources accordingly. No video.`,
  '21-sample-with-mic': `21-sample-with-mic.mdx — part 5, order 21, "Sample with the mic". Goal: record a sound with Move's microphone onto a pad and play it. Read Manual 15 Sampling: 15.1 Sampling Mode, 15.2 Selecting a Sampling Input Source, 15.3 Recording Samples, 15.4 Mic and Line In Sampling, 15.4.1 Adjusting Sampling Input Gain, 15.4.2 Turning Monitoring On or Off, 15.9 Adjusting Sample Parameters (basics only); research doc §4 (2.1: mic recordings are mono). Music ideas: what a sample is, using everyday sounds as drums or notes, gain (not too quiet, not distorting). Steps: press Sampling, choose the mic as source, check the level/gain, choose a pad, record a short sound (clap, knock, voice), leave Sampling Mode, play it; add <Note kind="newer" firmware="2.1"> about mono mic recording. video: id OOd4-qFlum8, title "Sampling with the microphone". Sources accordingly.`,
  '22-line-in-and-slicing': `22-line-in-and-slicing.mdx — part 5, order 22, "Line-in sampling & slicing". Goal: sample from another device via the audio input and slice a longer sample across pads. Read Manual 15.2, 15.4 (line in, gain, monitoring), 15.8 Sample Slicing, 15.9 Adjusting Sample Parameters (15.9.1 Drum Sampler, 15.9.2 Melodic Sampler), 4.1.1 Connecting to External Sound Sources; research doc §4 (1.6: Shift + press the wheel on a sample opens Slice/Reverse; 2.1: "Line in – Mono" option) — anything only from release notes goes on the hardware checks. Music ideas: slicing a drum loop or phrase into pieces and replaying them in a new order. Use view="both" on Steps (the Audio in port is on the back). video: id EJwGnDdFXBI, title "Sampling with the audio input". Sources accordingly.`,
  '23-resampling': `23-resampling.mdx — part 5, order 23, "Resampling". Goal: record Move's own output as a new sample. Read Manual 15.5 Resampling, 15.6 Sampling Audio via USB-C, 15.7 Multi-pad recording. Music ideas: freezing a whole beat or an effected sound into one pad; building new sounds from old ones. Steps follow the manual text: set the source to Move's output (resample), play something, record it to a pad, play the new sample; mention USB-C sampling and multi-pad recording as Good-to-know. Sources accordingly. No video.`,
  '24-audio-tracks': `24-audio-tracks.mdx — part 5, order 24, "Audio tracks". firmware: "2.0". This feature is NOT in the manual. Sources: release notes 2.0.0 and 2.1.0 (https://www.ableton.com/en/release-notes/move-1/ — WebFetch it), the Help Center "Audio Tracks on Move FAQ" (fetch with: curl -s https://help.ableton.com/api/v2/help_center/en-us/articles/26962324108572.json and read the "body" HTML), and research doc §4. Goal: turn a track into an audio track, record audio into it, and bounce a clip to audio (2.1). Music ideas: MIDI/notes vs recorded audio; warping (audio follows the Set's tempo). Start the lesson body with <Note kind="newer" firmware="2.0"> (the layout also shows sources). Every step must be traceable to those sources; put EVERY step's behaviour on the hardware checks list. Keep it to the core workflow (6–8 steps). Sources accordingly. No video.`,
  '25-move-manager': `25-move-manager.mdx — part 6, order 25, "Move Manager". Goal: back up Sets and add your own samples from a computer. Read Manual 3 Move Manager (3.1 Connecting, 3.2 Authenticating, 3.3 Using, 3.4 Sets Page incl. downloading, 3.5 Recordings, 3.6 Samples incl. uploading, 3.7 Presets, 3.8 Settings incl. updating, 3.9 Advanced) and 2.1.9 Accessing Move Manager. Many steps happen on the computer: still give every <Step> a press= for the Move control involved (e.g. shift step-2 to find the hostname entry in Setup, the display to read the code, wheel), and describe the computer part in the step text. Warn that Move and the computer must be on the same Wi-Fi (or USB-C per manual). video: id rch9hLGBGfw, title "Move Manager". Sources accordingly.`,
  '26-cloud-link-midi-live': `26-cloud-link-midi-live.mdx — part 6, order 26, "Cloud, Link, MIDI & Live". Goal: an overview of how Move connects to the wider world, and where to go next. Read Manual 4 Connectivity (4.1.1–4.1.3, 4.2 Link, 4.3 Cloud incl. 4.3.1 uploading a Set via Shift + a Set's pad), 18 Control Live Mode (overview: Setup → Control Live), 19 USB Operation Modes; research doc §4–5 (1.5 per-track MIDI channels via Shift + track button, 1.7 MIDI over USB-C). Keep it short and friendly: 6–8 steps that each open one of these (e.g. Link entry in Setup, upload a Set to Cloud, connect a USB MIDI keyboard to USB-A and play it), end with a "Where to go next" section linking the official manual (https://www.ableton.com/en/move/manual/), Ableton's Learning Music (https://learningmusic.ableton.com/) and Learning Synths (https://learningsynths.ableton.com/). Use view="both" (USB ports on the back). Sources accordingly. No video.`,
}

const PAIRS = [
  ['18-session-mode', '19-mixing', '20-main-effects'],
  ['21-sample-with-mic', '22-line-in-and-slicing', '23-resampling'],
  ['24-audio-tracks'],
  ['25-move-manager', '26-cloud-link-midi-live'],
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