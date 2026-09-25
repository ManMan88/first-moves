# Research: prior art, sources, and Move device facts

Date: 2026-09-25 · Move firmware at time of writing: **2.1.1** (released 2026-09-15; 2.1.5b1 in beta since 2026-09-21)

Background research for a free, public GitHub Pages course that teaches brand-new Ableton Move
owners (also new to music-making) how to use their Move, step by step.

**Decision taken after this research:** the first version is a **guided course only**. The learner holds a
Move that is *not* connected to the computer, and the site tells them what to press and what should happen.
Browser-to-device connectivity (Web MIDI) is **parked**. Section 5 keeps the facts in case it's revisited.

Confidence tags used below:
- **[Official]**: an Ableton source (manual, release notes, Help Center).
- **[Press]**: music-tech press.
- **[User]**: forum posts or code in public repos.
- **[Unknown]**: not verified.

---

## 1. Verdict: does this already exist?

**No close equivalent exists.** Nobody offers a web-based, progressive, beginner course for the physical Move
that is current for firmware 2.x. The closest things are:

- **Ableton's own videos:** passive, and organised by topic rather than as a course.
- **Melodics:** finger-drumming practice, not how to operate Move.
- **Scattered community videos.**

The remaining gap:

- a hands-on, progressive course for the physical device;
- written for beginners;
- current for firmware 2.x (the official manual is still 1.x; see section 4).

**Risk to watch:** Ableton's own [learn.ableton.com](https://learn.ableton.com/) growing Move lessons. As of today it only has a "Beats" course
and doesn't mention Move.

## 2. Prior art

