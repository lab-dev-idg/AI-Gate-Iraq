import { access, cp, mkdir, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn } from 'node:child_process';

const target = '.firebase-hosting/platform';
const requiredBuildPaths = ['dist/index.html', 'dist/assets'];

const pathExists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const ensureProductionBuild = async () => {
  const missingPaths = [];

  for (const path of requiredBuildPaths) {
    if (!(await pathExists(path))) {
      missingPaths.push(path);
    }
  }

  if (missingPaths.length === 0) return;

  console.warn(
    `Production build artifacts are missing (${missingPaths.join(', ')}). Rebuilding before Firebase packaging.`,
  );

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

  for (const path of requiredBuildPaths) {
    if (!(await pathExists(path))) {
      throw new Error(`Production build completed without required artifact: ${path}`);
    }
  }
};

await ensureProductionBuild();

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

await cp('dist/index.html', `${target}/index.html`);
await cp('dist/assets', `${target}/assets`, { recursive: true });
await cp('public/site.webmanifest', `${target}/site.webmanifest`);

console.log('Prepared Firebase platform hosting package.');
