# AI Gate Iraq — Live Demo Readiness

This document prepares the AI Gate Iraq platform for a flawless, high-impact live demonstration or stakeholder pilot launch. Follow these steps to prepare, dry-run, and present the platform under production conditions.

---

## 🎯 1. Live Demo Objective
To demonstrate the absolute power and elegance of **AI Gate Iraq** as a unified trade, intelligence, and calculation terminal for Iraqi SMEs, traders, and logistics managers. We aim to showcase seamless Arabic and Kurdish localized workflows matching real-world trade patterns.

---

## 🔑 2. Required Environment Variables
Ensure the following variables are securely populated within the host container/cloud dashboard prior to launching:

| Variable | Deployment Environment Value | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *Your secure Gemini API Key* | Power the Business Advisor conversational proxy. |
| `GEMINI_MODEL` | `gemini-3.5-flash` | The recommended high-speed, cost-effective LLM. |
| `NODE_ENV` | `production` | Enables optimized production asset serving. |
| `PORT` | `3000` | Standard internal ingress port. |

---

## 🚀 3. Stable Deployment Steps

1. **Verify No Committed Secrets**: Double check that any `.env` file is excluded using `.gitignore`.
2. **Launch Cloud Build**:
   ```bash
   npm run build
   ```
   *Note: This generates static code inside `/dist` and compiles `server.ts` into a self-contained ES-bundled `dist/server.cjs` file to bypass relative ESM import restrictions.*
3. **Execute Production Docker/Process Run**:
   ```bash
   npm run start
   ```

---

## 🧪 4. Pre-Demo Smoke Test Checklists

### Local Smoke Test
Before sharing links or stepping onto the presentation stage, execute these quick steps locally:
- [ ] Open a fresh browser window and clear `localStorage` history.
- [ ] Ensure the **Onboarding Guide** pops up correctly, explaining pilot limits and saving settings locally.
- [ ] Click through each of the 9 tabs and verify layout responsiveness.
- [ ] Post a sample query to the **AI Business Advisor** to confirm the server-side API is active and responding.

### Production Stage Smoke Test
- [ ] Access the deployed production URL on both a mobile screen and standard desktop browser.
- [ ] Check headers to confirm SSL (`https://`) is active and secure.
- [ ] Request `/api/health` from the browser to verify full-stack network integrity.

---

## 📝 5. Presentation Day Agenda & Talking Points

- **Introduction**: Introduce the typical friction point for Iraqi import/export traders (multilingual paperwork, complex cargo tracking, multiple parallel currency calculations, non-transparent border times).
- **Core Value Proposition**: Show how **AI Gate Iraq** gathers these scattered tasks inside a single, intuitive dashboard optimized in Kurdish and Arabic/English layouts.
- **The Flow**:
  1. Showcase the localized language toggle.
  2. Engage the **AI Business Advisor** to answer a trade guideline.
  3. Swap to the **Currency Converter** to compare central bank vs. parallel market volatility.
  4. Build a quick invoice estimate using the **Cost Estimator**.
  5. Check **Border Status** wait times before routing dispatch.

---

## 🚨 6. Emergency Fallback Playbook

If something unexpected happens during a live demo (network lag, third-party API outage, rate limit limits reached):

### Scenario A: Gemini Rate Limits / Quotas Exceeded
- **Symptom**: Chat responds with fallback warning text or stalls.
- **What to Do**: The custom full-stack Express server has **built-in high-fidelity local emergency fallbacks**. If an API failure occurs, the server intercepts the request and generates professional, localized responses (e.g., custom border rules for Ibrahim Khalil & Umm Qasr). Continue with the presentation, explaining: *"Under critical offline or rate-limited environments, our local cached edge rules immediately step in to maintain critical operations."*

### Scenario B: Deployed Site is Sluggish or Stuck
- **Symptom**: Page is unresponsive or freezes.
- **What to Do**: Refresh the page or click "Clear Local Session" under the Profile header menu. Since the app is built on robust sandboxed client state, a clear-and-refresh fully resets the context immediately to a clean state.
