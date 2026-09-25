# First Moves, Stage 1: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the First Moves site (all platform units, CI/deploy, controls reference, glossary) with Parts 0–1 (lessons 1–8), live on GitHub Pages.

**Architecture:**
- Astro 7 static site with a `lessons` MDX content collection.
- A single controls registry (`src/data/controls.ts`) plus drawing geometry (`src/data/layout.ts`) drive the SVG Move drawing, lesson step validation and the controls reference.
- Small vanilla-TS scripts add the one-step-at-a-time player and `localStorage` progress.

**Tech Stack:**
- Runtime: Node 22.20, npm, Astro ^7.3.5, @astrojs/mdx ^8.0.2.
- Types: TypeScript ^6 (@astrojs/check needs ^5 or ^6).
- Tests: Vitest ^5, @playwright/test ^1.63.
- CI: GitHub Actions (`withastro/action@v6`, `actions/deploy-pages@v5`).

**Spec:** `docs/superpowers/specs/2026-09-25-first-moves-design.md`. Research: `docs/research/2026-09-25-prior-art-and-device-research.md`.

**Execution note:**
- The plan gives logic, data and tests in full. Presentational markup and CSS are given in structure.
- Ron delegated execution choices. The site itself is built natively (the tasks share interfaces tightly). Lesson content is written by a workflow of Opus agents at **medium** effort.

## Global Constraints

- Astro config: `site: 'https://manman88.github.io'`, `base: '/first-moves'`, `trailingSlash: 'always'`. Every internal link goes through `url()` from `src/lib/url.ts`.
- Footer on every page: "Unofficial. Not affiliated with or endorsed by Ableton AG." plus a link to https://www.ableton.com/en/move/manual/.
- No "Ableton" in the site name or domain. Site name: **First Moves**.
- Original text and drawings only. No manual sentences, no Ableton images, nothing from move-anything. The manual PDF and its text never enter the repo.
- Button combinations come from the manual *text* or the release notes (Shift + Step table in research §4), never from the diagram.
- New Sets get **random** Track Presets. Lessons never assume what a track contains.
- `Screen` shows only display text the sources state in words.
- Anything not confirmed by the manual text goes in `docs/hardware-checklist.md`.
- Progress key is `first-moves:v1`. Every storage access is wrapped in try/catch.
- No UI framework. Dependencies are limited to astro, @astrojs/mdx, typescript, @astrojs/check, vitest and @playwright/test.
- Code comments describe code only: no ticket, phase or `.md` references.
- Git identity is local (Ron Danon <rondanon@gmail.com>). Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Base path.** Any link or asset without the `/first-moves/` prefix works in `astro dev` but 404s on Pages. Guarded by the e2e crawl test (Task 7), which runs against `astro preview` and follows every internal link.
2. **Broken or blocked storage.** `localStorage` may throw (Safari private mode, blocked site data) or hold corrupted JSON. The site must still work, just without remembering. Guarded by the progress tests with a throwing store and garbage JSON (Task 4).
3. **Stale saved step.** A saved step index can be past the end if a lesson later loses steps. It must clamp to the last step, not show a blank player. Guarded by `clampStep` tests (Task 5).
4. **No JavaScript.** Every step must be readable as a numbered list. Guarded by the e2e test with JS disabled (Task 7).
5. **Phone width.** At 360 px the page must not scroll sideways and the drawing must fit. Guarded by the e2e viewport test (Task 7).

---

## File map

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts, playwright.config.ts
.github/workflows/deploy.yml
public/favicon.svg
src/lib/url.ts                    url() + joinBase()
src/lib/overlap.ts                word n-gram overlap (copying check)
src/data/controls.ts              control registry, aliases, resolveSequence/resolveControls
src/data/layout.ts                SVG geometry for top and back views
src/data/parts.ts                 part titles
src/data/glossary.ts              glossary entries
src/content.config.ts             lessons collection schema
src/content/lessons/NN-slug.mdx   lessons
src/components/MoveDiagram.astro  top-panel SVG (from layout.ts)
src/components/BackPanel.astro    back-panel SVG
src/components/DiagramIcon.astro  button glyphs
src/components/Steps.astro, Step.astro, Tip.astro, Screen.astro, Note.astro, Video.astro
src/components/concepts/StepGrid.astro, PadNotes.astro, SetMap.astro
src/layouts/Base.astro, Lesson.astro
src/pages/index.astro, course.astro, controls.astro, glossary.astro, about.astro, 404.astro
src/pages/lessons/[slug].astro
src/scripts/progress.ts, stepper.ts, lesson-status.ts, controls-page.ts, video.ts
src/styles/global.css
tests/unit/*.test.ts, tests/content/overlap.test.ts, tests/e2e/*.spec.ts
docs/hardware-checklist.md, README.md, LICENSE, CONTENT-LICENSE.md
```

---

### Task 1: Scaffold, base-path helper, CI

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/lib/url.ts`, `src/layouts/Base.astro`, `src/pages/index.astro` (placeholder), `src/styles/global.css` (tokens only), `public/favicon.svg`, `.github/workflows/deploy.yml`, `LICENSE`, `CONTENT-LICENSE.md`, `README.md`
- Test: `tests/unit/url.test.ts`

**Interfaces:**
- Produces:
  - `joinBase(base: string, path: string): string`
  - `url(path?: string): string`
  - `Base.astro` props `{ title: string; description?: string }`, with a default slot for page content.

- [ ] **Step 1: Install**

```bash
npm init -y >/dev/null
npm i astro@^7.3.5 @astrojs/mdx@^8.0.2
npm i -D typescript@^6 @astrojs/check@^0.9.10 vitest@^5 @playwright/test@^1.63
```

Set `"type": "module"` and these scripts in `package.json`:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "check:overlap": "MANUAL_TXT=.cache/move-manual.txt vitest run tests/content/overlap.test.ts"
}
```

- [ ] **Step 2: Config files**

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://manman88.github.io',
  base: '/first-moves',
  trailingSlash: 'always',
  integrations: [mdx()],
});
```

`tsconfig.json`:
```json
{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/unit/**/*.test.ts', 'tests/content/**/*.test.ts'] } });
```

`.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.cache/`, `test-results/`, `playwright-report/`.

`scripts/fetch-manual.sh` (executable): creates `.cache/`, downloads `https://cdn-resources.ableton.com/resources/pdfs/move-manual/1/2025-07-25/move1-manual-en.pdf` to `.cache/move-manual.pdf` if missing, and runs `pdftotext -layout` to `.cache/move-manual.txt`. The manual never leaves `.cache/`.

- [ ] **Step 3: Failing test for joinBase**

`tests/unit/url.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { joinBase } from '../../src/lib/url';

describe('joinBase', () => {
  it('joins a base without trailing slash', () => {
    expect(joinBase('/first-moves', 'lessons/01-tour/')).toBe('/first-moves/lessons/01-tour/');
  });
  it('joins a base with trailing slash and a leading-slash path', () => {
    expect(joinBase('/first-moves/', '/course/')).toBe('/first-moves/course/');
  });
  it('returns the base for an empty path', () => {
    expect(joinBase('/first-moves/', '')).toBe('/first-moves/');
  });
  it('keeps hash fragments', () => {
    expect(joinBase('/', 'glossary/#bar')).toBe('/glossary/#bar');
  });
});
```

Run: `npx vitest run tests/unit/url.test.ts`. Expected: FAIL (module not found).

- [ ] **Step 4: Implement `src/lib/url.ts`**

```ts
export function joinBase(base: string, path: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${path.replace(/^\/+/, '')}`;
}

