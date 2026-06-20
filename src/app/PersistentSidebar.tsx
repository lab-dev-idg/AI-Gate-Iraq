import { useState } from 'react';
import { Folder, MoreHorizontal, Plus, Search, UserRound, X } from 'lucide-react';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';
import { saveConversation, SavedConversation } from '@/src/lib/conversationStore';
import { loadSession, saveSession } from '@/src/lib/sessionStore';
import { SidebarProjectsPanel, SidebarSearchPanel } from '@/src/app/SidebarPanels';
import { useAuth } from '@/src/components/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PersistentSidebarProps {
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  lang: 'ku' | 'ar';
}

type Panel = 'main' | 'search' | 'projects';

export default function PersistentSidebar({ activeService, setActiveService, lang }: PersistentSidebarProps) {
  const { user } = useAuth();
  const isInquiryEnabled = getAdminFeatureFlagEnabled('enable_inquiry_form', true);
  const services = SERVICES.filter((service) => service.key !== 'inquiry' || isInquiryEnabled);
  const ku = lang === 'ku';
  const [panel, setPanel] = useState<Panel>('main');
  const expanded = panel !== 'main';

  const startNewChat = () => {
    const session = loadSession(lang);
    saveConversation(session.chatMessages, session.chatScope || 'assistant');
    saveSession({ activeService: 'assistant', chatScope: 'assistant', chatMessages: [] });
    window.location.reload();
  };

  const restoreConversation = (conversation: SavedConversation) => {
    saveSession({
      activeService: 'assistant',
      chatScope: conversation.service,
      chatMessages: conversation.messages,
    });
    window.location.reload();
  };

  const accountLabel = user?.displayName || user?.email || (ku ? 'هەژماری من' : 'حسابي');

  return (
    <aside className={`chatgpt-sidebar z-40 h-full shrink-0 border-e border-slate-200 bg-white transition-[width] dark:border-slate-800 dark:bg-[#0B1220] ${expanded ? 'w-[300px]' : 'w-[68px] md:w-[76px] lg:w-[300px]'}`} dir="rtl">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-slate-200 px-2 dark:border-slate-800 lg:justify-between lg:px-3">
          <div className={`${expanded ? 'flex' : 'hidden lg:flex'} min-w-0 items-center gap-2`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">AI</div>
            <span className="truncate text-sm font-black text-slate-900 dark:text-white">AI Gate Iraq</span>
          </div>
          <button type="button" onClick={() => setPanel(panel === 'main' ? 'projects' : 'main')} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            {panel === 'main' ? <MoreHorizontal className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>

        {panel === 'search' ? (
          <SidebarSearchPanel ku={ku} onRestore={restoreConversation} />
        ) : panel === 'projects' ? (
          <SidebarProjectsPanel ku={ku} activeService={activeService} onOpen={(service) => { setActiveService(service); setPanel('main'); }} />
        ) : (
          <>
            <div className="shrink-0 space-y-1 p-2 lg:p-3">
              <SidebarAction icon={Plus} label={ku ? 'چاتی نوێ' : 'محادثة جديدة'} onClick={startNewChat} />
              <SidebarAction icon={Search} label={ku ? 'گەڕان لە چاتەکان' : 'البحث في المحادثات'} onClick={() => setPanel('search')} />
              <SidebarAction icon={Folder} label={ku ? 'پڕۆژەکان' : 'المشاريع'} onClick={() => setPanel('projects')} />
            </div>
            <div className="hidden px-4 pb-2 pt-3 text-[11px] font-black text-slate-500 dark:text-slate-400 lg:block">{ku ? 'خزمەتگوزارییەکان' : 'الخدمات'}</div>
            <nav className="no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3 lg:px-3">
              {services.map((service) => {
                const Icon = service.icon;
                const active = service.key === activeService;
                const label = lang === 'ar' ? service.label_ar : service.label_ku;
                return (
                  <button key={service.key} type="button" title={label} onClick={() => setActiveService(service.key)} className={`flex h-11 w-full items-center justify-center rounded-xl lg:justify-start lg:gap-3 lg:px-3 ${active ? 'bg-[#1F6FEB] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
                    <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

        <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800 lg:p-3">
          <button type="button" title={accountLabel} className="flex h-11 w-full items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:justify-start lg:gap-3 lg:px-3">
            <Avatar className="h-8 w-8 shrink-0 border border-slate-200 dark:border-slate-700">
              <AvatarImage
                src={user?.photoURL || undefined}
                alt={user?.displayName || user?.email || accountLabel}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className={`${expanded ? 'block' : 'hidden lg:block'} min-w-0 truncate text-sm font-bold`}>{accountLabel}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarAction({ icon: Icon, label, onClick }: { icon: typeof Plus; label: string; onClick?: () => void }) {
  return (
    <button type="button" title={label} onClick={onClick} className="flex h-11 w-full items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:justify-start lg:gap-3 lg:px-3">
      <Icon className="h-5 w-5 shrink-0" />
      <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{label}</span>
    </button>
  );
}
