import { Button } from '@/components/ui/button';
import { SERVICES, ServiceKey } from '@/src/lib/services';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';

interface MobileServiceNavProps {
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  lang: 'ku' | 'ar';
}

export const MobileServiceNav = ({ activeService, setActiveService, lang }: MobileServiceNavProps) => {
  const isInquiryEnabled = getAdminFeatureFlagEnabled('enable_inquiry_form', true);
  const visibleServices = SERVICES.filter(service => service.key !== 'inquiry' || isInquiryEnabled);

  return (
    <nav className="mobile-service-nav min-[1024px]:hidden sticky top-[112px] z-30 -mx-3 shrink-0 border-y border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#081426]/95 sm:-mx-4 sm:px-4">
      <div className="no-scrollbar flex min-w-max snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-0.5">
        {visibleServices.map(service => {
          const Icon = service.icon;
          const isActive = activeService === service.key;
          return (
            <Button
              key={service.key}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveService(service.key)}
              className={`min-h-10 shrink-0 snap-start whitespace-nowrap rounded-full px-4 text-xs font-black transition-all ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/15'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#111D31] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : service.color}`} />
              <span>{lang === 'ar' ? service.label_ar : service.label_ku}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileServiceNav;
