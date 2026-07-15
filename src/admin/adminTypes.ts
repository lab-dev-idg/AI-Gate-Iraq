export type AdminRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type AdminSectionKey =
  | 'dashboard'
  | 'intake'
  | 'conversions'
  | 'subscriptions'
  | 'content'
  | 'services'
  | 'prompts'
  | 'workflows'
  | 'localization'
  | 'flags'
  | 'audit'
  | 'settings';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  lastLoginAt: string;
}

export interface AdminAuditLog {
  id: string;
  actorName: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  createdAt: string;
}

export interface AdminServiceConfig {
  id: string;
  key: string;
  titleKu: string;
  titleAr: string;
  titleEn: string;
  descriptionKu: string;
  descriptionAr: string;
  descriptionEn: string;
  enabled: boolean;
  visible: boolean;
  order: number;
  status: 'active' | 'demo_only' | 'coming_soon' | 'disabled';
  pilotNoteKu?: string;
  pilotNoteAr?: string;
  adminNote?: string;
}

export interface AdminPromptConfig {
  id: string;
  serviceKey: string;
  labelKu: string;
  labelAr: string;
  promptKu: string;
  promptAr: string;
  enabled: boolean;
  order: number;
}

export interface AdminWorkflowStep {
  id: string;
  serviceKey: string;
  titleKu: string;
  titleAr: string;
  descriptionKu: string;
  descriptionAr: string;
  order: number;
  enabled: boolean;
}

export interface AdminFeatureFlag {
  key: string;
  labelKu: string;
  descriptionKu: string;
  enabled: boolean;
}

export interface AdminIntakeItem {
  id: string;
  name: string;
  company: string;
  contact: string;
  serviceInterest: string;
  category: string;
  message: string;
  status: 'new' | 'reviewing' | 'contacted' | 'closed' | 'archived';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContentSection {
  id: string;
  key: string;
  titleKu: string;
  titleAr: string;
  bodyKu: string;
  bodyAr: string;
  visible: boolean;
  updatedAt: string;
}

export interface AdminState {
  services: AdminServiceConfig[];
  prompts: AdminPromptConfig[];
  workflows: AdminWorkflowStep[];
  flags: AdminFeatureFlag[];
  intake: AdminIntakeItem[];
  contents: AdminContentSection[];
  logs: AdminAuditLog[];
}
