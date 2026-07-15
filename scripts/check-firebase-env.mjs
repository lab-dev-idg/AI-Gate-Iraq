import 'dotenv/config';

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error('Production authentication build blocked. Missing Firebase environment variables:');
  for (const name of missing) console.error(`- ${name}`);
  process.exit(1);
}

if (process.env.VITE_FIREBASE_PROJECT_ID !== 'ai-gate-iraq') {
  console.error('VITE_FIREBASE_PROJECT_ID must equal ai-gate-iraq.');
  process.exit(1);
}

if (process.env.VITE_FIREBASE_AUTH_DOMAIN !== 'app.aigateiraq.com') {
  console.error('VITE_FIREBASE_AUTH_DOMAIN must equal app.aigateiraq.com.');
  process.exit(1);
}

console.log('Firebase production authentication environment is complete.');
