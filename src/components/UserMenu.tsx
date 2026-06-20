import { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut, getFirebaseStatus } from '@/src/lib/firebase';
import { useAuth } from '@/src/components/AuthProvider';
import { useLanguage } from '@/src/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, LogIn, AlertTriangle, Copy, Check, ExternalLink, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserMenuProps {
  variant?: 'header' | 'sidebar';
  expanded?: boolean;
}

export function UserMenu({ variant = 'header', expanded = false }: UserMenuProps) {
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();
  const [errorDetails, setErrorDetails] = useState<{ code: string; message: string; domain: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const isSidebar = variant === 'sidebar';

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login failed:', error);
      const errMessage = error?.message || '';
      const errCode = error?.code || '';

      if (errCode === 'auth/unauthorized-domain' || errMessage.includes('unauthorized-domain')) {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
        setErrorDetails({
          code: errCode,
          message: errMessage,
          domain: currentDomain,
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return isSidebar ? (
      <div className="flex h-12 w-full items-center justify-center gap-3 rounded-xl px-3 lg:justify-start">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="hidden h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700 lg:block" />
      </div>
    ) : (
      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
    );
  }

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseStatus = getFirebaseStatus();
  const consoleUrl = `https://console.firebase.google.com/project/${firebaseStatus.projectId}/authentication/settings`;
  const accountName = user?.displayName || user?.email || (lang === 'ku' ? 'هەژماری من' : 'حسابي');

  const sidebarButtonClass = 'flex h-12 w-full items-center justify-center rounded-xl px-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:justify-start lg:gap-3 lg:px-3';

  return (
    <>
      {!user ? (
        isSidebar ? (
          <button type="button" onClick={handleLogin} className={sidebarButtonClass}>
            <LogIn className="h-5 w-5 shrink-0" />
            <span className={`${expanded ? 'block' : 'hidden lg:block'} text-sm font-black`}>
              {lang === 'ku' ? 'چوونەژوورەوە' : 'تسجيل الدخول'}
            </span>
          </button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            {lang === 'ku' ? 'چوونەژوورەوە' : 'تسجيل الدخول'}
          </Button>
        )
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              isSidebar ? (
                <button type="button" title={accountName} className={sidebarButtonClass}>
                  <Avatar className="h-8 w-8 shrink-0 border border-slate-200 dark:border-slate-700">
                    <AvatarImage src={user.photoURL || undefined} alt={accountName} referrerPolicy="no-referrer" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className={`${expanded ? 'flex' : 'hidden lg:flex'} min-w-0 flex-1 flex-col items-start text-right`}>
                    <span className="w-full truncate text-sm font-black">{accountName}</span>
                    <span className="w-full truncate text-[10px] text-slate-500 dark:text-slate-400">{user.email}</span>
                  </div>
                  <ChevronUp className={`${expanded ? 'block' : 'hidden lg:block'} h-4 w-4 shrink-0 text-slate-400`} />
                </button>
              ) : (
                <button type="button" className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border shadow-sm outline-none transition-opacity hover:opacity-80">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.photoURL || undefined} alt={accountName} />
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                </button>
              )
            }
          />
          <DropdownMenuContent
            className="w-72 rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#101827] dark:text-slate-100"
            align={isSidebar ? 'start' : 'end'}
            side={isSidebar ? 'top' : 'bottom'}
            sideOffset={8}
            dir="rtl"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
                <Avatar className="h-11 w-11 shrink-0 border border-slate-200 dark:border-slate-700">
                  <AvatarImage src={user.photoURL || undefined} alt={accountName} referrerPolicy="no-referrer" />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1 text-right">
                  <p className="truncate text-sm font-black">{accountName}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-red-500">
              <LogOut className="h-4 w-4" />
              <span>{t.profile?.logout || 'دەرچوون'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={!!errorDetails} onOpenChange={(open) => !open && setErrorDetails(null)}>
        <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="flex flex-row-reverse items-center justify-start gap-2 text-lg font-bold text-rose-500 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{lang === 'ku' ? 'هەڵەی ڕێگەپێدانی دۆمەین (Firebase)' : 'خطأ النطاق غير المعتمد (Firebase)'}</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-right text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {lang === 'ku' ? 'ئەم دۆمەینەی ئێستا بەکاریدێنیت هێشتا ڕێگەپێدراو نەکراوە بۆ چوونەژوورەوە.' : 'النطاق الذي تستخدمه حالياً غير مدرج ضمن النطاقات المصرح بها.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2 rounded-xl border border-rose-500/10 bg-rose-500/5 p-3.5">
              <h4 className="text-right text-xs font-bold text-slate-800 dark:text-slate-200">
                {lang === 'ku' ? 'ئەم دۆمەینە کۆپی بکە:' : 'انسخ هذا النطاق:'}
              </h4>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50 p-2.5 dark:border-slate-800/80 dark:bg-slate-950/60">
                <code className="flex-1 select-all break-all text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{currentDomain}</code>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(currentDomain)} className="h-8 shrink-0 px-2">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-500" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
            <a href={consoleUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 flex-grow items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600">
              {lang === 'ku' ? 'کردنەوەی Firebase' : 'فتح Firebase'}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button variant="outline" onClick={() => setErrorDetails(null)} className="h-10 rounded-xl text-xs">
              {lang === 'ku' ? 'داخستن' : 'إغلاق'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
