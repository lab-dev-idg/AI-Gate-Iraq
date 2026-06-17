import { useEffect, useState } from 'react';
import { ShieldCheck, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/src/components/AuthProvider';
import { auth, googleProvider, signInWithPopup, doc, getDoc, db } from '@/src/lib/firebase';

interface Props {
  onSuccess: () => void;
  onBackToApp: () => void;
}

export function FirebaseAdminGate({ onSuccess, onBackToApp }: Props) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;

    const verify = async () => {
      setChecking(true);
      setError('');
      try {
        const snapshot = await getDoc(doc(db, 'adminUsers', user.uid));
        const data = snapshot.exists() ? snapshot.data() : null;
        const validRole = data?.role === 'owner' || data?.role === 'admin';
        if (!cancelled && data?.active === true && validRole) onSuccess();
        else if (!cancelled) setError('ئەم هەژمارە ڕێگەپێدانی سەرپەرشتیاری نییە.');
      } catch (err: any) {
        if (!cancelled) setError(`پشکنین سەرکەوتوو نەبوو: ${err?.message || err}`);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [loading, user, onSuccess]);

  const login = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(`چوونەژوورەوە سەرکەوتوو نەبوو: ${err?.message || err}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090D16] text-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black">دەروازەی سەرپەرشتیار</h1>
          <p className="text-xs text-slate-400">پشکنینی Firebase Authentication و adminUsers</p>
        </div>

        <Card className="bg-[#111827]/70 border border-slate-800 rounded-2xl p-6 space-y-5">
          {loading || checking ? (
            <div className="flex flex-col items-center gap-3 py-6 text-slate-300">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs">پشکنینی ناسنامە و ڕێگەپێدان...</span>
            </div>
          ) : !user ? (
            <Button onClick={login} className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">
              <LogIn className="w-4 h-4 ml-2" />
              چوونەژوورەوە بە Google
            </Button>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-slate-200">{user.displayName || user.email}</p>
              <p className="text-[10px] text-slate-500 font-mono break-all">{user.uid}</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </Card>

        <div className="text-center">
          <button onClick={onBackToApp} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400">
            <ArrowLeft className="w-4 h-4" />
            گەڕانەوە بۆ خزمەتگوزارییەکان
          </button>
        </div>
      </div>
    </div>
  );
}
