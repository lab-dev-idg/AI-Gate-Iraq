export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const chatApiUrl = apiBaseUrl ? `${apiBaseUrl}/api/gemini/chat` : '/api/gemini/chat';

class ChatProxy {
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
    this.history.push({ role: 'user', text: message });

    try {
      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.history,
          activeService,
          lang,
          userMessage: message,
          serviceHint,
          workflowContext,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('AI_ENDPOINT_MISCONFIGURED');
      }

      const data = await response.json();

      if (!response.ok) {
        const code = data?.error?.code;
        if (response.status === 429) throw new Error('AI_QUOTA_EXCEEDED');
        throw new Error(code || `AI_HTTP_${response.status}`);
      }

      const text = typeof data?.text === 'string' ? data.text.trim() : '';
      if (!text) throw new Error('EMPTY_AI_RESPONSE');

      this.history.push({ role: 'model', text });

      return {
        text,
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: data.groundingChunks,
            },
          },
        ],
      };
    } catch (error) {
      this.history.pop();
      throw error;
    }
  }

  reset() {
    this.history = [];
  }

  getHistory(): ChatMessage[] {
    return this.history;
  }
}

export const chat = new ChatProxy();
