export interface Message {
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}

export interface PromptChip {
  label: string;
  prompt: string;
}
