# ⚙️ Firebase Spark Project Setup & Migration Guide

This guide describes the operator-oriented procedures to orchestrate, initialize, and integrate a completely fresh **Firebase Spark (Free Tier) Project** for **AI Gate Iraq** sandbox testing.

---

## 1. Context and Strategic Shift

### A. Why a New Firebase Project?
- **Isolation**: Clean separation from any past environments ensures a perfectly isolated sandbox for QA, validation, and localized testing without schema contamination.
- **Zero Legacy Interference**: Ensures no residual cloud security policies or data rules are active except those created explicitly in this project.
- **Dynamic Connection**: Eliminates brittle hardcoded references, pivoting cleanly to modular environment variables parsed dynamically in the client-side code.

### B. Why Not Use the Old Firebase Project?
- Built-in configurations was pointing to a static, unverified, or defunct platform database.
- Transitioning to a fresh instance protects database schemas and ensures you are working only with authorized credentials that you control.

### C. Spark Plan Strategy
- **Spark Plan (Free Tier)** is perfect for prototype, development, and standard pilot validation.
- Allows zero-cost onboarding for database, authenticator, and storage testing.
- **When to upgrade to Blaze (Pay-as-you-go)?**
  - Exceeding monthly limits of **50,000 document reads, 20,000 document writes, and 20,000 document deletes** per day.
  - Exceeding **1 GB of total storage capacity** or **10 GB/month of egress bandwidth**.
  - Transitioning from prototype pilot to enterprise scale.

---

## 2. Step-by-Step Firebase Console Orchestration

Follow these steps exactly to instantiate the project in your Google Cloud or Firebase billing account:

### Step 1: Create the Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or *Create project*).
3. Name the project exactly: `AI Gate Iraq` or `ai-gate-iraq-pilot`.
4. Enable or disable Google Analytics depending on audit preferences (optional).
5. Confirm creation on the **Spark Plan (Free Tier)**.

### Step 2: Register the Web Client App
1. Inside the Project Overview dashboard, click the **Web icon (`</>`)** to register a new Web App.
2. App nickname: `AI Gate Iraq Web Portal`.
3. Leave "Also set up Firebase Hosting for this app" **unchecked** for initial pilot phases (or configure later if needed).
4. Click **Register app**.
5. Copy the generated Web App configuration keys (shown inside the `firebaseConfig` object).

### Step 3: Choose nearest stable Region
1. When prompted for cloud resources provisioning or when configuring Firestore, select the closest region to the target demographic in Iraq:
   - **Recommended Cloud Region**: `europe-west3` (Frankfurt) or `europe-west2` (London) for optimal network latency and service durability.
2. **Warning**: Firebase database regions cannot be changed once created. Select carefully!

### Step 4: Enable Core Firebase Products
In the Firebase console sidebar, configure:

#### A. Authentication
1. Click **Build > Authentication** and then **Get Started**.
2. Go to **Sign-in method > Add new provider**.
3. Enable **Google Sign-In** (or Email/Password if requested).
4. Configure support emails and authorize your AI Studio deployment domain URL inside the **Authorized domains** list if required.

#### B. Cloud Firestore
1. Click **Build > Firestore Database** and click **Create database**.
2. Select **Start in production mode** (all reads and writes denied by default).
3. Select your Cloud Region (e.g. `europe-west3`).
4. Click **Enable**.

#### C. Firebase Storage
1. Click **Build > Storage** and click **Get Started**.
2. Start in **production mode** (all reads and writes blocked except authorized buckets).
3. Select your cloud storage location and approve.

---

## 3. Environment Variable Mapping (.env configuration)

To connect the application to the newly created Firebase Spark instance, populate your environment parameters inside your secure platform secrets. 

**DO NOT COMMIT REAL VALUES to git!** Configure them in your container hosting platform or runtime `.env` file:

```env
# Firebase Dynamic Web App Config (Spark Plan Sandbox)
VITE_FIREBASE_API_KEY=AIzaSyByvDpaeCA0ClX8CcBjn_rkbtc40cK-xmI
VITE_FIREBASE_AUTH_DOMAIN=ai-gate-iraq-pilot.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-gate-iraq-pilot
VITE_FIREBASE_STORAGE_BUCKET=ai-gate-iraq-pilot.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=626013219179
VITE_FIREBASE_APP_ID=1:626013219179:web:9c8af306127bd01597042e
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ
```

---

## 4. Planned Firestore Collections & Storage Paths

### Firestore Database Mapping (Planned Schema Specs)
The following collection paths are prepared to synchronize state when Firestore becomes the active persistence layer:

- `adminConfig/global` - Holds the single JSON object containing Super Admin parameters, localized service overrides, and dynamic chips.
- `featureFlags/{flagKey}` - Individual configurations for system-wide business toggles (`enable_inquiry_form`, `enable_file_upload`).
- `serviceConfigs/{serviceKey}` - Translatable parameters for portal systems.
- `promptConfigs/{promptId}` - Configurable prompt chips for instant guidance.
- `workflowSteps/{stepId}` - Structural guides for tracking workflows.
- `contentSections/{sectionId}` - General translation strings.
- `intakeItems/{intakeId}` - Stores public dynamic Kurdish inquiries with statuses `new`, `contacted`, `resolved`.
- `auditLogs/{logId}` - Server-signed logs of administrative operations.

### Storage Bucket Directory Layout:
- `pilot-attachments/` - Secure sandbox folder for saving user-uploaded attachments in chat.
- `intake-documents/` - Folder for uploaded PDFs or documents supplied in the Inquiry pipeline.

---

## 5. Security Rules Warning

Do NOT configure insecure open security rules (`allow read, write: if true;`) in Firestore or Storage, even for sandbox testing. Below are the basic recommended lockdown templates:

- **Firestore Rule Template**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false; // Deny all by default
      }
    }
  }
  ```
- **Storage Rule Template**:
  ```javascript
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if false; // Deny all by default
      }
    }
  }
  ```

---

## 6. Enterprise Production Requirements

When moving beyond the Spark sandbox to active enterprise operations in Iraq:
1. **App Check**: Enable App Check with ReCaptcha Enterprise to prevent billing theft and request flooding.
2. **Encrypted Fields**: Perform field-level encryption on client contact keys (`email`, `phone`) using crypto modules before syncing.
3. **Billing Alerts**: Set up budget monitors and billing alerts at 50%, 75%, and 100% of the Spark tier quota so you get notified ahead of upgrade transitions.
4. **App Auth Integration**: Setup full Role-Based Access Control (RBAC) via Firebase Custom Auth Claims (`isAdmin: true`) rather than relying on standard code validation selectors.
