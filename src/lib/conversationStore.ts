import { Message } from '@/src/types/chat';
import { ServiceKey } from '@/src/types/services';

const STORAGE_KEY = 'ai_gate_iraq_conversations_v1';
const MAX_CONVERSATIONS = 50;

export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  service: ServiceKey;
  createdAt: number;
  updatedAt: number;
}

export function listConversations(): SavedConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is SavedConversation => Boolean(item?.id && Array.isArray(item?.messages)))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveConversation(messages: Message[], service: ServiceKey): SavedConversation | null {
  const meaningful = messages.filter((message) => message.text?.trim());
  if (meaningful.length <= 1) return null;

  const titleSource = meaningful.find((message) => message.role === 'user')?.text || meaningful[0]?.text || 'Conversation';
  const title = titleSource.replace(/\s+/g, ' ').trim().slice(0, 70);
  const now = Date.now();
  const conversation: SavedConversation = {
    id: `conv_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    messages: meaningful.slice(-100),
    service,
    createdAt: now,
    updatedAt: now,
  };

  const next = [conversation, ...listConversations()].slice(0, MAX_CONVERSATIONS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('ai-gate-conversations-change'));
  return conversation;
}

export function deleteConversation(id: string): void {
  const next = listConversations().filter((conversation) => conversation.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('ai-gate-conversations-change'));
}
