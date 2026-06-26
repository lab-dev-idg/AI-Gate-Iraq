import { AlertTriangle, BarChart3, CheckCircle2, Compass, Gauge, Layers, Palette, ShieldCheck, Sparkles, Target, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AuditWorkspaceProps {
  lang: 'ku' | 'ar';
}

type LocalText = { ku: string; ar: string };

const benchmarkPlatforms = ['ChatGPT', 'Perplexity', 'Microsoft Copilot', 'Claude', 'Notion AI'];

const weaknessItems: Array<{ title: LocalText; impact: LocalText; benchmark: LocalText; fix: LocalText; severity: 'high' | 'medium' | 'low' }> = [
  {
    title: { ku: 'ڕێڕەوی بەکارهێنەر زۆر پەرتەوازەیە', ar: 'تشتت مسار المستخدم داخل المنصة' },
    impact: { ku: 'بەکارهێنەر نازانێت لە کام خزمەتگوزاری دەست پێ بکات یان هەنگاوی دواتر چییە.', ar: 'المستخدم لا يعرف من أين يبدأ أو ما هي الخطوة التالية.' },
    benchmark: { ku: 'پلاتفۆڕمە جیهانییەکان دەستپێک، پرۆمپتی پێشنیارکراو و state ـی ئاشکرا هەیە.', ar: 'المنصات العالمية تعرض بداية واضحة، مقترحات جاهزة، وحالة استخدام مفهومة.' },
    fix: { ku: 'داشبۆردی “ئەمڕۆ چی بکەم؟” زیاد بکە بە ٣ کردار: پرسیار، خەمڵاندن، ناردنی داواکاری.', ar: 'إضافة لوحة “ماذا أفعل الآن؟” بثلاث إجراءات: سؤال، تقدير، إرسال طلب.' },
    severity: 'high',
  },
  {
    title: { ku: 'متمانە و سەرچاوەکان بە ئاستی پێویست دیار نین', ar: 'الثقة والمصادر ليست بارزة كفاية' },
    impact: { ku: 'لە بڕیاری بازرگانی و گومرگدا وەڵامی AI بەبێ سەرچاوە مەترسی هەیە.', ar: 'قرارات التجارة والجمارك تحتاج مصادر واضحة لتقليل المخاطر.' },
    benchmark: { ku: 'Perplexity و Copilot سەرچاوە، بەروار و لینک لە ناو وەڵامدا دەخەنەڕوو.', ar: 'Perplexity و Copilot يبرزان المصادر والتاريخ والروابط داخل الإجابة.' },
    fix: { ku: 'کارتێکی “ئاستی متمانە” و بەرواری نوێکردنەوە زیاد بکە بۆ هەر وەڵام و هەر مۆدیول.', ar: 'إضافة بطاقة “مستوى الثقة” وتاريخ آخر تحديث لكل إجابة ووحدة.' },
    severity: 'high',
  },
  {
    title: { ku: 'زمان و RTL هەندێک شوێن یەکدەست نییە', ar: 'اللغة واتجاه RTL غير موحدين بالكامل' },
    impact: { ku: 'جێگۆڕکێی ئایکۆن، ژمارە و دەق خوێندنەوەی کوردی/عەرەبی لاواز دەکات.', ar: 'اختلاط الأيقونات والأرقام والنصوص يضعف القراءة العربية/الكردية.' },
    benchmark: { ku: 'ChatGPT و Claude لە هەر زمانێکدا spacing و alignment ـی یەکدەست دەپارێزن.', ar: 'ChatGPT و Claude يحافظان على محاذاة وتباعد متسقين لكل لغة.' },
    fix: { ku: 'سیستەمی spacing، typography و mirrored icons بۆ RTL دروست بکە.', ar: 'اعتماد نظام موحد للمسافات والخطوط والأيقونات المعكوسة للـ RTL.' },
    severity: 'medium',
  },
  {
    title: { ku: 'بەراورد و هەڵبژاردنەکان وەک خشتەی بڕیار نیشان نادرێن', ar: 'المقارنات والخيارات لا تظهر كجداول قرار' },
    impact: { ku: 'بازرگان پێویستی بە بەراوردی نرخ، مەترسی، کات و دۆکیومێنت هەیە.', ar: 'التاجر يحتاج مقارنة واضحة للسعر والمخاطر والوقت والمستندات.' },
    benchmark: { ku: 'Notion AI و Copilot دەرئەنجام دەکەن بە table، checklist و export.', ar: 'Notion AI و Copilot يحولان النتائج إلى جداول وقوائم قابلة للتصدير.' },
    fix: { ku: 'بۆ هەر خزمەتگوزاری “خشتەی بڕیار” و دوگمەی export/print زیاد بکە.', ar: 'إضافة “جدول قرار” وزر export/print لكل خدمة.' },
    severity: 'medium',
  },
  {
    title: { ku: 'پێوەرەکانی کارایی و گەشە پێناسە نەکراون', ar: 'مؤشرات الأداء والنمو غير معروضة' },
    impact: { ku: 'ناتوانرێت بزانرێت کام مۆدیول نرخ، lead و retention زیاد دەکات.', ar: 'لا يمكن معرفة أي وحدة ترفع التحويل والاحتفاظ والعملاء المحتملين.' },
    benchmark: { ku: 'پلاتفۆڕمە SaaS ـەکان activation، conversion و CSAT دەگرنەوە.', ar: 'منصات SaaS العالمية تقيس activation و conversion و CSAT.' },
    fix: { ku: 'داشبۆردی KPI بۆ completion rate، feedback و lead quality زیاد بکە.', ar: 'إضافة لوحة KPI لمعدل الإكمال والتقييم وجودة الطلبات.' },
    severity: 'medium',
  },
];

const roadmap: Array<{ phase: LocalText; items: LocalText[] }> = [
  {
    phase: { ku: 'خێرا — ١ تا ٢ هەفتە', ar: 'سريع — ١ إلى ٢ أسبوع' },
    items: [
      { ku: 'Header ـی هەر مۆدیول بکە بە کورتەی سوود، کاتی پێویست و دەرئەنجام.', ar: 'تحويل رأس كل وحدة إلى ملخص للفائدة والوقت والنتيجة.' },
      { ku: 'CTA ـی یەکەمی ڕوون زیاد بکە: “دەستپێکردن”، “پرسین لە AI”، “ناردنی داواکاری”.', ar: 'إضافة CTA واضح: “ابدأ”، “اسأل AI”، “أرسل طلب”.' },
      { ku: 'Empty state و loading state ـەکان بە دەقی هاوکارانە چاک بکە.', ar: 'تحسين حالات الفراغ والتحميل بنصوص إرشادية.' },
    ],
  },
  {
    phase: { ku: 'مامناوەند — ٣ تا ٦ هەفتە', ar: 'متوسط — ٣ إلى ٦ أسابيع' },
    items: [
      { ku: 'Citation، confidence و last-updated بۆ نرخ، مەرز و یاساکان زیاد بکە.', ar: 'إضافة المصادر والثقة وآخر تحديث للأسعار والمنافذ والقوانين.' },
      { ku: 'Wizard ـی ٣ هەنگاوە بۆ KYC، خەمڵاندنی تێچوو و procurement دروست بکە.', ar: 'إنشاء معالج من ٣ خطوات لـ KYC والتكلفة والتوريد.' },
      { ku: 'Export بە PDF/CSV و share link بۆ دەرئەنجامەکان زیاد بکە.', ar: 'إضافة تصدير PDF/CSV ورابط مشاركة للنتائج.' },
    ],
  },
  {
    phase: { ku: 'ستراتیژی — ٢ تا ٣ مانگ', ar: 'استراتيجي — ٢ إلى ٣ أشهر' },
    items: [
      { ku: 'Personalization بە پڕۆفایلی کۆمپانیا، جۆری کاڵا و ڕێڕەوی هاوردە.', ar: 'تخصيص التجربة حسب ملف الشركة ونوع البضاعة ومسار الاستيراد.' },
      { ku: 'Admin analytics بۆ هەڵسەنگاندنی پرسیارەکان، conversion و CSAT.', ar: 'تحليلات إدارية للأسئلة والتحويل ورضا المستخدم.' },
      { ku: 'Knowledge base ـی پشتڕاستکراو لەسەر گومرگ، مەرز و دابینکەر.', ar: 'قاعدة معرفة موثقة للجمارك والمنافذ والموردين.' },
    ],
  },
];

export default function AuditWorkspace({ lang }: AuditWorkspaceProps) {
  const ar = lang === 'ar';
  const tr = (text: LocalText) => ar ? text.ar : text.ku;

  return (
    <div className="space-y-5 font-arabic" dir="rtl">
      <Card className="overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-600 via-slate-950 to-emerald-700 text-white shadow-xl">
        <CardContent className="p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Badge className="w-fit border-white/20 bg-white/10 text-white hover:bg-white/15">
                <Sparkles className="ml-1 h-3.5 w-3.5" />
                {ar ? 'تدقيق UI/UX ومقارنة عالمية' : 'وردبینی UI/UX و بەراوردی جیهانی'}
              </Badge>
              <h3 className="text-2xl font-black leading-tight md:text-3xl">
                {ar ? 'خطة تحسين AI Gate Iraq لتصبح أقرب إلى منصات الذكاء العالمية' : 'پلانی چاکسازی AI Gate Iraq بۆ نزیکبوونەوە لە ئاستی پلاتفۆڕمە AI ـە جیهانییەکان'}
              </h3>
              <p className="text-sm font-semibold leading-7 text-blue-50/90">
                {ar ? 'يركز التدقيق على سهولة البداية، الثقة، وضوح القرار، تجربة RTL، والتحويل التجاري.' : 'ئەم وردبینییە سەرنج دەداتە دەستپێکردنی ئاسان، متمانە، ڕوونی بڕیار، ئەزموونی RTL و گۆڕینی سەردان بۆ داواکاریی بازرگانی.'}
              </p>
            </div>
            <div className="grid min-w-[260px] grid-cols-2 gap-3 text-center">
              <Metric icon={AlertTriangle} value="5" label={ar ? 'نقاط ضعف رئيسية' : 'خاڵی لاوازی سەرەکی'} />
              <Metric icon={Target} value="3" label={ar ? 'مراحل تنفيذ' : 'قۆناغی جێبەجێکردن'} />
              <Metric icon={Gauge} value="85%" label={ar ? 'أولوية للثقة والسرعة' : 'پێشینە بۆ متمانە و خێرایی'} />
              <Metric icon={Compass} value="RTL" label={ar ? 'تحسين مخصص' : 'چاکسازی تایبەت'} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        {benchmarkPlatforms.map((platform) => (
          <Card key={platform} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{platform}</p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{ar ? 'مرجع مقارنة' : 'بنچمارکی بەراورد'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          {ar ? 'نقاط الضعف والمقارنة والحل' : 'خاڵە لاوازەکان، بەراورد و چارەسەر'}
        </h3>
        <div className="grid gap-4">
          {weaknessItems.map((item, index) => (
            <Card key={item.title.ku} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
              <CardContent className="p-4 md:p-5">
                <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr_1fr]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white dark:bg-white dark:text-slate-900">{index + 1}</span>
                      <SeverityBadge severity={item.severity} lang={lang} />
                    </div>
                    <h4 className="text-base font-black leading-7 text-slate-900 dark:text-white">{tr(item.title)}</h4>
                    <p className="text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">{tr(item.impact)}</p>
                  </div>
                  <InfoBlock icon={Layers} title={ar ? 'المعيار العالمي' : 'ستانداردی جیهانی'} text={tr(item.benchmark)} />
                  <InfoBlock icon={Palette} title={ar ? 'تعديل UI/UX' : 'گۆڕانکاری UI/UX'} text={tr(item.fix)} />
                  <InfoBlock icon={ShieldCheck} title={ar ? 'النتيجة المتوقعة' : 'ئەنجامی چاوەڕوانکراو'} text={ar ? 'تقليل الحيرة، رفع الثقة، وزيادة طلبات الديمو.' : 'کەمکردنەوەی سەرلێشێواوی، زیادکردنی متمانە و زۆرکردنی داواکاری دیمۆ.'} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {roadmap.map((phase) => (
          <Card key={phase.phase.ku} className="border-emerald-500/15 bg-emerald-500/5 dark:bg-emerald-500/10">
            <CardContent className="space-y-3 p-5">
              <h4 className="flex items-center gap-2 text-base font-black text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                {tr(phase.phase)}
              </h4>
              <ul className="space-y-3">
                {phase.items.map((item) => (
                  <li key={item.ku} className="flex gap-2 text-sm font-semibold leading-7 text-slate-700 dark:text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{tr(item)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon className="mx-auto mb-2 h-5 w-5 text-emerald-200" />
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-[11px] font-bold leading-5 text-white/80">{label}</div>
    </div>
  );
}

function SeverityBadge({ severity, lang }: { severity: 'high' | 'medium' | 'low'; lang: 'ku' | 'ar' }) {
  const label = lang === 'ar'
    ? severity === 'high' ? 'أولوية عالية' : severity === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'
    : severity === 'high' ? 'پێشینەی بەرز' : severity === 'medium' ? 'پێشینەی مامناوەند' : 'پێشینەی نزم';
  const classes = severity === 'high'
    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
    : severity === 'medium'
      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : 'bg-slate-500/10 text-slate-700 dark:text-slate-300';
  return <Badge className={`${classes} border-none`}>{label}</Badge>;
}

function InfoBlock({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-2 flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <p className="text-sm font-semibold leading-7 text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  );
}
