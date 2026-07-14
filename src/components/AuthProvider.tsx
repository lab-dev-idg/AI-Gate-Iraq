import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, User, doc, getDoc, setDoc, db, serverTimestamp } from '@/src/lib/firebase';
import PlatformAccessGate from '@/src/auth/PlatformAccessGate';
import TrialLimitDialog from '@/src/components/TrialLimitDialog';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

async function synchronizeUserProfile(firebaseUser: User): Promise<void> {
  const isPasswordUser = firebaseUser.providerData.some(
    (provider) => provider.providerId === 'password',
  );
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);
  const provider = firebaseUser.providerData[0]?.providerId || 'password';

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: 'user',
      status: isPasswordUser && !firebaseUser.emailVerified ? 'pending_verification' : 'active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      provider,
      language: localStorage.getItem('app-lang') || 'ku',
    }, { merge: false });
    return;
  }

  if (!isPasswordUser || firebaseUser.emailVerified) {
    await setDoc(userDocRef, {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      status: 'active',
      lastLogin: serverTimestamp(),
      provider,
    }, { merge: true });
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const isPasswordUser = firebaseUser.providerData.some(
        (provider) => provider.providerId === 'password',
      );
      const isUnverifiedPasswordUser = isPasswordUser && !firebaseUser.emailVerified;

      setUser(isUnverifiedPasswordUser ? null : firebaseUser);
      setLoading(false);

      void synchronizeUserProfile(firebaseUser).catch((error) => {
        console.error('Unable to synchronize the signed-in user profile.', error);
      });
    });

    return () => unsubscribe();
  }, []);

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const requiresAccount = path !== '/' && path !== '/admin';

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {requiresAccount && (loading || !user) ? (
        <PlatformAccessGate loading={loading} onAuthenticated={setUser} />
      ) : (
        <>
          {children}
          {requiresAccount && user ? <TrialLimitDialog /> : null}
        </>
      )}
    </AuthContext.Provider>
  );
};
