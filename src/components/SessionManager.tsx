import React, { useState, useEffect } from 'react';
import { Database, Download, Trash2, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { loadSession, saveSession, clearSession, exportSessionSummary, DEFAULT_SESSION } from '../lib/sessionStore';
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

export function SessionManager({
  lang,
  t,
  activeService,
  setActiveService,
  chatScope,
  setChatScope,
  messages,
  setMessages,
  onOpenGuide,
}: SessionManagerProps) {
  const [hasStoredSession, setHasStoredSession] = useState(false);

  const checkSession = () => {
    try {
      const saved = localStorage.getItem('ai_gate_iraq_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.chatMessages?.length > 1 || Object.keys(parsed.drafts || {}).length > 0)) {
          setHasStoredSession(true);
          return;
        }
      }
      setHasStoredSession(false);
    } catch {
      setHasStoredSession(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [messages]);

  const handleResume = () => {
    const session = loadSession(lang);

    if (session.chatMessages && session.chatMessages.length > 0) {
      setMessages(session.chatMessages);
    }
    if (session.activeService) {
      setActiveService(session.activeService);
    }
    if (session.chatScope) {
      setChatScope(session.chatScope);
    }

    toast.success(
      lang === 'ar'
        ? 'تم استئناف مساحة العمل السابقة بنجاح.'
        : 'شوێنی کاری پێشوو بە سەرکەوتوویی گەڕێندرایەوە.'
    );
  };

  const handleClear = () => {
    clearSession();
    DEFAULT_SESSION(lang);
    setMessages([
      {
        role: 'model',
        text: t.chat.welcome
      }
    ]);
    setActiveService('assistant');
    setChatScope('assistant');
    setHasStoredSession(false);

    toast.warning(
      lang === 'ar'
        ? 'تم مسح مساحة العمل من هذا الجهاز.'
        : 'شوێنی کاری ئەم ئامێرە پاککرایەوە.'
    );
  };

  const handleExport = () => {
    const session = loadSession(lang);
    session.chatMessages = messages;
    session.activeService = activeService;
    session.chatScope = chatScope;

    const { text, filename } = exportSessionSummary(session, lang);

    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success(
      lang === 'ar'
        ? 'تم تصدير ملخص مساحة العمل بنجاح.'
        : 'کورتەی شوێنی کار بە سەرکەوتوویی هەناردە کرا.'
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 items-center px-3 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-arabic rounded-xl gap-1.5 transition-all outline-none cursor-pointer">
        <Database className="w-4 h-4" />
        <span>{lang === 'ar' ? 'مساحة العمل' : 'شوێنی کار'}</span>
        {hasStoredSession && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl" align="end" dir="rtl">
        <DropdownMenuLabel className="font-arabic text-xs font-black text-slate-800 dark:text-slate-100 pb-2">
          {lang === 'ar' ? 'إدارة مساحة العمل' : 'بەڕێوەبردنی شوێنی کار'}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl my-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="font-medium text-right">
            {lang === 'ar'
              ? 'تُحفظ المسودات والإعدادات المؤقتة على هذا الجهاز لتسهيل الرجوع إليها أثناء العمل.'
              : 'ڕەشنووس و ڕێکخستنە کاتییەکان لەسەر ئەم ئامێرە پاشەکەوت دەبن بۆ ئاسانکردنی بەردەوامی کار.'}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

        <div className="space-y-1 mt-1 font-arabic">
          <DropdownMenuItem
            onClick={onOpenGuide}
            className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'ar' ? 'دليل البداية' : 'ڕێنمایی سەرەتا'}</span>
          </DropdownMenuItem>

          {hasStoredSession && (
            <DropdownMenuItem
              onClick={handleResume}
              className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'ar' ? 'استئناف مساحة العمل' : 'گەڕانەوە بۆ شوێنی کار'}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleExport}
            className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>{lang === 'ar' ? 'تصدير ملخص العمل' : 'هەناردەکردنی کورتەی کار'}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleClear}
            className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>{lang === 'ar' ? 'مسح مساحة العمل' : 'سڕینەوەی شوێنی کار'}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
