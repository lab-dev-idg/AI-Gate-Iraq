import { ArrowUpRight, CheckCircle2, Clock3, Download, FileText, HelpCircle, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceKey, getServiceName } from '@/src/lib/services';

interface ServiceReadinessPanelProps {
  service: ServiceKey;
  lang: 'ku' | 'ar';
  onAskAssistant: (prompt: string) => void;
}

type LocalText = { ku: string; ar: string };

interface ReadinessConfig {
  outcome: LocalText;
  confidence: LocalText;
  updated: LocalText;
  source: LocalText;
  steps: LocalText[];
  prompt: LocalText;
  exportTitle: string;
}

const DEFAULT_CONFIG: ReadinessConfig = {
  outcome: {
    ku: 'دەرئەنجامی ڕوون، هەنگاوی دواتر و لیستی پێداویستییەکان وەربگرە.',
    ar: 'احصل على نتيجة واضحة وخطوة تالية وقائمة متطلبات قابلة للتنفيذ.',
  },
  confidence: { ku: 'پێویستی بە پشتڕاستکردنەوەی کۆتایی هەیە', ar: 'يتطلب تحققاً نهائياً' },
  updated: { ku: 'نوێکردنەوە: زانیاریی ناوخۆی پلاتفۆڕم', ar: 'التحديث: بيانات المنصة الداخلية' },
  source: { ku: 'سەرچاوە: ڕێنمایی ناوخۆ + وەڵامی AI', ar: 'المصدر: إرشاد داخلي + إجابة AI' },
  steps: [
    { ku: 'زانیارییە بنەڕەتییەکان پڕ بکەوە.', ar: 'أدخل البيانات الأساسية.' },
    { ku: 'دەرئەنجامەکە بە بەڵگەنامەکان بەراورد بکە.', ar: 'قارن النتيجة مع المستندات.' },
    { ku: 'ئەنجامەکە چاپ یان دابەزێنە و لەگەڵ گرووپەکەت هاوبەشی بکە.', ar: 'اطبع أو نزّل النتيجة وشاركها مع فريقك.' },
  ],
  prompt: {
    ku: 'لەسەر ئەم خزمەتگوزارییە، تکایە چێکلیستێکی کردارەکی و پێشنیاری هەنگاوی دواترم پێ بدە.',
    ar: 'لهذه الخدمة، أعطني قائمة تدقيق عملية واقتراح الخطوة التالية.',
  },
  exportTitle: 'ai-gate-iraq-service-summary',
};