export function url(path = ''): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
```

Run the test. Expected: PASS.

- [ ] **Step 5: Base layout, tokens and placeholder home**

`Base.astro`:
- `<html lang="en">`, a meta viewport, `<title>{title} · First Moves</title>`, the favicon via `url('favicon.svg')`.
- The global CSS import.
- A header with the site name linking to `url()` and nav links to `url('course/')`, `url('controls/')`, `url('glossary/')`.
- `<main><slot/></main>`.
- A footer with the disclaimer, a manual link and a link to `url('about/')`.

`global.css`:
- Colour tokens on `:root`: `--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`, `--accent-ink`, `--hold`, `--pad`, `--panel`.
- A dark set under `@media (prefers-color-scheme: dark)`.
- `body` gets an explicit background.
- System font stack.
- 16 px side gutter, max width 72rem.

- [ ] **Step 6: CI workflow `.github/workflows/deploy.yml`**

```yaml
name: Test and deploy
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v5
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run check
      - run: npm test
  build:
    needs: test
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with: { node-version: 22 }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 7: Verify and commit**

Run `npm run check && npm test && npm run build`. Expected: 0 errors, and `dist/index.html` exists.

```bash
git add -A && git commit -m "Scaffold Astro site with base-path helper and CI"
```

---

### Task 2: Controls registry and drawing geometry

**Files:**
- Create: `src/data/controls.ts`, `src/data/layout.ts`
- Test: `tests/unit/controls.test.ts`, `tests/unit/layout.test.ts`

**Interfaces:**
- Produces:
  - Types: `ControlGroup`, `Control { id; name; group; does; shift? }`.
  - Values: `CONTROLS: Control[]`, `CONTROL_MAP: Map<string, Control>`, `ALIASES: Record<string, string[]>`.
  - `resolveSequence(spec?: string): string[][]`: one group per token, in order; throws on an unknown token.
  - `resolveControls(spec?: string): string[]`: flattened and de-duplicated.
  - Geometry types: `Shape`, `Icon`, `Placed { id; shape; icon? }`.
  - Geometry values: `TOP_VIEW`, `TOP_LAYOUT: Placed[]`, `BACK_VIEW`, `BACK_LAYOUT: Placed[]`, `STEP_ICON_STEPS: number[]`, `BEAT_STEPS: number[]`.
  - `centerOf(shape): { cx; cy; r }`.

- [ ] **Step 1: Failing tests**

`tests/unit/controls.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { ALIASES, CONTROLS, CONTROL_MAP, resolveControls, resolveSequence } from '../../src/data/controls';

describe('controls registry', () => {
  it('has unique ids', () => {
    expect(new Set(CONTROLS.map((c) => c.id)).size).toBe(CONTROLS.length);
  });
  it('has the full hardware set', () => {
    const count = (p: RegExp) => CONTROLS.filter((c) => p.test(c.id)).length;
    expect(count(/^pad-\d-\d$/)).toBe(32);
    expect(count(/^step-\d+$/)).toBe(16);
    expect(count(/^encoder-\d$/)).toBe(8);
    expect(count(/^track-\d$/)).toBe(4);
    for (const id of ['shift', 'wheel', 'back', 'note-session', 'play', 'record', 'capture', 'sampling', 'loop',
      'mute', 'delete', 'copy', 'undo', 'left', 'right', 'plus', 'minus', 'volume', 'display', 'mic',
      'power', 'audio-out', 'audio-in', 'usb-a', 'usb-c']) {
      expect(CONTROL_MAP.has(id), id).toBe(true);
    }
  });
  it('gives every control a name and a description', () => {
    for (const c of CONTROLS) {
      expect(c.name.length, c.id).toBeGreaterThan(0);
      expect(c.does.length, c.id).toBeGreaterThan(10);
    }
  });
  it('matches the manual text for Shift + Step shortcuts', () => {
    expect(CONTROL_MAP.get('step-2')?.shift).toMatch(/Setup/);
    expect(CONTROL_MAP.get('step-9')?.shift).toMatch(/key/i);
    expect(CONTROL_MAP.get('step-11')?.shift).toMatch(/Repeat|arpeggiat/i);
    expect(CONTROL_MAP.get('step-4')?.shift).toBeUndefined();
  });
  it('aliases expand only to known ids', () => {
    for (const ids of Object.values(ALIASES)) for (const id of ids) expect(CONTROL_MAP.has(id), id).toBe(true);
    expect(ALIASES['drum-pads']).toHaveLength(16);
  });
});

describe('resolveSequence / resolveControls', () => {
  it('keeps one group per token in order', () => {
    expect(resolveSequence('shift step-2')).toEqual([['shift'], ['step-2']]);
  });
  it('accepts commas and extra whitespace', () => {
    expect(resolveSequence(' shift,  step-2 ')).toEqual([['shift'], ['step-2']]);
  });
  it('expands aliases into one group', () => {
    expect(resolveSequence('tracks')).toEqual([['track-1', 'track-2', 'track-3', 'track-4']]);
  });
  it('returns [] for empty input', () => {
    expect(resolveSequence(undefined)).toEqual([]);
    expect(resolveSequence('')).toEqual([]);
  });
  it('throws a helpful error on a typo', () => {
    expect(() => resolveSequence('shfit')).toThrow(/Unknown control id "shfit"/);
  });
  it('flattens and de-duplicates', () => {
    expect(resolveControls('shift step-2 shift')).toEqual(['shift', 'step-2']);
  });
});
```

`tests/unit/layout.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { CONTROLS } from '../../src/data/controls';
import { BACK_LAYOUT, TOP_LAYOUT, TOP_VIEW, centerOf } from '../../src/data/layout';

describe('layout', () => {
  const drawn = [...TOP_LAYOUT, ...BACK_LAYOUT].map((p) => p.id);
  it('draws every registered control exactly once', () => {
    expect(new Set(drawn).size).toBe(drawn.length);
    expect([...drawn].sort()).toEqual(CONTROLS.map((c) => c.id).sort());
  });
  it('keeps top-view shapes inside the panel', () => {
    for (const p of TOP_LAYOUT) {
      const { cx, cy, r } = centerOf(p.shape);
      expect(cx - r, p.id).toBeGreaterThanOrEqual(0);
      expect(cy - r, p.id).toBeGreaterThanOrEqual(0);
      expect(cx + r, p.id).toBeLessThanOrEqual(TOP_VIEW.width);
      expect(cy + r, p.id).toBeLessThanOrEqual(TOP_VIEW.height);
    }
  });
});
```

Run: `npx vitest run tests/unit/controls.test.ts tests/unit/layout.test.ts`. Expected: FAIL (modules missing).

- [ ] **Step 2: Implement `src/data/controls.ts`**

Pads are `pad-{row}-{col}`, where row 1 is the **top** row and col 1 is the left column. Tracks are `track-1` (top) to `track-4`. The top-is-Track-1 assumption goes on the hardware checklist. All `does` and `shift` strings are original wording.

Shift + Step functions (from the manual text):
- 1 Set Overview
- 2 Setup menu
- 3 Workflow Settings
- 5 Tempo
- 6 Metronome
- 7 Groove
- 8 16 Pitches layout (drum kits)
- 9 Keys & Scales
- 10 Full Velocity
- 11 Repeat / arpeggiator
- 14 Prepare a new clip
- 15 Double the loop
- 16 Quantize

Other Shift functions come from the controls diagram labels and the manual text:
- Capture: clear captured notes.
- Mute: solo (with a track button; release notes 1.3).
- Undo: redo.
- Track buttons: track settings/menu.
- Encoders: fine adjustment.
- Play (Session Mode): retrigger all clips.

