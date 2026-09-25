import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, createProgressStore } from '../../src/scripts/progress';

function memory() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const throwing = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
  removeItem: () => {
    throw new Error('blocked');
  },
};

describe('progress store', () => {
  it('defaults to step 0, not done', () => {
    expect(createProgressStore(memory()).get('01-tour')).toEqual({ step: 0, done: false });
  });

  it('persists steps and completion across instances', () => {
    const m = memory();
    const a = createProgressStore(m);
    a.setStep('01-tour', 3);
    a.markDone('02-power');
    const b = createProgressStore(m);
    expect(b.get('01-tour')).toEqual({ step: 3, done: false });
    expect(b.get('02-power').done).toBe(true);
    expect(JSON.parse(m.data.get(STORAGE_KEY)!).v).toBe(1);
  });

  it('ignores corrupted JSON', () => {
    const m = memory();
    m.data.set(STORAGE_KEY, '{not json');
    expect(createProgressStore(m).get('x')).toEqual({ step: 0, done: false });
  });

  it('ignores data with the wrong shape', () => {
    const m = memory();
    m.data.set(STORAGE_KEY, JSON.stringify({ v: 1, lessons: { x: { step: 'three', done: 'yes' } } }));
    expect(createProgressStore(m).get('x')).toEqual({ step: 0, done: false });
  });

  it('keeps working in memory when storage throws', () => {
    const s = createProgressStore(throwing);
    s.setStep('x', 2);
    expect(s.get('x').step).toBe(2);
  });

  it('works with no storage at all', () => {
    const s = createProgressStore(null);
    s.markDone('x');
    expect(s.get('x').done).toBe(true);
  });

  it('reset clears everything', () => {
    const m = memory();
    const s = createProgressStore(m);
    s.markDone('x');
    s.reset();
    expect(s.all()).toEqual({});
    expect(createProgressStore(m).all()).toEqual({});
  });

  it('does not erase progress saved by another tab', () => {
    const m = memory();
    const tabA = createProgressStore(m);
    const tabB = createProgressStore(m);
    tabB.markDone('04-three-views');
    tabA.setStep('03-sets-tracks-clips', 2);
    const fresh = createProgressStore(m);
    expect(fresh.get('04-three-views').done).toBe(true);
    expect(fresh.get('03-sets-tracks-clips').step).toBe(2);
  });

  it('does not bring back progress that another tab reset', () => {
    const m = memory();
    const tabA = createProgressStore(m);
    const tabB = createProgressStore(m);
    tabA.markDone('01-tour');
    tabB.reset();
    tabA.setStep('02-power-and-setup', 1);
    const fresh = createProgressStore(m);
    expect(fresh.get('01-tour').done).toBe(false);
    expect(fresh.get('02-power-and-setup').step).toBe(1);
  });

  it('remembers the last lesson you worked on', () => {
    const m = memory();
    const s = createProgressStore(m);
    expect(s.last()).toBeNull();
    s.setStep('05-new-set', 1);
    s.markDone('03-sets-tracks-clips');
    expect(createProgressStore(m).last()).toBe('03-sets-tracks-clips');
  });
});

