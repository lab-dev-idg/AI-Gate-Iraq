# AI Gate Iraq — Deployment Environment Guide

This guide describes how to configure environment variables, secure sensitive access keys, compile files, and troubleshoot hosting environments in preparation for launching AI Gate Iraq.

---

## 🔒 1. Secrets Management Hierarchy

AI Gate Iraq utilizes a full-stack architecture to ensure maximum security for third-party endpoints.

```
[ Browser / Client ] 
       │
       ▼ (Proxied Requests - No keys leaking in browser)
[ Express.js Full-Stack Backend ] <─── [.env / Server Configuration - Keys stored safely here]
       │
       ▼ (Direct SDK Calls with User-Agent)
[ Gemini API Developer Platform ]
```

### Critical Rules
1. **Never prefix the Gemini API Key with VITE_**: Variables carrying the `VITE_` prefix are automatically built into public client bundles and can be easily extracted using standard browser inspection tools. Keep `GEMINI_API_KEY` hidden inside backend processes.
2. **Never commit .env files to GitHub**: Maintain `.env` files exclusively on local workstations, virtual private nodes, or secure cloud secret lockers.

---

## 💻 2. Local Environment Setup

To run the full-stack system locally:

1. **Create .env Configuration**: Set the variables at the root directory:
   ```env
   GEMINI_API_KEY=your_actual_secures_developer_key
   GEMINI_MODEL=gemini-2.5-flash
   NODE_ENV=development
   ```
2. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   *Note: This starts the Express server running on port `3000` executing Vite as hot dev middleware.*

---

## ☁️ 3. Cloud Deployment Config

When deploying to environments like Google Cloud Run, AWS Elastic Beanstalk, or VM Instances:

### Ingress Port Mapping
- The container or server process **must bind to port 3000** and address `0.0.0.0`.
- The reverse proxy configuration (e.g., Nginx, Envoy, Cloud Run ingress router) must point to Port 3000 to cleanly route traffic from ports 80/443.

### Production Environment Variables
Configure secure environment variables under the cloud service properties:
- `GEMINI_API_KEY`: Provide your production API key.
- `GEMINI_MODEL`: Defaults to `gemini-2.5-flash`.
- `NODE_ENV`: Set to `production` (tells Express to server static files from `/dist` directly, completely avoiding any hot development compilation and maximizing loading speed).

---

## 🛠️ 4. Debugging & Troubleshooting

### Problem A: The App Loads a Blank Page
- **Cause**: The server starts but static frontend files are missing inside `/dist` or the assets were built incorrectly.
- **Fix**: Run `npm run clean` to wipe build folders, then rebuild cleanly with `npm run build` before launching.

### Problem B: AI Chat Returns a "503 NO_API_KEY" Error
- **Cause**: The Express server loaded up but was unable to read a valid `GEMINI_API_KEY` environment variable.
- **Fix**: Double check your environment configuration. If you are using container orchestration, verify if variables are bound correctly to the active service revision.

### Problem C: AI Request Returns a 429 "Quota Exceeded" or Rate Limit
- **Cause**: Heavy traffic is exhausting developer sandbox API limits.
- **Fix**: The full-scale system has a resilient built-in fallback router. If the server detects rate limiting, it dynamically intercepts standard trade keywords and returns professional local cached insights to the user interface, securing uninterrupted demo experiences.
