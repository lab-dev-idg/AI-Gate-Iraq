import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';
import BrandLogo from '@/src/components/BrandLogo';
import {
  auth,
  createUserWithEmailAndPassword,
  getRedirectResult,
  googleProvider,
  isFirebaseConfigured,
  sendEmailVerification,
  sendPasswordResetEmail,
  setAuthPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from '@/src/lib/firebase';

interface PlatformAccessGateProps {
  loading: boolean;
  onAuthenticated: (user: import('@/src/lib/firebase').User) => void;
}

const BRAND_TAGLINE = 'SMART TRADE PLATFORM';

const copy = {
  ku: {
    loading: 'خەریکی پشکنینی سێشنەکەتە...',
    badge: 'دەستگەیشتنی پارێزراو',
    title: 'بەخێربێیتەوە بۆ AI Gate Iraq',
    description: 'بە ئیمەیل و وشەی نهێنی یان بە هەژماری Google بچۆ ژوورەوە.',
    email: 'ئیمەیل',
    password: 'وشەی نهێنی',
    name: 'ناوی تەواو',
    register: 'دروستکردنی هەژمار',
    signInMode: 'هەژمارت هەیە؟ بچۆ ژوورەوە',
    registerMode: 'هەژمارت نییە؟ هەژمار دروست بکە',
    remember: 'لەبیرم بهێڵەوە',
    login: 'چوونەژوورەوە',
    google: 'بە Google بەردەوام بە',
    or: 'یان',
    forgot: 'وشەی نهێنیت لەبیرکردووە؟',
    resetSent: 'لینکی گۆڕینی وشەی نهێنی بۆ ئیمەیلەکەت نێردرا.',
    enterEmail: 'تکایە سەرەتا ئیمەیلەکەت بنووسە.',
    invalidCredentials: 'ئیمەیل یان وشەی نهێنی هەڵەیە.',
    invalidEmail: 'فۆرماتی ئیمەیل دروست نییە.',
    emailInUse: 'ئەم ئیمەیلە پێشتر هەژماری پێ دروستکراوە.',
    networkError: 'پەیوەندی ئینتەرنێت سەرکەوتوو نەبوو. پەیوەندییەکەت بپشکنە و دووبارە هەوڵ بدەوە.',
    weakPassword: 'وشەی نهێنی دەبێت لانیکەم ٨ پیت بێت.',
    verificationSent: 'لینکی پشتڕاستکردنەوە نێردرا. ئیمەیلەکەت بپشکنە و پاشان بچۆ ژوورەوە.',
    tooMany: 'هەوڵی زۆر دراوە؛ دوای ماوەیەک هەوڵ بدەوە.',
    secure: 'پاراستنی ناسنامە بە Firebase Authentication',
    private: 'سێشن و زانیارییەکانی هەژمارەکەت پارێزراون',
    fast: 'دوو ڕێگای پارێزراو بۆ چوونەژوورەوە',
    language: 'زمان',
    back: 'گەڕانەوە بۆ لاندینگ پەیج',
    footer: 'بە بەردەوامبوون، ڕازی دەبیت هەژمارەکەت بۆ دەستگەیشتنی پارێزراو بەکاربهێنرێت.',
    cancelled: 'چوونەژوورەوە هەڵوەشایەوە.',
    unauthorized: 'ئەم دۆمەینە لە Firebase Authentication ڕێگەپێدراو نییە.',
    failed: 'چوونەژوورەوە سەرکەوتوو نەبوو.',
    configuration: 'ڕێکخستنی Firebase Authentication لە وەشانی production تەواو نییە. تکایە لەگەڵ بەڕێوەبەر پەیوەندی بکە.',
    providerDisabled: 'چوونەژوورەوە بە ئیمەیل لە Firebase Console چالاک نەکراوە. بەڕێوەبەر دەبێت Email/Password provider چالاک بکات.',
    accountDisabled: 'ئەم هەژمارە لەلایەن بەڕێوەبەرەوە ناچالاک کراوە.',
    panelEyebrow: 'SMART TRADE WORKSPACE',
    panelTitle: 'هەموو ئامرازە بازرگانی و لۆجیستییەکانت لە یەک شوێندا',
    panelText: 'ڕاوێژکاری زیرەک، خەمڵاندنی تێچوو، دابینکردن، KYC و بەدواداچوونی بار لە شوێنی کارێکی یەکگرتوودا.',
  },
  ar: {
    loading: 'جارٍ التحقق من الجلسة...',
    badge: 'وصول آمن',
    title: 'مرحباً بعودتك إلى AI Gate Iraq',
    description: 'سجّل الدخول بالبريد الإلكتروني وكلمة المرور أو باستخدام Google.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    register: 'إنشاء حساب',
    signInMode: 'لديك حساب؟ سجّل الدخول',
    registerMode: 'ليس لديك حساب؟ أنشئ حساباً',
    remember: 'تذكرني',
    login: 'تسجيل الدخول',
    google: 'المتابعة باستخدام Google',
    or: 'أو',
    forgot: 'هل نسيت كلمة المرور؟',
    resetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
    enterEmail: 'أدخل بريدك الإلكتروني أولاً.',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة.',
    emailInUse: 'يوجد حساب مسجل بهذا البريد الإلكتروني.',
    networkError: 'تعذر الاتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.',
    weakPassword: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
    verificationSent: 'تم إرسال رابط التحقق. افحص بريدك الإلكتروني ثم سجّل الدخول.',
    tooMany: 'تم إجراء محاولات كثيرة. حاول لاحقاً.',
    secure: 'حماية الهوية عبر Firebase Authentication',
    private: 'جلسة حسابك ومعلوماتك محمية',
    fast: 'طريقتان آمنتان لتسجيل الدخول',
    language: 'اللغة',
    back: 'العودة إلى الصفحة الرئيسية',
    footer: 'بالمتابعة، أنت توافق على استخدام حسابك للوصول الآمن إلى مساحة العمل.',
    cancelled: 'تم إلغاء تسجيل الدخول.',
    unauthorized: 'هذا النطاق غير مصرح به في Firebase Authentication.',
    failed: 'تعذر تسجيل الدخول.',
    configuration: 'إعداد Firebase Authentication غير مكتمل في نسخة الإنتاج. يرجى التواصل مع مسؤول المنصة.',
    providerDisabled: 'تسجيل الدخول بالبريد غير مفعّل في Firebase Console. يجب على المسؤول تفعيل موفّر Email/Password.',
    accountDisabled: 'تم تعطيل هذا الحساب بواسطة المسؤول.',
    panelEyebrow: 'SMART TRADE WORKSPACE',
    panelTitle: 'كل أدوات التجارة والخدمات اللوجستية في مكان واحد',
    panelText: 'استشارات ذكية وتقدير تكاليف وتوريد وKYC وتتبع شحنات داخل مساحة عمل موحدة.',
  },
  en: {
    loading: 'Checking your session...',
    badge: 'Secure access',
    title: 'Welcome back to AI Gate Iraq',
    description: 'Sign in with email and password or continue with Google.',
    email: 'Email address',
    password: 'Password',
    name: 'Full name',
    register: 'Create account',
    signInMode: 'Already have an account? Sign in',
    registerMode: 'New here? Create an account',
    remember: 'Remember me',
    login: 'Sign in',
    google: 'Continue with Google',
    or: 'or',
    forgot: 'Forgot password?',
    resetSent: 'A password reset link has been sent to your email.',
    enterEmail: 'Enter your email address first.',
    invalidCredentials: 'The email or password is incorrect.',
    invalidEmail: 'The email address is invalid.',
    emailInUse: 'An account already exists for this email address.',
    networkError: 'The network request failed. Check your connection and try again.',
    weakPassword: 'Password must contain at least 8 characters.',
    verificationSent: 'A verification link was sent. Check your email, then sign in.',
    tooMany: 'Too many attempts. Please try again later.',
    secure: 'Identity protected by Firebase Authentication',
    private: 'Your account session and information are protected',
    fast: 'Two secure sign-in options',
    language: 'Language',
    back: 'Back to landing page',
    footer: 'By continuing, you agree to use your account for secure workspace access.',
    cancelled: 'Sign-in was cancelled.',
    unauthorized: 'This domain is not authorized in Firebase Authentication.',
    failed: 'Unable to sign in.',
    configuration: 'Firebase Authentication is not configured in this production build. Contact the platform administrator.',
    providerDisabled: 'Email sign-in is disabled in Firebase Console. An administrator must enable the Email/Password provider.',
    accountDisabled: 'This account has been disabled by an administrator.',
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

export default function PlatformAccessGate({
  loading,
  onAuthenticated,
}: PlatformAccessGateProps) {
  const { lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState<'email' | 'google' | 'reset' | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const t = copy[lang as keyof typeof copy] ?? copy.ku;
  const isLtr = lang === 'en';

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setError(t.configuration);
      return;
    }

    void getRedirectResult(auth)
      .then((credential) => {
        if (credential?.user) onAuthenticated(credential.user);
      })
      .catch((err: any) => {
        const code = String(err?.code || '');
        if (code === 'auth/unauthorized-domain') setError(t.unauthorized);
        else if (code && code !== 'auth/no-auth-event') setError(t.failed);
      });
  }, [onAuthenticated, t.configuration, t.failed, t.unauthorized]);

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

  const friendlyError = (err: any) => {
    const code = String(err?.code || err?.message || '');
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return t.invalidCredentials;
    if (code.includes('invalid-email')) return t.invalidEmail;
    if (code.includes('email-already-in-use')) return t.emailInUse;
    if (code.includes('network-request-failed') || code.includes('timeout')) return t.networkError;
    if (code.includes('too-many-requests')) return t.tooMany;
    if (
      code.includes('unauthorized-domain') ||
      code.includes('app-not-authorized') ||
      code.includes('requests-from-referer') ||
      code.includes('API_KEY_HTTP_REFERRER_BLOCKED')
    ) return t.unauthorized;
    if (code.includes('operation-not-allowed')) return t.providerDisabled;
    if (code.includes('user-disabled')) return t.accountDisabled;
    if (code.includes('invalid-api-key') || code.includes('FIREBASE_AUTH_NOT_CONFIGURED') || code.includes('FIREBASE_AUTH_PROVIDER_NOT_CONFIGURED')) return t.configuration;
    if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) return t.cancelled;
    return t.failed;
  };

  const loginWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!isFirebaseConfigured || !auth) {
      setError(t.configuration);
      return;
    }
    setSubmitting('email');
    try {
      await setAuthPersistence(remember);
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === 'register') {
        if (displayName.trim().length < 2) {
          setError(t.name);
          return;
        }
        if (password.length < 8) {
          setError(t.weakPassword);
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        await updateProfile(credential.user, { displayName: displayName.trim() });
        await sendEmailVerification(credential.user, {
          url: `${window.location.origin}/workspace`,
          handleCodeInApp: false,
        });
        await signOut(auth);
        setMode('login');
        setPassword('');
        setMessage(t.verificationSent);
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const isPasswordUser = credential.user.providerData.some(
        (provider: { providerId: string }) => provider.providerId === 'password',
      );
      if (isPasswordUser && !credential.user.emailVerified) {
        try {
          await sendEmailVerification(credential.user, {
            url: `${window.location.origin}/workspace`,
            handleCodeInApp: false,
          });
          setMessage(t.verificationSent);
        } finally {
          await signOut(auth);
        }
        return;
      }

      onAuthenticated(credential.user);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(null);
    }
  };

  const loginWithGoogle = async () => {
    setError('');
    setMessage('');
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setError(t.configuration);
      return;
    }
    setSubmitting('google');
    try {
      await setAuthPersistence(remember);
      const credential = await signInWithPopup(auth, googleProvider);
      onAuthenticated(credential.user);
    } catch (err: any) {
      const code = String(err?.code || '');
      const shouldRedirect = [
        'auth/popup-blocked',
        'auth/web-storage-unsupported',
        'auth/operation-not-supported-in-this-environment',
        'auth/internal-error',
      ].includes(code);

      if (shouldRedirect) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      setError(friendlyError(err));
    } finally {
      setSubmitting(null);
    }
  };

  const resetPassword = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError(t.enterEmail);
      return;
    }

    setSubmitting('reset');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(t.resetSent);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-[#06101d] text-white" dir={isLtr ? 'ltr' : 'rtl'}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.26),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.14),transparent_27%),linear-gradient(180deg,#06101d_0%,#091827_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto grid min-h-dvh max-w-7xl items-stretch lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden border-e border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <BrandLogo size={48} className="h-12 w-12 rounded-2xl shadow-xl shadow-blue-500/20" eager />
              <div>
                <div className="flex items-center gap-2 text-lg font-black">AI Gate Iraq <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[9px] text-amber-200">PRO</span></div>
                <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-500">{BRAND_TAGLINE}</p>
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

        <section className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <a href="/" className="flex items-center gap-3">
                <BrandLogo size={40} className="h-10 w-10 rounded-xl" eager />
                <div>
                  <p className="text-sm font-black">AI Gate Iraq</p>
                  <p className="text-[9px] font-bold tracking-[0.16em] text-slate-500">{BRAND_TAGLINE}</p>
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

              <div className="mt-7 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1">
                <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className={`h-9 rounded-lg text-xs font-black transition-colors ${mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {t.login}
                </button>
                <button type="button" onClick={() => { setMode('register'); setError(''); setMessage(''); }} className={`h-9 rounded-lg text-xs font-black transition-colors ${mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {t.register}
                </button>
              </div>

              <form onSubmit={loginWithEmail} className="mt-5 space-y-4">
                {mode === 'register' ? (
                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-300">{t.name}</span>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 text-base text-white outline-none transition-colors focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                    />
                  </label>
                ) : null}
                <label className="block">
                  <span className="mb-2 block text-xs font-black text-slate-300">{t.email}</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      inputMode="email"
                      enterKeyHint="next"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-11 text-base text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black text-slate-300">{t.password}</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      minLength={mode === 'register' ? 8 : undefined}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-11 pe-12 text-base text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute end-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-400">
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-white/20 accent-blue-600" />
                    {t.remember}
                  </label>
                  {mode === 'login' ? (
                    <button type="button" onClick={() => void resetPassword()} disabled={submitting !== null} className="text-xs font-bold text-blue-300 transition-colors hover:text-blue-200 disabled:opacity-50">
                      {submitting === 'reset' ? <Loader2 className="inline h-4 w-4 animate-spin" /> : t.forgot}
                    </button>
                  ) : null}
                </div>

                <button type="submit" disabled={submitting !== null} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting === 'email' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  {mode === 'register' ? t.register : t.login}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-[10px] font-bold text-slate-600">
                <span className="h-px flex-1 bg-white/10" />
                {t.or}
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button type="button" onClick={() => void loginWithGoogle()} disabled={submitting !== null} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
                {submitting === 'google' ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleMark />}
                {t.google}
              </button>

              {error ? <p role="alert" aria-live="assertive" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-bold leading-6 text-rose-200">{error}</p> : null}
              {message ? <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-bold leading-6 text-emerald-200">{message}</p> : null}

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
                      <button key={item} type="button" onClick={() => setLang(item)} className={`h-7 min-w-8 rounded-md px-2 text-[9px] font-black transition ${lang === item ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
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
