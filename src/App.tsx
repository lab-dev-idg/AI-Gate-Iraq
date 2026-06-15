import { useState, useRef, useEffect, lazy, Suspense, useMemo } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Phone, Mail, Globe, MapPin, Info, Package, ShieldAlert, FileText, Plane, DollarSign, UserCheck, Wallet, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Lazy load heavy workspace components to boost initial load time
const CurrencyConverter = lazy(() => import('@/src/components/CurrencyConverter').then(m => ({ default: m.CurrencyConverter })));
const LogisticsMap = lazy(() => import('@/src/components/LogisticsMap').then(m => ({ default: m.LogisticsMap })));
const ShipmentTracker = lazy(() => import('@/src/components/ShipmentTracker').then(m => ({ default: m.ShipmentTracker })));
const ShippingCalculator = lazy(() => import('@/src/components/ShippingCalculator').then(m => ({ default: m.ShippingCalculator })));
const ProcurementSourcing = lazy(() => import('@/src/components/ProcurementSourcing').then(m => ({ default: m.ProcurementSourcing })));
const KYCForm = lazy(() => import('@/src/components/KYCForm').then(m => ({ default: m.KYCForm })));

import { FeedbackDialog } from '@/src/components/FeedbackDialog';
import { UserMenu } from '@/src/components/UserMenu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { chat } from '@/src/lib/gemini';
import { Message, IRAN_BORDER_STATUS } from '@/src/types';
import { useLanguage } from '@/src/lib/LanguageContext';
import { translations } from '@/src/lib/translations';
import { BUSINESS_WORKFLOWS } from '@/src/lib/businessWorkflows';

type ServiceKey =
  | 'assistant'
  | 'market'
  | 'borders'
  | 'currency'
  | 'cost'
  | 'kyc'
  | 'procurement'
  | 'tracking'
  | 'map';

// Static variables declared outside the component prevents redundant re-renders & garbage collection sweeps
const SERVICES = [
  {
    key: 'assistant' as const,
    label_ku: 'یاریدەدەری زیرەک',
    label_ar: 'المساعد الذكي',
    icon: Bot,
    color: 'text-emerald-500',
  },
  {
    key: 'market' as const,
    label_ku: 'کورتەی بازاڕ',
    label_ar: 'ملخص السوق',
    icon: Sparkles,
    color: 'text-blue-500',
  },
  {
    key: 'borders' as const,
    label_ku: 'دۆخی مەرزەکان',
    label_ar: 'حالة المنافذ',
    icon: MapPin,
    color: 'text-rose-500',
  },
  {
    key: 'currency' as const,
    label_ku: 'گۆڕینەوەی دراو',
    label_ar: 'محول العملات',
    icon: DollarSign,
    color: 'text-amber-500',
  },
  {
    key: 'cost' as const,
    label_ku: 'خەمڵاندنی تێچوو',
    label_ar: 'حاسبة التكاليف',
    icon: Package,
    color: 'text-indigo-500',
  },
  {
    key: 'kyc' as const,
    label_ku: 'تۆمارکردن / KYC',
    label_ar: 'التسجيل و KYC',
    icon: UserCheck,
    color: 'text-teal-500',
  },
  {
    key: 'procurement' as const,
    label_ku: 'دابینکردنی کاڵا',
    label_ar: 'توريد البضائع',
    icon: Building2,
    color: 'text-violet-500',
  },
  {
    key: 'tracking' as const,
    label_ku: 'بەدواداچوونی بار',
    label_ar: 'تتبع الشحنات',
    icon: FileText,
    color: 'text-sky-500',
  },
  {
    key: 'map' as const,
    label_ku: 'نەخشەی دەروازەکان',
    label_ar: 'خريطة المنافذ',
    icon: Globe,
    color: 'text-emerald-500',
  }
];

const getServiceName = (service: ServiceKey, lang: 'ku' | 'ar') => {
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
  }
};

const getPromptChips = (service: ServiceKey, lang: 'ku' | 'ar') => {
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
          label: lang === 'ar' ? 'تقرير التعرفة الجمركية ٢٠٢٦' : 'تاریفەی گومرگی نوێی ٢٠٢٦',
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
            ? 'كيف يمكنني تنظيم وترخيص أعمالي التجارية والاستيراد ممتثلاً للقوانين؟'
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

const WorkspaceLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[300px] gap-3 text-slate-500 dark:text-slate-400 font-arabic">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    <span className="text-xs font-black">باردەکرێت... تکایە چاوەڕوان بە | جاري التحميل... يرجى الانتظار</span>
  </div>
);

