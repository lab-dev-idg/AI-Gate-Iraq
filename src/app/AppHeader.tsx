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
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-105">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 sm:gap-1.5 font-arabic whitespace-nowrap leading-tight">
              {t.app.title}
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans px-1.5 py-0.5 rounded-full font-bold">PRO</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider leading-none mt-0.5">{t.app.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <Button 
              variant={lang === 'ku' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ku')}
              className="h-6 sm:h-7 px-2 sm:px-3 text-[9px] sm:text-[10px] font-bold rounded-md transition-all shrink-0"
            >
              Kurdî
            </Button>
            <Button 
              variant={lang === 'ar' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ar')}
              className="h-6 sm:h-7 px-2 sm:px-3 text-[9px] sm:text-[10px] font-bold rounded-md transition-all shrink-0"
            >
              عربي
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-3 ml-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 flex items-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1.5" />
              {t.app.systemActive}
            </Badge>
          </div>
          {children}
          <UserMenu />
          <FeedbackDialog />
          <div className="hidden lg:flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="w-4 h-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Mail className="w-4 h-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
