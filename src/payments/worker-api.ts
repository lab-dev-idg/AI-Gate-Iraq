import {
  createPendingPaymentOrder,
  finalizePaymentEvent,
  getAdminPaymentOrder,
  verifyFirebaseIdToken,
  type FirebaseRestConfig,
} from './firebase-rest';
import { verifyHs256Jwt } from './jwt';
import type {
  PaymentConfig,
  PaymentLanguage,
  PaymentOrderStatus,
  ZainCashCallbackPayload,
} from './types';
import { ZainCashProvider } from './zaincash';

export interface PaymentWorkerEnv {
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_WEB_API_KEY?: string;
  FIREBASE_SERVICE_ACCOUNT_EMAIL?: string;
  FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
  PAYMENT_ALLOWED_ORIGINS?: string;
  PAYMENT_APP_RETURN_URL?: string;
  PAYMENT_PUBLIC_BASE_URL?: string;
  PAYMENT_PRO_AMOUNT_IQD?: string;
  PAYMENT_PRO_DURATION_DAYS?: string;
  ZAINCASH_API_BASE_URL?: string;
  ZAINCASH_CLIENT_ID?: string;
  ZAINCASH_CLIENT_SECRET?: string;
  ZAINCASH_API_SECRET?: string;
  ZAINCASH_SERVICE_TYPE?: string;
}

interface RuntimeConfig {
  publicBaseUrl: string;
  appReturnUrl: string;
  allowedOrigins: Set<string>;
  payment: PaymentConfig;
  firebase: FirebaseRestConfig;
  zainCash: {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    apiSecret: string;
    serviceType: string;
  };
}

const json = (body: Record<string, unknown>, status = 200): Response =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });

const parsePositiveInteger = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0;
};

