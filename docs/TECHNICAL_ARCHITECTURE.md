# Technical Architecture

## Overview

AI Gate Iraq is a React, TypeScript, Vite, and Firebase platform deployed as two Firebase Hosting targets: the public website and the authenticated platform. Cloudflare provides DNS, CDN, and perimeter security. The project remains compatible with Firebase Spark.

## Runtime components

| Component | Responsibility |
| --- | --- |
| Firebase Hosting: website | Public product, trust, legal, support, and onboarding content |
| Firebase Hosting: platform | React/Vite business and logistics workspace |
| Firebase Authentication | User and administrator identity |
| Cloud Firestore | Application records, configuration, and conversion submissions |
| Firebase Storage | Approved document storage when enabled and protected by rules |
| Cloudflare | DNS, CDN, TLS edge, and security controls |

The production architecture does not depend on Render, Cloud Run, Cloud Functions, or a separate conversion API.

## Application structure

- `src/App.tsx`: platform composition and route-level workspace control.
- `src/app/`: shared platform shell, header, sidebar, and service workspace.
- `src/features/`: domain workspaces and public inquiry flows.
- `src/admin/`: protected administration experience.
- `src/lib/firebase.ts`: Firebase client initialization.
- `src/lib/sessionStore.ts`: browser session persistence and normalization.
- `firestore.rules`: Firestore authorization policy.
- `storage.rules`: Firebase Storage authorization policy.
- `website/public/`: public website assets and legal/support pages.

## Identity and authorization

Firebase Authentication establishes identity. Privileged access is authorized through `adminUsers/{uid}`. An administrator document must be active and have role `owner` or `admin` before protected administrative reads or updates are allowed.

Client-side route visibility is not a security boundary. Firestore and Storage rules are the authoritative access controls.

## Subscription and usage control

- `subscriptions/{uid}` is the authoritative plan entitlement. Users may read only their own record; only active `owner` or `admin` accounts may create or update subscriptions.
- `usageCounters/{uid}` stores the authenticated user's AI question count. Free accounts are limited to three questions by Firestore rules; active Pro accounts may continue incrementing usage.
- `subscriptionRequests/{uid}` stores one current Pro activation request per authenticated user and is visible in the existing administration panel.
- Browser `localStorage` is not an authorization or quota source. It may be used only for non-authoritative interface preferences.
- Manual Pro activation is the initial commercial workflow. Automated payment processing requires a verified server-side webhook and a separate security review before activation.

## Conversion submission flow

1. A public user completes the conversion form.
2. The website writes an allowed document to `conversionSubmissions` through the Firestore REST interface.
3. Public clients cannot read, update, list, or delete those documents.
4. An authenticated owner or administrator reads submissions through the Firebase SDK.
5. Administrative updates are limited to `status`, `adminNote`, `assignedTo`, and `updatedAt`.

## Integration policy

There is currently no public partner API. Integrations must not bypass Firebase Authentication or Firestore rules. A future partner interface requires versioned contracts, authentication, authorization, quotas, audit logging, data-retention rules, and a security review before publication.

## Environment and secrets

- Public Firebase web configuration is supplied through approved Vite environment variables.
- Privileged service-account credentials must never be included in the browser bundle or committed to Git.
- AI and other privileged provider secrets must remain outside public assets.
- Production behavior must not be hardcoded to temporary hosts or developer environments.

## Verification

```bash
npm run check:project
npm run lint
npm run build
npm run prepare:firebase-platform
```

Production deployment:

```bash
firebase deploy --only firestore:rules,hosting:website,hosting:platform --project ai-gate-iraq
```

## Change control

Changes to collections, authorization rules, hosting targets, authentication, or data flows require updates to this document, the security protocol, and the relevant tests in the same pull request.
