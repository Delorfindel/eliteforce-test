#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_PORT = 8086;
const DOCS_ROOT = path.resolve(process.cwd(), 'Docs/swagger');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function parsePort(argv) {
  let port = process.env.SWAGGER_PORT ? Number(process.env.SWAGGER_PORT) : DEFAULT_PORT;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage:
  node scripts/supabase-swagger/serve-swagger.mjs [--port <number>]

Options:
  --port <number>  Port to serve Swagger UI (default: ${DEFAULT_PORT})
  --help           Show this help message`);
      process.exit(0);
    }

    if (arg === '--port') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --port');
      }

      port = Number(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }

  return port;
}

function verifyRequiredFiles() {
  const indexPath = path.join(DOCS_ROOT, 'index.html');
  const openApiPath = path.join(DOCS_ROOT, 'supabase-openapi.json');

  if (!existsSync(indexPath)) {
    throw new Error(`Missing Swagger UI file: ${indexPath}`);
  }

  if (!existsSync(openApiPath)) {
    throw new Error(
      `Missing OpenAPI spec: ${openApiPath}\nRun \`npm run supabase:openapi\` first.`,
    );
  }
}

function resolveFilePath(requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const relativePath = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/u, '');
  const absolutePath = path.normalize(path.join(DOCS_ROOT, relativePath));

  if (absolutePath !== DOCS_ROOT && !absolutePath.startsWith(`${DOCS_ROOT}${path.sep}`)) {
    return null;
  }

  return absolutePath;
}

async function sendFile(res, absoluteFilePath) {
  const fileStat = await stat(absoluteFilePath);
  if (fileStat.isDirectory()) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  const extension = path.extname(absoluteFilePath).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';
  const body = await readFile(absoluteFilePath);

  res.writeHead(200, { 'Content-Type': contentType });
  res.end(body);
}

async function main() {
  const port = parsePort(process.argv.slice(2));
  verifyRequiredFiles();

  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
      const absoluteFilePath = resolveFilePath(requestUrl.pathname);

      if (!absoluteFilePath) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      await sendFile(res, absoluteFilePath);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal server error');
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Swagger UI running at http://127.0.0.1:${port}`);
    console.log('Press Ctrl+C to stop.');
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
