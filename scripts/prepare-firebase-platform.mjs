import { cp, mkdir, rm } from 'node:fs/promises';

const target = '.firebase-hosting/platform';

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

await cp('dist/index.html', `${target}/index.html`);
await cp('dist/assets', `${target}/assets`, { recursive: true });
await cp('public/site.webmanifest', `${target}/site.webmanifest`);

console.log('Prepared Firebase platform hosting package.');
