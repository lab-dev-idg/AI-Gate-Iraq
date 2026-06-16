import { Bot, Sparkles, MapPin, DollarSign, Package, UserCheck, Building2, FileText, Globe, LucideIcon } from 'lucide-react';
import { getAdminServiceConfig, getAdminPromptChips } from '@/src/admin/adminStore';

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
  | 'inquiry';

export interface ServiceItem {
  key: ServiceKey;
  label_ku: string;
  label_ar: string;
  icon: LucideIcon;
  color: string;
}

export const SERVICES: ServiceItem[] = [
  {
    key: 'assistant',
    label_ku: 'یاریدەدەری زیرەک',
    label_ar: 'المساعد الذكي',
    icon: Bot,
    color: 'text-emerald-500',
  },
  {
    key: 'market',
    label_ku: 'کارتێکردن و کورتەی بازاڕ', // Standardized with Kurdish translated name in getServiceName
    label_ar: 'ملخص السوق والتجارة',
    icon: Sparkles,
    color: 'text-blue-500',
  },
  {
    key: 'borders',
    label_ku: 'دۆخی مەرزەکان',
    label_ar: 'حالة المنافذ',
    icon: MapPin,
    color: 'text-rose-500',
  },
  {
    key: 'currency',
    label_ku: 'گۆڕینەوەی دراو',
    label_ar: 'محول العملات',
    icon: DollarSign,
    color: 'text-amber-500',
  },
  {
    key: 'cost',
    label_ku: 'خەمڵاندنی تێچوو',
    label_ar: 'حاسبة التكاليف',
    icon: Package,
    color: 'text-indigo-500',
  },
  {
    key: 'kyc',
    label_ku: 'تۆمارکردن / KYC',
    label_ar: 'التسجيل و KYC',
    icon: UserCheck,
    color: 'text-teal-500',
  },
  {
    key: 'procurement',
    label_ku: 'دابینکردنی کاڵا',
    label_ar: 'توريد البضائع',
    icon: Building2,
    color: 'text-violet-500',
  },
  {
    key: 'tracking',
    label_ku: 'بەدواداچوونی بار',
    label_ar: 'تتبع الشحنات',
    icon: FileText,
    color: 'text-sky-500',
  },
  {
    key: 'map',
    label_ku: 'نەخشەی دەروازەکان',
    label_ar: 'خريطة المنافذ',
    icon: Globe,
    color: 'text-emerald-500',
  },
  {
    key: 'inquiry',
    label_ku: 'داوای دیمۆ / پەیوەندی',
    label_ar: 'طلب ديمو / اتصال',
    icon: Sparkles,
    color: 'text-emerald-500',
  }
];

export const getServiceName = (service: ServiceKey, lang: 'ku' | 'ar'): string => {
  const adminConfig = getAdminServiceConfig(service, lang);
  if (adminConfig && adminConfig.title) {
    return adminConfig.title;
  }

  switch (service) {
    case 'assistant':
      return lang === 'ar' ? 'الاستشارات العامة' : 'ڕاوێژی گشتی';
    case 'market':
      return lang === 'ar' ? 'ملخص السوق والتجارة' : 'کارتێکردن و کورتەی بازاڕ';
    case 'borders':
      return lang === 'ar' ? 'حالة المعابر والمنافذ' : 'دۆخی مەرزەکان';
    case 'currency':
      return lang === 'ar' ? 'محول وتصريف العملات' : 'گۆڕینەوەی دراو';
    case 'cost':
      return lang === 'ar' ? 'حاسبة وتخمين التكاليف' : 'خەمڵاندنی تێچوو';
    case 'kyc':
      return lang === 'ar' ? 'التسجيل و KYC' : 'تۆمارکردنی کۆمپانیا / KYC';
    case 'procurement':
      return lang === 'ar' ? 'توريد البضائع' : 'دابینکردنی کاڵا';
    case 'tracking':
      return lang === 'ar' ? 'تتبع الشحنات' : 'بەدواداچوونی بار';
    case 'map':
      return lang === 'ar' ? 'الخارطة اللوجستية' : 'نەخشەی دەروازەکان';
    case 'inquiry':
      return lang === 'ar' ? 'داوای دیمۆ / پەیوەندی' : 'داوای دیمۆ / پەیوەندی';
  }
};

