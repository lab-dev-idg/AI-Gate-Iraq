import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Briefcase,
  Sliders,
  Sparkles,
  Logs,
  Globe2,
  Settings,
  ShieldAlert,
  Menu,
  X,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSectionKey } from './adminTypes';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: AdminSectionKey;
  onSectionChange: (section: AdminSectionKey) => void;
  onLogout: () => void;
  onBackToApp: () => void;
}

export const AdminLayout = ({
  children,
  activeSection,
  onSectionChange,
  onLogout,
  onBackToApp
}: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'dashboard' as AdminSectionKey, label: 'داشبۆرد', icon: LayoutDashboard },
    { key: 'intake' as AdminSectionKey, label: 'داواکارییەکان', icon: Inbox },
    { key: 'content' as AdminSectionKey, label: 'ناوەڕۆک', icon: FileText },
    { key: 'services' as AdminSectionKey, label: 'خزمەتگوزارییەکان', icon: Briefcase },
    { key: 'prompts' as AdminSectionKey, label: 'پرۆمپتەکان', icon: Sparkles },
    { key: 'workflows' as AdminSectionKey, label: 'ڕێڕەوی کار', icon: Sliders },
    { key: 'localization' as AdminSectionKey, label: 'زمانەکان', icon: Globe2 },
    { key: 'flags' as AdminSectionKey, label: 'فڵاگی تایبەتمەندی', icon: ShieldAlert },
    { key: 'audit' as AdminSectionKey, label: 'تۆماری کردارەکان', icon: Logs },
    { key: 'settings' as AdminSectionKey, label: 'ڕێکخستنەکان', icon: Settings },
  ];

  return (
    <div className="min-h-screen text-slate-100 bg-[#070b13] flex flex-col font-sans selection:bg-emerald-500/20" dir="rtl">
      
      {/* Upper Status Bar & Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/95 border-b border-slate-800/80 backdrop-blur-md px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="font-sans font-black text-white text-base tracking-tight select-none">
              AI Gate Iraq
            </span>
            <span className="text-[11px] font-sans text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 select-none font-extrabold uppercase tracking-wide">
              ADMIN
            </span>
          </div>
          <div className="hidden md:block h-4 w-px bg-slate-800" />
          <span className="hidden md:inline-block text-xs font-medium text-slate-400 font-sans">
            کۆنترۆڵی گشتی پلاتفۆرم
          </span>
        </div>

        {/* Global Exit Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onBackToApp}
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs gap-1.5 font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">گەڕانەوە بۆ پلاتفۆرم</span>
          </Button>

          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="h-9 w-9 sm:w-auto sm:px-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs gap-1.5 font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">چوونە دەرەوە</span>
          </Button>
        </div>
      </header>

      {/* Screen Frame Grid */}
      <div className="flex-1 w-full flex items-stretch relative min-h-0">
        
        {/* RIGHT SIDEBAR (Desktop Sidecar - RTL Layout) */}
        <aside className="hidden lg:block w-64 border-l border-slate-800/80 bg-[#090e19] shrink-0 p-4 space-y-2 select-none">
          <div className="px-3 pb-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
            ناونیشانی بەشەکان
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSectionChange(item.key)}
                  className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 font-extrabold text-white shadow-lg shadow-emerald-600/10'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex">
            {/* Backdrop lock */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Nav drawers (Anchored on the right for RTL layout) */}
            <div className="relative flex-1 max-w-[280px] bg-[#090e19] p-4 space-y-4 flex flex-col min-h-full mr-auto select-none border-l border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  بژاردەکان
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSectionChange(item.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-start gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-800/80">
                <Button
                  onClick={onBackToApp}
                  variant="outline"
                  className="w-full h-10 border-slate-800 text-slate-300 text-xs font-bold mb-2 gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>گەڕانەوە بۆ پلاتفۆرم</span>
                </Button>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  className="w-full h-10 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>چوونە دەرەوە</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT AND WORKSPACE */}
        <main className="flex-1 min-w-0 flex flex-col bg-[#070b13] overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
