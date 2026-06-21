import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const publicRoot = resolve(root, 'public');
const requiredFiles = [
  'public/index.html',
  'public/legal.html',
  'public/404.html',
  'public/app.js',
  'public/phase1-enhancements.js',
  'public/translations.json',
  'public/styles.css',
  'public/styles/responsive.css',
  'public/styles/smart-hero.css',
  'public/styles/smart-hero-v2.css',
  'public/styles/smart-hero-final.css',
  'public/styles/phase1-intelligence.css',
  'public/_headers',
  'public/robots.txt',
  'public/sitemap.xml',
  'wrangler.jsonc',
  'package.json',
  'scripts/prepare-wrangler.mjs',
];
const failures = [];

for (const file of requiredFiles) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`Missing required file: ${file}`); }
}

const index = await readFile(resolve(publicRoot, 'index.html'), 'utf8');
const app = await readFile(resolve(publicRoot, 'app.js'), 'utf8');
const translationsRaw = await readFile(resolve(publicRoot, 'translations.json'), 'utf8');
const headers = await readFile(resolve(publicRoot, '_headers'), 'utf8');
const sitemap = await readFile(resolve(publicRoot, 'sitemap.xml'), 'utf8');
const responsive = await readFile(resolve(publicRoot, 'styles/responsive.css'), 'utf8');
const wranglerRaw = await readFile(resolve(root, 'wrangler.jsonc'), 'utf8');
const packageRaw = await readFile(resolve(root, 'package.json'), 'utf8');

let translations;
let wrangler;
let packageJson;
try { translations = JSON.parse(translationsRaw); }
catch (error) { failures.push(`translations.json is invalid JSON: ${error.message}`); }
try { wrangler = JSON.parse(wranglerRaw); }
catch (error) { failures.push(`wrangler.jsonc is invalid JSON: ${error.message}`); }
try { packageJson = JSON.parse(packageRaw); }
catch (error) { failures.push(`package.json is invalid JSON: ${error.message}`); }

for (const fragment of [
  'https://ai-gate-iraq.aigateiraq.workers.dev',
  'rel="canonical"',
  'name="twitter:card"',
  'property="og:site_name"',
  '/legal.html#privacy',
  '/legal.html#terms',
  '/legal.html#ai',
  'id="menuToggle"',
  'id="mainNav"',
  'id="pilot-apply"',
  'href="#pilot-apply"',
]) {
  if (!index.includes(fragment)) failures.push(`index.html is missing: ${fragment}`);
}

if (/lorem ipsum|example\.com|\bTODO\b|\bTBD\b/i.test(index)) failures.push('index.html contains unfinished or placeholder content.');
if (!app.includes("'use strict'")) failures.push('app.js is missing strict mode.');
if (!app.includes('prefers-reduced-motion')) failures.push('app.js is missing reduced-motion support.');
if (!app.includes('interfaceTranslations')) failures.push('app.js is missing interface translations.');
if (!headers.includes('Content-Security-Policy')) failures.push('_headers is missing CSP.');
if (!headers.includes('Strict-Transport-Security')) failures.push('_headers is missing HSTS.');
if (!sitemap.includes('https://ai-gate-iraq-website.aigateiraq.workers.dev/legal.html')) failures.push('sitemap.xml is missing legal.html.');

const ids = new Set([...index.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const hrefs = [...index.matchAll(/<a\b[^>]*\shref="([^"]+)"[^>]*>/g)].map((match) => match[1]);
for (const href of hrefs) {
  if (href.startsWith('#')) {
    const id = href.slice(1);
    if (id && !ids.has(id)) failures.push(`Broken internal anchor: ${href}`);
    continue;
  }
  if (href.startsWith('/')) {
    const pathname = href.split(/[?#]/)[0];
    if (pathname === '/') continue;
    try { await access(resolve(publicRoot, pathname.slice(1))); }
    catch { failures.push(`Broken local link: ${href}`); }
  }
}

const blankLinks = [...index.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)].map((match) => match[1]);
for (const attributes of blankLinks) {
  if (!/rel="[^"]*noopener[^"]*"/.test(attributes)) failures.push('A target="_blank" link is missing rel="noopener".');
}

const platformUrl = 'https://ai-gate-iraq.aigateiraq.workers.dev';
const platformCtas = hrefs.filter((href) => href === platformUrl);
if (platformCtas.length < 3) failures.push('Expected at least three live platform CTAs.');

for (const breakpoint of ['900px', '640px']) {
  if (!responsive.includes(breakpoint)) failures.push(`responsive.css is missing breakpoint: ${breakpoint}`);
}

if (wrangler?.assets?.directory !== './public') failures.push('Wrangler assets.directory must be ./public.');
if (!packageJson?.scripts?.dev?.includes('--config wrangler.jsonc')) failures.push('Website dev script must use the explicit Wrangler config.');
if (!packageJson?.scripts?.deploy?.includes('--config wrangler.jsonc')) failures.push('Website deploy script must use the explicit Wrangler config.');
if (!packageJson?.scripts?.dev?.includes('prepare:wrangler')) failures.push('Website dev script must prepare the Wrangler environment.');

if (translations) {
  for (const lang of ['ar', 'en']) {
    if (!translations[lang] || typeof translations[lang] !== 'object') failures.push(`Missing ${lang} translations.`);
  }
  const interfaceKeys = new Set(['a11y.skip','footer.privacy','footer.terms','footer.ai','footer.about','footer.contact']);
  const keys = [...new Set([...index.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]))];
  for (const lang of ['ar', 'en']) {
    for (const key of keys) {
      if (!interfaceKeys.has(key) && !translations?.[lang]?.[key]) failures.push(`Missing ${lang} translation: ${key}`);
    }
  }
}

if (failures.length) {
  console.error('\nWebsite validation failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Website validation passed.');
