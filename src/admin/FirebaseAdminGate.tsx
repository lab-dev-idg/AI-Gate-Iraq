import { useEffect, useState } from 'react';
import { ShieldCheck, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/src/components/AuthProvider';
import { auth, googleProvider, signInWithPopup, signOut, doc, getDoc, db } from '@/src/lib/firebase';

interface Props {
  onSuccess: () => void;
  onBackToApp: () => void;
}

interface AdminAccessRecord {
  active?: boolean;
  role?: 'owner' | 'admin' | 'editor' | 'viewer' | string;
}

function getLoginErrorMessage(code?: string): string {
  switch (code) {
    case 'auth/unauthorized-domain':
      return 'ئەم دۆمەینە لە Firebase Authentication ڕێگەپێنەدراوە. دۆمەینی Codespaces زیاد بکە لە Authorized domains.';
    case 'auth/popup-blocked':
      return 'پەنجەرەی چوونەژوورەوە لەلایەن وێبگەڕەوە بلۆک کراوە. Popup بۆ ئەم ماڵپەڕە ڕێگەپێبدە.';
    case 'auth/network-request-failed':
      return 'پەیوەندی بە Firebase Authentication سەرکەوتوو نەبوو. پەیوەندی تۆڕ پشکنین بکە.';
    case 'auth/operation-not-allowed':
      return 'چوونەژوورەوەی Google لە Firebase Authentication چالاک نەکراوە.';
    default:
      return 'چوونەژوورەوە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدەوە.';
  }
}

export function FirebaseAdminGate({ onSuccess, onBackToApp }: Props) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;

    const denyAccess = async (message?: string) => {
      sessionStorage.removeItem('ai-gate-iraq-admin-token');
      try {
        await signOut(auth);
      } catch {
        // Keep public responses generic and avoid exposing backend details.
      }
      if (!cancelled) {
        setError(message || 'ڕێگەپێدانی چوونەژوورەوە نییە. تکایە بە هەژماری ڕێگەپێدراو هەوڵ بدەوە.');
      }
    };

    const verify = async () => {
      setChecking(true);
      setError('');
      try {
        const snapshot = await getDoc(doc(db, 'adminUsers', user.uid));
        const data = snapshot.exists() ? (snapshot.data() as AdminAccessRecord) : null;
        const validRole = data?.role === 'owner' || data?.role === 'admin';

        if (!cancelled && data?.active === true && validRole) {
          const token = await user.getIdToken(true);
          sessionStorage.setItem('ai-gate-iraq-admin-token', token);
          onSuccess();
          return;
        }

        await denyAccess(
          snapshot.exists()
            ? 'هەژمارەکە هەیە، بەڵام active نییە یان role ـەکە owner/admin نییە.'
            : 'هەژمارەکەت لە adminUsers تۆمار نەکراوە.',
        );
      } catch (err: any) {
        const code = err?.code;
        await denyAccess(
          code === 'permission-denied'
            ? 'Firestore ڕێگە بە پشکنینی adminUsers نادات. Security Rules پشکنین بکە.'
            : 'پشکنینی ڕێگەپێدان سەرکەوتوو نەبوو.',
        );
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    void verify();
    return () => { cancelled = true; };
  }, [loading, user, onSuccess]);

  const login = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
      setError(getLoginErrorMessage(err?.code));
      console.error('Firebase admin sign-in failed.', { code: err?.code });
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
          <p className="text-xs text-slate-400">چوونەژوورەوەی پارێزراو بۆ بەڕێوەبەرانی ڕێگەپێدراو</p>
        </div>

        <Card className="bg-[#111827]/70 border border-slate-800 rounded-2xl p-6 space-y-5">
          {loading || checking ? (
            <div className="flex flex-col items-center gap-3 py-6 text-slate-300">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs">پشکنینی ناسنامە و ڕێگەپێدان...</span>
            </div>
          ) : (
            <Button onClick={login} className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">
              <LogIn className="w-4 h-4 ml-2" />
              چوونەژوورەوە بە Google
            </Button>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
