import { LucideIcon } from 'lucide-react';

export type ServiceKey =
  | 'assistant'
  | 'market'
  | 'borders'
  | 'currency'
  | 'cost'
  | 'kyc'
  | 'procurement'
  | 'tracking'
  | 'map';

export interface BorderStatus {
  name: string;
  status: 'active' | 'busy' | 'closed';
  waitTime: string;
  description: string;
}

export interface ServiceItem {
  key: ServiceKey;
  label_ku: string;
  label_ar: string;
  icon: LucideIcon;
  color: string;
}
