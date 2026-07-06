import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Globe2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';
import { auth, googleProvider, signInWithPopup } from '@/src/lib/firebase';

interface PlatformAccessGateProps {
  loading: boolean;
}

const copy = {
  ku: {
    loading: 'خەریکی پشکنینی سێشنەکەتە...',
    badge: 'دەستگەیشتنی پارێزراو',
    title: 'بەخێربێیتەوە بۆ AI Gate Iraq',
    description: 'بۆ چوونە ناو شوێنی کاری بازرگانی و لۆجیستی، بە هەژماری Google ـەکەت بچۆ ژوورەوە.',
    button: 'بە Google بەردەوام بە',
    secure: 'پاراستنی ناسنامە بە Firebase Authentication',
    private: 'سێشن و زانیارییەکانی هەژمارەکەت پارێزراون',
    fast: 'چوونەژوورەوەی خێرا و بێ پاسۆردی زیادە',
    language: 'زمان',
    back: 'گەڕانەوە بۆ لاندینگ پەیج',
    footer: 'بە بەردەوامبوون، ڕازی دەبیت هەژمارەکەت بۆ دەستگەیشتنی پارێزراو بەکاربهێنرێت.',
    cancelled: 'چوونەژوورەوە هەڵوەشایەوە.',
    unauthorized: 'ئەم دۆمەینە لە Firebase Authentication ڕێگەپێدراو نییە.',
    failed: 'چوونەژوورەوە بە Google سەرکەوتوو نەبوو.',
    panelEyebrow: 'SMART TRADE WORKSPACE',
    panelTitle: 'هەموو ئامرازە بازرگانی و لۆجیستییەکانت لە یەک شوێندا',
    panelText: 'ڕاوێژکاری زیرەک، خەمڵاندنی تێچوو، دابینکردن، KYC و بەدواداچوونی بار لە شوێنی کارێکی یەکگرتوودا.',
  },
  ar: {
    loading: 'جارٍ التحقق من الجلسة...',
    badge: 'وصول آمن',
    title: 'مرحباً بعودتك إلى AI Gate Iraq',
    description: 'سجّل الدخول بحساب Google للوصول إلى مساحة العمل التجارية واللوجستية.',
    button: 'المتابعة باستخدام Google',
    secure: 'حماية الهوية عبر Firebase Authentication',
    private: 'جلسة حسابك ومعلوماتك محمية',
    fast: 'دخول سريع بدون كلمة مرور إضافية',
    language: 'اللغة',
    back: 'العودة إلى الصفحة الرئيسية',
    footer: 'بالمتابعة، أنت توافق على استخدام حسابك للوصول الآمن إلى مساحة العمل.',
    cancelled: 'تم إلغاء تسجيل الدخول.',
    unauthorized: 'هذا النطاق غير مصرح به في Firebase Authentication.',
    failed: 'تعذر تسجيل الدخول بواسطة Google.',
    panelEyebrow: 'SMART TRADE WORKSPACE',
    panelTitle: 'كل أدوات التجارة والخدمات اللوجستية في مكان واحد',
    panelText: 'استشارات ذكية وتقدير تكاليف وتوريد وKYC وتتبع شحنات داخل مساحة عمل موحدة.',
  },
  en: {
    loading: 'Checking your session...',
    badge: 'Secure access',
    title: 'Welcome back to AI Gate Iraq',
    description: 'Sign in with your Google account to access your trade and logistics workspace.',
    button: 'Continue with Google',
    secure: 'Identity protected by Firebase Authentication',
    private: 'Your account session and information are protected',
    fast: 'Fast access without an additional password',
    language: 'Language',
    back: 'Back to landing page',
    footer: 'By continuing, you agree to use your account for secure workspace access.',
    cancelled: 'Sign-in was cancelled.',
    unauthorized: 'This domain is not authorized in Firebase Authentication.',
    failed: 'Unable to sign in with Google.',
    panelEyebrow: 'SMART TRADE WORKSPACE',
    panelTitle: 'All your trade and logistics tools in one place',
    panelText: 'Smart advisory, cost estimation, sourcing, KYC, and shipment tracking in one unified workspace.',
  },
} as const;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.73-.07-1.43-.19-2.1H12v3.98h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.36l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.97A6 6 0 0 1 6.1 12c0-.68.12-1.34.31-1.97v-2.6H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.57l3.33-2.6Z" />
      <path fill="#EA4335" d="M12 5.91c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.92 5.43l3.33 2.6C7.2 7.67 9.4 5.91 12 5.91Z" />
    </svg>
  );
}

export default function PlatformAccessGate({ loading }: PlatformAccessGateProps) {
  const { lang, setLang } = useLanguage();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const t = copy[lang as keyof typeof copy] ?? copy.ku;
  const isLtr = lang === 'en';

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-bold text-slate-200 shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          {t.loading}
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
        setError(t.cancelled);
      } else if (code === 'auth/unauthorized-domain') {
        setError(t.unauthorized);
      } else {
        setError(t.failed);
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#06101d] text-white"
      dir={isLtr ? 'ltr' : 'rtl'}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.26),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.14),transparent_27%),linear-gradient(180deg,#06101d_0%,#091827_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-stretch lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden border-e border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black shadow-xl shadow-blue-500/25">AI</span>
              <div>
                <div className="flex items-center gap-2 text-lg font-black">AI Gate Iraq <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[9px] text-amber-200">PRO</span></div>
                <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-500">{t.panelEyebrow}</p>
              </div>
            </a>

            <div className="mt-24 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-black text-blue-200">
                <Sparkles className="h-4 w-4" />
                {t.panelEyebrow}
              </span>
              <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">{t.panelTitle}</h1>
              <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-300">{t.panelText}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ['AI', 'Smart Advisory'],
              ['KYC', 'Business Verification'],
              ['24/7', 'Secure Access'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <strong className="text-lg font-black text-white">{value}</strong>
                <p className="mt-1 text-[10px] font-bold leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <a href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-[10px] font-black">AI</span>
                <div>
                  <p className="text-sm font-black">AI Gate Iraq</p>
                  <p className="text-[9px] font-bold tracking-[0.16em] text-slate-500">SECURE ACCESS</p>
                </div>
              </a>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[9px] font-black text-amber-200">PRO</span>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-[#0d1b2d]/95 p-6 shadow-2xl shadow-black/45 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-inner">
                  <LockKeyhole className="h-7 w-7" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t.badge}
                </span>
              </div>

              <h2 className="mt-7 text-2xl font-black leading-tight sm:text-3xl">{t.title}</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-300">{t.description}</p>

              <button
                type="button"
                onClick={() => void login()}
                disabled={signingIn}
                className="mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b2d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
                {t.button}
              </button>

              {error && (
                <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-bold leading-6 text-rose-200">
                  {error}
                </p>
              )}

              <div className="mt-7 grid gap-3 border-t border-white/10 pt-6">
                {[t.secure, t.private, t.fast].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-xs font-bold leading-6 text-slate-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                  <Globe2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.language}</span>
                  <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
                    {(['ku', 'ar', 'en'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setLang(item)}
                        className={`h-7 min-w-8 rounded-md px-2 text-[9px] font-black transition ${lang === item ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                      >
                        {item.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <a href="/" className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 transition hover:text-white">
                  <ArrowLeft className={`h-3.5 w-3.5 ${isLtr ? '' : 'rotate-180'}`} />
                  <span className="hidden sm:inline">{t.back}</span>
                </a>
              </div>
            </div>

            <p className="mt-5 px-4 text-center text-[10px] font-medium leading-5 text-slate-600">{t.footer}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
