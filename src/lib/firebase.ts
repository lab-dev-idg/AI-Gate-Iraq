import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup as realSignInWithPopup, signOut as realSignOut, onAuthStateChanged as realOnAuthStateChanged, User } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, doc as realDoc, setDoc as realSetDoc, getDoc as realGetDoc, updateDoc as realUpdateDoc, collection as realCollection, query as realQuery, where as realWhere, onSnapshot as realOnSnapshot, addDoc as realAddDoc, serverTimestamp as realServerTimestamp, orderBy as realOrderBy, limit as realLimit } from 'firebase/firestore';

// 1. Read Firebase web config from Vite environment variables (or fallback)
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

export const isFirebaseConfigured = !!(apiKey && projectId && appId);

if (!isFirebaseConfigured && import.meta.env.DEV) {
  console.warn("Firebase is not configured. Running in local pilot mode.");
}

export let firebaseApp: any = null;
export let firebaseAuth: any = null;
export let firebaseDb: any = null;
export let firebaseStorage: any = null;

// Lowercase exports for active code alignment
export let auth: any = null;
export let db: any = null;
export let googleProvider: any = null;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

if (isFirebaseConfigured) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = initializeFirestore(firebaseApp, {
      localCache: memoryLocalCache()
    });
    auth = firebaseAuth;
    db = firebaseDb;
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Failed to initialize active Firebase client", error);
  }
}

// Local pilot mode fallback helpers for authentication
let pilotUserListeners: ((user: any) => void)[] = [];

const getStoredPilotUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = sessionStorage.getItem('ai-gate-iraq-pilot-user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const setStoredPilotUser = (user: any | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      sessionStorage.setItem('ai-gate-iraq-pilot-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('ai-gate-iraq-pilot-user');
    }
  } catch (e) {}
};

const notifyPilotListeners = (user: any | null) => {
  pilotUserListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error("Error notifying auth listener:", e);
    }
  });
};

const createMockPilotUser = () => ({
  uid: 'pilot-user-123',
  email: 'pilot@aigateiraq.get',
  displayName: 'مێهوانی تاقیکاری (Pilot Guest)',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: "mock-refresh-token",
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => "mock-id-token",
  getIdTokenResult: async () => ({ token: "mock-id-token", expirationTime: "max", authTime: "now", issuedAtTime: "now", signInProvider: "google.com", claims: {} }),
  reload: async () => {},
  toJSON: () => ({})
});

// Formally requested exports
export { firebaseApp as app };

// Guarded functional proxies to prevent crashes when not configured
export const signInWithPopup = async (authObj: any, providerObj: any) => {
  if (isFirebaseConfigured) {
    return realSignInWithPopup(authObj, providerObj);
  }
  
  // Non-obstructive pilot simulation
  const mockUser = createMockPilotUser();
  setStoredPilotUser(mockUser);
  notifyPilotListeners(mockUser);
  return { user: mockUser };
};

export const signOut = async (authObj: any) => {
  if (isFirebaseConfigured) {
    return realSignOut(authObj);
  }
  
  setStoredPilotUser(null);
  notifyPilotListeners(null);
  return Promise.resolve();
};

export const onAuthStateChanged = (authObj: any, next: (user: any) => void) => {
  if (isFirebaseConfigured) {
    return realOnAuthStateChanged(authObj, next);
  }
  
  pilotUserListeners.push(next);
  // Immediately sync with the current stored mock state
  const activeUser = getStoredPilotUser();
  next(activeUser);
  
  // Return unsubscribe handle
  return () => {
    pilotUserListeners = pilotUserListeners.filter(l => l !== next);
  };
};

export const doc = (dbObj: any, path: string, ...pathSegments: string[]) => {
  if (isFirebaseConfigured) {
    return realDoc(dbObj, path, ...pathSegments);
  }
  return { type: 'document', path, pathSegments };
};

export const collection = (dbObj: any, path: string) => {
  if (isFirebaseConfigured) {
    return realCollection(dbObj, path);
  }
  return { type: 'collection', path };
};

export const getDoc = async (docRef: any) => {
  if (isFirebaseConfigured) {
    return realGetDoc(docRef);
  }
  return {
    exists: () => false,
    data: () => null
  };
};

export const setDoc = async (docRef: any, data: any) => {
  if (isFirebaseConfigured) {
    return realSetDoc(docRef, data);
  }
  return Promise.resolve();
};

export const updateDoc = async (docRef: any, data: any) => {
  if (isFirebaseConfigured) {
    return realUpdateDoc(docRef, data);
  }
  return Promise.resolve();
};

export const addDoc = async (colRef: any, data: any) => {
  if (isFirebaseConfigured) {
    return realAddDoc(colRef, data);
  }
  return Promise.resolve({ id: `mock-${Date.now()}` });
};

export const query = (colRef: any, ...queryConsts: any[]) => {
  if (isFirebaseConfigured) {
    return realQuery(colRef, ...queryConsts);
  }
  return { type: 'query', colRef };
};

export const where = (field: string, op: string, val: any) => {
  if (isFirebaseConfigured) {
    return realWhere(field, op as any, val);
  }
  return { type: 'where', field, op, val };
};

export const orderBy = (field: string, direction?: 'asc' | 'desc') => {
  if (isFirebaseConfigured) {
    return realOrderBy(field, direction);
  }
  return { type: 'orderBy', field, direction };
};

export const limit = (num: number) => {
  if (isFirebaseConfigured) {
    return realLimit(num);
  }
  return { type: 'limit', num };
};

export const onSnapshot = (queryObj: any, next: (snap: any) => void) => {
  if (isFirebaseConfigured) {
    return realOnSnapshot(queryObj, next);
  }
  // Return dummy snap or nothing, call immediately representing empty
  next({ docs: [], size: 0, forEach: () => {} });
  return () => {};
};

export const serverTimestamp = () => {
  if (isFirebaseConfigured) {
    return realServerTimestamp();
  }
  return new Date().toISOString();
};

interface FirebaseStatus {
  isConfigured: boolean;
  projectId: string;
}

export const getFirebaseStatus = (): FirebaseStatus => {
  return {
    isConfigured: isFirebaseConfigured,
    projectId: projectId || ''
  };
};

export type { User };
