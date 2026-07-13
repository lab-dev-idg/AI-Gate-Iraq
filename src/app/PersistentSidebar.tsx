import { useState } from 'react';
import { Folder, PanelLeftClose, PanelLeftOpen, Plus, Search } from 'lucide-react';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';
import { saveConversation, SavedConversation } from '@/src/lib/conversationStore';
import { saveSession } from '@/src/lib/sessionStore';
import { SidebarProjectsPanel, SidebarSearchPanel } from '@/src/app/SidebarPanels';
import { UserMenu } from '@/src/components/UserMenu';
import { Message } from '@/src/types/chat';
import { ChatBranch } from '@/src/types/session';

interface PersistentSidebarProps {
  activeService: ServiceKey;
  chatScope: ServiceKey;
  messages: Message[];
  setActiveService: (service: ServiceKey) => void;
  setChatScope: (service: ServiceKey) => void;
  setMessages: (messages: Message[]) => void;
  setChatBranches: (branches: ChatBranch[]) => void;
  setActiveBranchId: (branchId: string) => void;
  welcomeMessage: string;
  lang: 'ku' | 'ar' | 'en';
}

type Panel = 'main' | 'search' | 'projects';

export default function PersistentSidebar({
  activeService,
  chatScope,
  messages,
  setActiveService,
  setChatScope,
  setMessages,
  setChatBranches,
  setActiveBranchId,
  welcomeMessage,
  lang,
}: PersistentSidebarProps) {
  const isInquiryEnabled = getAdminFeatureFlagEnabled('enable_inquiry_form', true);
  const services = SERVICES.filter(
    (service) => service.key !== 'audit' && (service.key !== 'inquiry' || isInquiryEnabled)
  );
  const ku = lang === 'ku';
  const en = lang === 'en';
  const [panel, setPanel] = useState<Panel>('main');
  const [isExpanded, setIsExpanded] = useState(false);
  const expanded = isExpanded || panel !== 'main';

  const sidebarToggleLabel = expanded
    ? (en ? 'Close sidebar' : ku ? 'داخستنی سایدبار' : 'إغلاق الشريط الجانبي')
    : (en ? 'Open sidebar' : ku ? 'کردنەوەی سایدبار' : 'فتح الشريط الجانبي');

  const applyService = (service: ServiceKey) => {
    setActiveService(service);
    setChatScope(service);
    setPanel('main');
    saveSession({ activeService: service, chatScope: service });
  };

  const startNewChat = () => {
    saveConversation(messages, chatScope || 'assistant');
    const nextMessages: Message[] = [{ role: 'model', text: welcomeMessage }];

    setActiveService('assistant');
    setChatScope('assistant');
    setMessages(nextMessages);
    setChatBranches([]);
    setActiveBranchId('main');
    setPanel('main');
    saveSession({
      activeService: 'assistant',
      chatScope: 'assistant',
      chatMessages: nextMessages,
      chatBranches: [],
      activeBranchId: 'main',
    });
  };

  const restoreConversation = (conversation: SavedConversation) => {
    const restoredMessages = conversation.messages.length
      ? conversation.messages
      : [{ role: 'model' as const, text: welcomeMessage }];

    setActiveService('assistant');
    setChatScope(conversation.service);
    setMessages(restoredMessages);
    setChatBranches([]);
    setActiveBranchId('main');
    setPanel('main');
    saveSession({
      activeService: 'assistant',
      chatScope: conversation.service,
      chatMessages: restoredMessages,
      chatBranches: [],
      activeBranchId: 'main',
    });
  };

  const toggleSidebar = () => {
    setIsExpanded((current) => {
      const next = !current;
      if (!next) setPanel('main');
      return next;
    });
  };

  const openPanel = (nextPanel: Exclude<Panel, 'main'>) => {
    setIsExpanded(true);
    setPanel((current) => current === nextPanel ? 'main' : nextPanel);
  };

  const newChatLabel = en ? 'New chat' : ku ? 'چاتی نوێ' : 'محادثة جديدة';
  const searchLabel = en ? 'Search conversations' : ku ? 'گەڕان لە چاتەکان' : 'البحث في المحادثات';
  const projectsLabel = en ? 'Projects' : ku ? 'پڕۆژەکان' : 'المشاريع';
  const servicesLabel = en ? 'Services' : ku ? 'خزمەتگوزارییەکان' : 'الخدمات';

  return (
    <aside
      className={`chatgpt-sidebar z-40 h-full shrink-0 overflow-hidden border-e border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1220] ${expanded ? 'w-[300px]' : 'w-[68px] md:w-[76px] lg:w-[300px]'}`}
      dir={en ? 'ltr' : 'rtl'}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-slate-200 px-2 dark:border-slate-800 lg:justify-between lg:px-3">
          <div className={`${expanded ? 'flex' : 'hidden lg:flex'} min-w-0 items-center gap-2`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-sm shadow-blue-600/30">AI</div>
            <span className="whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">AI Gate Iraq</span>
          </div>
          <button type="button" onClick={toggleSidebar} aria-label={sidebarToggleLabel} title={sidebarToggleLabel} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500 hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-[#0B1220]">
            {expanded ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
        </div>

        <div className="shrink-0 space-y-1 border-b border-slate-200 p-2 dark:border-slate-800 lg:p-3">
          <SidebarAction icon={Plus} label={newChatLabel} onClick={startNewChat} expanded={expanded} />
          <SidebarAction icon={Search} label={searchLabel} onClick={() => openPanel('search')} expanded={expanded} active={panel === 'search'} />
          <SidebarAction icon={Folder} label={projectsLabel} onClick={() => openPanel('projects')} expanded={expanded} active={panel === 'projects'} />
        </div>

        {panel === 'search' ? (
          <SidebarSearchPanel lang={lang} onRestore={restoreConversation} />
        ) : panel === 'projects' ? (
          <SidebarProjectsPanel lang={lang} activeService={activeService} onOpen={applyService} />
        ) : (
          <>
            <div className={`${expanded ? 'block' : 'hidden lg:block'} shrink-0 px-4 pb-2 pt-3 text-[11px] font-black text-slate-500 dark:text-slate-400`}>{servicesLabel}</div>
            <nav className="no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3 lg:px-3">
              {services.map((service) => {
                const Icon = service.icon;
                const active = service.key === activeService;
                const label = en ? service.label_en : lang === 'ar' ? service.label_ar : service.label_ku;
                return (
                  <button key={service.key} type="button" title={label} aria-current={active ? 'page' : undefined} onClick={() => applyService(service.key)} className={`flex h-11 w-full items-center rounded-xl transition-colors ${expanded ? 'justify-start gap-3 px-3' : 'justify-center lg:justify-start lg:gap-3 lg:px-3'} ${active ? 'bg-[#1F6FEB] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
                    <span className={`${expanded ? 'block' : 'hidden lg:block'} min-w-0 truncate text-sm font-bold`}>{label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

        <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800 lg:p-3">
          <UserMenu variant="sidebar" expanded={expanded} />
        </div>
      </div>
    </aside>
  );
}

function SidebarAction({ icon: Icon, label, onClick, expanded, active = false }: { icon: typeof Plus; label: string; onClick?: () => void; expanded: boolean; active?: boolean }) {
  return (
    <button type="button" title={label} onClick={onClick} className={`flex h-11 w-full items-center rounded-xl transition-colors ${expanded ? 'justify-start gap-3 px-3' : 'justify-center lg:justify-start lg:gap-3 lg:px-3'} ${active ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className={`${expanded ? 'block' : 'hidden lg:block'} min-w-0 truncate text-sm font-bold`}>{label}</span>
    </button>
  );
}
