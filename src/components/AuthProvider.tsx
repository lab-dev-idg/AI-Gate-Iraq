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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp(),
            });
          }

          setUser(firebaseUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Unable to synchronize the signed-in user profile.', error);
        setUser(firebaseUser || null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const requiresAccount = path !== '/' && path !== '/admin';

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {requiresAccount && (loading || !user) ? (
        <PlatformAccessGate loading={loading} />
      ) : (
        <>
          {children}
          {requiresAccount && user ? <TrialLimitDialog /> : null}
        </>
      )}
    </AuthContext.Provider>
  );
};
