# Firebase Spark Runtime Verification & Integration Guide

This document details the configuration, schema validations, security models, and verification procedures for connecting **AI Gate Iraq** to a brand-new Firebase Spark project safely.

---

## 1. Architectural Overview

To ensure the application is ready for pilot deployment, the integration of Firebase has been built on a hybrid architecture:
1. **Durable Cloud Synchronization**: Manual administration synchronizes main-branch configurations (`flags`, `services`, `prompts`, `workflows`, `contents`) to Firebase Firestore.
2. **Offline Fallback Architecture**: If Firebase environment variables are absent, the application gracefully operates in **Local Pilot Sandbox Mode**, falling back to client-side `localStorage`.
3. **Admin Controls Protection**: Manual push-and-pull mechanisms give Super Admins absolute veto authority over database overwrites.

---

## 2. Environment Configurations

Define the following non-sensitive placeholder configurations inside your platform-specific settings. Under no circumstances should real credentials or secrets be committed to git.

Create or update `.env.example` in source repositories:

```env
# Google Gemini Large Language Model Selection
GEMINI_MODEL=gemini-2.5-flash

# Firebase Public Client Web Configurations
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 3. Database Architecture & Firestore Schema

Our Firestore integration translates the unified `AdminState` across two layers: a singular central global configuration state and specialized individual sub-collections.

### Global Document Target
* **Collection**: `/config`
* **Document**: `admin_defaults`
* **Schema**: Matches the `AdminState` interface, containing:
  - `services`: Complete array of service configuration objects.
  - `prompts`: Fast prompt click action chips.
  - `workflows`: Active step-by-step verification flows.
  - `flags`: Administrative feature flags toggled.
  - `contents`: Page layout custom alert/information fields.
  - `logs`: Audit log records tracking actor modifications.

### Collection Targets
Individual configurations are mirror-synced into specialized sub-collections for robust query optimization:
| Collection Name | Document Key Pattern | Schema Target |
| :--- | :--- | :--- |
| `/feature_flags` | `{key}` | `key`, `labelKu`, `descriptionKu`, `enabled` |
| `/services` | `{id}` | `id`, `key`, `titleKu`, `titleAr`, `titleEn`, etc. |
| `/prompts` | `{id}` | `id`, `serviceKey`, `labelKu`, `promptKu`, etc. |
| `/workflows` | `{id}` | `id`, `serviceKey`, `titleKu`, `descriptionKu`, etc. |
| `/contents` | `{id}` | `id`, `key`, `titleKu`, `bodyKu`, `visible`, etc. |

---

## 4. Security Practices & Rules Optimization

Secure Firestore rules have been developed inside `firestore.rules` and `firestore-blueprint.json` to lock unauthorized write requests while offering public reading capabilities.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to confirm user is fully authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Public configurations
    match /config/admin_defaults {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /feature_flags/{flagId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /prompts/{promptId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /workflows/{workflowId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /contents/{contentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // Public inquiries / intake form submissions
    match /intake/{intakeId} {
      allow read: if isAuthenticated();
      allow create: if true; // Public guest submissions allowed
      allow update, delete: if isAuthenticated();
    }
  }
}
```

---

## 5. Super Admin Synchronization Controls (KU UI)

The **Kurdish Sorani Control Console** provides a unified verification and synchronization station:

### Stat Card Displays:
* **پەیوەستبوون (Connection Status)**: Indication of successful client initializer mount.
* **مۆد (Environment Mode)**: Toggles dynamically between `Local Sandbox` and `Firebase Cloud`.
* **کۆدی پڕۆژە (Project ID)**: Extracted safely from `import.meta.env` to prevent silent misconfigurations.

### Control Actions:
1. **تاقیکردنەوەی پەیوەندی (Test Connection)**:
   - Queries a small test write operation to verify network routing.
   - Gracefully translates standard auth and `permission-denied` issues into friendly Kurdish logs.
2. **هاوکاتکردن بۆ فایەربەیس (Sync to Cloud)**:
   - Triggers explicit confirmation.
   - Pushes current client-side state schema definitions directly into Cloud Firestore documents and sub-collections.
3. **هێنانەوە لە فایەربەیس (Load from Cloud)**:
   - Triggers confirmation.
   - Pulls structural definitions from Firestore, merging them cleanly with `DEFAULT_ADMIN_STATE` to protect schemas against partial record deletions.
   - Preserves state persistence on approval.

---

## 6. Pilot Integration Verification Checklist

To run verification against your custom Firebase project space:
- [ ] **Check Client Initialization**: Ensure the portal reads `configured: true` once env cards are filled in the console settings.
- [ ] **Run Test Connection**: Click "تاقیکردنەوەی پەیوەندی" first; confirm the result log displays success.
- [ ] **Push Fresh Templates**: Push default states via "هاوکاتکردن بۆ فایەربەیس" and confirm collections are populated.
- [ ] **Sync Verification**: Verify that changing a feature flag or adding a swift prompt in the manager updates in Firestore dynamically after pressing manually.
