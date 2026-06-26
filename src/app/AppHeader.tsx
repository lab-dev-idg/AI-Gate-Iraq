import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from '@/src/components/FeedbackDialog';

interface AppHeaderProps {
  lang: 'ku' | 'ar';
  setLang: (lang: 'ku' | 'ar') => void;
  t: any;
  children?: React.ReactNode;
}

export const AppHeader = ({ lang, setLang, children }: AppHeaderProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'AI Gate Iraq',
      text: lang === 'ar'
        ? 'منصة AI Gate Iraq للذكاء التجاري والخدمات اللوجستية.'
        : 'پلاتفۆرمی AI Gate Iraq بۆ زیرەکی بازرگانی و خزمەتگوزاریی لۆجیستی.',
      url,
    };

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        toast.success(lang === 'ar' ? 'تمت المشاركة بنجاح.' : 'بە سەرکەوتوویی هاوبەش کرا.');
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success(lang === 'ar' ? 'تم نسخ رابط المنصة.' : 'بەستەری پلاتفۆرمەکە کۆپی کرا.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast.error(lang === 'ar' ? 'تعذرت المشاركة. حاول مرة أخرى.' : 'هاوبەشکردن سەرکەوتوو نەبوو؛ دووبارە هەوڵ بدەرەوە.');
    }
  };

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#081426]">
      <div className="flex h-14 items-center gap-2 px-2 sm:px-4 lg:px-5">
        <div className="flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1 text-slate-900 dark:text-white sm:px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-sm shadow-blue-600/30">
            AI
          </div>
          <span className="whitespace-nowrap text-xs font-black tracking-tight sm:text-sm lg:text-base">AI Gate Iraq</span>
          <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 md:inline">UI/UX 2026</span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <div className="hidden md:block">{children}</div>
          <a
            href="/admin"
            className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 text-[10px] font-black text-amber-700 transition-colors hover:bg-amber-500 hover:text-white dark:text-amber-300 sm:px-3 sm:text-xs"
            aria-label={lang === 'ar' ? 'تسجيل دخول الإدارة' : 'چوونەژوورەوەی ئادمین'}
            title={lang === 'ar' ? 'تسجيل دخول الإدارة' : 'چوونەژوورەوەی ئادمین'}
          >
            {lang === 'ar' ? 'الإدارة' : 'ئادمین'}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleShare()}
            aria-label={lang === 'ar' ? 'مشاركة المنصة' : 'هاوبەشکردنی پلاتفۆرم'}
            title={lang === 'ar' ? 'مشاركة المنصة' : 'هاوبەشکردنی پلاتفۆرم'}
            className="flex h-9 shrink-0 gap-2 rounded-lg px-2 text-xs font-black text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden lg:inline">{lang === 'ar' ? 'مشاركة' : 'هاوبەشکردن'}</span>
          </Button>
          <FeedbackDialog />
        </div>
      </div>

      <div className="border-t border-slate-200 px-3 py-2 dark:border-slate-800 md:hidden">
        <div className="min-w-0 w-full">{children}</div>
      </div>
    </header>
  );
};

function LanguageSwitcher({ lang, setLang }: { lang: 'ku' | 'ar'; setLang: (lang: 'ku' | 'ar') => void }) {
  return (
    <div className="flex h-9 shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-[#111D31]">
      <Button variant={lang === 'ku' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ku')} className="h-7 min-w-[46px] rounded-md px-2 text-[10px] font-black sm:min-w-[50px] sm:px-2.5">Kurdî</Button>
      <Button variant={lang === 'ar' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ar')} className="h-7 min-w-[40px] rounded-md px-2 text-[10px] font-black sm:min-w-[44px] sm:px-2.5">عربي</Button>
    </div>
  );
}

export default AppHeader;
