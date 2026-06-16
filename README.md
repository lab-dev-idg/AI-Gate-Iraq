<div align="center">
  <h1>AI Gate Iraq</h1>
  <p><strong>دەروازەی زیرەکی بۆ بازرگانی عێراق | بوابة ذكية للأعمال في العراق | AI Business Gateway for Iraq</strong></p>
</div>

---

## 📌 Overview

**AI Gate Iraq** is a unified, intelligent business pilot platform built specifically for Iraqi traders, small-and-medium enterprises (SMEs), logistics operators, procurement professionals, and business service providers. By consolidating scattered cross-border intelligence, policy rules, customs guidance, parallel currency rates, and tracking interfaces into a single multilingual workspace, it simplifies cross-border operations and trade workflows in Iraq.

> ⚠️ **Pilot / Demo Honesty Note**: AI Gate Iraq is a pilot-phase prototype and evaluation platform. It is **not** affiliated with, operated by, or endorsed by any official government agency, financial office, state customs body, or central banking authority. All pricing calculations, conversion rates, and border crossing busy-ness levels are for illustrative demo purposes to demonstrate technical capability during a pilot launch.

---

## 🚀 Core Workspace Modules

AI Gate Iraq provides nine primary business intelligence workspaces, available seamlessly across Arabic, Kurdish, and English:

1. **AI Business Advisor**: Multilingual conversational terminal targeting customs policies, regional tariffs, business setup, and regulatory intelligence inside Iraq.
2. **Market Summary**: Curated regional and global trend aggregates, high-level SME commodity pricing indicators, and market updates.
3. **Border Status**: Real-time mock indicator metrics, wait times, and crowd busy-ness statuses for key regional border checkpoints.
4. **Currency Converter**: Dynamic conversion matching parallel market trading rates and official rates for IQD/USD/EUR transactions.
5. **Cost Estimator**: Smart shipping and customs tariff estimator calculating total landed cost sheets based on weight, volume, and goods category.
6. **KYC Business Account**: Self-service onboarding simulation helping SMEs structure compliance requirements for business accounts.
7. **Procurement & Sourcing**: Streamlined request engine helping traders structure RFQs, identify sourcing channels, and formulate buyer templates.
8. **Shipment Tracking**: Comprehensive supply chain visibility tracker simulating custom regulatory milestone approvals, border arrivals, and container release status.
9. **Logistics Map**: Regional visual transit planner identifying primary overland trade corridors and logistics checkpoints.

---

## 🛠️ Technological Stack

- **Frontend**: React (v18) built on Vite, styled with utility-first Tailwind CSS.
- **Backend / Proxy**: Custom Express.js server driving secure Gemini API requests.
- **AI Integrations**: Native `@google/genai` TypeScript SDK driving structured contextual business chats.
- **State & Local Storage**: Session restoration and transient cached drafts using optimized client-side space rules.
- **Animation Framework**: Fluid micro-interactions and transitions driven by `motion` (`motion/react`).

---

## 🔒 Environment Variables

Duplicate the `.env.example` file configuration before initiating any server-side runs:

```env
# Server-side secrets (never expose to React client-side bundles)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

*Note: All core external secrets remain server-side and are proxied via Express `/api/*` endpoints to protect API key security and safeguard user data.*

---

## 💻 Local Development

### 1. Installation
Install core project dependencies:
```bash
npm install
```

### 2. Configure Local Environment
Create your `.env` configuration at the root:
```env
GEMINI_API_KEY=your_api_key
```

### 3. Running Development Server
Runs both Vite frontend development rules and the Express server concurrently:
```bash
npm run dev
```

### 4. Compiling & Production Build
Compile client-side bundles and package the custom TS server:
```bash
npm run build
```

### 5. Production Spin-Up
Start the compiled Node production-ready container:
```bash
npm run start
```

### 6. Linting & Validation
Run ESLint check commands:
```bash
npm run lint
```

---

## 📦 Deployment Requirements

- **Server Environment**: Runs in standard full-stack configuration with an active Node.js runtime executing the entry point.
- **Vite Integration**: The server is fully optimized to run Vite as middleware in development environments and statically serves `/dist` bundles in production.
- **Ingress Port Rule**: Must bind exclusively to port `3000` on interface `0.0.0.0` for safe reverse-proxy routing through host services.
