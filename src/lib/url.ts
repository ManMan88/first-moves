export function joinBase(base: string, path: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${path.replace(/^\/+/, '')}`;
}

export function url(path = ''): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
