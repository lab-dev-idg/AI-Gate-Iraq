import { Globe, Mail, Phone } from 'lucide-react';
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
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#081426]/95">
      <div className="app-container py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/10">
                <Globe className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h1 className="flex min-w-0 items-center gap-2 text-base font-black leading-tight text-slate-900 dark:text-white sm:text-lg">
                  <span className="truncate">{t.app.title}</span>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400">PRO</span>
                </h1>
                <p className="mt-1 line-clamp-1 text-[10px] font-semibold leading-tight text-slate-600 dark:text-slate-300 sm:text-xs">
                  {t.app.subtitle}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <LanguageSwitcher lang={lang} setLang={setLang} />
              <UserMenu />
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
            <div className="hidden lg:block">
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </div>

            <Badge variant="outline" className="hidden h-9 items-center gap-2 rounded-xl border-emerald-500/25 bg-emerald-500/10 px-3 text-xs font-black text-emerald-700 dark:text-emerald-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t.app.systemActive}
            </Badge>

            <div className="min-w-0">{children}</div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => { window.location.href = '/admin'; }}
              className="h-9 shrink-0 rounded-xl border-slate-300 bg-slate-50 px-3 text-xs font-black text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#111D31] dark:text-slate-100 dark:hover:bg-slate-800"
            >
              ئادمین
            </Button>

            <div className="hidden lg:block"><UserMenu /></div>
            <FeedbackDialog />

            <div className="hidden items-center gap-1 xl:flex">
              <Button variant="ghost" size="icon" className="h-9 w-9"><Phone className="h-4 w-4 text-slate-500 dark:text-slate-300" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9"><Mail className="h-4 w-4 text-slate-500 dark:text-slate-300" /></Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

function LanguageSwitcher({ lang, setLang }: { lang: 'ku' | 'ar'; setLang: (lang: 'ku' | 'ar') => void }) {
  return (
    <div className="flex h-9 shrink-0 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-[#111D31]">
      <Button variant={lang === 'ku' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ku')} className="h-7 min-w-[56px] rounded-lg px-3 text-[10px] font-black">Kurdî</Button>
      <Button variant={lang === 'ar' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ar')} className="h-7 min-w-[48px] rounded-lg px-3 text-[10px] font-black">عربي</Button>
    </div>
  );
}

export default AppHeader;
