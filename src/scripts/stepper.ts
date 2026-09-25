import { createProgressStore } from './progress';

export interface Highlight {
  id: string;
  held: boolean;
}

export interface Badge {
  id: string;
  label: string;
}

/** Parses a `data-press` value: groups separated by `|`, ids within a group by spaces. */
export function parseGroups(attr: string | null): string[][] {
  if (!attr) return [];
  return attr
    .split('|')
    .map((group) => group.split(' ').filter(Boolean))
    .filter((group) => group.length > 0);
}

/** Every control to light up, marking the ones to hold down. */
export function highlightsFor(press: string[][], hold: string[]): Highlight[] {
  const out = new Map<string, Highlight>();
  for (const group of press) {
    for (const id of group) if (!out.has(id)) out.set(id, { id, held: hold.includes(id) });
  }
  for (const id of hold) if (!out.has(id)) out.set(id, { id, held: true });
  return [...out.values()];
}

/** One order badge per action, on the action's first control; none when there is only one action. */
export function badgesFor(press: string[][]): Badge[] {
  if (press.length <= 1) return [];
  const numbers = new Map<string, number[]>();
  press.forEach((group, i) => {
    const anchor = group[0];
    if (anchor) numbers.set(anchor, [...(numbers.get(anchor) ?? []), i + 1]);
  });
  return [...numbers].map(([id, nums]) => ({ id, label: nums.join(',') }));
}

export function clampStep(step: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(0, Math.floor(step)), count - 1);
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const BADGE_RADIUS_PX = 12;
const BADGE_FONT_PX = 15;

function addBadge(control: Element, label: string) {
  const svg = control.closest('svg');
  const badges = svg?.querySelector('.badges');
  if (!svg || !badges) return;
  const view = svg.viewBox.baseVal;
  const box = svg.getBoundingClientRect();
  const scale = Math.min(box.width / view.width, box.height / view.height) || 1;
  const r = Math.max(14, BADGE_RADIUS_PX / scale);
  const font = BADGE_FONT_PX / scale;
  const width = Math.max(2 * r, label.length * font * 0.62 + r);
  const cx = Number(control.getAttribute('data-cx'));
  const cy = Number(control.getAttribute('data-cy'));
  const size = Number(control.getAttribute('data-r'));
  const x = Math.min(Math.max(cx + size * 0.75, width / 2), view.width - width / 2);
  const y = Math.min(Math.max(cy - size * 0.75, r), view.height - r);

  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'badge');
  const pill = document.createElementNS(SVG_NS, 'rect');
  pill.setAttribute('x', String(x - width / 2));
  pill.setAttribute('y', String(y - r));
  pill.setAttribute('width', String(width));
  pill.setAttribute('height', String(2 * r));
  pill.setAttribute('rx', String(r));
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', String(x));
  text.setAttribute('y', String(y));
  text.setAttribute('font-size', String(font));
  text.textContent = label;
  g.append(pill, text);
  badges.append(g);
}

function applyHighlights(root: ParentNode, highlights: Highlight[], badges: Badge[]) {
  root.querySelectorAll('[data-control]').forEach((el) => {
    el.removeAttribute('data-active');
    el.removeAttribute('data-held');
  });
  root.querySelectorAll('.badges').forEach((g) => g.replaceChildren());
  for (const h of highlights) {
    root.querySelectorAll(`[data-control="${h.id}"]`).forEach((el) => {
      el.setAttribute('data-active', '');
      if (h.held) el.setAttribute('data-held', '');
    });
  }
  for (const badge of badges) {
    root.querySelectorAll(`[data-control="${badge.id}"]`).forEach((el) => addBadge(el, badge.label));
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

  // Each new step starts at the same place: just below the sticky drawing, or at the top beside it.
  const reveal = (el: HTMLElement) => {
    syncFigureHeight();
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'start' });
  };

  const render = (focus: boolean) => {
    steps.forEach((step, i) => {
      step.hidden = i !== current;
    });
    const step = steps[current];
    const press = parseGroups(step.getAttribute('data-press'));
    applyHighlights(section, highlightsFor(press, parseGroups(step.getAttribute('data-hold')).flat()), badgesFor(press));
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
  window.addEventListener('resize', () => {
    syncFigureHeight();
    render(false);
  });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-steps]').forEach(initStepper);
}
