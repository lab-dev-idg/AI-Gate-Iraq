import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/src/lib/LanguageContext';
import { chat } from '@/src/lib/gemini';
import { Message } from '@/src/types/chat';
import { BUSINESS_WORKFLOWS } from '@/src/lib/businessWorkflows';
import { SERVICES, ServiceKey, getPromptChips, getServiceName } from '@/src/lib/services';
import { loadSession, saveSession } from '@/src/lib/sessionStore';
import { SessionManager } from '@/src/components/SessionManager';
import { OnboardingGuide } from '@/src/components/OnboardingGuide';
import AppHeader from '@/src/app/AppHeader';
import PersistentSidebar from '@/src/app/PersistentSidebar';
import ServiceWorkspace from '@/src/app/ServiceWorkspace';
import WorkflowGuide from '@/src/app/WorkflowGuide';
import AssistantWorkspace from '@/src/features/assistant/AssistantWorkspace';
const SecureAdminPanel = lazy(() => import('@/src/admin/SecureAdminPanel'));
import { PublicInquiryForm } from '@/src/features/inquiry/PublicInquiryForm';

export default function App() {
  const isAdminRoute = window.location.pathname === '/admin';
  if (isAdminRoute) {
    return (
      <Suspense
        fallback={
          <div
            className="grid min-h-screen place-items-center bg-[#090D16] text-white"
            dir="rtl"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
              <p className="text-sm font-bold text-slate-300">
                پەڕەی بەڕێوەبردن بار دەکرێت...
              </p>
            </div>
          </div>
        }
      >
        <SecureAdminPanel />
      </Suspense>
    );
  }

  const { lang, setLang, t } = useLanguage();
  const [activeService, setActiveService] = useState<ServiceKey>(() => loadSession().activeService || 'assistant');
  const [chatScope, setChatScope] = useState<ServiceKey>(() => loadSession().chatScope || 'assistant');
  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = loadSession().chatMessages;
    return cached?.length ? cached : [{ role: 'model', text: t.chat.welcome }];
  });
  const [input, setInput] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const promptChips = useMemo(() => getPromptChips(chatScope, lang), [chatScope, lang]);

  useEffect(() => {
    if (!loadSession(lang).hasCompletedOnboarding) setIsOnboardingOpen(true);
  }, []);

  useEffect(() => {
    saveSession({ activeService, chatScope, chatMessages: messages, language: lang });
  }, [activeService, chatScope, messages, lang]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', text: t.chat.welcome }]);
    }
  }, [lang]);

  useEffect(() => {
    const element = chatScrollRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, activeService]);

  const handleOnboardingAction = (serviceKey: ServiceKey, initialPrompt?: string) => {
    setActiveService(serviceKey);
    setChatScope(serviceKey);
    saveSession({ hasCompletedOnboarding: true });
    setIsOnboardingOpen(false);
    if (initialPrompt) window.setTimeout(() => void handleSend(initialPrompt), 300);
  };

  const handleSend = async (overridePrompt?: string) => {
    const userMessage = (overridePrompt ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages((current) => [...current, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({
        message: userMessage,
        activeService: chatScope,
        lang,
        serviceHint: getServiceHint(chatScope),
        workflowContext: BUSINESS_WORKFLOWS[chatScope] || null,
      });

      setMessages((current) => [
        ...current,
        {
          role: 'model',
          text: response.text || (lang === 'ar' ? 'تعذر إكمال الطلب.' : 'نەتوانرا داواکارییەکە تەواو بکرێت.'),
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        },
      ]);
    } catch (error) {
      const code = error instanceof Error ? error.message : 'AI_REQUEST_FAILED';
      setMessages((current) => [...current, { role: 'model', text: getFriendlyAiError(code, lang) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-dvh min-h-dvh w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#090D16]" dir="ltr">
        <PersistentSidebar activeService={activeService} setActiveService={setActiveService} lang={lang} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden" dir="rtl">
          <AppHeader lang={lang} setLang={setLang} t={t}>
            <SessionManager
              lang={lang}
              t={t}
              activeService={activeService}
              setActiveService={setActiveService}
              chatScope={chatScope}
              setChatScope={setChatScope}
              messages={messages}
              setMessages={setMessages}
              onOpenGuide={() => setIsOnboardingOpen(true)}
            />
          </AppHeader>

          <Toaster position="top-center" richColors />
          <OnboardingGuide
            lang={lang}
            t={t}
            isOpen={isOnboardingOpen}
            onClose={() => {
              saveSession({ hasCompletedOnboarding: true });
              setIsOnboardingOpen(false);
            }}
            onActionClick={handleOnboardingAction}
          />

          <main className="min-h-0 flex-1 overflow-hidden">
            <section className="h-full min-w-0 overflow-hidden p-2 sm:p-3 md:p-4 lg:p-5">
              <div className="mx-auto h-full min-h-0 w-full max-w-[1200px] overflow-hidden">
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
                  <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-[#0E1728] sm:p-4 md:p-5">
                    <div className="mb-4 flex shrink-0 items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
                        {(() => {
                          const service = SERVICES.find((item) => item.key === activeService);
                          const Icon = service?.icon || Bot;
                          return <Icon className={`h-5 w-5 ${service?.color || ''}`} />;
                        })()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-black text-slate-900 dark:text-white md:text-lg">
                          {getServiceName(activeService, lang)}
                        </h2>
                        <p className="mt-1 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
                          {getServiceDescription(activeService, lang)}
                        </p>
                      </div>
                    </div>

                    <div className="cs-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-3">
                      {activeService === 'inquiry' ? (
                        <PublicInquiryForm />
                      ) : (
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                          <div className="min-w-0 space-y-5 xl:col-span-8">
                            <ServiceWorkspace activeService={activeService} lang={lang} t={t} />
                          </div>
                          <div className="min-w-0 space-y-5 xl:col-span-4">
                            <WorkflowGuide
                              activeService={activeService}
                              lang={lang}
                              onQuestionClick={(questionPrompt) => {
                                setChatScope(activeService);
                                setActiveService('assistant');
                                window.setTimeout(() => void handleSend(questionPrompt), 150);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </section>
          </main>
        </div>

        <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="border-none bg-white shadow-2xl dark:bg-slate-800 sm:max-w-md" dir="rtl">
            <DialogHeader className="border-b pb-4 dark:border-slate-700">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
                {t.chat.detailsTitle}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                {t.chat.detailsDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{selectedMessage?.text || ''}</ReactMarkdown>
                </div>
              </div>

              {selectedMessage?.groundingChunks?.map((chunk, index) => {
                const maps = chunk.maps;
                if (!maps) return null;
                return (
                  <a key={index} href={maps.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm font-bold">{maps.title || t.chat.viewMap}</p>
                  </a>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function getServiceHint(service: ServiceKey): string {
  const hints: Partial<Record<ServiceKey, string>> = {
    currency: 'The user is using the currency converter workspace.',
    cost: 'The user is using the shipping cost estimator workspace.',
    kyc: 'The user is using the KYC workspace.',
    procurement: 'The user is using the procurement workspace.',
    tracking: 'The user is using the shipment tracking workspace.',
    market: 'The user is using the market intelligence workspace.',
    borders: 'The user is using the border operations workspace.',
    map: 'The user is using the logistics map workspace.',
  };
  return hints[service] || '';
}

function getFriendlyAiError(code: string, lang: 'ku' | 'ar'): string {
  const arabic = lang === 'ar';
  if (code === 'AI_CREDENTIAL_REJECTED') return arabic ? 'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً بسبب إعداد أمني.' : 'خزمەتگوزاریی AI کاتیی بەهۆی ڕێکخستنی ئاسایشییەوە بەردەست نییە.';
  if (code === 'AI_QUOTA_EXCEEDED') return arabic ? 'تم بلوغ حد الاستخدام. حاول لاحقاً.' : 'سنووری بەکارهێنان پڕ بووە؛ دواتر هەوڵ بدەوە.';
  return arabic ? 'تعذر إكمال الطلب حالياً. حاول مرة أخرى.' : 'ئێستا نەتوانرا داواکارییەکە تەواو بکرێت؛ دووبارە هەوڵ بدەوە.';
}

function getServiceDescription(service: ServiceKey, lang: 'ku' | 'ar'): string {
  const ar: Partial<Record<ServiceKey, string>> = {
    currency: 'مقارنة أسعار الصرف الحالية.',
    cost: 'تقدير الوزن الحجمي والتكلفة اللوجستية.',
    kyc: 'متطلبات تسجيل وتوثيق الأعمال.',
    procurement: 'إعداد طلبات التوريد والبحث عن الموردين.',
    tracking: 'متابعة الشحنات والحاويات.',
    market: 'ملخصات السوق والتنبيهات التنظيمية.',
    borders: 'معلومات المعابر والمنافذ.',
    map: 'عرض المراكز والممرات اللوجستية.',
    inquiry: 'إرسال طلب أو استفسار للإدارة.',
  };
  const ku: Partial<Record<ServiceKey, string>> = {
    currency: 'بەراوردکردنی نرخەکانی ئێستای دراو.',
    cost: 'خەمڵاندنی کێشی قەبارەیی و تێچووی لۆجیستی.',
    kyc: 'پێداویستییەکانی تۆمار و پشتڕاستکردنەوەی بازرگانی.',
    procurement: 'ئامادەکردنی داواکاریی دابینکردن و دۆزینەوەی دابینکەر.',
    tracking: 'بەدواداچوونی بار و کۆنتەینەر.',
    market: 'کورتەی بازاڕ و ئاگادارکردنەوە ڕێکخراوەییەکان.',
    borders: 'زانیاریی دەروازە و سنوورەکان.',
    map: 'پیشاندانی مەڵبەند و ڕێڕەوی لۆجیستی.',
    inquiry: 'ناردنی داواکاری یان پرسیار بۆ بەڕێوەبەرایەتی.',
  };
  return (lang === 'ar' ? ar[service] : ku[service]) || '';
}
