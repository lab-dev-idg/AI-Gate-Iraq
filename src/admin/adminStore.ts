import { AdminState, AdminServiceConfig, AdminPromptConfig, AdminWorkflowStep, AdminIntakeItem, AdminContentSection, AdminAuditLog } from './adminTypes';
import { DEFAULT_ADMIN_STATE } from './adminDefaults';

const STORAGE_KEY = 'ai-gate-iraq-admin-config-v1';

export function loadAdminState(): AdminState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with default state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_STATE));
      return DEFAULT_ADMIN_STATE;
    }
    const state = JSON.parse(raw);
    
    // Safety fallback for missing properties
    return {
      services: state.services || DEFAULT_ADMIN_STATE.services,
      prompts: state.prompts || DEFAULT_ADMIN_STATE.prompts,
      workflows: state.workflows || DEFAULT_ADMIN_STATE.workflows,
      flags: state.flags || DEFAULT_ADMIN_STATE.flags,
      intake: state.intake || DEFAULT_ADMIN_STATE.intake,
      contents: state.contents || DEFAULT_ADMIN_STATE.contents,
      logs: state.logs || DEFAULT_ADMIN_STATE.logs,
    };
  } catch (error) {
    console.error('Failed to load admin state from localStorage:', error);
    return DEFAULT_ADMIN_STATE;
  }
}

export function saveAdminState(state: AdminState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save admin state to localStorage:', error);
  }
}

export function resetAdminState(): AdminState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_STATE));
    return DEFAULT_ADMIN_STATE;
  } catch (error) {
    console.error('Failed to reset admin state:', error);
    return DEFAULT_ADMIN_STATE;
  }
}

export function clearAdminState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear admin state:', error);
  }
}

export function exportAdminState(): string {
  try {
    const state = loadAdminState();
    return JSON.stringify(state, null, 2);
  } catch (error) {
    console.error('Failed to export admin state:', error);
    return '{}';
  }
}

export function addAuditLog(
  action: string,
  entity: string,
  entityId: string | undefined,
  description: string
): AdminState {
  const state = loadAdminState();
  const newLog: AdminAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    actorName: 'سەرپەرشتیاری تاقیکاری (Admin)',
    action,
    entity,
    entityId,
    description,
    createdAt: new Date().toISOString()
  };
  
  const updatedState = {
    ...state,
    logs: [newLog, ...state.logs].slice(0, 50) // Keep last 50 entries
  };
  saveAdminState(updatedState);
  return updatedState;
}

export function updateServiceConfig(serviceKey: string, patch: Partial<AdminServiceConfig>): AdminState {
  const state = loadAdminState();
  const updatedServices = state.services.map(s => {
    if (s.key === serviceKey) {
      return { ...s, ...patch };
    }
    return s;
  });
  
  const updatedState = { ...state, services: updatedServices };
  saveAdminState(updatedState);
  
  addAuditLog(
    'نوێکردنەوە',
    'خزمەتگوزاری',
    serviceKey,
    `دەستکاریکردنی خزمەتگوزاری ${serviceKey}: ${JSON.stringify(patch)}`
  );
  
  return loadAdminState();
}

export function updatePromptConfig(promptId: string, patch: Partial<AdminPromptConfig>): AdminState {
  const state = loadAdminState();
  const updatedPrompts = state.prompts.map(p => {
    if (p.id === promptId) {
      return { ...p, ...patch };
    }
    return p;
  });
  
  const updatedState = { ...state, prompts: updatedPrompts };
  saveAdminState(updatedState);
  
  addAuditLog(
    'دەستکاری',
    'پرۆمپتی خێرا',
    promptId,
    `نوێکردنەوەی مۆدێلی پرۆمپتی خێرا: ${promptId}`
  );
  
  return loadAdminState();
}

