import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTROLS } from '../../src/data/controls';
import { GLOSSARY } from '../../src/data/glossary';
import { sharedRuns, stripMdx } from '../../src/lib/overlap';

const manualPath = process.env.MANUAL_TXT;
const available = !!manualPath && existsSync(manualPath);
const manual = available ? readFileSync(manualPath!, 'utf8') : '';
const lessonDir = join(process.cwd(), 'src/content/lessons');
const RUN = 8;

describe.skipIf(!available)(`no ${RUN}-word runs copied from the manual`, () => {
  for (const f of readdirSync(lessonDir).filter((x) => x.endsWith('.mdx'))) {
    it(f, () => {
      expect(sharedRuns(stripMdx(readFileSync(join(lessonDir, f), 'utf8')), manual, RUN)).toEqual([]);
    });
  }

  it('controls registry', () => {
    const text = CONTROLS.map((c) => `${c.does}. ${c.shift ?? ''}.`).join('\n');
    expect(sharedRuns(text, manual, RUN)).toEqual([]);
  });

  it('glossary', () => {
    expect(sharedRuns(GLOSSARY.map((g) => `${g.def}.`).join('\n'), manual, RUN)).toEqual([]);
  });
});
