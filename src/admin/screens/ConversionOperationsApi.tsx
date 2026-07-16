import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, Download, RefreshCw, Search, Users, XCircle } from 'lucide-react';
import { getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth, collection, db, doc, serverTimestamp, updateDoc } from '@/src/lib/firebase';
import { getAdminFirestoreErrorMessage } from '@/src/admin/adminFirestoreError';

type ConversionStatus = 'received' | 'contacted' | 'qualified' | 'converted' | 'closed';

type ConversionRecord = {
  id: string;
  type?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  organization?: string | null;
  service?: string | null;
  message?: string;
  status?: ConversionStatus;
  adminNote?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  migratedFrom?: string;
};

interface ConversionOperationsApiProps {
  adminToken: string;
}

const PAGE_SIZE = 25;

const STATUS_LABELS: Record<ConversionStatus, string> = {
  received: 'وەرگیراو',
  contacted: 'پەیوەندی کراو',
  qualified: 'شایستەکراو',
  converted: 'گۆڕدراو بە کڕیار',
  closed: 'داخراو',
};

const STATUS_STYLES: Record<ConversionStatus, string> = {
  received: 'border-blue-500/25 bg-blue-500/10 text-blue-300',
  contacted: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  qualified: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  converted: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  closed: 'border-slate-600 bg-slate-800 text-slate-300',
};

const toIsoDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (
    typeof value === 'object'
    && value !== null
    && 'toDate' in value
    && typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return undefined;
};

const normalizeRecord = (id: string, data: Record<string, unknown>): ConversionRecord => ({
  id,
  type: typeof data.type === 'string' ? data.type : undefined,
  fullName: typeof data.fullName === 'string' ? data.fullName : undefined,
  email: typeof data.email === 'string' ? data.email : undefined,
  phone: typeof data.phone === 'string' ? data.phone : undefined,
  organization: typeof data.organization === 'string' ? data.organization : null,
  service: typeof data.service === 'string' ? data.service : undefined,
  message: typeof data.message === 'string' ? data.message : undefined,
  status: typeof data.status === 'string' ? data.status as ConversionStatus : 'received',
  adminNote: typeof data.adminNote === 'string' ? data.adminNote : undefined,
  assignedTo: typeof data.assignedTo === 'string' ? data.assignedTo : undefined,
  createdAt: toIsoDate(data.createdAt),
  updatedAt: toIsoDate(data.updatedAt),
  migratedFrom: typeof data.migratedFrom === 'string' ? data.migratedFrom : undefined,
});

