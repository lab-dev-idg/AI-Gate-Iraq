#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path.cwd()

def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

def replace(rel: str, pairs: list[tuple[str, str]]) -> None:
    path = ROOT / rel
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    for old, new in pairs:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")

def regex_replace(rel: str, pattern: str, repl: str, count: int = 0) -> None:
    path = ROOT / rel
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = re.sub(pattern, repl, text, count=count, flags=re.S)
    path.write_text(text, encoding="utf-8")

def clean(rel: str) -> None:
    path = ROOT / rel
    if not path.exists():
        return
    lines = path.read_text(encoding="utf-8").splitlines()
    path.write_text("\n".join(line.rstrip() for line in lines) + "\n", encoding="utf-8")

# 1. Permanently remove legacy admin passcode behavior.
write(
    "src/admin/AdminAccessGate.tsx",
    "export { FirebaseAdminGate as AdminAccessGate } from './FirebaseAdminGate';\n",
)

# 2. Public inquiry: persist to Firestore, no LocalStorage success simulation.
write(
    "src/features/inquiry/PublicInquiryForm.tsx",
    """import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { createFirebaseIntakeItem } from '@/src/lib/firebaseAdminAdapter';

const fieldClass =
  'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-white outline-none focus:border-emerald-500';

export function PublicInquiryForm({
  onSuccessSubmitted,
}: {
  onSuccessSubmitted?: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    contact: '',
    serviceInterest: 'ڕاوێژکاری بازرگانی AI',
    message: '',
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'ڕاوێژکاری بازرگانی AI',
    'کورتەی بازاڕ',
    'دۆخی مەرزەکان',
    'گۆڕینەوەی دراو',
    'خەمڵاندنی تێچوو',
    'KYC',
    'دابینکردن و سەرچاوەدۆزی',
    'بەدواداچوونی بار',
    'نەخشەی لۆجستیک',
    'پەیوەندی بازرگانی',
  ];

  const update = (key: keyof typeof form, value: string) =>
    setForm(current => ({ ...current, [key]: value }));

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
      setError('داواکارییەکەت تۆمار نەکرا. تکایە دووبارە هەوڵ بدەوە.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8 text-center text-white"
        dir="rtl"
      >
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
        <h2 className="text-lg font-black">داواکارییەکەت تۆمار کرا</h2>
        <p className="mt-2 text-sm text-slate-400">
          تیمەکەمان پێداچوونەوەی بۆ دەکات و پەیوەندیت پێوە دەکات.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8"
      dir="rtl"
    >
      <div>
        <h2 className="text-xl font-black text-white">
          داواکاری خزمەتگوزاری یان پەیوەندی
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          زانیارییەکان بە پارێزراوی تۆمار دەکرێن.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={event => update('name', event.target.value)}
          placeholder="ناو"
          className={fieldClass}
        />
        <input
          value={form.company}
          onChange={event => update('company', event.target.value)}
          placeholder="کۆمپانیا"
          className={fieldClass}
        />
        <input
          required
          value={form.contact}
          onChange={event => update('contact', event.target.value)}
          placeholder="ئیمەیل یان ژمارەی مۆبایل"
          className={fieldClass}
        />
        <select
          value={form.serviceInterest}
          onChange={event => update('serviceInterest', event.target.value)}
          className={fieldClass}
        >
          {services.map(service => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        value={form.message}
        onChange={event => update('message', event.target.value)}
        placeholder="وردەکاریی داواکاری"
        rows={5}
        className={fieldClass}
      />

      {error && (
        <p className="flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <button
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {busy ? 'تۆمارکردن...' : 'ناردنی داواکاری'}
      </button>
    </form>
  );
}

export default PublicInquiryForm;
""",
)

