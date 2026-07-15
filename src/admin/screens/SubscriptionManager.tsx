import { useEffect, useMemo, useState } from 'react';
import { getDocs, Timestamp } from 'firebase/firestore';
import {
  CheckCircle2,
  Clock3,
  Crown,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  addDoc,
  auth,
  collection,
  db,
  doc,
  serverTimestamp,
  setDoc,
} from '@/src/lib/firebase';
import { FREE_QUESTION_LIMIT } from '@/src/lib/subscription';

type RequestStatus = 'pending' | 'approved' | 'rejected' | 'resolved' | '';

interface SubscriptionUserRow {
  uid: string;
  email: string;
  displayName: string;
  accountStatus: string;
  provider: string;
  plan: 'free' | 'pro';
  subscriptionStatus: string;
  currentPeriodEnd: Date | null;
  questionsUsed: number;
  requestStatus: RequestStatus;
}

type SnapshotData = Record<string, unknown>;

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (
    typeof value === 'object'
    && value !== null
    && 'toDate' in value
    && typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
};

const formatDate = (value: Date | null): string => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ckb-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(value);
};

const isActivePro = (row: SubscriptionUserRow): boolean =>
  row.plan === 'pro'
  && row.subscriptionStatus === 'active'
  && Boolean(row.currentPeriodEnd && row.currentPeriodEnd.getTime() > Date.now());

