import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GLOSSARY } from '../../src/data/glossary';

describe('glossary', () => {
  it('has unique, url-safe slugs', () => {
    const slugs = GLOSSARY.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('is sorted by term, ignoring case', () => {
    const terms = GLOSSARY.map((g) => g.term.toLowerCase());
    expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b)));
  });

  it('only links to lessons that exist', () => {
    for (const g of GLOSSARY) {
      if (!g.lesson) continue;
      expect(existsSync(join(process.cwd(), 'src/content/lessons', `${g.lesson}.mdx`)), `${g.term} → ${g.lesson}`).toBe(true);
    }
  });

  it('gives every term a real definition', () => {
    for (const g of GLOSSARY) expect(g.def.length, g.term).toBeGreaterThan(30);
  });
});
