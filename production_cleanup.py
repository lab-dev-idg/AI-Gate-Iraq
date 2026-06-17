#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path.cwd()

def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

write('src/admin/AdminAccessGate.tsx', "export { FirebaseAdminGate as AdminAccessGate } from './FirebaseAdminGate';\n")

write('src/features/inquiry/PublicInquiryForm.tsx', r'''import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { createFirebaseIntakeItem } from '@/src/lib/firebaseAdminAdapter';

export function PublicInquiryForm({ onSuccessSubmitted }: { onSuccessSubmitted?: () => void }) {
  const [form, setForm] = useState({ name: '', company: '', contact: '', serviceInterest: 'ڕاوێژکاری بازرگانی AI', message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const services = ['ڕاوێژکاری بازرگانی AI', 'کورتەی بازاڕ', 'دۆخی مەرزەکان', 'گۆڕینەوەی دراو', 'خەمڵاندنی تێچوو', 'KYC', 'دابینکردن و سەرچاوەدۆزی', 'بەدواداچوونی بار', 'نەخشەی لۆجستیک', 'پەیوەندی بازرگانی'];
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError('تکایە خانە پێویستەکان تەواو بکە.');
      return;
    }
    setBusy(true);
    try {
      const id = await createFirebaseIntakeItem({ ...form, name: form.name.trim(), company: form.company.trim(), contact: form.contact.trim(), message: form.message.trim(), category: 'public_inquiry' });
      if (!id) throw new Error('SAVE_FAILED');
      setDone(true);
      onSuccessSubmitted?.();
    } catch {
      setError('داواکارییەکەت تۆمار نەکرا. تکایە دووبارە هەوڵ بدەوە.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8 text-center text-white" dir="rtl"><CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" /><h2 className="text-lg font-black">داواکارییەکەت تۆمار کرا</h2><p className="mt-2 text-sm text-slate-400">تیمەکەمان پێداچوونەوەی بۆ دەکات و پەیوەندیت پێوە دەکات.</p></div>;
  }

  return <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8" dir="rtl">
    <div><h2 className="text-xl font-black text-white">داواکاری خزمەتگوزاری یان پەیوەندی</h2><p className="mt-1 text-sm text-slate-400">زانیارییەکان بە پارێزراوی تۆمار دەکرێن.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="ناو" className={fieldClass} />
      <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="کۆمپانیا" className={fieldClass} />
      <input required value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="ئیمەیل یان ژمارەی مۆبایل" className={fieldClass} />
      <select value={form.serviceInterest} onChange={e => update('serviceInterest', e.target.value)} className={fieldClass}>{services.map(service => <option key={service} value={service}>{service}</option>)}</select>
    </div>
    <textarea required value={form.message} onChange={e => update('message', e.target.value)} placeholder="وردەکاریی داواکاری" rows={5} className={fieldClass} />
    {error && <p className="flex items-center gap-2 text-xs text-rose-400"><AlertCircle className="h-4 w-4" />{error}</p>}
    <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{busy ? 'تۆمارکردن...' : 'ناردنی داواکاری'}</button>
  </form>;
}

const fieldClass = 'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-white outline-none focus:border-emerald-500';
export default PublicInquiryForm;
''')

