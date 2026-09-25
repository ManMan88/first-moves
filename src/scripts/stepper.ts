import { createProgressStore } from './progress';

export interface Highlight {
  id: string;
  order: number | null;
  held: boolean;
}

/** Parses a `data-press` value: groups separated by `|`, ids within a group by spaces. */
export function parseGroups(attr: string | null): string[][] {
  if (!attr) return [];
  return attr
    .split('|')
    .map((group) => group.split(' ').filter(Boolean))
    .filter((group) => group.length > 0);
}

/** Numbers each press group in order (only when there is more than one) and marks held controls. */
export function highlightsFor(press: string[][], hold: string[]): Highlight[] {
  const numbered = press.length > 1;
  const out = new Map<string, Highlight>();
  press.forEach((group, i) =>
    group.forEach((id) => {
      if (!out.has(id)) out.set(id, { id, order: numbered ? i + 1 : null, held: hold.includes(id) });
    }),
  );
  for (const id of hold) if (!out.has(id)) out.set(id, { id, order: null, held: true });
  return [...out.values()];
}

export function clampStep(step: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(0, Math.floor(step)), count - 1);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function addBadge(control: Element, order: number) {
  const badges = control.closest('svg')?.querySelector('.badges');
  if (!badges) return;
  const cx = Number(control.getAttribute('data-cx'));
  const cy = Number(control.getAttribute('data-cy'));
  const r = Number(control.getAttribute('data-r'));
  const x = String(cx + r * 0.75);
  const y = String(cy - r * 0.75);
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'badge');
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '14');
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.textContent = String(order);
  g.append(circle, text);
  badges.append(g);
}

function applyHighlights(root: ParentNode, highlights: Highlight[]) {
  root.querySelectorAll('[data-control]').forEach((el) => {
    el.removeAttribute('data-active');
    el.removeAttribute('data-held');
  });
  root.querySelectorAll('.badges').forEach((g) => g.replaceChildren());
  for (const h of highlights) {
    root.querySelectorAll(`[data-control="${h.id}"]`).forEach((el) => {
      el.setAttribute('data-active', '');
      if (h.held) el.setAttribute('data-held', '');
      if (h.order !== null) addBadge(el, h.order);
    });
  }
}

function initStepper(section: HTMLElement) {
  const article = section.closest<HTMLElement>('[data-lesson]');
  const lessonId = article?.dataset.lesson ?? '';
  const steps = [...section.querySelectorAll<HTMLElement>('[data-step]')];
  const nav = section.querySelector<HTMLElement>('[data-step-nav]');
  const prev = section.querySelector<HTMLButtonElement>('[data-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-next]');
  const counter = section.querySelector<HTMLElement>('[data-counter]');
  const done = section.querySelector<HTMLElement>('[data-done]');
  if (!steps.length || !nav || !prev || !next || !counter || !done) return;

  const nextLink = done.querySelector<HTMLAnchorElement>('[data-next-link]');
  if (nextLink) {
    if (article?.dataset.nextHref) {
      nextLink.href = article.dataset.nextHref;
      nextLink.textContent = `Next: ${article.dataset.nextTitle ?? 'next lesson'} →`;
    } else {
      nextLink.hidden = true;
    }
  }

  const store = createProgressStore();
  let current = clampStep(store.get(lessonId).step, steps.length);
  section.classList.add('is-enhanced');
  nav.hidden = false;

  // Steps scroll below the sticky drawing instead of under it.
  const figure = section.querySelector<HTMLElement>('.steps-figure');
  const syncFigureHeight = () => {
    if (figure) section.style.setProperty('--figure-h', `${figure.offsetHeight}px`);
  };
  syncFigureHeight();
  window.addEventListener('resize', syncFigureHeight);

  const reveal = (el: HTMLElement) => {
    syncFigureHeight();
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'nearest' });
  };

  const render = (focus: boolean) => {
    steps.forEach((step, i) => {
      step.hidden = i !== current;
    });
    const step = steps[current];
    applyHighlights(
      section,
      highlightsFor(parseGroups(step.getAttribute('data-press')), parseGroups(step.getAttribute('data-hold')).flat()),
    );
    counter.textContent = `Step ${current + 1} of ${steps.length}`;
    prev.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? 'I did it: finish' : 'I did it';
    if (focus) reveal(step);
  };

  prev.addEventListener('click', () => {
    current = clampStep(current - 1, steps.length);
    store.setStep(lessonId, current);
    done.hidden = true;
    render(true);
  });

  next.addEventListener('click', () => {
    if (current === steps.length - 1) {
      store.markDone(lessonId);
      done.hidden = false;
      reveal(done);
      return;
    }
    current += 1;
    store.setStep(lessonId, current);
    render(true);
  });

  done.hidden = !store.get(lessonId).done;
  render(false);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-steps]').forEach(initStepper);
}
