# AI Gate Iraq — Pilot QA Checklist

This document acts as a high-fidelity quality assurance playbook. Use it to perform comprehensive evaluations before final stakeholders are presented with pilot live demonstrations.

---

## 📱 1. Responsive & Device Viewport QA

### Mobile Views (< 640px)
- [ ] No vertical layout elements are cut off on small screens.
- [ ] Prompt chips do not wrap, they scroll smoothly horizontally.
- [ ] Outer page can scroll vertically when necessary.
- [ ] There is no white rail, border, or blank structural gap on the side of the chat interface.
- [ ] Header logo and localized action buttons remain compact, clean, and fully readable.
- [ ] Standard responsive design rules apply (no hardcoded artificial phone mock frames inside browser views).

### Tablet Views (640px to 1023px)
- [ ] Left-hand desktop navigation rail is completely hidden.
- [ ] Top horizontal bar navigation allows immediate switching between workspaces.
- [ ] Workspace layouts stack cleanly; there are no squeezed or collapsed cards.

### Desktop Views (>= 1024px)
- [ ] Left-hand sidebar is sticky, clearly displaying all service options with active and hover states.
- [ ] Content containers use full available workspace without horizontal leakage.
- [ ] Typography tracks correctly (e.g., Space Grotesk/Inter fonts pairing behaves dynamically).

---

## 💬 2. AI Chat Experience QA

- [ ] Typing a query and clicking "Send" delivers the prompt to the backend proxy.
- [ ] System prompts use localized templates (English, Kurdish, and Arabic) and respect business vocabulary.
- [ ] Active service scope context is correctly appended to the backend prompt.
- [ ] The loading state is visible (subtle bouncing dot or typing indicator) during request generation.
- [ ] Error messages (e.g., quota exceeded, bad gateway) are displayed gracefully to the user as friendly guidance boards.

---

## 📂 3. Service Modules QA

- [ ] **AI Advisor**: Evaluates trade queries, shows clear, formatted markdown tables and bullet list results.
- [ ] **Market Summary**: Displays clear high-level trends with beautiful layout.
- [ ] **Border Status**: Correctly loads specific border points (Ibrahim Khalil, Safwan, Parvizkhan) with illustrative traffic levels and wait-time badges.
- [ ] **Currency Converter**: Compares CBI rates with parallel market trends instantly. 
- [ ] **Cost Estimator**: Successfully generates landed shipping estimation reports based on user selections.
- [ ] **KYC Form**: Processes step-by-step business information drafts seamlessly.
- [ ] **Procurement**: Renders clear text boxes and provides clear copy/draft functions for supplier-facing RFQs.
- [ ] **Shipment Tracking**: Displays progress steppers matching searched tracking IDs.
- [ ] **Logistics Map & Corridors**: Displays a clear overview of primary Iraqi cross-border trade route networks.

---

## 🌐 4. Localized Language QA

- [ ] Switching between Kurdish (کوردی), Arabic (العربية), and English updates all headers, button titles, and input placeholders dynamically.
- [ ] Layout direction updates correctly: Right-to-Left (RTL) for Arabic/Kurdish, Left-to-Right (LTR) for English.
- [ ] No placeholder tags or translation string keys (like `{{missing_key}}`) leak into the UI.

---

## 🧠 5. Onboarding & Active Session Memory QA

- [ ] Onboarding guide renders automatically for first-time visitors.
- [ ] Onboarding can be dismissed cleanly, saving preferences locally.
- [ ] Onboarding can be reopened at any point from the top interface controls.
- [ ] Language state, active workspace state, and previous chat messages restore successfully when refreshing the browser.
- [ ] Clicking "Clear Local Session" wipes the browser state, restoring all configurations to secure defaults.
- [ ] Privacy notice clearly informs the user that their data stays safe and is evaluated in a persistent local-only sandbox.

---

## 🛡️ 6. Brand and Safety QA

- [ ] **AI Gate Iraq** is the only business branding visible.
- [ ] Absolutely no obsolete project namespaces appear in code, headers, or local files.
- [ ] Pilot limitation disclaimers are visible on cards, calculator footprints, and onboarding steps to maintain honest pilot compliance.
