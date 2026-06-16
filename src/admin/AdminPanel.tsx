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
  updateFeatureFlag
} from './adminStore';

// Import our newly created Kurdish Super Admin screens
import { AdminDashboard } from './screens/AdminDashboard';
import { IntakeManager } from './screens/IntakeManager';
import { AuditLog } from './screens/AuditLog';
import { AdminSettings } from './screens/AdminSettings';

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

      {/* Screens that will be built in Patch 3 (Placeholders for now) */}
      {activeSection !== 'dashboard' &&
        activeSection !== 'intake' &&
        activeSection !== 'audit' &&
        activeSection !== 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-900/45 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 space-y-3 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs font-bold leading-normal">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Super Admin Control Center</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white">
                  کۆنترۆڵ کردنی: {
                    activeSection === 'content' ? 'ناوەڕۆک' :
                    activeSection === 'services' ? 'خزمەتگوزارییەکان' :
                    activeSection === 'prompts' ? 'پرۆمپتەکان' :
                    activeSection === 'workflows' ? 'ڕێڕەوی کار' :
                    activeSection === 'localization' ? 'زمانەکان' : 'فڵاگی تایبەتمەندی'
                  }
                </h1>
                <p className="text-xs md:text-sm text-slate-400 font-medium max-w-2xl leading-relaxed">
                  ئەم بەشە لە پاچی کۆتاییدا (Patch 3) بەتەواوی بەستراوە دەکرێت بۆ نوسینەوە و ڕێکخستنی سەرجەم بابەتەکانی سەر ڕوکاری سەرەکی بە شێوەی دینامیکی.
                </p>
              </div>
            </div>

            <Card className="bg-slate-900/10 border-slate-800/60 p-8 md:p-12 text-center rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                {(() => {
                  switch (activeSection) {
                    case 'content': return <FileText className="w-8 h-8" />;
                    case 'services': return <Briefcase className="w-8 h-8" />;
                    case 'prompts': return <Sparkles className="w-8 h-8" />;
                    case 'workflows': return <Sliders className="w-8 h-8" />;
                    case 'localization': return <Globe2 className="w-8 h-8" />;
                    case 'flags': return <ShieldAlert className="w-8 h-8" />;
                    default: return <Layers className="w-8 h-8" />;
                  }
                })()}
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-white">مۆدێلی نەخشەی کار (Data Spec)</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  مۆدێلی زانیاری پێویست بۆ ئەم ڕوپەڕە بەسەرکەوتوویی لەگەڵ `adminStore` دا دابین کراوە و لە پاچی داهاتوودا نوێ دەکرێتەوە.
                </p>
              </div>
            </Card>
          </div>
        )}
    </AdminLayout>
  );
}
