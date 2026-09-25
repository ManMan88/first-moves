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
