#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_OUTPUT_PATH = 'Docs/swagger/supabase-openapi.json';
const DOTENV_FILES = ['.env', 'mobile/.env'];

function printHelp() {
  console.log(`Usage:
  node scripts/supabase-swagger/generate-openapi.mjs [--output <path>]

Options:
  --output <path>  Output path for generated OpenAPI JSON (default: ${DEFAULT_OUTPUT_PATH})
  --help           Show this help message`);
}

function parseArgs(argv) {
  let outputPath = DEFAULT_OUTPUT_PATH;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--output') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --output');
      }
      outputPath = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { outputPath };
}

function stripWrappingQuotes(value) {
  if (!value) {
    return value;
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseEnvLines(content) {
  const values = {};
  const lines = content.split(/\r?\n/u);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalIndex = trimmed.indexOf('=');
    if (equalIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = stripWrappingQuotes(trimmed.slice(equalIndex + 1));
    values[key] = value;
  }

  return values;
}

async function loadDotenvValues() {
  const values = {};

  for (const relativeFile of DOTENV_FILES) {
    const absoluteFile = path.resolve(process.cwd(), relativeFile);
    if (!existsSync(absoluteFile)) {
      continue;
    }

    const content = await readFile(absoluteFile, 'utf8');
    Object.assign(values, parseEnvLines(content));
  }

  return values;
}

function loadSupabaseStatusValues() {
  try {
    const stdout = execFileSync('npx', ['supabase', 'status', '-o', 'env'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return {
      values: parseEnvLines(stdout),
      error: null,
    };
  } catch (error) {
    const stderr =
      typeof error?.stderr === 'string'
        ? error.stderr
        : Buffer.isBuffer(error?.stderr)
          ? error.stderr.toString('utf8')
          : null;

    return {
      values: {},
      error: stderr?.trim() || error.message,
    };
  }
}

function pickFirstNonEmpty(values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function trimTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function resolveRestUrl(env) {
  const explicitRestUrl = pickFirstNonEmpty([
    env.SUPABASE_REST_URL,
    env.REST_URL,
  ]);
  if (explicitRestUrl) {
    return trimTrailingSlash(explicitRestUrl);
  }

  const baseApiUrl = pickFirstNonEmpty([
    env.SUPABASE_API_URL,
    env.API_URL,
    env.SUPABASE_URL,
    env.EXPO_PUBLIC_SUPABASE_URL,
  ]);

  if (!baseApiUrl) {
    return null;
  }

  const normalizedBase = trimTrailingSlash(baseApiUrl);
  if (normalizedBase.endsWith('/rest/v1')) {
    return normalizedBase;
  }

  return `${normalizedBase}/rest/v1`;
}

function resolveAnonKey(env) {
  return pickFirstNonEmpty([
    env.SUPABASE_ANON_KEY,
    env.ANON_KEY,
    env.SUPABASE_PUBLISHABLE_KEY,
    env.PUBLISHABLE_KEY,
    env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ]);
}

async function fetchOpenApiDocument(restUrl, anonKey) {
  const endpoint = `${trimTrailingSlash(restUrl)}/`;

  let response;
  try {
    response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/openapi+json, application/json',
      },
    });
  } catch (error) {
    throw new Error(
      `Unable to reach Supabase REST endpoint: ${endpoint}\n${error.message}`,
    );
  }

  const rawBody = await response.text();
  if (!response.ok) {
    const snippet = rawBody.slice(0, 500);
    throw new Error(
      `Supabase returned ${response.status} ${response.statusText} while fetching OpenAPI.\n${snippet}`,
    );
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error(
      `Supabase response is not valid JSON. First bytes:\n${rawBody.slice(0, 500)}`,
    );
  }
}

async function main() {
  const { outputPath } = parseArgs(process.argv.slice(2));
  const dotenvValues = await loadDotenvValues();
  const localEnv = {
    ...dotenvValues,
    ...process.env,
  };

  let status = { values: {}, error: null };
  let mergedEnv = localEnv;

  if (!resolveRestUrl(mergedEnv) || !resolveAnonKey(mergedEnv)) {
    status = loadSupabaseStatusValues();
    mergedEnv = {
      ...status.values,
      ...localEnv,
    };
  }

  const restUrl = resolveRestUrl(mergedEnv);
  const anonKey = resolveAnonKey(mergedEnv);

  if (!restUrl || !anonKey) {
    const details = status.error
      ? `\nSupabase status fallback failed:\n${status.error}`
      : '';

    throw new Error(
      `Cannot resolve Supabase REST URL and anon/publishable key.
Provide one of:
- SUPABASE_REST_URL or SUPABASE_URL / EXPO_PUBLIC_SUPABASE_URL
- SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY / EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

You can also run \`npm run supabase:start\` to let the script auto-detect values from \`supabase status -o env\`.${details}`,
    );
  }

  const openApi = await fetchOpenApiDocument(restUrl, anonKey);
  if (!openApi || typeof openApi !== 'object' || Array.isArray(openApi)) {
    throw new Error('Invalid OpenAPI payload received from Supabase.');
  }

  const finalDocument = {
    ...openApi,
    info: {
      ...(openApi.info ?? {}),
      description: openApi.info?.description
        ? `${openApi.info.description}\n\nGenerated via scripts/supabase-swagger/generate-openapi.mjs`
        : 'Generated via scripts/supabase-swagger/generate-openapi.mjs',
    },
  };

  const absoluteOutputPath = path.resolve(process.cwd(), outputPath);
  await mkdir(path.dirname(absoluteOutputPath), { recursive: true });
  await writeFile(absoluteOutputPath, `${JSON.stringify(finalDocument, null, 2)}\n`, 'utf8');

  console.log(`OpenAPI spec generated: ${absoluteOutputPath}`);
  console.log(`Source endpoint: ${trimTrailingSlash(restUrl)}/`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
