import { Button } from '@/components/ui/button';
import { SERVICES, ServiceKey } from '@/src/lib/services';

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
  return (
    <div className="lg:hidden shrink-0 overflow-x-auto no-scrollbar scroll-smooth p-1 border-b border-slate-100 dark:border-slate-800/60 flex gap-1.5 items-center bg-slate-50/50 dark:bg-slate-900/40">
      {SERVICES.map((srv) => {
        const Icon = srv.icon;
        const isActive = activeService === srv.key;
        return (
          <Button
            key={srv.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveService(srv.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-black font-arabic shrink-0 ${
              isActive
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ml-1.5 shrink-0 ${isActive ? 'text-white' : srv.color}`} />
            <span>{lang === 'ar' ? srv.label_ar : srv.label_ku}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MobileServiceNav;
