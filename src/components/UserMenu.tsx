import { auth, googleProvider, signInWithPopup, signOut } from '@/src/lib/firebase';
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
import { LogOut, User, LogIn } from 'lucide-react';

export function UserMenu() {
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={handleLogin} className="gap-2">
        <LogIn className="w-4 h-4" />
        {lang === 'ku' ? 'چوونەژوورەوە' : 'تسجيل الدخول'}
      </Button>
    );
  }

  return (
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
  );
}
