import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Sliders,
  Settings,
  Sparkles,
  Inbox,
  Briefcase,
  FileText,
  Logs,
  Globe2,
  Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  updateContentSection
} from './adminStore';

// Import our newly created Kurdish Super Admin screens
import { AdminDashboard } from './screens/AdminDashboard';
import { IntakeManager } from './screens/IntakeManager';
import { AuditLog } from './screens/AuditLog';
import { AdminSettings } from './screens/AdminSettings';

// Patch 3 Control Managers
import { ContentManager } from './screens/ContentManager';
import { ServiceManager } from './screens/ServiceManager';
import { PromptManager } from './screens/PromptManager';
import { WorkflowManager } from './screens/WorkflowManager';
import { LocalizationManager } from './screens/LocalizationManager';
import { FeatureFlagsManager } from './screens/FeatureFlagsManager';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const [adminData, setAdminData] = useState<AdminState | null>(null);

  // Authenticate session check
  useEffect(() => {
    const isAuth = sessionStorage.getItem('ai-gate-iraq-admin-auth') === 'true';
    setIsAuthenticated(isAuth);
    
    // Read the current schema state/configs
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

  const handleBackToApp = () => {
    window.location.href = '/';
  };

  // State actions that refresh state
  const handleUpdateStatus = (id: string, status: AdminIntakeItem['status']) => {
    const updated = updateIntakeStatus(id, status);
    setAdminData(updated);
  };

  const handleUpdateNote = (id: string, note: string) => {
    const updated = updateIntakeNote(id, note);
    setAdminData(updated);
  };

  const handleUpdateFlag = (key: string, enabled: boolean) => {
    const updated = updateFeatureFlag(key, enabled);
    setAdminData(updated);
  };

  const handleResetAllData = () => {
    const fresh = resetAdminState();
    setAdminData(fresh);
  };

  const handleClearAllData = () => {
    clearAdminState();
    handleLogout();
  };

  // Content manager handler
  const handleUpdateContent = (id: string, patch: any) => {
    const updated = updateContentSection(id, patch);
    setAdminData(updated);
  };

  // Service manager handlers
  const handleUpdateService = (key: string, patch: any) => {
    const updated = updateServiceConfig(key, patch);
    setAdminData(updated);
  };

  const handleReorderService = (key: string, direction: 'up' | 'down') => {
    const updated = reorderServiceConfig(key, direction);
    setAdminData(updated);
  };

  // Prompt manager handlers
  const handleAddPrompt = (serviceKey: string) => {
    const updated = addPromptConfig(serviceKey);
    setAdminData(updated);
  };

  const handleDeletePrompt = (id: string) => {
    const updated = deletePromptConfig(id);
    setAdminData(updated);
  };

  const handleUpdatePrompt = (id: string, patch: any) => {
    const updated = updatePromptConfig(id, patch);
    setAdminData(updated);
  };

  const handleReorderPrompt = (id: string, direction: 'up' | 'down') => {
    const updated = reorderPromptConfig(id, direction);
    setAdminData(updated);
  };

  // Workflow manager handlers
  const handleAddWorkflow = (serviceKey: string) => {
    const updated = addWorkflowStep(serviceKey);
    setAdminData(updated);
  };

  const handleDeleteWorkflow = (id: string) => {
    const updated = deleteWorkflowStep(id);
    setAdminData(updated);
  };

  const handleUpdateWorkflow = (id: string, patch: any) => {
    const updated = updateWorkflowStep(id, patch);
    setAdminData(updated);
  };

  const handleReorderWorkflow = (id: string, direction: 'up' | 'down') => {
    const updated = reorderWorkflowStep(id, direction);
    setAdminData(updated);
  };

  // If not authenticated, render the access code barrier
  if (!isAuthenticated) {
    return (
      <AdminAccessGate
        onSuccess={handleLoginSuccess}
        onBackToApp={handleBackToApp}
      />
    );
  }

  // Ensure adminData is loaded
  if (!adminData) {
    return (
      <div className="min-h-screen bg-[#070b13] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500 animate-pulse">زانیاریەکان باردەکرێن...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogout={handleLogout}
      onBackToApp={handleBackToApp}
    >
      {/* 1. Dynamic Route/Screen switcher */}
      {activeSection === 'dashboard' && (
        <AdminDashboard
          adminData={adminData}
          onSectionChange={setActiveSection}
          onResetData={handleResetAllData}
        />
      )}

      {activeSection === 'intake' && (
        <IntakeManager
          intakes={adminData.intake}
          onUpdateStatus={handleUpdateStatus}
          onUpdateNote={handleUpdateNote}
        />
      )}

      {activeSection === 'content' && (
        <ContentManager
          contents={adminData.contents}
          onUpdateContent={handleUpdateContent}
          onResetToDefault={handleResetAllData}
        />
      )}

      {activeSection === 'services' && (
        <ServiceManager
          services={adminData.services}
          onUpdateService={handleUpdateService}
          onReorderService={handleReorderService}
        />
      )}

      {activeSection === 'prompts' && (
        <PromptManager
          prompts={adminData.prompts}
          services={adminData.services}
          onAddPrompt={handleAddPrompt}
          onDeletePrompt={handleDeletePrompt}
          onUpdatePrompt={handleUpdatePrompt}
          onReorderPrompt={handleReorderPrompt}
        />
      )}

      {activeSection === 'workflows' && (
        <WorkflowManager
          workflows={adminData.workflows}
          services={adminData.services}
          onAddWorkflow={handleAddWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          onUpdateWorkflow={handleUpdateWorkflow}
          onReorderWorkflow={handleReorderWorkflow}
        />
      )}

      {activeSection === 'localization' && (
        <LocalizationManager />
      )}

      {activeSection === 'flags' && (
        <FeatureFlagsManager
          flags={adminData.flags}
          onUpdateFlag={handleUpdateFlag}
          onResetToDefault={handleResetAllData}
        />
      )}

      {activeSection === 'audit' && (
        <AuditLog
          logs={adminData.logs}
        />
      )}

      {activeSection === 'settings' && (
        <AdminSettings
          adminData={adminData}
          onUpdateFlag={handleUpdateFlag}
          onResetAllData={handleResetAllData}
          onClearAllData={handleClearAllData}
        />
      )}
    </AdminLayout>
  );
}
