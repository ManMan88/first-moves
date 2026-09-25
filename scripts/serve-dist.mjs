// Serves the built site from dist/ under the /first-moves/ base path, like GitHub Pages does.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const BASE = '/first-moves/';
const ROOT = join(process.cwd(), 'dist');
const PORT = Number(process.env.PORT ?? 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
};

function resolveFile(pathname) {
  const rel = normalize(decodeURIComponent(pathname.slice(BASE.length))).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  return existsSync(file) ? file : null;
}

function send(res, status, file) {
  res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === BASE.slice(0, -1)) {
    res.writeHead(301, { location: BASE });
    return res.end();
  }
  const file = pathname.startsWith(BASE) ? resolveFile(pathname) : null;
  if (file) return send(res, 200, file);
  const notFound = join(ROOT, '404.html');
  if (existsSync(notFound)) return send(res, 404, notFound);
  res.writeHead(404);
  res.end('Not found');
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Serving dist/ at http://localhost:${PORT}${BASE}`);
});
