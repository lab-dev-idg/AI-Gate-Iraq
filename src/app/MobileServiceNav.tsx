import { Button } from '@/components/ui/button';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';

interface MobileServiceNavProps {
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  lang: 'ku' | 'ar';
}

export const MobileServiceNav = ({
  activeService,
  setActiveService,
  lang,
}: MobileServiceNavProps) => {
  const isInquiryEnabled = getAdminFeatureFlagEnabled('enable_inquiry_form', true);
  const visibleServices = SERVICES.filter(s => s.key !== 'inquiry' || isInquiryEnabled);

  return (
    <div className="min-[880px]:hidden shrink-0 overflow-x-auto no-scrollbar scroll-smooth p-1 border-b border-slate-100 dark:border-slate-800/60 flex gap-1.5 items-center bg-slate-50/50 dark:bg-slate-900/40">
      {visibleServices.map((srv) => {
        const Icon = srv.icon;
        const isActive = activeService === srv.key;
        return (
          <Button
            key={srv.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveService(srv.key)}
            className={`inline-flex items-center justify-center gap-2 min-h-[38px] px-4 py-2 rounded-full text-[11px] font-black font-arabic whitespace-nowrap shrink-0 transition-all ${
              isActive
                ? 'bg-primary border-primary text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : srv.color}`} />
            <span>{lang === 'ar' ? srv.label_ar : srv.label_ku}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MobileServiceNav;
