import { useEffect, useState } from 'react';
import { CheckCircle2, Crown, Loader2, Mail, WalletCards, X } from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';
import { requestProActivation } from '@/src/lib/subscription';
import {
  getPaymentConfig,
  startZainCashCheckout,
  type PublicPaymentConfig,
} from '@/src/lib/payments';

export const TRIAL_LIMIT_EVENT = 'ai-gate-iraq:trial-limit';

export default function TrialLimitDialog() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startingPayment, setStartingPayment] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PublicPaymentConfig | null>(null);
  const [requestState, setRequestState] = useState<'idle' | 'sent' | 'pending' | 'active' | 'error' | 'payment-success' | 'payment-failed' | 'payment-error'>('idle');

  useEffect(() => {
    const show = () => {
      setRequestState('idle');
      setOpen(true);
    };
    window.addEventListener(TRIAL_LIMIT_EVENT, show);
    return () => window.removeEventListener(TRIAL_LIMIT_EVENT, show);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (!payment) return;
    if (payment === 'succeeded') setRequestState('payment-success');
    else if (payment === 'failed' || payment === 'expired') setRequestState('payment-failed');
    else if (payment === 'verification_error') setRequestState('payment-error');
    else return;
    setOpen(true);
    params.delete('payment');
    params.delete('paymentOrder');
    const nextSearch = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void getPaymentConfig().then((config) => {
      if (!cancelled) setPaymentConfig(config);
    });
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  const title = lang === 'ar' ? 'انتهت تجربتك المجانية' : lang === 'en' ? 'Your free trial is complete' : 'تاقیکردنەوەی خۆڕاییت تەواو بوو';
  const text = lang === 'ar' ? 'استخدمت الأسئلة الثلاثة المتاحة. أرسل طلب تفعيل Pro وسيظهر مباشرة في لوحة الإدارة.' : lang === 'en' ? 'You used the three available questions. Request Pro activation and it will appear directly in the admin panel.' : 'سێ پرسیاری خۆڕاییت بەکارهێنا. داواکاری چالاککردنی Pro بنێرە تا ڕاستەوخۆ لە پانڵی ئادمین دەربکەوێت.';
  const action = lang === 'ar' ? 'طلب تفعيل Pro' : lang === 'en' ? 'Request Pro activation' : 'داواکاری چالاککردنی Pro';
  const close = lang === 'ar' ? 'إغلاق' : lang === 'en' ? 'Close' : 'داخستن';

  const submitRequest = async () => {
    setSubmitting(true);
    setRequestState('idle');
    try {
      const result = await requestProActivation();
      setRequestState(result === 'created' ? 'sent' : result);
    } catch (error) {
      console.error('Pro activation request failed.', error);
      setRequestState('error');
    } finally {
      setSubmitting(false);
    }
  };

  const startPayment = async () => {
    setStartingPayment(true);
    setRequestState('idle');
    try {
      await startZainCashCheckout(lang);
    } catch (error) {
      console.error('ZainCash checkout failed.', error);
      setRequestState('payment-error');
      setStartingPayment(false);
    }
  };

  const feedback = requestState === 'sent'
    ? (lang === 'ar' ? 'تم إرسال الطلب إلى الإدارة.' : lang === 'en' ? 'Your request was sent to the admin team.' : 'داواکارییەکەت بۆ ئادمین نێردرا.')
    : requestState === 'pending'
      ? (lang === 'ar' ? 'طلبك موجود بالفعل وقيد المراجعة.' : lang === 'en' ? 'Your request is already pending review.' : 'داواکارییەکەت پێشتر نێردراوە و چاوەڕوانی پێداچوونەوەیە.')
      : requestState === 'active'
        ? (lang === 'ar' ? 'اشتراك Pro مفعل بالفعل.' : lang === 'en' ? 'Your Pro subscription is already active.' : 'پلانی Pro ـەکەت پێشتر چالاک کراوە.')
        : requestState === 'payment-success'
          ? (lang === 'ar' ? 'تم تأكيد الدفع وتفعيل اشتراك Pro.' : lang === 'en' ? 'Payment confirmed and Pro is now active.' : 'پارەدان پشتڕاست کرایەوە و پلانی Pro چالاک بوو.')
          : requestState === 'payment-failed'
            ? (lang === 'ar' ? 'لم تكتمل عملية الدفع. لم يتم خصم أو تفعيل الاشتراك.' : lang === 'en' ? 'Payment was not completed. Pro was not activated.' : 'پارەدان تەواو نەبوو؛ پلانی Pro چالاک نەکرا.')
            : requestState === 'payment-error'
              ? (lang === 'ar' ? 'تعذر التحقق من الدفع. حاول مرة أخرى أو تواصل مع الدعم.' : lang === 'en' ? 'Payment could not be verified. Try again or contact support.' : 'پشتڕاستکردنەوەی پارەدان سەرکەوتوو نەبوو؛ دووبارە هەوڵ بدەوە یان پەیوەندی بە یارمەتی بکە.')
        : requestState === 'error'
          ? (lang === 'ar' ? 'تعذر إرسال الطلب. حاول مرة أخرى أو تواصل مع الدعم.' : lang === 'en' ? 'The request could not be sent. Try again or contact support.' : 'ناردنی داواکاری سەرکەوتوو نەبوو؛ دووبارە هەوڵ بدەوە یان پەیوەندی بە یارمەتی بکە.')
          : '';

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="relative w-full max-w-lg rounded-[2rem] border border-amber-300/20 bg-[#101827] p-7 text-white shadow-2xl sm:p-9">
        <button type="button" onClick={() => setOpen(false)} aria-label={close} className="absolute end-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300"><X className="h-4 w-4" /></button>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-950"><Crown className="h-7 w-7" /></span>
        <p className="mt-5 text-xs font-black tracking-[0.2em] text-amber-300">AI GATE IRAQ PRO</p>
        <h2 className="mt-3 text-2xl font-black sm:text-3xl">{title}</h2>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-300">{text}</p>
        {feedback ? (
          <div className={`mt-6 flex items-start gap-2 rounded-2xl border px-4 py-3 text-xs font-bold leading-6 ${['error', 'payment-failed', 'payment-error'].includes(requestState) ? 'border-rose-400/20 bg-rose-400/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>
            {!['error', 'payment-failed', 'payment-error'].includes(requestState) ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" /> : null}
            <span>{feedback}</span>
          </div>
        ) : null}
        {paymentConfig ? (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
              <span>Pro — {paymentConfig.durationDays} {lang === 'ar' ? 'يوم' : lang === 'en' ? 'days' : 'ڕۆژ'}</span>
              <span>{new Intl.NumberFormat(lang === 'en' ? 'en-IQ' : 'ar-IQ').format(paymentConfig.amount)} IQD</span>
            </div>
            <button type="button" onClick={() => void startPayment()} disabled={startingPayment || requestState === 'payment-success'} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ec1c24] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
              {startingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <WalletCards className="h-4 w-4" />}
              Pay with ZainCash
            </button>
          </div>
        ) : null}
        <button type="button" onClick={() => void submitRequest()} disabled={submitting || requestState === 'sent' || requestState === 'pending' || requestState === 'active'} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
          {action}
        </button>
        <a href="mailto:support@idg.official.iq" className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-black text-slate-400 hover:bg-white/5 hover:text-slate-200"><Mail className="h-4 w-4" />support@idg.official.iq</a>
        <button type="button" onClick={() => setOpen(false)} className="mt-3 h-10 w-full rounded-xl text-xs font-black text-slate-400">{close}</button>
      </div>
    </div>
  );
}
