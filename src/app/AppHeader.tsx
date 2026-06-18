import { ChevronDown, MoreHorizontal, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#081426]">
      <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800">
            <span className="truncate text-sm font-black sm:text-base">{t.app.title}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
          </button>
          <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 sm:inline">PRO</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <div className="hidden md:block">{children}</div>
          <Button variant="ghost" size="sm" className="hidden h-9 gap-2 rounded-lg px-3 text-xs font-black text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex">
            <Share2 className="h-4 w-4" />
            {lang === 'ar' ? 'مشاركة' : 'هاوبەشکردن'}
          </Button>
          <FeedbackDialog />
          <div className="hidden sm:block"><UserMenu /></div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-800 md:hidden">
        <div className="min-w-0 flex-1">{children}</div>
        <UserMenu />
      </div>
    </header>
  );
};

function LanguageSwitcher({ lang, setLang }: { lang: 'ku' | 'ar'; setLang: (lang: 'ku' | 'ar') => void }) {
  return (
    <div className="flex h-9 shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-[#111D31]">
      <Button variant={lang === 'ku' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ku')} className="h-7 min-w-[50px] rounded-md px-2.5 text-[10px] font-black">Kurdî</Button>
      <Button variant={lang === 'ar' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ar')} className="h-7 min-w-[44px] rounded-md px-2.5 text-[10px] font-black">عربي</Button>
    </div>
  );
}

export default AppHeader;
