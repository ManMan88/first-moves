import { describe, expect, it } from 'vitest';
import { CONTROLS } from '../../src/data/controls';
import { BACK_LAYOUT, BACK_VIEW, TOP_LAYOUT, TOP_VIEW, centerOf } from '../../src/data/layout';

describe('layout', () => {
  const drawn = [...TOP_LAYOUT, ...BACK_LAYOUT].map((p) => p.id);

  it('draws every registered control exactly once', () => {
    expect(new Set(drawn).size).toBe(drawn.length);
    expect([...drawn].sort()).toEqual(CONTROLS.map((c) => c.id).sort());
  });

  it('keeps shapes inside their view', () => {
    for (const [layout, view] of [[TOP_LAYOUT, TOP_VIEW], [BACK_LAYOUT, BACK_VIEW]] as const) {
      for (const p of layout) {
        const { cx, cy, r } = centerOf(p.shape);
        expect(cx - r, p.id).toBeGreaterThanOrEqual(0);
        expect(cy - r, p.id).toBeGreaterThanOrEqual(0);
        expect(cx + r, p.id).toBeLessThanOrEqual(view.width);
        expect(cy + r, p.id).toBeLessThanOrEqual(view.height);
      }
    }
  });

  it('puts the bottom-left pad at the bottom left', () => {
    const pad = (id: string) => centerOf(TOP_LAYOUT.find((p) => p.id === id)!.shape);
    expect(pad('pad-4-1').cy).toBeGreaterThan(pad('pad-1-1').cy);
    expect(pad('pad-4-8').cx).toBeGreaterThan(pad('pad-4-1').cx);
  });
});
