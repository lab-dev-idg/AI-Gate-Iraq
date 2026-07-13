import React, { useEffect, useMemo, useState } from 'react';
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

type RuntimeLang = 'ku' | 'ar' | 'en';

interface SessionManagerProps {
  lang: RuntimeLang;
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
const copy = (lang: RuntimeLang, ku: string, ar: string, en: string) => lang === 'en' ? en : lang === 'ar' ? ar : ku;

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

  const storageLang = lang === 'ar' ? 'ar' : 'ku';
  const [hasStoredSession, setHasStoredSession] = useState(false);
  const sync = useWorkspaceSync({
    lang: storageLang,
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
    const session = loadSession(storageLang);
    if (session.chatMessages?.length) setMessages(session.chatMessages);
    setActiveService(session.activeService);
    setChatScope(session.chatScope);
    toast.success(copy(lang, 'شوێنی کاری پێشوو گەڕێندرایەوە.', 'تم استئناف مساحة العمل السابقة.', 'Previous workspace resumed.'));
  };

  const handleClear = () => {
    clearSession();
    const clean = DEFAULT_SESSION(storageLang);
    setMessages([{ role: 'model', text: t.chat.welcome }]);
    setActiveService(clean.activeService);
    setChatScope(clean.chatScope);
    setHasStoredSession(false);
    toast.warning(copy(lang, 'شوێنی کار پاککرایەوە.', 'تم مسح مساحة العمل.', 'Workspace cleared.'));
  };

  const handleExport = () => {
    const session = loadSession(storageLang);
    session.chatMessages = messages;
    session.activeService = activeService;
    session.chatScope = chatScope;
    const { text, filename } = exportSessionSummary(session, storageLang);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const status = useMemo(() => getStatus(sync.state, lang, sync.lastSyncedAt), [lang, sync.lastSyncedAt, sync.state]);
  const StatusIcon = sync.state === 'syncing'
    ? Loader2
    : sync.state === 'offline' || sync.state === 'error'
      ? CloudOff
      : sync.user
        ? Cloud
        : Database;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 max-w-[min(220px,calc(100vw-1rem))] shrink-0 items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2 text-xs font-bold text-emerald-600 outline-none ring-offset-background transition-colors duration-100 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-emerald-400 sm:px-3">
        <StatusIcon className={`h-4 w-4 shrink-0 ${sync.state === 'syncing' ? 'animate-spin' : ''}`} />
        <span className="min-w-0 truncate">{copy(lang, 'شوێنی کار', 'مساحة العمل', 'Workspace')}</span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${status.dotClass}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#101827] dark:text-slate-100"
        align="end"
        dir={lang === 'en' ? 'ltr' : 'rtl'}
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-right text-xs font-black text-slate-700 dark:text-slate-200">
          {copy(lang, 'بەڕێوەبردنی شوێنی کار', 'إدارة مساحة العمل', 'Workspace management')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

        <div className="my-2 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[10px] leading-relaxed dark:border-slate-700 dark:bg-slate-950/60">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <div className="min-w-0 space-y-1 text-right">
            <p className="font-black text-slate-800 dark:text-slate-100">{status.title}</p>
            <p className="text-slate-600 dark:text-slate-300">{status.description}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem onClick={onOpenGuide} className={workspaceItemClass}>
          <HelpCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>{copy(lang, 'ڕێنمایی سەرەتا', 'دليل البداية', 'Start guide')}</span>
        </DropdownMenuItem>

        {hasStoredSession && (
          <DropdownMenuItem onClick={handleResume} className={workspaceItemClass}>
            <RefreshCw className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{copy(lang, 'گەڕانەوە بۆ شوێنی کار', 'استئناف مساحة العمل', 'Resume workspace')}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleExport} className={workspaceItemClass}>
          <Download className="h-4 w-4 shrink-0 text-blue-500" />
          <span>{copy(lang, 'هەناردەکردنی کورتەی کار', 'تصدير ملخص العمل', 'Export summary')}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleClear}
          className={`${workspaceItemClass} text-rose-600 focus:bg-rose-50 focus:text-rose-700 data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-950/40 dark:focus:text-rose-300 dark:data-[highlighted]:bg-rose-950/40 dark:data-[highlighted]:text-rose-300`}
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          <span>{copy(lang, 'سڕینەوەی شوێنی کار', 'مسح مساحة العمل', 'Clear workspace')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getStatus(state: ReturnType<typeof useWorkspaceSync>['state'], lang: RuntimeLang, lastSyncedAt: number | null) {
  const time = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString(lang === 'ar' ? 'ar-IQ' : lang === 'en' ? 'en' : 'ku', { hour: '2-digit', minute: '2-digit' })
    : null;

  if (state === 'syncing') {
    return {
      title: copy(lang, 'لە هاوکاتکردندایە', 'جارٍ المزامنة', 'Syncing'),
      description: copy(lang, 'دوایین گۆڕانکارییەکان لە هەژمارەکەت پاشەکەوت دەکرێن.', 'يتم حفظ آخر التغييرات في حسابك.', 'Saving the latest workspace changes.'),
      dotClass: 'bg-amber-400',
    };
  }

  if (state === 'synced') {
    return {
      title: copy(lang, 'لەگەڵ هەژمار هاوکاتکراوە', 'متزامن مع الحساب', 'Synced'),
      description: time
        ? copy(lang, `دوایین هاوکاتکردن: ${time}`, `آخر مزامنة: ${time}`, `Last sync: ${time}`)
        : copy(lang, 'شوێنی کار لە نێوان ئامێرەکانت هاوکات دەکرێت.', 'تتم المزامنة عبر أجهزتك.', 'Workspace syncs across your devices.'),
      dotClass: 'bg-emerald-500',
    };
  }

  if (state === 'offline') {
    return {
      title: copy(lang, 'دۆخی ئۆفلاین', 'وضع عدم الاتصال', 'Offline'),
      description: copy(lang, 'کاتێک ئینتەرنێت گەڕایەوە گۆڕانکارییەکان هاوکات دەکرێن.', 'ستتم المزامنة عند عودة الاتصال.', 'Changes will sync when connection returns.'),
      dotClass: 'bg-amber-500',
    };
  }

  if (state === 'error') {
    return {
      title: copy(lang, 'هاوکاتکردن تەواو نەبوو', 'تعذر إكمال المزامنة', 'Sync incomplete'),
      description: copy(lang, 'داتای ناوخۆییت پارێزراوە.', 'بياناتك المحلية محفوظة.', 'Your local data is saved.'),
      dotClass: 'bg-rose-500',
    };
  }

  return {
    title: copy(lang, 'پاشەکەوتکردنی ناوخۆیی بۆ میوان', 'حفظ محلي للضيف', 'Guest local save'),
    description: copy(lang, 'بچۆ ژوورەوە بۆ هاوکاتکردن لە هەموو ئامێرەکانت.', 'سجّل الدخول للمزامنة عبر جميع أجهزتك.', 'Sign in to sync across devices.'),
    dotClass: 'bg-slate-400',
  };
}