write('src/components/ShipmentTracker.tsx', r'''import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { History, PackageSearch, Search, Truck } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { db, collection, query, onSnapshot, orderBy, doc, getDoc } from '@/src/lib/firebase';
import { useLanguage } from '@/src/lib/LanguageContext';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

interface ShipmentData { id?: string; trackingNumber: string; status?: string; origin?: string; destination?: string; estimatedDelivery?: string; updatedAt?: unknown; }

export function ShipmentTracker() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [trackingId, setTrackingId] = useState(() => loadSession().drafts.trackingNumber || '');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [history, setHistory] = useState<ShipmentData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { saveSession({ drafts: { trackingNumber: trackingId } }); }, [trackingId]);
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    const q = query(collection(db, `users/${user.uid}/shipments`), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, snapshot => setHistory(snapshot.docs.map(item => ({ id: item.id, ...(item.data() as Omit<ShipmentData, 'id'>) }))));
  }, [user]);

  const handleTrack = async (value?: string) => {
    const id = (value || trackingId).trim().toUpperCase();
    if (!id) return;
    setError(''); setShipment(null);
    if (!user) { setError(lang === 'ar' ? 'يرجى تسجيل الدخول لعرض شحنات حسابك.' : 'تکایە بچۆ ژوورەوە بۆ بینینی بارەکانی هەژمارەکەت.'); return; }
    setIsSearching(true);
    try {
      const snapshot = await getDoc(doc(db, `users/${user.uid}/shipments`, id));
      if (!snapshot.exists()) { setError(lang === 'ar' ? 'لم يتم العثور على شحنة مرتبطة بهذا الرقم في حسابك.' : 'هیچ بارێکی پەیوەست بەم ژمارەیە لە هەژمارەکەت نەدۆزرایەوە.'); return; }
      const data = snapshot.data() as ShipmentData;
      setShipment({ ...data, id: snapshot.id, trackingNumber: data.trackingNumber || id });
      addServiceAction(`Viewed shipment: ${id}`, 'tracking');
    } catch { setError(lang === 'ar' ? 'تعذر تحميل بيانات الشحنة.' : 'بارکردنی زانیاریی بار سەرکەوتوو نەبوو.'); }
    finally { setIsSearching(false); }
  };

  return <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80">
    <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-800/80"><CardTitle className="flex items-center justify-between text-lg text-slate-950 dark:text-white"><span className="flex items-center gap-2"><Truck className="h-5 w-5 text-emerald-500" />{t.tracker.title}</span><Button variant="ghost" size="sm" onClick={() => setShowHistory(v => !v)} className="gap-1 text-xs text-emerald-600"><History className="h-4 w-4" />{t.tracker.history}</Button></CardTitle></CardHeader>
    <CardContent className="space-y-4 p-6">{!showHistory ? <><div className="space-y-2 text-right" dir="rtl"><Label>{lang === 'ar' ? 'رقم التتبع' : 'ژمارەی بەدواداچوون'}</Label><div className="flex gap-2"><Input value={trackingId} onChange={e => setTrackingId(e.target.value)} onKeyDown={e => e.key === 'Enter' && void handleTrack()} placeholder={t.tracker.placeholder} /><Button onClick={() => void handleTrack()} disabled={isSearching} size="icon" className="bg-emerald-500 text-white"><Search className={isSearching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} /></Button></div></div>{error && <p className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-3 text-right text-xs text-rose-500">{error}</p>}{shipment && <div className="space-y-3 rounded-2xl border border-slate-200 p-4 text-right text-sm dark:border-slate-800" dir="rtl"><p className="font-mono text-xs text-slate-500">{shipment.trackingNumber}</p><p><strong>{lang === 'ar' ? 'الحالة:' : 'دۆخ:'}</strong> {shipment.status || '—'}</p><p><strong>{lang === 'ar' ? 'من:' : 'سەرچاوە:'}</strong> {shipment.origin || '—'}</p><p><strong>{lang === 'ar' ? 'إلى:' : 'مەبەست:'}</strong> {shipment.destination || '—'}</p><p><strong>{lang === 'ar' ? 'التسليم المتوقع:' : 'گەیاندنی پێشبینیکراو:'}</strong> {shipment.estimatedDelivery || '—'}</p></div>}</> : history.length > 0 ? <div className="space-y-2">{history.map(item => <button key={item.id || item.trackingNumber} onClick={() => void handleTrack(item.trackingNumber)} className="w-full rounded-xl border border-slate-200 p-3 text-right dark:border-slate-800"><p className="font-mono text-xs">{item.trackingNumber}</p><p className="text-xs text-slate-500">{item.status || '—'}</p></button>)}</div> : <div className="py-8 text-center text-slate-500"><PackageSearch className="mx-auto mb-2 h-8 w-8" /><p className="text-xs">{t.tracker.noHistory}</p></div>}</CardContent>
  </Card>;
}
export default ShipmentTracker;
''')

# Disable unsupported attachment simulation.
p = ROOT / 'src/features/assistant/ChatInput.tsx'
if p.exists():
    text = p.read_text(encoding='utf-8')
    text = text.replace("finalPrompt = `${trimmedInput}\\n\\n[Attachment selected: ${attachment.name} — pilot file analysis support is limited in this demo.]`.trim();", "throw new Error('FILE_UPLOAD_UNAVAILABLE');")
    p.write_text(text, encoding='utf-8')

