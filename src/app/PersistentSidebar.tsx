import { Folder, MoreHorizontal, Plus, Search } from 'lucide-react';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';

interface PersistentSidebarProps {
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  lang: 'ku' | 'ar';
}

export default function PersistentSidebar({ activeService, setActiveService, lang }: PersistentSidebarProps) {
  const isInquiryEnabled = getAdminFeatureFlagEnabled('enable_inquiry_form', true);
  const services = SERVICES.filter((service) => service.key !== 'inquiry' || isInquiryEnabled);
  const ku = lang === 'ku';

  return (
    <aside className="chatgpt-sidebar h-full w-[68px] shrink-0 border-e border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1220] md:w-[76px] lg:w-[300px]" dir="rtl">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-slate-200 px-2 dark:border-slate-800 lg:justify-between lg:px-3">
          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">AI</div>
            <span className="truncate text-sm font-black text-slate-900 dark:text-white">AI Gate Iraq</span>
          </div>
          <button type="button" aria-label="Menu" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="shrink-0 space-y-1 p-2 lg:p-3">
          <SidebarAction icon={Plus} label={ku ? 'چاتی نوێ' : 'محادثة جديدة'} onClick={() => setActiveService('assistant')} />
          <SidebarAction icon={Search} label={ku ? 'گەڕان لە چاتەکان' : 'البحث في المحادثات'} />
          <SidebarAction icon={Folder} label={ku ? 'پڕۆژەکان' : 'المشاريع'} />
        </div>

        <div className="hidden px-4 pb-2 pt-3 text-[11px] font-black text-slate-500 dark:text-slate-400 lg:block">
          {ku ? 'خزمەتگوزارییەکان' : 'الخدمات'}
        </div>

        <nav className="no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3 lg:px-3">
          {services.map((service) => {
            const Icon = service.icon;
            const active = service.key === activeService;
            const label = lang === 'ar' ? service.label_ar : service.label_ku;

            return (
              <button
                key={service.key}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => setActiveService(service.key)}
                className={`flex h-11 w-full items-center justify-center rounded-xl transition-colors lg:justify-start lg:gap-3 lg:px-3 ${active ? 'bg-[#1F6FEB] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
                <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800 lg:p-3">
          <button type="button" className="flex h-11 w-full items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:justify-start lg:gap-3 lg:px-3">
            <div className="h-7 w-7 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{ku ? 'هەژماری من' : 'حسابي'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarAction({ icon: Icon, label, onClick }: { icon: typeof Plus; label: string; onClick?: () => void }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} className="flex h-11 w-full items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:justify-start lg:gap-3 lg:px-3">
      <Icon className="h-5 w-5 shrink-0" />
      <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{label}</span>
    </button>
  );
}
