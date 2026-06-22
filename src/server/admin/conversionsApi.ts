import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '../firebase/admin';
import { requireAdmin } from './auth';

export const conversionsAdminApi = Router();
conversionsAdminApi.use(requireAdmin);

conversionsAdminApi.get('/', async (_req, res) => {
  const db = getAdminFirestore();
  if (!db) return res.status(503).json({ error: { code: 'ADMIN_BACKEND_NOT_CONFIGURED' } });

  try {
    const snapshot = await db.collection('conversionSubmissions').orderBy('createdAt', 'desc').limit(250).get();
    return res.json({ data: snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })) });
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
    await db.collection('conversionSubmissions').doc(req.params.id).update(updates);
    return res.json({ data: { id: req.params.id } });
  } catch (error) {
    console.error('Updating conversion submission failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: { code: 'CONVERSION_UPDATE_FAILED' } });
  }
});
