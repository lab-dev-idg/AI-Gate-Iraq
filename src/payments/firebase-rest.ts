import { createRs256Jwt } from './jwt';
import type { AuthenticatedUser, PaymentOrderStatus } from './types';

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  mapValue?: { fields: Record<string, FirestoreValue> };
  arrayValue?: { values: FirestoreValue[] };
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

export interface FirebaseRestConfig {
  projectId: string;
  webApiKey: string;
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
}

export interface PendingPaymentOrder {
  orderId: string;
  uid: string;
  email: string;
  provider: 'zaincash';
  plan: 'pro';
  amount: number;
  currency: 'IQD';
  durationDays: number;
  status: 'pending';
  externalReferenceId: string;
  providerTransactionId: string;
}

type PaymentOrderRecord = PendingPaymentOrder & {
  status: PaymentOrderStatus;
  currentPeriodEnd?: string;
};

let cachedAdminToken: { value: string; expiresAt: number } | null = null;

const encodeValue = (value: unknown): FirestoreValue => {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === 'object') {
    return { mapValue: { fields: encodeFields(value as Record<string, unknown>) } };
  }
  throw new Error('FIRESTORE_UNSUPPORTED_VALUE');
};

const encodeFields = (record: Record<string, unknown>): Record<string, FirestoreValue> =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [key, encodeValue(value)]));

const decodeValue = (value: FirestoreValue): unknown => {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if (value.mapValue?.fields) return decodeFields(value.mapValue.fields);
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeValue);
  return undefined;
};

const decodeFields = (fields: Record<string, FirestoreValue> = {}): Record<string, unknown> =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));

const firestoreRoot = (projectId: string): string =>
  `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)`;

const requestJson = async (url: string, init: RequestInit): Promise<Record<string, unknown>> => {
  const response = await fetch(url, init);
  const text = await response.text();
  let body: Record<string, unknown> = {};
  try { body = text ? JSON.parse(text) as Record<string, unknown> : {}; } catch { body = {}; }
  if (!response.ok) {
    console.error('Firebase REST request failed.', { status: response.status });
    throw new Error(`FIREBASE_REST_HTTP_${response.status}`);
  }
  return body;
};

export async function verifyFirebaseIdToken(
  idToken: string,
  apiKey: string,
): Promise<AuthenticatedUser> {
  const body = await requestJson(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  );
  const users = Array.isArray(body.users) ? body.users as Record<string, unknown>[] : [];
  const user = users[0];
  const uid = typeof user?.localId === 'string' ? user.localId : '';
  const email = typeof user?.email === 'string' ? user.email : '';
  const emailVerified = user?.emailVerified === true;
  if (!uid || !emailVerified) throw new Error('FIREBASE_USER_NOT_VERIFIED');
  return { uid, email, emailVerified };
}

