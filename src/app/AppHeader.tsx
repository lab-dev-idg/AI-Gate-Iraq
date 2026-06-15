import { Globe, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeedbackDialog } from '@/src/components/FeedbackDialog';
import { UserMenu } from '@/src/components/UserMenu';

interface AppHeaderProps {
  lang: 'ku' | 'ar';
  setLang: (lang: 'ku' | 'ar') => void;
  t: any;
  children?: React.ReactNode;
}

export const AppHeader = ({ lang, setLang, t, children }: AppHeaderProps) => {
  return (
    <header className="shrink-0 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm z-10 transition-colors duration-300 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 min-h-16 py-2 flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-105 shrink-0">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-arabic leading-tight min-w-0">
              <span className="truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">{t.app.title}</span>
              <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0">PRO</span>
            </h1>
            <p className="hidden sm:block text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate max-w-[240px] md:max-w-none">{t.app.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-3 shrink-0 min-w-0 overflow-x-auto no-scrollbar max-w-[68vw] sm:max-w-none">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
            <Button
              variant={lang === 'ku' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLang('ku')}
              className="h-8 px-2.5 sm:px-3 text-[10px] font-bold rounded-md transition-all whitespace-nowrap"
            >
              Kurdî
            </Button>
            <Button
              variant={lang === 'ar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLang('ar')}
              className="h-8 px-2.5 sm:px-3 text-[10px] font-bold rounded-md transition-all whitespace-nowrap"
            >
              عربي
            </Button>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1.5" />
              {t.app.systemActive}
            </Badge>
          </div>
          {children}
          <UserMenu />
          <FeedbackDialog />
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;