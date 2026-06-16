# AI Gate Iraq — Super Admin Control Center Guide

Welcome to the **AI Gate Iraq Super Admin Control Center** documentation portal. This blueprint allows team members and stakeholders to manage real-world platform behaviors, intake forms, and system logic dynamically without altering code.

---

## 🔒 1. Accessing the Admin Console
- **Route**: Access the dashboard by appending `/admin` to your deployed root URL (e.g., `https://your-domain.com/admin`).
- **Access Gate Passcode**: Enter `admin-demo` in the prompt barrier.
- **Pilot Assurance**: Session indicators are saved inside the client's transient `sessionStorage` stack for immediate access evaluation.

---

## 📊 2. Screen & Workflow Guide

### A. Dashboard Overview
- Renders 5 fast visual bento panels highlighting:
  - **Total Intake Submissions**: Visual aggregate of all client enquiries.
  - **Pending items**: Direct action counters targeting unreviewed feedback.
  - **Active Modules**: Real-time counter detailing running platform tabs.
- Includes a live telemetry ticker loading **Recent Audit logs** and quick shortcut buttons for easy operations.

### B. Dynamic Intake Manager
- Manage incoming pilot inquiries, quotes, and customer verify logs.
- Features:
  - Full-text search matching Client Name, Company, or Message strings.
  - Dynamic status tabs to isolate `New`, `Reviewing`, `Contacted`, `Closed`, and `Archived` rows.
  - Detailed inline drawers to append private administrative **Internal Notes** safely.

### C. System Audit Trailing
- Track actions done by pilot editors step-by-step.
- Generates precise chronological tracking markers defining Actor role, actions (modifying, switching, updating configs), and corresponding Unix time logs.

### D. Settings & Data Cache
- Controls high-fidelity system variables:
  - **Show Pilot Notices Toggle**: Hides/shows warning text elements instantly on the live public user interface.
  - **JSON Export Payload**: Download full active configurations directly to standard local JSON sheets.
  - **Factory Reset button**: Wipe sandboxed states and re-mount pristine default catalogs cleanly in a single click.

---

## ⚠️ 3. Crucial Pilot Constraints & Production Transition

AI Gate Iraq utilizes localized client memory engines (`localStorage` and `sessionStorage`) for state persistence during this demo state.

To transition this pilot build to standard multi-tenant enterprise production:
1. **Mount Dedicated Database Schemas**: Swap the static data adapters located inside `/src/admin/adminStore.ts` with Cloud Firestore collections or Cloud SQL schemas.
2. **Setup Server OAuth & Authentication**: Protect the `/admin` ingress route behind secure JWT validation services and proper Role-Based Access Control (RBAC) validations verified on back-end gateways.
