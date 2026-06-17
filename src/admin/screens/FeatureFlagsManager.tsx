import React, { useState } from 'react';
import { ToggleLeft, Save, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminFeatureFlag } from '../adminTypes';

interface FeatureFlagsManagerProps {
  flags: AdminFeatureFlag[];
  onUpdateFlag: (key: string, enabled: boolean) => void;
  onResetToDefault: () => void;
}

export const FeatureFlagsManager = ({ flags, onUpdateFlag, onResetToDefault }: FeatureFlagsManagerProps) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Maintain local modifications to allow saving on click, or toggle live directly.
  // The system uses a highly satisfying live toggle with persistent save.
  const handleToggle = (key: string, currentVal: boolean) => {
    onUpdateFlag(key, !currentVal);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Header tags */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ToggleLeft className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی فڵاگەکانی سیستم (Feature Flags)</span>
        </h2>
        <p className="text-xs text-slate-400">
          تایبەتمەندییە لۆجیکییە مۆدێرنەکانی ماڵپەڕ لە کارەوە بخە یان چالاکیان بکە لە کاتی ڕاستەقینەدا بەبێ کۆدە نوێیەکان.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Flag Cards List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="grid grid-cols-1 gap-4">
            {flags.length > 0 ? (
              flags.map((flag) => (
                <Card key={flag.key} className="bg-slate-900/40 border-slate-800/80 p-5 rounded-2xl relative overflow-hidden transition-all hover:border-slate-800">
                  
                  {/* Glowing dynamic background indicator */}
                  <div className={`absolute top-0 right-0 w-1.5 h-full ${flag.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Content */}
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-white">{flag.labelKu}</h3>
                        <span className="font-mono text-[9px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded leading-none border border-slate-900">
                          {flag.key}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal max-w-xl">{flag.descriptionKu}</p>
                    </div>

                    {/* Checkbox Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggle(flag.key, flag.enabled)}
                      className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${
                        flag.enabled 
                          ? 'bg-emerald-600 justify-end' 
                          : 'bg-slate-850 justify-start border border-slate-800'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                    </button>

                  </div>

                  {/* Readonly info status bar */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-900 mt-4 text-[10px]">
                    <span className="text-slate-500">دۆخی هەنووکەیی:</span>
                    <div className="flex items-center gap-1 font-semibold">
                      {flag.enabled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-sans">چالاک بەسەر هەموواندا</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-rose-500 font-sans">ناچالاک و گوێپێنەدراو</span>
                        </>
                      )}
                    </div>
                  </div>

                </Card>
              ))
            ) : (
              <Card className="bg-slate-900/10 border-slate-800 p-8 text-center rounded-2xl">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">هیچ فڵاگێک نییە</h3>
                <p className="text-xs text-slate-500 mt-1">فڵاگەکانی سیستەم بارنەکراون.</p>
              </Card>
            )}
          </div>

          {saveSuccess && (
            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl animate-bounce">
              دۆخی نوێی فڵاگەکە بە فەرمی نوێکرایەوە و پاشەکەوت کرا! سەرجەم بەشەکانی ماڵپەڕەکە لەم ساتەوە بەپێی ئەم لۆجیکە گشتییە کار دەکەن.
            </p>
          )}

        </div>

        {/* Right side explanation and controls */}
        <div className="space-y-6">
          <Card className="bg-slate-900/30 border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2.5">ڕوونکردنەوەی فڵاگەکانی فڕۆکەوانی</h3>
            
            <div className="space-y-4 text-xs leading-relaxed text-slate-400">
              <div className="space-y-1">
                <p className="font-bold text-slate-200">١. ئاگاداری بەکارهێنان</p>
                <p className="text-[11px] text-slate-500">
                  ئەم فڵاگە نیشاندانی ئاگادارییەکانی بەکارهێنان و پشتڕاستکردنەوەی زانیاری کۆنترۆڵ دەکات.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <p className="font-bold text-slate-200">٢. دەستکاریکردنی فایل (enable_multimodal)</p>
                <p className="text-[11px] text-slate-500">
                  تایبەتمەندی فایل/وێنە سەر بار دەکات لە ڕووبەری چاتی ڕاوێژکاری ژیری دەستکرددا، بۆ لایەنەکانی پشکنینی مەلەفاتی گومرگ.
                </p>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl flex items-start gap-2 text-amber-500 mt-3">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-normal font-medium">
                  وریابە لە کوژاندنەوەی فڵاگەکان چونکە ڕاستەوخۆ دەبێتە هۆی گۆڕانکاری لە نێو داواکارییەکانی بەکارهێنەر لەگەڵ ژیری دەستکاریکردندا.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-850">
                <Button
                  onClick={() => {
                    if (window.confirm('ئایا دڵنیای لە گەڕاندنەوەی سەرجەم ئاڵاکانی سیستم بۆ باری ئەسڵی خۆی؟')) {
                      onResetToDefault();
                    }
                  }}
                  variant="ghost"
                  className="w-full h-9 hover:bg-rose-500/15 hover:text-rose-400 text-slate-500 text-[11px] font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5 me-1" />
                  <span>گەڕاندنەوە بۆ باری بنەڕەتی</span>
                </Button>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
