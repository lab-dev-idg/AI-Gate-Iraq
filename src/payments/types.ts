export type PaymentLanguage = 'En' | 'Ar' | 'Ku';

export type PaymentOrderStatus =
  | 'created'
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'expired'
  | 'refunded';

export interface PaymentConfig {
  enabled: boolean;
  provider: 'zaincash';
  plan: 'pro';
  amount: number;
  currency: 'IQD';
  durationDays: number;
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export interface ZainCashTransaction {
  transactionId: string;
  redirectUrl: string;
  raw: Record<string, unknown>;
}

export interface ZainCashCallbackPayload extends Record<string, unknown> {
  eventId?: string;
  orderId?: string;
  externalReferenceId?: string;
  transactionId?: string;
  status?: string;
}
