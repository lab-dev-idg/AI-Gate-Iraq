export * from './types/services';
export * from './types/chat';
export * from './types/app';
export * from './types/session';

import { BorderStatus } from './types/services';

export const IRAN_BORDER_STATUS: BorderStatus[] = [
  { name: 'Ibrahim Khalil', status: 'active', waitTime: '4-6 hours', description: 'Normal operations with Turkey' },
  { name: 'Umm Qasr Port', status: 'active', waitTime: '2-3 days', description: 'Heavy vessel traffic' },
  { name: 'Erbil Airport', status: 'active', waitTime: '1-2 hours', description: 'Smooth cargo handling' },
];