# Remove seeded records and production-facing pilot text.
p = ROOT / 'src/admin/adminDefaults.ts'
if p.exists():
    text = p.read_text(encoding='utf-8')
    text = re.sub(r"\n\s*pilotNoteKu:\s*'[^']*',\n\s*pilotNoteAr:\s*'[^']*',", '', text)
    text = re.sub(r"\n\s*intake:\s*\[[\s\S]*?\n\s*\],\n\s*contents:", '\n  intake: [],\n  contents:', text, count=1)
    text = re.sub(r"\n\s*logs:\s*\[[\s\S]*?\n\s*\]\n};", '\n  logs: []\n};', text, count=1)
    text = text.replace('نیشاندانی هۆشداری تاقیکاری', 'نیشاندانی ئاگاداری بەکارهێنان')
    text = text.replace('نیشاندانی فۆڕمی داواکاری و دیمۆ', 'نیشاندانی فۆڕمی پەیوەندی و داواکاری')
    text = text.replace('سەرپەرشتیاری تاقیکاری (Admin)', 'سەرپەرشتیار')
    text = re.sub(r"(key:\s*'enable_file_upload'[\s\S]*?enabled:)\s*true", r'\1 false', text, count=1)
    text = re.sub(r"(key:\s*'enable_multimodal'[\s\S]*?enabled:)\s*true", r'\1 false', text, count=1)
    p.write_text(text, encoding='utf-8')

replacements = {
    'src/admin/AdminLayout.tsx': {'Pilot Admin': 'ADMIN'},
    'src/app/AppHeader.tsx': {'چوونەژوورەوەی سەرپەرشتیاری پایلۆت': 'چوونەژوورەوەی سەرپەرشتیار'},
    'src/admin/adminStore.ts': {'سەرپەرشتیاری تاقیکاری (Admin)': 'سەرپەرشتیار'},
    'src/lib/translations.ts': {
        'داتای تەمسیلی و سنووردار': 'زانیاری و ڕێنمایی کاری',
        'داتای تاقیکاری': 'زانیاری کاری',
        'ئەم وەشانە پایلۆتە. هەندێک خزمەتگوزاری داتای تاقیکاری یان بەستنی سنووردار بەکاردەهێنێت.': 'زانیاری و خەمڵاندنەکان بۆ پشتگیری بڕیاری بازرگانییە و پێویستە لە سەرچاوە پەیوەندیدارەکان پشتڕاست بکرێنەوە.',
        'بيانات تجريبية / محاكاة محدودة': 'معلومات وإرشادات تشغيلية',
        'بيانات تجريبية': 'معلومات تشغيلية',
        'هذه نسخة تجريبية. بعض الخدمات تستخدم بيانات تجريبية أو تكاملات محدودة.': 'المعلومات والتقديرات مخصصة لدعم قرارات الأعمال ويجب التحقق منها من المصادر ذات الصلة.'
    },
    'server.ts': {'کەی داتا تاقیکارییە (Demo Data) یان سنووردارە': 'کەی داتا خەمڵێنراوە یان سنووردارە'}
}
for file, items in replacements.items():
    p = ROOT / file
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    for old, new in items.items():
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8')

for file in ['src/lib/launchKit.ts', 'src/lib/canvaLaunchBlueprint.ts', 'docs/PILOT_QA_CHECKLIST.md', 'docs/LIVE_DEMO_READINESS.md', 'docs/ADMIN_PANEL_GUIDE.md', 'docs/FIREBASE_SPARK_SETUP.md']:
    target = ROOT / file
    if target.exists():
        target.unlink()

print('Production cleanup applied.')

