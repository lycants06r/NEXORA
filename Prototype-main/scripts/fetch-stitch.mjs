import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

async function resolveApiKey() {
  if (process.env.STITCH_API_KEY) return process.env.STITCH_API_KEY;
  const cfgPath = join(homedir(), '.gemini', 'config', 'mcp_config.json');
  try {
    const raw = await readFile(cfgPath, 'utf8');
    const cfg = JSON.parse(raw);
    const header = cfg?.mcpServers?.StitchMCP?.args?.find((a) =>
      String(a).startsWith('X-Goog-Api-Key:')
    );
    if (header) return String(header).replace(/^X-Goog-Api-Key:\s*/, '');
  } catch {
    // fall through
  }
  throw new Error('Set STITCH_API_KEY or configure Stitch MCP in ~/.gemini/config/mcp_config.json');
}

process.env.STITCH_API_KEY ??= await resolveApiKey();

const { stitch } = await import('@google/stitch-sdk');

const PROJECT_ID = '11314852800022350781';
const SCREENS = [
  {
    screenId: '9224098d660f4472b756f17dbcba6bb1',
    slug: 'index',
    title: 'Nexora - Live Intelligence Command Center',
    screenshot: 'screenshot-command-center.png',
  },
  {
    screenId: '777038c694cc46689f852e772b604b70',
    slug: 'stream',
    title: 'Nexora - Live Intelligence Stream',
    screenshot: 'screenshot-stream.png',
  },
];

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const ASSETS = join(PUBLIC, 'assets');

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return dest;
}

const project = stitch.project(PROJECT_ID);
const meta = [];

for (const entry of SCREENS) {
  console.log(`\nFetching: ${entry.title}`);
  const screen = await project.getScreen(entry.screenId);
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();

  const htmlPath = join(PUBLIC, `${entry.slug}.html`);
  const imagePath = join(ASSETS, entry.screenshot);

  console.log('  HTML...');
  await download(htmlUrl, htmlPath);
  console.log('  Screenshot...');
  await download(imageUrl, imagePath);

  meta.push({
    projectId: PROJECT_ID,
    screenId: entry.screenId,
    title: entry.title,
    slug: entry.slug,
    htmlPath,
    imagePath,
    htmlUrl,
    imageUrl,
  });
}

await writeFile(join(ROOT, 'stitch-meta.json'), JSON.stringify(meta, null, 2));
console.log('\nDone.');

await import('./link-pages.mjs');
