# AI Gate Iraq — Live Demo Readiness

This document prepares the AI Gate Iraq platform for a high-impact live demonstration or stakeholder pilot launch.

---

## 0. Permanent Positioning Lock

AI Gate Iraq is a private commercial service platform for business, trade, logistics, procurement, market summaries, cost estimation, and customer intake.

Use product language such as:

- private business platform
- AI business assistant
- commercial service gateway
- logistics and trade support platform
- SaaS platform for businesses in Iraq
- advisory and workflow support system

Border, customs, and logistics information must be presented as advisory business support.

---

## 1. Live Demo Objective

To demonstrate the practical value and elegance of **AI Gate Iraq** as a unified trade, advisory, and calculation terminal for Iraqi SMEs, traders, and logistics managers. The demo should showcase Arabic and Kurdish localized workflows matching real-world trade patterns.

---

## 2. Required Environment Variables

| Variable | Deployment Environment Value | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *Your secure Gemini API Key* | Powers the Business Advisor conversational proxy. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Required fast model for the pilot runtime. |
| `NODE_ENV` | `production` | Enables optimized production asset serving. |
| `PORT` | `3000` | Standard internal ingress port. |
| `VITE_FIREBASE_PROJECT_ID` | `ai-gate-iraq` | Firebase project identity for the private platform. |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ai-gate-iraq.firebaseapp.com` | Firebase Auth domain. |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ai-gate-iraq.firebasestorage.app` | Firebase Storage bucket. |
| `VITE_FIREBASE_API_KEY` | from Firebase Web App config | Client-side Firebase SDK key. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | from Firebase Web App config | Firebase sender ID. |
| `VITE_FIREBASE_APP_ID` | from Firebase Web App config | Firebase app ID. |
| `VITE_FIREBASE_MEASUREMENT_ID` | optional | Analytics measurement ID if enabled. |

---

## 3. Stable Deployment Steps

1. **Verify No Committed Secrets**: Confirm that `.env` and `.env.local` are excluded by `.gitignore`.
2. **Run Project Guard**:
   ```bash
   node scripts/check-project-guard.mjs
   ```
3. **Run Typecheck**:
   ```bash
   npm run lint
   ```
4. **Launch Build**:
   ```bash
   npm run build
   ```
5. **Execute Production Process**:
   ```bash
   npm run start
   ```

---

## 4. Pre-Demo Smoke Test Checklists

### Local Smoke Test

- [ ] Open a fresh browser window and clear `localStorage` history.
- [ ] Confirm the onboarding guide appears correctly.
- [ ] Click through each service tab and verify layout responsiveness.
- [ ] Post a sample query to the **AI Business Advisor** to confirm the server-side API is active.
- [ ] Open `/admin` through the header Admin button and confirm the AdminAccessGate appears.
- [ ] Open Admin Settings and confirm Firebase status shows `ai-gate-iraq` when env variables are loaded.

### Production Stage Smoke Test

- [ ] Access the deployed production URL on mobile and desktop.
- [ ] Check that HTTPS is active.
- [ ] Request `/api/health` from the browser to verify network integrity.
- [ ] Confirm no legacy AI Studio Firebase identifiers appear in console or source search.

---

## 5. Presentation Day Agenda & Talking Points

- **Introduction**: Introduce typical friction points for Iraqi import/export traders: multilingual paperwork, cargo tracking, currency calculations, and border-time uncertainty.
- **Core Value Proposition**: Show how **AI Gate Iraq** gathers these scattered tasks inside a single private commercial business platform optimized in Kurdish and Arabic/English workflows.
- **The Flow**:
  1. Showcase the localized language toggle.
  2. Engage the **AI Business Advisor** to answer a trade guideline.
  3. Swap to the **Currency Converter** to compare exchange-rate assumptions.
  4. Build a quick invoice estimate using the **Cost Estimator**.
  5. Check **Border Status** wait-time guidance before routing dispatch.

---

## 6. Emergency Fallback Playbook

### Scenario A: Gemini Rate Limits / Quotas Exceeded

- **Symptom**: Chat responds with fallback warning text or stalls.
- **What to Do**: Continue the demo using the localized fallback responses. Explain that the platform keeps an advisory fallback mode for limited or rate-limited conditions.

### Scenario B: Deployed Site is Sluggish or Stuck

- **Symptom**: Page is unresponsive or freezes.
- **What to Do**: Refresh the page or click "Clear Local Session" under the profile header menu.
