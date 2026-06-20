import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { corsMiddleware } from './src/server/cors';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const apiKey = process.env.GEMINI_API_KEY?.trim();
const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash')
  .replace(/^models\//, '')
  .replace(/^['"]|['"]$/g, '')
  .trim();

app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `تۆ یاریدەدەری بازرگانی AI Gate Iraq ـیت بۆ بازرگانی، هاوردەکردن، هەناردەکردن و لۆجیستیک لە عێراق.

ڕێسا:
1. بە زمانی بەکارهێنەر وەڵام بدەرەوە؛ کوردی سۆرانی یان عەرەبی.
2. وەڵامەکان ڕوون، کردارەکی و بە بەشە ژمارەکراوەکان بن.
3. هیچ نرخ، دۆخی مەرز، یاسا یان داتای live بە درۆ دروست مەکە.
4. هەر خەمڵاندنێک بە ڕوونی وەک خەمڵاندن دیاری بکە و داوای زانیاریی سەرچاوە بکە.
5. هیچ Quote ID، پاشەکەوتی ڕێژەیی یان نرخێکی ساختە دروست مەکە.
6. بۆ زانیاریی یاسایی، گومرگی و دارایی ئاگاداری پشتڕاستکردنەوە لە دەزگای پەیوەندیدار زیاد بکە.
7. لە پرسیاری گومرگ، باج یان تۆمارکردنی ئۆتۆمبێلدا، بەهۆی نەبوونی نرخی live وەڵام ڕەت مەکەوە؛ سەرەتا پێکهاتەی گشتی و هەنگاوەکان ڕوون بکەرەوە، پاشان ساڵی دروستکردن، جۆر، قەبارەی بزوێنەر، نرخی کڕین، وڵاتی سەرچاوە و دەروازەی هاتن داوا بکە.
8. جیاوازی نێوان زانیاریی پشتڕاستکراو، خەمڵاندن و ڕێنمایی گشتی بە ڕوونی نیشان بدە.`;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-gate-iraq', modelConfigured: Boolean(apiKey) });
});

app.post('/api/gemini/chat', async (req, res) => {
  const { messages, activeService, lang, serviceHint, workflowContext } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: { code: 'INVALID_REQUEST', message: 'داواکارییەکە دروست نییە.' },
    });
  }

  if (!ai || !apiKey) {
    return res.status(503).json({
      error: {
        code: 'AI_NOT_CONFIGURED',
        message: lang === 'ar'
          ? 'خدمة المساعد الذكي غير مهيأة حالياً.'
          : 'خزمەتگوزاریی یاریدەدەری زیرەک ئێستا ڕێکنەخراوە.',
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
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${context}`,
      },
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
          message: lang === 'ar'
            ? 'مفتاح خدمة الذكاء الاصطناعي غير صالح وتم إيقافه أمنياً. تعمل الإدارة على استبداله.'
            : 'کلیلی خزمەتگوزاریی AI نادروستە و بۆ پاراستن ناچالاک کراوە؛ بەڕێوەبەر کلیلی نوێ دادەنێت.',
        },
      });
    }

    if (quota) {
      return res.status(429).json({
        error: {
          code: 'AI_QUOTA_EXCEEDED',
          message: lang === 'ar'
            ? 'تم بلوغ حد استخدام خدمة الذكاء الاصطناعي. حاول لاحقاً.'
            : 'سنووری بەکارهێنانی خزمەتگوزاریی AI پڕ بووە؛ تکایە دواتر هەوڵ بدەوە.',
        },
      });
    }

    return res.status(unavailable ? 503 : 500).json({
      error: {
        code: unavailable ? 'AI_TEMPORARILY_UNAVAILABLE' : 'AI_REQUEST_FAILED',
        message: lang === 'ar'
          ? 'تعذر إكمال الطلب حالياً. حاول مرة أخرى لاحقاً.'
          : 'ئێستا نەتوانرا داواکارییەکە تەواو بکرێت؛ تکایە دواتر دووبارە هەوڵ بدەوە.',
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
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
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
