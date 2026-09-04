import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

async function linkPages() {
  const indexPath = join(PUBLIC, 'index.html');
  const streamPath = join(PUBLIC, 'stream.html');

  let index = await readFile(indexPath, 'utf8');
  let stream = await readFile(streamPath, 'utf8');

  index = index.replace(
    '<title>NEXORA - Social Media Intelligence</title>',
    '<title>NEXORA - Command Center</title>'
  );

  index = index.replace(
    /<a class="flex items-center gap-3 px-4 py-2\.5 text-white bg-primary\/20 rounded-lg border border-primary\/50 shadow-\[0_0_15px_rgba\(6,182,212,0\.2\)\] transition-all duration-200 pulse-border" href="#">\s*<span class="material-symbols-outlined text-\[20px\] text-primary" style="font-variation-settings: &quot;FILL&quot; 1;">dashboard<\/span>\s*Overview/,
    '<a class="flex items-center gap-3 px-4 py-2.5 text-white bg-primary/20 rounded-lg border border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-200 pulse-border" href="index.html">\n<span class="material-symbols-outlined text-[20px] text-primary" style="font-variation-settings: &quot;FILL&quot; 1;">dashboard</span>\n                    Overview'
  );

  index = index.replace(
    /<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-white hover:bg-white\/5 rounded-lg transition-colors duration-200" href="#">\s*<span class="material-symbols-outlined text-\[20px\]">stream<\/span>\s*Live Intelligence/,
    '<a class="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200" href="stream.html">\n<span class="material-symbols-outlined text-[20px]">stream</span>\n                    Live Intelligence'
  );

  index = index.replace(
    '<h1 class="font-headline-md text-2xl font-bold text-primary tracking-widest">NEXORA</h1>',
    '<a href="index.html" class="block hover:opacity-90 transition-opacity"><h1 class="font-headline-md text-2xl font-bold text-primary tracking-widest">NEXORA</h1></a>'
  );

  index = index.replace(
    '<span class="font-headline-sm text-headline-sm font-black text-white tracking-widest">NEXORA</span>',
    '<a href="index.html" class="font-headline-sm text-headline-sm font-black text-white tracking-widest hover:text-primary transition-colors">NEXORA</a>'
  );

  if (!index.includes('Open full stream')) {
    index = index.replace(
      '<!-- Live Intelligence Feed React Mount Point (Span 2) -->\n<div class="lg:col-span-2 h-72" id="react-live-feed-root">',
      `<!-- Live Intelligence Feed React Mount Point (Span 2) -->
<div class="lg:col-span-2 flex flex-col gap-2">
<a href="stream.html" class="self-end text-[10px] uppercase tracking-widest font-bold text-primary hover:text-white flex items-center gap-1 transition-colors group">
  Open full stream
  <span class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</a>
<div class="h-72" id="react-live-feed-root">`
    );
    index = index.replace(
      '</div>\n<!-- Emotion Snapshot & Alerts (Span 2) -->',
      '</div>\n</div>\n<!-- Emotion Snapshot & Alerts (Span 2) -->'
    );
  }

  stream = stream.replace(
    '<title>NEXORA - Live Intelligence</title>',
    '<title>NEXORA - Live Intelligence Stream</title>'
  );

  stream = stream.replace(
    /<a class="flex items-center gap-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant\/50 hover:text-primary transition-colors py-1\.5" href="#">\s*<span class="material-symbols-outlined text-xl">dashboard<\/span>\s*<span class="font-body-md">Overview<\/span>/,
    '<a class="flex items-center gap-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary transition-colors py-1.5" href="index.html">\n<span class="material-symbols-outlined text-xl">dashboard</span>\n<span class="font-body-md">Overview</span>'
  );

  stream = stream.replace(
    /<a class="flex items-center gap-3 px-4 rounded-lg text-primary font-bold border-r-2 border-primary bg-primary\/10 transition-colors pulse-border py-1\.5" href="#">\s*<span class="material-symbols-outlined text-xl" style="font-variation-settings: &quot;FILL&quot; 1;">sensors<\/span>\s*<span class="font-body-md">Live Intelligence<\/span>/,
    '<a class="flex items-center gap-3 px-4 rounded-lg text-primary font-bold border-r-2 border-primary bg-primary/10 transition-colors pulse-border py-1.5" href="stream.html">\n<span class="material-symbols-outlined text-xl" style="font-variation-settings: &quot;FILL&quot; 1;">sensors</span>\n<span class="font-body-md">Live Intelligence</span>'
  );

  stream = stream.replace(
    '<h1 class="font-headline-md text-headline-md font-black text-primary-container tracking-widest uppercase">NEXORA</h1>',
    '<a href="index.html" class="block hover:opacity-90 transition-opacity"><h1 class="font-headline-md text-headline-md font-black text-primary-container tracking-widest uppercase">NEXORA</h1></a>'
  );

  stream = stream.replace(
    '<h1 class="font-headline-sm text-headline-sm font-black text-primary tracking-widest uppercase">NEXORA</h1>',
    '<a href="index.html" class="font-headline-sm text-headline-sm font-black text-primary tracking-widest uppercase hover:opacity-90 transition-opacity">NEXORA</a>'
  );

  if (!stream.includes('Back to overview')) {
    stream = stream.replace(
      '<div class="mb-4">\n<h2 class="font-headline-lg text-headline-lg text-on-surface font-black uppercase tracking-tight">LIVE INTELLIGENCE</h2>',
      `<div class="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
<a href="index.html" class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors w-fit">
  <span class="material-symbols-outlined text-[14px]">arrow_back</span>
  Back to overview
</a>
<div>
<h2 class="font-headline-lg text-headline-lg text-on-surface font-black uppercase tracking-tight">LIVE INTELLIGENCE</h2>`
    );
    stream = stream.replace(
      'Real-time social conversations\n            </p>\n</div>',
      'Real-time social conversations\n            </p>\n</div>\n</div>'
    );
  }

  await writeFile(indexPath, index);
  await writeFile(streamPath, stream);
  console.log('Linked index.html ↔ stream.html');
}

linkPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
