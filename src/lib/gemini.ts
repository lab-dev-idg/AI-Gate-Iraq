import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { app, auth, isFirebaseConfigured } from '@/src/lib/firebase';

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

const TRIAL_QUESTION_LIMIT = 3;
const TRIAL_LIMIT_EVENT = 'ai-gate-iraq:trial-limit';

function getTrialKey(): string {
  const identity = auth?.currentUser?.uid || 'anonymous';
  return `ai-gate-iraq:question-count:${identity}`;
}

function getQuestionCount(): number {
  const parsed = Number.parseInt(localStorage.getItem(getTrialKey()) || '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function showTrialLimit(): void {
  window.dispatchEvent(new Event(TRIAL_LIMIT_EVENT));
}

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

    if (!auth?.currentUser) {
      throw new Error('AUTH_REQUIRED');
    }

    if (getQuestionCount() >= TRIAL_QUESTION_LIMIT) {
      showTrialLimit();
      throw new Error('TRIAL_LIMIT_REACHED');
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
      const nextCount = getQuestionCount() + 1;
      localStorage.setItem(getTrialKey(), String(nextCount));
      if (nextCount >= TRIAL_QUESTION_LIMIT) {
        window.setTimeout(showTrialLimit, 250);
      }

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
      if (/TRIAL_LIMIT_REACHED/.test(raw)) throw new Error('TRIAL_LIMIT_REACHED');
      if (/AUTH_REQUIRED/.test(raw)) throw new Error('AUTH_REQUIRED');
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
