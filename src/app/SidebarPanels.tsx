import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Search, Trash2 } from 'lucide-react';
import { deleteConversation, listConversations, SavedConversation } from '@/src/lib/conversationStore';
import { SERVICES, ServiceKey } from '@/src/lib/services';

type SidebarLanguage = 'ku' | 'ar' | 'en';

const text = (lang: SidebarLanguage, ku: string, ar: string, en: string) => (
  lang === 'en' ? en : lang === 'ar' ? ar : ku
);

export function SidebarSearchPanel({ lang, onRestore }: { lang: SidebarLanguage; onRestore: (conversation: SavedConversation) => void }) {
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState<SavedConversation[]>(() => listConversations());

  useEffect(() => {
    const refresh = () => setConversations(listConversations());
    window.addEventListener('ai-gate-conversations-change', refresh);
    return () => window.removeEventListener('ai-gate-conversations-change', refresh);
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return conversations;
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(value) ||
      conversation.messages.some((message) => message.text.toLowerCase().includes(value)),
    );
  }, [conversations, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col p-3">
      <label className="relative block shrink-0">
        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={text(lang, 'گەڕان لە چاتەکان...', 'البحث في المحادثات...', 'Search conversations...')}
          className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pe-10 ps-3 text-sm text-slate-900 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>
      <div className="no-scrollbar mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {text(lang, 'هیچ چاتێک نەدۆزرایەوە.', 'لم يتم العثور على محادثات.', 'No conversations found.')}
          </p>
        ) : filtered.map((conversation) => (
          <div key={conversation.id} className="group flex items-center gap-2 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <button type="button" onClick={() => onRestore(conversation)} className="flex min-w-0 flex-1 items-center gap-2 text-right">
              <MessageSquare className="h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{conversation.title}</p>
                <p className="text-[10px] text-slate-500">{new Date(conversation.updatedAt).toLocaleDateString()}</p>
              </div>
            </button>
            <button
              type="button"
              aria-label={text(lang, 'سڕینەوەی چات', 'حذف المحادثة', 'Delete conversation')}
              onClick={() => { deleteConversation(conversation.id); setConversations(listConversations()); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-colors hover:text-rose-500 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarProjectsPanel({ lang, activeService, onOpen }: { lang: SidebarLanguage; activeService: ServiceKey; onOpen: (service: ServiceKey) => void }) {
  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
      <h3 className="mb-3 text-xs font-black text-slate-500 dark:text-slate-400">
        {text(lang, 'پڕۆژە و شوێنەکانی کار', 'المشاريع ومساحات العمل', 'Projects and workspaces')}
      </h3>
      <div className="space-y-1">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const active = service.key === activeService;
          const label = text(lang, service.label_ku, service.label_ar, service.label_en);
          return (
            <button key={service.key} type="button" onClick={() => onOpen(service.key)} className={`flex h-12 w-full items-center gap-3 rounded-xl px-3 text-right transition-colors ${active ? 'bg-[#1F6FEB] text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
              <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
