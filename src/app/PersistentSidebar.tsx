import { useCallback, useMemo, useState } from 'react';
import { Folder, Plus, Search } from 'lucide-react';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';
import { saveConversation, SavedConversation } from '@/src/lib/conversationStore';
import { SidebarProjectsPanel, SidebarSearchPanel } from '@/src/app/SidebarPanels';
import SidebarActionButton from '@/src/app/sidebar/SidebarActionButton';
import SidebarServiceButton from '@/src/app/sidebar/SidebarServiceButton';
import SidebarToggleButton from '@/src/app/sidebar/SidebarToggleButton';
import { UserMenu } from '@/src/components/UserMenu';
import BrandLogo from '@/src/components/BrandLogo';
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
  const services = useMemo(
    () => SERVICES.filter((service) => service.key !== 'audit' && (service.key !== 'inquiry' || isInquiryEnabled)),
    [isInquiryEnabled],
  );
  const ku = lang === 'ku';
  const en = lang === 'en';
  const [panel, setPanel] = useState<Panel>('main');
  const [isExpanded, setIsExpanded] = useState(false);
  const expanded = isExpanded || panel !== 'main';

  const sidebarToggleLabel = expanded
    ? (en ? 'Close sidebar' : ku ? 'داخستنی سایدبار' : 'إغلاق الشريط الجانبي')
    : (en ? 'Open sidebar' : ku ? 'کردنەوەی سایدبار' : 'فتح الشريط الجانبي');

  const applyService = useCallback((service: ServiceKey) => {
    setActiveService(service);
    setChatScope(service);
    setPanel('main');
  }, [setActiveService, setChatScope]);

  const startNewChat = useCallback(() => {
    saveConversation(messages, chatScope || 'assistant');
    const nextMessages: Message[] = [{ role: 'model', text: welcomeMessage }];

    setActiveService('assistant');
    setChatScope('assistant');
    setMessages(nextMessages);
    setChatBranches([]);
    setActiveBranchId('main');
    setPanel('main');
  }, [chatScope, messages, setActiveBranchId, setActiveService, setChatBranches, setChatScope, setMessages, welcomeMessage]);

  const restoreConversation = useCallback((conversation: SavedConversation) => {
    const restoredMessages = conversation.messages.length
      ? conversation.messages
      : [{ role: 'model' as const, text: welcomeMessage }];

    setActiveService('assistant');
    setChatScope(conversation.service);
    setMessages(restoredMessages);
    setChatBranches([]);
    setActiveBranchId('main');
    setPanel('main');
  }, [setActiveBranchId, setActiveService, setChatBranches, setChatScope, setMessages, welcomeMessage]);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((current) => {
      const next = !current;
      if (!next) setPanel('main');
      return next;
    });
  }, []);

  const openPanel = useCallback((nextPanel: Exclude<Panel, 'main'>) => {
    setIsExpanded(true);
    setPanel((current) => current === nextPanel ? 'main' : nextPanel);
  }, []);

  const openSearchPanel = useCallback(() => openPanel('search'), [openPanel]);
  const openProjectsPanel = useCallback(() => openPanel('projects'), [openPanel]);

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
            <BrandLogo size={32} className="h-8 w-8 rounded-lg shadow-sm shadow-blue-600/20" eager />
            <span className="whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">AI Gate Iraq</span>
          </div>
          <SidebarToggleButton expanded={expanded} label={sidebarToggleLabel} onToggle={toggleSidebar} />
        </div>

        <div className="shrink-0 space-y-1 border-b border-slate-200 p-2 dark:border-slate-800 lg:p-3">
          <SidebarActionButton icon={Plus} label={newChatLabel} onClick={startNewChat} expanded={expanded} />
          <SidebarActionButton icon={Search} label={searchLabel} onClick={openSearchPanel} expanded={expanded} active={panel === 'search'} />
          <SidebarActionButton icon={Folder} label={projectsLabel} onClick={openProjectsPanel} expanded={expanded} active={panel === 'projects'} />
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
                const active = service.key === activeService;
                const label = en ? service.label_en : lang === 'ar' ? service.label_ar : service.label_ku;
                return (
                  <SidebarServiceButton
                    key={service.key}
                    service={service}
                    label={label}
                    active={active}
                    expanded={expanded}
                    onSelect={applyService}
                  />
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
