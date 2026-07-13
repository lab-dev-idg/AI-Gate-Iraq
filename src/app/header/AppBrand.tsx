import { memo } from 'react';
import { Crown } from 'lucide-react';
import type { RuntimeLanguage } from '@/src/lib/LanguageContext';
import BrandLogo from '@/src/components/BrandLogo';

interface AppBrandProps {
  lang: RuntimeLanguage;
}

function AppBrand({ lang }: AppBrandProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-1 py-1 text-slate-900 dark:text-white sm:px-2">
      <BrandLogo size={32} className="h-8 w-8 rounded-lg shadow-sm shadow-blue-600/20" eager />
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