const READINESS_CONFIG: Partial<Record<ServiceKey, ReadinessConfig>> = {
  market: {
    outcome: { ku: 'کورتەی بازاڕ، مەترسییەکان و هەنگاوی بازرگانی بۆ بڕیارێکی خێرا.', ar: 'ملخص سوق ومخاطر وخطوة تجارية لاتخاذ قرار سريع.' },
    confidence: { ku: 'مامناوەند — پێویستی بە بەرواری سەرچاوە هەیە', ar: 'متوسط — يحتاج تاريخ مصدر واضح' },
    updated: { ku: 'نوێکردنەوە: بەپێی زانیارییەکانی پلاتفۆڕم', ar: 'التحديث: حسب بيانات المنصة' },
    source: { ku: 'سەرچاوە: workflow + وەڵامی AI', ar: 'المصدر: workflow + إجابة AI' },
    steps: [
      { ku: 'کاڵا، وڵات و بازاڕی ئامانج دیاری بکە.', ar: 'حدد البضاعة والبلد والسوق المستهدف.' },
      { ku: 'مەترسییەکانی نرخ، داوا و ڕێکخستن بەراورد بکە.', ar: 'قارن مخاطر السعر والطلب والتنظيم.' },
      { ku: 'کورتەکە چاپ بکە یان لە AI پرسیاری وردتر بکە.', ar: 'اطبع الملخص أو اسأل AI بتفصيل أكبر.' },
    ],
    prompt: { ku: 'بۆ بازاڕی عێراق کورتەی بڕیار، مەترسی و هەنگاوی دواترم بۆ ئەم کاڵایە ئامادە بکە.', ar: 'جهّز لي ملخص قرار ومخاطر وخطوة تالية لهذه البضاعة في السوق العراقي.' },
    exportTitle: 'market-decision-summary',
  },
  cost: {
    outcome: { ku: 'خەمڵاندنی تێچوو بە هەنگاوەکانی کێش، ڕێگا، گومرگ و سودی چاوەڕوانکراو.', ar: 'تقدير تكلفة يشمل الوزن والمسار والجمارك والهامش المتوقع.' },
    confidence: { ku: 'بەرز بۆ خەمڵاندن — نرخە کۆتاییەکان پشتڕاست بکەوە', ar: 'عالٍ للتقدير — تحقق من الأسعار النهائية' },
    updated: { ku: 'نوێکردنەوە: کاتی ژمێرینکردن', ar: 'التحديث: وقت الحساب' },
    source: { ku: 'سەرچاوە: فۆرمی خەمڵاندن + زانیاریی بەکارهێنەر', ar: 'المصدر: نموذج التقدير + بيانات المستخدم' },
    steps: [
      { ku: 'کێش، قەبارە، ڕێگا و جۆری کاڵا پڕ بکەوە.', ar: 'أدخل الوزن والحجم والمسار ونوع البضاعة.' },
      { ku: 'خەمڵاندنەکە بە نرخ و بەڵگەنامەی shipping agent بەراورد بکە.', ar: 'قارن التقدير مع عرض وكيل الشحن.' },
      { ku: 'PDF/print وەک پێشنیازی ناوخۆی گرووپ بەکاربهێنە.', ar: 'استخدم الطباعة كعرض داخلي للفريق.' },
    ],
    prompt: { ku: 'تکایە تێچووی گەیاندن و خاڵە مەترسیدارەکانی ئەم بارە بە چێکلیست و خشتە ڕوون بکە.', ar: 'وضح تكلفة الشحن ونقاط الخطر لهذه الشحنة كجدول وقائمة تدقيق.' },
    exportTitle: 'shipping-cost-decision',
  },
  kyc: {
    outcome: { ku: 'فایلێکی KYC ـی ڕێکخراو بە بەڵگەنامە، کەموکوڕی و هەنگاوی پەسەندکردن.', ar: 'ملف KYC منظم بالمستندات والنواقص وخطوة الاعتماد.' },
    confidence: { ku: 'مامناوەند — داواکاریی دامەزراوەکان دەگۆڕێت', ar: 'متوسط — متطلبات الجهات قد تتغير' },
    updated: { ku: 'نوێکردنەوە: کاتی پڕکردنەوەی فۆرم', ar: 'التحديث: وقت تعبئة النموذج' },
    source: { ku: 'سەرچاوە: فۆرمی KYC + workflow', ar: 'المصدر: نموذج KYC + workflow' },
    steps: [
      { ku: 'ناسنامە، تۆمار، مۆڵەت و بەڵگەی ناونیشان ئامادە بکە.', ar: 'جهّز الهوية والتسجيل والرخصة وإثبات العنوان.' },
      { ku: 'کەموکوڕییەکان لەگەڵ چێکلیستەکە بەراورد بکە.', ar: 'قارن النواقص مع قائمة التدقيق.' },
      { ku: 'پێش ناردن بۆ دامەزراوە، لە AI داوای پشکنینی کۆتایی بکە.', ar: 'قبل الإرسال اطلب من AI مراجعة نهائية.' },
    ],
    prompt: { ku: 'فایلی KYC ـم پشکنە و چێکلیستی کەموکوڕی و هەنگاوی دواترم پێ بدە.', ar: 'راجع ملف KYC وأعطني قائمة النواقص والخطوة التالية.' },
    exportTitle: 'kyc-readiness-checklist',
  },
  procurement: {
    outcome: { ku: 'RFQ و پێوەری هەڵبژاردنی دابینکەر بۆ کەمکردنەوەی مەترسی فێڵ و دواخستن.', ar: 'RFQ ومعايير اختيار المورد لتقليل الاحتيال والتأخير.' },
    confidence: { ku: 'مامناوەند — دابینکەر دەبێت پشتڕاست بکرێتەوە', ar: 'متوسط — يجب التحقق من المورد' },
    updated: { ku: 'نوێکردنەوە: کاتی ئامادەکردنی داواکاری', ar: 'التحديث: وقت إعداد الطلب' },
    source: { ku: 'سەرچاوە: workflow + زانیاریی کاڵا', ar: 'المصدر: workflow + بيانات البضاعة' },
    steps: [
      { ku: 'specification، MOQ، Incoterms و deadline بنووسە.', ar: 'اكتب المواصفات و MOQ و Incoterms والموعد النهائي.' },
      { ku: 'دابینکەر بە تۆمار، sample و payment terms پشکنە.', ar: 'تحقق من المورد عبر التسجيل والعينة وشروط الدفع.' },
      { ku: 'RFQ چاپ بکە یان بۆ پشکنین بۆ AI بنێرە.', ar: 'اطبع RFQ أو أرسله إلى AI للمراجعة.' },
    ],
    prompt: { ku: 'RFQ ـێکی پیشەیی و چێکلیستی هەڵبژاردنی دابینکەر بۆ ئەم کاڵایە بنووسە.', ar: 'اكتب RFQ احترافي وقائمة تدقيق لاختيار المورد لهذه البضاعة.' },
    exportTitle: 'procurement-rfq-checklist',
  },
  tracking: {
    outcome: { ku: 'خوێندنەوەی دۆخی بار، هۆکاری دواخستن و هەنگاوی پەیوەندی لەگەڵ agent.', ar: 'قراءة حالة الشحنة وسبب التأخير وخطوة التواصل مع الوكيل.' },
    confidence: { ku: 'مامناوەند — دۆخی carrier/agent پشتڕاست بکەوە', ar: 'متوسط — تحقق من الناقل/الوكيل' },
    updated: { ku: 'نوێکردنەوە: کاتی داخڵکردنی tracking', ar: 'التحديث: وقت إدخال التتبع' },
    source: { ku: 'سەرچاوە: tracking + وەڵامی AI', ar: 'المصدر: التتبع + إجابة AI' },
    steps: [
      { ku: 'ژمارەی بارنامە یان کۆنتەینەر پڕ بکەوە.', ar: 'أدخل رقم البوليصة أو الحاوية.' },
      { ku: 'دۆخەکە بە قۆناغی customs و agent بەراورد بکە.', ar: 'قارن الحالة بمرحلة الجمارك والوكيل.' },
      { ku: 'نامەی پەیوەندی بۆ agent لە AI دروست بکە.', ar: 'أنشئ رسالة للوكيل عبر AI.' },
    ],
    prompt: { ku: 'دۆخی ئەم بارە بخوێنەوە و هۆکاری دواخستن و نامەی پەیوەندی بۆ agent ئامادە بکە.', ar: 'اقرأ حالة هذه الشحنة وجهز سبب التأخير ورسالة للوكيل.' },
    exportTitle: 'shipment-tracking-action-plan',
  },
  audit: {
    outcome: { ku: 'خاڵە لاوازەکان، benchmark ـی جیهانی و backlog ـی جێبەجێکردن بۆ گرووپی product.', ar: 'نقاط الضعف والمعيار العالمي و backlog تنفيذي لفريق المنتج.' },
    confidence: { ku: 'بەرز — بە پێی وردبینی UI/UX ـی ناوخۆ', ar: 'عالٍ — حسب تدقيق UI/UX داخلي' },
    updated: { ku: 'نوێکردنەوە: وەشانی ئێستای پلاتفۆڕم', ar: 'التحديث: نسخة المنصة الحالية' },
    source: { ku: 'سەرچاوە: audit داخڵی + benchmark', ar: 'المصدر: تدقيق داخلي + benchmark' },
    steps: [
      { ku: 'خاڵە بەرزەکان لە backlog بنووسە.', ar: 'حوّل الأولويات العالية إلى backlog.' },
      { ku: 'هەر قۆناغ بە KPI ـی conversion و CSAT ببەستەوە.', ar: 'اربط كل مرحلة بمؤشرات conversion و CSAT.' },
      { ku: 'دوای هەر release دووبارە audit بکە.', ar: 'أعد التدقيق بعد كل release.' },
    ],
    prompt: { ku: 'ئەم audit ـە بگۆڕە بۆ backlog ـی sprint بە task و priority و KPI.', ar: 'حوّل هذا التدقيق إلى sprint backlog بمهام وأولوية و KPI.' },
    exportTitle: 'ui-ux-audit-backlog',
  },
};

