import { Router } from 'express';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { getAdminFirestore } from '../firebase/admin';
import { requireAdmin } from './auth';

type ConversionListRecord = {
  id: string;
  sourceCollection: 'conversionSubmissions';
  type?: string;
  language?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  service?: string;
  message?: string;
  status?: string;
  adminNote?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  migratedFrom?: string;
  [key: string]: unknown;
};

const MIGRATION_ID = 'intake_to_conversion_v1';

async function ensureLegacyIntakeMigrated(db: Firestore): Promise<void> {
  const markerRef = db.collection('systemMigrations').doc(MIGRATION_ID);
  const marker = await markerRef.get();
  if (marker.exists && marker.data()?.status === 'completed') return;

  const intakeSnapshot = await db.collection('intakeItems').limit(1000).get();
  const chunks: typeof intakeSnapshot.docs[] = [];

  for (let index = 0; index < intakeSnapshot.docs.length; index += 400) {
    chunks.push(intakeSnapshot.docs.slice(index, index + 400));
  }

  for (const chunk of chunks) {
    const batch = db.batch();

    for (const entry of chunk) {
      const data = entry.data();
      const createdAt = typeof data.createdAt === 'string' && data.createdAt
        ? data.createdAt
        : new Date().toISOString();
      const updatedAt = typeof data.updatedAt === 'string' && data.updatedAt
        ? data.updatedAt
        : createdAt;
      const status = data.status === 'contacted'
        ? 'contacted'
        : data.status === 'closed'
          ? 'closed'
          : 'received';

      batch.set(db.collection('conversionSubmissions').doc(`legacy_${entry.id}`), {
        type: 'contact',
        language: 'ku',
        fullName: data.name || '',
        email: data.contact || '',
        phone: '',
        organization: data.company || null,
        role: null,
        country: null,
        city: null,
        service: data.serviceInterest || data.category || null,
        message: data.message || '',
        consent: false,
        sourceUrl: null,
        source: 'legacy-intake',
        status,
        adminNote: data.adminNote || '',
        assignedTo: data.assignedTo || '',
        createdAt,
        updatedAt,
        migratedFrom: 'intakeItems',
        legacySourceId: entry.id,
        migratedAt: new Date().toISOString(),
        serverMigratedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    await batch.commit();
  }

  await markerRef.set({
    status: 'completed',
    migrationId: MIGRATION_ID,
    migratedCount: intakeSnapshot.size,
    completedAt: new Date().toISOString(),
    serverCompletedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

export const conversionsAdminApi = Router();
conversionsAdminApi.use(requireAdmin);

conversionsAdminApi.get('/', async (_req, res) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ error: { code: 'ADMIN_BACKEND_NOT_CONFIGURED' } });

  try {
    await ensureLegacyIntakeMigrated(db);

    const snapshot = await db
      .collection('conversionSubmissions')
      .orderBy('createdAt', 'desc')
      .limit(1000)
      .get();

    const records: ConversionListRecord[] = snapshot.docs.map((entry) => ({
      id: entry.id,
      sourceCollection: 'conversionSubmissions',
      ...entry.data(),
    }));

    return res.json({ data: records });
  } catch (error) {
    console.error('Loading conversion submissions failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: { code: 'CONVERSION_LIST_FAILED' } });
  }
});

conversionsAdminApi.patch('/:id', async (req, res) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ error: { code: 'ADMIN_BACKEND_NOT_CONFIGURED' } });

  const allowedStatuses = new Set(['received', 'contacted', 'qualified', 'converted', 'closed']);
  const updates: Record<string, unknown> = {};

  if (typeof req.body?.status === 'string' && allowedStatuses.has(req.body.status)) updates.status = req.body.status;
  if (typeof req.body?.adminNote === 'string') updates.adminNote = req.body.adminNote.slice(0, 4000);
  if (typeof req.body?.assignedTo === 'string') updates.assignedTo = req.body.assignedTo.slice(0, 160);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: { code: 'INVALID_UPDATE' } });
  }

  const updatedAt = new Date().toISOString();
  updates.updatedAt = updatedAt;
  updates.serverUpdatedAt = FieldValue.serverTimestamp();
  updates.updatedBy = req.adminUser?.uid || null;

  try {
    const auditId = randomUUID();
    const batch = db.batch();

    batch.update(db.collection('conversionSubmissions').doc(req.params.id), updates);
    batch.create(db.collection('auditLogs').doc(auditId), {
      event: 'conversion.submission.updated',
      entityType: 'conversionSubmission',
      entityId: req.params.id,
      actorType: 'admin',
      actorUid: req.adminUser?.uid || null,
      actorEmail: req.adminUser?.email || null,
      createdAt: updatedAt,
      serverCreatedAt: FieldValue.serverTimestamp(),
      details: {
        status: updates.status || null,
        assignedTo: updates.assignedTo || null,
        noteChanged: Object.prototype.hasOwnProperty.call(updates, 'adminNote'),
      },
    });

    await batch.commit();
    return res.json({ data: { id: req.params.id, updatedAt } });
  } catch (error) {
    console.error('Updating conversion submission failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: { code: 'CONVERSION_UPDATE_FAILED' } });
  }
});
