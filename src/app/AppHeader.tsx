import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { FeedbackDialog } from '@/src/components/FeedbackDialog';
import { RuntimeLanguage } from '@/src/lib/LanguageContext';
import AppBrand from '@/src/app/header/AppBrand';
import HeaderAdminButton from '@/src/app/header/HeaderAdminButton';
import HeaderShareButton from '@/src/app/header/HeaderShareButton';
import LanguageSwitcher from '@/src/app/header/LanguageSwitcher';

interface AppHeaderProps {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
  t: any;
  children?: ReactNode;
}

export const AppHeader = ({ lang, setLang, children }: AppHeaderProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    const shareText = lang === 'ar'
      ? 'منصة AI Gate Iraq للذكاء التجاري والخدمات اللوجستية.'
      : lang === 'en'
        ? 'AI Gate Iraq - smart trade and logistics for Iraq.'
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
      <div className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-2 py-2 sm:px-4 lg:px-5 xl:grid-cols-[auto_minmax(220px,1fr)_auto]">
        <div className="min-w-0 xl:order-1">
          <AppBrand lang={lang} />
        </div>

        <div className="hidden min-w-0 xl:order-2 xl:block">
          <div className="flex min-w-0 items-center justify-end overflow-hidden">
            {children}
          </div>
        </div>

        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-1.5 xl:order-3 xl:flex-nowrap">
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <HeaderAdminButton label={adminLabel} />
          <HeaderShareButton label={shareLabel} onShare={() => void handleShare()} />
          <FeedbackDialog compact />
        </div>
      </div>

      <div className="border-t border-slate-200 px-2 py-2 dark:border-slate-800 xl:hidden sm:px-4">
        <div className="no-scrollbar flex min-w-0 max-w-full items-center justify-end overflow-x-auto">
          {children}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
