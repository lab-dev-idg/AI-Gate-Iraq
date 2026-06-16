import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AdminAccessGateProps {
  onSuccess: () => void;
  onBackToApp: () => void;
}

export const AdminAccessGate = ({ onSuccess, onBackToApp }: AdminAccessGateProps) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin-demo') {
      sessionStorage.setItem('ai-gate-iraq-admin-auth', 'true');
      onSuccess();
    } else {
      setError('کۆدی تاقیکردنەوە بنووسە یان کۆدەکە هەڵەیە!');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090D16] text-white flex flex-col items-center justify-center p-4 md:p-6 select-none font-sans" dir="rtl">
      {/* Background radial soft light decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-slate-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Upper Brand / Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white font-sans">
            دەروازەی سەرپەرشتیار (Access Gate)
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            AI Gate Iraq • سیستەمی کۆنترۆڵی زیرەک
          </p>
        </div>

        {/* Authenticate Input Card */}
        <Card className="bg-[#111827]/70 border border-slate-800 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                کۆدی چوونەژوورەوەی تاقیکاری (Pilot Passcode)
              </label>
              <div className="relative">
                <Input
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="کۆدی تاقیکردنەوە بنووسە"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full h-11 bg-slate-950/60 border-slate-800 text-white rounded-xl focus-visible:ring-emerald-500 focus-visible:border-emerald-500 placeholder:text-slate-600 block pe-10"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error messaging Banner */}
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15 rounded-xl transition-all font-bold active:scale-95"
            >
              چوونە ژوورەوە
            </Button>
          </form>

          {/* Secure / Pilot info notice */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-amber-500 leading-relaxed font-sans font-medium">
              ⚠️ ئەم بەشە تەنها بۆ تاقیکردنەوەی پایلۆتە و ئەمنیەتی بەرهەمهێنانی ڕاستەقینە نییە. بۆ بەشداری دیمو کۆدی <code className="bg-amber-500/10 px-1 text-[10px] rounded border border-amber-500/20 font-mono select-all">admin-demo</code> بەکاربهێنە.
            </p>
          </div>
        </Card>

        {/* Back and exit footer links */}
        <div className="text-center">
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-all font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>گەڕانەوە بۆ لای خزمەتگوزارییە گشتیەکان</span>
          </button>
        </div>
      </div>
    </div>
  );
};
