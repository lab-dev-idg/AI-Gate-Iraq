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
VITE_FIREBASE_AUTH_DOMAIN=app.aigateiraq.com
VITE_FIREBASE_STORAGE_BUCKET=ai-gate-iraq.firebasestorage.app
```

Do not restore old generated Firebase applet configuration files.

## Production authentication lock

The verified Google sign-in configuration is locked to:

```text
Firebase project: ai-gate-iraq
Production auth domain: app.aigateiraq.com
Firebase Web App ID: 1:43659568946:web:40a38e772e2c1a23a1192b
Google OAuth client ID: 43659568946-9kd2183m3q9mpp62r958bsk9mfrkdbps.apps.googleusercontent.com
Custom redirect URI: https://app.aigateiraq.com/__/auth/handler
Firebase redirect URI: https://ai-gate-iraq.firebaseapp.com/__/auth/handler
Stable commit: ae6b1c610ead4ad8f8a078a514303b64a1a5fed6
Rollback branch: checkpoint/google-login-stable-2026-07-15
```

Desktop Google authentication uses a popup. Mobile Google authentication uses the same-site redirect flow and must process the redirect result after returning to the platform. The platform Content Security Policy must continue to allow the narrowly scoped Google authentication script origins `https://apis.google.com` and `https://accounts.google.com`.

Do not restore the cross-site redirect fallback, switch the production auth domain back to `firebaseapp.com`, remove either authorized redirect URI, or remove the Google authentication CSP origins without a verified replacement flow and a new rollback point.

## Subscription entitlement lock

The initial commercial access model is locked to Firestore-backed entitlements:

```text
Free AI question limit: 3
Entitlement collection: subscriptions/{uid}
Usage collection: usageCounters/{uid}
Activation request collection: subscriptionRequests/{uid}
Activation mode: manual admin approval
```

Only authorized `owner` or `admin` accounts may create, renew, cancel, or otherwise modify a subscription. Users may read only their own entitlement and usage records. Do not restore `localStorage` as the authoritative trial counter, and do not mark a payment as successful from browser code. Automated payments require a trusted webhook and a new security review.

## Production R2 storage lock

The verified production Cloudflare R2 runtime is locked to:

```text
Worker: ai-gate-iraq
Worker entry: src/cloudflare-worker.ts
Binding: STORAGE_BUCKET
Bucket: ai-gate-iraq-storage
Health endpoint: /api/storage-health
Stable commit: 7b5f5e456ec580372e70ba71190c70e37c142df5
Rollback branch: release/r2-stable-2026-07-14
```

The health endpoint must return HTTP 200 with `status: ok` before a storage-related deployment is accepted. Do not rename or remove the Worker entry, binding, bucket, health route, or SPA asset fallback without an intentional storage migration and replacement rollback point.

## Guard

Run this before deployment:

```bash
node scripts/check-project-guard.mjs
npm run lint
npm run build
```
