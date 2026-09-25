const GROUPED: [RegExp, string][] = [
  [/^pad-/, 'pads'],
  [/^step-/, 'steps'],
  [/^encoder-/, 'encoders'],
  [/^track-/, 'tracks'],
];

export function entryFor(controlId: string): string {
  return GROUPED.find(([pattern]) => pattern.test(controlId))?.[1] ?? controlId;
}

function select(control: Element) {
  const id = control.getAttribute('data-control') ?? '';
  document.querySelectorAll('[data-control][data-active]').forEach((el) => el.removeAttribute('data-active'));
  control.setAttribute('data-active', '');

  document.querySelectorAll('.control-entry.is-current').forEach((el) => {
    el.classList.remove('is-current');
    el.querySelector<HTMLElement>('[data-picked]')?.setAttribute('hidden', '');
  });
  const entryId = entryFor(id);
  const entry = document.getElementById(`control-${entryId}`);
  if (!entry) return;
  entry.classList.add('is-current');
  if (entryId !== id) {
    const picked = entry.querySelector<HTMLElement>('[data-picked]');
    if (picked) {
      picked.textContent = `You picked: ${control.querySelector('title')?.textContent ?? id}`;
      picked.hidden = false;
    }
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  entry.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('.move-diagram.is-interactive [data-control]').forEach((control) => {
    control.addEventListener('click', () => select(control));
    control.addEventListener('keydown', (event) => {
      const key = (event as KeyboardEvent).key;
      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        select(control);
      }
    });
  });
}
