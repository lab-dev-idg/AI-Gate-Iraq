import React, { useState } from 'react';
import { Settings, ShieldAlert, Download, RefreshCw, Trash2, CheckCircle2, Copy, Cloud, Database, Wifi, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminState } from '../adminTypes';
import { exportAdminState, syncCurrentAdminStateToCloud, loadAdminStateFromCloud, saveAdminState } from '../adminStore';
import { getFirebaseStatus } from '../../lib/firebase';
import { testFirebaseConnection } from '../../lib/firebaseAdminAdapter';

interface AdminSettingsProps {
  adminData: AdminState;
  onUpdateFlag: (key: string, enabled: boolean) => void;
  onResetAllData: () => void;
  onClearAllData: () => void;
}

export const AdminSettings = ({
  adminData,
  onUpdateFlag,
  onResetAllData,
  onClearAllData
}: AdminSettingsProps) => {
  const [copied, setCopied] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [firebaseStatus, setFirebaseStatus] = useState(() => getFirebaseStatus());
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [firebaseLog, setFirebaseLog] = useState<string | null>(null);
  const [firebaseLogType, setFirebaseLogType] = useState<'success' | 'error' | 'info' | null>(null);

  const pilotFlag = adminData.flags.find(f => f.key === 'show_pilot_limits');
  const fileSupportFlag = adminData.flags.find(f => f.key === 'enable_multimodal');

  const handleCopyJSON = () => {
    const json = exportAdminState();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadJSON = () => {
    const json = exportAdminState();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-gate-iraq-admin-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setActionSuccess('هەناردەکردنی داتا سەرکەوتوو بوو!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const triggerReset = () => {
    if (window.confirm('ئایا دڵنیای لە گەڕاندنەوەی سەرجەم داتاکان بۆ باری کارگەیی بنەڕەت؟')) {
      onResetAllData();
      setActionSuccess('سەرجەم زانیارییەکان بۆ باری جێگیری کارگە گەڕێندرانەوە!');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const triggerClear = () => {
    if (window.confirm('ئایا دڵنیای لە پاککردنەوەی جێگیری لۆکاڵ ستۆریج؟ ئەمە نابێتە هۆی سڕینەوەی سڕڤەر بەڵکو کۆنفیگی لۆکاڵ ڕیست دەکات.')) {
      onClearAllData();
      setActionSuccess('داتاکان پاكکرانەوە!');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header sections */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>ڕێکخستنەکانی سیستەم (Admin Settings)</span>
        </h2>
        <p className="text-xs text-slate-400">
          ڕێکخستن و پاراستنی گۆڕانکاری و کۆنترۆڵکردنی بزوێنەری لۆکاڵ ستۆریج.
        </p>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold leading-normal animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main warning blocks */}
      <Card className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-3xl space-y-2.5">
        <h3 className="text-xs font-black text-amber-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>هۆشداری سەرپەرشتیاری تاقیکاری</span>
        </h3>
        <p className="text-xs text-amber-500/90 leading-relaxed font-medium">
          ئەم داشبۆردە لە دۆخی پایلۆتدا داتا لە براوسەرەکەتدا (LocalStorage) هەڵدەگرێت. بۆ بەرهەمهێنانی ڕاستەقینە پێویستی بە داتابەیس و ئەمنیەتی فەرمی سێرڤەری مژارکراو هەیە.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column: Toggles & Feature flags */}
        <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>دۆخی پایلۆت و فڵاگەکان</span>
          </h3>

          <div className="space-y-4">
            {/* Show pilot banner limitator */}
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-900">
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-slate-200">پیشاندانی ئاگاداری پایلۆت</p>
                <p className="text-[10px] text-slate-500">نیشاندانی تێکستێکی بچوک لە پلاتفۆرمی گشتیدا کە ئەمە ماڵپەڕێکی ڕاستەقینە نییە.</p>
              </div>
              <button
                onClick={() => onUpdateFlag('show_pilot_limits', !pilotFlag?.enabled)}
                className={`w-11 h-6 rounded-full p-1 transition-all ${
                  pilotFlag?.enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                } flex items-center`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
              </button>
            </div>

            {/* Multimodal feature toggler */}
            <div className="flex items-center justify-between gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-900">
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-slate-200">پشتیوانیکردنی دەستکاریکردنی فایل</p>
                <p className="text-[10px] text-slate-500">بینینی دوگمەی هاوپێچ لە بواری یاوەرە ژیرییەکە بە یەکجاری.</p>
              </div>
              <button
                onClick={() => onUpdateFlag('enable_multimodal', !fileSupportFlag?.enabled)}
                className={`w-11 h-6 rounded-full p-1 transition-all ${
                  fileSupportFlag?.enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                } flex items-center`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
              </button>
            </div>
          </div>
        </Card>

        {/* Right column: Data managers */}
        <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">بەرێوەبردن و ناردنەوەی داتا</h3>
          
          <div className="space-y-3.5 pt-1">
            {/* Export data */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">هەناردەکردن داتا</p>
                <p className="text-[10px] text-slate-500 mt-1">هەناردەکردنی زانیاری پایلۆتی ئادمین بە جۆری پەڕگەی JSON فەرمی.</p>
              </div>
              <div className="flex gap-1.5 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  onClick={handleCopyJSON}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] font-bold border-slate-800 text-slate-400 hover:text-white rounded-lg flex-1 sm:flex-initial"
                >
                  <Copy className="w-3.5 h-3.5 me-1" />
                  <span>{copied ? 'کۆپی کرا!' : 'کۆپی لۆک بێ'}</span>
                </Button>
                <Button
                  onClick={handleDownloadJSON}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] font-bold border-emerald-500/20 text-emerald-400 hover:text-white hover:bg-emerald-600/10 rounded-lg flex-1 sm:flex-initial"
                >
                  <Download className="w-3.5 h-3.5 me-1" />
                  <span>داگرتن</span>
                </Button>
              </div>
            </div>

            <div className="h-px bg-slate-800/40 my-1" />

            {/* Reset data */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">گەڕاندنەوە بۆ دۆخی سەرەتایی (Reset)</p>
                <p className="text-[10px] text-slate-500 mt-1">گەڕێنەوەی سەرجەم گۆڕانکارییەکانی خزمەتگوزاری و تۆمار بۆ نەخشەی بنەڕەتی تاقیکاری.</p>
              </div>
              <Button
                onClick={triggerReset}
                size="sm"
                className="w-full sm:w-auto h-8 text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 rounded-lg shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 me-1 inline" />
                <span>گەڕاندنەوە بۆ بنەڕەت</span>
              </Button>
            </div>

            <div className="h-px bg-slate-800/40 my-1" />

            {/* Clear database cache completely */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
              <div>
                <p className="text-xs font-bold text-slate-200">سڕینەوەی کوگا (Wipe LocalStorage)</p>
                <p className="text-[10px] text-slate-500 mt-1">سڕینەوەی تەواوی جێی ستۆریجی کوگای و پەکخستنەوەی چوونەژوورەوەی ئادمین.</p>
              </div>
              <Button
                onClick={triggerClear}
                size="sm"
                className="w-full sm:w-auto h-8 text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-400 rounded-lg shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 me-1 inline" />
                <span>پاککردنەوەی داتا</span>
              </Button>
            </div>
          </div>
        </Card>

      </div>

      {/* Firebase Connection & Administrative Cloud Sync Section */}
      <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-5">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>پەیوەندی فایەربەیس (Firebase Connection & Sync Panel)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Display Area */}
          <div className="space-y-3 bg-slate-950/40 p-5 rounded-xl border border-slate-900 leading-relaxed text-right">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">پەیوەستبوون:</span>
              <div className="flex items-center gap-1.5 font-bold">
                {firebaseStatus.configured ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-emerald-400">چالاکە (Configured)</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">پایلۆتی ناوخۆیی (Local Pilot)</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900/60 pt-2.5">
              <span className="text-slate-400 font-medium">مۆد (Mode):</span>
              <span className="font-bold text-slate-200">
                {firebaseStatus.mode === 'firebase' ? 'Firebase Cloud' : 'Local Sandbox'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900/60 pt-2.5">
              <span className="text-slate-400 font-medium">کۆدی پڕۆژە (Project ID):</span>
              <span className="font-mono text-slate-300 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">
                {firebaseStatus.projectId || 'هیچ (N/A)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900/60 pt-2.5">
              <span className="text-slate-400 font-medium">دۆمەینی Auth:</span>
              <span className="font-mono text-slate-300 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">
                {firebaseStatus.authDomain || 'هیچ (N/A)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-900/60 pt-2.5">
              <span className="text-slate-400 font-medium">کۆگای فایەربەیس:</span>
              <span className="font-mono text-slate-300 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">
                {firebaseStatus.storageBucket || 'هیچ (N/A)'}
              </span>
            </div>
            
            <div className="border-t border-slate-900/60 pt-2.5 text-xs text-right">
              <span className="text-[10px] text-slate-400 block mb-1">دۆخی فایەربەیس:</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                {firebaseStatus.messageKu}
              </p>
            </div>
          </div>

          {/* Action Log / Test Results Display & Action controllers */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="flex-1 bg-slate-950/25 p-4 rounded-xl border border-slate-900 flex flex-col justify-center min-h-[120px] text-right">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">دوایین ئەنجام</span>
              {firebaseLog ? (
                <div className={`text-xs leading-relaxed p-2.5 rounded-lg border font-medium ${
                  firebaseLogType === 'success' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : firebaseLogType === 'error'
                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' 
                    : 'bg-slate-500/5 border-slate-500/20 text-slate-300'
                }`}>
                  {firebaseLog}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">سەرجەم پرۆسەکان و ئەنجامی پەیوەندی لێرە دەردەکەون.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Test Connection Button */}
              <Button
                onClick={async () => {
                  setTesting(true);
                  setFirebaseLog('لە گەڕاندنەوەی پەیوەندی...');
                  setFirebaseLogType('info');
                  const res = await testFirebaseConnection();
                  setTesting(false);
                  setFirebaseLog(res.messageKu);
                  setFirebaseLogType(res.ok ? 'success' : 'error');
                }}
                disabled={testing}
                className="h-9 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl w-full"
              >
                {testing ? 'چاوەڕوان بە...' : 'تاقیکردنەوەی پەیوەندی'}
              </Button>

              {/* Sync to Cloud Button */}
              <Button
                onClick={async () => {
                  if (!window.confirm('ئایا دڵنیای داتای ناوخۆیی ئادمین بۆ Firestore هاوکات بکرێت؟')) return;
                  setSyncing(true);
                  setFirebaseLog('داتای سەرەکی و کۆکراوەکان باردەکرێن...');
                  setFirebaseLogType('info');
                  const res = await syncCurrentAdminStateToCloud();
                  setSyncing(false);
                  setFirebaseLog(res.messageKu);
                  setFirebaseLogType(res.ok ? 'success' : 'error');
                  if (res.ok) {
                    setActionSuccess('هاوکاتکردنی داتا بە سەرکەوتوویی ئەنجامدرا!');
                    setTimeout(() => setActionSuccess(null), 4000);
                  }
                }}
                disabled={syncing}
                className="h-9 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl w-full shadow-lg shadow-emerald-950/20"
              >
                {syncing ? 'لە هاوکاتکردندایە...' : 'هاوکاتکردن بۆ فایەربەیس'}
              </Button>

              {/* Load from Cloud Button */}
              <Button
                onClick={async () => {
                  if (!window.confirm('ئایا دڵنیای داتای Firestore بهێنرێتەوە و لۆکاڵ ستۆریج نوێ بکرێتەوە؟')) return;
                  setLoadingCloud(true);
                  setFirebaseLog('بەدواداچوونی داتای فایەربەیس...');
                  setFirebaseLogType('info');
                  const res = await loadAdminStateFromCloud();
                  setLoadingCloud(false);
                  setFirebaseLog(res.messageKu);
                  setFirebaseLogType(res.ok ? 'success' : 'error');
                  if (res.ok && res.state) {
                    saveAdminState(res.state);
                    setActionSuccess('کۆنفیگی ناوخۆ بە سەرکەوتوویی لەگەڵ Firestore تازه کرایەوە!');
                    setTimeout(() => {
                      setActionSuccess(null);
                      if (window.confirm('داتا بهێنرایەوە. پێویستە لاپەڕەکە نوێ بکرێتەوە بۆ جێبەجێکردنی گۆڕانکارییەکان، ئێستا نوێ بکرێتەوە؟')) {
                        window.location.reload();
                      }
                    }, 1000);
                  }
                }}
                disabled={loadingCloud}
                className="h-9 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl w-full shadow-lg shadow-blue-950/20"
              >
                {loadingCloud ? 'لە بارکردندایە...' : 'هێنانەوە لە فایەربەیس'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
