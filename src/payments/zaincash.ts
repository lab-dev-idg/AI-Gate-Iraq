import type { PaymentLanguage, ZainCashTransaction } from './types';

export interface ZainCashConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  serviceType: string;
}

interface CreatePaymentInput {
  orderId: string;
  externalReferenceId: string;
  amount: number;
  language: PaymentLanguage;
  successUrl: string;
  failureUrl: string;
}

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};

const readString = (data: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const fetchJson = async (url: string, init: RequestInit): Promise<Record<string, unknown>> => {
  const response = await fetch(url, init);
  const text = await response.text();
  let body: Record<string, unknown> = {};
  try {
    body = text ? asRecord(JSON.parse(text)) : {};
  } catch {
    body = { message: text.slice(0, 500) };
  }
  if (!response.ok) {
    console.error('ZainCash API request failed.', {
      status: response.status,
      code: readString(body, ['code', 'errorCode', 'error']),
    });
    throw new Error(`ZAINCASH_HTTP_${response.status}`);
  }
  return body;
};

export class ZainCashProvider {
  constructor(private readonly config: ZainCashConfig) {}

  private async getAccessToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: 'payment:read payment:write',
    });
    const response = await fetchJson(`${this.config.baseUrl.replace(/\/$/, '')}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const token = readString(response, ['access_token', 'accessToken']);
    if (!token) throw new Error('ZAINCASH_TOKEN_MISSING');
    return token;
  }

  async createPayment(input: CreatePaymentInput): Promise<ZainCashTransaction> {
    const accessToken = await this.getAccessToken();
    const response = await fetchJson(
      `${this.config.baseUrl.replace(/\/$/, '')}/api/v2/payment-gateway/transaction/init`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: input.language,
          externalReferenceId: input.externalReferenceId,
          orderId: input.orderId,
          serviceType: this.config.serviceType,
          amount: { value: input.amount, currency: 'IQD' },
          redirectUrls: {
            successUrl: input.successUrl,
            failureUrl: input.failureUrl,
          },
        }),
      },
    );
    const nested = asRecord(response.data);
    const transactionId = readString(response, ['transactionId', 'id'])
      || readString(nested, ['transactionId', 'id']);
    const redirectUrl = readString(response, ['redirectUrl']) || readString(nested, ['redirectUrl']);
    if (!transactionId || !redirectUrl) throw new Error('ZAINCASH_INVALID_INIT_RESPONSE');
    return { transactionId, redirectUrl, raw: response };
  }

  async inquire(transactionId: string): Promise<Record<string, unknown>> {
    const accessToken = await this.getAccessToken();
    return fetchJson(
      `${this.config.baseUrl.replace(/\/$/, '')}/api/v2/payment-gateway/transaction/inquiry/${encodeURIComponent(transactionId)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }
}
