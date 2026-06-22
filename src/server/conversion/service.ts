import { createHash, randomUUID } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '../firebase/admin';
import { notifyConversionSubmission } from '../notifications/conversionNotifier';
import type { ConversionSubmissionInput, ConversionSubmissionResponse } from './schema';

type RequestMetadata = {
  ip?: string;
  userAgent?: string;
  requestId: string;
};

function fingerprintRequest(metadata: RequestMetadata): string {
  const secret = process.env.CONVERSION_FINGERPRINT_SECRET?.trim() || 'ai-gate-iraq';
  return createHash('sha256')
    .update(`${secret}|${metadata.ip || ''}|${metadata.userAgent || ''}`)
    .digest('hex');
}

export async function createConversionSubmission(
  input: ConversionSubmissionInput,
  metadata: RequestMetadata,
): Promise<ConversionSubmissionResponse> {
  const db = getAdminFirestore();
  if (!db) {
    const error = new Error('CONVERSION_STORAGE_NOT_CONFIGURED');
    error.name = 'ConversionStorageUnavailableError';
    throw error;
  }

  const submissionId = randomUUID();
  const auditId = randomUUID();
  const receivedAt = new Date().toISOString();
  const submissionRef = db.collection('conversionSubmissions').doc(submissionId);
  const auditRef = db.collection('auditLogs').doc(auditId);
  const batch = db.batch();

  batch.create(submissionRef, {
    ...input,
    website: FieldValue.delete(),
    status: 'received',
    source: 'website',
    requestId: metadata.requestId,
    requestFingerprint: fingerprintRequest(metadata),
    createdAt: receivedAt,
    updatedAt: receivedAt,
    serverCreatedAt: FieldValue.serverTimestamp(),
  });

  batch.create(auditRef, {
    event: 'conversion.submission.received',
    entityType: 'conversionSubmission',
    entityId: submissionId,
    requestId: metadata.requestId,
    actorType: 'public',
    createdAt: receivedAt,
    serverCreatedAt: FieldValue.serverTimestamp(),
    details: {
      type: input.type,
      language: input.language,
      service: input.service || null,
    },
  });

  await batch.commit();

  void notifyConversionSubmission({
    submissionId,
    receivedAt,
    submission: input,
  });

  return {
    id: submissionId,
    status: 'received',
    receivedAt,
  };
}
