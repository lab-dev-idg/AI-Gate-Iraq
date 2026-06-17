import React from 'react';
import { Briefcase, Inbox, ShieldAlert, Logs, Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminState } from '../adminTypes';
import { formatKuDate } from '../adminUtils';

interface AdminDashboardProps {
  adminData: AdminState;
  onSectionChange: (sec: any) => void;
  onResetData: () => void;
}

export const AdminDashboard = ({ adminData, onSectionChange, onResetData }: AdminDashboardProps) => {
  const totalIntakes = adminData.intake.length;
  const pendingIntakes = adminData.intake.filter((i) => i.status === 'new' || i.status === 'reviewing').length;
  const contactedIntakes = adminData.intake.filter((i) => i.status === 'contacted').length;
  const activeServices = adminData.services.filter((s) => s.enabled).length;
  const activeFlags = adminData.flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Dynamic Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="bg-slate-900/40 border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">کۆی داواکارییەکان</p>
            <p className="text-2xl font-black text-white">{totalIntakes}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center text-indigo-400">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">چاوەڕوانی پێداچوونەوە</p>
            <p className="text-2xl font-black text-amber-500">{pendingIntakes}</p>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-center text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">پەیوەندی کراوە</p>
            <p className="text-2xl font-black text-emerald-500">{contactedIntakes}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center justify-center text-emerald-400">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">بەشە چالاکەکان</p>
            <p className="text-2xl font-black text-white">{activeServices} / 9</p>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">گۆڕانکاری چوست</p>
            <p className="text-2xl font-black text-purple-400">{activeFlags} فڵاگ</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/25 rounded-xl flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Activities Feed & System */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Audit Logs Panel */}
          <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800/60 pb-3">
              <span className="flex items-center gap-2">
                <Logs className="w-4 h-4 text-emerald-400" />
                <span>دوایین کردارەکان</span>
              </span>
              <button
                onClick={() => onSectionChange('audit')}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                پیشاندانی هەمووی
              </button>
            </h3>

            {adminData.logs && adminData.logs.length > 0 ? (
              <div className="space-y-3 pt-1">
                {adminData.logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start justify-between text-xs p-3 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-800 transition-all">
                    <div className="flex gap-2.5 min-w-0 pr-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-100">{log.description}</p>
                        <p className="text-[10px] text-slate-500">جۆر: {log.entity} • ئەنجامدەر: {log.actorName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 mr-4 self-center">
                      {formatKuDate(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">هیچ کردارێک تۆمار نەکراوە.</p>
            )}
          </Card>

          {/* Quick Setup Actions */}
          <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl decoration-none space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800/60 pb-3">کارە خێراکان</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => onSectionChange('intake')}
                className="w-full h-11 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5"
              >
                <span>بینینی داواکارییەکان</span>
              </Button>
              <Button
                onClick={() => onSectionChange('services')}
                className="w-full h-11 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/25 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5"
              >
                <span>ڕێکخستنی خزمەتگوزارییەکان</span>
              </Button>
              <Button
                onClick={() => onSectionChange('settings')}
                className="w-full h-11 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5"
              >
                <span>ڕێکخستنەکانی پلاتفۆرم</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Status & Banners */}
        <div className="space-y-6">
          {/* Services Checklist Status */}
          <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800/60 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>دۆخی فۆرم و خزمەتگوزارییەکان</span>
            </h3>

            <div className="space-y-3">
              {adminData.services.slice(0, 6).map((service) => (
                <div key={service.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/20 border border-slate-900">
                  <span className="font-semibold text-slate-300 transition-colors">{service.titleKu}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    service.enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  }`}>
                    {service.enabled ? 'چالاککراو' : 'ناچالاک'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Pilot Banner warnings */}
          <Card className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-amber-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>ئاگاداری گرنگ</span>
            </h4>
            <p className="text-[11px] text-amber-500/80 leading-relaxed">
              گۆڕانکارییەکانی بەڕێوەبەرایەتی لە Firestore هاوکات دەکرێن و بە ڕێگەپێدانی هەژماری سەرپەرشتیار پارێزراون.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
