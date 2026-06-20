import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const requiredFiles = [
  'public/index.html',
  'public/legal.html',
  'public/404.html',
  'public/app.js',
  'public/translations.json',
  'public/styles.css',
  'public/_headers',
  'public/robots.txt',
  'public/sitemap.xml',
  'wrangler.jsonc',
];
const failures = [];

for (const file of requiredFiles) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`Missing required file: ${file}`); }
}

const index = await readFile(resolve(root, 'public/index.html'), 'utf8');
const app = await readFile(resolve(root, 'public/app.js'), 'utf8');
const translationsRaw = await readFile(resolve(root, 'public/translations.json'), 'utf8');
const headers = await readFile(resolve(root, 'public/_headers'), 'utf8');
const sitemap = await readFile(resolve(root, 'public/sitemap.xml'), 'utf8');
const wranglerRaw = await readFile(resolve(root, 'wrangler.jsonc'), 'utf8');

let translations;
try { translations = JSON.parse(translationsRaw); }
catch (error) { failures.push(`translations.json is invalid JSON: ${error.message}`); }
try { JSON.parse(wranglerRaw); }
catch (error) { failures.push(`wrangler.jsonc is invalid JSON: ${error.message}`); }

for (const fragment of ['https://ai-gate-iraq.aigateiraq.workers.dev','rel="canonical"','name="twitter:card"','property="og:site_name"','/legal.html#privacy','/legal.html#terms','/legal.html#ai','id="menuToggle"','id="mainNav"']) {
  if (!index.includes(fragment)) failures.push(`index.html is missing: ${fragment}`);
}

if (/placeholder|lorem ipsum|example\.com/i.test(index)) failures.push('index.html contains placeholder content.');
if (!app.includes("'use strict'")) failures.push('app.js is missing strict mode.');
if (!app.includes('prefers-reduced-motion')) failures.push('app.js is missing reduced-motion support.');
if (!app.includes('interfaceTranslations')) failures.push('app.js is missing interface translations.');
if (!headers.includes('Content-Security-Policy')) failures.push('_headers is missing CSP.');
if (!headers.includes('Strict-Transport-Security')) failures.push('_headers is missing HSTS.');
if (!sitemap.includes('https://ai-gate-iraq-website.aigateiraq.workers.dev/legal.html')) failures.push('sitemap.xml is missing legal.html.');

if (translations) {
  for (const lang of ['ar', 'en']) {
    if (!translations[lang] || typeof translations[lang] !== 'object') failures.push(`Missing ${lang} translations.`);
  }
  const interfaceKeys = new Set(['a11y.skip','footer.privacy','footer.terms','footer.ai','footer.about','footer.contact']);
  const keys = [...index.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
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
