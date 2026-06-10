export interface Message {
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}

export interface BorderStatus {
  name: string;
  status: 'active' | 'busy' | 'closed';
  waitTime: string;
  description: string;
}

export const IRAN_BORDER_STATUS: BorderStatus[] = [
  { name: 'Ibrahim Khalil', status: 'active', waitTime: '4-6 hours', description: 'Normal operations with Turkey' },
  { name: 'Umm Qasr Port', status: 'active', waitTime: '2-3 days', description: 'Heavy vessel traffic' },
  { name: 'Erbil Airport', status: 'active', waitTime: '1-2 hours', description: 'Smooth cargo handling' },
];