export default function App() {
  const { lang, setLang, t } = useLanguage();
  const [activeService, setActiveService] = useState<ServiceKey>('assistant');
  const [chatScope, setChatScope] = useState<ServiceKey>('assistant');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: t.chat.welcome
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const promptChips = useMemo(() => getPromptChips(chatScope, lang), [chatScope, lang]);

  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, activeService]);

  const handleSend = async (overridePrompt?: string) => {
    const userMessage = (overridePrompt ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      let serviceHint = '';
      if (chatScope === 'currency') {
        serviceHint = 'The user is currently using the currency converter workspace.';
      } else if (chatScope === 'cost') {
        serviceHint = 'The user is currently using the shipping cost estimator workspace.';
      } else if (chatScope === 'kyc') {
        serviceHint = 'The user is currently using the KYC/Business Registration workspace.';
      } else if (chatScope === 'procurement') {
        serviceHint = 'The user is currently using the procurement and supplier sourcing workspace.';
      } else if (chatScope === 'tracking') {
        serviceHint = 'The user is currently using the shipments and containers tracking workspace.';
      } else if (chatScope === 'market') {
        serviceHint = 'The user is currently using the market summary and latest regulatory bulletins workspace.';
      } else if (chatScope === 'borders') {
        serviceHint = 'The user is currently using the live borders wait times and crossings workspace.';
      } else if (chatScope === 'map') {
        serviceHint = 'The user is currently using the interactive logistics map workspace.';
      }

      const response = await chat.sendMessage({
        message: userMessage,
        activeService: chatScope,
        lang,
        serviceHint,
        workflowContext: BUSINESS_WORKFLOWS[chatScope] || null
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || 'داوای لێبوردن دەکەم، کێشەیەک ڕوویدا.',
        groundingChunks 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const isMissingKey = error instanceof Error && (error.message.includes('NO_API_KEY') || error.message.includes('GEMINI_API_KEY') || error.message.includes('not configured'));
      const isQuota = error instanceof Error && (error.message === 'QUOTA_EXHAUSTED' || error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'));
      
      let errorMessage = '';
      if (isMissingKey) {
        errorMessage = lang === 'ar'
          ? 'لم يتم إعداد مفتاح Gemini API. يرجى إضافة GEMINI_API_KEY في Secrets.'
          : 'کلیلی Gemini API دانەنراوە. تکایە GEMINI_API_KEY لە Secrets زیاد بکە.';
      } else if (isQuota) {
        errorMessage = lang === 'ar'
          ? 'تنبيه: تم تجاوز حصة Gemini API. يرجى التحقق من الحصة أو الفوترة أو المحاولة لاحقاً.'
          : 'ئاگاداری: سنووری Gemini API تێپەڕاوە. تکایە quota/billing بپشکنە یان دووبارە دواتر هەوڵ بدەوە.';
      } else {
        errorMessage = lang === 'ar'
          ? `فشل في إرسال الرسالة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
          : `ناردنی پەیام سەرکەوتوو نەبوو: ${error instanceof Error ? error.message : 'هەڵەیەکی نەزانراو'}`;
      }
      
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#090D16]" dir="rtl">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-105">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-arabic">
                {t.app.title}
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans px-2 py-0.5 rounded-full font-bold">PRO</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.app.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border">
              <Button 
                variant={lang === 'ku' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setLang('ku')}
                className="h-7 px-3 text-[10px] font-bold rounded-md transition-all"
              >
                Kurdî
              </Button>
              <Button 
                variant={lang === 'ar' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setLang('ar')}
                className="h-7 px-3 text-[10px] font-bold rounded-md transition-all"
              >
                عربي
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-4 ml-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1.5" />
                {t.app.systemActive}
              </Badge>
            </div>
            <UserMenu />
            <FeedbackDialog />
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <Toaster position="top-center" richColors />

      {/* Main Container */}
      <main className="flex-1 overflow-hidden max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-12 gap-5 p-4 md:p-6 min-h-0">
        
        {/* Mobile & Tablet Service Selector */}
        <div className="lg:hidden flex overflow-x-auto gap-1.5 pb-2 pt-0.5 px-0.5 no-scrollbar scroll-smooth shrink-0 border-b border-slate-100 dark:border-slate-800/60 mb-2">
          {SERVICES.map((srv) => {
            const isActive = activeService === srv.key;
            const IconComp = srv.icon;
            return (
              <Button
                key={srv.key}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap px-3 h-8 text-[11px] font-bold rounded-lg transition-all duration-150 gap-1.5 shrink-0 ${
                  isActive 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setActiveService(srv.key);
                  if (srv.key !== 'assistant') {
                    setChatScope(srv.key);
                  }
                }}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : srv.color}`} />
                {lang === 'ar' ? srv.label_ar : srv.label_ku}
              </Button>
            );
          })}
        </div>

        {/* Sidebar Info - Desktop */}
        <aside className="hidden lg:flex lg:col-span-3 h-full min-h-0 overflow-hidden flex-col gap-4">
          <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 p-4 h-full shrink-0 rounded-2xl transition-all hover:shadow-md flex flex-col gap-3">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h2 className="text-sm font-black text-slate-800 dark:text-white font-arabic">
                {lang === 'ar' ? 'بوابة الأعمال الذكية' : 'سەکۆی بازرگانی زیرەک'}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold leading-relaxed">
                {lang === 'ar' ? 'التحكم بالخدمات والمعلومات اللوجستية للعراق' : 'کۆنترۆڵکردنی خزمەتگوزاری و زانیاری لۆجیستی'}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 cs-scroll">
              {SERVICES.map((srv) => {
                const isActive = activeService === srv.key;
                const IconComp = srv.icon;
                return (
                  <Button
                    key={srv.key}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start h-10 px-3 text-[11px] font-black rounded-xl transition-all duration-205 gap-2.5 ${
                      isActive 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' 
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                    onClick={() => {
                      setActiveService(srv.key);
                      if (srv.key !== 'assistant') {
                        setChatScope(srv.key);
                      }
                    }}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : srv.color}`} />
                    <span className="truncate">{lang === 'ar' ? srv.label_ar : srv.label_ku}</span>
                  </Button>
                );
              })}
            </div>

            {/* Compact Border Status (Mini Summary) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
              <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                {lang === 'ar' ? 'حالة الحدود والجمارك الحية' : 'دۆخی ڕاستەوخۆی مەرز و سنوور'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-50/50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <div>
                  <span className="text-slate-400 block truncate font-arabic">{lang === 'ar' ? 'إبراهيم الخليل' : 'ئیبراهیم خەلیل'}</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">● {lang === 'ar' ? 'مفتوح' : 'کراوە'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block truncate font-arabic">{lang === 'ar' ? 'ميناء أم قصر' : 'بەرزە ئوم قەسر'}</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">● {lang === 'ar' ? 'نشط' : 'چالاک'}</span>
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-1 lg:col-span-9 flex flex-col min-h-0 h-full overflow-hidden">
          {activeService === 'assistant' && (
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-white dark:bg-slate-900/30 rounded-2xl h-full">
              {/* Advisor Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <Bot className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-850 dark:text-white font-arabic flex items-center flex-wrap gap-1.5 leading-none">
                      {lang === 'ar' ? 'مستشار الأعمال واللوجستيات الذكي' : 'ڕاوێژکاری لۆجیستی و بازرگانی زیرەک'}
                      {chatScope !== 'assistant' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                          {getServiceName(chatScope, lang)}
                        </span>
                      )}
                    </h2>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-tight">
                      {lang === 'ar'
                        ? `مستشار الذكاء الاصطناعي مستعد لمساعدتك في: ${getServiceName(chatScope, 'ar')}`
                        : `ڕاوێژکاری زیرەک ئامادەیە بۆ یارمەتیدانت لە: ${getServiceName(chatScope, 'ku')}`}
                    </p>
                  </div>
                </div>

                {/* Scope Switcher Dropdown */}
                <div className="flex items-center gap-2 font-arabic shrink-0 self-end sm:self-center">
                  <span className="text-[10px] text-slate-400 font-black hidden xs:inline">
                    {lang === 'ar' ? 'التركيز:' : 'تیشکۆ:'}
                  </span>
                  <select
                    value={chatScope}
                    onChange={(e) => setChatScope(e.target.value as ServiceKey)}
                    className="text-[10px] font-black border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-900 cursor-pointer text-slate-700 dark:text-slate-200 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors"
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.key} value={srv.key}>
                        {lang === 'ar' ? srv.label_ar : srv.label_ku}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat Viewport */}
              <div 
                ref={chatScrollRef} 
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain chat-scroll p-4 md:p-6 bg-slate-50/25 dark:bg-slate-950/25"
              >
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                          <Avatar className={`w-8 h-8 mt-1 border shadow-sm ${msg.role === 'model' ? 'bg-primary border-primary/20' : 'bg-slate-100 border-slate-200'}`}>
                            {msg.role === 'model' ? (
                              <>
                                <AvatarImage src="/bot-icon.png" />
                                <AvatarFallback className="bg-primary text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                              </>
                            ) : (
                              <>
                                <AvatarFallback className="text-slate-500 bg-slate-50"><User className="w-4 h-4" /></AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div 
                            onClick={() => msg.role === 'model' && setSelectedMessage(msg)}
                            className={`group relative p-4 rounded-xl shadow-sm cursor-default ${
                            msg.role === 'model' ? 'cursor-pointer hover:shadow-md hover:scale-[1.005] transition-all duration-200' : ''
                          } ${
                            msg.role === 'user' 
                              ? 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-200/40 dark:border-slate-800/80' 
                              : 'bg-primary text-primary-foreground rounded-tl-none'
                          }`}>
                            <div className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'dark:prose-invert text-slate-800 dark:text-slate-100' : 'text-primary-foreground'}`}>
                              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text}</ReactMarkdown>
                            </div>
                            {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{t.chat.sources}</p>
                                <div className="flex flex-wrap gap-2">
                                  {msg.groundingChunks.map((chunk, i) => {
                                    const web = chunk.web;
                                    const maps = chunk.maps;
                                    if (maps) {
                                      return (
                                        <a 
                                          key={i} 
                                          href={maps.uri} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                        >
                                          <MapPin className="w-3 h-3" />
                                          {maps.title || t.chat.viewMap}
                                        </a>
                                      );
                                    }
                                    if (web) {
                                      return (
                                        <a 
                                          key={i} 
                                          href={web.uri} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                        >
                                          <Globe className="w-3 h-3" />
                                          {web.title || t.chat.source}
                                        </a>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}
                            <span className={`text-[10px] mt-2 block opacity-50 ${msg.role === 'user' ? 'text-slate-500' : 'text-primary-foreground'}`}>
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pr-11">
                      <div className="bg-emerald-500/10 p-3.5 rounded-2xl flex items-center gap-2.5 border border-emerald-500/20 shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-arabic animate-pulse">
                          {lang === 'ar' ? 'تفكير ذكي... جاري تحليل ودراسة البيانات اللوجستية بالعراق' : 'بیرکردنەوەی ژیرانە... خەریکی شیکردنەوەی داتای لۆجیستییە لە عێراق'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Suggested prompt chips based on selected focus scope */}
              <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth border-t border-slate-100 dark:border-slate-800/40">
                {promptChips.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap rounded-full text-[11px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400 hover:-translate-y-0.5 gap-1.5 px-3.5 py-1.5 shadow-sm shrink-0 flex items-center"
                    onClick={() => handleSend(action.prompt)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Chat Input form */}
              <div className="p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80">
                <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
                  <Input
                    placeholder={t.chat.placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="ps-4 pe-14 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    dir="rtl"
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={isLoading || !input.trim()}
                    className="absolute end-1.5 h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 transition-all active:scale-95"
                    size="icon"
                  >
                    <Send className="w-4 h-4 rtl:-rotate-180" />
                  </Button>
                </div>
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-3.5 uppercase tracking-widest font-black opacity-80">
                  AI Gate Iraq • 2026 • {lang === 'ar' ? 'البوابة الوطنية للتجارة والأعمال' : 'سەکۆی نیشتمانی بۆ بازرگانی و کار'}
                </p>
              </div>
            </Card>
          )}

          {activeService !== 'assistant' && (
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-white dark:bg-slate-900/40 rounded-2xl h-full p-5 md:p-6">
              {/* Premium Workspace Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white font-arabic flex items-center gap-2">
                    {activeService === 'market' && <Sparkles className="w-5 h-5 text-blue-500" />}
                    {activeService === 'borders' && <MapPin className="w-5 h-5 text-rose-500" />}
                    {activeService === 'currency' && <DollarSign className="w-5 h-5 text-amber-500" />}
                    {activeService === 'cost' && <Package className="w-5 h-5 text-indigo-500" />}
                    {activeService === 'kyc' && <UserCheck className="w-5 h-5 text-teal-500" />}
                    {activeService === 'procurement' && <Building2 className="w-5 h-5 text-violet-500" />}
                    {activeService === 'tracking' && <FileText className="w-5 h-5 text-sky-500" />}
                    {activeService === 'map' && <Globe className="w-5 h-5 text-emerald-500" />}

                    {activeService === 'market' && (lang === 'ar' ? 'ملخص السوق والتجارة العراقیة' : 'کورتەی بازاڕ و بازرگانی عێراق')}
                    {activeService === 'borders' && (lang === 'ar' ? 'حالة المعابر الجمركية والمنافذ المباشرة' : 'دۆخی نوێی مەرز و دەروازە بازرگانییەکان')}
                    {activeService === 'currency' && (lang === 'ar' ? 'محول وتصريف العملات الفوري' : 'گۆڕینەوەی دراو و نرخە فەرمییەکان')}
                    {activeService === 'cost' && (lang === 'ar' ? 'حاسبة وتخمين تكاليف الشحن الدولي' : 'خەمڵاندنی تێچووی بار و لۆجیستی')}
                    {activeService === 'kyc' && (lang === 'ar' ? 'توثيق حساب تاجر / مۆڵەتی فەرمی' : 'تۆمارکردن و چالاککردنی کۆمپانیای بازرگانی / KYC')}
                    {activeService === 'procurement' && (lang === 'ar' ? 'طلب دابینکردن وتوريد بضائع عالمية' : 'فۆرمی داواکاری دابینکردنی کاڵا')}
                    {activeService === 'tracking' && (lang === 'ar' ? 'لوحة متابعة وتتبع الشحنات المستمرة' : 'بەدواداچوون بۆ گەشت و گواستنەوەی بار')}
                    {activeService === 'map' && (lang === 'ar' ? 'الخارطة التفاعلية للمنافذ والمرافئ اللوجستية' : 'بینینی مەرزەکان لەسەر نەخشەی لۆجیستی')}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed max-w-2xl">
                    {activeService === 'market' && (lang === 'ar' ? 'أحدث تقارير تاريفت الجمارك وقوانين العام المالي لعام ٢٠٢٦.' : 'کورتەیەکی تەواو لەسەر تاریفە نوێیەکانی باج و پێشڤەچوونی بازاڕی عێراق.')}
                    {activeService === 'borders' && (lang === 'ar' ? 'لوحة مراقبة حية توضح فترات انتظار الشحن البحري والبري ومستوى قساوة الممر.' : 'پێشاندانی وردی کاتی چاوەڕوانی بۆ بارهەڵگرەکان و ڕێژەی قەرەباڵغی مەرزە سنوورییەکان.')}
                    {activeService === 'currency' && (lang === 'ar' ? 'معادل الدينار العراقي مقابل الدولار والعملات الرئيسية وفقاً لصرافة وسط بغداد ومكاتب الإقليم.' : 'گۆڕینەوەی بەهای دۆلار بەرامبەر دینار بە نوێترین تێکڕای بازاڕی عێراق بە کاتی ناوخۆیی.')}
                    {activeService === 'cost' && (lang === 'ar' ? 'أداة حسابية سريعة لحساب حجم الشحنة والوزن الطردي لتقدير التكلفة الكلية للشحن عائلياً.' : 'ئامێری حیسابکەر بۆ زانینی نرخ بەپێی قەبارە و کێشی کۆنتێنەر بە تەواوی ڕسوومات.')}
                    {activeService === 'kyc' && (lang === 'ar' ? 'ساعدنا في التحقق من ترخيص ممارسة الأعمال العراقي لمصادقة عمليات الإرسال اللوجستية.' : 'فۆرمی ناساندن بۆ پاراستنی مۆڵەتی ڕێپێدراوی بازرگانی و دابینکردنی نوێترین بەڵگەنامەکان.')}
                    {activeService === 'procurement' && (lang === 'ar' ? 'أرسل تفاصيل المنتج والمواصفات المطلوبة لبدء البحث والاتصال بأفضل المصانع.' : 'تۆمارکردنی داخوازی بۆ هێنانی هەر کاڵایەک لەگەڵ بڕ، نرخ و خەمڵاندن بە شێوازی فەرمی.')}
                    {activeService === 'tracking' && (lang === 'ar' ? 'استقصاء مسار الحاويات والبضائع بنقرة واحدة عبر لوحة التحكم ومكتب التسليم.' : 'بەدواداچوونی گونجاو بە ژمارەی مۆڵەت فەرمی بۆ بینینی خاڵ بە خاڵی گەیشتنی بار.')}
                    {activeService === 'map' && (lang === 'ar' ? 'اكتشف مواقع الموانئ البرية ومرافئ التنزيل الجغرافي النشطة في عاصمة التجارة.' : 'بینینی شوێن و داتا لۆجیستییەکان لەسەر نەخشەی چالاکی هاوردەکردنی کاڵاکان.')}
                  </p>
                </div>
              </div>

              {/* Workspace Content Viewport */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4 cs-scroll">
                {(() => {
                  const workflow = BUSINESS_WORKFLOWS[activeService];
                  const wTrans = translations[lang === 'ar' ? 'ar' : 'ku'].workflow || {
                    checklistTitle: lang === 'ar' ? 'قائمة تدقيق ودليل خطوات العمل' : 'بۆردی ڕێنمایی و بەرنامەی کار',
                    requiredInputs: lang === 'ar' ? 'المعلومات المطلوبة' : 'زانیارییە پێویستەکان',
                    documentsLabel: lang === 'ar' ? 'الوثائق والمستندات المطلوبة' : 'دۆکیومێنت و بەڵگەنامەکان',
                    risksLabel: lang === 'ar' ? 'المخاطر والتحديات المحتملة' : 'مەترسی و بەربەستە باوەکان',
                    nextActionsLabel: lang === 'ar' ? 'الإجراءات والخطوات التالية' : 'هەنگاوە پێشنیارکراوەکان',
                    askNextSteps: lang === 'ar' ? 'ما هي هذه الخطوات بالتفصيل؟' : 'ڕێگەچارە و هەنگاوەکان چیین؟',
                    askDocs: lang === 'ar' ? 'ما هي الوثائق المطلوبة؟' : 'چ بەڵگە جێگیرێک پێویستە؟',
                    askPrepare: lang === 'ar' ? 'اكتب لي مسودة طلب شراء رسمی' : 'داوا بکە بابەت بۆ بنووسێ',
                    explainResult: lang === 'ar' ? 'اشرح لي هذه النتيجة' : 'ئەم ئەنجامەم بۆ ڕوون بکەوە',
                    demoLabel: lang === 'ar' ? 'بيانات تجريبية / محاكاة محدودة' : 'داتای تەمسیلی و سنووردار'
                  };

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Active Workspace Main Service Details Column */}
                      <div className="lg:col-span-2 space-y-6">
                        {activeService === 'market' && (
                          <div className="space-y-6 max-w-3xl text-slate-800 dark:text-slate-100">
                            <Card className="border border-emerald-500/10 shadow-md bg-gradient-to-br from-slate-950 via-slate-900 to-primary text-white rounded-2xl p-5">
                              <CardHeader className="p-0 pb-3">
                                <CardTitle className="text-base md:text-lg flex items-center gap-2 font-arabic text-emerald-400">
                                  <Sparkles className="w-5 h-5 text-emerald-400 font-bold" />
                                  {t.sidebar.marketSummary}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-0 space-y-5">
                                <div className="space-y-1.5">
                                  <p className="text-xs text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.newTariff}</p>
                                  <p className="text-sm leading-relaxed text-slate-100">{t.sidebar.newTariffDesc}</p>
                                  <p className="text-xs text-slate-300 mt-2">
                                    {lang === 'ar' 
                                      ? 'تم إدخال بعض الخطوات الإضافية لتسهيل إجراءات الإعفاءات ومنع الازدواجات الضريبية في العام الجديد ٢٠٢٦.' 
                                      : 'چەند هەنگاوێکی نوێ گرتراونەتە بەر بە مەبەستی ڕێگریکردن لە دووجار باجدان و ئاسانکردنی لێخۆشبوونە گومرگییەکان.'}
                                  </p>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="space-y-1.5">
                                  <p className="text-xs text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.procedures}</p>
                                  <p className="text-sm leading-relaxed text-slate-100">{t.sidebar.proceduresDesc}</p>
                                  <p className="text-xs text-slate-300 mt-2">
                                    {lang === 'ar' 
                                      ? 'نظام الجمارك المحوسب (أسيكودا) يبسط كافة تفاصيل تقديم المنافستو الجمركي بنسبة خطأ قليلة.'
                                      : 'سیستەمی ئەلیکترۆنی ئاسیکۆدا دەبێتە هۆی کەمکردنەوەی جیاوازییەکانی بەها و کار ئاسانی تەواو دەکات بۆ ڕاپەڕاندنی مۆڵەت.'}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Pro tip */}
                            <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 font-arabic">
                                {lang === 'ar' ? 'توضيح هام بخصوص النظم الجمركية في العراق' : 'تێبینی بۆ ڕێنماییە گومرگییەکان لە عێراق'}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                                {lang === 'ar' 
                                  ? 'تنصح لوحة أعمال العراق جميع الشركات والمستوردين بالتحقق المسبق من تصنيف رمز النظام المنسق (HS Code) للبضائع قبل الشراء لتفادي غرامات الجمارك وضمان تسيير الشحنات بسرعة عبر موانئ البصرة ونقاط التحقق البرية.'
                                  : 'دەستەی کارگێڕی بازرگانی عێراق داوا لە نوێنەری کۆمپانیاکان دەکات کە پێش هاوردەکردنی هەر چەشنە کاڵایەک کۆدی جیهانی کاڵاکە (HS Code) بە وردی بخوێننەوە بۆ ئەوەی دووچاری سزای دواکەوتن و لێبڕین نەبن لە مەرزی ئوم قەسر یان شوێنەکانی تر.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {activeService === 'borders' && (
                          <div className="space-y-6 max-w-3xl text-slate-800 dark:text-slate-100">
                            <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl">
                              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
                                  <MapPin className="w-5 h-5 text-rose-500" />
                                  {t.sidebar.borderStatus}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-5 space-y-4">
                                {IRAN_BORDER_STATUS.map((border) => (
                                  <div key={border.name} className="space-y-2 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100/50 dark:border-slate-800/40">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{border.name}</span>
                                      <Badge variant={border.status === 'active' ? 'secondary' : 'destructive'} 
                                             className={border.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900'}>
                                        {border.status === 'active' ? t.sidebar.borderActive : t.sidebar.borderBusy}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                                      <span>{t.sidebar.waitingTime}</span>
                                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{border.waitTime}</span>
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>

                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl p-4 text-xs font-sans">
                              <div className="flex items-start gap-2.5">
                                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="block font-black font-arabic mb-1">{lang === 'ar' ? 'تنبيه جمركي عاجل' : 'ئاگاداری گومرگی گرنگ'}</strong>
                                  {lang === 'ar' 
                                    ? 'قد يزداد وقت الانتظار للشاحنات في منفذ إبراهيم الخليل لأسباب تتعلق بالتدقيق الموسّم وإجراءات المعاينة الفنية. يوصى بمتابعة حالة الانتظار عبر مستشارنا الذكي لسلامة سلسلة التوريد.'
                                    : 'ڕەنگە کاتی چاوەڕوانی بۆ بارهەڵگرە گەورەکان لە مەرزی نێودەوڵەتی ئیبراهیم خەلیل زیاتر بێت بەهۆی پشکنینی ناوەکی و فەرمیی تایبەت بە کاڵاکان. پێشنیار کراوە هەمیشە گەشتەکەت ڕێکبخەیتەوە.'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeService === 'currency' && (
                          <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <CurrencyConverter />
                            </Suspense>
                          </div>
                        )}

                        {activeService === 'cost' && (
                          <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <ShippingCalculator />
                            </Suspense>
                          </div>
                        )}

                        {activeService === 'kyc' && (
                          <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <KYCForm />
                            </Suspense>
                          </div>
                        )}

                        {activeService === 'procurement' && (
                          <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <ProcurementSourcing />
                            </Suspense>
                          </div>
                        )}

                        {activeService === 'tracking' && (
                          <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <ShipmentTracker />
                            </Suspense>
                          </div>
                        )}

                        {activeService === 'map' && (
                          <div className="max-w-3xl h-[600px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                            <Suspense fallback={<WorkspaceLoader />}>
                              <LogisticsMap />
                            </Suspense>
                          </div>
                        )}
                      </div>

                      {/* Professional business workflow checklist / next steps guide column */}
                      <div className="lg:col-span-1 space-y-6">
                        {workflow && (
                          <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-md bg-white dark:bg-slate-950/40 rounded-2xl overflow-hidden font-arabic transition-all hover:shadow-lg">
                            <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-4 py-3.5 border-b border-slate-150 dark:border-slate-800/50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <UserCheck className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                                  {wTrans.checklistTitle}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 whitespace-nowrap shrink-0">
                                {wTrans.demoLabel}
                              </Badge>
                            </div>
                            
                            <CardContent className="p-4 space-y-4 text-xs font-sans">
                              {/* Required Inputs */}
                              {workflow.requiredInputs && workflow.requiredInputs.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
                                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {wTrans.requiredInputs}
                                  </h4>
                                  <ul className="space-y-1.5 pl-1">
                                    {workflow.requiredInputs.map((input, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-tight">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                        <span>{lang === 'ar' ? input.ar : input.ku}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Required Documents */}
                              {workflow.documents && workflow.documents.length > 0 && (
                                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3">
                                  <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {wTrans.documentsLabel}
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {workflow.documents.map((doc, idx) => (
                                      <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-350 border-none font-medium text-[10px] py-1 px-2.5 rounded-lg">
                                        {lang === 'ar' ? doc.ar : doc.ku}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Core Risks */}
                              {workflow.risks && workflow.risks.length > 0 && (
                                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3">
                                  <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
                                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {wTrans.risksLabel}
                                  </h4>
                                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1.5">
                                    {workflow.risks.map((risk, idx) => (
                                      <div key={idx} className="flex items-start gap-1.5 text-[10.5px] text-rose-700 dark:text-rose-300 leading-normal">
                                        <span className="shrink-0 mt-0.5">•</span>
                                        <span>{lang === 'ar' ? risk.ar : risk.ku}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Next Actions */}
                              {workflow.nextActions && workflow.nextActions.length > 0 && (
                                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3">
                                  <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
                                    <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    {wTrans.nextActionsLabel}
                                  </h4>
                                  <ol className="space-y-1.5 pl-1 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                                    {workflow.nextActions.map((action, idx) => (
                                      <li key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal flex gap-1.5">
                                        <span className="text-emerald-500 font-bold shrink-0">{idx + 1}.</span>
                                        <span>{lang === 'ar' ? action.ar : action.ku}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {/* Smart Action Buttons (Explicit UI interactive triggers) */}
                              {workflow.suggestedQuestions && workflow.suggestedQuestions.length > 0 && (
                                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-4">
                                  {workflow.suggestedQuestions.map((q, idx) => (
                                    <Button
                                      key={idx}
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-left justify-start text-[11px] font-bold font-arabic rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 text-emerald-700 dark:text-emerald-300 py-3 px-3 whitespace-normal leading-snug hover:-translate-y-0.5 transition-all text-start flex items-center gap-2"
                                      onClick={() => {
                                        setChatScope(activeService);
                                        setActiveService('assistant');
                                        setTimeout(() => handleSend(lang === 'ar' ? q.prompt.ar : q.prompt.ku), 150);
                                      }}
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span>{lang === 'ar' ? q.label.ar : q.label.ku}</span>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-none shadow-2xl">
          <DialogHeader className="border-b dark:border-slate-700 pb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {t.chat.detailsTitle}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t.chat.detailsDesc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t.chat.detailsLabel}</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedMessage?.text || ''}</ReactMarkdown>
              </div>
            </div>

            {selectedMessage?.groundingChunks && selectedMessage.groundingChunks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.chat.relatedPlaces}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedMessage.groundingChunks.map((chunk, i) => {
                    const maps = chunk.maps;
                    if (!maps) return null;
                    return (
                      <a 
                        key={i} 
                        href={maps.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{maps.title || t.chat.viewMap}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{t.chat.mapPrompt}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}