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

## 🛠️ 3. No-Code Platform Control Modules (Patch 3)

The AI Gate Iraq Control Center features six specialized controllers allowing admins to modify content, services, prompt chips, workflow steps, localization keys, and feature flags dynamically:

### A. Content Manager (ناوەڕۆک)
- **Purpose**: Manage general site text, headlines, and descriptions without redeploying code.
- **Features**: 
  - Dual-language editor supporting **Kurdish Sorani** and **Arabic**.
  - Dropdown selector to choose any content fragment.
  - Live sandbox preview pane visualizing change impacts immediately.

### B. Service Manager (خزمەتگوزارییەکان)
- **Purpose**: Toggle, reorder, and configure individual platform sub-capabilities (e.g., AI Advisor, Border Status).
- **Features**:
  - Live reordering via interactive upward/downward ordering arrows.
  - Granular service status modifier: `Active`, `Demo Only`, `Coming Soon`, or `Disabled`.
  - Dynamic pilot note and administrator note fields per module.

### C. Prompt Manager (پرۆمپتەکان)
- **Purpose**: Create and edit floating prompt assistance chips.
- **Features**:
  - Filter prompts by individual active tools (e.g., AI Business Advisor).
  - Add, edit, or delete dynamic prompt button labels and matching AI system prompts in both languages.
  - Instant on/off activation toggle per prompt chip.

### D. Workflow Manager (ڕێڕەوی کار)
- **Purpose**: Define dynamic progress metrics and compliance guide checklists (e.g. KYC stages).
- **Features**:
  - Dynamic step addition, removal, and reordering.
  - Customized description builders for localized target audiences.

### E. Localization Manager (زمانەکان)
- **Purpose**: Manage UI-wide translated keys and system-wide terms dynamically.
- **Features**:
  - Full-text search matching translation keys, Arabic, or Kurdish values.
  - Register new system localization variables.
  - Single-click JSON export of the translation map representing site-wide diction.

### F. Feature Flags Manager (فڵاگەکان)
- **Purpose**: Toggle site-wide business logics on or off in real-time.
- **Features**:
  - Live activation toggles for `show_pilot_limits` (Warning Banner), `enable_multimodal` (Multimodal file interaction), `enable_inquiry_form` (Kurdish Public Inquiry Form), and `enable_file_upload` (Chat file attachment/upload capabilities).
  - High-visibility status indicators showing flag active status immediately.

---

## 📨 4. Public Inquiry & Safe Live Integration (Patch 4)

The platform connects our dynamic Super Admin configurations directly to the live public-facing user interface in a safe, sandboxed, and robust way:

### A. Kurdish Public Inquiry Form (فۆڕمی پەیوەندی)
- **Route**: Reachable from the sidebar or mobile menu via the **"داوای دیمۆ / پەیوەندی"** (Request Demo / Contact) navigation button.
- **Form Fields**: Full Name, Company, Contact Address (Phone/Email), Service Interest dropdown, and Message text block.
- **State Flow**: Fully mapped to `createIntakeItem`. Submission automatically pushes inquiry records directly into the local `intake` store and registers an administrative auditable action inside the global Audit Log.

### B. Safe Live Override Checks
- **Dynamic Service Titles**: Public workspaces automatically read customized labels from the Admin Service Manager with automated hardcoded fallbacks if disabled.
- **Dynamic Prompt Chips**: Floating assistance buttons read, filter, and display custom prompts managed inside the Dynamic Prompt Manager.
- **Dynamic Feature Flags**:
  - `enable_inquiry_form`: Turn on/off the "Request Demo / Contact" submission interface instantly.
  - `enable_file_upload`: Turn on/off the file/image attachment buttons dynamically in the AI Chat.

---

## ⚠️ 5. Crucial Pilot Constraints & Production Transition

AI Gate Iraq utilizes localized client memory engines (`localStorage` and `sessionStorage`) for state persistence during this demo state. Specifically:
- **Admin Configuration Key**: Versioned state is saved as `ai-gate-iraq-admin-config-v1` inside the user's browser local memory storage.
- **Admin Session Authorization**: Gated temporarily on verification of `ai-gate-iraq-admin-auth` stored inside security session tables.

### 🛡️ Core Production Readiness Requirements
To transition this dynamic pilot build into a robust, secure, and fully scalable multi-tenant enterprise solution:

1. **Real Authentication & Identity Providers**: Protection of the `/admin` ingress route behind secure corporate IDPs like Firebase Authentication, Google Identity Platform, or Microsoft Entra ID. Never rely on shared browser passcode states in production.
2. **Robust Database Persistence**: Replace local/client memory state handlers inside `/src/admin/adminStore.ts` with server-side transactions using secure Google Cloud SQL PostgreSQL schemas or Cloud Firestore collections.
3. **Role-Based Access Control (RBAC)**: Enforce strict authorization rules specifying who can read, create, delete, or update configurator keys with administrative operations.
4. **Server-Side Audit Logs**: Transition audit trail entries out of ephemeral browser states into read-only, append-only, tamper-proof logging databases managed by the server.
5. **Encrypted Enterprise Contact Information**: All public inquiry and Intake Manager contact attributes (emails, phone numbers, and messages) must be encrypted at-rest using corporate key managers like Cloud KMS.
6. **Secure External File Storage**: Large file uploads should be processed via dedicated backend signed URLs directly to authenticated private buckets like Google Cloud Storage (GCS) containing malware detection scanning.
7. **Scheduled System Backups & Disaster Recovery**: Active snapshots of dynamic UI and state databases scheduled automatically.
8. **Live Performance Monitoring**: Setup application latency, error rates, and API failures logs natively via Cloud Monitoring, OpenTelemetry, or Sentry.