# Additional admin UI cleanup.
admin_replacements = {
    'src/admin/screens/AdminDashboard.tsx': {
        'دوایین کردارەکانی تاقیکاری': 'دوایین کردارەکان',
        'ڕێکخستنەکانی پایلۆت': 'ڕێکخستنەکانی پلاتفۆرم',
        'ئاگاداری گرنگی پایلۆت': 'ئاگاداری گرنگ',
        'ئەم داشبۆردە تەنها نوێنەرایەتی ڕوکارێکی لۆکاڵ دەکات بۆ نیشاندانی تاقیکاری بەڕێوەبردن (Admin Gateway). گشت گۆڕانکارییەکان لێرە بە سادەیی لە لۆکاڵ ستۆریجدا پاشەکەوت دەکرێن و بۆ ڕاستەقینە کارا دەبن بەبێ بوونی جێگیری داتابەیسی سەلامەت.': 'گۆڕانکارییەکانی بەڕێوەبەرایەتی لە Firestore هاوکات دەکرێن و بە ڕێگەپێدانی هەژماری سەرپەرشتیار پارێزراون.'
    },
    'src/admin/screens/AdminSettings.tsx': {
        'هۆشداری سەرپەرشتیاری تاقیکاری': 'ئاگاداری بەڕێوەبردنی داتا',
        'ئەم داشبۆردە لە دۆخی پایلۆتدا داتا لە براوسەرەکەتدا (LocalStorage) هەڵدەگرێت. بۆ بەرهەمهێنانی ڕاستەقینە پێویستی بە داتابەیس و ئەمنیەتی فەرمی سێرڤەری مژارکراو هەیە.': 'ڕێکخستنەکان لە Firestore هاوکات دەکرێن؛ LocalStorage تەنها بۆ cache ـی ناوخۆیی بەکاردێت.',
        'دۆخی پایلۆت و فڵاگەکان': 'فڵاگ و ڕێکخستنەکانی خزمەتگوزاری',
        'پیشاندانی ئاگاداری پایلۆت': 'پیشاندانی ئاگاداری بەکارهێنان',
        'زانیاری پایلۆتی ئادمین': 'زانیاری بەڕێوەبەرایەتی',
        'نەخشەی بنەڕەتی تاقیکاری': 'ڕێکخستنی بنەڕەتی',
        'پایلۆتی ناوخۆیی (Local Pilot)': 'ڕێکخستن تەواو نییە',
        'Local Sandbox': 'Unconfigured'
    },
    'src/admin/screens/FeatureFlagsManager.tsx': {
        'هۆشداری تاقیکاری (show_pilot_limits)': 'ئاگاداری بەکارهێنان',
        'ئەم لۆجیکە بڕیار دەدات ئایا ئۆنۆبۆردین و تێکستەکانی ئاگاداری کە دەڵێن ئەمە دەروازەیەکی فەرمی حکومەتی عێراق نییە نیشان بدرێت، تاکو لە کاتی تاقیکردنەوە پایلۆت دڵنیایی هەبێت.': 'ئەم فڵاگە نیشاندانی ئاگادارییەکانی بەکارهێنان و پشتڕاستکردنەوەی زانیاری کۆنترۆڵ دەکات.'
    },
    'src/admin/screens/ServiceManager.tsx': {
        'تەنها بۆ نمایش (Demo Only)': 'ناچالاک',
        'تێبینی پایلۆت (نیشاندانی تێکستی بچوک لە ماڵپەڕ لەژێر فۆرمەکە)': 'تێبینی بەکارهێنان',
        'نموونە: ئەم بەشە تەنها دیمۆیە...': 'تێبینی بەکارهێنان بنووسە...'
    },
    'src/admin/screens/ContentManager.tsx': {
        'لەم وەشانە تاقیکارییەدا، پاشەکەوتکردن بە فەرمی لە LocalStorage دەپارێزرێت بۆ ئەوەی بێ زانینی هێڵی داتابەیس پشکنینەکان کارا بن.': 'ناوەڕۆک لە Firestore هاوکات دەکرێت و LocalStorage تەنها بۆ cache ـی ناوخۆیی بەکاردێت.'
    },
}
for file, items in admin_replacements.items():
    p = ROOT / file
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    for old, new in items.items():
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8')

# Remove obsolete status options and legacy note labels while retaining type compatibility.
p = ROOT / 'src/admin/screens/ServiceManager.tsx'
if p.exists():
    text = p.read_text(encoding='utf-8')
    text = text.replace('<option value="demo_only">ناچالاک</option>', '')
    p.write_text(text, encoding='utf-8')

# Replace README with production-safe project overview.
write('README.md', '''# AI Gate Iraq\n\nAI Gate Iraq is a privately owned commercial service platform for Iraqi traders, SMEs, importers, exporters, logistics operators, procurement teams, founders, and service providers.\n\n## Core services\n\n- AI Business Advisor\n- Market and trade guidance\n- Border and logistics planning\n- Currency conversion and cost estimation\n- Business account onboarding\n- Procurement and sourcing requests\n- Shipment records associated with authenticated user accounts\n- Public service inquiries stored in Firestore\n\n## Security and runtime\n\n- Firebase Authentication with Google sign-in\n- Firestore rules protected by `adminUsers/{uid}` authorization\n- Server-side Gemini API proxy\n- No client-side Gemini secret\n- No mock authentication or fabricated shipment records\n- File uploads remain disabled until Firebase Storage is enabled\n\n## Local verification\n\n```bash\nnpm run check:project\nnpm run lint\nnpm run build\n```\n''')

# Remove obsolete documentation that describes fallback, sample, or pre-release behavior.
for file in ['docs/KNOWN_LIMITATIONS.md', 'docs/SMOKE_TEST_SCRIPT.md', 'docs/FIREBASE_RUNTIME_VERIFICATION.md', 'docs/FIRESTORE_DATA_MODEL.md']:
    target = ROOT / file
    if target.exists():
        target.unlink()

print('Additional production UI and documentation cleanup applied.')
