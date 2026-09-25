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
  reset(): void;
}

export const STORAGE_KEY = 'first-moves:v1';

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

function load(storage: Store | null): Record<string, LessonProgress> {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1 || typeof parsed.lessons !== 'object' || parsed.lessons === null) return {};
    return Object.fromEntries(
      Object.entries(parsed.lessons).filter(([, v]) => isLessonProgress(v)),
    ) as Record<string, LessonProgress>;
  } catch {
    return {};
  }
}

/** Lesson progress kept in localStorage; falls back to memory when storage is missing or blocked. */
export function createProgressStore(storage: Store | null = defaultStorage()): ProgressStore {
  let lessons = load(storage);
  const save = () => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify({ v: 1, lessons }));
    } catch {
      // Storage is blocked or full: progress stays in memory for this page.
    }
  };
  const get = (id: string): LessonProgress => ({ step: 0, done: false, ...lessons[id] });
  return {
    get,
    setStep(id, step) {
      lessons[id] = { ...get(id), step: Math.max(0, Math.floor(step)) };
      save();
    },
    markDone(id) {
      lessons[id] = { ...get(id), done: true };
      save();
    },
    all: () => ({ ...lessons }),
    reset() {
      lessons = {};
      try {
        storage?.removeItem(STORAGE_KEY);
      } catch {
        // Nothing stored to clear.
      }
    },
  };
}
