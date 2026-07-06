import { useState } from 'react';
import { Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';
import { auth, googleProvider, signInWithPopup } from '@/src/lib/firebase';

interface PlatformAccessGateProps {
  loading: boolean;
}

export default function PlatformAccessGate({ loading }: PlatformAccessGateProps) {
  const { lang } = useLanguage();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07111f] text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          {lang === 'ar' ? 'جارٍ التحقق من الجلسة...' : lang === 'en' ? 'Checking your session...' : 'خەریکی پشکنینی سێشنەکەتە...'}
        </div>
      </div>
    );
  }

  const login = async () => {
    setError('');
    setSigningIn(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const code = String(err?.code || '');

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError(lang === 'ar' ? 'تم إلغاء تسجيل الدخول.' : lang === 'en' ? 'Sign-in was cancelled.' : 'چوونەژوورەوە هەڵوەشایەوە.');
      } else if (code === 'auth/unauthorized-domain') {
        setError(lang === 'ar' ? 'هذا النطاق غير مصرح به في Firebase Authentication.' : lang === 'en' ? 'This domain is not authorized in Firebase Authentication.' : 'ئەم دۆمەینە لە Firebase Authentication ڕێگەپێدراو نییە.');
      } else {
        setError(lang === 'ar' ? 'تعذر تسجيل الدخول بواسطة Google.' : lang === 'en' ? 'Unable to sign in with Google.' : 'چوونەژوورەوە بە Google سەرکەوتوو نەبوو.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const title = lang === 'ar' ? 'سجّل الدخول للوصول إلى المنصة' : lang === 'en' ? 'Sign in to access the platform' : 'بۆ دەستگەیشتن بە پلاتفۆرم بچۆ ژوورەوە';
  const description = lang === 'ar'
    ? 'استخدم حساب Google الخاص بك لحماية جلسة العمل وحفظ هويتك المهنية.'
    : lang === 'en'
      ? 'Use your Google account to protect your workspace session and professional identity.'
      : 'هەژماری Google ـەکەت بەکاربهێنە بۆ پاراستنی سێشن و ناسنامەی کارییەکەت.';
  const button = lang === 'ar' ? 'المتابعة باستخدام Google' : lang === 'en' ? 'Continue with Google' : 'بە Google بەردەوام بە';

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#07111f] px-4 py-10 text-white" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.14),transparent_28%)]" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/12 bg-[#0d1b2d]/95 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black shadow-lg shadow-blue-500/25">AI</span>
            <div>
              <p className="font-black">AI Gate Iraq</p>
              <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">SECURE ACCESS</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />PROTECTED
          </span>
        </div>

        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-black leading-tight sm:text-3xl">{title}</h1>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-300">{description}</p>

        <button type="button" onClick={() => void login()} disabled={signingIn} className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
          {signingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-[#4285F4] shadow-sm">G</span>}
          {button}
        </button>

        {error && <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-bold leading-6 text-rose-200">{error}</p>}
      </div>
    </div>
  );
}