export function ConversionOperationsApi({ adminToken: _adminToken }: ConversionOperationsApiProps) {
  const [items, setItems] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConversionStatus>('all');
  const [selected, setSelected] = useState<ConversionRecord | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!db) throw new Error('FIREBASE_NOT_CONFIGURED');

        const currentUser = auth?.currentUser;
        if (!currentUser) throw new Error('ADMIN_AUTH_REQUIRED');

        await currentUser.getIdToken(true);

        const snapshot = await getDocs(
          collection(db, 'conversionSubmissions'),
        );

        const records = snapshot.docs
          .map((snapshotDoc) =>
            normalizeRecord(
              snapshotDoc.id,
              snapshotDoc.data() as Record<string, unknown>,
            )
          )
          .sort((left, right) => {
            const leftTime = left.createdAt
              ? Date.parse(left.createdAt)
              : 0;
            const rightTime = right.createdAt
              ? Date.parse(right.createdAt)
              : 0;

            return rightTime - leftTime;
          })
          .slice(0, 250);

        if (!cancelled) setItems(records);
      } catch (loadError) {
        console.error('Loading conversion operations failed.', loadError);
        if (!cancelled) {
          setError(getAdminFirestoreErrorMessage(
            loadError,
            'بارکردنی داواکارییەکان سەرکەوتوو نەبوو.',
          ));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const status = item.status || 'received';
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (!term) return true;
      return [item.fullName, item.email, item.phone, item.organization, item.service, item.message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const metrics = useMemo(() => ({
    total: items.length,
    received: items.filter((item) => (item.status || 'received') === 'received').length,
    qualified: items.filter((item) => item.status === 'qualified').length,
    converted: items.filter((item) => item.status === 'converted').length,
    closed: items.filter((item) => item.status === 'closed').length,
  }), [items]);

  const updateRecord = async (id: string, patch: Partial<ConversionRecord>) => {
    setSaving(true);
    setError('');
    try {
      if (!db) throw new Error('FIREBASE_NOT_CONFIGURED');

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error('ADMIN_AUTH_REQUIRED');

      await currentUser.getIdToken(true);

      const firestorePatch: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };

      if (patch.status !== undefined) firestorePatch.status = patch.status;
      if (patch.adminNote !== undefined) firestorePatch.adminNote = patch.adminNote;
      if (patch.assignedTo !== undefined) firestorePatch.assignedTo = patch.assignedTo;

      await updateDoc(doc(db, 'conversionSubmissions', id), firestorePatch);

      const updatedAt = new Date().toISOString();
      setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt } : item));
      if (selected?.id === id) setSelected({ ...selected, ...patch, updatedAt });
    } catch (updateError) {
      console.error('Updating conversion operation failed.', updateError);
      setError('پاشەکەوتکردنی گۆڕانکارییەکە سەرکەوتوو نەبوو.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      ['id', 'status', 'type', 'fullName', 'email', 'phone', 'organization', 'service', 'createdAt'],
      ...filtered.map((item) => [item.id, item.status || 'received', item.type || '', item.fullName || '', item.email || '', item.phone || '', item.organization || '', item.service || '', item.createdAt || '']),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `conversion-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">بەڕێوەبردنی گۆڕینە بازرگانییەکان</h1>
          <p className="mt-1 text-xs text-slate-400">هەموو داواکارییەکان لە یەک سەرچاوەی یەکگرتوودا</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setReloadKey((value) => value + 1)} className="border-slate-700 text-slate-200">
            <RefreshCw className="ml-2 h-4 w-4" /> نوێکردنەوە
          </Button>
          <Button onClick={exportCsv} className="bg-emerald-600 hover:bg-emerald-500">
            <Download className="ml-2 h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ['هەموو', metrics.total, Users],
          ['نوێ', metrics.received, Clock3],
          ['شایستە', metrics.qualified, CheckCircle2],
          ['گۆڕدراو', metrics.converted, CheckCircle2],
          ['داخراو', metrics.closed, XCircle],
        ].map(([label, value, Icon]: any) => (
          <Card key={label} className="border-slate-800 bg-[#0E1625] p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[11px] text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-white">{value}</p></div>
              <Icon className="h-5 w-5 text-emerald-400" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800 bg-[#0E1625] p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="گەڕان بە ناو، ئیمەیڵ، کۆمپانیا..." className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-3 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | ConversionStatus)} className="h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white">
            <option value="all">هەموو دۆخەکان</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
      </Card>

      {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden border-slate-800 bg-[#0E1625]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                <tr><th className="p-3">کەس/کۆمپانیا</th><th className="p-3">پەیوەندی</th><th className="p-3">خزمەتگوزاری</th><th className="p-3">دۆخ</th><th className="p-3">بەروار</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">بارکردن...</td></tr>
                ) : pagedItems.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">هیچ داواکارییەک نییە.</td></tr>
                ) : pagedItems.map((item) => {
                  const status = item.status || 'received';
                  return (
                    <tr key={item.id} onClick={() => { setSelected(item); setNote(item.adminNote || ''); }} className={`cursor-pointer border-b border-slate-800/70 hover:bg-slate-800/40 ${selected?.id === item.id ? 'bg-emerald-500/10' : ''}`}>
                      <td className="p-3"><p className="font-bold text-white">{item.fullName || '—'}</p><p className="text-slate-500">{item.organization || '—'}</p></td>
                      <td className="p-3"><p className="text-slate-200">{item.email || '—'}</p><p className="text-slate-500">{item.phone || '—'}</p></td>
                      <td className="p-3 text-slate-300">{item.service || item.type || '—'}</td>
                      <td className="p-3"><span className={`rounded-full border px-2 py-1 ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span></td>
                      <td className="p-3 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            <span>{filtered.length} داواکاری</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="h-8 border-slate-700"><ChevronRight className="h-4 w-4" /></Button>
              <span>{page} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="h-8 border-slate-700"><ChevronLeft className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>

        <Card className="border-slate-800 bg-[#0E1625] p-4">
          {!selected ? (
            <p className="py-10 text-center text-sm text-slate-500">داواکارییەک هەڵبژێرە.</p>
          ) : (
            <div className="space-y-4">
              <div><h2 className="font-black text-white">{selected.fullName}</h2><p className="text-xs text-slate-400">{selected.organization || '—'}</p></div>
              <div className="rounded-xl bg-slate-950/60 p-3 text-xs leading-6 text-slate-300 whitespace-pre-wrap">{selected.message || '—'}</div>
              <label className="block text-xs text-slate-400">دۆخ
                <select value={selected.status || 'received'} disabled={saving} onChange={(event) => void updateRecord(selected.id, { status: event.target.value as ConversionStatus })} className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </label>
              <label className="block text-xs text-slate-400">بەرپرسی داواکاری
                <input value={selected.assignedTo || ''} onChange={(event) => setSelected({ ...selected, assignedTo: event.target.value })} onBlur={() => void updateRecord(selected.id, { assignedTo: selected.assignedTo || '' })} className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white" />
              </label>
              <label className="block text-xs text-slate-400">تێبینی ناوخۆیی
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
              </label>
              {selected.updatedAt && <p className="text-[11px] text-slate-500">دوایین نوێکردنەوە: {new Date(selected.updatedAt).toLocaleString('en-GB')}</p>}
              <Button disabled={saving} onClick={() => void updateRecord(selected.id, { adminNote: note })} className="w-full bg-emerald-600 hover:bg-emerald-500">{saving ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردنی تێبینی'}</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
