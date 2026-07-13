import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/src/components/AuthProvider';
import { readCloudWorkspace, subscribeCloudWorkspace, WorkspaceSyncState, writeCloudWorkspace } from '@/src/lib/cloudWorkspace';
import { clearSession, DEFAULT_SESSION, loadSession, saveSession } from '@/src/lib/sessionStore';
import { Message } from '@/src/types/chat';
import { ServiceKey } from '@/src/types/services';

interface Params {
  lang: 'ku' | 'ar';
  welcome: string;
  activeService: ServiceKey;
  chatScope: ServiceKey;
  messages: Message[];
  setActiveService: (value: ServiceKey) => void;
  setChatScope: (value: ServiceKey) => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const SYNC_DELAY_MS = 900;
const WORKSPACE_EVENT_DELAY_MS = 700;

export function useWorkspaceSync(params: Params) {
  const { user, loading } = useAuth();
  const [state, setState] = useState<WorkspaceSyncState>('guest');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const hydratedUid = useRef<string | null>(null);
  const latestCloud = useRef(0);
  const applyingCloud = useRef(false);
  const previousUid = useRef<string | null>(null);
  const syncTimer = useRef<number | null>(null);
  const syncInFlight = useRef(false);
  const syncQueued = useRef(false);
  const mounted = useRef(true);

  const clearSyncTimer = () => {
    if (syncTimer.current !== null) {
      window.clearTimeout(syncTimer.current);
      syncTimer.current = null;
    }
  };

  const apply = (session: ReturnType<typeof loadSession>) => {
    applyingCloud.current = true;
    saveSession(session);
    if (session.chatMessages?.length) params.setMessages(session.chatMessages);
    params.setActiveService(session.activeService);
    params.setChatScope(session.chatScope);
    queueMicrotask(() => { applyingCloud.current = false; });
  };

  const schedulePush = (uid: string, delay = SYNC_DELAY_MS) => {
    clearSyncTimer();
    syncTimer.current = window.setTimeout(() => {
      syncTimer.current = null;
      void pushCurrentSession(uid);
    }, delay);
  };

  const pushCurrentSession = async (uid: string) => {
    if (hydratedUid.current !== uid) return;
    if (syncInFlight.current) {
      syncQueued.current = true;
      return;
    }
    if (!navigator.onLine) {
      if (mounted.current) setState('offline');
      return;
    }

    syncInFlight.current = true;
    syncQueued.current = false;
    if (mounted.current) setState('syncing');

    try {
      const at = await writeCloudWorkspace(uid, loadSession(params.lang));
      latestCloud.current = Math.max(latestCloud.current, at);
      if (mounted.current) {
        setLastSyncedAt(at);
        setState('synced');
      }
    } catch {
      if (mounted.current) setState(navigator.onLine ? 'error' : 'offline');
    } finally {
      syncInFlight.current = false;
      if (syncQueued.current && hydratedUid.current === uid) {
        syncQueued.current = false;
        schedulePush(uid, 150);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearSyncTimer();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const oldUid = previousUid.current;
    previousUid.current = user?.uid ?? null;

    if (oldUid && !user) {
      clearSyncTimer();
      syncQueued.current = false;
      clearSession();
      const clean = DEFAULT_SESSION(params.lang);
      params.setMessages([{ role: 'model', text: params.welcome }]);
      params.setActiveService(clean.activeService);
      params.setChatScope(clean.chatScope);
      hydratedUid.current = null;
      latestCloud.current = 0;
      setLastSyncedAt(null);
      setState('guest');
      return;
    }

    if (!user) {
      clearSyncTimer();
      return setState('guest');
    }

    let cancelled = false;
    setState('syncing');

    void (async () => {
      try {
        const local = loadSession(params.lang);
        const cloud = await readCloudWorkspace(user.uid);
        if (cancelled) return;

        if (cloud && cloud.updatedAt > local.updatedAt) {
          latestCloud.current = cloud.updatedAt;
          apply(cloud);
          setLastSyncedAt(cloud.updatedAt);
        } else {
          const at = await writeCloudWorkspace(user.uid, local);
          if (cancelled) return;
          latestCloud.current = Math.max(latestCloud.current, at);
          setLastSyncedAt(at);
        }

        hydratedUid.current = user.uid;
        setState(navigator.onLine ? 'synced' : 'offline');
        schedulePush(user.uid, 200);
      } catch {
        if (!cancelled) setState(navigator.onLine ? 'error' : 'offline');
      }
    })();

    const unsubscribe = subscribeCloudWorkspace(user.uid, (session, at) => {
      if (cancelled || hydratedUid.current !== user.uid || at <= latestCloud.current) return;
      latestCloud.current = at;
      apply(session);
      setLastSyncedAt(at);
      setState('synced');
    }, () => {
      if (!cancelled) setState(navigator.onLine ? 'error' : 'offline');
    });

    return () => {
      cancelled = true;
      clearSyncTimer();
      syncQueued.current = false;
      unsubscribe();
    };
  }, [loading, user?.uid]);

  useEffect(() => {
    if (!user || hydratedUid.current !== user.uid || applyingCloud.current) return;
    schedulePush(user.uid);
  }, [user?.uid, params.messages, params.activeService, params.chatScope, params.lang]);

  useEffect(() => {
    const onWorkspaceChange = () => {
      if (user && hydratedUid.current === user.uid && !applyingCloud.current) {
        schedulePush(user.uid, WORKSPACE_EVENT_DELAY_MS);
      }
    };
    const onOnline = () => {
      if (user && hydratedUid.current === user.uid) schedulePush(user.uid, 0);
    };
    const onOffline = () => setState(user ? 'offline' : 'guest');

    window.addEventListener('ai-gate-workspace-change', onWorkspaceChange);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('ai-gate-workspace-change', onWorkspaceChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [user?.uid, params.lang]);

  return { user, state, lastSyncedAt };
}
