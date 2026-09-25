export interface LessonProgress {
  step: number;
  done: boolean;
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface ProgressStore {
  get(id: string): LessonProgress;
  setStep(id: string, step: number): void;
  markDone(id: string): void;
  all(): Record<string, LessonProgress>;
  /** The lesson most recently worked on, or null. */
  last(): string | null;
  reset(): void;
}

interface State {
  lessons: Record<string, LessonProgress>;
  last: string | null;
}

export const STORAGE_KEY = 'first-moves:v1';

const empty = (): State => ({ lessons: {}, last: null });

function defaultStorage(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isLessonProgress(value: unknown): value is LessonProgress {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as LessonProgress;
  return Number.isInteger(v.step) && v.step >= 0 && typeof v.done === 'boolean';
}

/** Reads the saved state; null when storage is missing or cannot be read. */
function load(storage: Store | null): State | null {
  if (!storage) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return empty();
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.lessons !== 'object' || parsed.lessons === null) return empty();
    const lessons = Object.fromEntries(
      Object.entries(parsed.lessons).filter(([, v]) => isLessonProgress(v)),
    ) as Record<string, LessonProgress>;
    const last = typeof parsed.last === 'string' ? parsed.last : null;
    return { lessons, last };
  } catch {
    return empty();
  }
}

/**
 * Lesson progress kept in localStorage. Every read and write reloads the saved state first,
 * so several open tabs don't overwrite each other. Falls back to memory when storage is
 * missing or blocked.
 */
export function createProgressStore(storage: Store | null = defaultStorage()): ProgressStore {
  let state = load(storage) ?? empty();

  const refresh = () => {
    const saved = load(storage);
    if (saved) state = saved;
  };

  const save = () => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify({ v: 1, ...state }));
    } catch {
      // Storage is blocked or full: progress stays in memory for this page.
    }
  };

  const current = (id: string): LessonProgress => {
    const saved: LessonProgress | undefined = state.lessons[id];
    return saved ? { ...saved } : { step: 0, done: false };
  };

  const update = (id: string, change: Partial<LessonProgress>) => {
    refresh();
    state.lessons[id] = { ...current(id), ...change };
    state.last = id;
    save();
  };

  return {
    get(id) {
      refresh();
      return current(id);
    },
    setStep(id, step) {
      update(id, { step: Math.max(0, Math.floor(step)) });
    },
    markDone(id) {
      update(id, { done: true });
    },
    all() {
      refresh();
      return { ...state.lessons };
    },
    last() {
      refresh();
      return state.last;
    },
    reset() {
      state = empty();
      try {
        storage?.removeItem(STORAGE_KEY);
      } catch {
        // Nothing stored to clear.
      }
    },
  };
}
