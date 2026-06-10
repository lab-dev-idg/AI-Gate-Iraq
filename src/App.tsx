import { useState, useRef, useEffect } from 'react';
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
import { CurrencyConverter } from '@/src/components/CurrencyConverter';
import { FeedbackDialog } from '@/src/components/FeedbackDialog';
import { LogisticsMap } from '@/src/components/LogisticsMap';
import { ShipmentTracker } from '@/src/components/ShipmentTracker';
import { UserMenu } from '@/src/components/UserMenu';
import { ShippingCalculator } from '@/src/components/ShippingCalculator';
import { ProcurementSourcing } from '@/src/components/ProcurementSourcing';
import { KYCForm } from '@/src/components/KYCForm';
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

export default function App() {
  const { lang, setLang, t } = useLanguage();
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

  const marketSummaryRef = useRef<HTMLDivElement | null>(null);
  const borderStatusRef = useRef<HTMLDivElement | null>(null);
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const costEstimatorRef = useRef<HTMLDivElement | null>(null);
  const kycRef = useRef<HTMLDivElement | null>(null);
  const procurementRef = useRef<HTMLDivElement | null>(null);
  const trackingRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const scrollToSidebarSection = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    const target = targetRef.current;
    const container = sidebarScrollRef.current;

    if (!target || !container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop - 12;

    container.scrollTo({
      top: offset,
      behavior: 'smooth',
    });
  };

  const QUICK_ACTIONS = [
    { label: 'تێچووی کۆنتێنەر', icon: Package, prompt: 'تێچووی هێنانی کۆنتێنەرێکی ٤٠ پێ لە چینەوە بۆ ئوم قەسر چەندە؟' },
    { label: 'ئیبراهیم خەلیل', icon: ShieldAlert, prompt: 'ڕێکارەکانی گومرگ لە مەرزە نێودەوڵەتی ئیبراهیم خەلیل چۆنن بۆ باری تورکیا؟' },
    { label: 'بەڵگەنامەکان', icon: FileText, prompt: 'چ بەڵگەنامەیەک پێویستە بۆ هاوردەکردنی کاڵای خۆراکی? ' },
    { label: 'فڕۆکەخانەی هەولێر', icon: Plane, prompt: 'خێراترین ڕێگە بۆ تەرخیسکردنی باری ئاسمانی لە فڕۆکەخانەی هەولێر چییە؟' },
    { label: 'گۆڕینەوەی دراو', icon: DollarSign, prompt: 'Convert 100 USD to IQD' },
    { label: 'ئەکاونتی بازرگانی (KYC)', icon: UserCheck, prompt: 'دەستپێکردنی پڕۆسەی ناساندنی بازرگان و بارکردنی مۆڵەت' },
    { label: 'حەواڵە و دارایی', icon: Wallet, prompt: 'پیشاندانی جزدانی ئەلیکترۆنی و وردەکاری پسوڵەکان' },
    { label: 'بانکەکان و پارەدان', icon: Building2, prompt: 'چۆنیەتی بەستنەوەی ئەکاونت بە بانکەکان و گواستنەوەی پارە' }
  ];

  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({
        message: userMessage
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || 'داوای لێبوردن دەکەم، کێشەیەک ڕوویدا.',
        groundingChunks 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'کێشەیەک لە پەیوەندییەکەدا هەیە. تکایە دووبارە هەوڵ بدەرەوە.' }]);
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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-2" />
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

      <main className="flex-1 overflow-hidden max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
        {/* Sidebar Info - Desktop */}
        <aside className="hidden lg:flex lg:col-span-3 h-full min-h-0 overflow-hidden flex-col">
          {/* Quick Navigation Panel */}
          <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 p-4 shrink-0 rounded-2xl mb-4 transition-all hover:shadow-md">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              {lang === 'ar' ? 'بوابة الخدمات السريعة' : 'ڕێبەری خزمەتگوزارییەکان'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(marketSummaryRef)}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'ملخص السوق' : 'کورتەی بازاڕ'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(borderStatusRef)}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'حالة المنافذ' : 'دۆخی مەرزەکان'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(currencyRef)}
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'محول العملات' : 'گۆڕینەوەی دراو'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(costEstimatorRef)}
              >
                <Package className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'حاسبة التكاليف' : 'خەمڵاندنی تێچوو'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(kycRef)}
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'الحساب / KYC' : 'تۆمارکردن / KYC'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(procurementRef)}
              >
                <Building2 className="w-3.5 h-3.5 text-violet-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'توريد البضائع' : 'دابینکردنی کاڵا'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(trackingRef)}
              >
                <FileText className="w-3.5 h-3.5 text-sky-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'تتبع الشحنات' : 'بەدواداچوونی بار'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group justify-start text-[11px] font-bold h-9 bg-slate-50 hover:bg-primary hover:text-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary px-2.5 truncate flex items-center rounded-xl transition-all duration-200 gap-1.5"
                onClick={() => scrollToSidebarSection(mapRef)}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white shrink-0 ml-1" />
                <span className="truncate">{lang === 'ar' ? 'خريطة المنافذ' : 'نەخشەی لۆجستیک'}</span>
              </Button>
            </div>
          </Card>

          <div 
            ref={sidebarScrollRef} 
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain sidebar-scroll flex flex-col gap-6 pl-1 pr-1 pb-10"
          >
            <div ref={marketSummaryRef}>
              <Card className="border border-emerald-500/10 shadow-md bg-gradient-to-br from-slate-950 via-slate-900 to-primary text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 font-arabic text-emerald-400">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    {t.sidebar.marketSummary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.newTariff}</p>
                    <p className="text-sm font-semibold">{t.sidebar.newTariffDesc}</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.procedures}</p>
                    <p className="text-sm font-semibold">{t.sidebar.proceduresDesc}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div ref={borderStatusRef}>
              <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    {t.sidebar.borderStatus}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {IRAN_BORDER_STATUS.map((border) => (
                    <div key={border.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{border.name}</span>
                        <Badge variant={border.status === 'active' ? 'secondary' : 'destructive'} 
                               className={border.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900 hover:bg-emerald-100/50' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900'}>
                          {border.status === 'active' ? t.sidebar.borderActive : t.sidebar.borderBusy}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{t.sidebar.waitingTime}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{border.waitTime}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div ref={currencyRef}>
              <CurrencyConverter />
            </div>

            <div ref={costEstimatorRef}>
              <ShippingCalculator />
            </div>

            <div ref={kycRef}>
              <KYCForm />
            </div>

            <div ref={procurementRef}>
              <ProcurementSourcing />
            </div>

            <div ref={trackingRef}>
              <ShipmentTracker />
            </div>

            <div ref={mapRef}>
              <LogisticsMap />
            </div>
          </div>
        </aside>

        {/* Chat Interface */}
        <Card className="lg:col-span-9 flex flex-col min-h-0 overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-white dark:bg-slate-900/30 rounded-2xl">
          <div 
            ref={chatScrollRef} 
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain chat-scroll p-4 md:p-6"
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
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end pr-11">
                  <div className="bg-secondary p-3 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">{t.chat.thinking}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-full text-[11px] font-bold bg-white dark:bg-slate-900/60 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all duration-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:-translate-y-0.5 gap-1.5 px-3.5 py-1.5 shadow-sm shrink-0 flex items-center"
                onClick={() => {
                  setInput(action.prompt);
                }}
              >
                {action.icon && <action.icon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />}
                {action.label}
              </Button>
            ))}
          </div>

          <div className="p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
              <Input
                placeholder={t.chat.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="ps-4 pe-14 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                dir="rtl"
              />
              <Button 
                onClick={handleSend} 
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