export function SubscriptionManager() {
  const [rows, setRows] = useState<SubscriptionUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'pro' | 'free'>('all');
  const [savingUid, setSavingUid] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!db || !auth?.currentUser) throw new Error('ADMIN_AUTH_REQUIRED');
        await auth.currentUser.getIdToken(true);

        const [usersSnapshot, subscriptionsSnapshot, usageSnapshot, requestsSnapshot] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'subscriptions')),
          getDocs(collection(db, 'usageCounters')),
          getDocs(collection(db, 'subscriptionRequests')),
        ]);

        const users = new Map<string, SnapshotData>();
        const subscriptions = new Map<string, SnapshotData>();
        const usage = new Map<string, SnapshotData>();
        const requests = new Map<string, SnapshotData>();

        usersSnapshot.docs.forEach((item) => users.set(item.id, item.data() as SnapshotData));
        subscriptionsSnapshot.docs.forEach((item) => subscriptions.set(item.id, item.data() as SnapshotData));
        usageSnapshot.docs.forEach((item) => usage.set(item.id, item.data() as SnapshotData));
        requestsSnapshot.docs.forEach((item) => requests.set(item.id, item.data() as SnapshotData));

        const ids = new Set([
          ...users.keys(),
          ...subscriptions.keys(),
          ...usage.keys(),
          ...requests.keys(),
        ]);

        const nextRows = [...ids].map((uid): SubscriptionUserRow => {
          const user = users.get(uid) || {};
          const subscription = subscriptions.get(uid) || {};
          const usageRecord = usage.get(uid) || {};
          const request = requests.get(uid) || {};
          return {
            uid,
            email: typeof user.email === 'string' ? user.email : typeof request.email === 'string' ? request.email : '',
            displayName: typeof user.displayName === 'string' ? user.displayName : typeof request.displayName === 'string' ? request.displayName : '',
            accountStatus: typeof user.status === 'string' ? user.status : 'active',
            provider: typeof user.provider === 'string' ? user.provider : 'unknown',
            plan: subscription.plan === 'pro' ? 'pro' : 'free',
            subscriptionStatus: typeof subscription.status === 'string' ? subscription.status : 'inactive',
            currentPeriodEnd: toDate(subscription.currentPeriodEnd),
            questionsUsed: typeof usageRecord.questionsUsed === 'number' ? Math.max(0, usageRecord.questionsUsed) : 0,
            requestStatus: typeof request.status === 'string' ? request.status as RequestStatus : '',
          };
        }).sort((left, right) => {
          if (left.requestStatus === 'pending' && right.requestStatus !== 'pending') return -1;
          if (right.requestStatus === 'pending' && left.requestStatus !== 'pending') return 1;
          return left.email.localeCompare(right.email);
        });

        if (!cancelled) setRows(nextRows);
      } catch (loadError) {
        console.error('Loading subscription management failed.', loadError);
        if (!cancelled) setError('بارکردنی زانیاریی بەشداربوون سەرکەوتوو نەبوو. Firestore rules و ڕێگەپێدانی ئادمین بپشکنە.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const metrics = useMemo(() => ({
    total: rows.length,
    pro: rows.filter(isActivePro).length,
    free: rows.filter((row) => !isActivePro(row)).length,
    pending: rows.filter((row) => row.requestStatus === 'pending').length,
  }), [rows]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === 'pending' && row.requestStatus !== 'pending') return false;
      if (filter === 'pro' && !isActivePro(row)) return false;
      if (filter === 'free' && isActivePro(row)) return false;
      if (!term) return true;
      return [row.displayName, row.email, row.uid]
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [rows, search, filter]);

  const writeAudit = async (action: string, uid: string, description: string) => {
    if (!db || !auth?.currentUser) return;
    await addDoc(collection(db, 'auditLogs'), {
      actorUid: auth.currentUser.uid,
      actorEmail: auth.currentUser.email || '',
      action,
      entity: 'subscription',
      entityId: uid,
      description,
      createdAt: serverTimestamp(),
    });
  };

  const activatePro = async (row: SubscriptionUserRow, days: number) => {
    if (!db || !auth?.currentUser) return;
    setSavingUid(row.uid);
    setError('');
    setNotice('');
    try {
      const now = new Date();
      const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const subscriptionRef = doc(db, 'subscriptions', row.uid);
      await setDoc(subscriptionRef, {
        uid: row.uid,
        plan: 'pro',
        status: 'active',
        source: 'manual_admin',
        currentPeriodStart: Timestamp.fromDate(now),
        currentPeriodEnd: Timestamp.fromDate(end),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
        activatedAt: serverTimestamp(),
      }, { merge: true });

      if (row.requestStatus) {
        await setDoc(doc(db, 'subscriptionRequests', row.uid), {
          status: 'approved',
          resolvedAt: serverTimestamp(),
          resolvedBy: auth.currentUser.uid,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      await writeAudit('subscription.pro_activated', row.uid, `Pro plan activated for ${days} days.`);
      setNotice(`پلانی Pro بۆ ${row.email || row.uid} بۆ ماوەی ${days} ڕۆژ چالاک کرا.`);
      setReloadKey((value) => value + 1);
    } catch (saveError) {
      console.error('Activating Pro subscription failed.', saveError);
      setError('چالاککردنی پلانی Pro سەرکەوتوو نەبوو.');
    } finally {
      setSavingUid('');
    }
  };

  const deactivatePro = async (row: SubscriptionUserRow) => {
    if (!db || !auth?.currentUser) return;
    setSavingUid(row.uid);
    setError('');
    setNotice('');
    try {
      await setDoc(doc(db, 'subscriptions', row.uid), {
        uid: row.uid,
        plan: 'free',
        status: 'cancelled',
        currentPeriodEnd: Timestamp.fromDate(new Date()),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid,
      }, { merge: true });
      await writeAudit('subscription.pro_deactivated', row.uid, 'Pro plan deactivated manually.');
      setNotice(`پلانی Pro بۆ ${row.email || row.uid} ناچالاک کرا.`);
      setReloadKey((value) => value + 1);
    } catch (saveError) {
      console.error('Deactivating Pro subscription failed.', saveError);
      setError('ناچالاککردنی پلانی Pro سەرکەوتوو نەبوو.');
    } finally {
      setSavingUid('');
    }
  };

  const resetUsage = async (row: SubscriptionUserRow) => {
    if (!db || !auth?.currentUser) return;
    setSavingUid(row.uid);
    setError('');
    setNotice('');
    try {
      await setDoc(doc(db, 'usageCounters', row.uid), {
        uid: row.uid,
        questionsUsed: 0,
        lastPlan: isActivePro(row) ? 'pro' : 'free',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await writeAudit('subscription.usage_reset', row.uid, 'AI question usage counter reset.');
      setNotice(`ژمارەی پرسیارەکانی ${row.email || row.uid} سفر کرایەوە.`);
      setReloadKey((value) => value + 1);
    } catch (saveError) {
      console.error('Resetting subscription usage failed.', saveError);
      setError('سفرکردنەوەی ژمارەی بەکارهێنان سەرکەوتوو نەبوو.');
    } finally {
      setSavingUid('');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">بەشداربوون و بەکارهێنان</h1>
          <p className="mt-1 text-xs text-slate-400">چالاککردنی دەستی Pro، داواکارییەکان و سنووری پرسیارەکان</p>
        </div>
        <Button variant="outline" onClick={() => setReloadKey((value) => value + 1)} disabled={loading} className="border-slate-700 text-slate-200">
          <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> نوێکردنەوە
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['هەموو بەکارهێنەران', metrics.total, UserRound, 'text-blue-300'],
          ['Pro ـی چالاک', metrics.pro, Crown, 'text-amber-300'],
          ['پلانی خۆڕایی', metrics.free, ShieldCheck, 'text-slate-300'],
          ['داواکاری چاوەڕوان', metrics.pending, Clock3, 'text-emerald-300'],
        ].map(([label, value, Icon, color]: any) => (
          <Card key={label} className="border-slate-800 bg-[#0E1625] p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[11px] text-slate-400">{label}</p><p className={`mt-1 text-2xl font-black ${color}`}>{value}</p></div>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800 bg-[#0E1625] p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="گەڕان بە ناو، ئیمەیڵ یان UID..." className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-3 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white">
            <option value="all">هەموو بەکارهێنەران</option>
            <option value="pending">داواکاری چاوەڕوان</option>
            <option value="pro">Pro ـی چالاک</option>
            <option value="free">پلانی خۆڕایی</option>
          </select>
        </div>
      </Card>

      {notice ? <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" />{notice}</div> : null}
      {error ? <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200"><XCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div> : null}

      <Card className="overflow-hidden border-slate-800 bg-[#0E1625]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-right text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
              <tr>
                <th className="p-3">بەکارهێنەر</th>
                <th className="p-3">پلان</th>
                <th className="p-3">بەسەرچوون</th>
                <th className="p-3">پرسیار</th>
                <th className="p-3">داواکاری</th>
                <th className="p-3">کردارەکان</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-500">زانیارییەکان بار دەکرێن...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-500">هیچ بەکارهێنەرێک نەدۆزرایەوە.</td></tr>
              ) : filtered.map((row) => {
                const pro = isActivePro(row);
                const saving = savingUid === row.uid;
                return (
                  <tr key={row.uid} className="border-b border-slate-800/70 align-top hover:bg-slate-800/25">
                    <td className="p-3">
                      <p className="font-bold text-white">{row.displayName || 'بێ ناو'}</p>
                      <p className="mt-1 text-[11px] text-emerald-300">{row.email || 'ئیمەیڵ نییە'}</p>
                      <p className="mt-1 max-w-[240px] truncate font-mono text-[9px] text-slate-600" title={row.uid}>{row.uid}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black ${pro ? 'border-amber-400/25 bg-amber-400/10 text-amber-300' : 'border-slate-600 bg-slate-800 text-slate-300'}`}>
                        {pro ? 'PRO' : 'FREE'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{pro ? formatDate(row.currentPeriodEnd) : '—'}</td>
                    <td className="p-3">
                      <span className="font-black text-white">{row.questionsUsed}</span>
                      <span className="text-slate-500"> / {pro ? '∞' : FREE_QUESTION_LIMIT}</span>
                    </td>
                    <td className="p-3">
                      {row.requestStatus === 'pending' ? (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">چاوەڕوانە</span>
                      ) : row.requestStatus === 'approved' ? (
                        <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-2.5 py-1 text-[10px] font-black text-blue-300">پەسەندکراوە</span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => void activatePro(row, 30)} disabled={saving} className="h-8 bg-amber-500/15 text-[10px] font-black text-amber-300 hover:bg-amber-500/25">Pro ٣٠ ڕۆژ</Button>
                        <Button size="sm" onClick={() => void activatePro(row, 365)} disabled={saving} className="h-8 bg-emerald-500/15 text-[10px] font-black text-emerald-300 hover:bg-emerald-500/25">Pro ١ ساڵ</Button>
                        {pro ? <Button size="sm" variant="outline" onClick={() => void deactivatePro(row)} disabled={saving} className="h-8 border-rose-500/25 text-[10px] font-black text-rose-300"><XCircle className="ml-1 h-3.5 w-3.5" />ناچالاککردن</Button> : null}
                        <Button size="sm" variant="outline" onClick={() => void resetUsage(row)} disabled={saving} className="h-8 border-slate-700 text-[10px] font-black text-slate-300"><RotateCcw className="ml-1 h-3.5 w-3.5" />سفرکردنەوە</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
