import { ServiceKey } from './services';
import { Message } from './chat';

export interface RecentPrompt {
  id: string;
  text: string;
  serviceKey: ServiceKey;
  timestamp: number;
}

export interface RecentServiceAction {
  id: string;
  actionName: string;
  serviceKey: ServiceKey;
  timestamp: number;
}

export interface SessionDrafts {
  currencyAmount?: string;
  currencyFrom?: string;
  currencyTo?: string;
  costWeight?: string;
  costVolume?: string;
  costCargoType?: string;
  costOrigin?: string;
  costDestination?: string;
  trackingNumber?: string;
  procurementCategory?: string;
  procurementSpecs?: string;
  procurementQty?: string;
  kycCompanyName?: string;
  kycCompanyType?: string;
  kycDirectorName?: string;
  kycTaxId?: string;
}

export interface BusinessSession {
  version: string;
  activeService: ServiceKey;
  chatScope: ServiceKey;
  language: 'ku' | 'ar';
  chatMessages: Message[];
  recentPrompts: RecentPrompt[];
  recentServiceActions: RecentServiceAction[];
  drafts: SessionDrafts;
  updatedAt: number;
}