# 3. Shipment tracker: read only real Firestore shipment documents.
write(
    "src/components/ShipmentTracker.tsx",
    """import { useEffect, useState } from 'react';
import { History, PackageSearch, Search, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthProvider';
import {
  db,
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from '@/src/lib/firebase';
import { useLanguage } from '@/src/lib/LanguageContext';
import {
  loadSession,
  saveSession,
  addServiceAction,
} from '@/src/lib/sessionStore';

interface ShipmentData {
  id?: string;
  trackingNumber: string;
  status?: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string;
}

export function ShipmentTracker() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [trackingId, setTrackingId] = useState(
    () => loadSession().drafts.trackingNumber || '',
  );
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [history, setHistory] = useState<ShipmentData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    saveSession({ drafts: { trackingNumber: trackingId } });
  }, [trackingId]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const shipmentsQuery = query(
      collection(db, `users/${user.uid}/shipments`),
      orderBy('updatedAt', 'desc'),
    );

    return onSnapshot(shipmentsQuery, snapshot => {
      setHistory(
        snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<ShipmentData, 'id'>),
        })),
      );
    });
  }, [user]);

  const handleTrack = async (value?: string) => {
    const id = (value || trackingId).trim().toUpperCase();
    if (!id) return;

    setError('');
    setShipment(null);

    if (!user) {
      setError(
        lang === 'ar'
          ? 'يرجى تسجيل الدخول لعرض شحنات حسابك.'
          : 'تکایە بچۆ ژوورەوە بۆ بینینی بارەکانی هەژمارەکەت.',
      );
      return;
    }

    setIsSearching(true);
    try {
      const snapshot = await getDoc(
        doc(db, `users/${user.uid}/shipments`, id),
      );

      if (!snapshot.exists()) {
        setError(
          lang === 'ar'
            ? 'لم يتم العثور على شحنة مرتبطة بهذا الرقم في حسابك.'
            : 'هیچ بارێکی پەیوەست بەم ژمارەیە لە هەژمارەکەت نەدۆزرایەوە.',
        );
        return;
      }

      const data = snapshot.data() as ShipmentData;
      setShipment({
        ...data,
        id: snapshot.id,
        trackingNumber: data.trackingNumber || id,
      });
      addServiceAction(`Viewed shipment: ${id}`, 'tracking');
    } catch {
      setError(
        lang === 'ar'
          ? 'تعذر تحميل بيانات الشحنة.'
          : 'بارکردنی زانیاریی بار سەرکەوتوو نەبوو.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80">
      <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-800/80">
        <CardTitle className="flex items-center justify-between text-lg text-slate-950 dark:text-white">
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-500" />
            {t.tracker.title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(current => !current)}
            className="gap-1 text-xs text-emerald-600"
          >
            <History className="h-4 w-4" />
            {t.tracker.history}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {!showHistory ? (
          <>
            <div className="space-y-2 text-right" dir="rtl">
              <Label>{lang === 'ar' ? 'رقم التتبع' : 'ژمارەی بەدواداچوون'}</Label>
              <div className="flex gap-2">
                <Input
                  value={trackingId}
                  onChange={event => setTrackingId(event.target.value)}
                  onKeyDown={event =>
                    event.key === 'Enter' && void handleTrack()
                  }
                  placeholder={t.tracker.placeholder}
                />
                <Button
                  onClick={() => void handleTrack()}
                  disabled={isSearching}
                  size="icon"
                  className="bg-emerald-500 text-white"
                >
                  <Search
                    className={
                      isSearching
                        ? 'h-4 w-4 animate-spin'
                        : 'h-4 w-4'
                    }
                  />
                </Button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-3 text-right text-xs text-rose-500">
                {error}
              </p>
            )}

            {shipment && (
              <div
                className="space-y-3 rounded-2xl border border-slate-200 p-4 text-right text-sm dark:border-slate-800"
                dir="rtl"
              >
                <p className="font-mono text-xs text-slate-500">
                  {shipment.trackingNumber}
                </p>
                <p><strong>{lang === 'ar' ? 'الحالة:' : 'دۆخ:'}</strong> {shipment.status || '—'}</p>
                <p><strong>{lang === 'ar' ? 'من:' : 'سەرچاوە:'}</strong> {shipment.origin || '—'}</p>
                <p><strong>{lang === 'ar' ? 'إلى:' : 'مەبەست:'}</strong> {shipment.destination || '—'}</p>
                <p><strong>{lang === 'ar' ? 'التسليم المتوقع:' : 'گەیاندنی پێشبینیکراو:'}</strong> {shipment.estimatedDelivery || '—'}</p>
              </div>
            )}
          </>
        ) : history.length > 0 ? (
          <div className="space-y-2">
            {history.map(item => (
              <button
                key={item.id || item.trackingNumber}
                onClick={() => void handleTrack(item.trackingNumber)}
                className="w-full rounded-xl border border-slate-200 p-3 text-right dark:border-slate-800"
              >
                <p className="font-mono text-xs">{item.trackingNumber}</p>
                <p className="text-xs text-slate-500">
                  {item.status || '—'}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">
            <PackageSearch className="mx-auto mb-2 h-8 w-8" />
            <p className="text-xs">{t.tracker.noHistory}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShipmentTracker;
""",
)

