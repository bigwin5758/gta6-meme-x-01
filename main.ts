import * as fs from 'node:fs';
import * as path from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

try {
  const src = path.join(botDir, 'POST.json');
  const dst = path.join(outputDir, 'POST.json');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync(src, dst);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`error: failed to copy POST.json: ${msg}`);
  process.exit(1);
}
