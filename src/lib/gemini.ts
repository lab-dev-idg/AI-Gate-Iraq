import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { app, isFirebaseConfigured } from '@/src/lib/firebase';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const modelName = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash')
  .replace(/^models\//, '')
  .replace(/^['"]|['"]$/g, '')
  .trim();

const SYSTEM_INSTRUCTION = `You are the AI Gate Iraq business assistant for trade, import, export and logistics in Iraq.
Respond in the user's selected language: Kurdish Sorani, Arabic, or English. Be practical, distinguish verified facts from estimates, never invent live prices or legal status, and advise verification with the relevant authority for legal, customs and financial matters.`;

class FirebaseAIChat {
  private history: ChatMessage[] = [];

  async sendMessage({
    message,
    activeService,
    lang,
    serviceHint,
    workflowContext,
  }: {
    message: string;
    activeService?: string;
    lang?: string;
    serviceHint?: string;
    workflowContext?: unknown;
  }) {
    if (!isFirebaseConfigured || !app) {
      throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    const pendingHistory = [...this.history, { role: 'user' as const, text: message }];
    const requestedLanguage = lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : 'Kurdish Sorani';
    const context = [
      activeService ? `Active service: ${activeService}` : '',
      serviceHint ? `Service hint: ${String(serviceHint).slice(0, 1000)}` : '',
      workflowContext ? `Workflow context: ${JSON.stringify(workflowContext).slice(0, 5000)}` : '',
      `Requested language: ${requestedLanguage}`,
    ].filter(Boolean).join('\n');

    try {
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, {
        model: modelName,
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${context}`,
      });

      const result = await model.generateContent({
        contents: pendingHistory.slice(-40).map((item) => ({
          role: item.role,
          parts: [{ text: item.text.slice(0, 12000) }],
        })),
      });

      const text = result.response.text().trim();
      if (!text) throw new Error('EMPTY_AI_RESPONSE');

      this.history = [...pendingHistory, { role: 'model', text }];

      return {
        text,
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [],
            },
          },
        ],
      };
    } catch (error) {
      const raw = String(error instanceof Error ? error.message : error);
      if (/quota|resource_exhausted|429/i.test(raw)) throw new Error('AI_QUOTA_EXCEEDED');
      if (/permission|unauthorized|forbidden|403|api.?key/i.test(raw)) throw new Error('AI_CREDENTIAL_REJECTED');
      if (/not configured|firebase/i.test(raw)) throw new Error('AI_NOT_CONFIGURED');
      throw new Error('AI_REQUEST_FAILED');
    }
  }

  reset() {
    this.history = [];
  }

  getHistory(): ChatMessage[] {
    return this.history;
  }
}

export const chat = new FirebaseAIChat();