const readConfig = (env: PaymentWorkerEnv): RuntimeConfig | null => {
  const amount = parsePositiveInteger(env.PAYMENT_PRO_AMOUNT_IQD);
  const durationDays = parsePositiveInteger(env.PAYMENT_PRO_DURATION_DAYS);
  const publicBaseUrl = env.PAYMENT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '') || '';
  const appReturnUrl = env.PAYMENT_APP_RETURN_URL?.trim() || '';
  const firebase: FirebaseRestConfig = {
    projectId: env.FIREBASE_PROJECT_ID?.trim() || '',
    webApiKey: env.FIREBASE_WEB_API_KEY?.trim() || '',
    serviceAccountEmail: env.FIREBASE_SERVICE_ACCOUNT_EMAIL?.trim() || '',
    serviceAccountPrivateKey: env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim() || '',
  };
  const zainCash = {
    baseUrl: env.ZAINCASH_API_BASE_URL?.trim().replace(/\/$/, '') || '',
    clientId: env.ZAINCASH_CLIENT_ID?.trim() || '',
    clientSecret: env.ZAINCASH_CLIENT_SECRET?.trim() || '',
    apiSecret: env.ZAINCASH_API_SECRET?.trim() || '',
    serviceType: env.ZAINCASH_SERVICE_TYPE?.trim() || '',
  };
  const required = [
    publicBaseUrl,
    appReturnUrl,
    firebase.projectId,
    firebase.webApiKey,
    firebase.serviceAccountEmail,
    firebase.serviceAccountPrivateKey,
    zainCash.baseUrl,
    zainCash.clientId,
    zainCash.clientSecret,
    zainCash.apiSecret,
    zainCash.serviceType,
  ];
  if (!amount || !durationDays || required.some((value) => !value)) return null;

  let parsedPublicBaseUrl: URL;
  let parsedAppReturnUrl: URL;
  try {
    parsedPublicBaseUrl = new URL(publicBaseUrl);
    parsedAppReturnUrl = new URL(appReturnUrl);
  } catch {
    return null;
  }
  if (parsedPublicBaseUrl.protocol !== 'https:' || parsedAppReturnUrl.protocol !== 'https:') return null;

  const allowedOrigins = new Set(
    (env.PAYMENT_ALLOWED_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
  allowedOrigins.add(parsedAppReturnUrl.origin);

  return {
    publicBaseUrl,
    appReturnUrl,
    allowedOrigins,
    payment: {
      enabled: true,
      provider: 'zaincash',
      plan: 'pro',
      amount,
      currency: 'IQD',
      durationDays,
    },
    firebase,
    zainCash,
  };
};

const withCors = (response: Response, origin: string, config: RuntimeConfig | null): Response => {
  if (!config || !origin || !config.allowedOrigins.has(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Vary', 'Origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const readBearerToken = (request: Request): string => {
  const authorization = request.headers.get('Authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
};

const languageFromValue = (value: unknown): PaymentLanguage => {
  if (value === 'ar' || value === 'Ar') return 'Ar';
  if (value === 'en' || value === 'En') return 'En';
  return 'Ku';
};

const findString = (value: unknown, names: string[]): string => {
  const queue: unknown[] = [value];
  const visited = new Set<object>();
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);
    const record = current as Record<string, unknown>;
    for (const name of names) {
      const candidate = record[name];
      if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    }
    for (const nested of Object.values(record)) {
      if (nested && typeof nested === 'object') queue.push(nested);
    }
  }
  return '';
};

const mapProviderStatus = (rawStatus: string): PaymentOrderStatus => {
  switch (rawStatus.trim().toUpperCase()) {
    case 'SUCCESS': return 'succeeded';
    case 'FAILED': return 'failed';
    case 'EXPIRED': return 'expired';
    case 'REFUNDED': return 'refunded';
    case 'PENDING':
    case 'OTP_SENT':
    case 'CUSTOMER_AUTHENTICATION_REQUIRED':
    default: return 'pending';
  }
};

const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const finalizeSignedPayload = async (
  payload: ZainCashCallbackPayload,
  runtime: RuntimeConfig,
  fallbackPrefix: string,
): Promise<PaymentOrderStatus> => {
  const orderId = findString(payload, ['orderId']);
  const transactionId = findString(payload, ['transactionId', 'id']);
  const providerStatus = findString(payload, ['status', 'transactionStatus']);
  if (!orderId || !transactionId || !providerStatus) throw new Error('PAYMENT_CALLBACK_FIELDS_MISSING');

  const order = await getAdminPaymentOrder(runtime.firebase, orderId);
  if (!order || order.providerTransactionId !== transactionId) throw new Error('PAYMENT_ORDER_MISMATCH');
  const status = mapProviderStatus(providerStatus);
  const suppliedEventId = findString(payload, ['eventId']);
  const eventId = suppliedEventId || await sha256Hex(`${fallbackPrefix}:${orderId}:${transactionId}:${providerStatus}`);
  await finalizePaymentEvent(runtime.firebase, {
    eventId,
    order,
    status,
    providerStatus,
    providerTransactionId: transactionId,
  });
  return status;
};

const handleCheckout = async (request: Request, runtime: RuntimeConfig): Promise<Response> => {
  const origin = request.headers.get('Origin') || '';
  if (!runtime.allowedOrigins.has(origin)) return json({ error: 'ORIGIN_NOT_ALLOWED' }, 403);
  const idToken = readBearerToken(request);
  if (!idToken) return json({ error: 'AUTH_REQUIRED' }, 401);

  let body: Record<string, unknown> = {};
  try { body = await request.json() as Record<string, unknown>; } catch { return json({ error: 'INVALID_JSON' }, 400); }
  const user = await verifyFirebaseIdToken(idToken, runtime.firebase.webApiKey);
  const orderId = crypto.randomUUID();
  const externalReferenceId = crypto.randomUUID();
  const provider = new ZainCashProvider(runtime.zainCash);
  const callbackUrl = `${runtime.publicBaseUrl}/api/payments/zaincash/return`;
  const transaction = await provider.createPayment({
    orderId,
    externalReferenceId,
    amount: runtime.payment.amount,
    language: languageFromValue(body.language),
    successUrl: callbackUrl,
    failureUrl: callbackUrl,
  });
  await createPendingPaymentOrder(runtime.firebase, idToken, {
    orderId,
    uid: user.uid,
    email: user.email,
    provider: 'zaincash',
    plan: 'pro',
    amount: runtime.payment.amount,
    currency: 'IQD',
    durationDays: runtime.payment.durationDays,
    status: 'pending',
    externalReferenceId,
    providerTransactionId: transaction.transactionId,
  });
  return json({ orderId, redirectUrl: transaction.redirectUrl });
};

const handleWebhook = async (request: Request, runtime: RuntimeConfig): Promise<Response> => {
  let body: Record<string, unknown> = {};
  try { body = await request.json() as Record<string, unknown>; } catch { return json({ error: 'INVALID_JSON' }, 400); }
  const token = typeof body.webhook_token === 'string' ? body.webhook_token : '';
  if (!token) return json({ error: 'WEBHOOK_TOKEN_REQUIRED' }, 400);
  const payload = await verifyHs256Jwt<ZainCashCallbackPayload>(token, runtime.zainCash.apiSecret);
  await finalizeSignedPayload(payload, runtime, 'webhook');
  return json({ received: true });
};

const handleReturn = async (url: URL, runtime: RuntimeConfig): Promise<Response> => {
  const target = new URL(runtime.appReturnUrl);
  const token = url.searchParams.get('token') || '';
  try {
    if (!token) throw new Error('RETURN_TOKEN_REQUIRED');
    const payload = await verifyHs256Jwt<ZainCashCallbackPayload>(token, runtime.zainCash.apiSecret);
    const orderId = findString(payload, ['orderId']);
    const transactionId = findString(payload, ['transactionId', 'id']);
    if (!orderId || !transactionId) throw new Error('PAYMENT_CALLBACK_FIELDS_MISSING');
    const order = await getAdminPaymentOrder(runtime.firebase, orderId);
    if (!order || order.providerTransactionId !== transactionId) throw new Error('PAYMENT_ORDER_MISMATCH');

    // A browser redirect is never authoritative. Confirm the final state directly
    // with the provider; production webhooks remain the primary source of truth.
    const inquiry = await new ZainCashProvider(runtime.zainCash).inquire(transactionId);
    const providerStatus = findString(inquiry, ['status', 'transactionStatus']);
    if (!providerStatus) throw new Error('PAYMENT_INQUIRY_STATUS_MISSING');
    const status = mapProviderStatus(providerStatus);
    const eventId = await sha256Hex(`inquiry:${orderId}:${transactionId}:${providerStatus}`);
    await finalizePaymentEvent(runtime.firebase, {
      eventId,
      order,
      status,
      providerStatus,
      providerTransactionId: transactionId,
    });
    target.searchParams.set('payment', status);
    if (orderId) target.searchParams.set('paymentOrder', orderId);
  } catch (error) {
    console.error('ZainCash return verification failed.', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    target.searchParams.set('payment', 'verification_error');
  }
  return Response.redirect(target.toString(), 303);
};

export async function handlePaymentRequest(
  request: Request,
  env: PaymentWorkerEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/payments/')) return null;

  const runtime = readConfig(env);
  const origin = request.headers.get('Origin') || '';
  if (request.method === 'OPTIONS') {
    const response = runtime && runtime.allowedOrigins.has(origin)
      ? new Response(null, { status: 204 })
      : json({ error: 'ORIGIN_NOT_ALLOWED' }, 403);
    return withCors(response, origin, runtime);
  }

  try {
    let response: Response;
    if (url.pathname === '/api/payments/config' && request.method === 'GET') {
      response = runtime
        ? json(runtime.payment as unknown as Record<string, unknown>)
        : json({ enabled: false, provider: 'zaincash' });
    } else if (!runtime) {
      response = json({ error: 'PAYMENTS_NOT_CONFIGURED' }, 503);
    } else if (url.pathname === '/api/payments/zaincash/checkout' && request.method === 'POST') {
      response = await handleCheckout(request, runtime);
    } else if (url.pathname === '/api/payments/zaincash/webhook' && request.method === 'POST') {
      response = await handleWebhook(request, runtime);
    } else if (url.pathname === '/api/payments/zaincash/return' && request.method === 'GET') {
      response = await handleReturn(url, runtime);
    } else {
      response = json({ error: 'PAYMENT_ROUTE_NOT_FOUND' }, 404);
    }
    return withCors(response, origin, runtime);
  } catch (error) {
    console.error('Payment API request failed.', {
      path: url.pathname,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    const status = error instanceof Error && /AUTH|TOKEN|JWT/.test(error.message) ? 401 : 502;
    return withCors(json({ error: 'PAYMENT_REQUEST_FAILED' }, status), origin, runtime);
  }
}
