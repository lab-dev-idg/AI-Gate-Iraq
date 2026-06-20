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

const workspaceItemClass = 'flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors focus:bg-slate-100 focus:text-slate-950 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-950 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:text-white dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-white';

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
      <DropdownMenuTrigger className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 text-xs font-bold text-emerald-600 outline-none ring-offset-background transition-colors hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-emerald-400">
        <StatusIcon className={`h-4 w-4 ${sync.state === 'syncing' ? 'animate-spin' : ''}`} />
        <span>{lang === 'ar' ? 'مساحة العمل' : 'شوێنی کار'}</span>
        <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#101827] dark:text-slate-100"
        align="end"
        dir="rtl"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-right text-xs font-black text-slate-700 dark:text-slate-200">
          {lang === 'ar' ? 'إدارة مساحة العمل' : 'بەڕێوەبردنی شوێنی کار'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        <div className="my-2 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[10px] leading-relaxed dark:border-slate-700 dark:bg-slate-950/60">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <div className="space-y-1 text-right">
            <p className="font-black text-slate-800 dark:text-slate-100">{status.title}</p>
            <p className="text-slate-600 dark:text-slate-300">{status.description}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem onClick={onOpenGuide} className={workspaceItemClass}>
          <HelpCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>{lang === 'ar' ? 'دليل البداية' : 'ڕێنمایی سەرەتا'}</span>
        </DropdownMenuItem>

        {hasStoredSession && (
          <DropdownMenuItem onClick={handleResume} className={workspaceItemClass}>
            <RefreshCw className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{lang === 'ar' ? 'استئناف مساحة العمل' : 'گەڕانەوە بۆ شوێنی کار'}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleExport} className={workspaceItemClass}>
          <Download className="h-4 w-4 shrink-0 text-blue-500" />
          <span>{lang === 'ar' ? 'تصدير ملخص العمل' : 'هەناردەکردنی کورتەی کار'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleClear}
          className={`${workspaceItemClass} text-rose-600 focus:bg-rose-50 focus:text-rose-700 data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-950/40 dark:focus:text-rose-300 dark:data-[highlighted]:bg-rose-950/40 dark:data-[highlighted]:text-rose-300`}
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          <span>{lang === 'ar' ? 'مسح مساحة العمل' : 'سڕینەوەی شوێنی کار'}</span>
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