```ts
export type ControlGroup =
  | 'screen' | 'navigation' | 'transport' | 'function' | 'track' | 'pad' | 'step' | 'encoder' | 'port';

export interface Control {
  id: string;
  name: string;
  group: ControlGroup;
  does: string;
  shift?: string;
}

const STEP_SHIFT: Record<number, string> = {
  1: 'Open the Set Overview, where all your Sets live.',
  2: 'Open the Setup menu (Wi-Fi, updates, MIDI, brightness and more).',
  3: 'Open Workflow Settings (quantize, step grid, count-in, autoload, time signature).',
  5: 'Change the tempo (BPM).',
  6: 'Metronome settings.',
  7: 'Set the groove (swing) amount.',
  8: 'Turn the 16 Pitches layout on or off (drum kits).',
  9: 'Choose the key and scale for melodic sounds.',
  10: 'Turn Full Velocity on or off (every hit plays at full strength).',
  11: 'Repeat and arpeggiator settings.',
  14: 'Get the next empty clip slot ready: a fresh clip.',
  15: 'Double the loop (copies the notes into the new half).',
  16: 'Quantize: snap the notes in the clip to the grid.',
};

const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const ROW_NAME = ['top', 'second', 'third', 'bottom'];

const single: Control[] = [
  { id: 'display', name: 'Display', group: 'screen',
    does: 'Shows the current sound, menus and values. Touch a knob to see what it changes.' },
  { id: 'wheel', name: 'Wheel', group: 'navigation',
    does: 'Turn it to scroll through menus, sounds and values. Press it to confirm a choice.' },
  { id: 'back', name: 'Back', group: 'navigation',
    does: 'Steps out of a menu or the sound browser. Hold it to close the current view.' },
  { id: 'note-session', name: 'Note/Session', group: 'navigation',
    does: 'Switches between Note Mode (build one track) and Session Mode (launch clips). Hold it to peek at the other mode.' },
  { id: 'play', name: 'Play', group: 'transport', does: 'Starts and stops playback.',
    shift: 'In Session Mode: restart all playing clips from their beginning.' },
  { id: 'record', name: 'Record', group: 'transport',
    does: 'Starts or stops recording what you play (and knob moves) into a clip. Starts playback too, after a count-in, if it was stopped.' },
  { id: 'capture', name: 'Capture', group: 'function',
    does: 'Turns what you just played without recording into a clip. Pressed while stopped, it also guesses your tempo.',
    shift: 'Clear what Capture has been listening to.' },
  { id: 'sampling', name: 'Sampling', group: 'function',
    does: 'Opens Sampling Mode to record sound from the microphone, the audio input, USB-C, or Move itself.' },
  { id: 'loop', name: 'Loop', group: 'function',
    does: 'Loop Mode: the step buttons show the bars of the clip, so you can change its length or copy whole bars.' },
  { id: 'mute', name: 'Mute', group: 'function', does: 'Mutes or unmutes a track or a single drum pad.',
    shift: 'Solo (hold Shift + Mute and press a track button).' },
  { id: 'delete', name: 'Delete', group: 'function',
    does: 'Removes things: hold it and press the Set, clip, pad or notes you want gone.' },
  { id: 'copy', name: 'Copy', group: 'function',
    does: 'Copies Sets, notes, steps, bars or clips. Press it again to empty the clipboard.' },
  { id: 'undo', name: 'Undo', group: 'function', does: 'Takes back your last action.', shift: 'Redo.' },
  { id: 'shift', name: 'Shift', group: 'function',
    does: 'Hold it to reach the second job of other controls, such as the icons printed under the step buttons. Double-press to lock it on.' },
  { id: 'left', name: 'Left arrow', group: 'navigation',
    does: 'Moves to the previous bar of a clip. Hold a step and press it to nudge notes earlier.' },
  { id: 'right', name: 'Right arrow', group: 'navigation',
    does: 'Moves to the next bar of a clip. Hold a step and press it to nudge notes later.' },
  { id: 'plus', name: 'Plus (+)', group: 'navigation',
    does: 'Moves a melodic instrument up an octave. Hold a step and press it to raise the notes on that step.' },
  { id: 'minus', name: 'Minus (−)', group: 'navigation',
    does: 'Moves a melodic instrument down an octave. Hold a step and press it to lower the notes on that step.' },
  { id: 'volume', name: 'Volume knob', group: 'encoder',
    does: 'Sets the overall volume. Hold a track button while turning it for that track, a pad for that pad, or a step for how hard its notes play.' },
  { id: 'mic', name: 'Microphone', group: 'port', does: 'Built-in microphone for recording samples.' },
  { id: 'power', name: 'Power button', group: 'port',
    does: 'Turns Move on. To turn it off, press it, then press the wheel. Hold it for ten seconds to force Move off.' },
  { id: 'audio-out', name: 'Audio out', group: 'port', does: 'Headphones or speakers (3.5 mm stereo jack).' },
  { id: 'audio-in', name: 'Audio in', group: 'port', does: 'Plug in another sound source to sample it (3.5 mm stereo jack).' },
  { id: 'usb-a', name: 'USB-A', group: 'port', does: 'Connect a USB MIDI keyboard or controller.' },
  { id: 'usb-c', name: 'USB-C', group: 'port', does: 'Charging, and connecting Move to a computer, phone or tablet.' },
];

const tracks: Control[] = [1, 2, 3, 4].map((n) => ({
  id: `track-${n}`, name: `Track ${n} button`, group: 'track',
  does: `Selects track ${n}. Hold it to peek at that track without switching to it.`,
  shift: 'Open this track’s settings.',
}));

const encoders: Control[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  id: `encoder-${n}`, name: `Knob ${n}`, group: 'encoder',
  does: 'Changes one setting of the current instrument or effect. Touch it to see which one on the display.',
  shift: 'Fine adjustment: smaller changes per turn.',
}));

const pads: Control[] = [1, 2, 3, 4].flatMap((row) =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((col) => ({
    id: `pad-${row}-${col}`,
    name: `Pad (${ROW_NAME[row - 1]} row, ${ORDINAL[col - 1]} from left)`,
    group: 'pad' as const,
    does: 'Plays a note or a drum sound. Hit softly for a quiet note, harder for a loud one. Press harder while holding to shape some sounds.',
  })),
);

const steps: Control[] = Array.from({ length: 16 }, (_, i) => i + 1).map((n) => ({
  id: `step-${n}`, name: `Step ${n}`, group: 'step',
  does: `Adds or removes the selected note on step ${n} of the pattern (a 16th note, by default).`,
  shift: STEP_SHIFT[n],
}));

export const CONTROLS: Control[] = [...single, ...tracks, ...encoders, ...pads, ...steps];
export const CONTROL_MAP = new Map(CONTROLS.map((c) => [c.id, c]));

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
export const ALIASES: Record<string, string[]> = {
  pads: pads.map((p) => p.id),
  'drum-pads': range(4).flatMap((r) => range(4).map((c) => `pad-${r}-${c}`)),
  'right-pads': range(4).flatMap((r) => range(4).map((c) => `pad-${r}-${c + 4}`)),
  steps: steps.map((s) => s.id),
  encoders: encoders.map((e) => e.id),
  tracks: tracks.map((t) => t.id),
};

export function resolveSequence(spec?: string): string[][] {
  if (!spec) return [];
  return spec.split(/[\s,]+/).filter(Boolean).map((token) => {
    if (ALIASES[token]) return [...ALIASES[token]];
    if (CONTROL_MAP.has(token)) return [token];
    throw new Error(`Unknown control id "${token}". Use an id or alias from src/data/controls.ts.`);
  });
}

export function resolveControls(spec?: string): string[] {
  return [...new Set(resolveSequence(spec).flat())];
}
```

(The `step-4` test asserts `shift` is `undefined`: `STEP_SHIFT[4]` is undefined, so it is.)

- [ ] **Step 3: Implement `src/data/layout.ts`**

Geometry is in viewBox units. The top view is 1160×540. Proportions were measured from the manual's controls diagram; the drawing itself is our own.

