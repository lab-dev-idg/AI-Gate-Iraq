import { createHmac, randomUUID } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '../firebase/admin';
import type { ConversionSubmissionInput } from '../conversion/schema';

type NotificationPayload = {
  submissionId: string;
  receivedAt: string;
  submission: ConversionSubmissionInput;
};

type DeliveryStatus = 'delivered' | 'failed' | 'skipped';

const MAX_ATTEMPTS = 3;

function buildSignature(body: string): string | null {
  const secret = process.env.CONVERSION_NOTIFICATION_WEBHOOK_SECRET?.trim();
  if (!secret) return null;
  return createHmac('sha256', secret).update(body).digest('hex');
}

async function writeDeliveryLog(
  payload: NotificationPayload,
  status: DeliveryStatus,
  attempts: number,
  responseStatus?: number,
  errorMessage?: string,
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) return;

  try {
    await db.collection('notificationLogs').doc(randomUUID()).set({
      event: 'conversion.submission.received',
      submissionId: payload.submissionId,
      channel: 'webhook',
      status,
      attempts,
      responseStatus: responseStatus || null,
      errorMessage: errorMessage?.slice(0, 500) || null,
      createdAt: new Date().toISOString(),
      serverCreatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.warn('Notification delivery log failed.', {
      submissionId: payload.submissionId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function notifyConversionSubmission(payload: NotificationPayload): Promise<void> {
  const webhookUrl = process.env.CONVERSION_NOTIFICATION_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    await writeDeliveryLog(payload, 'skipped', 0, undefined, 'WEBHOOK_NOT_CONFIGURED');
    return;
  }

  const body = JSON.stringify({
    event: 'conversion.submission.received',
    submissionId: payload.submissionId,
    receivedAt: payload.receivedAt,
    type: payload.submission.type,
    service: payload.submission.service || null,
  });
  const signature = buildSignature(body);
  const timeoutMs = Math.min(Math.max(Number(process.env.CONVERSION_NOTIFICATION_TIMEOUT_MS) || 5000, 1000), 15000);

  let finalStatus: number | undefined;
  let finalError = '';
  let attempts = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    attempts = attempt;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-ai-gate-event': 'conversion.submission.received',
          'x-ai-gate-delivery': payload.submissionId,
          ...(signature ? { 'x-ai-gate-signature': `sha256=${signature}` } : {}),
        },
        body,
        signal: controller.signal,
      });

      finalStatus = response.status;
      if (response.ok) {
        await writeDeliveryLog(payload, 'delivered', attempt, response.status);
        return;
      }

      finalError = `HTTP_${response.status}`;
      if (response.status >= 400 && response.status < 500 && response.status !== 429) break;
    } catch (error) {
      finalError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  console.warn('Conversion notification delivery failed.', {
    submissionId: payload.submissionId,
    status: finalStatus,
    message: finalError,
  });
  await writeDeliveryLog(payload, 'failed', attempts, finalStatus, finalError);
}
