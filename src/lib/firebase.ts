import { initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as realSignInWithPopup,
  signInWithRedirect as realSignInWithRedirect,
  getRedirectResult as realGetRedirectResult,
  signInWithEmailAndPassword as realSignInWithEmailAndPassword,
  sendPasswordResetEmail as realSendPasswordResetEmail,
  signOut as realSignOut,
  onAuthStateChanged as realOnAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  doc as realDoc,
  setDoc as realSetDoc,
  getDoc as realGetDoc,
  updateDoc as realUpdateDoc,
  collection as realCollection,
  query as realQuery,
  where as realWhere,
  onSnapshot as realOnSnapshot,
  addDoc as realAddDoc,
  serverTimestamp as realServerTimestamp,
  orderBy as realOrderBy,
  limit as realLimit,
} from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
const recaptchaEnterpriseSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();

export const isFirebaseConfigured = Boolean(apiKey && authDomain && projectId && appId);
export const isAppCheckConfigured = Boolean(recaptchaEnterpriseSiteKey);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

export let firebaseApp: any = null;
export let firebaseAppCheck: any = null;
export let firebaseAuth: any = null;
export let firebaseDb: any = null;
export let firebaseStorage: any = null;
export let auth: any = null;
export let db: any = null;
export let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    firebaseApp = initializeApp(firebaseConfig);

    if (recaptchaEnterpriseSiteKey) {
      firebaseAppCheck = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } else {
      console.warn('Firebase App Check site key is not configured. Enforcement must remain disabled.');
    }

    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = initializeFirestore(firebaseApp, {
      localCache: memoryLocalCache(),
    });
    auth = firebaseAuth;
    db = firebaseDb;
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.warn('Firebase client initialization failed.', error);
  }
} else {
  console.warn('Firebase production configuration is incomplete. Cloud features are unavailable.');
}

export { firebaseApp as app };

function requireFirebase(service: string): void {
  if (!isFirebaseConfigured || !firebaseApp || !firebaseDb) {
    throw new Error(`FIREBASE_NOT_CONFIGURED:${service}`);
  }
}

function requireAuth(authObj: any): void {
  if (!isFirebaseConfigured || !authObj) {
    throw new Error('FIREBASE_AUTH_NOT_CONFIGURED');
  }
}

export const signInWithPopup = async (authObj: any, providerObj: any) => {
  requireAuth(authObj);
  if (!providerObj) throw new Error('FIREBASE_AUTH_PROVIDER_NOT_CONFIGURED');
  return realSignInWithPopup(authObj, providerObj);
};

export const signInWithRedirect = async (authObj: any, providerObj: any) => {
  requireAuth(authObj);
  if (!providerObj) throw new Error('FIREBASE_AUTH_PROVIDER_NOT_CONFIGURED');
  return realSignInWithRedirect(authObj, providerObj);
};

export const getRedirectResult = async (authObj: any) => {
  requireAuth(authObj);
  return realGetRedirectResult(authObj);
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  requireAuth(authObj);
  return realSignInWithEmailAndPassword(authObj, email, password);
};

export const sendPasswordResetEmail = async (authObj: any, email: string) => {
  requireAuth(authObj);
  return realSendPasswordResetEmail(authObj, email);
};

export const signOut = async (authObj: any) => {
  if (!isFirebaseConfigured || !authObj) return;
  await realSignOut(authObj);
};

export const onAuthStateChanged = (authObj: any, next: (user: any) => void) => {
  if (!isFirebaseConfigured || !authObj) {
    next(null);
    return () => undefined;
  }
  return realOnAuthStateChanged(authObj, next);
};

export const doc = (dbObj: any, path: string, ...pathSegments: string[]) => {
  requireFirebase('firestore.doc');
  return realDoc(dbObj, path, ...pathSegments);
};

export const collection = (dbObj: any, path: string) => {
  requireFirebase('firestore.collection');
  return realCollection(dbObj, path);
};

export const getDoc = async (docRef: any) => {
  requireFirebase('firestore.getDoc');
  return realGetDoc(docRef);
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  requireFirebase('firestore.setDoc');
  return options === undefined
    ? realSetDoc(docRef, data)
    : realSetDoc(docRef, data, options);
};

export const updateDoc = async (docRef: any, data: any) => {
  requireFirebase('firestore.updateDoc');
  return realUpdateDoc(docRef, data);
};

export const addDoc = async (colRef: any, data: any) => {
  requireFirebase('firestore.addDoc');
  return realAddDoc(colRef, data);
};

export const query = (colRef: any, ...queryConsts: any[]) => {
  requireFirebase('firestore.query');
  return realQuery(colRef, ...queryConsts);
};

export const where = (field: string, op: string, val: any) => {
  requireFirebase('firestore.where');
  return realWhere(field, op as any, val);
};

export const orderBy = (field: string, direction?: 'asc' | 'desc') => {
  requireFirebase('firestore.orderBy');
  return realOrderBy(field, direction);
};

export const limit = (num: number) => {
  requireFirebase('firestore.limit');
  return realLimit(num);
};

export const onSnapshot = (
  queryObj: any,
  next: (snap: any) => void,
  error?: (error: any) => void,
) => {
  requireFirebase('firestore.onSnapshot');
  return realOnSnapshot(queryObj, next, error);
};

export const serverTimestamp = () => {
  requireFirebase('firestore.serverTimestamp');
  return realServerTimestamp();
};

export interface FirebaseRuntimeStatus {
  configured: boolean;
  isConfigured: boolean;
  appCheckConfigured: boolean;
  projectId?: string;
  authDomain?: string;
  storageBucket?: string;
  mode: 'firebase' | 'unconfigured';
  messageKu: string;
}

export const getFirebaseStatus = (): FirebaseRuntimeStatus => {
  const configured = Boolean(isFirebaseConfigured && firebaseApp && firebaseAuth && firebaseDb);

  return {
    configured,
    isConfigured: configured,
    appCheckConfigured: Boolean(firebaseAppCheck),
    projectId: projectId || undefined,
    authDomain: authDomain || undefined,
    storageBucket: storageBucket || undefined,
    mode: configured ? 'firebase' : 'unconfigured',
    messageKu: configured
      ? 'فایەربەیس بە سەرکەوتوویی پەیوەستە.'
      : 'ڕێکخستنی فایەربەیس تەواو نییە؛ خزمەتگوزارییە هەورییەکان ناچالاکن.',
  };
};

export type { User };
