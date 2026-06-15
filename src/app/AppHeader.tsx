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
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-arabic">
              {t.app.title}
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans px-2 py-0.5 rounded-full font-bold">PRO</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.app.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border">
            <Button 
              variant={lang === 'ku' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ku')}
              className="h-7 px-3 text-[10px] font-bold rounded-md transition-all"
            >
              Kurdî
            </Button>
            <Button 
              variant={lang === 'ar' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setLang('ar')}
              className="h-7 px-3 text-[10px] font-bold rounded-md transition-all"
            >
              عربي
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-4 ml-4">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1.5" />
              {t.app.systemActive}
            </Badge>
          </div>
          {children}
          <UserMenu />
          <FeedbackDialog />
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
