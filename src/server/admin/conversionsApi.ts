import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '../firebase/admin';
import { requireAdmin } from './auth';

type ConversionListRecord = {
  id: string;
  sourceCollection: 'conversionSubmissions' | 'intakeItems';
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
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export const conversionsAdminApi = Router();
conversionsAdminApi.use(requireAdmin);

conversionsAdminApi.get('/', async (_req, res) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ error: { code: 'ADMIN_BACKEND_NOT_CONFIGURED' } });

  try {
    const [conversionSnapshot, intakeSnapshot] = await Promise.all([
      db.collection('conversionSubmissions').orderBy('createdAt', 'desc').limit(250).get(),
      db.collection('intakeItems').orderBy('createdAt', 'desc').limit(250).get(),
    ]);

    const conversionRecords: ConversionListRecord[] = conversionSnapshot.docs.map((entry) => ({
      id: entry.id,
      sourceCollection: 'conversionSubmissions',
      ...entry.data(),
    }));

    const intakeRecords: ConversionListRecord[] = intakeSnapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        id: entry.id,
        sourceCollection: 'intakeItems',
        type: 'contact',
        language: 'ku',
        fullName: data.name || '',
        email: data.contact || '',
        phone: '',
        organization: data.company || '',
        service: data.serviceInterest || data.category || '',
        message: data.message || '',
        status: data.status === 'contacted' ? 'contacted' : data.status === 'closed' ? 'closed' : 'received',
        adminNote: data.adminNote || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      };
    });

    const merged: ConversionListRecord[] = [...conversionRecords, ...intakeRecords]
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
      .slice(0, 250);

    return res.json({ data: merged });
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

  updates.updatedAt = new Date().toISOString();
  updates.serverUpdatedAt = FieldValue.serverTimestamp();
  updates.updatedBy = req.adminUser?.uid || null;

  try {
    const targetCollection = req.body?.sourceCollection === 'intakeItems' ? 'intakeItems' : 'conversionSubmissions';
    const targetUpdates = targetCollection === 'intakeItems'
      ? {
          adminNote: updates.adminNote,
          updatedAt: updates.updatedAt,
          status: updates.status === 'closed' ? 'closed' : updates.status === 'contacted' ? 'contacted' : 'reviewing',
        }
      : updates;

    await db.collection(targetCollection).doc(req.params.id).update(targetUpdates);
    return res.json({ data: { id: req.params.id, sourceCollection: targetCollection } });
  } catch (error) {
    console.error('Updating conversion submission failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: { code: 'CONVERSION_UPDATE_FAILED' } });
  }
});
