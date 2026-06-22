import type { ConversionSubmissionInput } from '../conversion/schema';

type NotificationPayload = {
  submissionId: string;
  receivedAt: string;
  submission: ConversionSubmissionInput;
};

export async function notifyConversionSubmission(payload: NotificationPayload): Promise<void> {
  const webhookUrl = process.env.CONVERSION_NOTIFICATION_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'conversion.submission.received',
        submissionId: payload.submissionId,
        receivedAt: payload.receivedAt,
        type: payload.submission.type,
        fullName: payload.submission.fullName,
        email: payload.submission.email,
        organization: payload.submission.organization || null,
        service: payload.submission.service || null,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn('Conversion notification webhook returned an error.', {
        status: response.status,
        submissionId: payload.submissionId,
      });
    }
  } catch (error) {
    console.warn('Conversion notification webhook failed.', {
      submissionId: payload.submissionId,
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    clearTimeout(timeout);
  }
}