```ts
export type Shape =
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; rx: number };

export type Icon =
  | 'play' | 'record' | 'back' | 'menu' | 'capture' | 'dot' | 'loop' | 'mute'
  | 'delete' | 'copy' | 'undo' | 'shift' | 'left' | 'right' | 'plus' | 'minus';

export interface Placed { id: string; shape: Shape; icon?: Icon }

export const TOP_VIEW = { width: 1160, height: 540 };
export const BACK_VIEW = { width: 1160, height: 130 };

const circle = (cx: number, cy: number, r: number): Shape => ({ kind: 'circle', cx, cy, r });
const rect = (x: number, y: number, w: number, h: number, rx: number): Shape => ({ kind: 'rect', x, y, w, h, rx });

export const PAD_ROW_Y = [132, 206, 281, 356];
export const STEP_Y = 473;
export const stepX = (n: number) => 237 + 49 * (n - 1);
export const BEAT_STEPS = [1, 5, 9, 13];
export const STEP_ICON_STEPS = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16];

export const TOP_LAYOUT: Placed[] = [
  { id: 'display', shape: rect(28, 34, 124, 66, 4) },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `encoder-${n}`, shape: circle(261 + 98 * (n - 1), 54, 21) })),
  { id: 'mic', shape: circle(1023, 54, 4) },
  { id: 'volume', shape: circle(1104, 60, 28) },
  { id: 'wheel', shape: circle(87, 198, 48) },
  { id: 'back', shape: circle(53, 310, 25), icon: 'back' },
  { id: 'note-session', shape: circle(120, 310, 25), icon: 'menu' },
  ...[1, 2, 3, 4].map((n) => ({ id: `track-${n}`, shape: rect(168, PAD_ROW_Y[n - 1] - 2, 26, 64, 13) })),
  ...[1, 2, 3, 4].flatMap((row) => [1, 2, 3, 4, 5, 6, 7, 8].map((col) => ({
    id: `pad-${row}-${col}`, shape: rect(220 + 98 * (col - 1), PAD_ROW_Y[row - 1], 83, 60, 5),
  }))),
  { id: 'capture', shape: circle(1037, 162, 25), icon: 'capture' },
  { id: 'sampling', shape: circle(1104, 162, 25), icon: 'dot' },
  { id: 'loop', shape: circle(1037, 236, 25), icon: 'loop' },
  { id: 'mute', shape: circle(1104, 236, 25), icon: 'mute' },
  { id: 'delete', shape: circle(1037, 311, 25), icon: 'delete' },
  { id: 'copy', shape: circle(1104, 311, 25), icon: 'copy' },
  { id: 'undo', shape: circle(1037, 386, 25), icon: 'undo' },
  { id: 'shift', shape: circle(1104, 386, 25), icon: 'shift' },
  { id: 'play', shape: circle(53, STEP_Y, 25), icon: 'play' },
  { id: 'record', shape: circle(120, STEP_Y, 25), icon: 'record' },
  ...Array.from({ length: 16 }, (_, i) => ({ id: `step-${i + 1}`, shape: circle(stepX(i + 1), STEP_Y, 17) })),
  { id: 'left', shape: circle(1028, STEP_Y, 15), icon: 'left' },
  { id: 'right', shape: circle(1112, STEP_Y, 15), icon: 'right' },
  { id: 'plus', shape: circle(1070, 450, 15), icon: 'plus' },
  { id: 'minus', shape: circle(1070, 496, 15), icon: 'minus' },
];

export const BACK_LAYOUT: Placed[] = [
  { id: 'power', shape: circle(52, 70, 15) },
  { id: 'audio-out', shape: circle(110, 70, 10) },
  { id: 'audio-in', shape: circle(158, 70, 10) },
  { id: 'usb-a', shape: rect(958, 62, 38, 16, 2) },
  { id: 'usb-c', shape: rect(1058, 63, 34, 14, 7) },
];

export function centerOf(shape: Shape): { cx: number; cy: number; r: number } {
  if (shape.kind === 'circle') return { cx: shape.cx, cy: shape.cy, r: shape.r };
  return { cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2, r: Math.max(shape.w, shape.h) / 2 };
}
```

Run both tests. Expected: PASS. Commit: `git commit -m "Add controls registry and drawing geometry"`.

---

### Task 3: Move drawing and controls reference page

**Files:**
- Create: `src/components/DiagramIcon.astro`, `src/components/MoveDiagram.astro`, `src/components/BackPanel.astro`, `src/pages/controls.astro`, `src/scripts/controls-page.ts`
- Test: covered by the e2e tests in Task 7 (clicking a control highlights its entry)

**Interfaces:**
- Consumes: `TOP_LAYOUT`, `BACK_LAYOUT`, `TOP_VIEW`, `BACK_VIEW`, `centerOf`, `CONTROL_MAP`, `BEAT_STEPS`, `STEP_ICON_STEPS`, `stepX`, `STEP_Y`.
- Produces:
  - Every control rendered as `<g class="ctl ctl-{group}" data-control="{id}" data-cx data-cy data-r>` with a `<title>` holding its name.
  - Each SVG has one empty `<g class="badges">` for the stepper.
  - Props: `MoveDiagram { interactive?: boolean; label?: string }`, `BackPanel { interactive?: boolean }`. When interactive, each control gets `tabindex="0" role="button" aria-label="{name}"`.
  - Highlight contract (CSS in `global.css`): `[data-control][data-active]` gets the accent stroke/fill and a pulse; `[data-held]` gets the hold style. The pulse is disabled under `prefers-reduced-motion`.

- [ ] **Step 1: `DiagramIcon.astro`.** Props `{ name: Icon; cx: number; cy: number; r: number }`. Draw each glyph with simple primitives scaled to `r`:
  - play: a triangle;
  - record: a ring;
  - back: a `<`;
  - menu: three lines;
  - capture: four corners;
  - dot: a filled dot;
  - loop: an arc with an arrow;
  - mute: an "M";
  - delete: an ×;
  - copy: two squares;
  - undo: a hooked arrow;
  - shift: three dots on the orange fill;
  - left/right: chevrons;
  - plus/minus.

  Use `stroke="currentColor"` and `pointer-events: none`.
- [ ] **Step 2: `MoveDiagram.astro`.**
  - A rounded panel `rect`, the display with a faint screen line, an LED dot under each encoder, and a beat mark (a short line under the LED) on steps 1, 5, 9 and 13.
  - A small tick mark under each step in `STEP_ICON_STEPS`, meaning "has a Shift function".
  - Every `TOP_LAYOUT` control group, as in the contract above.
  - An empty `<g class="badges">`.
  - `role="img"` and an `aria-label` on the `<svg>`. With `interactive`, the svg is `role="group"` instead.
- [ ] **Step 3: `BackPanel.astro`.** A thin body strip with small labels under each port ("Power", "Out", "In", "USB-A", "USB-C"), and the same group contract.
- [ ] **Step 4: `controls.astro`.**
  - An interactive `MoveDiagram` and `BackPanel`.
  - Below them, sections grouped by `ControlGroup` with human titles. Each control is an `<article id="control-{id}" data-control-entry="{id}">` with its name, `does`, and "With Shift: …" when set.
  - Pads, steps and knobs are collapsed into one entry each (such as "Pads (32)"), plus a full Shift + Step table. Entry ids: `control-pads`, `control-steps`, `control-encoders`, `control-tracks`.
- [ ] **Step 5: `controls-page.ts`.** Clicking a control, or pressing Enter/Space on it:
  - Maps the id to its entry: `pad-*` → `pads`, `step-*` → `steps`, `encoder-*` → `encoders`, `track-*` → `tracks`, anything else → itself.
  - Sets `data-active` on that control (clearing the others).
  - Adds `.is-current` to the entry and scrolls it into view (smooth unless reduced motion is set).
- [ ] **Step 6:** `npm run build`, then open `dist/controls/index.html` in Playwright, take a screenshot and check it visually against the manual diagram layout. Commit: `git commit -m "Add Move drawing and controls reference page"`.

---

### Task 4: Progress store

