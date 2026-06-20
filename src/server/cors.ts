import type { Request, Response, NextFunction } from 'express';

const configuredOrigins = new Set(
  String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (configuredOrigins.has(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.aigateiraq\.workers\.dev$/i.test(origin)) return true;
  if (/^https:\/\/([a-z0-9-]+\.)?aigateiraq\.com$/i.test(origin)) return true;
  return /^https?:\/\/localhost(?::\d+)?$/i.test(origin);
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return isAllowedOrigin(origin) ? res.sendStatus(204) : res.sendStatus(403);
  }

  next();
}
