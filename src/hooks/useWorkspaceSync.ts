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

export function useWorkspaceSync(params: Params) {
  const { user, loading } = useAuth();
  const [state, setState] = useState<WorkspaceSyncState>('guest');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const hydratedUid = useRef<string | null>(null);
  const latestCloud = useRef(0);
  const applyingCloud = useRef(false);
  const previousUid = useRef<string | null>(null);

  const apply = (session: ReturnType<typeof loadSession>) => {
    applyingCloud.current = true;
    saveSession(session);
    if (session.chatMessages?.length) params.setMessages(session.chatMessages);
    params.setActiveService(session.activeService);
    params.setChatScope(session.chatScope);
    queueMicrotask(() => { applyingCloud.current = false; });
  };

  const pushCurrentSession = async (uid: string) => {
    if (!navigator.onLine) {
      setState('offline');
      return;
    }
    setState('syncing');
    try {
      const at = await writeCloudWorkspace(uid, loadSession(params.lang));
      latestCloud.current = at;
      setLastSyncedAt(at);
      setState('synced');
    } catch {
      setState(navigator.onLine ? 'error' : 'offline');
    }
  };

  useEffect(() => {
    if (loading) return;
    const oldUid = previousUid.current;
    previousUid.current = user?.uid ?? null;

    if (oldUid && !user) {
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

    if (!user) return setState('guest');
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
          latestCloud.current = at;
          setLastSyncedAt(at);
        }
        hydratedUid.current = user.uid;
        setState(navigator.onLine ? 'synced' : 'offline');
      } catch {
        setState(navigator.onLine ? 'error' : 'offline');
      }
    })();

    const unsubscribe = subscribeCloudWorkspace(user.uid, (session, at) => {
      if (cancelled || at <= latestCloud.current) return;
      latestCloud.current = at;
      apply(session);
      setLastSyncedAt(at);
      setState('synced');
    }, () => setState(navigator.onLine ? 'error' : 'offline'));

    return () => { cancelled = true; unsubscribe(); };
  }, [loading, user?.uid]);

  useEffect(() => {
    if (!user || hydratedUid.current !== user.uid || applyingCloud.current) return;
    const timer = window.setTimeout(() => void pushCurrentSession(user.uid), 900);
    return () => window.clearTimeout(timer);
  }, [user?.uid, params.messages, params.activeService, params.chatScope, params.lang]);

  useEffect(() => {
    const onWorkspaceChange = () => {
      if (user && hydratedUid.current === user.uid && !applyingCloud.current) {
        window.setTimeout(() => void pushCurrentSession(user.uid), 700);
      }
    };
    const onOnline = () => { if (user) void pushCurrentSession(user.uid); };
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
