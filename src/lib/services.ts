import { Bot, Sparkles, MapPin, DollarSign, Package, UserCheck, Building2, FileText, Globe, BarChart3, LucideIcon } from 'lucide-react';

export type ServiceKey =
  | 'assistant'
  | 'market'
  | 'borders'
  | 'currency'
  | 'cost'
  | 'kyc'
  | 'procurement'
  | 'tracking'
  | 'map'
  | 'inquiry'
  | 'audit';

export interface ServiceItem {
  key: ServiceKey;
  label_ku: string;
  label_ar: string;
  label_en: string;
  icon: LucideIcon;
  color: string;
}

export const SERVICES: ServiceItem[] = [
  { key: 'assistant', label_ku: 'یاریدەدەری زیرەک', label_ar: 'المساعد الذكي', label_en: 'Smart Assistant', icon: Bot, color: 'text-emerald-500' },
  { key: 'market', label_ku: 'کارتێکردن و کورتەی بازاڕ', label_ar: 'ملخص السوق والتجارة', label_en: 'Market & Trade', icon: Sparkles, color: 'text-blue-500' },
  { key: 'borders', label_ku: 'دۆخی مەرزەکان', label_ar: 'حالة المنافذ', label_en: 'Border Status', icon: MapPin, color: 'text-rose-500' },
  { key: 'currency', label_ku: 'گۆڕینەوەی دراو', label_ar: 'محول العملات', label_en: 'Currency Converter', icon: DollarSign, color: 'text-amber-500' },
  { key: 'cost', label_ku: 'خەمڵاندنی تێچوو', label_ar: 'حاسبة التكاليف', label_en: 'Cost Estimator', icon: Package, color: 'text-indigo-500' },
  { key: 'kyc', label_ku: 'تۆمارکردن / KYC', label_ar: 'التسجيل و KYC', label_en: 'Registration / KYC', icon: UserCheck, color: 'text-teal-500' },
  { key: 'procurement', label_ku: 'دابینکردنی کاڵا', label_ar: 'توريد البضائع', label_en: 'Goods Sourcing', icon: Building2, color: 'text-violet-500' },
  { key: 'tracking', label_ku: 'بەدواداچوونی بار', label_ar: 'تتبع الشحنات', label_en: 'Shipment Tracking', icon: FileText, color: 'text-sky-500' },
  { key: 'map', label_ku: 'نەخشەی دەروازەکان', label_ar: 'خريطة المنافذ', label_en: 'Logistics Map', icon: Globe, color: 'text-emerald-500' },
  { key: 'audit', label_ku: 'وردبینی و چاکسازی', label_ar: 'تدقيق وتحسين', label_en: 'Audit & Improvement', icon: BarChart3, color: 'text-fuchsia-500' },
  { key: 'inquiry', label_ku: 'داوای دیمۆ / پەیوەندی', label_ar: 'طلب ديمو / اتصال', label_en: 'Demo / Contact', icon: Sparkles, color: 'text-emerald-500' },
];