| Item | What it is | Connects to device? | Needs device hack? | How close to our idea |
|---|---|---|---|---|
| Ableton "Learn Move" page and YouTube playlist ([page](https://www.ableton.com/move/learn-move/), [playlist](https://www.youtube.com/playlist?list=PLoh4MB-kbBmJQrKNg_-xntQJC8ymTctL3)) | 12 videos: 10 from launch day (2024-10-08) and two update videos (2026-02-24; 2026-08-25, covering 2.0/2.1) | No | No | Right topics for beginners, but passive video and not a progressive course |
| Melodics for Move ([partner page](https://melodics.com/partners/ableton/move), [Help Center](https://help.ableton.com/hc/en-us/articles/15810376977052-Melodics-Lessons-for-Move)) | 50 free finger-drumming lessons with real-time feedback, in a desktop/iPad app | Yes, via Control Live Mode | No | Closest "connected trainer", but it teaches drumming, not how to use Move. Native app, not web |
| Community YouTube: [Taylor Fiore](https://www.youtube.com/playlist?list=PL5q9zIEdqxw0dZl1LPMklxgp3jajMJjrC) (11 videos, 2025-03 to 2026-08, follows each update); [Joseph "Pailo" Haley](https://www.youtube.com/playlist?list=PLHfwuR2hl9zI1rbatVVbK3eSTAziXkAWE) (15 videos, Oct 2024) | Update walkthroughs, streams | No | No | Low |
| Written guides: [CDM guide](https://cdm.link/ableton-move-guide/) (Oct 2024, now outdated); Splice / Isotonik / Sweetwater articles | Single articles | No | No | Low |
| Udemy / Skillshare / Coursera | No Move-specific courses found, only Live courses ([Udemy](https://www.udemy.com/topic/ableton-live/)) | n/a | n/a | None |
| [Ableton Learn](https://learn.ableton.com/), [Learning Music](https://learningmusic.ableton.com/), [Learning Synths](https://learningsynths.ableton.com/) | Browser lessons on general music-making | Learning Synths takes MIDI input via Web MIDI; the other two don't | No | Right format, but nothing about Move. Content is Ableton's property and not reusable |
| [Frequenze Push & Move Visualizer](https://federico-pepe.github.io/ableton-push-learn/) ([repo](https://github.com/federico-pepe/ableton-push-learn), GPL-3.0) | Web MIDI app showing the chromatic pad layout | Yes: Control Live Mode plus a virtual MIDI bus | No | Closest web tool, but covers a single topic |
| [bobbydigitales/vlpp_move](https://github.com/bobbydigitales/vlpp_move) | GitHub Pages bridge between an M8 and Move | Yes: Chrome, including Android, sees "ableton move live port" | No | Not a lesson tool; proves Web MIDI can talk to Move |
| [awwbees/MoveControlHost](https://github.com/awwbees/MoveControlHost) | Desktop app that makes Move a generic controller | Control Live Mode (LEDs go dark about 1 s after MIDI traffic stops) | No | Low |
| [tevinprince/move-kit-builder](https://github.com/tevinprince/move-kit-builder) (MIT) | Single-HTML drum-kit builder | No | No | Low |
| [charlesvestal/schwung](https://github.com/charlesvestal/schwung) (459 stars) | Framework for custom synths, effects and tools running on Move | Runs on the device | **Yes** (SSH) | None, not for beginners |
| [charlesvestal/extending-move](https://github.com/charlesvestal/extending-move) (182 stars) | Extra web server at move.local:909 | Wi-Fi | **Yes** (SSH) | None |
| [bobbydigitales/move-anything](https://github.com/bobbydigitales/move-anything) (133 stars) | Low-level hardware access on Move | Runs on the device | **Yes** | None. **License is CC BY-NC-SA and bans AI-made derivatives: do not reuse anything from it** |
| Other hacks: [schwung-movy](https://github.com/DimaDake/schwung-movy), [dbxhost](https://github.com/legsmechanical/dbxhost), [moveforge](https://github.com/m-dwyer/moveforge), [ableton-move-hacks](https://github.com/possan/ableton-move-hacks), [move-set-manager](https://github.com/Vratislav/move-set-manager) (archived) | Sequencers, dev tools, SSH notes | Device / Wi-Fi | **Yes** | None |
| [simoianni/ableton-move-lab](https://github.com/simoianni/ableton-move-lab) (AGPL) | Runs Move's own software, taken from the official recovery image, in Docker or on a Raspberry Pi | No | Uses Ableton's firmware | None. **Avoid**: redistributes Ableton's proprietary code |
| File tools: [move-tool](https://github.com/alexfedosov/move-tool) (MIT), [L2Move](https://github.com/manuz888/L2Move), [drum-kit-generator](https://github.com/klingklangmatze/drum-kit-generator) | Command-line preset and kit tools | No | No | None |
| [RNBO Move Takeover](https://rnbo.cycling74.com/learn/move-intro-and-setup) (Cycling '74, alpha; [FAQ](https://help.ableton.com/hc/en-us/articles/26178813450140-RNBO-Move-Takeover-FAQ)) | Alternative boot mode, installed as a `.swu` file via `move.local/testing/update` | n/a | Replaces Move's normal mode until you reboot | None |

**Design references from other devices:**
- **Melodics:** graded curriculum with instant feedback; also offered for Push 3.
- **Novation Easy Start:** a browser tool that walks you through setting up Circuit Tracks, with personalised tutorials. Chrome pops it up when you plug the device in ([Novation guide](https://userguides.novationmusic.com/hc/en-gb/articles/25494476232594-Introduction-to-the-Circuit-Tracks)).
- **Ableton Learning Synths:** short web lessons that also accept MIDI input.
- **Novation Launchpad Arcade/Intro:** a browser app driven by Launchpad hardware.

## 3. Content, copyright and branding constraints

- **The Move manual may not be reproduced.** Its credits page says no part may be "reproduced, edited, stored
  in a retrieval system or transmitted, in any form or by any means… without the prior written permission of Ableton."
  - All lesson text and illustrations must be **our own**: our own wording and our own SVG drawings.
  - Link to the official manual for depth.
- **Ableton website content is Ableton's property** ([copyright page](https://www.ableton.com/en/copyright-and-licensing/)).
  - This covers Learning Music and Learning Synths too, and their source code is not public (none in [github.com/Ableton](https://github.com/Ableton)).
- **[Branding guidelines](https://www.ableton.com/en/legal/branding-trademark-guidelines/):**
  - Put a clear "not affiliated with Ableton AG" disclaimer on every page.
  - Don't use "Ableton" in the domain or site name.
  - Don't use Ableton's photos.
  - Don't copy Ableton's tutorials.
  - "Learn Live" is listed as a not-OK title, so avoid "Learn Move"-style names.
  - Unmodified screenshots are allowed in training material.
- **Ableton's YouTube videos** can be embedded with the standard YouTube player (their public embeds) and linked.

## 4. Source material and Move 2.x documentation status

### Official manual
- The [web manual](https://www.ableton.com/en/move/manual/) and the
  [PDF](https://cdn-resources.ableton.com/resources/pdfs/move-manual/1/2025-07-25/move1-manual-en.pdf) are
  the same document: the **Move 1** manual dated 2025-07-25, 124 pages, 21 chapters.
- It matches firmware of roughly 1.5: it has Auto Filter, slicing and the 4ths layout.
- **Not in the manual** (everything from 1.6 on):
  - 1.6–1.8: Reverse, refresh rate, USB-C MIDI / Standalone Port, Drift parameter banks, Auto Pan-Tremolo.
  - 2.x: audio tracks, Link Audio, Erosion, Auto Shift, bounce to audio, time signatures, mono recording.
- Its MIDI section is **outdated**. It still describes "MIDI In Only / MIDI Out Only" and USB-A only.
- **No Move 2 manual exists yet.** Probes for `/release-notes/move-2/` and `/move/manual/2/` return 404.
- The [cheat sheet PDF](https://cdn-resources.ableton.com/resources/pdfs/move/move-overview-sheet.pdf) dates from October 2024.

### Where 2.x is documented
- [Release notes](https://www.ableton.com/en/release-notes/move-1/) (2.x notes live on the `move-1` page):
  - 2.0.0 (2026-05-05)
  - 2.0.5 (2026-06-25)
  - 2.1.0 (2026-08-25)
  - 2.1.1 (2026-09-15)
- [Beta release notes](https://www.ableton.com/en/release-notes/move-1-beta/).
- Help Center FAQs:
  - [Audio Tracks on Move](https://help.ableton.com/hc/en-us/articles/26962324108572-Audio-Tracks-on-Move-FAQ): covers warping and time-stretch.
  - [Link Audio](https://help.ableton.com/hc/en-us/articles/25425913328924).
- Official videos:
  - "Move Updates: New Sound Design, Sampling and MIDI Improvements" (2026-02-24).
  - "Updates in 2.0 and 2.1: Audio Track Workflows" (2026-08-25).
- Help Center pages block plain fetches. The Zendesk API works:
  `https://help.ableton.com/api/v2/help_center/en-us/articles/<id>.json`.

### Firmware history relevant to a course
| Version | Date | What changed |
|---|---|---|
| 1.1.2 | 2024-10-08 | 16 Pitches layout, arpeggiator, Control Live Mode |
| 1.2.0 | 2024-12-10 | MIDI clock output extended |
| 1.3.0 | | Sampling via USB-C, poly aftertouch MIDI out, All Sound Off (CC 120) on stop, Solo = Shift + Mute + track |
| 1.4 | | New clip = Shift + Step 14, Shift + track button opens the track menu |
| 1.5.0 | 2025-06-11 | Auto Filter, simultaneous MIDI in/out with per-track channels, MIDI Sync receive, sample slicing |
| 1.7.0 | 2025-10-14 | Drift parameter banks, lower brightness levels, **MIDI over USB-C** |
| 1.8.0 | 2025-11-25 | Auto Pan-Tremolo, sample capacity raised to 800 MB |
| 2.0.0 | 2026-05-05 | **Audio tracks** (auto tempo-sync, warping), Erosion and Auto Shift effects, Link Audio |
| 2.0.5 | 2026-06-25 | A clip launched too close to the next quantization point waits for the one after |
| 2.1.0 | 2026-08-25 | **Bounce clips to audio**, **time signatures** (multi-page step sequencer), mono recording |
| 2.1.1 | 2026-09-15 | Fix for a Safari download bug |

### Workflow changes a beginner course must reflect (not in the manual)
- **Create an audio track (2.0):** highlight the track preset → press the wheel → go back to the top of the
  browser → choose "Audio Track".
- **Record audio (2.0):**
  - The Sampling button arms the track.
  - The wheel picks Mic / USB-C / Line In.
  - Record, or a clip pad, starts and stops recording.
  - The Record button now stops recording on both audio and MIDI tracks.
- **Workflow Settings (Shift + Step 3):**
  - Time Signature (2.1). Bars longer than 16 steps continue on extra step-sequencer pages, reached with the left/right arrow buttons.
  - Max Length for recording (2.0.0; corrected 2026-09-25 against the release notes).
- **Monitoring:** a fixed monitoring-track entry in the settings menu (2.0).
- **Bounce (2.1):** copy a clip in Session Mode, then paste it into an audio clip slot or a drum pad.
- **Mono (2.1):** mic recordings are now mono, and there's a new "Line in – Mono" option.
- **Session Mode (2.0 beta notes):** Key & Scale and Full Velocity are hidden in Session Mode.
- **Newer combos** (newer than the launch videos and the cheat sheet):
  - Shift + track button opens the track menu (colour, MIDI In/Out).
  - Solo = Shift + Mute + track button.
  - Shift + press the wheel on a sample opens Slice/Reverse.
  - Drum sampler parameter banks: Shift + turn the wheel.

### Shift + Step shortcuts, checked against the manual text
Build lessons from this table, not from the controls diagram (the diagram is easy to misread by one step).

| Combo | Opens / does |
|---|---|
| Shift + Step 1 | Set Overview |
| Shift + Step 2 | Setup menu |
| Shift + Step 3 | Workflow Settings (Quantize, Step Grid, Count-In, Autoload; Max Length from 2.0; Time Signature from 2.1) |
| Shift + Step 5 | Tempo |
| Shift + Step 6 | Metronome |
| Shift + Step 7 | Groove (swing) |
| Shift + Step 8 | Toggle the 16 Pitches layout |
| Shift + Step 9 | Keys & Scales |
| Shift + Step 10 | Toggle Full Velocity |
| Shift + Step 11 | Repeat / Arpeggiator menu |
| Shift + Step 14 | Prepare the next empty clip slot (new clip) |
| Shift + Step 15 | Double the loop |
| Shift + Step 16 | Quantize notes |

## 5. Parked: connecting the browser to Move (Web MIDI over USB-C)

Kept for reference only. **The course's first version does not connect to the device.**

### Ports
- **[Official]** Since 1.7, in Standalone Mode, a computer (as USB host) exchanges MIDI with Move over USB-C
  ([release notes 1.7.0](https://www.ableton.com/en/release-notes/move-1/),
  ["Using MIDI with Move"](https://help.ableton.com/hc/en-us/articles/14661164865308-Using-MIDI-with-Move)).
- **[Official]** Move shows four ports:
  - `Ableton Move (Live Port)`: used in Control Live Mode.
  - `(User Port)`: "Inactive".
  - `(External Port)`: devices on Move's USB-A port, forwarded in Control Live Mode.
  - `(Standalone Port)`: "Sends and receives MIDI in Standalone Mode".
- **[User]** Browsers can reach Move:
  - A Strudel (browser live-coding) template sends to `Ableton Move Standalone Port`
    ([code](https://github.com/Eight4aWish/eight4awish/blob/HEAD/strudel/templates/midi-template.js)).
  - vlpp_move finds the Live Port in Chrome, including on Android.
  - A browser **receiving** Standalone-mode notes has not been observed; it's inferred.
  - Port names differ by OS. **[Unknown]** for Windows and Linux. Match names by substring and listen on every Move input.
- **[Official]** Macs or iPads connected while Move ran 1.4.1 or older may not show the new ports. Fix:
  - Mac: delete "Ableton Move" in Audio MIDI Setup.
  - iOS: reset Location & Privacy.

### What Move sends
- **[Official]** Notes are sent only from tracks with MIDI Out set (Shift + track button → MIDI Out → pick a channel).
- **[Official]** Channels are set per track (since 1.5).
- **[Official]** Supported: pitch, note length, velocity, polyphonic aftertouch, MIDI clock.
- **[Official]** Not supported: sustain, MPE, pitch bend, channel aftertouch. CC output happens only in Control Live Mode.
- **[User]** Live pad notes are sent: "It's pad notes only from the Move, no knobs or buttons"
  ([Elektronauts #4585](https://www.elektronauts.com/t/221204/4583)).
- Sequencer/clip playback notes are sent too. **[Official]** in general; **[User]** for USB-C specifically.
- **[Official]** Move sends All Sound Off (CC 120) when playback stops.
- **[Official]** Clock and transport: Setup (Shift + Step 2) → MIDI Sync → Off / In / Out. In requires Link to be off.
  - **[Unknown]** whether clock *out* goes over USB-C.
  - **[User]** clock *in* over USB-C works, and Move sends Start after the count-in.
- **[Press]** A track set to MIDI Out still plays its own internal sound
  ([CDM, May 2025](https://cdm.link/ableton-move-1-5-beta/)).
- **[Unknown]** whether muting a track also stops its MIDI out.
- **[Unknown]** which note numbers the drum pads send.

### What Move receives
- **[Official]** Notes, per track, by MIDI In channel. "Auto" means the selected track takes every channel that no other track claims.
- **[Official]** Incoming notes can be recorded with Record or Capture.
- **[Official]** Clock, via MIDI Sync In.
- So a page *could* play demo phrases on the user's own Move.

### Browser support
- Web MIDI works in Chrome 43+, Edge 79+, Firefox 108+ and Android Chrome.
- **Safari and all iOS browsers do not support it.**
- It needs HTTPS and a user permission prompt.

### What can and can't be detected
- **Detectable:**
  - notes, velocity and pressure from tracks with MIDI Out on;
  - clock and start/stop, if MIDI Sync is set to Out.
- **Not detectable:**
  - Shift combos, the wheel, menus, the browser, encoders, mode changes.

### Other channels (not viable for v1)
- **USB audio:**
  - **[Official]** In Standalone Mode, Move is only an audio *input* to the computer ("Ableton Move Audio", 44.1 kHz / 16-bit).
  - Sending Move's own mix needs Setup → USB-C Audio → Main Out. That setting resets on restart and mutes the speaker.
  - Windows needs Ableton's driver.
  - **[Unknown]** whether `getUserMedia` in a browser can capture it.
- **Move Manager (`http://move.local`):**
  - No public API. A reverse-engineered cookie-based API exists
    ([Schwung doc](https://github.com/charlesvestal/schwung/blob/HEAD/docs/archive/move-auth-api.md)).
  - Chrome 142+ asks the user for "Local Network Access" permission, and `.local` hosts are then allowed from HTTPS pages
    ([Chrome blog](https://developer.chrome.com/blog/local-network-access)).
  - **[Unknown]** whether Move Manager sends the cross-origin (CORS) headers a page would need to read its responses.
- **Control Live Mode:**
  - Exposes every control and lets a page set LEDs.
  - But: the protocol is undocumented, the LEDs need constant MIDI traffic, and it needs Live running.
  - It isn't the standalone workflow the course teaches.

### To verify on a real device before any connected mode is built
- Standalone Port names on Windows and Linux.
- Chrome actually receiving Standalone Port notes.
- Whether MIDI Out is off by default, and whether it's saved per Set.
- Whether muting a track stops its MIDI out.
- Clock out over USB-C; Song Position Pointer and Continue.
- Which note numbers the drum pads send.
- Move Manager's CORS headers.
- Browser capture of Move's audio.
