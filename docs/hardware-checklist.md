# Hardware checklist: things to confirm on a real Move

The lessons are written from Ableton's manual (Move 1.x, July 2025) and release notes. The device runs **Move 2.1**. The items below are claims the manual text does not state outright, or that newer software may have changed. The fact-checkers either kept a careful wording or flagged them here.

**How to use this list:**
- Check each item on your Move (software 2.1.x).
- Tick the box if the lesson is right.
- If the Move behaves differently, note what you saw under the item. The lesson then gets fixed; the file named in brackets is the one to change.

Legend: 🔴 matters for a step working at all · 🟡 affects wording or tips · ⚪ cosmetic or drawing detail.

## Drawing and controls (`src/data/layout.ts`, `src/data/controls.ts`)

- [ ] 🟡 **Track 1 is the top track button, and the buttons line up with the four pad rows.**
  - The manual says Drums go on the "top track" of a new Set (6.1.1), and in Session Mode each row of pads is one track (17), so this is very likely.
- [ ] ⚪ **The drawing's layout matches the device.** Check where these sit:
  - the display and encoders along the top, with the Volume knob top right;
  - the wheel, with Back and Note/Session below it;
  - Play and Record bottom left, with the 16 step buttons in one row;
  - the right-hand column: Capture/Sampling, Loop/Mute, Delete/Copy, Undo/Shift;
  - the arrows and plus/minus bottom right.
- [ ] ⚪ **The back-edge drawing shows the ports in the right order:** power (yellow), audio out, audio in, and later USB-A and USB-C.
  - The drawing spaces the three small ports further apart than the real device so their labels fit.
- [ ] 🟡 **Solo = hold Shift + Mute, then press a track button.** This comes from release notes 1.3, not the manual.
- [ ] 🟡 **Shift + a track button opens that track's settings** (colour, MIDI). This comes from release notes 1.4/1.5.
- [ ] 🟡 **Holding Shift makes the icons under the step buttons visible**, clearly enough to read. The manual says they "appear" and that the Setup icon flashes under Step 2.
- [ ] ⚪ **Does double-pressing Shift lock it on?** The hardware diagram in the manual says so, but the text doesn't. The site no longer mentions it; if it's true, add it to the Shift entry in `src/data/controls.ts`.

## Lesson 1: Tour of the hardware (`01-tour.mdx`)

- [ ] 🟡 Touching a knob without turning it shows its setting on the display and does not change the value.

## Lesson 2: Power, charging, Wi-Fi & updates (`02-power-and-setup.mdx`)

- [ ] 🔴 On first boot, choosing **Skip** with the wheel (once, or once per step) ends at the Set Overview.
- [ ] 🔴 **Brightness:** press the wheel to open the entry, then turn the wheel to pick a level.
- [ ] 🟡 The brightness levels on 2.1 include **Dim** and **Min** (added in 1.7), alongside High and Max.
- [ ] 🟡 Pressing **Back** inside Brightness returns to the Setup list rather than closing Setup. (The lesson has a tip for either result.)
- [ ] 🟡 Pressing the wheel on **Battery** shows a status such as "Charging", and **Back** returns to the list.
- [ ] 🟡 **Wi-Fi:** the submenu shows an entry that switches Wi-Fi off and on, and the list of networks appears once it's on.
- [ ] 🟡 **Wi-Fi password entry works as described:**
  - a three-dot icon left of the space bar switches to capitals, then numbers and symbols;
  - there are backspace and check-mark icons;
  - holding Shift gives capitals.
- [ ] 🟡 The **Check Update** entry only appears when update notifications are off.
- [ ] 🟡 Move may restart after installing an update, which makes the lesson's "leave Setup" step unnecessary.
- [ ] 🟡 After pressing **Power** while Move is on, it waits for a wheel press before switching off (Back cancels). Is there a prompt on the display?

## Lesson 3: Sets, tracks & clips (`03-sets-tracks-clips.mdx`)

