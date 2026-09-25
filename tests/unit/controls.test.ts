import { describe, expect, it } from 'vitest';
import { ALIASES, CONTROLS, CONTROL_MAP, resolveControls, resolveSequence } from '../../src/data/controls';

describe('controls registry', () => {
  it('has unique ids', () => {
    expect(new Set(CONTROLS.map((c) => c.id)).size).toBe(CONTROLS.length);
  });

  it('has the full hardware set', () => {
    const count = (pattern: RegExp) => CONTROLS.filter((c) => pattern.test(c.id)).length;
    expect(count(/^pad-\d-\d$/)).toBe(32);
    expect(count(/^step-\d+$/)).toBe(16);
    expect(count(/^encoder-\d$/)).toBe(8);
    expect(count(/^track-\d$/)).toBe(4);
    for (const id of [
      'shift', 'wheel', 'back', 'note-session', 'play', 'record', 'capture', 'sampling', 'loop',
      'mute', 'delete', 'copy', 'undo', 'left', 'right', 'plus', 'minus', 'volume', 'display', 'mic',
      'power', 'audio-out', 'audio-in', 'usb-a', 'usb-c',
    ]) {
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
    expect(CONTROL_MAP.get('step-1')?.shift).toMatch(/Set Overview/);
    expect(CONTROL_MAP.get('step-2')?.shift).toMatch(/Setup/);
    expect(CONTROL_MAP.get('step-3')?.shift).toMatch(/Workflow/);
    expect(CONTROL_MAP.get('step-5')?.shift).toMatch(/tempo/i);
    expect(CONTROL_MAP.get('step-8')?.shift).toMatch(/16 Pitches/);
    expect(CONTROL_MAP.get('step-9')?.shift).toMatch(/key/i);
    expect(CONTROL_MAP.get('step-11')?.shift).toMatch(/Repeat|arpeggiat/i);
    expect(CONTROL_MAP.get('step-16')?.shift).toMatch(/Quantize/);
    for (const n of [4, 12, 13]) expect(CONTROL_MAP.get(`step-${n}`)?.shift, `step-${n}`).toBeUndefined();
  });

  it('has row and column aliases for slides across the pads', () => {
    expect(ALIASES['column-2']).toEqual(['pad-1-2', 'pad-2-2', 'pad-3-2', 'pad-4-2']);
    expect(ALIASES['row-4']).toEqual(['pad-4-1', 'pad-4-2', 'pad-4-3', 'pad-4-4', 'pad-4-5', 'pad-4-6', 'pad-4-7', 'pad-4-8']);
    expect(resolveSequence('column-8')).toHaveLength(1);
  });

  it('aliases expand only to known ids', () => {
    for (const ids of Object.values(ALIASES)) for (const id of ids) expect(CONTROL_MAP.has(id), id).toBe(true);
    expect(ALIASES['drum-pads']).toHaveLength(16);
    expect(ALIASES['drum-pads']).toContain('pad-4-1');
    expect(ALIASES['right-pads']).toContain('pad-1-8');
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