# 4. Shipping calculator: user-supplied rates only.
write(
    "src/components/ShippingCalculator.tsx",
    """import { useMemo, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/src/lib/LanguageContext';
import { addServiceAction } from '@/src/lib/sessionStore';

export function ShippingCalculator() {
  const { lang } = useLanguage();
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [baseFee, setBaseFee] = useState('');
  const [ratePerKg, setRatePerKg] = useState('');

  const result = useMemo(() => {
    const actualWeight = Number(weight) || 0;
    const volumetricWeight =
      ((Number(length) || 0) *
        (Number(width) || 0) *
        (Number(height) || 0)) /
      5000;
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);
    const base = Number(baseFee);
    const rate = Number(ratePerKg);

    if (
      chargeableWeight <= 0 ||
      !Number.isFinite(base) ||
      !Number.isFinite(rate)
    ) {
      return null;
    }

    return {
      volumetricWeight,
      chargeableWeight,
      total: base + chargeableWeight * rate,
    };
  }, [weight, length, width, height, baseFee, ratePerKg]);

  return (
    <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900/80">
      <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-white">
          <Calculator className="h-5 w-5 text-emerald-500" />
          {lang === 'ar'
            ? 'تقدير تكلفة الشحن'
            : 'خەمڵاندنی تێچووی گواستنەوە'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-6" dir="rtl">
        <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3 text-xs text-blue-700 dark:text-blue-300">
          <Info className="ml-2 inline h-4 w-4" />
          {lang === 'ar'
            ? 'أدخل السعر الأساسي وسعر الكيلو المستلم من شركة الشحن.'
            : 'نرخی بنەڕەتی و نرخی هەر کیلۆگرام کە لە کۆمپانیای گواستنەوە وەرتگرتووە بنووسە.'}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label={lang === 'ar' ? 'الوزن الفعلي (كغم)' : 'کێشی ڕاستەقینە (کغم)'}>
            <Input type="number" min="0" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} />
          </Field>
          <Field label={lang === 'ar' ? 'الأجرة الأساسية (USD)' : 'کرێی بنەڕەتی (USD)'}>
            <Input type="number" min="0" step="0.01" value={baseFee} onChange={e => setBaseFee(e.target.value)} />
          </Field>
          <Field label={lang === 'ar' ? 'السعر لكل كغم (USD)' : 'نرخی هەر کغم (USD)'}>
            <Input type="number" min="0" step="0.01" value={ratePerKg} onChange={e => setRatePerKg(e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Input type="number" min="0" placeholder="L" value={length} onChange={e => setLength(e.target.value)} />
            <Input type="number" min="0" placeholder="W" value={width} onChange={e => setWidth(e.target.value)} />
            <Input type="number" min="0" placeholder="H" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
        </div>

        {result && (
          <div className="space-y-2 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-sm">
            <p>{lang === 'ar' ? 'الوزن الحجمي' : 'کێشی قەبارەیی'}: {result.volumetricWeight.toFixed(2)} kg</p>
            <p>{lang === 'ar' ? 'الوزن المحتسب' : 'کێشی حیسابکراو'}: {result.chargeableWeight.toFixed(2)} kg</p>
            <p className="text-lg font-black text-emerald-600">
              {lang === 'ar' ? 'التكلفة التقديرية' : 'تێچووی خەمڵێنراو'}: ${result.total.toFixed(2)}
            </p>
            <button
              onClick={() =>
                addServiceAction(
                  `Calculated freight estimate for ${result.chargeableWeight.toFixed(2)} kg`,
                  'cost',
                )
              }
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
            >
              {lang === 'ar' ? 'حفظ العملية' : 'تۆمارکردنی حیساب'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default ShippingCalculator;
""",
)

