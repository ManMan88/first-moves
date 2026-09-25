# First Moves

A free, hands-on beginner course for the Ableton Move: hold your Move, follow the
lit-up buttons on the drawing, and tap "I did it". Written for people who are new to
both the Move and to making music.

**Live site:** https://manman88.github.io/first-moves/

> Unofficial. Not affiliated with or endorsed by Ableton AG.

## Develop

```bash
npm ci
npm run dev          # http://localhost:4321/first-moves/
npm run check        # astro check (types)
npm test             # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright; run `npx playwright install chromium` once)
scripts/fetch-manual.sh && npm run check:overlap   # flags text copied from the official manual
```

Pushing to `main` runs the tests and deploys to GitHub Pages.

## Writing lessons

Lessons live in `src/content/lessons/NN-slug.mdx`. Steps name the controls to light up:

```mdx
<Steps>
  <Step press="shift step-2" hold="shift" see="The Setup menu opens on the display.">
    Hold **Shift** and press **Step 2**.
  </Step>
</Steps>
```

Control ids and aliases (`pads`, `drum-pads`, `steps`, `encoders`, `tracks`) are defined in
`src/data/controls.ts`; an unknown id fails the build. Every lesson lists its `sources`, and
claims that could not be confirmed from the manual text go in `docs/hardware-checklist.md`.

Project docs: `docs/PROGRESS.md` (status and handoff), `docs/superpowers/specs/` (design),
`docs/superpowers/plans/` (implementation plans), `docs/research/` (background research).

## License

Code: MIT (`LICENSE`). Lesson text and illustrations: CC BY 4.0 (`CONTENT-LICENSE.md`).
