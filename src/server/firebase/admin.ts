import { existsSync, statSync } from 'node:fs';
import { applicationDefault, cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

type ServiceAccountShape = {
  project_id: string;
  client_email: string;
  private_key: string;
};

let cachedApp: App | null | undefined;
let cachedDb: Firestore | null | undefined;

function parseServiceAccount(): ServiceAccountShape | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const rawBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.trim();
  const source = rawJson || (rawBase64 ? Buffer.from(rawBase64, 'base64').toString('utf8') : '');

  if (!source) return null;

  try {
    const parsed = JSON.parse(source) as Partial<ServiceAccountShape>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error('Service account JSON is missing required fields.');
    }

    return {
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, '\n'),
    };
  } catch (error) {
    console.error('Firebase Admin service account parsing failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function hasUsableApplicationCredentials(): boolean {
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (credentialPath) {
    try {
      return existsSync(credentialPath) && statSync(credentialPath).isFile();
    } catch {
      return false;
    }
  }

  return Boolean(process.env.GOOGLE_CLOUD_PROJECT?.trim());
}

export function getFirebaseAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;

  const existing = getApps()[0];
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }

  const serviceAccount = parseServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || serviceAccount?.project_id;

  try {
    if (serviceAccount) {
      cachedApp = initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
        projectId,
      });
      return cachedApp;
    }

    if (hasUsableApplicationCredentials()) {
      cachedApp = initializeApp({ credential: applicationDefault(), projectId });
      return cachedApp;
    }

    cachedApp = null;
    return null;
  } catch (error) {
    console.error('Firebase Admin initialization failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    cachedApp = null;
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  if (cachedDb !== undefined) return cachedDb;
  const app = getFirebaseAdminApp();
  cachedDb = app ? getFirestore(app) : null;
  return cachedDb;
}

export function isAdminFirestoreConfigured(): boolean {
  return Boolean(getAdminFirestore());
}
