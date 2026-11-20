import * as fs from 'node:fs';
import * as path from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

try {
  const src = path.join(botDir, 'POST.json');
  const dst = path.join(outputDir, 'POST.json');

  // Validate POST.json before copying anything.
  let raw: string;
  try {
    raw = fs.readFileSync(src, 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    fail(`cannot read POST.json at ${src}: ${msg}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw!);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    fail(`POST.json is not valid JSON: ${msg}`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('POST.json must be a JSON object with a "url" field');
  }

  const url = (parsed as Record<string, unknown>).url;
  if (typeof url !== 'string' || url.length === 0) {
    fail('POST.json "url" must be a non-empty string');
  }

  const isX = url.startsWith('https://x.com/') || url.startsWith('https://twitter.com/');
  if (!isX || !url.includes('/status/')) {
    fail(`POST.json "url" does not look like an X post URL: ${url}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync(src, dst);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`error: failed to copy POST.json: ${msg}`);
  process.exit(1);
}
