import { access, cp, mkdir, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn } from 'node:child_process';

const target = '.firebase-hosting/platform';
const buildRoots = ['dist/client', 'dist'];

const pathExists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const findProductionBuild = async () => {
  for (const root of buildRoots) {
    const hasIndex = await pathExists(`${root}/index.html`);
    const hasAssets = await pathExists(`${root}/assets`);

    if (hasIndex && hasAssets) {
      return root;
    }
  }

  return null;
};

const runProductionBuild = async () => {
  await new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(command, ['run', 'build'], {
      stdio: 'inherit',
      env: process.env,
    });

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `Production build was terminated by signal ${signal}.`
            : `Production build failed with exit code ${code ?? 'unknown'}.`,
        ),
      );
    });
  });
};

const ensureProductionBuild = async () => {
  const existingBuild = await findProductionBuild();
  if (existingBuild) return existingBuild;

  console.warn(
    `Production build artifacts were not found in: ${buildRoots.join(', ')}. Rebuilding before Firebase packaging.`,
  );

  await runProductionBuild();

  const rebuilt = await findProductionBuild();
  if (rebuilt) return rebuilt;

  throw new Error(
    `Production build completed without index.html and assets in: ${buildRoots.join(', ')}`,
  );
};

const source = await ensureProductionBuild();

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

await cp(`${source}/index.html`, `${target}/index.html`);
await cp(`${source}/assets`, `${target}/assets`, { recursive: true });
await cp('public/site.webmanifest', `${target}/site.webmanifest`);

console.log(`Prepared Firebase platform hosting package from ${source}.`);
