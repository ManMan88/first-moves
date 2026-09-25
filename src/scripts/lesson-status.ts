import { createProgressStore, type LessonProgress } from './progress';

export interface LessonRef {
  id: string;
  href: string;
  title: string;
}

/** The lesson to continue: the one in progress, else the next unfinished one after it, else the first unfinished. */
export function pickContinue(
  lessons: LessonRef[],
  progress: Record<string, LessonProgress>,
  last: string | null,
): LessonRef | null {
  const unfinished = (l: LessonRef) => !progress[l.id]?.done;
  const lastIndex = last ? lessons.findIndex((l) => l.id === last) : -1;
  if (lastIndex >= 0) {
    if (unfinished(lessons[lastIndex])) return lessons[lastIndex];
    const after = lessons.slice(lastIndex + 1).find(unfinished);
    if (after) return after;
  }
  return lessons.find(unfinished) ?? null;
}

function markLessonLinks(progress: Record<string, LessonProgress>) {
  document.querySelectorAll<HTMLElement>('[data-lesson-link]').forEach((el) => {
    const saved = progress[el.dataset.lessonLink ?? ''];
    el.toggleAttribute('data-done', !!saved?.done);
    el.toggleAttribute('data-started', !saved?.done && !!saved && saved.step > 0);
  });
}

function updateContinue(progress: Record<string, LessonProgress>, last: string | null) {
  const cont = document.querySelector<HTMLAnchorElement>('[data-continue]');
  if (!cont || Object.keys(progress).length === 0) return;
  let lessons: LessonRef[] = [];
  try {
    lessons = JSON.parse(cont.dataset.lessons ?? '[]');
  } catch {
    lessons = [];
  }
  const next = pickContinue(lessons, progress, last);
  if (next) {
    cont.href = next.href;
    cont.textContent = `Continue: ${next.title} →`;
  } else if (cont.dataset.courseHref) {
    cont.href = cont.dataset.courseHref;
    cont.textContent = 'All written lessons done! See the course →';
  }
}

if (typeof document !== 'undefined') {
  const store = createProgressStore();
  const refresh = () => {
    const progress = store.all();
    markLessonLinks(progress);
    updateContinue(progress, store.last());
  };
  refresh();
  // Pages restored from the back/forward cache show progress made since they were first loaded.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) refresh();
  });

  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (window.confirm('Reset your progress on every lesson?')) {
      store.reset();
      window.location.reload();
    }
  });
}