export function updateWorkflowStep(stepId: string, patch: Partial<AdminWorkflowStep>): AdminState {
  const state = loadAdminState();
  const updatedWorkflows = state.workflows.map(w => {
    if (w.id === stepId) {
      return { ...w, ...patch };
    }
    return w;
  });
  
  const updatedState = { ...state, workflows: updatedWorkflows };
  saveAdminState(updatedState);
  
  addAuditLog(
    'نوێکردنەوە',
    'ڕێڕەوی کار',
    stepId,
    `دەستکاریکردنی هەنگاوی خولی کار: ${stepId}`
  );
  
  return loadAdminState();
}

export function updateFeatureFlag(flagKey: string, enabled: boolean): AdminState {
  const state = loadAdminState();
  const updatedFlags = state.flags.map(f => {
    if (f.key === flagKey) {
      return { ...f, enabled };
    }
    return f;
  });
  
  const updatedState = { ...state, flags: updatedFlags };
  saveAdminState(updatedState);
  
  addAuditLog(
    'گۆڕینی فڵاگ',
    'فڵاگی تایبەتمەندی',
    flagKey,
    `گۆڕینی دۆخی ${flagKey} بۆ ${enabled ? 'چالاک' : 'ناچالاک'}`
  );
  
  return loadAdminState();
}

export function updateIntakeStatus(intakeId: string, status: AdminIntakeItem['status']): AdminState {
  const state = loadAdminState();
  const updatedIntake = state.intake.map(i => {
    if (i.id === intakeId) {
      return { ...i, status, updatedAt: new Date().toISOString() };
    }
    return i;
  });
  
  const updatedState = { ...state, intake: updatedIntake };
  saveAdminState(updatedState);
  
  addAuditLog(
    'گۆڕینی دۆخی داواکاری',
    'داواکاری',
    intakeId,
    `گۆڕینی دۆخی داواکاری ${intakeId} بۆ ${status}`
  );
  
  return loadAdminState();
}

export function updateIntakeNote(intakeId: string, adminNote: string): AdminState {
  const state = loadAdminState();
  const updatedIntake = state.intake.map(i => {
    if (i.id === intakeId) {
      return { ...i, adminNote, updatedAt: new Date().toISOString() };
    }
    return i;
  });
  
  const updatedState = { ...state, intake: updatedIntake };
  saveAdminState(updatedState);
  
  addAuditLog(
    'نووسینی تێبینی',
    'داواکاری',
    intakeId,
    `زیادکردنی تێبینی ئادمین لەسەر داواکاری ${intakeId}`
  );
  
  return loadAdminState();
}

export function updateContentSection(sectionId: string, patch: Partial<AdminContentSection>): AdminState {
  const state = loadAdminState();
  const updatedContents = state.contents.map(c => {
    if (c.id === sectionId) {
      return { ...c, ...patch, updatedAt: new Date().toISOString() };
    }
    return c;
  });
  
  const updatedState = { ...state, contents: updatedContents };
  saveAdminState(updatedState);
  
  addAuditLog(
    'نوێکردنەوەی ناوەڕۆک',
    'بەشی ناوەڕۆک',
    sectionId,
    `دەستکاریکردنی تێکستی گشتی ناوەڕۆک بۆ ناسێنەری ${sectionId}`
  );
  
  return loadAdminState();
}

export function addPromptConfig(serviceKey: string, labelKu = 'پرۆمپتی نوێ', promptKu = 'پرسیاری نوێ؟'): AdminState {
  const state = loadAdminState();
  const nextId = `p-${Date.now()}`;
  const nextOrder = state.prompts.filter(p => p.serviceKey === serviceKey).length + 1;
  const newPrompt: AdminPromptConfig = {
    id: nextId,
    serviceKey,
    labelKu,
    labelAr: 'عنوان زر جديد',
    promptKu,
    promptAr: 'طلب جديد هنا؟',
    enabled: true,
    order: nextOrder
  };
  const updatedState = {
    ...state,
    prompts: [...state.prompts, newPrompt]
  };
  saveAdminState(updatedState);
  addAuditLog('زیادکردنی پرۆمپت', 'پرۆمپتی خێرا', nextId, `پرۆمپتێکی نوێ زیادکرا بۆ ${serviceKey}`);
  return loadAdminState();
}

