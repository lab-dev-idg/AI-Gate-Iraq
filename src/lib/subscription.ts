import { runTransaction } from 'firebase/firestore';
import {
  auth,
  db,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@/src/lib/firebase';

export const FREE_QUESTION_LIMIT = 3;

export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled';

export interface SubscriptionEntitlement {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isPro: boolean;
  questionsUsed: number;
  questionLimit: number | null;
  currentPeriodEnd: Date | null;
}

type FirestoreTimestampLike = {
  toDate?: () => Date;
  seconds?: number;
};

const timestampToDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value !== null) {
    const timestamp = value as FirestoreTimestampLike;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (typeof timestamp.seconds === 'number') return new Date(timestamp.seconds * 1000);
  }
  return null;
};

const isActivePro = (data: Record<string, unknown> | undefined, now = new Date()): boolean => {
  if (!data || data.plan !== 'pro' || data.status !== 'active') return false;
  const periodEnd = timestampToDate(data.currentPeriodEnd);
  return Boolean(periodEnd && periodEnd.getTime() > now.getTime());
};

export async function getSubscriptionEntitlement(uid: string): Promise<SubscriptionEntitlement> {
  if (!db || !uid) throw new Error('SUBSCRIPTION_AUTH_REQUIRED');

  const [subscriptionSnapshot, usageSnapshot] = await Promise.all([
    getDoc(doc(db, 'subscriptions', uid)),
    getDoc(doc(db, 'usageCounters', uid)),
  ]);

  const subscription = subscriptionSnapshot.exists()
    ? subscriptionSnapshot.data() as Record<string, unknown>
    : undefined;
  const usage = usageSnapshot.exists()
    ? usageSnapshot.data() as Record<string, unknown>
    : undefined;
  const pro = isActivePro(subscription);
  const questionsUsed = typeof usage?.questionsUsed === 'number'
    ? Math.max(0, usage.questionsUsed)
    : 0;

  return {
    plan: pro ? 'pro' : 'free',
    status: pro ? 'active' : 'inactive',
    isPro: pro,
    questionsUsed,
    questionLimit: pro ? null : FREE_QUESTION_LIMIT,
    currentPeriodEnd: timestampToDate(subscription?.currentPeriodEnd),
  };
}

export async function consumeAiQuestion(uid: string): Promise<SubscriptionEntitlement> {
  if (!db || !uid) throw new Error('SUBSCRIPTION_AUTH_REQUIRED');

  const subscriptionRef = doc(db, 'subscriptions', uid);
  const usageRef = doc(db, 'usageCounters', uid);

  return runTransaction(db, async (transaction) => {
    const subscriptionSnapshot = await transaction.get(subscriptionRef);
    const usageSnapshot = await transaction.get(usageRef);
    const subscription = subscriptionSnapshot.exists()
      ? subscriptionSnapshot.data() as Record<string, unknown>
      : undefined;
    const usage = usageSnapshot.exists()
      ? usageSnapshot.data() as Record<string, unknown>
      : undefined;
    const pro = isActivePro(subscription);
    const questionsUsed = typeof usage?.questionsUsed === 'number'
      ? Math.max(0, usage.questionsUsed)
      : 0;

    if (!pro && questionsUsed >= FREE_QUESTION_LIMIT) {
      throw new Error('TRIAL_LIMIT_REACHED');
    }

    const nextCount = questionsUsed + 1;
    transaction.set(usageRef, {
      uid,
      questionsUsed: nextCount,
      lastPlan: pro ? 'pro' : 'free',
      updatedAt: serverTimestamp(),
      ...(usageSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
    }, { merge: true });

    return {
      plan: pro ? 'pro' : 'free',
      status: pro ? 'active' : 'inactive',
      isPro: pro,
      questionsUsed: nextCount,
      questionLimit: pro ? null : FREE_QUESTION_LIMIT,
      currentPeriodEnd: timestampToDate(subscription?.currentPeriodEnd),
    };
  });
}

export async function requestProActivation(): Promise<'created' | 'pending' | 'active'> {
  const user = auth?.currentUser;
  if (!db || !user) throw new Error('SUBSCRIPTION_AUTH_REQUIRED');

  const entitlement = await getSubscriptionEntitlement(user.uid);
  if (entitlement.isPro) return 'active';

  const requestRef = doc(db, 'subscriptionRequests', user.uid);
  const existing = await getDoc(requestRef);
  const existingStatus = existing.exists()
    ? String((existing.data() as Record<string, unknown>).status || '')
    : '';

  if (existingStatus === 'pending') return 'pending';

  await setDoc(requestRef, {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    requestedPlan: 'pro',
    status: 'pending',
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  }, { merge: true });

  return 'created';
}
