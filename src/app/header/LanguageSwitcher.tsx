import { memo } from 'react';
import { Button } from '@/components/ui/button';
import type { RuntimeLanguage } from '@/src/lib/LanguageContext';

interface LanguageSwitcherProps {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
}

function LanguageSwitcher({ lang, setLang }: LanguageSwitcherProps) {
  return (
    <div className="flex h-9 max-w-full shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-[#111D31]" aria-label="Language selector">
      <Button variant={lang === 'ku' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ku')} className="h-7 min-w-8 rounded-md px-1 text-[9px] font-black sm:min-w-[48px] sm:px-2 sm:text-[10px]">
        <span className="hidden sm:inline">Kurdî</span>
        <span className="sm:hidden">KU</span>
      </Button>
      <Button variant={lang === 'ar' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ar')} className="h-7 min-w-8 rounded-md px-1 text-[9px] font-black sm:min-w-[44px] sm:px-2 sm:text-[10px]">
        <span className="hidden sm:inline">عربي</span>
        <span className="sm:hidden">AR</span>
      </Button>
      <Button variant={lang === 'en' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('en')} className="h-7 min-w-8 rounded-md px-1 text-[9px] font-black sm:min-w-[40px] sm:px-2 sm:text-[10px]">EN</Button>
    </div>
  );
}

export default memo(LanguageSwitcher);
