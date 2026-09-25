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
