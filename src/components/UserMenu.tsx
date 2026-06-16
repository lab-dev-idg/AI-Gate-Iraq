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
import { LogOut, User, LogIn, AlertTriangle, Copy, Check, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function UserMenu() {
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();
  const [errorDetails, setErrorDetails] = useState<{ code: string; message: string; domain: string } | null>(null);
  const [copied, setCopied] = useState(false);

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
    return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;
  }

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseStatus = getFirebaseStatus();
  const consoleUrl = `https://console.firebase.google.com/project/${firebaseStatus.projectId}/authentication/settings`;

  return (
    <>
      {!user ? (
        <Button variant="outline" size="sm" onClick={handleLogin} className="gap-2">
          <LogIn className="w-4 h-4" />
          {lang === 'ku' ? 'چوونەژوورەوە' : 'تسجيل الدخول'}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 w-10 rounded-full overflow-hidden border shadow-sm hover:opacity-80 transition-opacity cursor-pointer outline-none">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
              <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>{t.profile?.logout || 'دەرچوون'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={!!errorDetails} onOpenChange={(open) => !open && setErrorDetails(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-rose-500 dark:text-rose-400 font-arabic justify-start flex-row-reverse">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
              <span>
                {lang === 'ku' ? 'هەڵەی ڕێگەپێدانی دۆمەین (Firebase)' : 'خطأ النطاق غير المعتمد (Firebase)'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2 text-right leading-relaxed text-xs">
              {lang === 'ku' ? 'ئەم دۆمەینەی ئێستا بەکاریدێنیت هێشتا ڕێگەپێدراو نەکراوە بۆ چوونەژوورەوە لە فایەربەیسی ئەم ئەپەدا.' : 'النطاق (Domain) الذي تستخدمه حالياً غير مدرج ضمن النطاقات المصرح بها لمشروع Firebase الخاص بهذا التطبيق.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 text-right">
                {lang === 'ku' ? '١. ئەم دۆمەینە کۆپی بکە:' : '١. يرجى نسخ هذا النطاق من هنا:'}
              </h4>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                <code className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all flex-1 text-center font-semibold select-all">
                  {currentDomain}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleCopy(currentDomain)} 
                  className="h-8 px-2 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-850"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                </Button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800 space-y-2 rounded-xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <p className="text-right">
                {lang === 'ku' ? '٢. بچۆ کەتنیۆ پڕۆڤایدەرەکانی فایەربەیس و لە ژێر نیشانەی چوونەژوورەوەی گووگڵ تابلۆی "Authorized Domains" دۆمەینەکە زیادبکە.' : '٢. انتقل إلى موفري المصادقة في وحدة تحكم Firebase، وتحت إعدادات Google الدخول اضغط على "النطاقات المصرح بها" (Authorized Domains) وقم بإضافته.'}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
            <a 
              href={consoleUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs gap-1.5 shadow-md shadow-emerald-500/10 flex items-center justify-center h-10 flex-grow cursor-pointer transition-all"
            >
              {lang === 'ku' ? 'کردنەوەی پەیجی فایەربەیس' : 'فتح صفحة التحكم بـ Firebase'}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Button 
              variant="outline" 
              onClick={() => setErrorDetails(null)}
              className="border-slate-200 dark:border-slate-800 rounded-xl text-xs h-10"
            >
              {lang === 'ku' ? 'داخستن' : 'إغلاق'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
