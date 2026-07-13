import { memo } from 'react';
import { Crown } from 'lucide-react';
import type { RuntimeLanguage } from '@/src/lib/LanguageContext';

interface AppBrandProps {
  lang: RuntimeLanguage;
}

function AppBrand({ lang }: AppBrandProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-1 py-1 text-slate-900 dark:text-white sm:px-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-sm shadow-blue-600/30">AI</div>
      <span className="min-w-0 truncate text-xs font-black tracking-tight sm:text-sm lg:text-base">AI Gate Iraq</span>
      <span
        className="hidden h-6 shrink-0 items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/15 px-2 text-[9px] font-black text-amber-700 shadow-sm shadow-amber-500/10 dark:border-amber-300/35 dark:bg-amber-300/10 dark:text-amber-200 sm:inline-flex sm:h-7 sm:px-2.5 sm:text-[10px]"
        aria-label={lang === 'ar' ? 'إصدار احترافي' : lang === 'en' ? 'Professional edition' : 'وەشانی پڕۆفشناڵ'}
        title="AI Gate Iraq Pro"
      >
        <Crown className="h-3 w-3" aria-hidden="true" />
        <span>PRO</span>
      </span>
    </div>
  );
}

export default memo(AppBrand);
