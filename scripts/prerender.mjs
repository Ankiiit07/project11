// Pre-renders every public page after `vite build`, so search engines (and the
// first paint) get real HTML: the H1, copy, prices and structured data, instead
// of an empty <div id="root">. React then renders over it as usual.
//
// - dist/app.html keeps the empty app shell; Netlify serves it for every other
//   route (cart, checkout, account...), so those pages never show stale HTML.
// - Pages are captured with "reduce motion" on, so text is in its final state.
// - If Chrome can't start, the build still succeeds as a normal single-page app.
//
// Local runs can point at an installed Chrome with PRERENDER_CHROME=/path/to/chrome.
import http from 'node:http';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const API_ORIGIN = process.env.PRERENDER_API_ORIGIN || 'https://cafeatonce.com';

// The pages to render are the ones in the sitemap the build just wrote (src/utils/sitemapGenerator.ts)
const SITE = 'https://cafeatonce.com';
const paths = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/&amp;/g, '&'))
  .filter((url) => url.startsWith(SITE))
  .map((url) => url.slice(SITE.length) || '/');

// The untouched shell, before index.html is replaced by the pre-rendered home page
copyFileSync(join(DIST, 'index.html'), join(DIST, 'app.html'));
const template = readFileSync(join(DIST, 'app.html'), 'utf8');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

// Serves dist like Netlify does; API calls go to the live site so reviews and ratings are real
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/.netlify/functions/')) {
    try {
      const upstream = await fetch(API_ORIGIN + url.pathname + url.search, { signal: AbortSignal.timeout(8000) });
      res.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/json' });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502).end();
    }
    return;
  }
  const file = normalize(join(DIST, decodeURIComponent(url.pathname)));
  const target = file.startsWith(DIST) && existsSync(file) && extname(file) ? file : join(DIST, 'app.html');
  res.writeHead(200, { 'content-type': TYPES[extname(target)] || 'application/octet-stream' });
  res.end(readFileSync(target));
});

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Swap the shell's default title and tags for the page's own (react-helmet marks them data-rh)
const buildHtml = ({ root, title, head }) => {
  let html = template;
  if (title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  for (const tag of head) {
    const meta = tag.match(/^<meta (?:[^>]*\s)?(name|property)="([^"]+)"/);
    if (meta) html = html.replace(new RegExp(`\\s*<meta\\s+${meta[1]}="${escapeRe(meta[2])}"[^>]*>`, 'g'), '');
    if (/^<link [^>]*rel="canonical"/.test(tag)) html = html.replace(/\s*<link\s+rel="canonical"[^>]*>/g, '');
  }
  // The page's own structured data includes the Organization block, so drop the shell's copy
  if (head.some((t) => t.includes('application/ld+json'))) {
    html = html.replace(/\s*<!-- Organization Schema -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
  }
  html = html.replace('</head>', `    ${head.join('\n    ')}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${root}</div>`);
};

const capture = async (browser, origin, path) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setRequestInterception(true);
  // Only our own files: no analytics hits, service worker, payment or auth scripts
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith(origin) && !u.endsWith('/sw.js')) r.continue();
    else if (u.startsWith('data:')) r.continue();
    else r.abort();
  });
  try {
    await page.goto(origin + path, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await page
      .waitForFunction(() => document.querySelector('#root')?.children.length && !document.querySelector('[aria-label="Loading page"]'), { timeout: 10000 })
      .catch(() => {});
    // Scroll through once so sections that appear on scroll are in their visible state
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    // react-helmet writes the page's title and tags a frame after render
    await page.waitForFunction(() => document.head.querySelector('[data-rh]'), { timeout: 8000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));
    return await page.evaluate(() => ({
      root: document.querySelector('#root').innerHTML,
      title: document.title,
      head: [...document.head.querySelectorAll('[data-rh]')].map((el) => el.outerHTML),
      h1: document.querySelectorAll('#root h1').length,
    }));
  } finally {
    await page.close();
  }
};

const run = async () => {
  const { default: puppeteer } = await import('puppeteer');
  await new Promise((r) => server.listen(0, r));
  const origin = `http://localhost:${server.address().port}`;
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PRERENDER_CHROME || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const noH1 = [];
  const noTags = [];
  let done = 0;
  try {
    // One page at a time: Chrome holds back animation frames in background tabs,
    // and react-helmet needs one to write the page's title and tags
    for (const path of paths) {
      try {
        const result = await capture(browser, origin, path);
        if (!result.root.trim()) throw new Error('empty page');
        if (!result.h1) noH1.push(path);
        if (!result.head.length) noTags.push(path);
        const dir = join(DIST, decodeURIComponent(path));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), buildHtml(result));
        done++;
      } catch (e) {
        console.warn(`prerender: skipped ${path} (${e.message})`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`prerender: ${done} of ${paths.length} pages written`);
  if (noH1.length) console.warn(`prerender: no <h1> on ${noH1.join(', ')}`);
  if (noTags.length) console.warn(`prerender: no page title or meta tags on ${noTags.join(', ')}`);
};

run().catch((e) => {
  server.close();
  console.warn(`prerender: skipped, the site ships as a plain single-page app (${e.message})`);
});
