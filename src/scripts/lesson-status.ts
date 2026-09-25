import { createProgressStore } from './progress';

interface LessonRef {
  id: string;
  href: string;
  title: string;
}

if (typeof document !== 'undefined') {
  const store = createProgressStore();
  const progress = store.all();

  document.querySelectorAll<HTMLElement>('[data-lesson-link]').forEach((el) => {
    const saved = progress[el.dataset.lessonLink ?? ''];
    if (saved?.done) el.setAttribute('data-done', '');
    else if (saved && saved.step > 0) el.setAttribute('data-started', '');
  });

  const cont = document.querySelector<HTMLAnchorElement>('[data-continue]');
  if (cont && Object.keys(progress).length > 0) {
    let lessons: LessonRef[] = [];
    try {
      lessons = JSON.parse(cont.dataset.lessons ?? '[]');
    } catch {
      lessons = [];
    }
    const next = lessons.find((l) => !progress[l.id]?.done);
    if (next) {
      cont.href = next.href;
      cont.textContent = `Continue: ${next.title} →`;
    } else if (cont.dataset.courseHref) {
      cont.href = cont.dataset.courseHref;
      cont.textContent = 'All written lessons done! See the course →';
    }
  }

  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (window.confirm('Reset your progress on every lesson?')) {
      store.reset();
      window.location.reload();
    }
  });
}
