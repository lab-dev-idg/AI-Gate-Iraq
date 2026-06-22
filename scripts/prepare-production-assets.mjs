import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://aigateiraq.com').replace(/\/$/, '');

await mkdir(publicDir, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;

await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Prepared production assets for ${baseUrl}`);
