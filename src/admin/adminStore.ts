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
