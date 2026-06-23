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

function buildFingerprint(metadata: RequestMetadata): string {
  const salt = process.env.CONVERSION_FINGERPRINT_SECRET?.trim() || 'ai-gate-iraq';
  return createHash('sha256')
    .update(`${salt}|${metadata.ip || ''}|${metadata.userAgent || ''}`)
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
  const batch = db.batch();

  batch.create(db.collection('conversionSubmissions').doc(submissionId), {
    type: input.type,
    language: input.language,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    organization: input.organization || null,
    role: input.role || null,
    country: input.country || null,
    city: input.city || null,
    service: input.service || null,
    message: input.message,
    consent: input.consent,
    sourceUrl: input.sourceUrl || null,
    status: 'received',
    source: 'website',
    requestId: metadata.requestId,
    requestFingerprint: buildFingerprint(metadata),
    createdAt: receivedAt,
    updatedAt: receivedAt,
    serverCreatedAt: FieldValue.serverTimestamp(),
  });

  batch.create(db.collection('auditLogs').doc(auditId), {
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

  return { id: submissionId, status: 'received', receivedAt };
}
