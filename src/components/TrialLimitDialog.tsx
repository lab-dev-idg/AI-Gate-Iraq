import { useEffect, useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';

export const TRIAL_LIMIT_EVENT = 'ai-gate-iraq:trial-limit';

export default function TrialLimitDialog() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(TRIAL_LIMIT_EVENT, show);
    return () => window.removeEventListener(TRIAL_LIMIT_EVENT, show);
  }, []);

  if (!open) return null;

  const title = lang === 'ar' ? 'انتهت تجربتك المجانية' : lang === 'en' ? 'Your free trial is complete' : 'تاقیکردنەوەی خۆڕاییت تەواو بوو';
  const text = lang === 'ar' ? 'استخدمت الأسئلة الثلاثة المتاحة. تواصل مع فريق الدعم للمتابعة.' : lang === 'en' ? 'You used the three available questions. Contact support to continue.' : 'سێ پرسیاری بەردەستت بەکارهێنا. بۆ بەردەوامبوون پەیوەندی بە تیمی پشتیوانی بکە.';
  const action = lang === 'ar' ? 'التواصل مع الدعم' : lang === 'en' ? 'Contact support' : 'پەیوەندی بە پشتیوانی';
  const close = lang === 'ar' ? 'إغلاق' : lang === 'en' ? 'Close' : 'داخستن';

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="relative w-full max-w-lg rounded-[2rem] border border-amber-300/20 bg-[#101827] p-7 text-white shadow-2xl sm:p-9">
        <button type="button" onClick={() => setOpen(false)} aria-label={close} className="absolute end-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300"><X className="h-4 w-4" /></button>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-950"><Crown className="h-7 w-7" /></span>
        <p className="mt-5 text-xs font-black tracking-[0.2em] text-amber-300">AI GATE IRAQ PRO</p>
        <h2 className="mt-3 text-2xl font-black sm:text-3xl">{title}</h2>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-300">{text}</p>
        <a href="mailto:support@idg.official.iq" className="mt-7 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 text-sm font-black text-slate-950">{action}</a>
        <button type="button" onClick={() => setOpen(false)} className="mt-3 h-10 w-full rounded-xl text-xs font-black text-slate-400">{close}</button>
      </div>
    </div>
  );
}
