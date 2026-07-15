# Payment gateway contract

AI Gate Iraq uses a provider-neutral payment order model with ZainCash Payment Gateway v2 as the first provider.

## Security invariants

- The browser never receives the ZainCash client secret or API secret.
- A checkout request requires a verified Firebase ID token and an allowed production origin.
- `paymentOrders` can only be created as pending; clients cannot update payment status.
- A redirect or webhook token must pass HS256 verification before it is accepted.
- A successful server-verified payment is the only payment path that activates Pro.
- `paymentEvents/{eventId}` provides idempotency for duplicate callbacks.
- The existing Cloudflare R2 worker name, entry point, bucket binding and health route remain unchanged.

## Worker routes

| Route | Method | Purpose |
|---|---:|---|
| `/api/payments/config` | GET | Returns public price/config only when every required binding exists |
| `/api/payments/zaincash/checkout` | POST | Verifies Firebase user, creates ZainCash transaction and pending order |
| `/api/payments/zaincash/return` | GET | Verifies the signed redirect and returns the user to the workspace |
| `/api/payments/zaincash/webhook` | POST | Verifies the signed event and finalizes the order idempotently |

## Required Worker configuration

Public variables:

- `FIREBASE_PROJECT_ID=ai-gate-iraq`
- `PAYMENT_ALLOWED_ORIGINS`
- `PAYMENT_APP_RETURN_URL=https://app.aigateiraq.com/workspace`
- `PAYMENT_PUBLIC_BASE_URL=https://api.aigateiraq.com`
- `PAYMENT_PRO_AMOUNT_IQD`
- `PAYMENT_PRO_DURATION_DAYS`
- `ZAINCASH_API_BASE_URL`
- `ZAINCASH_SERVICE_TYPE`

Secrets (Cloudflare dashboard or `wrangler secret put`; never commit values):

- `FIREBASE_WEB_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_EMAIL`
- `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `ZAINCASH_CLIENT_ID`
- `ZAINCASH_CLIENT_SECRET`
- `ZAINCASH_API_SECRET`

GitHub Actions also needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the protected `production` environment.

## Go-live sequence

1. Complete ZainCash merchant onboarding and receive production credentials.
2. Point `api.aigateiraq.com` to the existing `ai-gate-iraq` Worker as a Cloudflare custom domain.
3. Add the variables and secrets above to the Worker.
4. Ask ZainCash to register `https://api.aigateiraq.com/api/payments/zaincash/webhook` as the production webhook.
5. Run the Cloudflare Worker Deploy workflow, then Firebase Deploy with scope `all`.
6. Complete one controlled payment and verify the order, event and Pro entitlement in the Admin Panel.

Until every required Worker binding exists, `/api/payments/config` reports `enabled: false`, the Pay with ZainCash button stays hidden, and the existing manual activation request remains available.
