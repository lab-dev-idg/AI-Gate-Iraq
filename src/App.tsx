import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, MapPin, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { useLanguage } from '@/src/lib/LanguageContext';
import { chat } from '@/src/lib/gemini';
import { Message } from '@/src/types/chat';
import { BUSINESS_WORKFLOWS } from '@/src/lib/businessWorkflows';
import { SERVICES, ServiceKey, getServiceName, getPromptChips } from '@/src/lib/services';

// Layout shell components
import AppHeader from '@/src/app/AppHeader';
import AppSidebar from '@/src/app/AppSidebar';
import MobileServiceNav from '@/src/app/MobileServiceNav';
import ServiceWorkspace from '@/src/app/ServiceWorkspace';
import WorkflowGuide from '@/src/app/WorkflowGuide';

// AI assistant feature
import AssistantWorkspace from '@/src/features/assistant/AssistantWorkspace';

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
        <AppHeader lang={lang} setLang={setLang} t={t} />
        <Toaster position="top-center" richColors />

        {/* Main Container */}
        <main className="flex-1 overflow-hidden max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-12 gap-5 p-4 md:p-6 min-h-0">
          
          {/* Mobile & Tablet Service Selector */}
          <MobileServiceNav activeService={activeService} setActiveService={setActiveService} lang={lang} />

          {/* Desktop Navigation Sidebar */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 min-h-0 h-full">
            <AppSidebar activeService={activeService} setActiveService={setActiveService} lang={lang} t={t} />
          </div>

          {/* Workspace Area */}
          <div className="flex-1 lg:col-span-9 flex flex-col gap-6 min-h-0 h-full">
            {activeService === 'assistant' ? (
              <AssistantWorkspace
                lang={lang}
                t={t}
                chatScope={chatScope}
                setChatScope={setChatScope}
                messages={messages}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSend={handleSend}
                onSelectMessage={setSelectedMessage}
                chatScrollRef={chatScrollRef}
                promptChips={promptChips}
              />
            ) : (
              <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-white dark:bg-slate-900/30 rounded-2xl p-4 md:p-6 h-full">
                {/* Workspace Title & Meta Header */}
                <div className="flex items-center gap-3 border-b pb-4 mb-5 border-slate-100 dark:border-slate-800/80 shrink-0 font-arabic">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-slate-50 dark:bg-slate-950/20">
                    {(() => {
                      const srv = SERVICES.find(s => s.key === activeService);
                      const Icon = srv?.icon || Bot;
                      return <Icon className={`w-5 h-5 ${srv?.color || ''}`} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-white leading-tight">
                      {getServiceName(activeService, lang)}
                    </h2>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                      {activeService === 'currency' && (lang === 'ar' ? 'فحص السعر الرسمي والوزاري ومقارنة سعر صرف الحوالات.' : 'پێداچوونەوە و بەراوردکردنی نرخی فەرمی غاز یان ئازادی بازاڕ.')}
                      {activeService === 'cost' && (lang === 'ar' ? 'نموذج تقدير الوزن الحجمي، والأسعار ومراعاة فترات الإعفاء الجمركي.' : 'حسابی قەبارە و هەژمارکردنی گشتی تێچووە لۆجیستییەکان.')}
                      {activeService === 'kyc' && (lang === 'ar' ? 'متطلبات التسجيل الموحد للشركات وبوابة النماذج الإلكترونية.' : 'مەرجە بنەڕەتییەکان بۆ تۆمارکردنی کار و دابینکردنی مەلەفی فەرمی.')}
                      {activeService === 'procurement' && (lang === 'ar' ? 'صياغة عروض الأسعار والبحث عن بضائع لتمكين التجارة الآمنة.' : 'نووسینی داوای نرخ لەگەڵ بەدواداچوونی سەرچاوەی کارگەکان.')}
                      {activeService === 'tracking' && (lang === 'ar' ? 'استقصاء مسار الحاويات والبضائع بنقرة واحدة عبر لوحة التحكم ومكتب التسليم.' : 'بەدواداچوونی گونجاو بە ژمارەی مۆڵەت فەرمی بۆ بینینی خاڵ بە خاڵی گەیشتنی بار.')}
                      {activeService === 'map' && (lang === 'ar' ? 'اكتشف مواقع الموانئ البرية ومرافئ التنزيل الجغرافي النشطة في عاصمة التجارة.' : 'بینینی شوێن و داتا لۆجیستییەکان لەسەر نەخشەی چالاکی هاوردەکردنی کاڵاکان.')}
                    </p>
                  </div>
                </div>

                {/* Workspace Content Viewport */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4 cs-scroll">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Active Workspace Main Service Details Column */}
                    <div className="lg:col-span-2 space-y-6">
                      <ServiceWorkspace activeService={activeService} lang={lang} t={t} />
                    </div>

                    {/* Professional business workflow checklist / next steps guide column */}
                    <div className="lg:col-span-1 space-y-6">
                      <WorkflowGuide
                        activeService={activeService}
                        lang={lang}
                        onQuestionClick={(questionPrompt) => {
                          setChatScope(activeService);
                          setActiveService('assistant');
                          setTimeout(() => handleSend(questionPrompt), 150);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>

        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-none shadow-2xl">
            <DialogHeader className="border-b dark:border-slate-700 pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                <Bot className="w-6 h-6 text-primary" />
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