const pick = (lang: string, ku: string, ar: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : ku;

export const getServiceName = (service: ServiceKey, lang: 'ku' | 'ar' | 'en'): string => {
  switch (service) {
    case 'assistant': return pick(lang, 'ڕاوێژی گشتی', 'الاستشارات العامة', 'General Advisory');
    case 'market': return pick(lang, 'کارتێکردن و کورتەی بازاڕ', 'ملخص السوق والتجارة', 'Market & Trade Intelligence');
    case 'borders': return pick(lang, 'دۆخی مەرزەکان', 'حالة المعابر والمنافذ', 'Border & Crossing Status');
    case 'currency': return pick(lang, 'گۆڕینەوەی دراو', 'محول وتصريف العملات', 'Currency Converter');
    case 'cost': return pick(lang, 'خەمڵاندنی تێچوو', 'حاسبة وتخمين التكاليف', 'Shipping Cost Estimator');
    case 'kyc': return pick(lang, 'تۆمارکردنی کۆمپانیا / KYC', 'التسجيل و KYC', 'Company Registration / KYC');
    case 'procurement': return pick(lang, 'دابینکردنی کاڵا', 'توريد البضائع', 'Goods Sourcing');
    case 'tracking': return pick(lang, 'بەدواداچوونی بار', 'تتبع الشحنات', 'Shipment Tracking');
    case 'map': return pick(lang, 'نەخشەی دەروازەکان', 'الخارطة اللوجستية', 'Logistics Map');
    case 'audit': return pick(lang, 'وردبینی پلاتفۆڕم و چاکسازی UI/UX', 'تدقيق المنصة وتحسين UI/UX', 'Platform Audit & UI/UX Improvement');
    case 'inquiry': return pick(lang, 'داوای دیمۆ / پەیوەندی', 'طلب ديمو / اتصال', 'Demo Request / Contact');
  }
};

const ENGLISH_PROMPTS: Record<ServiceKey, { label: string; prompt: string }[]> = {
  assistant: [
    { label: 'How do I organize my trading business?', prompt: 'How can I organize and license my trading and import business in Iraq?' },
    { label: 'How do I import goods?', prompt: 'What are the main steps and logistics services needed to import a container from Turkey or China into Iraq?' },
    { label: 'Which documents are required?', prompt: 'Which official documents are required for customs clearance at Iraqi border crossings?' },
  ],
  market: [
    { label: '2026 customs tariff update', prompt: 'What are the main updates to Iraq’s customs tariff in 2026?' },
    { label: 'Monitor market signals', prompt: 'How can I monitor Iraqi market demand, import activity, and logistics indicators?' },
  ],
  borders: [
    { label: 'Check border procedures', prompt: 'What procedures and documents are normally required at Iraqi land borders and ports?' },
    { label: 'Plan a border route', prompt: 'How should I compare Iraqi border routes for time, cost, and customs risk?' },
  ],
  currency: [
    { label: 'USD/IQD cost impact', prompt: 'How does the USD/IQD exchange rate affect import costs in Iraq?' },
    { label: 'Use exchange rates for decisions', prompt: 'How can I use exchange-rate scenarios to make better import and pricing decisions?' },
  ],
  cost: [
    { label: 'Estimate shipping costs', prompt: 'How can I estimate freight, customs, and inland delivery costs for my shipment?' },
    { label: 'Required calculation data', prompt: 'Which data is required to calculate shipping and customs costs accurately?' },
  ],
  kyc: [
    { label: 'Company registration documents', prompt: 'Which documents and legal steps are required to register a trading company in Iraq?' },
    { label: 'Prepare a KYC file', prompt: 'How can I prepare a compliant KYC document package for my business?' },
  ],
  procurement: [
    { label: 'Write a sourcing request', prompt: 'How do I write a professional RFQ for international manufacturers and suppliers?' },
    { label: 'Choose a reliable supplier', prompt: 'Which checks should I use to select a reliable supplier in China or Turkey?' },
  ],
  tracking: [
    { label: 'Handle a delayed shipment', prompt: 'What can I do when my shipment is delayed at Umm Qasr or a land border?' },
    { label: 'Understand tracking status', prompt: 'How do I interpret shipment milestones and customs-clearance status?' },
  ],
  map: [
    { label: 'Choose a logistics route', prompt: 'Help me compare logistics routes into Iraq by port, border, cost, and transit time.' },
    { label: 'Find the best entry point', prompt: 'Which Iraqi entry point may be suitable for my shipment type and origin?' },
  ],
  inquiry: [
    { label: 'Request a platform demo', prompt: 'I would like to request a professional demo of AI Gate Iraq.' },
    { label: 'Discuss business onboarding', prompt: 'How can my company start using AI Gate Iraq services?' },
  ],
  audit: [
    { label: 'Review platform readiness', prompt: 'Review the platform’s operational, security, and user-experience readiness.' },
    { label: 'Identify improvement priorities', prompt: 'Which platform improvements should be prioritized before wider launch?' },
  ],
};

export const getPromptChips = (service: ServiceKey, lang: 'ku' | 'ar' | 'en') => {
  if (lang === 'en') return ENGLISH_PROMPTS[service] || ENGLISH_PROMPTS.assistant;

  switch (service) {
    case 'currency':
      return [
        { label: lang === 'ar' ? 'تاثير USD/IQD على التكاليف' : 'کارتێکردنی USD/IQD لەسەر تێچوون', prompt: lang === 'ar' ? 'كيف يؤثر سعر صرف الدولار مقابل الدينار على تكاليف الاستيراد في السوق العراقية؟' : 'نرخی USD/IQD چۆن کاریگەری لە تێچووی هاوردە دەکات لە بازاڕی عێراقدا؟' },
        { label: lang === 'ar' ? 'استخدام أسعار الصرف للقرارات' : 'بەکارهێنانی نرخەکان بۆ بڕیار', prompt: lang === 'ar' ? 'كيف أستخدم أسعار الصرف المختلفة لاتخاذ قرارات تجارية واستيرادية ذكية؟' : 'چۆن نرخە جیاوازەکانی دراو بۆ بڕیارێکی بازرگانی و هاوردەکاری هۆشمەند بەکاربهێنم؟' },
      ];
    case 'cost':
      return [
        { label: lang === 'ar' ? 'تقدير تكاليف الشحن' : 'خەمڵاندنی تێچووی گەیاندن', prompt: lang === 'ar' ? 'كيف يمكنني تقدير تكاليف الشحن والرسوم الجمركية بدقة لشحنتي؟' : 'چۆن تێچووی گەیاندن و باجی گومرگی بە شێوەیەکی ورد بۆ بارەکەم بخەمڵێنم؟' },
        { label: lang === 'ar' ? 'البيانات المطلوبة للحساب' : 'زانیاری پێویست بۆ خەمڵاندن', prompt: lang === 'ar' ? 'ما هي البيانات بالتفصيل المطلوبة لحساب سعر الشحن والتعرفة الجمركية؟' : 'کام زانیاری بە وردی پێویستە بۆ ژمێرینکردنی نرخی گەیاندن و تاریفەی گومرگی؟' },
      ];
    case 'kyc':
      return [
        { label: lang === 'ar' ? 'مستندات تسجيل الشركة' : 'بەڵگەنامەی پێویست بۆ تۆمارکردن', prompt: lang === 'ar' ? 'ما هي المستندات والإجراءات القانونية المطلوبة لتسجيل شركة تجارية في العراق؟' : 'چ بەڵگەنامە و ڕێکارێکی یاسایی پێویستە بۆ تۆمارکردنی کۆمپانیایەکی بازرگانی لە عێراق؟' },
        { label: lang === 'ar' ? 'إعداد ملف الـ KYC' : 'ئامادەکردنی KYC ـی بازرگانی', prompt: lang === 'ar' ? 'كيف يمكنني إعداد باقة مستندات التحقق KYC الخاصة بأعمالي بشكل ممتثل؟' : 'چۆن مەلەفی ناساندنی KYC بۆ کارەکەم بە شێوەیەکی یاسایی ئامادە بکەم؟' },
      ];
    case 'procurement':
      return [
        { label: lang === 'ar' ? 'كتابة طلب توريد بضائع' : 'نووسینی داواکاری دابینکردنی کاڵا', prompt: lang === 'ar' ? 'كيف أكتب طلب شراء وتوريد بضائع رسمي (RFQ) لجذب المصانع العالمية؟' : 'چۆن داواکاری فەرمی کڕین و دابینکردنی کاڵا (RFQ) بنووسم بۆ ڕاکێشانی کارگە جیهانییەکان؟' },
        { label: lang === 'ar' ? 'اختيار مورد موثوق' : 'هەڵبژاردنی supplier ـێکی باش', prompt: lang === 'ar' ? 'ما هي المعايير لاختيار مورد موثوق وآمن في الصين أو تركيا لتجنب الاحتيال؟' : 'چۆن گرنگترین پێوەرەکان بۆ هەڵبژاردنی دابینکەرێکی متمانەپێکراو لە چین یان تورکیا دیاری بکەم؟' },
      ];
    case 'tracking':
      return [
        { label: lang === 'ar' ? 'تأخر الشحنة اللوجستية' : 'چارەسەری دواکەوتنی بار', prompt: lang === 'ar' ? 'ما هي الخيارات المتاحة لي إذا تأخرت شحنتي في ميناء أم قصر أو المعبر البري؟' : 'چی بکەم ئەگەر بارەکەم لە بەندەری ئوم قەسر یان مەرزی وشکانی دواکەوت؟' },
        { label: lang === 'ar' ? 'قراءة حالة التتبع' : 'خوێندنەوەی دۆخی بار بە ڕوونی', prompt: lang === 'ar' ? 'كيف أقرأ تفاصيل ومحطات التخليص الجمركي للشحنة عبر بوليصة الشحن بوضوح؟' : 'چۆن دۆخی گەیاندن و قۆناغەکانی تەرخیسکردنی مانیفێست بە ڕوونی بخوێنمەوە؟' },
      ];
    case 'market':
      return [
        { label: lang === 'ar' ? 'تقرير التعرفة الجمركية 2026' : 'تاریفەی گومرگی نوێی 2026', prompt: lang === 'ar' ? 'ما هي التحديثات والتعديلات الرئيسية على التعرفة الجمركية العراقية في عام 2026؟' : 'گرنگترین گۆڕانکاری و نوێگەری لەسەر تاریفەی گومرگی عێراق لە ساڵی 2026 چییە؟' },
        { label: lang === 'ar' ? 'مراقبة إشارات السوق اللوجستي' : 'چاودێریکردني ئاماژەکانی بازاڕ', prompt: lang === 'ar' ? 'كيف أتابع تقلبات السوق المحلية ومؤشرات الطلب والاستيراد بذكاء؟' : 'چۆن بە شێوەیەکی زیرەک بەدواداچوون بۆ گۆڕانکاری و لەرەلەرەکانی بازاڕی ناوخۆیی عێراق بکەم؟' },
      ];
    default:
      return [
        { label: lang === 'ar' ? 'كيف أنظم أعمالي التجارية؟' : 'چۆن دەتوانم بازرگانییەکەم ڕێک بخەم؟', prompt: lang === 'ar' ? 'كيف يمكنني تنظيم وترخيص أعمالي التجارية والاستيراد ممتثلاً للقوانين?' : 'چۆن دەتوانم بازرگانییەکەم ڕێک بخەم و بە یاسایی مۆڵەتی هاوردەکردن وەربگرم؟' },
        { label: lang === 'ar' ? 'كيف أستورد بضائع من الخارج؟' : 'چۆن کاڵا لە دەرەوە بهێنم؟', prompt: lang === 'ar' ? 'ما هي الخطوات والخدمات اللوجستية المطلوبة لاستيراد حاويات من تركيا أو الصين؟' : 'هەنگاو و ڕێکارە گواستنەوەییەکان چیین بۆ هێنانی کۆنتێنەر لە چین یان تورکیاوە؟' },
        { label: lang === 'ar' ? 'ما هي الوثائق المطلوبة؟' : 'چ بەڵگەنامەێک پێویستە؟', prompt: lang === 'ar' ? 'ما هي قائمة الأوراق والوثائق الرسمية للتخليص الجمركي في المعابر العراقية؟' : 'چ بەڵگەنامە و بەڵگەنامەیەکی فەرمی پێویستە بۆ تەرخیسکردنی گومرگی لە مەرزەکاندا؟' },
      ];
  }
};