# 5. Rename/remove remaining pre-release identifiers.
for rel in [
    "src/admin/adminDefaults.ts",
    "src/admin/adminStore.ts",
    "src/admin/adminTypes.ts",
    "src/admin/screens/AdminDashboard.tsx",
    "src/admin/screens/AdminSettings.tsx",
    "src/admin/screens/FeatureFlagsManager.tsx",
    "src/admin/screens/ServiceManager.tsx",
]:
    replace(
        rel,
        [
            ("show_pilot_limits", "show_usage_notice"),
            ("pilotNoteKu", "noticeKu"),
            ("pilotNoteAr", "noticeAr"),
            ("pilotNote", "notice"),
            ("demo_only", "coming_soon"),
            ("Pilot Admin", "ADMIN"),
            ("تێبینی پایلۆت", "ئاگاداری خزمەتگوزاری"),
            ("پایلۆت", "بەرهەمهێنان"),
        ],
    )

replace(
    "src/lib/firebaseAdminAdapter.ts",
    [("uploadPilotAttachment", "uploadAttachment")],
)

replace(
    "src/lib/translations.ts",
    [
        ("LX123456789", ""),
        ("US987654321", ""),
        (
            "ئەم وەشانە پایلۆتە. هەندێک خزمەتگوزاری زانیاری کاری یان بەستنی سنووردار بەکاردەهێنێت.",
            "زانیاری و خەمڵاندنەکان بۆ پشتگیری بڕیاری بازرگانییە و پێویستە لە سەرچاوە پەیوەندیدارەکان پشتڕاست بکرێنەوە.",
        ),
        (
            "هذه نسخة تجريبية. بعض الخدمات تستخدم معلومات تشغيلية أو تكاملات محدودة.",
            "المعلومات والتقديرات مخصصة لدعم قرارات الأعمال ويجب التحقق منها من المصادر ذات الصلة.",
        ),
    ],
)

replace(
    "src/lib/businessWorkflows.ts",
    [
        ("LX123456789", ""),
        ("US987654321", ""),
        ("هاوردەی تاقیکاری یان گشتی", "جۆری کاڵا و مەبەستی هاوردە"),
        (
            "داواکردنی چەند نموونەیەکی تاقیکاری پێش بڕیاردان",
            "داواکردنی نموونەی کاڵا و پشکنینی کوالێتی پێش بڕیاردان",
        ),
    ],
)

replace(
    "server.ts",
    [
        ("LX123456789", ""),
        ("US987654321", ""),
        ("Demo Data", "estimated data"),
    ],
)

# 6. Remove presentation-only files.
for rel in [
    "src/lib/launchKit.ts",
    "src/lib/canvaLaunchBlueprint.ts",
    "docs/PILOT_QA_CHECKLIST.md",
    "docs/LIVE_DEMO_READINESS.md",
    "docs/ADMIN_PANEL_GUIDE.md",
    "docs/FIREBASE_SPARK_SETUP.md",
]:
    path = ROOT / rel
    if path.exists():
        path.unlink()

# 7. Normalize whitespace.
for path in ROOT.glob("src/**/*.ts*"):
    clean(str(path.relative_to(ROOT)))
for rel in ["server.ts", "README.md"]:
    clean(rel)

print("AI Gate Iraq production finalization completed.")
print("Run: npm run check:project && npm run lint && npm run build && git diff --check")
