# 📊 Firestore Data Model Schema Specification

This document details the planned Cloud Firestore collection layout, document formats, permissions, and security policies designed for the **AI Gate Iraq** enterprise backend structure.

---

## 1. Collection Layout & Document Models

### A. Collection: `adminConfig`
- **Document ID**: `global` (Single Document Configurator Model)
- **Purpose**: Stores the core customized administrative configuration in one document for easy client retrieval.
- **Fields**:
  - `brandLogo`: `string` (public path / url)
  - `brandName_ku`: `string`
  - `brandName_ar`: `string`
  - `lastModifiedBy`: `string` (UID or name)
  - `updatedAt`: `string` (ISO timestamp)
- **Who Writes**: Authenticated Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### B. Collection: `featureFlags`
- **Document ID**: `{flagKey}` (e.g., `enable_inquiry_form`, `enable_file_upload`)
- **Purpose**: Real-time business rule switches.
- **Fields**:
  - `key`: `string` (e.g. `enable_inquiry_form`)
  - `labelKu`: `string`
  - `descriptionKu`: `string`
  - `enabled`: `boolean`
  - `updatedAt`: `string` (ISO timestamp)
- **Who Writes**: Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### C. Collection: `serviceConfigs`
- **Document ID**: `{serviceKey}` (e.g., `assistant`, `currency`, `kyc`, `procurement`, `tracking`, `map`)
- **Purpose**: Dynamic labels and customization settings for service portals.
- **Fields**:
  - `key`: `string` (matches service keys)
  - `titleKu`: `string` (Arabic / Kurdish titles)
  - `titleAr`: `string`
  - `descriptionKu`: `string`
  - `descriptionAr`: `string`
  - `updatedAt`: `string`
- **Who Writes**: Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### D. Collection: `promptConfigs`
- **Document ID**: `{promptId}` (Structured prompt item)
- **Purpose**: Dynamic user guidance buttons shown in the AI assistant.
- **Fields**:
  - `id`: `string`
  - `service`: `string` (associated service key)
  - `textKu`: `string`
  - `textAr`: `string`
  - `category`: `string`
- **Who Writes**: Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### E. Collection: `workflowSteps`
- **Document ID**: `{stepId}`
- **Purpose**: Guides users through logistics checklists and service-specific pipelines.
- **Fields**:
  - `id`: `string`
  - `serviceKey`: `string`
  - `orderIndex`: `number`
  - `titleKu`: `string`
  - `titleAr`: `string`
  - `descriptionKu`: `string`
  - `descriptionAr`: `string`
- **Who Writes**: Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### F. Collection: `contentSections`
- **Document ID**: `{sectionId}` (e.g. `landing_about`, `contact_details`)
- **Purpose**: Key-value pairs for customizable translation strings on the public interface.
- **Fields**:
  - `sectionId`: `string`
  - `valueKu`: `string`
  - `valueAr`: `string`
- **Who Writes**: Portal Admin
- **Who Reads**: Public Guests & Admins
- **Pilot Rule**: `allow read: if true; allow write: if request.auth != null;`
- **Production Rule**: `allow read: if true; allow write: if request.auth != null && request.auth.token.isAdmin == true;`

---

### G. Collection: `intakeItems`
- **Document ID**: `{intakeId}` (Auto-generated Firestore UIUUID)
- **Purpose**: Stores public submissions and contact data securely.
- **Fields**:
  - `id`: `string`
  - `fullName`: `string`
  - `companyName`: `string`
  - `contactAddress`: `string`
  - `interestType`: `string`
  - `message`: `string`
  - `status`: `string` (e.g. `new`, `contacted`, `resolved`)
  - `internalNote`: `string`
  - `submittedAt`: `string` (ISO timestamp)
- **Who Writes**: Public Guest (Create only)
- **Who Reads**: Portal Admin (Read/Update)
- **Pilot Rule**: `allow create: if true; allow read, update: if request.auth != null;`
- **Production Rule**: `allow create: if request.resource.data.status == 'new'; allow read, update, delete: if request.auth != null && request.auth.token.isAdmin == true;`

---

### H. Collection: `auditLogs`
- **Document ID**: `{logId}`
- **Purpose**: Records change trails and administrative actions for audit/security logs.
- **Fields**:
  - `id`: `string`
  - `actionKu`: `string`
  - `category`: `string` (e.g., `feature_flag`, `auth`, `service_label`, `intake`)
  - `user`: `string` (admin operator session)
  - `timestamp`: `string` (ISO timestamp)
  - `details`: `string` (optional JSON or text details)
- **Who Writes**: App system on Admin actions (or Portal Admin)
- **Who Reads**: Portal Admin
- **Pilot Rule**: `allow create: if request.auth != null; allow read: if request.auth != null;`
- **Production Rule**: `allow create: if request.auth != null; allow read: if request.auth != null && request.auth.token.isAdmin == true; allow update, delete: if false;` (Immutable list)

---

### I. Collection: `pilotAttachments`
- **Document ID**: `{attachmentId}`
- **Purpose**: Logs files selected and uploaded during AI chat helper queries (if enabled).
- **Fields**:
  - `id`: `string`
  - `fileName`: `string`
  - `fileType`: `string`
  - `fileSize`: `number` (Bytes, max 5MB)
  - `ownerUid`: `string`
  - `storagePath`: `string`
  - `createdAt`: `string`
- **Who Writes**: Authenticated User / Admin
- **Who Reads**: Owner and Portal Admin
- **Pilot Rule**: `allow create, read: if request.auth != null;`
- **Production Rule**: `allow create, read: if request.auth != null && request.resource.data.ownerUid == request.auth.uid;`

---

## 2. General Security Rules Standard Recommendations

For high-security operations, set up the standard Firestore index patterns in the console and ensure rules are configured correctly. Note that under the basic local pilot mode fallback, these collections remain safe in state-handlers but are perfectly mapped for seamless database connection.
