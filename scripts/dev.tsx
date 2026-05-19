#!/usr/bin/env tsx
// Local dev server: fast rebuild on every change to src/, plus a static
// HTTP server serving web/. Skips the PDF + PNG rasterization steps so
// the inner loop stays under a second.
//
// Usage:   npm run dev
// Open:    http://localhost:5173 (configurable via PORT env var)

import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {watch} from 'node:fs';
import path from 'node:path';
import {build} from './build';

const root = process.cwd();
const webDir = path.join(root, 'web');
const port = Number(process.env.PORT ?? 5173);

const mime: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function safeJoin(base: string, rel: string): string | null {
  const resolved = path.resolve(base, rel.replace(/^\/+/, ''));
  if (!resolved.startsWith(base)) return null; // path traversal guard
  return resolved;
}

const server = createServer(async (req, res) => {
  const url = req.url ?? '/';
  const cleanUrl = url.split('?')[0];
  let candidate = safeJoin(webDir, cleanUrl);
  if (!candidate) {
    res.statusCode = 403;
    res.end('forbidden');
    return;
  }
  try {
    const s = await stat(candidate);
    if (s.isDirectory()) candidate = path.join(candidate, 'index.html');
    const body = await readFile(candidate);
    const ext = path.extname(candidate).toLowerCase();
    res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

let rebuilding = false;
let pending = false;
function rebuild(reason: string) {
  if (rebuilding) {
    pending = true;
    return;
  }
  rebuilding = true;
  const t0 = Date.now();
  try {
    process.stdout.write(`↻ rebuild (${reason})… `);
    build({skipPdf: true});
    console.log(`${Date.now() - t0}ms`);
  } catch (err) {
    console.error('\n✗ build failed:', err instanceof Error ? err.message : err);
  } finally {
    rebuilding = false;
    if (pending) {
      pending = false;
      // coalesce: one more pass to catch changes that arrived mid-build
      setTimeout(() => rebuild('coalesced'), 50);
    }
  }
}

// Initial build then start watching.
rebuild('initial');

const watchTargets = ['src', 'public', 'scripts'];
let debounce: NodeJS.Timeout | null = null;
for (const dir of watchTargets) {
  const abs = path.join(root, dir);
  try {
    watch(abs, {recursive: true}, (_event, filename) => {
      if (!filename) return;
      if (filename.toString().endsWith('~')) return; // editor swap files
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => rebuild(`${dir}/${filename}`), 80);
    });
  } catch (err) {
    console.warn(`watch ${dir} unavailable:`, err instanceof Error ? err.message : err);
  }
}

server.listen(port, () => {
  console.log(`\n  dev server  →  http://localhost:${port}\n`);
});
