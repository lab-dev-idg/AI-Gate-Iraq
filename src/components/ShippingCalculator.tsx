import { useEffect, useMemo, useState } from 'react';
import { Calculator, Info, Maximize, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/src/lib/LanguageContext';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

export function ShippingCalculator() {
  const { lang, t } = useLanguage();
  const [weight, setWeight] = useState(() => loadSession().drafts.costWeight || '');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [baseFee, setBaseFee] = useState('');
  const [ratePerKg, setRatePerKg] = useState('');

  useEffect(() => {
    saveSession({
      drafts: {
        costWeight: weight,
        costVolume: [length, width, height].filter(Boolean).join('×'),
      },
    });
  }, [weight, length, width, height]);

  const result = useMemo(() => {
    const actualWeight = Number(weight);
    const l = Number(length);
    const w = Number(width);
    const h = Number(height);
    const base = Number(baseFee);
    const rate = Number(ratePerKg);

    if (!Number.isFinite(actualWeight) || actualWeight <= 0) return null;
    if (!Number.isFinite(base) || base < 0) return null;
    if (!Number.isFinite(rate) || rate < 0) return null;

    const volumetricWeight = l > 0 && w > 0 && h > 0 ? (l * w * h) / 5000 : 0;
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);
    return {
      volumetricWeight,
      chargeableWeight,
      totalUsd: base + chargeableWeight * rate,
    };
  }, [weight, length, width, height, baseFee, ratePerKg]);

  const record = () => {
    if (result) addServiceAction(`Calculated shipping estimate for ${result.chargeableWeight.toFixed(2)} kg`, 'cost');
  };

  return (
    <Card className="rounded-2xl border border-slate-700 bg-[#0E1728] text-slate-100 shadow-lg">
      <CardHeader className="border-b border-slate-700/80 pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-black text-white">
          <span className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-400" />
            {t.calculator.title}
          </span>
          <Info className="h-4 w-4 text-slate-300" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-6" dir="rtl">
        <div className="rounded-xl border border-blue-400/25 bg-blue-400/10 p-3 text-sm font-medium leading-6 text-blue-100">
          {lang === 'ar'
            ? 'أدخل الأجرة الأساسية وسعر الكيلو المستلم من شركة الشحن. المنصة لا تستخدم أسعاراً افتراضية أو وهمية.'
            : 'کرێی بنەڕەتی و نرخی هەر کیلۆگرام کە لە کۆمپانیای گواستنەوە وەرتگرتووە بنووسە. پلاتفۆرم هیچ نرخێکی ساختە بەکارناهێنێت.'}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label={lang === 'ar' ? 'الوزن الفعلي (كغم)' : 'کێشی ڕاستەقینە (کغم)'} icon={<Scale className="h-4 w-4 text-emerald-400" />}>
            <Input type="number" min="0" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.00" className={inputClass} dir="ltr" />
          </Field>

          <Field label={lang === 'ar' ? 'الأجرة الأساسية (USD)' : 'کرێی بنەڕەتی (USD)'}>
            <Input type="number" min="0" step="0.01" value={baseFee} onChange={e => setBaseFee(e.target.value)} placeholder="0.00" className={inputClass} dir="ltr" />
          </Field>

          <Field label={lang === 'ar' ? 'السعر لكل كغم (USD)' : 'نرخی هەر کغم (USD)'}>
            <Input type="number" min="0" step="0.01" value={ratePerKg} onChange={e => setRatePerKg(e.target.value)} placeholder="0.00" className={inputClass} dir="ltr" />
          </Field>

          <Field label={lang === 'ar' ? 'الأبعاد (سم)' : 'قەبارە (سم)'} icon={<Maximize className="h-4 w-4 text-emerald-400" />}>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" min="0" placeholder="L" value={length} onChange={e => setLength(e.target.value)} className={`${inputClass} text-center`} dir="ltr" />
              <Input type="number" min="0" placeholder="W" value={width} onChange={e => setWidth(e.target.value)} className={`${inputClass} text-center`} dir="ltr" />
              <Input type="number" min="0" placeholder="H" value={height} onChange={e => setHeight(e.target.value)} className={`${inputClass} text-center`} dir="ltr" />
            </div>
          </Field>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-[#091222] p-6 text-center">
          {result ? (
            <>
              <p className="text-sm font-bold text-slate-300">{lang === 'ar' ? 'الوزن الحجمي' : 'کێشی قەبارەیی'}: <span className="text-white">{result.volumetricWeight.toFixed(2)} kg</span></p>
              <p className="mt-1 text-sm font-bold text-slate-300">{lang === 'ar' ? 'الوزن المحتسب' : 'کێشی حیسابکراو'}: <span className="text-white">{result.chargeableWeight.toFixed(2)} kg</span></p>
              <p className="mt-4 text-3xl font-black text-emerald-400" dir="ltr">USD {result.totalUsd.toFixed(2)}</p>
              <button onClick={record} className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-300 hover:bg-emerald-500/20">
                {lang === 'ar' ? 'حفظ العملية' : 'تۆمارکردنی حیساب'}
              </button>
            </>
          ) : (
            <p className="text-sm font-medium text-slate-300">{lang === 'ar' ? 'أدخل الوزن والسعر الأساسي وسعر الكيلو لعرض التقدير.' : 'کێش، کرێی بنەڕەتی و نرخی هەر کیلۆگرام بنووسە بۆ پیشاندانی خەمڵاندن.'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const inputClass = 'h-12 rounded-xl border-slate-600 bg-[#111D31] px-4 text-sm font-bold text-white placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/30';

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold text-slate-200">{label}</Label>
        {icon}
      </div>
      {children}
    </div>
  );
}

export default ShippingCalculator;