export function deletePromptConfig(promptId: string): AdminState {
  const state = loadAdminState();
  const updatedPrompts = state.prompts.filter(p => p.id !== promptId);
  const updatedState = { ...state, prompts: updatedPrompts };
  saveAdminState(updatedState);
  addAuditLog('سڕینەوەی پرۆمپت', 'پرۆمپتی خێرا', promptId, `پرۆمپتی ${promptId} سڕدرایەوە`);
  return loadAdminState();
}

export function reorderPromptConfig(promptId: string, direction: 'up' | 'down'): AdminState {
  const state = loadAdminState();
  const index = state.prompts.findIndex(p => p.id === promptId);
  if (index === -1) return state;
  const targetKey = state.prompts[index].serviceKey;
  
  const servicePrompts = state.prompts.filter(p => p.serviceKey === targetKey).sort((a,b) => a.order - b.order);
  const localIndex = servicePrompts.findIndex(p => p.id === promptId);
  if (direction === 'up' && localIndex > 0) {
    const temp = servicePrompts[localIndex].order;
    servicePrompts[localIndex].order = servicePrompts[localIndex - 1].order;
    servicePrompts[localIndex - 1].order = temp;
  } else if (direction === 'down' && localIndex < servicePrompts.length - 1) {
    const temp = servicePrompts[localIndex].order;
    servicePrompts[localIndex].order = servicePrompts[localIndex + 1].order;
    servicePrompts[localIndex + 1].order = temp;
  }
  
  const updatedPrompts = state.prompts.map(p => {
    const servicePrompt = servicePrompts.find(sp => sp.id === p.id);
    return servicePrompt ? { ...p, order: servicePrompt.order } : p;
  });
  
  const updatedState = { ...state, prompts: updatedPrompts };
  saveAdminState(updatedState);
  addAuditLog('ڕیزبەندکردنی پرۆمپت', 'پرۆمپتی خێرا', promptId, `گۆڕینی ڕیزبەندی پرۆمپتی ${promptId}`);
  return loadAdminState();
}

export function addWorkflowStep(serviceKey: string, titleKu = 'هەنگاوی شیکاری نوێ', descriptionKu = 'وەسفی وردەکاری بۆ ئەم هەنگاوە'): AdminState {
  const state = loadAdminState();
  const nextId = `ws-${Date.now()}`;
  const nextOrder = state.workflows.filter(w => w.serviceKey === serviceKey).length + 1;
  const newWorkflow: AdminWorkflowStep = {
    id: nextId,
    serviceKey,
    titleKu,
    titleAr: 'خطوة عمل جديدة',
    descriptionKu,
    descriptionAr: 'الوصف الخاص بالخطوة الجديدة لمساعد الويكي',
    order: nextOrder,
    enabled: true
  };
  const updatedState = {
    ...state,
    workflows: [...state.workflows, newWorkflow]
  };
  saveAdminState(updatedState);
  addAuditLog('زیادکردنی هەنگاو', 'ڕێڕەوی کار', nextId, `هەنگاوێکی نوێ زیادکرا بۆ دۆسیەی ${serviceKey}`);
  return loadAdminState();
}

export function deleteWorkflowStep(stepId: string): AdminState {
  const state = loadAdminState();
  const updatedWorkflows = state.workflows.filter(w => w.id !== stepId);
  const updatedState = { ...state, workflows: updatedWorkflows };
  saveAdminState(updatedState);
  addAuditLog('سڕینەوەی هەنگاو', 'ڕێڕەوی کار', stepId, `هەنگاوی ${stepId} سڕدرایەوە`);
  return loadAdminState();
}

