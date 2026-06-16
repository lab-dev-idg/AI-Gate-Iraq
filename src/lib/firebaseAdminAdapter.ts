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
    console.warn("Firestore syncAdminStateToFirestore warning:", error);
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
    console.warn("Firestore loadAdminStateFromFirestore warning:", error);
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
    console.warn("Firestore createFirebaseIntakeItem warning:", error);
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
    console.warn("Firestore updateFirebaseIntakeItem warning:", error);
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
    console.warn("Firestore createFirebaseAuditLog warning:", error);
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
    console.warn("Firebase Storage uploadPilotAttachment warning:", error);
    return null;
  }
}

/**
 * Synchronize feature flags to Firestore.
 */
export async function syncFeatureFlagsToFirestore(flags: any[]): Promise<{ ok: boolean; mode?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: 'local_pilot', messageKu: 'فایەربەیس چالاک نییە؛ هاوکاتکردن نەکرا.' };
  }
  try {
    for (const flag of flags) {
      if (!flag.key) continue;
      const docRef = doc(db, 'featureFlags', flag.key);
      await setDoc(docRef, { ...flag, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return { ok: true, messageKu: 'هاوکاتکردنی فلوگەکانی تایبەتمەندی بە سەرکەوتوویی ئەنجامدرا.' };
  } catch (error: any) {
    console.warn("syncFeatureFlagsToFirestore warning:", error);
    return { ok: false, messageKu: `هاوکاتکردنی فلوگەکانی تایبەتمەندی سەرکەوتوو نەبوو: ${error.message || error}` };
  }
}

/**
 * Synchronize service configurations to Firestore.
 */
export async function syncServiceConfigsToFirestore(services: any[]): Promise<{ ok: boolean; mode?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: 'local_pilot', messageKu: 'فایەربەیس چالاک نییە؛ هاوکاتکردن نەکرا.' };
  }
  try {
    for (const service of services) {
      if (!service.key) continue;
      const docRef = doc(db, 'serviceConfigs', service.key);
      await setDoc(docRef, { ...service, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return { ok: true, messageKu: 'هاوکاتکردنی ڕێکخستنەکانی خزمەتگوزاری بە سەرکەوتوویی ئەنجامدرا.' };
  } catch (error: any) {
    console.warn("syncServiceConfigsToFirestore warning:", error);
    return { ok: false, messageKu: `هاوکاتکردنی خزمەتگوزارییەکان سەرکەوتوو نەبوو: ${error.message || error}` };
  }
}

/**
 * Synchronize prompt configurations to Firestore.
 */
export async function syncPromptConfigsToFirestore(prompts: any[]): Promise<{ ok: boolean; mode?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: 'local_pilot', messageKu: 'فایەربەیس چالاک نییە؛ هاوکاتکردن نەکرا.' };
  }
  try {
    for (const promptItem of prompts) {
      if (!promptItem.id) continue;
      const docRef = doc(db, 'promptConfigs', promptItem.id);
      await setDoc(docRef, { ...promptItem, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return { ok: true, messageKu: 'هاوکاتکردنی ڕێنمایییەکان بە سەرکەوتوویی ئەنجامدرا.' };
  } catch (error: any) {
    console.warn("syncPromptConfigsToFirestore warning:", error);
    return { ok: false, messageKu: `هاوکاتکردنی ڕێنمایییەکان سەرکەوتوو نەبوو: ${error.message || error}` };
  }
}

/**
 * Synchronize workflow steps to Firestore.
 */
export async function syncWorkflowStepsToFirestore(steps: any[]): Promise<{ ok: boolean; mode?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: 'local_pilot', messageKu: 'فایەربەیس چالاک نییە؛ هاوکاتکردن نەکرا.' };
  }
  try {
    for (const step of steps) {
      if (!step.id) continue;
      const docRef = doc(db, 'workflowSteps', step.id);
      await setDoc(docRef, { ...step, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return { ok: true, messageKu: 'هاوکاتکردنی هەنگاوەکانی کار بە سەرکەوتوویی ئەنجامدرا.' };
  } catch (error: any) {
    console.warn("syncWorkflowStepsToFirestore warning:", error);
    return { ok: false, messageKu: `هاوکاتکردنی هەنگاوەکانی کار سەرکەوتوو نەبوو: ${error.message || error}` };
  }
}

/**
 * Synchronize content sections to Firestore.
 */
export async function syncContentSectionsToFirestore(sections: any[]): Promise<{ ok: boolean; mode?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, mode: 'local_pilot', messageKu: 'فایەربەیس چالاک نییە؛ هاوکاتکردن نەکرا.' };
  }
  try {
    for (const section of sections) {
      const id = section.id || section.sectionId;
      if (!id) continue;
      const docRef = doc(db, 'contentSections', id);
      await setDoc(docRef, { ...section, sectionId: id, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return { ok: true, messageKu: 'هاوکاتکردنی بەشەکانی ناوەڕۆک بە سەرکەوتوویی ئەنجامدرا.' };
  } catch (error: any) {
    console.warn("syncContentSectionsToFirestore warning:", error);
    return { ok: false, messageKu: `هاوکاتکردنی بەشەکانی ناوەڕۆک سەرکەوتوو نەبوو: ${error.message || error}` };
  }
}

/**
 * Tests Firebase Connection.
 */
export async function testFirebaseConnection(): Promise<{ ok: boolean; code?: string; messageKu: string }> {
  if (!isFirebaseConfigured) {
    return {
      ok: false,
      messageKu: 'فایەربەیس ڕێک نەخراوە؛ پلاتفۆرمەکە لە دۆخی پایلۆتی ناوخۆیی کار دەکات.'
    };
  }
  try {
    const docRef = doc(db, 'adminConfig', 'global');
    await getDoc(docRef);
    return {
      ok: true,
      messageKu: 'پەیوەندی Firestore بە سەرکەوتوویی تاقی کرایەوە.'
    };
  } catch (error: any) {
    console.warn("testFirebaseConnection warning:", error);
    const errStr = error?.message || String(error);
    if (errStr.includes('permission') || errStr.includes('permission_denied') || error?.code === 'permission-denied') {
      return {
        ok: false,
        code: 'permission_denied',
        messageKu: 'فایەربەیس پەیوەستە، بەڵام ڕێساکانی Firestore ڕێگەی خوێندنەوە/نووسین نادەن. پێویستە Auth و Admin Rules چالاک بکرێن.'
      };
    }
    return {
      ok: false,
      messageKu: `پەیوەندی سەرکەوتوو نەبوو: ${errStr}`
    };
  }
}
