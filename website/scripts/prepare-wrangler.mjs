import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const generatedDeployConfig = resolve(process.cwd(), '..', '.wrangler', 'deploy', 'config.json');

await rm(generatedDeployConfig, { force: true });
console.log('Wrangler environment prepared.');
