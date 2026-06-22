import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { isAdminFirestoreConfigured } from '../firebase/admin';
import { conversionSubmissionSchema } from './schema';
import { createConversionSubmission } from './service';

export const conversionRouter = Router();

const submissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'داواکاری زۆرە؛ تکایە دوای ماوەیەکی کورت دووبارە هەوڵ بدەوە.',
    },
  },
});

conversionRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    storageConfigured: isAdminFirestoreConfigured(),
  });
});

conversionRouter.post('/submissions', submissionRateLimit, async (req, res) => {
  const requestId = String(req.headers['x-request-id'] || randomUUID()).slice(0, 128);
  res.setHeader('x-request-id', requestId);

  const parsed = conversionSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: 'زانیارییە نێردراوەکان دروست نین.',
        fields: parsed.error.flatten().fieldErrors,
      },
      requestId,
    });
  }

  try {
    const result = await createConversionSubmission(parsed.data, {
      requestId,
      ip: req.ip,
      userAgent: req.get('user-agent') || undefined,
    });

    return res.status(201).json({
      data: result,
      requestId,
    });
  } catch (error) {
    const unavailable = error instanceof Error && error.name === 'ConversionStorageUnavailableError';

    console.error('Conversion submission failed.', {
      requestId,
      category: unavailable ? 'storage_not_configured' : 'storage_error',
      message: error instanceof Error ? error.message : String(error),
    });

    return res.status(unavailable ? 503 : 500).json({
      error: {
        code: unavailable ? 'STORAGE_NOT_CONFIGURED' : 'SUBMISSION_FAILED',
        message: unavailable
          ? 'خزمەتگوزاریی ناردنی داواکاری ئێستا ڕێکنەخراوە.'
          : 'نەتوانرا داواکارییەکە تۆمار بکرێت؛ تکایە دواتر هەوڵ بدەوە.',
      },
      requestId,
    });
  }
});
