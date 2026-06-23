import type { NextFunction, Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp, getAdminFirestore } from '../firebase/admin';

declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        uid: string;
        email?: string;
        role: 'owner' | 'admin';
      };
    }
  }
}

function getSessionMaxAgeSeconds(): number {
  const configuredMinutes = Number(process.env.ADMIN_SESSION_MAX_AGE_MINUTES) || 60;
  const boundedMinutes = Math.min(Math.max(configuredMinutes, 15), 720);
  return boundedMinutes * 60;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const app = getFirebaseAdminApp();
  const db = getAdminFirestore();
  if (!app || !db) {
    return res.status(503).json({ error: { code: 'ADMIN_BACKEND_NOT_CONFIGURED' } });
  }

  res.setHeader('cache-control', 'no-store, private');
  res.setHeader('pragma', 'no-cache');

  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: { code: 'AUTH_TOKEN_REQUIRED' } });
  }

  try {
    const decoded = await getAuth(app).verifyIdToken(token, true);
    const authTime = Number(decoded.auth_time || 0);
    const sessionAge = Math.floor(Date.now() / 1000) - authTime;

    if (!authTime || sessionAge > getSessionMaxAgeSeconds()) {
      return res.status(401).json({ error: { code: 'ADMIN_SESSION_EXPIRED' } });
    }

    const snapshot = await db.collection('adminUsers').doc(decoded.uid).get();
    const record = snapshot.exists ? snapshot.data() : null;
    const role = record?.role;
    const active = record?.active === true;

    if (!active || (role !== 'owner' && role !== 'admin')) {
      return res.status(403).json({ error: { code: 'ADMIN_ACCESS_DENIED' } });
    }

    req.adminUser = {
      uid: decoded.uid,
      email: decoded.email,
      role,
    };
    next();
  } catch (error) {
    console.error('Admin authorization failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(401).json({ error: { code: 'INVALID_AUTH_TOKEN' } });
  }
}
