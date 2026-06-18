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

  return (
    <aside className="h-full w-[68px] shrink-0 border-e border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1220] md:w-[76px] lg:w-[280px]">
      <div className="flex h-full flex-col">
        <div className="hidden border-b border-slate-200 px-4 py-4 dark:border-slate-800 lg:block">
          <p className="text-xs font-black text-slate-800 dark:text-white">
            {lang === 'ar' ? 'الخدمات الذكية' : 'خزمەتگوزارییە زیرەکەکان'}
          </p>
          <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
            AI Gate Iraq
          </p>
        </div>

        <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-2 lg:p-3">
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
                className={`flex h-12 w-full items-center justify-center rounded-xl transition-colors lg:justify-start lg:gap-3 lg:px-3 ${
                  active
                    ? 'bg-[#1F6FEB] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
                <span className="hidden min-w-0 truncate text-sm font-bold lg:block">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
