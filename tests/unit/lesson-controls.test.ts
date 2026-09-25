import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveSequence } from '../../src/data/controls';

const dir = join(process.cwd(), 'src/content/lessons');
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mdx')) : [];

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
    it(`${f}: file name is NN-slug.mdx`, () => {
      expect(f).toMatch(/^\d{2}-[a-z0-9-]+\.mdx$/);
    });
  }
});