export const getPromptChips = (service: ServiceKey, lang: 'ku' | 'ar') => {
  const adminPrompts = getAdminPromptChips(service, lang);
  if (adminPrompts && adminPrompts.length > 0) {
    return adminPrompts;
  }

  switch (service) {
    case 'currency':
      return [
        {
          label: lang === 'ar' ? 'تاثير USD/IQD على التكاليف' : 'کارتێکردنی USD/IQD لەسەر تێچوون',
          prompt: lang === 'ar' 
            ? 'كيف يؤثر سعر صرف الدولار مقابل الدينار على تكاليف الاستيراد في السوق العراقية؟' 
            : 'نرخی USD/IQD چۆن کاریگەری لە تێچووی هاوردە دەکات لە بازاڕی عێراقدا؟'
        },
        {
          label: lang === 'ar' ? 'استخدام أسعار الصرف للقرارات' : 'بەکارهێنانی نرخەکان بۆ بڕیار',
          prompt: lang === 'ar'
            ? 'كيف أستخدم أسعار الصرف المختلفة لاتخاذ قرارات تجارية واستيرادية ذكية؟'
            : 'چۆن نرخە جیاوازەکانی دراو بۆ بڕیارێکی بازرگانی و هاوردەکاری هۆشمەند بەکاربهێنم؟'
        }
      ];
    case 'cost':
      return [
        {
          label: lang === 'ar' ? 'تقدير تكاليف الشحن' : 'خەمڵاندنی تێچووی گەیاندن',
          prompt: lang === 'ar'
            ? 'كيف يمكنني تقدير تكاليف الشحن والرسوم الجمركية بدقة لشحنتي؟'
            : 'چۆن تێچووی گەیاندن و باجی گومرگی بە شێوەیەکی ورد بۆ بارەکەم بخەمڵێنم؟'
        },
        {
          label: lang === 'ar' ? 'البيانات المطلوبة للحساب' : 'زانیاری پێویست بۆ خەمڵاندن',
          prompt: lang === 'ar'
            ? 'ما هي البيانات بالتفصيل المطلوبة لحساب سعر الشحن والتعرفة الجمركية؟'
            : 'کام زانیاری بە وردی پێویستە بۆ حیسابکردنی نرخی گەیاندن و تاریفەی گومرگی؟'
        }
      ];
    case 'kyc':
      return [
        {
          label: lang === 'ar' ? 'مستندات تسجيل الشركة' : 'دۆکیومێنتی پێویست بۆ تۆمارکردن',
          prompt: lang === 'ar'
            ? 'ما هي المستندات والإجراءات القانونية المطلوبة لتسجيل شركة تجارية في العراق؟'
            : 'چ دۆکیومێنت و ڕێکارێکی یاسایی پێویستە بۆ تۆمارکردنی کۆمپانیایەکی بازرگانی لە عێراق؟'
        },
        {
          label: lang === 'ar' ? 'إعداد ملف الـ KYC' : 'ئامادەکردنی KYC ـی بازرگانی',
          prompt: lang === 'ar'
            ? 'كيف يمكنني إعداد باقة مستندات التحقق KYC الخاصة بأعمالي بشكل ممتثل؟'
            : 'چۆن مەلەفی ناساندنی KYC بۆ کارەکەم بە شێوەیەکی یاسایی ئامادە بکەم؟'
        }
      ];
    case 'procurement':
      return [
        {
          label: lang === 'ar' ? 'كتابة طلب توريد بضائع' : 'نووسینی داواکاری دابینکردنی کاڵا',
          prompt: lang === 'ar'
            ? 'كيف أكتب طلب شراء وتوريد بضائع رسمي (RFQ) لجذب المصانع العالمية؟'
            : 'چۆن داواکاری فەرمی کڕین و دابینکردنی کاڵا (RFQ) بنووسم بۆ ڕاکێشانی کارگە جیهانییەکان؟'
        },
        {
          label: lang === 'ar' ? 'اختيار مورد موثوق' : 'هەڵبژاردنی supplier ـێکی باش',
          prompt: lang === 'ar'
            ? 'ما هي المعايير لاختيار مورد موثوق وآمن في الصين أو تركيا لتجنب الاحتيال؟'
            : 'چۆن گرنگترین پێوەرەکان بۆ هەڵبژاردنی دابینکەرێکی متمانەپێکراو لە چین یان تورکیا دیاری بکەم؟'
        }
      ];
    case 'tracking':
      return [
        {
          label: lang === 'ar' ? 'تأخر الشحنة اللوجستية' : 'چارەسەری دواکەوتنی بار',
          prompt: lang === 'ar'
            ? 'ما هي الخيارات المتاحة لي إذا تأخرت شحنتي في ميناء أم قصر أو المعبر البري؟'
            : 'چی بکەم ئەگەر بارەکەم لە بەندەری ئوم قەسر یان مەرزی وشکانی دواکەوت؟'
        },
        {
          label: lang === 'ar' ? 'قراءة حالة التتبع' : 'خوێندنەوەی دۆخی بار بە ڕوونی',
          prompt: lang === 'ar'
            ? 'كيف أقرأ تفاصيل ومحطات التخليص الجمركي للشحنة عبر بوليصة الشحن بوضوح؟'
            : 'چۆن دۆخی گەیاندن و قۆناغەکانی تەرخیسکردنی مانیفێست بە ڕوونی بخوێنمەوە؟'
        }
      ];
    case 'market':
      return [
        {
          label: lang === 'ar' ? 'تقرير التعرفة الجمركية ٢٠٢٦' : 'تاریفەی گومرگی نوێی ٢٠٢ \n ٦',
          prompt: lang === 'ar'
            ? 'ما هي التحديثات والتعديلات الرئيسية على التعرفة الجمركية العراقية في عام 2026؟'
            : 'گرنگترین گۆڕانکاری و نوێگەری لەسەر تاریفەی گومرگی عێراق لە ساڵی ٢٠٢٦ چییە؟'
        },
        {
          label: lang === 'ar' ? 'مراقبة إشارات السوق اللوجستي' : 'چاودێریکردني ئاماژەکانی بازاڕ',
          prompt: lang === 'ar'
            ? 'كيف أتابع تقلبات السوق المحلية ومؤشرات الطلب والاستيراد بذكاء؟'
            : 'چۆن بە شێوەیەکی زیرەک بەدواداچوون بۆ گۆڕانکاری و لەرەلەرەکانی بازاڕی ناوخۆیی عێراق بکەم؟'
        }
      ];
    default:
      return [
        {
          label: lang === 'ar' ? 'كيف أنظم أعمالي التجارية؟' : 'چۆن دەتوانم بازرگانییەکەم ڕێک بخەم؟',
          prompt: lang === 'ar'
            ? 'كيف يمكنني تنظيم وترخيص أعمالي التجارية والاستيراد ممتثلاً للقوانين?'
            : 'چۆن دەتوانم بازرگانییەکەم ڕێک بخەم و بە یاسایی مۆڵەتی هاوردەکردن وەربگرم؟'
        },
        {
          label: lang === 'ar' ? 'كيف أستورد بضائع من الخارج؟' : 'چۆن کاڵا لە دەرەوە بهێنم؟',
          prompt: lang === 'ar'
            ? 'ما هي الخطوات والخدمات اللوجستية المطلوبة لاستيراد حاويات من تركيا أو الصين؟'
            : 'هەنگاو و ڕێکارە لۆجیستییەکان چیین بۆ هێنانی کۆنتێنەر لە چین یان تورکیاوە؟'
        },
        {
          label: lang === 'ar' ? 'ما هي الوثائق المطلوبة؟' : 'چ دۆکیومێنتێک پێویستە؟',
          prompt: lang === 'ar'
            ? 'ما هي قائمة الأوراق والوثائق الرسمية للتخليص الجمركي في المعابر العراقية؟'
            : 'چ دۆکیومێنت و بەڵگەنامەیەکی فەرمی پێویستە بۆ تەرخیسکردنی گومرگی لە مەرزەکاندا؟'
        }
      ];
  }
};
