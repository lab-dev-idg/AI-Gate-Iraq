import { Crown, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from '@/src/components/FeedbackDialog';
import { RuntimeLanguage } from '@/src/lib/LanguageContext';

interface AppHeaderProps {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
  t: any;
  children?: React.ReactNode;
}

export const AppHeader = ({ lang, setLang, children }: AppHeaderProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    const shareText = lang === 'ar'
      ? 'منصة AI Gate Iraq للذكاء التجاري والخدمات اللوجستية.'
      : lang === 'en'
        ? 'AI Gate Iraq — smart trade and logistics for Iraq.'
        : 'پلاتفۆرمی AI Gate Iraq بۆ زیرەکی بازرگانی و خزمەتگوزاریی لۆجیستی.';

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'AI Gate Iraq', text: shareText, url });
        toast.success(lang === 'ar' ? 'تمت المشاركة بنجاح.' : lang === 'en' ? 'Shared successfully.' : 'بە سەرکەوتوویی هاوبەش کرا.');
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success(lang === 'ar' ? 'تم نسخ رابط المنصة.' : lang === 'en' ? 'Platform link copied.' : 'بەستەری پلاتفۆرمەکە کۆپی کرا.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast.error(lang === 'ar' ? 'تعذرت المشاركة. حاول مرة أخرى.' : lang === 'en' ? 'Unable to share. Please try again.' : 'هاوبەشکردن سەرکەوتوو نەبوو؛ دووبارە هەوڵ بدەرەوە.');
    }
  };

  const adminLabel = lang === 'ar' ? 'الإدارة' : lang === 'en' ? 'Admin' : 'ئادمین';
  const shareLabel = lang === 'ar' ? 'مشاركة' : lang === 'en' ? 'Share' : 'هاوبەشکردن';

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#081426]">
      <div className="flex h-14 items-center gap-2 px-2 sm:px-4 lg:px-5">
        <div className="flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1 text-slate-900 dark:text-white sm:px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-sm shadow-blue-600/30">AI</div>
          <span className="whitespace-nowrap text-xs font-black tracking-tight sm:text-sm lg:text-base">AI Gate Iraq</span>
          <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-400/20 via-amber-300/10 to-yellow-200/20 px-2 text-[9px] font-black text-amber-700 shadow-sm shadow-amber-500/10 dark:border-amber-300/35 dark:from-amber-300/15 dark:via-amber-200/10 dark:to-yellow-200/10 dark:text-amber-200 sm:h-7 sm:px-2.5 sm:text-[10px]" aria-label={lang === 'ar' ? 'إصدار احترافي' : lang === 'en' ? 'Professional edition' : 'وەشانی پڕۆفشناڵ'} title="AI Gate Iraq Pro">
            <Crown className="h-3 w-3" aria-hidden="true" />
            <span>PRO</span>
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <div className="hidden md:block">{children}</div>
          <a href="/admin" className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 text-[10px] font-black text-amber-700 transition-colors hover:bg-amber-500 hover:text-white dark:text-amber-300 sm:px-3 sm:text-xs" aria-label={adminLabel} title={adminLabel}>
            {adminLabel}
          </a>
          <Button type="button" variant="ghost" size="sm" onClick={() => void handleShare()} aria-label={shareLabel} title={shareLabel} className="flex h-9 shrink-0 gap-2 rounded-lg px-2 text-xs font-black text-slate-800 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-700 sm:px-3">
            <Share2 className="h-4 w-4" />
            <span className="hidden lg:inline">{shareLabel}</span>
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

function LanguageSwitcher({ lang, setLang }: { lang: RuntimeLanguage; setLang: (lang: RuntimeLanguage) => void }) {
  return (
    <div className="flex h-9 shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-[#111D31]" aria-label="Language selector">
      <Button variant={lang === 'ku' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ku')} className="h-7 min-w-[42px] rounded-md px-1.5 text-[9px] font-black sm:min-w-[48px] sm:px-2 sm:text-[10px]">Kurdî</Button>
      <Button variant={lang === 'ar' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('ar')} className="h-7 min-w-[38px] rounded-md px-1.5 text-[9px] font-black sm:min-w-[44px] sm:px-2 sm:text-[10px]">عربي</Button>
      <Button variant={lang === 'en' ? 'default' : 'ghost'} size="sm" onClick={() => setLang('en')} className="h-7 min-w-[34px] rounded-md px-1.5 text-[9px] font-black sm:min-w-[40px] sm:px-2 sm:text-[10px]">EN</Button>
    </div>
  );
}

export default AppHeader;