export function reorderWorkflowStep(stepId: string, direction: 'up' | 'down'): AdminState {
  const state = loadAdminState();
  const index = state.workflows.findIndex(w => w.id === stepId);
  if (index === -1) return state;
  const targetKey = state.workflows[index].serviceKey;
  
  const serviceSteps = state.workflows.filter(w => w.serviceKey === targetKey).sort((a,b) => a.order - b.order);
  const localIndex = serviceSteps.findIndex(w => w.id === stepId);
  if (direction === 'up' && localIndex > 0) {
    const temp = serviceSteps[localIndex].order;
    serviceSteps[localIndex].order = serviceSteps[localIndex - 1].order;
    serviceSteps[localIndex - 1].order = temp;
  } else if (direction === 'down' && localIndex < serviceSteps.length - 1) {
    const temp = serviceSteps[localIndex].order;
    serviceSteps[localIndex].order = serviceSteps[localIndex + 1].order;
    serviceSteps[localIndex + 1].order = temp;
  }
  
  const updatedWorkflows = state.workflows.map(w => {
    const serviceStep = serviceSteps.find(ss => ss.id === w.id);
    return serviceStep ? { ...w, order: serviceStep.order } : w;
  });
  
  const updatedState = { ...state, workflows: updatedWorkflows };
  saveAdminState(updatedState);
  addAuditLog('ڕیزبەندکردنی ڕێڕەو', 'ڕێڕەوی کار', stepId, `گۆڕینی ڕیزبەندی هەنگاوی ${stepId}`);
  return loadAdminState();
}

export function reorderServiceConfig(serviceKey: string, direction: 'up' | 'down'): AdminState {
  const state = loadAdminState();
  const sorted = [...state.services].sort((a,b) => a.order - b.order);
  const index = sorted.findIndex(s => s.key === serviceKey);
  if (index === -1) return state;
  if (direction === 'up' && index > 0) {
    const temp = sorted[index].order;
    sorted[index].order = sorted[index - 1].order;
    sorted[index - 1].order = temp;
  } else if (direction === 'down' && index < sorted.length - 1) {
    const temp = sorted[index].order;
    sorted[index].order = sorted[index + 1].order;
    sorted[index + 1].order = temp;
  }
  
  // Re-map correct orders
  const updatedServices = sorted.map((s, idx) => ({ ...s, order: idx + 1 }));
  const updatedState = { ...state, services: updatedServices };
  saveAdminState(updatedState);
  addAuditLog('ڕیزبەندکردنی خزمەتگوزاری', 'خزمەتگوزاری', serviceKey, `گۆڕینی ڕیزبەندی خزمەتگوزاری ${serviceKey}`);
  return loadAdminState();
}

export function getAdminPromptChips(serviceKey: string, lang: 'ku' | 'ar') {
  try {
    const state = loadAdminState();
    const servicePrompts = state.prompts.filter(p => p.serviceKey === serviceKey && p.enabled);
    if (servicePrompts.length > 0) {
      return servicePrompts
        .sort((a,b) => a.order - b.order)
        .map(p => ({
          label: lang === 'ar' ? p.labelAr : p.labelKu,
          prompt: lang === 'ar' ? p.promptAr : p.promptKu
        }));
    }
  } catch (e) {
    // fallback
  }
  return null;
}

export function getAdminServiceConfig(serviceKey: string, lang: 'ku' | 'ar') {
  try {
    const state = loadAdminState();
    const service = state.services.find(s => s.key === serviceKey);
    if (service && service.enabled) {
      return {
        title: lang === 'ar' ? service.titleAr : service.titleKu,
        description: lang === 'ar' ? service.descriptionAr : service.descriptionKu,
        pilotNote: lang === 'ar' ? service.pilotNoteAr : service.pilotNoteKu,
        status: service.status,
        visible: service.visible,
        order: service.order
      };
    }
  } catch (e) {
    // fallback
  }
  return null;
}

export function getAdminFeatureFlagEnabled(flagKey: string, defaultVal = true): boolean {
  try {
    const state = loadAdminState();
    const flag = state.flags.find(f => f.key === flagKey);
    if (flag) return flag.enabled;
  } catch (e) {
    // fallback
  }
  return defaultVal;
}