**Files:**
- Create: `src/scripts/progress.ts`
- Test: `tests/unit/progress.test.ts`

**Interfaces:**
- Produces:
  - Types: `LessonProgress { step: number; done: boolean }`, `ProgressStore`.
  - `ProgressStore` methods: `get(id): LessonProgress`, `setStep(id, step): void`, `markDone(id): void`, `all(): Record<string, LessonProgress>`, `reset(): void`.
  - `createProgressStore(storage?: Pick<Storage,'getItem'|'setItem'|'removeItem'> | null): ProgressStore`.
  - `STORAGE_KEY = 'first-moves:v1'`.

- [ ] **Step 1: Failing tests** in `tests/unit/progress.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, createProgressStore } from '../../src/scripts/progress';

function memory() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}
const throwing = {
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
  removeItem: () => { throw new Error('blocked'); },
};

describe('progress store', () => {
  it('defaults to step 0, not done', () => {
    expect(createProgressStore(memory()).get('01-tour')).toEqual({ step: 0, done: false });
  });
  it('persists steps and completion across instances', () => {
    const m = memory();
    const a = createProgressStore(m);
    a.setStep('01-tour', 3);
    a.markDone('02-power');
    const b = createProgressStore(m);
    expect(b.get('01-tour')).toEqual({ step: 3, done: false });
    expect(b.get('02-power').done).toBe(true);
    expect(JSON.parse(m.data.get(STORAGE_KEY)!).v).toBe(1);
  });
  it('ignores corrupted JSON', () => {
    const m = memory();
    m.data.set(STORAGE_KEY, '{not json');
    expect(createProgressStore(m).get('x')).toEqual({ step: 0, done: false });
  });
  it('ignores data with the wrong shape', () => {
    const m = memory();
    m.data.set(STORAGE_KEY, JSON.stringify({ v: 1, lessons: { x: { step: 'three', done: 'yes' } } }));
    expect(createProgressStore(m).get('x')).toEqual({ step: 0, done: false });
  });
  it('keeps working in memory when storage throws', () => {
    const s = createProgressStore(throwing);
    s.setStep('x', 2);
    expect(s.get('x').step).toBe(2);
  });
  it('works with no storage at all', () => {
    const s = createProgressStore(null);
    s.markDone('x');
    expect(s.get('x').done).toBe(true);
  });
  it('reset clears everything', () => {
    const m = memory();
    const s = createProgressStore(m);
    s.markDone('x');
    s.reset();
    expect(s.all()).toEqual({});
    expect(createProgressStore(m).all()).toEqual({});
  });
});
```

Run and expect FAIL.

- [ ] **Step 2: Implement `src/scripts/progress.ts`**

```ts
export interface LessonProgress { step: number; done: boolean }
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface ProgressStore {
  get(id: string): LessonProgress;
  setStep(id: string, step: number): void;
  markDone(id: string): void;
  all(): Record<string, LessonProgress>;
  reset(): void;
}

export const STORAGE_KEY = 'first-moves:v1';

function defaultStorage(): Store | null {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

function isLessonProgress(v: unknown): v is LessonProgress {
  return typeof v === 'object' && v !== null
    && Number.isInteger((v as LessonProgress).step) && (v as LessonProgress).step >= 0
    && typeof (v as LessonProgress).done === 'boolean';
}

function load(storage: Store | null): Record<string, LessonProgress> {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.lessons !== 'object' || parsed.lessons === null) return {};
    return Object.fromEntries(Object.entries(parsed.lessons).filter(([, v]) => isLessonProgress(v))) as Record<string, LessonProgress>;
  } catch {
    return {};
  }
}

export function createProgressStore(storage: Store | null = defaultStorage()): ProgressStore {
  let lessons = load(storage);
  const save = () => {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify({ v: 1, lessons })); } catch { /* storage unavailable: keep in memory */ }
  };
  const get = (id: string): LessonProgress => ({ step: 0, done: false, ...lessons[id] });
  return {
    get,
    setStep(id, step) { lessons[id] = { ...get(id), step: Math.max(0, Math.floor(step)) }; save(); },
    markDone(id) { lessons[id] = { ...get(id), done: true }; save(); },
    all: () => ({ ...lessons }),
    reset() {
      lessons = {};
      try { storage?.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
    },
  };
}
```

Run and expect PASS. Commit: `git commit -m "Add localStorage progress store"`.

---

### Task 5: Lesson collection, step components, stepper

**Files:**
- Create:
  - `src/content.config.ts`, `src/data/parts.ts`, `src/lib/lessons.ts`
  - `src/components/Steps.astro`, `Step.astro`, `Tip.astro`, `Screen.astro`, `Note.astro`, `Video.astro`, `concepts/StepGrid.astro`, `concepts/PadNotes.astro`, `concepts/SetMap.astro`
  - `src/layouts/Lesson.astro`, `src/pages/lessons/[slug].astro`
  - `src/scripts/stepper.ts`, `src/scripts/video.ts`
  - `src/content/lessons/01-tour.mdx` (a first real draft, so the pipeline renders end to end)
- Test: `tests/unit/stepper.test.ts`, `tests/unit/lesson-controls.test.ts`

**Interfaces:**
- Consumes: `resolveSequence`, `resolveControls`, `createProgressStore`, `url`, `MoveDiagram`, `BackPanel`.
- Produces:
  - Frontmatter schema: `{ title: string; part: 0–6; order: 1–26; summary: string; needs?: string[]; video?: { id: string; title: string }; sources: string[] (min 1); firmware?: string }`.
  - `PARTS: { n: number; title: string; blurb: string }[]`.
  - `getLessons(): Promise<CollectionEntry<'lessons'>[]>`, sorted by `order`.
  - Step DOM contract: `<li data-step data-press="a b|c" data-hold="a">`. Groups are separated by `|` and ids within a group by spaces.
  - `Steps` props: `{ view?: 'top' | 'back' | 'both' }`.
  - `Step` props: `{ press?: string; hold?: string; see?: string; hear?: string }`. It throws at build time on unknown ids.
  - `Screen` props: `{ lines: string[] }`.
  - `Note` props: `{ kind?: 'newer' | 'tip' | 'info' }`. `newer` renders "This is newer than Ableton's manual (firmware {firmware}). Details come from Ableton's release notes."
  - `Video` props: `{ id: string; title: string }`.
  - `StepGrid` props: `{ on?: number[]; accent?: number[]; showBeats?: boolean; caption?: string }`.
  - `PadNotes` props: `{ rows: string[][]; highlight?: string[]; caption?: string }`. Rows run top to bottom, 8 labels each; labels in `highlight` get the accent colour.
  - `SetMap`: no props.
  - Stepper pure API: `parseGroups(attr: string | null): string[][]`, `highlightsFor(press: string[][], hold: string[]): { id: string; order: number | null; held: boolean }[]`, `clampStep(step: number, count: number): number`.

