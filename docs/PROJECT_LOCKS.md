# AI Gate Iraq — Project Locks

This file records permanent project constraints.

## Ownership and positioning

AI Gate Iraq is a private commercial service platform for business, trade, logistics, procurement, cost estimation, market summaries, and customer intake.

Use language such as:

- private business platform
- commercial service gateway
- AI business assistant
- logistics and trade support platform
- SaaS platform for businesses in Iraq
- advisory and workflow support system

## Model configuration

The runtime model must respect the environment variable:

```env
GEMINI_MODEL=gemini-2.5-flash
```

Do not rewrite this model value in server code.

## Firebase configuration

The application must read Firebase runtime configuration from `VITE_FIREBASE_*` environment variables.

Required live project:

```env
VITE_FIREBASE_PROJECT_ID=ai-gate-iraq
VITE_FIREBASE_AUTH_DOMAIN=ai-gate-iraq.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=ai-gate-iraq.firebasestorage.app
```

Do not restore old generated Firebase applet configuration files.

## Guard

Run this before deployment:

```bash
node scripts/check-project-guard.mjs
npm run lint
npm run build
```
