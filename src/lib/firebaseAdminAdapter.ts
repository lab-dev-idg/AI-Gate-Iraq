import { isFirebaseConfigured, db, doc, setDoc, getDoc, collection, addDoc, updateDoc } from './firebase';

/**
 * Safely synchronizes complete Super Admin config structures to the Firebase Firestore document 'adminConfig/global'.
 */
export async function syncAdminStateToFirestore(adminState: any): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  try {
    const docRef = doc(db, 'adminConfig', 'global');
    await setDoc(docRef, {
      ...adminState,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Firestore syncAdminStateToFirestore error:", error);
    return false;
  }
}

/**
 * Loads dynamic configurations previously synchronized inside Firestore collections.
 */
export async function loadAdminStateFromFirestore(): Promise<any | null> {
  if (!isFirebaseConfigured) {
    return null;
  }
  try {
    const docRef = doc(db, 'adminConfig', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("Firestore loadAdminStateFromFirestore error:", error);
    return null;
  }
}

/**
 * Saves a dynamic inquiry submission inside the centralizedFirestore database 'intakeItems'.
 */
export async function createFirebaseIntakeItem(item: any): Promise<string | null> {
  if (!isFirebaseConfigured) {
    return null;
  }
  try {
    const colRef = collection(db, 'intakeItems');
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createFirebaseIntakeItem error:", error);
    return null;
  }
}

/**
 * Updates properties of existing contact and intake items in Firestore.
 */
export async function updateFirebaseIntakeItem(id: string, patch: any): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  try {
    const docRef = doc(db, 'intakeItems', id);
    await updateDoc(docRef, {
      ...patch,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Firestore updateFirebaseIntakeItem error:", error);
    return false;
  }
}

/**
 * Creates administrative track log inside Firestore 'auditLogs' collection.
 */
export async function createFirebaseAuditLog(log: any): Promise<string | null> {
  if (!isFirebaseConfigured) {
    return null;
  }
  try {
    const colRef = collection(db, 'auditLogs');
    const docRef = await addDoc(colRef, {
      ...log,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore createFirebaseAuditLog error:", error);
    return null;
  }
}

/**
 * Safe client proxy placeholder to upload local pilot uploads to Firebase Cloud Storage.
 */
export async function uploadPilotAttachment(file: File, metadata?: any): Promise<{ url: string; path: string } | null> {
  if (!isFirebaseConfigured) {
    return null;
  }
  try {
    // In actual production setup, Firebase Storage SDK can be queried.
    // For this build, we return the planned folder organization.
    const path = `pilot-attachments/${Date.now()}_${file.name}`;
    const url = `https://firebasestorage.googleapis.com/v0/b/placeholder/o/${encodeURIComponent(path)}?alt=media`;
    return { url, path };
  } catch (error) {
    console.error("Firebase Storage uploadPilotAttachment error:", error);
    return null;
  }
}
