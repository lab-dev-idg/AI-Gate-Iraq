import { BusinessSession } from '@/src/types/session';
import { db, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from '@/src/lib/firebase';

const WORKSPACE_DOCUMENT = 'current';
const MAX_CHAT_MESSAGES = 80;

export type WorkspaceSyncState = 'guest' | 'syncing' | 'synced' | 'offline' | 'error';

export interface CloudWorkspaceRecord {
  session: BusinessSession;
  ownerUid: string;
  updatedAtMs: number;
  updatedAt: unknown;
  schemaVersion: 1;
}

function sanitizeSession(session: BusinessSession): BusinessSession {
  const chatMessages = session.chatMessages.length > MAX_CHAT_MESSAGES
    ? [session.chatMessages[0], ...session.chatMessages.slice(-(MAX_CHAT_MESSAGES - 1))]
    : session.chatMessages;

  return {
    ...session,
    chatMessages,
    drafts: { ...session.drafts },
    updatedAt: Date.now(),
  };
}

function workspaceRef(uid: string) {
  return doc(db, `users/${uid}/workspace`, WORKSPACE_DOCUMENT);
}

export async function readCloudWorkspace(uid: string): Promise<BusinessSession | null> {
  const snapshot = await getDoc(workspaceRef(uid));
  if (!snapshot.exists()) return null;

  const record = snapshot.data() as Partial<CloudWorkspaceRecord>;
  return record.session ?? null;
}

export async function writeCloudWorkspace(uid: string, session: BusinessSession): Promise<number> {
  const updatedAtMs = Date.now();
  const cleanSession = sanitizeSession({ ...session, updatedAt: updatedAtMs });

  await setDoc(
    workspaceRef(uid),
    {
      ownerUid: uid,
      session: cleanSession,
      updatedAtMs,
      updatedAt: serverTimestamp(),
      schemaVersion: 1,
    } satisfies CloudWorkspaceRecord,
    { merge: true },
  );

  return updatedAtMs;
}

export function subscribeCloudWorkspace(
  uid: string,
  onSession: (session: BusinessSession, updatedAtMs: number) => void,
  onError: (error: Error) => void,
): () => void {
  return onSnapshot(
    workspaceRef(uid),
    snapshot => {
      if (!snapshot.exists()) return;
      const record = snapshot.data() as Partial<CloudWorkspaceRecord>;
      if (!record.session) return;
      onSession(record.session, record.updatedAtMs ?? record.session.updatedAt ?? 0);
    },
    error => onError(error instanceof Error ? error : new Error(String(error))),
  );
}
