# AI Gate Iraq — Smoke Test Script

This script outlines the exact click-by-click sequence to verify all systems, layouts, translation modules, and calculation engines operate flawlessly.

---

## 🚦 Phase 1: Clean State Verification

1. **Reset Browser Cached States**
   - Open your browser's DevTools console.
   - Run `localStorage.clear();` or click **"Clear Local Session"** from the app profile menu.
   - Refresh the page to simulate a first-time user arrival.

2. **Onboarding Visual Check**
   - **Expected Behavior**: The onboarding guide modal should display.
   - **Verification**: Ensure the pilot banner is readable, stating that the system is a pilot-stage prototype.
   - **Action**: Click through the onboarding guide steps and confirm the final dismiss action hides the modal cleanly.

---

## 🌐 Phase 2: Translation & Language Switcher

1. **Kurdish / Arabic / English Alignment**
   - Click the language switcher in the Header.
   - **Arabic (العربية)**: Verify the layout flips cleanly to right-to-left layout direction (RTL). All service card titles should translate immediately.
   - **Kurdish (کوردی)**: Verify RTL layout. Ensure specialized Kurdish terms for local border points look native.
   - **English (English)**: Verify the layout reverses to left-to-right (LTR).

---

## 💬 Phase 3: Conversational AI & Server-Side Proxy

1. **Standard Conversation Probe**
   - Navigate to the **AI Business Advisor** tab.
   - Type: `How do I import electrical goods through Ibrahim Khalil?` and click **Send**.
   - **Expected Behavior**: A typing loading state must appear inside the chat scroll viewport. After a few seconds, the text streams down formatted with clear Markdown headers.
   - **Verification**: Switch languages mid-session. Ask standard questions in Arabic/Kurdish to confirm proper contextual responses.

2. **Prompt Chip Action**
   - Click on the prompt chip: `بەندەری ئوم قەسر (Umm Qasr Port)`.
   - **Expected Behavior**: Clicking the chip must drop the text into the chat and send it immediately. Verify no horizontal stretch occurs on the chip row wrapper.

---

## 🧮 Phase 4: Sizing & Calculation Utilities

1. **Currency Converter Check**
   - Open **Currency Converter**.
   - Input `2,000` USD in the input field.
   - **Expected Behavior**: Form triggers real-time estimations showing parallel market compared against standard Central Bank official rates.

2. **Cost Estimator Verification**
   - Open **Cost Estimator**.
   - Select `Construction Materials` or any category.
   - Slide or fill weight parameters (e.g. `12` tons).
   - **Expected Behavior**: Landed cost calculations run instantly, rendering high-contrast tabular invoice results without page lag.

---

## 🚚 Phase 5: Logistics & Tracking Systems

1. **Border Checker Status**
   - Open **Border Status**.
   - **Expected Behavior**: Verify major border crossings (Ibrahim Khalil, Safwan, Parvizkhan) load matching indicator states, wait times, and operational traffic levels.

2. **Cargo Tracker Probe**
   - Open **Shipment Tracking**.
   - Enter standard track reference: `LX123456789` or `IQ-TRANS-990`.
   - **Expected Behavior**: Form renders custom stepper statuses showing cargo progressing through milestones (ASYCUDA submitted, customs clear, released).

---

## 📱 Phase 6: Responsive Layout Validation

1. **Responsive Viewports Check**
   - Open DevTools device toolbar and swap between iPhone, iPad, and Standard desktop modes.
   - **Scroll Locks Verification**:
     - On mobile screens, swipe left and right. There must be zero horizontal page shifting.
     - On mobile screens, confirm the white vertical scroll track/rail does not clip any chat bubble content.
     - Ensure the Chat Input and Send controls remain visible.
