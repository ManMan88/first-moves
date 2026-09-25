function play(container: HTMLElement) {
  const id = container.dataset.video;
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
  frame.title = container.dataset.videoTitle ?? 'Ableton video';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  container.querySelector('[data-video-play]')?.replaceWith(frame);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-video]').forEach((container) => {
    container.querySelector('[data-video-play]')?.addEventListener('click', () => play(container), { once: true });
  });
}
