import { describe, expect, it } from 'vitest';
import { badgesFor, clampStep, highlightsFor, parseGroups } from '../../src/scripts/stepper';

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
  it('lights every control and marks the held ones', () => {
    expect(highlightsFor([['shift'], ['step-2']], ['shift'])).toEqual([
      { id: 'shift', held: true },
      { id: 'step-2', held: false },
    ]);
  });
  it('lights every control of an alias group', () => {
    expect(highlightsFor([['pad-1-1', 'pad-1-2'], ['play']], []).map((h) => h.id)).toEqual(['pad-1-1', 'pad-1-2', 'play']);
  });
  it('adds held-only controls', () => {
    expect(highlightsFor([['step-1']], ['shift'])).toEqual([
      { id: 'step-1', held: false },
      { id: 'shift', held: true },
    ]);
  });
});

describe('badgesFor', () => {
  it('does not number a single action', () => {
    expect(badgesFor([['play']])).toEqual([]);
    expect(badgesFor([])).toEqual([]);
  });
  it('numbers each action in order', () => {
    expect(badgesFor([['shift'], ['step-2']])).toEqual([
      { id: 'shift', label: '1' },
      { id: 'step-2', label: '2' },
    ]);
  });
  it('puts one badge on the first control of an alias group', () => {
    const knobs = Array.from({ length: 8 }, (_, i) => `encoder-${i + 1}`);
    expect(badgesFor([knobs, ['volume']])).toEqual([
      { id: 'encoder-1', label: '1' },
      { id: 'volume', label: '2' },
    ]);
  });
  it('shows every number on a control pressed more than once', () => {
    expect(badgesFor([['plus'], ['plus']])).toEqual([{ id: 'plus', label: '1,2' }]);
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