- [ ] 🔴 In the Set Overview, pressing a lit pad selects that Set, and the **top track button** then opens it in Note Mode with the top track selected. The later steps say "next track button down".
- [ ] 🟡 On a drum track, find out what the **right 16 pads** do by default, so a later lesson can mention it. (The lesson avoids them.)
- [ ] 🟡 On 2.x, a track can also be an **audio track** (no instrument), so "a track's sound is usually a Track Preset" still holds in new Sets.

## Lesson 4: The three views (`04-three-views.mdx`)

- [ ] 🟡 From Session Mode, go to the Set Overview (Shift + Step 1), then press **Back**. You should return to Session Mode. (The lesson's tip also covers landing in Note Mode.)
- [ ] ⚪ Does playback keep going when you switch between Note Mode and Session Mode? The "Try it" section asks the learner to find out.

## Lesson 5: Start a new Set (`05-new-set.mdx`)

- [ ] 🔴 **Shift + a Set's pad** shows the Set options, with **Color** visible or reachable with the wheel; pressing the wheel selects it.
- [ ] 🔴 **Copy a Set:**
  - hold **Copy**, press the Set's pad, then press an empty pad to paste;
  - check whether you can let go of Copy before pasting;
  - check that there's no confirmation when pasting onto an empty pad.
- [ ] 🟡 Back in the Set Overview, the new Set's pad shows its colour and pulses while selected.
- [ ] 🟡 After deleting a Set, its pad goes dark (or white if still selected).
- [ ] ⚪ The drawing uses `pad-3-1` and `pad-3-2` as example empty slots. The text says "any dark pad", but check they're empty on a Move that still has its demo Sets.

## Lesson 6: Playing the pads (`06-playing-pads.mdx`)

- [ ] 🟡 **Shift + Step 10** toggles Full Velocity in Note Mode. In 2.x the option is hidden in Session Mode (2.0 beta notes).
- [ ] 🟡 On a Drift- or Wavetable-based preset, pressing harder on a held pad audibly changes the note.
- [ ] 🟡 In Session Mode, tapping a pad launches or stops a clip. The lesson uses this as the sign that you're not in Note Mode.

## Lesson 7: Scales & octaves (`07-scales-and-octaves.mdx`)

- [ ] 🔴 In the default layout (In-Key, C major, Octaves), notes go **up from left to right** along each row (C D E F G A B C).
- [ ] 🟡 **Which pad row is the lowest octave?** The lesson only says "any row works".
- [ ] 🔴 **Keys & Scales (Shift + Step 9):**
  - check whether pressing the wheel on the mode entry switches In-Key/Chromatic directly or opens a list (the lesson allows both);
  - check that the key entry opens with a wheel press.
- [ ] 🟡 The scale list includes a **minor** scale. (The "Try it" section assumes it.)
- [ ] 🟡 **Chromatic mode:** pads for notes outside the scale are dark. Back in In-Key, only scale notes show.
- [ ] 🟡 Each Minus/Plus press shifts one octave, and pressing Minus once then Plus twice from the default hits no limit.

## Lesson 8: Choosing sounds (`08-choosing-sounds.mdx`)

- [ ] 🔴 In the track's device view, turning the wheel reaches a position where **all icons are highlighted** (the whole preset is selected).
- [ ] 🔴 **Save a preset:**
  - in the browser, holding **Shift** shows **Options**;
  - pressing the wheel (still holding Shift, or after letting go) opens it;
  - **Save Preset** saves the whole preset.
- [ ] 🟡 With Autoload on, pressing the wheel on a preset closes the browser and keeps that preset.
- [ ] 🟡 After tweaking knobs, re-opening the browser keeps the tweaked sound until you turn the wheel. **Undo** brings it back if you do turn it.
- [ ] 🟡 In 2.x, the **Audio Track** entry is at the very top of the main category list (release notes 2.0).

## Lesson 9: Beats, bars & steps (`09-first-beat.mdx`)

- [ ] 🔴 Tapping a drum pad (while not recording) selects it: after that, step presses add or remove that pad's notes, and the step lights show only that pad's notes.
- [ ] 🟡 Holding a step that has a note doesn't remove it; only a brief press does (Manual 9.5).

## Lesson 10: Tempo, metronome & groove (`10-tempo-metronome-groove.mdx`)

- [ ] 🟡 Pressing the wheel on the Tempo setting keeps the new tempo. Also note which direction of the wheel speeds it up.
- [ ] 🟡 The groove icon under Step 7 and the metronome icon under Step 6 are visible without holding Shift.
- [ ] 🟡 A second Shift + Step 6 turns the metronome off, even while the Metronome setting is still on the display.
- [ ] 🔴 Swing delays only the even-numbered steps (2, 4 … 16), so hi-hats on Steps 4/8/12/16 audibly swing. The lesson's StepGrid and a tip rely on this.
- [ ] 🟡 Groove changes only playback timing; notes stay on the same step buttons.

## Lesson 11: Record live (`11-record-live.mdx`)

- [ ] 🔴 In Session Mode, the second row of pads is the second track (bass in a new Set), and the track button next to that row opens it.
- [ ] 🟡 When you overdub with Record while the loop plays, Record turns red and there may be a bar of count-in first.
- [ ] 🟡 Undo takes back a whole recording pass, an overdub, or a quantize.
- [ ] 🟡 **Max Length** is in Workflow Settings (Shift + Step 3) from 2.0, with a 16-bar default (release notes 2.0.0).
- [ ] 🟡 Since 2.0, pressing Record again stops recording on audio tracks as well as instrument tracks.
- [ ] 🟡 Pressing the wheel on the Count-In entry again switches the count-in back on.

## Lesson 12: Capture (`12-capture.mdx`)

- [ ] 🔴 In Session Mode the top row is the drum track in a new Set, and the track button next to it opens it.
- [ ] 🟡 Straight after a capture with Move stopped, turning the wheel moves through the other tempo estimates.
- [ ] 🟡 A second Capture while the captured clip plays adds the new notes to that clip.
- [ ] 🟡 After Shift + Capture, the Capture button light goes dark.

## Lesson 13: Edit steps (`13-edit-steps.mdx`)

- [ ] 🔴 Holding a step and turning the **Volume knob** changes that note's velocity. Also note which direction makes it louder.
- [ ] 🟡 On a drum track, a velocity edit or nudge on a held step changes only the selected pad's note.
- [ ] 🔴 **Shift + Step 14** (standalone mode) prepares a new empty clip on the selected track while music plays, and new notes play in time. The manual text only mentions this combo for Control Live Mode; standalone use comes from release notes 1.4. Lessons 13 and 15 rely on it.
- [ ] 🟡 Holding a step and briefly pressing a later step stretches the note up to that step. Holding several steps together selects them all instead.
- [ ] 🟡 A semitone transpose with Plus can land on a note outside the Set's scale.
- [ ] 🟡 To get back to the Lesson 9 clip: press Note/Session, press its pad in the drum row, then that row's track button.

## Lesson 14: Loop length & Loop Mode (`14-loops.mdx`)

- [ ] 🟡 In Loop Mode, holding Step 1 and pressing Step 2 adds an empty bar, which plays as silence.
- [ ] 🟡 Pressing **Loop** again leaves Loop Mode. The fallback is to hold Back.
- [ ] 🟡 After Shift + Step 15 on a step-sequenced clip, the Right arrow shows bar 2 with a copy of bar 1's notes.
- [ ] 🟡 A quick double press of Step 1 in Loop Mode sets the loop back to one bar, even during playback.
- [ ] 🟡 Undo brings back a clip deleted with Delete.
- [ ] 🟡 **2.1 time signatures:** bars longer than 16 steps continue on extra pages, reached with the Left and Right arrows.

## Lesson 15: Bassline & chords (`15-bassline-and-chords.mdx`)

- [ ] 🔴 In the default In-Key Octaves layout the leftmost pad of each row is the root, pads 1-3-5 of a row make the home chord, and pads 4-6-8 make a second chord in the key. The drawing uses the bottom row.
- [ ] 🔴 Holding a melodic pad (or three pads) and pressing a step places that note or chord on the step.
- [ ] 🟡 The copied steps stay on the clipboard after switching tracks, and pasting onto Step 1 of the other track creates the notes there.

## Lesson 16: Arpeggiator & note repeat (`16-arp-and-repeat.mdx`)

- [ ] 🟡 After Shift + Step 11 closes the Repeat menu, pads play single notes again (the style doesn't stay active).
- [ ] 🔴 On a drum track, holding a pad while the Repeat menu is open plays a continuous roll at the chosen rate.
- [ ] 🟡 On a melodic track, you reach the **Rate** entry with the wheel and change it (possibly pressing the wheel first).
- [ ] 🟡 After choosing Arp Up and pressing the wheel, the display shows Arp Up as the style.

## Lesson 17: Shape the sound (`17-shape-the-sound.mdx`)

- [ ] 🟡 Turning the wheel from the whole-preset selection highlights single devices (instrument or an effect), and many melodic presets have a knob whose name mentions the filter.
- [ ] 🟡 After holding **Delete** and touching an automated knob, the sound stops changing by itself.
- [ ] ⚪ On sampler sounds, holding Shift while turning some knobs gives finer changes, and Shift + tap on some knobs switches to a second setting.

## Lesson 18: Session Mode (`18-session-mode.mdx`)

- [ ] 🔴 In Session Mode, each pad row lines up with the track button beside it (drum row next to the drum track's button).
- [ ] 🟡 A new clip goes into the first empty slot, and "first" means leftmost. (The lesson hedges: "the drawing shows one example".)
- [ ] 🟡 Sliding a finger down a column where some pads are lit and some are dark launches the lit clips.
- [ ] 🟡 2.0.5: a launch pressed too close to the start of a bar waits for the following bar.
- [ ] 🟡 Key & Scale and Full Velocity are hidden in Session Mode (2.0.0 beta notes only).

## Lesson 19: Mixing (`19-mixing.mdx`)

- [ ] 🟡 Muting a drum pad still works while the drum track is soloed.
- [ ] ⚪ Holding Mute may light the lights under the knobs (the automation check). The tip says this conditionally.

## Lesson 20: Main effects & performing (`20-main-effects.mdx`)

- [ ] 🟡 In Session Mode, turning the wheel shows on the display which main effect is selected.
- [ ] 🟡 A new Set's main effects are still Dynamics and Saturator on 2.x. Also check how to swap them from the browser.
- [ ] 🟡 Holding Shift and tapping Play several times retriggers on every tap (a stutter).
- [ ] 🟡 Muting or unmuting a track takes effect at once, not on the next bar.

## Lessons 21–23: Sampling (`21-sample-with-mic.mdx`, `22-line-in-and-slicing.mdx`, `23-resampling.mdx`)

- [ ] 🔴 **Most important sampling check.** On a drum track, turn the wheel to the pad's sample icon, then press **Shift + the wheel**. Does this open **Sample Options** (Slice, Reverse), as in release notes 1.5 and later? Or the parameter banks, as the older manual §7.1 says? Lesson 22 follows the release notes.
- [ ] 🔴 In Sampling Mode, the source icon is highlighted (or easy to highlight), and pressing the wheel cycles Mic/Line in → Resampling → USB-C.
- [ ] 🟡 After adjusting Gain, pressing a pad still starts recording (no need to close Gain first).
- [ ] 🟡 With only headphones in Audio out, a headphones icon appears in the Sampling menu (Monitoring defaults to off), and turning monitoring on lets you hear the mic.
- [ ] 🟡 2.1: mic recordings are mono, and "Line in – Mono" records the left channel.
- [ ] 🟡 After recording, with the whole preset selected, touching Knob 2 shows Sample Start and Knob 1 shows Transpose for the new pad.
- [ ] 🟡 With a device plugged into Audio in, monitoring lets you hear it through Move in Sampling Mode. After a hold-to-record, the recorded pad stays selected.
- [ ] 🟡 **Resampling:**
  - after stopping a resample by tapping the pad, playback may keep running;
  - Transpose (Knob 1) lowers the pitch when turned left;
  - the metronome click is not recorded.
- [ ] 🟡 On a drum track, pressing a different pad during recording continues onto that pad (multi-pad recording) instead of stopping.
- [ ] 🟡 2.1 bounce: copy a clip in Session Mode and paste it onto a drum pad.

## Lesson 24: Audio tracks (`24-audio-tracks.mdx`), all from release notes and the Help Center FAQ

- [ ] 🔴 Making the bottom track an audio track: press **Back** (maybe more than once) to reach the main list of categories. **Audio Track** is at or near the top, and pressing the wheel on it converts the track (Undo restores it). Do the track's note clips survive?
- [ ] 🔴 **Sampling on an audio track:**
  - pressing Sampling arms the track;
  - the wheel shows the input and cycles through Mic, Resampling and USB-C.
- [ ] 🔴 **Recording on an audio track:**
  - Record starts the transport and records (possibly after a one-bar count-in);
  - it stops by itself at 16 bars or the lower Max Length;
  - pressing Record again stops recording and the take loops in time;
  - Undo discards the take.
- [ ] 🟡 In Session Mode the bottom pad row is the bottom track's clip slots.
- [ ] 🔴 **Bounce (2.1):**
  - pasting a copied note clip onto an empty audio clip slot bounces it;
  - the pad flashes, a progress bar shows, and the wheel cancels;
  - the result sounds the same as the original.
- [ ] 🟡 After a tempo change, recorded audio follows the new tempo and keeps its pitch (warping).
- [ ] ⚪ **Loading a loop:**
  - select an audio clip slot, highlight the sample icon, press the wheel and browse;
  - Move detects the loop's tempo;
  - the first knob transposes the clip.

## Lesson 25: Move Manager (`25-move-manager.mdx`)

- [ ] 🟡 After you enter the code in the computer's browser, Move is still in the Setup menu, so holding Back closes it.
- [ ] 🟡 Typing the bare hostname in Chrome may run a web search, and adding `http://` in front fixes it. Next time, a new code may not be needed.
- [ ] 🔴 **Loading an uploaded sample:**
  - on a drum kit, tapping a pad selects it, so the sample icon and the browser act on that pad;
  - from a sample category, pressing Back once reaches a list containing **User Samples**;
  - samples load as you scroll, and pressing the wheel keeps one.
- [ ] 🟡 Sets can be uploaded to Move with the Upload button or by drag and drop on the Sets page.
- [ ] 🟡 Sample space per Set is 800 MB on 2.x (release notes 1.8), not the manual's 400 MB.

## Lesson 26: Cloud, Link, MIDI & Live (`26-cloud-link-midi-live.mdx`)

- [ ] 🔴 **Shift + a track button** opens a track menu with MIDI In and MIDI Out entries; MIDI In has an Auto option; Back leaves the menu.
- [ ] 🟡 By default, a USB keyboard plugged into USB-A plays the selected track with no setup, and its notes can be recorded like pad playing.
- [ ] 🟡 In the Link entry, turning the wheel to Tempo selects it.
- [ ] 🟡 MIDI over USB-C works in Standalone Mode with a computer, iPad/iPhone or Push 3 as the host.
- [ ] ⚪ Link Audio streams Move's main output or individual tracks to audio tracks in Live (USB-C recommended).

## Across lessons

- [ ] 🔴 Pressing a track button selects that track, including from the Set Overview. Lessons 3, 9, 21 and 25 rely on this.
- [ ] 🟡 A scene slide is one quick finger slide down a column. The drawing lights the whole column as a single action.
