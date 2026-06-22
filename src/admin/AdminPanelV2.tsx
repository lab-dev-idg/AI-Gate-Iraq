import { useEffect, useState } from 'react';
import { AdminAccessGate } from './AdminAccessGate';
import { AdminLayout } from './AdminLayout';
import { AdminSectionKey, AdminState, AdminIntakeItem } from './adminTypes';
import {
  loadAdminState,
  resetAdminState,
  clearAdminState,
  updateIntakeStatus,
  updateIntakeNote,
  updateFeatureFlag,
  updateServiceConfig,
  reorderServiceConfig,
  addPromptConfig,
  deletePromptConfig,
  updatePromptConfig,
  reorderPromptConfig,
  addWorkflowStep,
  deleteWorkflowStep,
  updateWorkflowStep,
  reorderWorkflowStep,
  updateContentSection,
} from './adminStore';
import { AdminDashboard } from './screens/AdminDashboard';
import { IntakeManager } from './screens/IntakeManager';
import { ConversionOperations } from './screens/ConversionOperations';
import { AuditLog } from './screens/AuditLog';
import { AdminSettings } from './screens/AdminSettings';
import { ContentManager } from './screens/ContentManager';
import { ServiceManager } from './screens/ServiceManager';
import { PromptManager } from './screens/PromptManager';
import { WorkflowManager } from './screens/WorkflowManager';
import { LocalizationManager } from './screens/LocalizationManager';
import { FeatureFlagsManager } from './screens/FeatureFlagsManager';

export default function AdminPanelV2() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const [adminData, setAdminData] = useState<AdminState | null>(null);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('ai-gate-iraq-admin-auth') === 'true');
    setAdminData(loadAdminState());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAdminData(loadAdminState());
  };
  const handleLogout = () => {
    sessionStorage.removeItem('ai-gate-iraq-admin-auth');
    setIsAuthenticated(false);
  };
  const handleBackToApp = () => { window.location.href = '/'; };
  const handleUpdateStatus = (id: string, status: AdminIntakeItem['status']) => setAdminData(updateIntakeStatus(id, status));
  const handleUpdateNote = (id: string, note: string) => setAdminData(updateIntakeNote(id, note));
  const handleUpdateFlag = (key: string, enabled: boolean) => setAdminData(updateFeatureFlag(key, enabled));
  const handleResetAllData = () => setAdminData(resetAdminState());
  const handleClearAllData = () => { clearAdminState(); handleLogout(); };
  const handleUpdateContent = (id: string, patch: any) => setAdminData(updateContentSection(id, patch));
  const handleUpdateService = (key: string, patch: any) => setAdminData(updateServiceConfig(key, patch));
  const handleReorderService = (key: string, direction: 'up' | 'down') => setAdminData(reorderServiceConfig(key, direction));
  const handleAddPrompt = (serviceKey: string) => setAdminData(addPromptConfig(serviceKey));
  const handleDeletePrompt = (id: string) => setAdminData(deletePromptConfig(id));
  const handleUpdatePrompt = (id: string, patch: any) => setAdminData(updatePromptConfig(id, patch));
  const handleReorderPrompt = (id: string, direction: 'up' | 'down') => setAdminData(reorderPromptConfig(id, direction));
  const handleAddWorkflow = (serviceKey: string) => setAdminData(addWorkflowStep(serviceKey));
  const handleDeleteWorkflow = (id: string) => setAdminData(deleteWorkflowStep(id));
  const handleUpdateWorkflow = (id: string, patch: any) => setAdminData(updateWorkflowStep(id, patch));
  const handleReorderWorkflow = (id: string, direction: 'up' | 'down') => setAdminData(reorderWorkflowStep(id, direction));

  if (!isAuthenticated) {
    return <AdminAccessGate onSuccess={handleLoginSuccess} onBackToApp={handleBackToApp} />;
  }

  if (!adminData) {
    return <div className="min-h-screen bg-[#070b13] text-white flex items-center justify-center"><p className="text-xs text-slate-500 animate-pulse">زانیاریەکان باردەکرێن...</p></div>;
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection} onLogout={handleLogout} onBackToApp={handleBackToApp}>
      {activeSection === 'dashboard' && <AdminDashboard adminData={adminData} onSectionChange={setActiveSection} onResetData={handleResetAllData} />}
      {activeSection === 'intake' && <IntakeManager intakes={adminData.intake} onUpdateStatus={handleUpdateStatus} onUpdateNote={handleUpdateNote} />}
      {activeSection === 'conversions' && <ConversionOperations />}
      {activeSection === 'content' && <ContentManager contents={adminData.contents} onUpdateContent={handleUpdateContent} onResetToDefault={handleResetAllData} />}
      {activeSection === 'services' && <ServiceManager services={adminData.services} onUpdateService={handleUpdateService} onReorderService={handleReorderService} />}
      {activeSection === 'prompts' && <PromptManager prompts={adminData.prompts} services={adminData.services} onAddPrompt={handleAddPrompt} onDeletePrompt={handleDeletePrompt} onUpdatePrompt={handleUpdatePrompt} onReorderPrompt={handleReorderPrompt} />}
      {activeSection === 'workflows' && <WorkflowManager workflows={adminData.workflows} services={adminData.services} onAddWorkflow={handleAddWorkflow} onDeleteWorkflow={handleDeleteWorkflow} onUpdateWorkflow={handleUpdateWorkflow} onReorderWorkflow={handleReorderWorkflow} />}
      {activeSection === 'localization' && <LocalizationManager />}
      {activeSection === 'flags' && <FeatureFlagsManager flags={adminData.flags} onUpdateFlag={handleUpdateFlag} onResetToDefault={handleResetAllData} />}
      {activeSection === 'audit' && <AuditLog logs={adminData.logs} />}
      {activeSection === 'settings' && <AdminSettings adminData={adminData} onUpdateFlag={handleUpdateFlag} onResetAllData={handleResetAllData} onClearAllData={handleClearAllData} />}
    </AdminLayout>
  );
}
