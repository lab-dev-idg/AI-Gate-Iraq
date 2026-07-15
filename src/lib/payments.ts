import { auth } from '@/src/lib/firebase';

export interface PublicPaymentConfig {
  enabled: true;
  provider: 'zaincash';
  plan: 'pro';
  amount: number;
  currency: 'IQD';
  durationDays: number;
}

const paymentApiBaseUrl = (import.meta.env.VITE_PAYMENT_API_BASE_URL || '').trim().replace(/\/$/, '');

export async function getPaymentConfig(): Promise<PublicPaymentConfig | null> {
  if (!paymentApiBaseUrl) return null;
  try {
    const response = await fetch(`${paymentApiBaseUrl}/api/payments/config`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const body = await response.json() as Partial<PublicPaymentConfig>;
    if (
      body.enabled !== true
      || body.provider !== 'zaincash'
      || body.plan !== 'pro'
      || body.currency !== 'IQD'
      || !Number.isSafeInteger(body.amount)
      || Number(body.amount) <= 0
      || !Number.isSafeInteger(body.durationDays)
      || Number(body.durationDays) <= 0
    ) return null;
    return body as PublicPaymentConfig;
  } catch {
    return null;
  }
}

export async function startZainCashCheckout(language: 'ku' | 'ar' | 'en'): Promise<never> {
  const user = auth?.currentUser;
  if (!paymentApiBaseUrl || !user) throw new Error('PAYMENT_AUTH_REQUIRED');
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${paymentApiBaseUrl}/api/payments/zaincash/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language }),
  });
  if (!response.ok) throw new Error('PAYMENT_CHECKOUT_FAILED');
  const body = await response.json() as { redirectUrl?: unknown };
  if (typeof body.redirectUrl !== 'string') throw new Error('PAYMENT_REDIRECT_MISSING');
  const redirectUrl = new URL(body.redirectUrl);
  if (redirectUrl.protocol !== 'https:') throw new Error('PAYMENT_REDIRECT_INVALID');
  window.location.assign(redirectUrl.toString());
  return new Promise<never>(() => undefined);
}