export async function createPendingPaymentOrder(
  config: FirebaseRestConfig,
  idToken: string,
  order: PendingPaymentOrder,
): Promise<void> {
  const documentName = `projects/${config.projectId}/databases/(default)/documents/paymentOrders/${order.orderId}`;
  await requestJson(`${firestoreRoot(config.projectId)}/documents:commit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      writes: [{
        update: { name: documentName, fields: encodeFields({ ...order }) },
        currentDocument: { exists: false },
        updateTransforms: [
          { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
          { fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' },
        ],
      }],
    }),
  });
}

export async function getGoogleAdminAccessToken(config: FirebaseRestConfig): Promise<string> {
  const nowMs = Date.now();
  if (cachedAdminToken && cachedAdminToken.expiresAt > nowMs + 60_000) return cachedAdminToken.value;

  const now = Math.floor(nowMs / 1000);
  const assertion = await createRs256Jwt({
    iss: config.serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }, config.serviceAccountPrivateKey);
  const form = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });
  const body = await requestJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const accessToken = typeof body.access_token === 'string' ? body.access_token : '';
  const expiresIn = typeof body.expires_in === 'number' ? body.expires_in : 3600;
  if (!accessToken) throw new Error('GOOGLE_ACCESS_TOKEN_MISSING');
  cachedAdminToken = { value: accessToken, expiresAt: nowMs + expiresIn * 1000 };
  return accessToken;
}

async function getAdminDocument(
  config: FirebaseRestConfig,
  collection: string,
  documentId: string,
): Promise<Record<string, unknown> | null> {
  const token = await getGoogleAdminAccessToken(config);
  const response = await fetch(
    `${firestoreRoot(config.projectId)}/documents/${encodeURIComponent(collection)}/${encodeURIComponent(documentId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (response.status === 404) return null;
  const text = await response.text();
  if (!response.ok) {
    console.error('Firestore document read failed.', { status: response.status });
    throw new Error(`FIRESTORE_READ_HTTP_${response.status}`);
  }
  const document = JSON.parse(text) as FirestoreDocument;
  return decodeFields(document.fields);
}

export async function getAdminPaymentOrder(
  config: FirebaseRestConfig,
  orderId: string,
): Promise<PaymentOrderRecord | null> {
  const value = await getAdminDocument(config, 'paymentOrders', orderId);
  return value ? value as unknown as PaymentOrderRecord : null;
}

export async function finalizePaymentEvent(
  config: FirebaseRestConfig,
  input: {
    eventId: string;
    order: PaymentOrderRecord;
    status: PaymentOrderStatus;
    providerStatus: string;
    providerTransactionId: string;
  },
): Promise<'processed' | 'duplicate'> {
  const token = await getGoogleAdminAccessToken(config);
  const rootName = `projects/${config.projectId}/databases/(default)/documents`;
  const now = new Date();
  const writes: Record<string, unknown>[] = [{
    update: {
      name: `${rootName}/paymentEvents/${input.eventId}`,
      fields: encodeFields({
        eventId: input.eventId,
        orderId: input.order.orderId,
        uid: input.order.uid,
        provider: 'zaincash',
        status: input.status,
        providerStatus: input.providerStatus,
        providerTransactionId: input.providerTransactionId,
      }),
    },
    currentDocument: { exists: false },
    updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
  }, {
    update: {
      name: `${rootName}/paymentOrders/${input.order.orderId}`,
      fields: encodeFields({
        status: input.status,
        providerStatus: input.providerStatus,
        providerTransactionId: input.providerTransactionId,
      }),
    },
    updateMask: { fieldPaths: ['status', 'providerStatus', 'providerTransactionId'] },
    currentDocument: { exists: true },
    updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
  }];

  if (input.status === 'succeeded') {
    const subscription = await getAdminDocument(config, 'subscriptions', input.order.uid);
    const oldEnd = typeof subscription?.currentPeriodEnd === 'string'
      ? new Date(subscription.currentPeriodEnd)
      : null;
    const periodStart = oldEnd && oldEnd.getTime() > now.getTime() ? oldEnd : now;
    const periodEnd = new Date(periodStart.getTime() + input.order.durationDays * 86_400_000);
    writes.push({
      update: {
        name: `${rootName}/subscriptions/${input.order.uid}`,
        fields: encodeFields({
          uid: input.order.uid,
          plan: 'pro',
          status: 'active',
          source: 'zaincash',
          paymentOrderId: input.order.orderId,
          providerTransactionId: input.providerTransactionId,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          activatedAt: now,
        }),
      },
      updateMask: {
        fieldPaths: [
          'uid', 'plan', 'status', 'source', 'paymentOrderId', 'providerTransactionId',
          'currentPeriodStart', 'currentPeriodEnd', 'activatedAt',
        ],
      },
      updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
    });
  }

  const response = await fetch(`${firestoreRoot(config.projectId)}/documents:commit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ writes }),
  });
  if (response.ok) return 'processed';
  const errorText = await response.text();
  if (response.status === 409 || /ALREADY_EXISTS/i.test(errorText)) return 'duplicate';
  console.error('Firestore payment finalization failed.', { status: response.status });
  throw new Error(`FIRESTORE_FINALIZE_HTTP_${response.status}`);
}
