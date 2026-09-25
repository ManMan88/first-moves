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
