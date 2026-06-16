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
    <div className="lg:hidden shrink-0 w-full max-w-full min-w-0 overflow-hidden border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="w-full max-w-full min-w-0 overflow-x-auto no-scrollbar scroll-smooth px-2 py-2 flex flex-nowrap gap-2 items-center">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          const isActive = activeService === srv.key;
          return (
            <Button
              key={srv.key}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveService(srv.key)}
              className={`inline-flex items-center justify-center gap-2 min-h-9 h-9 px-3 rounded-full text-[11px] font-black font-arabic shrink-0 whitespace-nowrap min-w-max max-w-[220px] ${
                isActive
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : srv.color}`} />
              <span className="truncate">{lang === 'ar' ? srv.label_ar : srv.label_ku}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileServiceNav;