# AI Gate Iraq — Known Limitations

The **AI Gate Iraq** platform is currently deployed as a **high-fidelity pilot-stage application**. To provide transparent oversight and align engineering development towards production systems, this document details known model, data, and system-level boundaries.

---

## 🚫 1. Pilot Constraints & Data Sources

- **Illustration Baseline**: Border wait indicators, parallel currency trends, shipping fee structures, and custom clearance milestones use high-fidelity mock databases. All indicators are representative representations showing how a unified trade cockpit acts, rather than live government sensor feeds.
- **Rules & Tariff Disclaimers**: Customs schedules, food-import rules, and construction customs percentages are updated periodically in local context prompts. These are non-binding; users should consult professional customs clearing brokers for critical shipments.
- **Currency Fluctuations**: Iraq's parallel market exchange rate is subject to rapid local trading fluctuations. Platform conversions are designed as illustrative indicators and should not be used as official bank exchange guarantees.

---

## 🤖 2. Model & API Dependencies

- **Gemini Context Window**: The platform uses server-side proxies communicating with current Gemini models (e.g., `gemini-2.5-flash`). Long chat sessions can experience rate limits depending on account-specific quotas or billing constraints.
- **Network & Offline Behavior**: AI-powered advisory chat routes require continuous network access. Offline modes are restricted to static cached calculators.

---

## 💾 3. State & Storage Architecture

- **Sandbox Storage Boundary**: Session caching, currency defaults, and workspace histories persist inside localized, sandboxed browser environments (`localStorage`). Wiping browser configurations or utilizing private modes will return layouts to initial setup defaults.
- **No Shared Persistence**: Without central database persistence layer activations, users cannot share active cargo tracks or chat summaries across distinct user devices.

---

## 🚀 4. Production Requirements Roadmap

To transition this pilot into an enterprise, production-grade gateway, the following functional architecture is required:

### A. Authentication & Authorizations
- Implement role-based credentials (e.g., Trader, Sourcing Team, Border Captain, Global Logistics Vendor).
- Multi-factor authentication (MFA) to lock business compliance folders.

### B. Stable Databases
- Transition transient browser variables into secure, cloud-hosted persistent schemas (such as Firebase Firestore, PostgreSQL, or Cloud SQL).
- Enable real-time multi-user synchronization.

### C. True External Access Connectors
- Integrate secure, authenticated live APIs directly from regional port authorities, border controls, and central exchange desks.
- Integrate GPS-coordinate transponders on active cargo.

### D. Compliance & Multi-Tier Analytics
- Establish encrypted transaction journals for audit compliance.
- Track systemic dashboard usage KPIs to report business efficiency gains to program sponsors.
- Strict rate-limiting on conversational pathways to guard against prompt injection runs.
