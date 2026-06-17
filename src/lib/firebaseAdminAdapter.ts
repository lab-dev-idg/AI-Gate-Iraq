import { isFirebaseConfigured, db, doc, setDoc, getDoc, collection, addDoc, updateDoc } from './firebase';

export type FirebaseOperationResult = {
  ok: boolean;
  code?: string;
  messageKu: string;
};

function unavailable(messageKu: string): FirebaseOperationResult {
  return { ok: false, code: 'firebase_unavailable', messageKu };
}

export async function syncAdminStateToFirestore(adminState: any): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, 'adminConfig', 'global'), {
      ...adminState,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Firestore admin state sync failed.', error);
    return false;
  }
}

export async function loadAdminStateFromFirestore(): Promise<any | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const snapshot = await getDoc(doc(db, 'adminConfig', 'global'));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.warn('Firestore admin state load failed.', error);
    return null;
  }
}

export async function createFirebaseIntakeItem(item: any): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const created = await addDoc(collection(db, 'intakeItems'), {
      ...item,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return created.id;
  } catch (error) {
    console.warn('Firestore intake creation failed.', error);
    return null;
  }
}

export async function updateFirebaseIntakeItem(id: string, patch: any): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await updateDoc(doc(db, 'intakeItems', id), {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Firestore intake update failed.', error);
    return false;
  }
}

export async function createFirebaseAuditLog(log: any): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const created = await addDoc(collection(db, 'auditLogs'), {
      ...log,
      timestamp: new Date().toISOString(),
    });
    return created.id;
  } catch (error) {
    console.warn('Firestore audit log creation failed.', error);
    return null;
  }
}

export async function uploadPilotAttachment(): Promise<null> {
  console.warn('File upload is disabled until Firebase Storage is enabled and configured.');
  return null;
}

export async function syncFeatureFlagsToFirestore(flags: any[]): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ هاوکاتکردن نەکرا.');
  try {
    for (const flag of flags) {
      if (!flag.key) continue;
      await setDoc(doc(db, 'featureFlags', flag.key), {
        ...flag,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return { ok: true, messageKu: 'فڵاگەکانی تایبەتمەندی بە سەرکەوتوویی هاوکات کران.' };
  } catch (error: any) {
    console.warn('Feature flag sync failed.', error);
    return { ok: false, messageKu: `هاوکاتکردنی فڵاگەکان سەرکەوتوو نەبوو: ${error?.message || error}` };
  }
}

export async function syncServiceConfigsToFirestore(services: any[]): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ هاوکاتکردن نەکرا.');
  try {
    for (const service of services) {
      if (!service.key) continue;
      await setDoc(doc(db, 'serviceConfigs', service.key), {
        ...service,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return { ok: true, messageKu: 'ڕێکخستنەکانی خزمەتگوزاری بە سەرکەوتوویی هاوکات کران.' };
  } catch (error: any) {
    console.warn('Service config sync failed.', error);
    return { ok: false, messageKu: `هاوکاتکردنی خزمەتگوزارییەکان سەرکەوتوو نەبوو: ${error?.message || error}` };
  }
}

export async function syncPromptConfigsToFirestore(prompts: any[]): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ هاوکاتکردن نەکرا.');
  try {
    for (const item of prompts) {
      if (!item.id) continue;
      await setDoc(doc(db, 'promptConfigs', item.id), {
        ...item,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return { ok: true, messageKu: 'ڕێنمایییەکان بە سەرکەوتوویی هاوکات کران.' };
  } catch (error: any) {
    console.warn('Prompt config sync failed.', error);
    return { ok: false, messageKu: `هاوکاتکردنی ڕێنمایییەکان سەرکەوتوو نەبوو: ${error?.message || error}` };
  }
}

export async function syncWorkflowStepsToFirestore(steps: any[]): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ هاوکاتکردن نەکرا.');
  try {
    for (const step of steps) {
      if (!step.id) continue;
      await setDoc(doc(db, 'workflowSteps', step.id), {
        ...step,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return { ok: true, messageKu: 'هەنگاوەکانی کار بە سەرکەوتوویی هاوکات کران.' };
  } catch (error: any) {
    console.warn('Workflow sync failed.', error);
    return { ok: false, messageKu: `هاوکاتکردنی هەنگاوەکانی کار سەرکەوتوو نەبوو: ${error?.message || error}` };
  }
}

export async function syncContentSectionsToFirestore(sections: any[]): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ هاوکاتکردن نەکرا.');
  try {
    for (const section of sections) {
      const id = section.id || section.sectionId;
      if (!id) continue;
      await setDoc(doc(db, 'contentSections', id), {
        ...section,
        sectionId: id,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return { ok: true, messageKu: 'بەشەکانی ناوەڕۆک بە سەرکەوتوویی هاوکات کران.' };
  } catch (error: any) {
    console.warn('Content section sync failed.', error);
    return { ok: false, messageKu: `هاوکاتکردنی ناوەڕۆک سەرکەوتوو نەبوو: ${error?.message || error}` };
  }
}

export async function testFirebaseConnection(): Promise<FirebaseOperationResult> {
  if (!isFirebaseConfigured) {
    return unavailable('ڕێکخستنی فایەربەیس تەواو نییە؛ پەیوەندی تاقی نەکرایەوە.');
  }
  try {
    await getDoc(doc(db, 'adminConfig', 'global'));
    return { ok: true, messageKu: 'پەیوەندی Firestore بە سەرکەوتوویی تاقی کرایەوە.' };
  } catch (error: any) {
    console.warn('Firebase connection test failed.', error);
    const code = error?.code || '';
    if (code === 'permission-denied' || String(error?.message || error).includes('permission')) {
      return {
        ok: false,
        code: 'permission_denied',
        messageKu: 'پەیوەندی فایەربەیس هەیە، بەڵام ڕێگەپێدانی هەژمارەکە بۆ ئەم کردارە نییە.',
      };
    }
    return {
      ok: false,
      code: 'connection_failed',
      messageKu: 'پەیوەندی Firestore سەرکەوتوو نەبوو. ڕێکخستن و تۆڕ پشکنین بکە.',
    };
  }
}
