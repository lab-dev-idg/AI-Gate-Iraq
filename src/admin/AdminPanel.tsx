import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Sliders,
  Settings,
  ArrowUpRight,
  Sparkles,
  Inbox,
  Briefcase,
  FileText,
  Logs,
  Globe2,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminAccessGate } from './AdminAccessGate';
import { AdminLayout } from './AdminLayout';
import { AdminSectionKey, AdminState } from './adminTypes';
import { loadAdminState, resetAdminState } from './adminStore';

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
    // Return to the main portal by refreshing or replacing route
    window.location.href = '/';
  };

  const handleResetData = () => {
    const fresh = resetAdminState();
    setAdminData(fresh);
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

  // Count helper functions for bento stats
  const activeServicesCount = adminData?.services.filter(s => s.enabled).length || 0;
  const pendingIntakesCount = adminData?.intake.filter(i => i.status === 'new').length || 0;
  const activeFlagsCount = adminData?.flags.filter(f => f.enabled).length || 0;

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogout={handleLogout}
      onBackToApp={handleBackToApp}
    >
      {/* Dynamic Administrative Screen Sections */}
      
      {/* 1. Header Hero Banner */}
      <div className="bg-slate-900/45 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 space-y-3 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs font-bold leading-normal">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Super Admin Control Center</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">
            سیستەمی کۆنترۆڵی گشتی (No-Code Command Hub)
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-2xl leading-relaxed">
            ئەم داشبۆردە بۆ بەڕێوەبردنی پلاتفۆرمی **AI Gate Iraq** بەبێ دەستکاری کۆد درێژکراوەتەوە. لێرەوە دەتوانیت خزمەتگوزارییەکان، پرۆمپتەکان، فڵاگەکان و کۆنترۆڵی داتا سەرەکییەکانی نێو ماڵپەڕەکە بکەیت.
          </p>
        </div>
      </div>

      {/* 2. Visual Section Renderers */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Quick Bento Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Card className="bg-slate-900/30 border-slate-800/80 p-5 rounded-2xl flex items-center justify-between text-right">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">خزمەتگوزارییە چالاکەکان</p>
                <p className="text-2xl font-black text-white">{activeServicesCount} / 9</p>
              </div>
              <div className="w-11 h-11 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center text-emerald-400 col-span-1">
                <Briefcase className="w-5 h-5" />
              </div>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800/80 p-5 rounded-2xl flex items-center justify-between text-right">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">داواکارییە نوێیەکان (Intake)</p>
                <p className="text-2xl font-black text-white">{pendingIntakesCount} داواکاری</p>
              </div>
              <div className="w-11 h-11 bg-blue-500/15 border border-blue-500/25 rounded-xl flex items-center justify-center text-blue-400">
                <Inbox className="w-5 h-5" />
              </div>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800/80 p-5 rounded-2xl flex items-center justify-between text-right">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">فڵاگە چالاکەکان</p>
                <p className="text-2xl font-black text-amber-400">{activeFlagsCount} فڵاگ</p>
              </div>
              <div className="w-11 h-11 bg-amber-500/15 border border-amber-500/25 rounded-xl flex items-center justify-center text-amber-400">
                <Sliders className="w-5 h-5" />
              </div>
            </Card>

          </div>

          {/* Quick Info Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* System Status Tracker */}
            <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-4 text-right">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>دۆخی سیستەمی پایلۆت</span>
              </h3>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">کایەی کارکردن (Database):</span>
                  <span className="font-semibold text-white">LocalStorage Cache (Sandbox)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">مۆدێلی ژیری دەستکرد:</span>
                  <span className="font-semibold text-emerald-400">Gemini Pro Pilot Proxy</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">کاتی دەستپێکردنی سێرڤەر:</span>
                  <span className="font-mono text-slate-300">2026-06-16 UTC</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">دۆخی پاراستنی کلو کایە:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    پارێزراو
                  </span>
                </div>
              </div>
            </Card>

            {/* Platform Management Info Card */}
            <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-4 text-right">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>سیاسەت و بەڕێوەبردن</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                لەم وەشانە تاقیکارییەدا، تۆمارەکان و کارەکان بە تەواوی لێرەوە کۆنترۆڵ دەکرێن. هەر نوێکەرەوەیەک یەکسەر کار دەکاتە سەر کۆی بەشە گشتیەکانی بەشداربووان.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  onClick={handleResetData}
                  className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 hover:text-rose-300 text-xs font-bold px-4 h-9 rounded-xl transition-all"
                >
                  گەڕاندنەوە بۆ دۆخی سەرەتایی
                </Button>
                <Button
                  onClick={handleBackToApp}
                  className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/25 text-emerald-400 hover:text-emerald-300 text-xs font-bold px-4 h-9 rounded-xl transition-all"
                >
                  پشکنینی پلاتفۆرمی گشتی
                </Button>
              </div>
            </Card>

          </div>

          {/* Audit Logs Quick Feed */}
          <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-4 text-right">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Logs className="w-4 h-4 text-slate-400" />
                <span>تۆماری ئادمینەکان (Activity Feed)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-sans">دوایین کردارەکان</span>
            </h3>
            {adminData?.logs && adminData.logs.length > 0 ? (
              <div className="space-y-3.5 divide-y divide-slate-800/40">
                {adminData.logs.slice(0, 3).map((log, index) => (
                  <div key={log.id} className={`flex items-start gap-3 justify-between text-xs pt-3 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <div>
                        <p className="font-semibold text-slate-200">{log.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1">ئەنجامدەر: {log.actorName} • جۆر: {log.entity}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono mt-0.5">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">هیچ تۆمارێک بۆ پیشاندان نییە</p>
            )}
          </Card>

        </div>
      )}

      {activeSection !== 'dashboard' && (
        <Card className="bg-slate-900/10 border-slate-800/60 p-8 md:p-12 text-center rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            {(() => {
              switch (activeSection) {
                case 'intake': return <Inbox className="w-8 h-8" />;
                case 'content': return <FileText className="w-8 h-8" />;
                case 'services': return <Briefcase className="w-8 h-8" />;
                case 'prompts': return <Sparkles className="w-8 h-8" />;
                case 'workflows': return <Sliders className="w-8 h-8" />;
                case 'localization': return <Globe2 className="w-8 h-8" />;
                case 'flags': return <ShieldAlert className="w-8 h-8" />;
                case 'audit': return <Logs className="w-8 h-8" />;
                case 'settings': return <Settings className="w-8 h-8" />;
                default: return <Layers className="w-8 h-8" />;
              }
            })()}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-white">بەشی: {
              activeSection === 'intake' ? 'داواکارییەکان' :
              activeSection === 'content' ? 'ناوەڕۆک' :
              activeSection === 'services' ? 'خزمەتگوزارییەکان' :
              activeSection === 'prompts' ? 'پرۆمپتەکان' :
              activeSection === 'workflows' ? 'ڕێڕەوی کار' :
              activeSection === 'localization' ? 'زمانەکان' :
              activeSection === 'flags' ? 'فڵاگی تایبەتمەندی' :
              activeSection === 'audit' ? 'تۆماری کردارەکان' : 'ڕێکخستنەکان'
            }</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              ئەم بەشە بەشێکە لە بنەمای داهاتووی نوێکردنەوەی بێ کۆد (No-Code Command Hub). لەم دەروازەدا قاڵبی زانیارییە پێویستەکان و پێکهاتەکانی نێو بزوێنەری لۆکاڵی چالاک کراون.
            </p>
          </div>
          <div className="pt-2 max-w-sm mx-auto">
            <div className="bg-[#0b101c] border border-slate-800 p-4 rounded-xl text-right text-xs space-y-2 font-mono text-slate-400">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5 mb-1.5 font-bold text-slate-300">
                <span>مۆدێلی زانیاری پێشبینیکراو (Raw Structure)</span>
                <span>Active Status</span>
              </div>
              <p className="text-[10px] text-slate-500 wrap">
                {activeSection === 'intake' && '{ id: string, name: kurdish, category: binasazi, status: "new" }'}
                {activeSection === 'content' && '{ id: "welcome_notice", titleAr: "...", bodyKu: "..." }'}
                {activeSection === 'services' && '{ key: "borders", status: "active", enabled: true }'}
                {activeSection === 'prompts' && '{ serviceKey: "assistant", labelKu: "دەروازەی ئیبراهیم خەلیل" }'}
                {activeSection === 'workflows' && '{ id: "ws1", titleKu: "پشکنینی بەڵگەنامەکان", enabled: true }'}
                {activeSection === 'localization' && '{ defaultLocale: "ku-IQ", supported: ["ku", "ar", "en"] }'}
                {activeSection === 'flags' && '{ key: "show_pilot_limits", enabled: true }'}
                {activeSection === 'audit' && '{ actorName: "SuperAdmin", action: "update_setting", logTime: "..." }'}
                {activeSection === 'settings' && '{ appKey: "ai-gate-iraq", mode: "sandbox-demo" }'}
              </p>
            </div>
          </div>
        </Card>
      )}

    </AdminLayout>
  );
}
