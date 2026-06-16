# AI Gate Iraq — Deployment Checklist

Use this checklist during production preparation, continuous integration, and cloud-hosting deploys (e.g., Cloud Run, virtual instances, container environments) to ensure security, standard responsive rendering, and system uptime.

---

## 🔒 1. Secret & Environment Variable Validation

- [ ] **GEMINI_API_KEY**: Ensure the server-side API key exists in server secret managers.
  - *Rule*: Never prefix with `VITE_` to protect key leakage into public client bundles.
- [ ] **GEMINI_MODEL**: Set target model (e.g., `gemini-2.5-flash`) for stable execution.
- [ ] **NODE_ENV**: Configured strictly to `production` in container runs.
- [ ] **No Raw Hardcodes**: Double-check that no test API keys are committed in `.env.example` or static files.

---

## 🛠️ 2. Build & Runtime Compilation

- [ ] **Workspace Standard Ports**: Verify build endpoints bind precisely to Port `3000` on host interface `0.0.0.0`.
- [ ] **Frontend Asset Generation**: Run `npm run build` to verify standard Client SPA compilations output into `/dist`.
- [ ] **CJS Server Bundling**: Verify `esbuild` correctly compiles `server.ts` into standard, self-contained `dist/server.cjs` on build pipelines.
- [ ] **Startup Execution**: Ensure deployment execution matches `npm run start` (`node dist/server.cjs`).
- [ ] **Asset Serving Path**: Confirm server serves production assets with absolute routing fallback: `app.get('*', ...)` correctly mapping `/dist/index.html`.

---

## 📱 3. Responsive Web & Shell Checks

- [ ] **No Forced Sizing Overrides**: Ensure no structural wrappers break standard auto-scaling on parent viewports.
- [ ] **Breakpoints Check**:
  - [ ] Mobile (< 640px): Sidebar hidden, horizontal chip navigator visible, page container has outer vertical scroll.
  - [ ] Tablet (640px to 1023px): Standard unified sizing, correct wrapping, no cut prompt chips.
  - [ ] Desktop (>= 1024px): Sidebar present on left, layout fits neatly.
- [ ] **No Visual Overflow**: Swipe screen bounds on mobile to verify no horizontal scroll leaks exist.

---

## 🧪 4. Post-Deployment Smoke Tests

- [ ] **Server Health Endpoint**: Request `/api/health` and verify `{"status": "ok"}` responds with standard headers.
- [ ] **Multilingual Static Load**: Ensure system loads fast, showing correct localized branding headers.
- [ ] **Secure Chat Connection**: Verify conversational queries reach backend proxy and stream correctly without CORS errors.
- [ ] **Storage Sandbox Check**: Verify session clears cleanly on request, writing transient data only to safe, local sandbox objects.

---

## ⚠️ 5. Rate Limiting & Quota Readiness

- [ ] **Gemini Quota Monitors**: Configure alerts in Google Cloud Advisor for active Gemini API quotas.
- [ ] **Safe-Fallbacks Validation**: Send complex prompt streams to verify client displays friendly retry banners if rate-limiting or heavy traffic is encountered.

---

## ↩️ 6. Rollback Blueprint

- [ ] **Version Containment**: Maintain stable snapshot tags (e.g., `v1.2.0-stable`) on container registries.
- [ ] **Hot Rollback Command**: Ready automated redeployments targeting previously validated stable revisions in case of runtime anomalies.
