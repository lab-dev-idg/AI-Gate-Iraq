import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scanRoots = ['server.ts', '.env.example', 'src', 'docs'];
const skipDirs = new Set(['node_modules', 'dist', '.git']);

const forbidden = [
  { pattern: /gemini-3\.5-flash/g, reason: 'Gemini model must stay gemini-2.5-flash.' },
  { pattern: /GEMINI_MODEL\s*===/g, reason: 'Do not hard-convert GEMINI_MODEL.' },
  { pattern: /Convert\s+gemini-2\.5-flash/gi, reason: 'Do not restore model conversion comments.' },
  { pattern: /recommended text model/gi, reason: 'Do not describe an override model as recommended.' },
  { pattern: /gen-lang-client/gi, reason: 'Legacy AI Studio Firebase project must not return.' },
  { pattern: /ai-studio-[a-z0-9-]+/gi, reason: 'Legacy AI Studio Firestore database must not return.' },
  { pattern: /firebase-applet-config/gi, reason: 'Legacy AI Studio Firebase applet config must not return.' },
  { pattern: /0647247129/g, reason: 'Legacy Google Cloud project number must not return.' },
  { pattern: /government-owned|government platform|official government|state system|ministry system|sovereign platform|federal platform|government command|customs authority system|law enforcement command|public-sector command/gi, reason: 'AI Gate Iraq must remain a private commercial service platform.' },
  { pattern: /پلاتفۆرمی\s+حکومی|سیستەمی\s+حکومی|دەزگای\s+حکومی|سەر\s+بە\s+حکومەت|سەر\s+بە\s+وەزارەت/gi, reason: 'Kurdish copy must not imply government ownership.' },
  { pattern: /منصة\s+حكومية|نظام\s+حكومي|تابعة\s+للحكومة|تابعة\s+لوزارة/gi, reason: 'Arabic copy must not imply government ownership.' },
];

function collectFiles(target) {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];
  const files = [];
  for (const entry of fs.readdirSync(absolute)) {
    const child = path.join(absolute, entry);
    const childStat = fs.statSync(child);
    if (childStat.isDirectory()) {
      if (!skipDirs.has(entry)) files.push(...collectFiles(path.relative(root, child)));
    } else if (/\.(ts|tsx|js|jsx|mjs|json|md|env|example)$/.test(entry) || entry === '.env.example') {
      files.push(child);
    }
  }
  return files;
}

const files = scanRoots.flatMap(collectFiles);
const failures = [];

for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const rule of forbidden) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(text)) !== null) {
      const line = text.slice(0, match.index).split('\n').length;
      failures.push(`${rel}:${line} — ${rule.reason} (${match[0]})`);
    }
  }
}

if (failures.length > 0) {
  console.error('\nProject guard failed. Fix these blocked patterns before build:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nPermanent rules: private commercial ownership, no legacy AI Studio Firebase, no Gemini model override.\n');
  process.exit(1);
}

console.log('Project guard passed: private positioning, Firebase config, and Gemini model rules are clean.');
