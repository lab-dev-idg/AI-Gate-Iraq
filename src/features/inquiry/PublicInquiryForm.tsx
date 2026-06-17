import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send, Trash2 } from 'lucide-react';
import { createFirebaseIntakeItem } from '@/src/lib/firebaseAdminAdapter';

const fieldClass = 'w-full rounded-xl border border-slate-600 bg-[#111D31] px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20';

export function PublicInquiryForm({ onSuccessSubmitted }: { onSuccessSubmitted?: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', contact: '', serviceInterest: 'ڕاوێژکاری بازرگانی AI', message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const services = ['ڕاوێژکاری بازرگانی AI', 'کورتەی بازاڕ', 'دۆخی مەرزەکان', 'گۆڕینەوەی دراو', 'خەمڵاندنی تێچوو', 'KYC', 'دابینکردن و سەرچاوەدۆزی', 'بەدواداچوونی بار', 'نەخشەی لۆجستیک', 'پەیوەندی بازرگانی'];
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const clear = () => {
    setForm({ name: '', company: '', contact: '', serviceInterest: 'ڕاوێژکاری بازرگانی AI', message: '' });
    setError('');
    setDone(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError('تکایە خانە پێویستەکان تەواو بکە.');
      return;
    }

    setBusy(true);
    try {
      const id = await createFirebaseIntakeItem({
        ...form,
        name: form.name.trim(),
        company: form.company.trim(),
        contact: form.contact.trim(),
        message: form.message.trim(),
        category: 'public_inquiry',
      });
      if (!id) throw new Error('SAVE_FAILED');
      setDone(true);
      onSuccessSubmitted?.();
    } catch {
      setError('داواکارییەکەت تۆمار نەکرا. تکایە پەیوەندیی ئینتەرنێت بپشکنە و دووبارە هەوڵ بدەوە.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-[#0E1728] p-10 text-center text-white" dir="rtl">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="text-2xl font-black">داواکارییەکەت تۆمار کرا</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-300">تیمەکەمان پێداچوونەوەی بۆ دەکات و لە ڕێگەی زانیاریی پەیوەندییەوە وەڵامت دەداتەوە.</p>
        <button onClick={clear} className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400">ناردنی داواکارییەکی تر</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-700 bg-[#0E1728] p-6 text-slate-100 shadow-lg md:p-8" dir="rtl">
      <div className="border-b border-slate-700/80 pb-5">
        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">پەیوەندی بازرگانی</span>
        <h2 className="mt-3 text-2xl font-black text-white">داواکاری خزمەتگوزاری یان پەیوەندی</h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-300">وردەکارییەکانت بنووسە؛ داواکارییەکەت بە پارێزراوی لە Firestore تۆمار دەکرێت و تیمەکەمان پێداچوونەوەی بۆ دەکات.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="ناو" required><input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="ناوت بنووسە" className={fieldClass} /></Field>
        <Field label="کۆمپانیا"><input value={form.company} onChange={e => update('company', e.target.value)} placeholder="ناوی کۆمپانیا یان ڕێکخراو" className={fieldClass} /></Field>
        <Field label="ژمارە یان ئیمەیل" required><input required value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="info@company.com یان ژمارەی مۆبایل" className={fieldClass} /></Field>
        <Field label="خزمەتگوزاریی ئارەزوومەند"><select value={form.serviceInterest} onChange={e => update('serviceInterest', e.target.value)} className={fieldClass}>{services.map(service => <option key={service} value={service} className="bg-[#111D31] text-white">{service}</option>)}</select></Field>
      </div>

      <Field label="پەیام" required><textarea required value={form.message} onChange={e => update('message', e.target.value)} placeholder="پێداویستی و وردەکاریی پرۆژەکەت بنووسە..." rows={5} className={`${fieldClass} min-h-32 resize-y`} /></Field>

      {error && <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{busy ? 'تۆمارکردن...' : 'ناردنی داواکاری'}</button>
        <button type="button" onClick={clear} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-[#111D31] px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700"><Trash2 className="h-4 w-4" />پاککردنەوە</button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="block text-sm font-bold text-slate-200">{label}{required && <span className="text-emerald-400"> *</span>}</span>{children}</label>;
}

export default PublicInquiryForm;
