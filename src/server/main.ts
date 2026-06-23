import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { corsMiddleware } from './cors';
import { conversionRouter } from './conversion/router';
import { conversionsAdminApi } from './admin/conversionsApi';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const apiKey = process.env.GEMINI_API_KEY?.trim();
const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash')
  .replace(/^models\//, '')
  .replace(/^['"]|['"]$/g, '')
  .trim();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
}));
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use('/api/conversion', conversionRouter);
app.use('/api/admin/conversions', conversionsAdminApi);

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are the AI Gate Iraq business assistant for trade, import, export and logistics in Iraq.
Respond in the user's language, Kurdish Sorani or Arabic. Be practical, distinguish verified facts from estimates, never invent live prices or legal status, and advise verification with the relevant authority for legal, customs and financial matters.`;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-gate-iraq', modelConfigured: Boolean(apiKey) });
});

app.post('/api/gemini/chat', async (req, res) => {
  const { messages, activeService, lang, serviceHint, workflowContext } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Invalid request.' } });
  }

  if (!ai || !apiKey) {
    return res.status(503).json({
      error: {
        code: 'AI_NOT_CONFIGURED',
        message: lang === 'ar' ? 'خدمة المساعد الذكي غير مهيأة حالياً.' : 'خزمەتگوزاریی یاریدەدەری زیرەک ئێستا ڕێکنەخراوە.',
      },
    });
  }

  try {
    const contents = messages
      .filter((message: any) => message && typeof message.text === 'string')
      .slice(-40)
      .map((message: any) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.text.slice(0, 12000) }],
      }));

    const context = [
      activeService ? `Active service: ${activeService}` : '',
      serviceHint ? `Service hint: ${String(serviceHint).slice(0, 1000)}` : '',
      workflowContext ? `Workflow context: ${JSON.stringify(workflowContext).slice(0, 5000)}` : '',
      `Requested language: ${lang === 'ar' ? 'Arabic' : 'Kurdish Sorani'}`,
    ].filter(Boolean).join('\n');

    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${context}` },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('EMPTY_AI_RESPONSE');

    return res.json({
      text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [],
    });
  } catch (error: any) {
    const raw = String(error?.message || error || '');
    const status = Number(error?.status || 0);
    const leaked = /reported as leaked|leaked|permission_denied|403/i.test(raw) || status === 403;
    const quota = /resource_exhausted|quota|429/i.test(raw) || status === 429;
    const unavailable = /unavailable|timeout|503/i.test(raw) || status === 503;

    console.error('Gemini request failed', {
      status: status || undefined,
      category: leaked ? 'credential' : quota ? 'quota' : unavailable ? 'unavailable' : 'unknown',
    });

    if (leaked) {
      return res.status(503).json({
        error: {
          code: 'AI_CREDENTIAL_REJECTED',
          message: lang === 'ar' ? 'مفتاح خدمة الذكاء الاصطناعي غير صالح.' : 'کلیلی خزمەتگوزاریی AI نادروستە.',
        },
      });
    }

    if (quota) {
      return res.status(429).json({
        error: {
          code: 'AI_QUOTA_EXCEEDED',
          message: lang === 'ar' ? 'تم بلوغ حد استخدام خدمة الذكاء الاصطناعي.' : 'سنووری بەکارهێنانی خزمەتگوزاریی AI پڕ بووە.',
        },
      });
    }

    return res.status(unavailable ? 503 : 500).json({
      error: {
        code: unavailable ? 'AI_TEMPORARILY_UNAVAILABLE' : 'AI_REQUEST_FAILED',
        message: lang === 'ar' ? 'تعذر إكمال الطلب حالياً.' : 'ئێستا نەتوانرا داواکارییەکە تەواو بکرێت.',
      },
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use('/assets', express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(distPath, { index: false }));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Gate Iraq listening on port ${PORT}`);
  });
}

void startServer().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
