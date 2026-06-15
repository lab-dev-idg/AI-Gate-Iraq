import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SERVICES, ServiceKey } from '@/src/lib/services';

interface AppSidebarProps {
  activeService: ServiceKey;
  setActiveService: (service: ServiceKey) => void;
  lang: 'ku' | 'ar';
  t: any;
}

export const AppSidebar = ({
  activeService,
  setActiveService,
  lang,
  t,
}: AppSidebarProps) => {
  return (
    <Card className="hidden lg:flex w-72 flex-col shrink-0 border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm h-full font-arabic">
      <div className="p-4 border-b border-rose-500/10 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950/20 dark:to-slate-900">
        <h3 className="text-xs uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
          {lang === 'ar' ? 'الخدمات الذكية' : 'خزمەتگوزارییە هۆشمەندەکان'}
        </h3>
        <p className="text-[10px] text-slate-500 leading-tight">
          {lang === 'ar' ? 'البوابة التجارية والاقتصادية للعراق ٢٠٢٦' : 'سەکۆی بازرگانی و گەشەپێدانی عێراق ٢٠٢٦'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 cs-scroll">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          const isActive = activeService === srv.key;
          return (
            <Button
              key={srv.key}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start text-right font-black rounded-xl text-xs py-3.5 h-auto transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => setActiveService(srv.key)}
            >
              <Icon className={`w-4 h-4 ml-2.5 shrink-0 ${isActive ? 'text-white' : srv.color}`} />
              <span>{lang === 'ar' ? srv.label_ar : srv.label_ku}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default AppSidebar;
