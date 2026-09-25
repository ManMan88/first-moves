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

  it('finds runs that span a line break in the reference', () => {
    const ref = 'the quick brown fox jumps over\n   the lazy dog again';
    expect(sharedRuns('a quick brown fox jumps over the lazy dog', ref, 8)).toEqual([
      'quick brown fox jumps over the lazy dog',
    ]);
  });

  it('strips frontmatter, imports and JSX tags but keeps prose and attribute text', () => {
    const src = "---\ntitle: X\n---\nimport A from 'b';\n\n<Step press=\"play\" see=\"It plays\">Press **Play**.</Step>";
    const out = stripMdx(src);
    expect(out).toContain('Press Play.');
    expect(out).toContain('It plays');
    expect(out).not.toContain('import');
    expect(out).not.toContain('title: X');
    expect(out).not.toContain('press=');
  });
});