export function ServiceReadinessPanel({ service, lang, onAskAssistant }: ServiceReadinessPanelProps) {
  const config = READINESS_CONFIG[service] || DEFAULT_CONFIG;
  const ar = lang === 'ar';
  const tr = (text: LocalText) => ar ? text.ar : text.ku;
  const serviceName = getServiceName(service, lang);

  const exportSummary = () => {
    const payload = {
      service: serviceName,
      outcome: tr(config.outcome),
      confidence: tr(config.confidence),
      updated: tr(config.updated),
      source: tr(config.source),
      steps: config.steps.map(tr),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.exportTitle}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(ar ? 'تم تنزيل ملخص القرار.' : 'کورتەی بڕیار دابەزێندرا.');
  };

  const printPage = () => {
    window.print();
    toast.success(ar ? 'تم فتح نافذة الطباعة.' : 'پەنجەرەی چاپکردن کرایەوە.');
  };

  return (
    <Card className="border border-blue-500/15 bg-gradient-to-br from-white to-blue-50/70 shadow-sm dark:border-blue-400/10 dark:from-slate-950/70 dark:to-blue-950/20">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit border-blue-500/15 bg-blue-500/10 text-blue-700 hover:bg-blue-500/10 dark:text-blue-300">
              <ShieldCheck className="ml-1 h-3.5 w-3.5" />
              {ar ? 'لوحة الثقة والجاهزية' : 'بۆردی متمانە و ئامادەیی'}
            </Badge>
            <h3 className="text-base font-black leading-7 text-slate-900 dark:text-white">{tr(config.outcome)}</h3>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm dark:bg-slate-900"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{tr(config.confidence)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm dark:bg-slate-900"><Clock3 className="h-3.5 w-3.5 text-amber-500" />{tr(config.updated)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm dark:bg-slate-900"><FileText className="h-3.5 w-3.5 text-blue-500" />{tr(config.source)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => onAskAssistant(tr(config.prompt))} className="gap-2 rounded-xl text-xs font-black">
              <Sparkles className="h-4 w-4" />
              {ar ? 'اسأل AI' : 'لە AI بپرسە'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={exportSummary} className="gap-2 rounded-xl text-xs font-black">
              <Download className="h-4 w-4" />
              {ar ? 'تنزيل' : 'دابەزاندن'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={printPage} className="gap-2 rounded-xl text-xs font-black">
              <Printer className="h-4 w-4" />
              {ar ? 'طباعة' : 'چاپکردن'}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {config.steps.map((step, index) => (
            <div key={step.ku} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-700 dark:text-emerald-300">{index + 1}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs font-bold leading-6 text-slate-700 dark:text-slate-200">{tr(step)}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-amber-500/15 bg-amber-500/10 p-3 text-xs font-bold leading-6 text-amber-800 dark:text-amber-200">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{ar ? 'قبل اتخاذ قرار مالي أو قانوني نهائي، تحقق من المصدر الرسمي أو المستشار المختص.' : 'پێش بڕیاری دارایی یان یاسایی کۆتایی، سەرچاوەی فەرمی یان ڕاوێژکاری پسپۆڕ پشتڕاست بکەوە.'}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceReadinessPanel;
