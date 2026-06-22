import { useEffect, useState } from 'react';
import { AdminAccessGate } from './AdminAccessGate';
import { AdminLayout } from './AdminLayout';
import { AdminSectionKey, AdminState, AdminIntakeItem } from './adminTypes';
import {
  loadAdminState, resetAdminState, clearAdminState, updateIntakeStatus, updateIntakeNote,
  updateFeatureFlag, updateServiceConfig, reorderServiceConfig, addPromptConfig,
  deletePromptConfig, updatePromptConfig, reorderPromptConfig, addWorkflowStep,
  deleteWorkflowStep, updateWorkflowStep, reorderWorkflowStep, updateContentSection,
} from './adminStore';
import { AdminDashboard } from './screens/AdminDashboard';
import { IntakeManager } from './screens/IntakeManager';
import { ConversionOperationsApi } from './screens/ConversionOperationsApi';
import { AuditLog } from './screens/AuditLog';
import { AdminSettings } from './screens/AdminSettings';
import { ContentManager } from './screens/ContentManager';
import { ServiceManager } from './screens/ServiceManager';
import { PromptManager } from './screens/PromptManager';
import { WorkflowManager } from './screens/WorkflowManager';
import { LocalizationManager } from './screens/LocalizationManager';
import { FeatureFlagsManager } from './screens/FeatureFlagsManager';

export default function AdminPanelV3() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const [adminData, setAdminData] = useState<AdminState | null>(null);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('ai-gate-iraq-admin-auth') === 'true');
    setAdminData(loadAdminState());
  }, []);

  const logout = () => {
    sessionStorage.removeItem('ai-gate-iraq-admin-auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAccessGate onSuccess={() => { setIsAuthenticated(true); setAdminData(loadAdminState()); }} onBackToApp={() => { window.location.href = '/'; }} />;
  }

  if (!adminData) {
    return <div className="min-h-screen bg-[#070b13] text-white flex items-center justify-center"><p className="text-xs text-slate-500 animate-pulse">زانیاریەکان باردەکرێن...</p></div>;
  }

  const updateStatus = (id: string, status: AdminIntakeItem['status']) => setAdminData(updateIntakeStatus(id, status));

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection} onLogout={logout} onBackToApp={() => { window.location.href = '/'; }}>
      {activeSection === 'dashboard' && <AdminDashboard adminData={adminData} onSectionChange={setActiveSection} onResetData={() => setAdminData(resetAdminState())} />}
      {activeSection === 'intake' && <IntakeManager intakes={adminData.intake} onUpdateStatus={updateStatus} onUpdateNote={(id, note) => setAdminData(updateIntakeNote(id, note))} />}
      {activeSection === 'conversions' && <ConversionOperationsApi />}
      {activeSection === 'content' && <ContentManager contents={adminData.contents} onUpdateContent={(id, patch) => setAdminData(updateContentSection(id, patch))} onResetToDefault={() => setAdminData(resetAdminState())} />}
      {activeSection === 'services' && <ServiceManager services={adminData.services} onUpdateService={(key, patch) => setAdminData(updateServiceConfig(key, patch))} onReorderService={(key, direction) => setAdminData(reorderServiceConfig(key, direction))} />}
      {activeSection === 'prompts' && <PromptManager prompts={adminData.prompts} services={adminData.services} onAddPrompt={(serviceKey) => setAdminData(addPromptConfig(serviceKey))} onDeletePrompt={(id) => setAdminData(deletePromptConfig(id))} onUpdatePrompt={(id, patch) => setAdminData(updatePromptConfig(id, patch))} onReorderPrompt={(id, direction) => setAdminData(reorderPromptConfig(id, direction))} />}
      {activeSection === 'workflows' && <WorkflowManager workflows={adminData.workflows} services={adminData.services} onAddWorkflow={(serviceKey) => setAdminData(addWorkflowStep(serviceKey))} onDeleteWorkflow={(id) => setAdminData(deleteWorkflowStep(id))} onUpdateWorkflow={(id, patch) => setAdminData(updateWorkflowStep(id, patch))} onReorderWorkflow={(id, direction) => setAdminData(reorderWorkflowStep(id, direction))} />}
      {activeSection === 'localization' && <LocalizationManager />}
      {activeSection === 'flags' && <FeatureFlagsManager flags={adminData.flags} onUpdateFlag={(key, enabled) => setAdminData(updateFeatureFlag(key, enabled))} onResetToDefault={() => setAdminData(resetAdminState())} />}
      {activeSection === 'audit' && <AuditLog logs={adminData.logs} />}
      {activeSection === 'settings' && <AdminSettings adminData={adminData} onUpdateFlag={(key, enabled) => setAdminData(updateFeatureFlag(key, enabled))} onResetAllData={() => setAdminData(resetAdminState())} onClearAllData={() => { clearAdminState(); logout(); }} />}
    </AdminLayout>
  );
}