- [ ] **Step 1: Failing stepper tests** in `tests/unit/stepper.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { clampStep, highlightsFor, parseGroups } from '../../src/scripts/stepper';

describe('parseGroups', () => {
  it('splits groups on | and ids on spaces', () => {
    expect(parseGroups('shift|step-2')).toEqual([['shift'], ['step-2']]);
    expect(parseGroups('pad-1-1 pad-1-2|play')).toEqual([['pad-1-1', 'pad-1-2'], ['play']]);
  });
  it('handles empty and null', () => {
    expect(parseGroups('')).toEqual([]);
    expect(parseGroups(null)).toEqual([]);
  });
});

describe('highlightsFor', () => {
  it('numbers groups when there is more than one action', () => {
    expect(highlightsFor([['shift'], ['step-2']], ['shift'])).toEqual([
      { id: 'shift', order: 1, held: true },
      { id: 'step-2', order: 2, held: false },
    ]);
  });
  it('does not number a single action', () => {
    expect(highlightsFor([['play']], [])).toEqual([{ id: 'play', order: null, held: false }]);
  });
  it('gives all ids in a group the same number', () => {
    const h = highlightsFor([['pad-1-1', 'pad-1-2'], ['play']], []);
    expect(h.map((x) => x.order)).toEqual([1, 1, 2]);
  });
  it('adds held-only controls without a number', () => {
    expect(highlightsFor([['step-1']], ['shift'])).toEqual([
      { id: 'step-1', order: null, held: false },
      { id: 'shift', order: null, held: true },
    ]);
  });
});

describe('clampStep', () => {
  it('clamps a stale saved step to the last step', () => {
    expect(clampStep(9, 4)).toBe(3);
  });
  it('clamps negatives and handles zero steps', () => {
    expect(clampStep(-2, 4)).toBe(0);
    expect(clampStep(5, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Failing lesson scan test** in `tests/unit/lesson-controls.test.ts`. It reads every `src/content/lessons/*.mdx`, extracts each `press="…"` and `hold="…"` attribute with `/\b(press|hold)="([^"]*)"/g`, and asserts `resolveSequence(value)` does not throw. It also asserts that every file's frontmatter has a `sources:` key.

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveSequence } from '../../src/data/controls';

const dir = join(process.cwd(), 'src/content/lessons');
const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));

describe('lesson files', () => {
  it('exist', () => expect(files.length).toBeGreaterThan(0));
  for (const f of files) {
    const text = readFileSync(join(dir, f), 'utf8');
    it(`${f}: every press/hold id is known`, () => {
      for (const m of text.matchAll(/\b(press|hold)="([^"]*)"/g)) {
        expect(() => resolveSequence(m[2]), `${m[1]}="${m[2]}"`).not.toThrow();
      }
    });
    it(`${f}: cites sources`, () => {
      expect(text).toMatch(/^sources:/m);
    });
  }
});
```

- [ ] **Step 3: Implement `stepper.ts`**. The pure functions are exported. The DOM wiring runs only when `document` exists and a `[data-steps]` element is present:

```ts
import { createProgressStore } from './progress';

export interface Highlight { id: string; order: number | null; held: boolean }

export function parseGroups(attr: string | null): string[][] {
  if (!attr) return [];
  return attr.split('|').map((g) => g.split(' ').filter(Boolean)).filter((g) => g.length > 0);
}

export function highlightsFor(press: string[][], hold: string[]): Highlight[] {
  const numbered = press.length > 1;
  const out = new Map<string, Highlight>();
  press.forEach((group, i) => group.forEach((id) => {
    if (!out.has(id)) out.set(id, { id, order: numbered ? i + 1 : null, held: hold.includes(id) });
  }));
  for (const id of hold) if (!out.has(id)) out.set(id, { id, order: null, held: true });
  return [...out.values()];
}

export function clampStep(step: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(0, Math.floor(step)), count - 1);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function applyHighlights(root: ParentNode, highlights: Highlight[]) {
  root.querySelectorAll('[data-control]').forEach((el) => {
    el.removeAttribute('data-active');
    el.removeAttribute('data-held');
  });
  root.querySelectorAll('.badges').forEach((g) => g.replaceChildren());
  for (const h of highlights) {
    root.querySelectorAll(`[data-control="${h.id}"]`).forEach((el) => {
      el.setAttribute('data-active', '');
      if (h.held) el.setAttribute('data-held', '');
      if (h.order === null) return;
      const badges = el.closest('svg')?.querySelector('.badges');
      if (!badges) return;
      const cx = Number(el.getAttribute('data-cx'));
      const cy = Number(el.getAttribute('data-cy'));
      const r = Number(el.getAttribute('data-r'));
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'badge');
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', String(cx + r * 0.75));
      c.setAttribute('cy', String(cy - r * 0.75));
      c.setAttribute('r', '13');
      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', String(cx + r * 0.75));
      t.setAttribute('y', String(cy - r * 0.75));
      t.textContent = String(h.order);
      g.append(c, t);
      badges.append(g);
    });
  }
}

function initStepper(section: HTMLElement) {
  const lessonId = section.closest('[data-lesson]')?.getAttribute('data-lesson') ?? '';
  const steps = [...section.querySelectorAll<HTMLElement>('[data-step]')];
  const nav = section.querySelector<HTMLElement>('[data-step-nav]');
  const prev = section.querySelector<HTMLButtonElement>('[data-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-next]');
  const counter = section.querySelector<HTMLElement>('[data-counter]');
  const done = section.querySelector<HTMLElement>('[data-done]');
  if (!steps.length || !nav || !prev || !next || !counter || !done) return;

  const store = createProgressStore();
  let current = clampStep(store.get(lessonId).step, steps.length);
  section.classList.add('is-enhanced');
  nav.hidden = false;

  const render = (focus: boolean) => {
    steps.forEach((s, i) => { s.hidden = i !== current; });
    const s = steps[current];
    applyHighlights(section, highlightsFor(parseGroups(s.getAttribute('data-press')), parseGroups(s.getAttribute('data-hold')).flat()));
    counter.textContent = `Step ${current + 1} of ${steps.length}`;
    prev.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? 'I did it: finish lesson' : 'I did it';
    if (focus) s.focus({ preventScroll: false });
  };

  prev.addEventListener('click', () => {
    current = clampStep(current - 1, steps.length);
    store.setStep(lessonId, current);
    done.hidden = true;
    render(true);
  });
  next.addEventListener('click', () => {
    if (current === steps.length - 1) {
      store.markDone(lessonId);
      done.hidden = false;
      done.focus();
      return;
    }
    current += 1;
    store.setStep(lessonId, current);
    render(true);
  });
  done.hidden = !store.get(lessonId).done;
  render(false);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-steps]').forEach(initStepper);
}
```

Run `tests/unit/stepper.test.ts`. Expected: PASS. Vitest runs in node, so the DOM block is skipped.

- [ ] **Step 4: Collection and components.**

`src/content.config.ts`:
```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    part: z.number().int().min(0).max(6),
    order: z.number().int().min(1).max(26),
    summary: z.string(),
    needs: z.array(z.string()).optional(),
    video: z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{11}$/), title: z.string() }).optional(),
    sources: z.array(z.string()).min(1),
    firmware: z.string().optional(),
  }),
});

export const collections = { lessons };
```

`Step.astro`:
- Frontmatter: `const groups = resolveSequence(press); const held = resolveControls(hold);` (these throw on typos, which fails the build).
- Renders `<li class="step" data-step tabindex="-1" data-press={groups.map((g) => g.join(' ')).join('|')} data-hold={held.join(' ')}>`.
- Inside: the default slot, then `see` as `<p class="expect"><strong>You should see:</strong> …</p>` and `hear` as "You should hear:".

`Steps.astro`:
- A `<section class="steps" data-steps>` holding:
  - `<div class="steps-figure">` with `MoveDiagram` and/or `BackPanel`, chosen by `view`;
  - `<ol class="step-list"><slot/></ol>`;
  - `<nav data-step-nav hidden>` with a Back button, a counter and a next button;
  - `<div data-done hidden tabindex="-1">` saying "Lesson complete! 🎉", with a link to the next lesson through the `nextHref` prop. The Lesson layout passes it through the MDX components wrapper.
- Plus `<script>import '../scripts/stepper.ts'</script>`.

`Tip.astro`: `<details class="tip"><summary>Didn't work?</summary><slot/></details>`.

`Screen.astro`: a dark rounded box with `aria-label="Move's display"`, each line in a monospace pixel style.

`Note.astro`: an `<aside>` callout.

`Video.astro`: a `<button data-video={id}>` card, "▶ Watch Ableton's video: {title} (opens YouTube player)". It uses **no thumbnail image**. `video.ts` swaps it for `<iframe src="https://www.youtube-nocookie.com/embed/{id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>`. Below the card sits a plain link to `https://www.youtube.com/watch?v={id}` for no-JS readers.

`StepGrid.astro`: 16 cells in 4 groups of 4. Cells listed in `on` are filled and cells in `accent` are outlined. With `showBeats`, labels "Beat 1–4" sit under the groups and "1 bar" spans the whole grid.

`PadNotes.astro`: an 8×4 grid of labelled cells, using `rows` as given.

`SetMap.astro`: an SVG of "Set" → 4 track rows → 8 clip slots each, labelled "Track 1–4" and "clips".

`src/data/parts.ts`:
```ts
export const PARTS = [
  { n: 0, title: 'Meet your Move', blurb: 'Get to know the hardware and get it ready.' },
  { n: 1, title: 'First sounds', blurb: 'Sets, tracks, the three views, playing the pads, choosing sounds.' },
  { n: 2, title: 'Make a beat', blurb: 'Steps, tempo, recording, Capture, editing and loops.' },
  { n: 3, title: 'Melody & bass', blurb: 'Basslines, chords, the arpeggiator and shaping sounds.' },
  { n: 4, title: 'Build a song', blurb: 'Session Mode, mixing and performing.' },
  { n: 5, title: 'Sampling & audio', blurb: 'Record the world around you and turn it into music.' },
  { n: 6, title: 'Beyond the box', blurb: 'Move Manager, Cloud, Link, MIDI and Live.' },
] as const;
```

`src/lib/lessons.ts`:
```ts
import { getCollection, type CollectionEntry } from 'astro:content';
export type Lesson = CollectionEntry<'lessons'>;
export async function getLessons(): Promise<Lesson[]> {
  return (await getCollection('lessons')).sort((a, b) => a.data.order - b.data.order);
}
```

`src/pages/lessons/[slug].astro`:
- `getStaticPaths` maps `getLessons()` to `{ params: { slug: l.id }, props: { lesson, prev, next } }`.
- It renders `Lesson.astro`, which:
  - shows a header (part n, title, summary, needs);
  - renders `<Content components={{ Steps: StepsWithNext, Step, Tip, Screen, Note: NoteWithFirmware, Video, StepGrid, PadNotes, SetMap }} />`;
  - adds a `Video` for `video` frontmatter (placed after the content), a sources list ("Based on: …") and a prev/next pager;
  - wraps the page in `<article data-lesson={lesson.id}>`.
- If MDX does not resolve un-imported custom component names from `components`, fall back to explicit imports at the top of each lesson file. Record which one worked in the lesson-writer brief.

- [ ] **Step 5: First lesson draft `01-tour.mdx`** (frontmatter plus two to three steps using `press`, `view="both"`), to prove the pipeline. Its full content is written in Task 8.
- [ ] **Step 6:** Run `npm run check && npm test && npm run build`. Expected: PASS and `dist/lessons/01-tour/index.html` exists. Then prove the build guard: temporarily set `press="shfit"` in the draft, run `npm run build`, expect a failure mentioning `Unknown control id "shfit"`, and revert. Commit: `git commit -m "Add lesson collection, step components and stepper"`.

---

### Task 6: Home, course map, glossary, about, 404

**Files:**
- Create: `src/pages/index.astro` (replaces the placeholder), `src/pages/course.astro`, `src/pages/glossary.astro`, `src/pages/about.astro`, `src/pages/404.astro`, `src/data/glossary.ts`, `src/scripts/lesson-status.ts`
- Test: `tests/unit/glossary.test.ts`

**Interfaces:**
- Consumes: `getLessons`, `PARTS`, `createProgressStore`, `url`.
- Produces:
  - `GLOSSARY: { term: string; slug: string; def: string; lesson?: string }[]`, with anchors `glossary/#{slug}`.
  - Lesson links carry `data-lesson-link="{id}"`. `lesson-status.ts` sets `data-done` on them and fills `[data-continue]` (href and label) with the first lesson not yet done.
  - A `[data-reset]` button on the course page calls `store.reset()` and reloads.

- [ ] **Step 1: Failing glossary test.** Slugs are unique and match `/^[a-z0-9-]+$/`; the list is sorted by term (case-insensitive); every `lesson` value matches an existing file in `src/content/lessons/`. Run and expect FAIL.
- [ ] **Step 2: `glossary.ts`**, with original definitions for:
  - Set, track, clip, Track Preset, instrument, effect, Drum Rack, pad, step;
  - beat, bar, BPM/tempo, velocity, aftertouch, scale, key, octave;
  - loop, sequencing, recording, Capture, quantize, groove/swing, metronome, count-in;
  - Note Mode, Session Mode, Set Overview, scene;
  - sample, sampling, resampling, slicing, automation, encoder, Shift.
  - Link each term to the lesson that teaches it (lessons 1–8 exist now; the rest are added in later stages).
- [ ] **Step 3: Pages.**
  - **Home:**
    - A hero: "Learn your Ableton Move one step at a time", with a one-line pitch.
    - A `[data-continue]` button linking to lesson 1 by default.
    - A "How it works" row of three items (hold your Move, follow the lit-up buttons, tap "I did it").
    - The part cards.
  - **Course map:** parts in order, each lesson a card with its number, title, summary and a done tick (`[data-done]` CSS), plus the reset button. Parts without lessons yet show "Coming soon".
  - **Glossary:** a `<dl>` with ids.
  - **About:**
    - The disclaimer.
    - Why it exists.
    - Sources: manual, release notes, Help Center, Learn Move videos.
    - License: code MIT, content CC BY 4.0.
    - Which firmware it's written for (2.1).
    - A note that newer features come from release notes.
  - **404:** a friendly message with links home and to the course.
- [ ] **Step 4:** Run `npm run check && npm test && npm run build`, then commit: `git commit -m "Add home, course map, glossary, about and 404 pages"`.

---

### Task 7: End-to-end tests and the copying check

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/site.spec.ts`, `src/lib/overlap.ts`, `tests/unit/overlap.test.ts`, `tests/content/overlap.test.ts`

**Interfaces:**
- Produces: `normalizeWords(text: string): string[]`, `sharedRuns(candidate: string, reference: string, n?: number): string[]` (runs of at least n words shared by both, merged into maximal runs), `stripMdx(source: string): string`.

- [ ] **Step 1: Failing overlap unit tests** in `tests/unit/overlap.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { normalizeWords, sharedRuns, stripMdx } from '../../src/lib/overlap';

describe('overlap', () => {
  it('normalizes case, punctuation and curly quotes', () => {
    expect(normalizeWords('Move’s  Pads, are GREAT!')).toEqual(["move's", 'pads', 'are', 'great']);
  });
  it('finds a shared 8-word run and merges longer runs', () => {
    const ref = 'you can press the pads harder to generate higher velocity values on the device';
    const cand = 'Tip: press the pads harder to generate higher velocity values on the device today.';
    expect(sharedRuns(cand, ref, 8)).toEqual(['press the pads harder to generate higher velocity values on the device']);
  });
  it('ignores runs shorter than n', () => {
    expect(sharedRuns('hold shift and press step two now', 'hold shift and press step two', 8)).toEqual([]);
  });
  it('strips frontmatter, imports and JSX tags but keeps prose and attribute text', () => {
    const src = "---\ntitle: X\n---\nimport A from 'b';\n\n<Step press=\"play\" see=\"It plays\">Press **Play**.</Step>";
    const out = stripMdx(src);
    expect(out).toContain('Press Play.');
    expect(out).toContain('It plays');
    expect(out).not.toContain('import');
    expect(out).not.toContain('title: X');
  });
});
```

- [ ] **Step 2: Implement `src/lib/overlap.ts`**

```ts
export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(Boolean);
}

export function sharedRuns(candidate: string, reference: string, n = 8): string[] {
  const ref = normalizeWords(reference);
  const grams = new Set<string>();
  for (let i = 0; i + n <= ref.length; i++) grams.add(ref.slice(i, i + n).join(' '));
  const words = normalizeWords(candidate);
  const hit = words.map(() => false);
  for (let i = 0; i + n <= words.length; i++) {
    if (grams.has(words.slice(i, i + n).join(' '))) for (let k = i; k < i + n; k++) hit[k] = true;
  }
  const runs: string[] = [];
  let start = -1;
  for (let i = 0; i <= words.length; i++) {
    if (i < words.length && hit[i]) { if (start < 0) start = i; continue; }
    if (start >= 0) { runs.push(words.slice(start, i).join(' ')); start = -1; }
  }
  return runs;
}

export function stripMdx(source: string): string {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/\b(?:see|hear|title|caption)="([^"]*)"/g, ' $1. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`#>]/g, '');
}
```

Run and expect PASS.

- [ ] **Step 3: Content overlap check** `tests/content/overlap.test.ts`. It is skipped unless `MANUAL_TXT` is set and readable. For each lesson file it asserts `sharedRuns(stripMdx(text), manual, 8)` equals `[]`, and the failure message lists the runs. It checks the `does`/`shift` strings of the controls registry and the glossary definitions the same way.

```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTROLS } from '../../src/data/controls';
import { GLOSSARY } from '../../src/data/glossary';
import { sharedRuns, stripMdx } from '../../src/lib/overlap';

const manualPath = process.env.MANUAL_TXT;
const available = !!manualPath && existsSync(manualPath);
const manual = available ? readFileSync(manualPath!, 'utf8') : '';
const dir = join(process.cwd(), 'src/content/lessons');

describe.skipIf(!available)('no 8-word runs copied from the manual', () => {
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.mdx'))) {
    it(f, () => expect(sharedRuns(stripMdx(readFileSync(join(dir, f), 'utf8')), manual, 8)).toEqual([]));
  }
  it('controls registry', () => {
    const text = CONTROLS.map((c) => `${c.does}. ${c.shift ?? ''}.`).join('\n');
    expect(sharedRuns(text, manual, 8)).toEqual([]);
  });
  it('glossary', () => {
    expect(sharedRuns(GLOSSARY.map((g) => g.def).join('\n'), manual, 8)).toEqual([]);
  });
});
```

Run: `scripts/fetch-manual.sh && npm run check:overlap`. `fetch-manual.sh` downloads the manual PDF into the git-ignored `.cache/` and extracts `.cache/move-manual.txt` with `pdftotext -layout`; `check:overlap` sets `MANUAL_TXT=.cache/move-manual.txt`. Expected: PASS. Fix any flagged wording.

- [ ] **Step 4: Playwright config and e2e**

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4321/first-moves/' },
  webServer: { command: 'npm run build && npm run preview -- --port 4321', url: 'http://localhost:4321/first-moves/', reuseExistingServer: true, timeout: 180_000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

`tests/e2e/site.spec.ts` covers:
1. **Crawl:** starting at `./`, follow every same-origin `a[href]` under `/first-moves/` (breadth-first, deduplicated). Each page must return 200, and no page may contain an `href` or `src` starting with `/` that doesn't start with `/first-moves/`.
2. **Stepper:**
   - Open `lessons/01-tour/`. Exactly one step is visible.
   - The first step's controls have `data-active`. Numbered badges appear when the step has more than one group.
   - Clicking "I did it" moves to step 2. After a reload it is still on step 2.
   - Finishing the last step shows the done panel.
   - `course/` shows lesson 1 with `data-done`.
   - The home `[data-continue]` points at lesson 2.
3. **No JS:** a new context with `javaScriptEnabled: false` shows every `[data-step]` in the lesson.
4. **Phone width:** at viewport 360×740, on home, a lesson and controls, `document.documentElement.scrollWidth <= 360`.
5. **Controls page:** clicking `[data-control="shift"]` gives it `data-active`, and `#control-shift` gets `.is-current`. Clicking a pad highlights `#control-pads`.
6. **Blocked storage:** a context with `addInitScript` that makes `localStorage` throw can still step through the lesson.

Run `npx playwright install chromium` (once), then `npm run test:e2e`. Expected: all pass. Commit: `git commit -m "Add end-to-end tests and manual-overlap check"`.

---

### Task 8: Lessons 1–8 (content workflow)

**Files:**
- Create/replace: `src/content/lessons/01-tour.mdx` … `08-choosing-sounds.mdx`, `docs/hardware-checklist.md`
- Modify: `src/data/glossary.ts` (lesson links only; done afterwards, one file at a time)

**Interfaces:**
- Consumes: the frozen component API from Task 5 and the control ids/aliases from Task 2. Writers **only add lesson files**.

Lesson slugs:
- `01-tour`
- `02-power-and-setup`
- `03-sets-tracks-clips`
- `04-three-views`
- `05-new-set`
- `06-playing-pads`
- `07-scales-and-octaves`
- `08-choosing-sounds`

Videos:
- 04: `_c4lz85pOLc`
- 05: `_UQj8c6MaZU`
- 06: `CdoT5YuVO1Q`
- 08: `5Q1EHEjbuhA`

- [ ] **Step 1: Freeze and commit** the site itself (Tasks 1–7) before starting the fan-out.
- [ ] **Step 2: Run a workflow**, with Opus inherited and effort `medium`. Each lesson goes through **writer → verifier**.
  - **Writer brief:**
    - The spec content rules.
    - The lesson anatomy.
    - Component API and control ids, taken from the source files.
    - The manual text path (`.cache/move-manual.txt`) and the relevant manual sections.
    - The research doc for 2.x changes.
    - The Shift + Step table.
    - The random-presets rule and the no-invented-screen-text rule.
    - Write in their own words, for someone new to music, using short sentences and second person.
    - Return the MDX, plus a list of claims that need a hardware check.
  - **Verifier brief:** adversarially check every `press`/`hold` combo and factual claim against the manual text and research doc. Flag copied phrasing and invented screen text. Return fixes.
- [ ] **Step 3:** Apply the verifier fixes. Write `docs/hardware-checklist.md`, grouped by lesson, with the claim, the source it's based on and why it's unverified. Link glossary terms to the lessons.
- [ ] **Step 4:** Run `npm run check && npm test && npm run check:overlap && npm run test:e2e`. All must pass. Commit: `git commit -m "Add lessons 1–8 and hardware checklist"`.

---

### Task 9: Publish and verify live

- [ ] **Step 1:** `gh repo create ManMan88/first-moves --public --source . --remote origin --description "First Moves: a free, hands-on beginner course for the Ableton Move (unofficial)" --homepage https://manman88.github.io/first-moves/`.
- [ ] **Step 2:** Enable Pages with Actions as the source: `gh api -X POST repos/ManMan88/first-moves/pages -f build_type=workflow`. If it already exists, use `-X PUT`.
- [ ] **Step 3:** `git push -u origin main`, then watch the run with `gh run watch`. Expected: test, build and deploy all succeed.
- [ ] **Step 4:** Curl the live URL: `/first-moves/`, `/first-moves/lessons/01-tour/`, `/first-moves/controls/`, plus the CSS and JS asset URLs taken from the HTML. Every one must return 200.
- [ ] **Step 5:** Load the live lesson in Playwright (point `baseURL` at the live site), check the stepper works, and take phone and desktop screenshots for a visual check.

### Task 10: Whole-branch review

- [ ] A fresh reviewer agent reviews the whole repo against the spec: accuracy rules, copyright rules, accessibility and the base path. Fix confirmed findings, re-run all checks, push, and re-verify live.

## Next plans (after Stage 1 is live)

- **Stage 2:** lessons 9–17.
- **Stage 3:** lessons 18–26, full glossary links, final accuracy and copying review.

Both use the same Task 8 workflow shape (writer → verifier per lesson, adding files only) followed by Task 9 checks.
