export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

class ChatProxy {
  private history: ChatMessage[] = [];

  async sendMessage({ message }: { message: string }) {
    // Add user message to history
    this.history.push({ role: 'user', text: message });

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: this.history })
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore parse errors on raw status failures
        }

        if (response.status === 429 || errorData?.error?.code === "RESOURCE_EXHAUSTED") {
          throw new Error("QUOTA_EXHAUSTED");
        }
        
        const errMsg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      
      // Add assistant response to history
      this.history.push({ role: 'model', text: data.text || "" });

      return {
        text: data.text,
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: data.groundingChunks
            }
          }
        ]
      };
    } catch (error) {
      // Remove last user message on failure so the user keeps a synchronized state
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
