import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, Database, Download, HelpCircle, Loader2, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceSync } from '@/src/hooks/useWorkspaceSync';
import { clearSession, DEFAULT_SESSION, exportSessionSummary, loadSession } from '../lib/sessionStore';
import { ServiceKey } from '../types/services';
import { Message } from '../types/chat';

interface SessionManagerProps {
  lang: 'ku' | 'ar';
  t: any;
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  chatScope: ServiceKey;
  setChatScope: (scope: ServiceKey) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onOpenGuide: () => void;
}

export function SessionManager(props: SessionManagerProps) {
  const {
    lang,
    t,
    activeService,
    setActiveService,
    chatScope,
    setChatScope,
    messages,
    setMessages,
    onOpenGuide,
  } = props;

  const [hasStoredSession, setHasStoredSession] = useState(false);
  const sync = useWorkspaceSync({
    lang,
    welcome: t.chat.welcome,
    activeService,
    chatScope,
    messages,
    setActiveService,
    setChatScope,
    setMessages,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_gate_iraq_session');
      if (!saved) return setHasStoredSession(false);
      const parsed = JSON.parse(saved);
      setHasStoredSession(Boolean(parsed && (parsed.chatMessages?.length > 1 || Object.keys(parsed.drafts || {}).length > 0)));
    } catch {
      setHasStoredSession(false);
    }
  }, [messages]);

  const handleResume = () => {
    const session = loadSession(lang);
    if (session.chatMessages?.length) setMessages(session.chatMessages);
    setActiveService(session.activeService);
    setChatScope(session.chatScope);
    toast.success(lang === 'ar' ? 'تم استئناف مساحة العمل السابقة.' : 'شوێنی کاری پێشوو گەڕێندرایەوە.');
  };

  const handleClear = () => {
    clearSession();
    const clean = DEFAULT_SESSION(lang);
    setMessages([{ role: 'model', text: t.chat.welcome }]);
    setActiveService(clean.activeService);
    setChatScope(clean.chatScope);
    setHasStoredSession(false);
    toast.warning(lang === 'ar' ? 'تم مسح مساحة العمل.' : 'شوێنی کار پاککرایەوە.');
  };

  const handleExport = () => {
    const session = loadSession(lang);
    session.chatMessages = messages;
    session.activeService = activeService;
    session.chatScope = chatScope;
    const { text, filename } = exportSessionSummary(session, lang);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const status = getStatus(sync.state, lang, sync.lastSyncedAt);
  const StatusIcon = sync.state === 'syncing'
    ? Loader2
    : sync.state === 'offline' || sync.state === 'error'
      ? CloudOff
      : sync.user
        ? Cloud
        : Database;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 items-center px-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl gap-1.5">
        <StatusIcon className={`w-4 h-4 ${sync.state === 'syncing' ? 'animate-spin' : ''}`} />
        <span>{lang === 'ar' ? 'مساحة العمل' : 'شوێنی کار'}</span>
        <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl" align="end" dir="rtl">
        <DropdownMenuLabel className="text-xs font-black">
          {lang === 'ar' ? 'إدارة مساحة العمل' : 'بەڕێوەبردنی شوێنی کار'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl my-2 text-[10px] leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-right">
            <p className="font-black text-slate-700 dark:text-slate-200">{status.title}</p>
            <p className="text-slate-500 dark:text-slate-400">{status.description}</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenGuide}>
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          {lang === 'ar' ? 'دليل البداية' : 'ڕێنمایی سەرەتا'}
        </DropdownMenuItem>

        {hasStoredSession && (
          <DropdownMenuItem onClick={handleResume}>
            <RefreshCw className="w-4 h-4 text-emerald-500" />
            {lang === 'ar' ? 'استئناف مساحة العمل' : 'گەڕانەوە بۆ شوێنی کار'}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleExport}>
          <Download className="w-4 h-4 text-blue-500" />
          {lang === 'ar' ? 'تصدير ملخص العمل' : 'هەناردەکردنی کورتەی کار'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleClear} className="text-rose-500">
          <Trash2 className="w-4 h-4" />
          {lang === 'ar' ? 'مسح مساحة العمل' : 'سڕینەوەی شوێنی کار'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getStatus(state: ReturnType<typeof useWorkspaceSync>['state'], lang: 'ku' | 'ar', lastSyncedAt: number | null) {
  const time = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString(lang === 'ar' ? 'ar-IQ' : 'ku', { hour: '2-digit', minute: '2-digit' })
    : null;

  if (state === 'syncing') {
    return {
      title: lang === 'ar' ? 'جارٍ المزامنة' : 'لە هاوکاتکردندایە',
      description: lang === 'ar' ? 'يتم حفظ آخر التغييرات في حسابك.' : 'دوایین گۆڕانکارییەکان لە هەژمارەکەت پاشەکەوت دەکرێن.',
      dotClass: 'bg-amber-400',
    };
  }

  if (state === 'synced') {
    return {
      title: lang === 'ar' ? 'متزامن مع الحساب' : 'لەگەڵ هەژمار هاوکاتکراوە',
      description: time
        ? (lang === 'ar' ? `آخر مزامنة: ${time}` : `دوایین هاوکاتکردن: ${time}`)
        : (lang === 'ar' ? 'تتم المزامنة عبر أجهزتك.' : 'شوێنی کار لە نێوان ئامێرەکانت هاوکات دەکرێت.'),
      dotClass: 'bg-emerald-500',
    };
  }

  if (state === 'offline') {
    return {
      title: lang === 'ar' ? 'وضع عدم الاتصال' : 'دۆخی ئۆفلاین',
      description: lang === 'ar' ? 'ستتم المزامنة عند عودة الاتصال.' : 'کاتێک ئینتەرنێت گەڕایەوە گۆڕانکارییەکان هاوکات دەکرێن.',
      dotClass: 'bg-amber-500',
    };
  }

  if (state === 'error') {
    return {
      title: lang === 'ar' ? 'تعذر إكمال المزامنة' : 'هاوکاتکردن تەواو نەبوو',
      description: lang === 'ar' ? 'بياناتك المحلية محفوظة.' : 'داتای ناوخۆییت پارێزراوە.',
      dotClass: 'bg-rose-500',
    };
  }

  return {
    title: lang === 'ar' ? 'حفظ محلي للضيف' : 'پاشەکەوتکردنی ناوخۆیی بۆ میوان',
    description: lang === 'ar' ? 'سجّل الدخول للمزامنة عبر جميع أجهزتك.' : 'بچۆ ژوورەوە بۆ هاوکاتکردن لە هەموو ئامێرەکانت.',
    dotClass: 'bg-slate-400',
  };
}
