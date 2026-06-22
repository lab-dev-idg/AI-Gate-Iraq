import { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search, Users, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth } from '@/src/lib/firebase';

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
};

const STATUS_LABELS: Record<ConversionStatus, string> = {
  received: 'وەرگیراو',
  contacted: 'پەیوەندی کراو',
  qualified: 'شایستەکراو',
  converted: 'گۆڕدراو بە کڕیار',
  closed: 'داخراو',
};

async function getAdminHeaders() {
  const user = auth?.currentUser;
  if (!user) throw new Error('AUTH_REQUIRED');
  return {
    'content-type': 'application/json',
    authorization: `Bearer ${await user.getIdToken()}`,
  };
}

export function ConversionOperationsApi() {
  const [items, setItems] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConversionStatus>('all');
  const [selected, setSelected] = useState<ConversionRecord | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/conversions', { headers: await getAdminHeaders() });
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error?.code || 'LOAD_FAILED');
        if (!cancelled) setItems(body.data || []);
      } catch (err) {
        console.error('Loading conversion operations failed.', err);
        if (!cancelled) setError('بارکردنی داواکارییەکان سەرکەوتوو نەبوو.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || (item.status || 'received') === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return [item.fullName, item.email, item.phone, item.organization, item.service, item.message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [items, search, statusFilter]);

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
      const response = await fetch(`/api/admin/conversions/${id}`, {
        method: 'PATCH',
        headers: await getAdminHeaders(),
        body: JSON.stringify(patch),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.code || 'UPDATE_FAILED');
      setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
      if (selected?.id === id) setSelected({ ...selected, ...patch });
    } catch (err) {
      console.error('Updating conversion operation failed.', err);
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
        <div><h1 className="text-2xl font-black text-white">بەڕێوەبردنی گۆڕینە بازرگانییەکان</h1><p className="mt-1 text-xs text-slate-400">داواکارییەکانی demo، pilot و پەیوەندی</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => setReloadKey((value) => value + 1)} className="border-slate-700 text-slate-200"><RefreshCw className="ml-2 h-4 w-4" /> نوێکردنەوە</Button><Button onClick={exportCsv} className="bg-emerald-600 hover:bg-emerald-500"><Download className="ml-2 h-4 w-4" /> CSV</Button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[["هەموو", metrics.total, Users],["نوێ", metrics.received, Clock3],["شایستە", metrics.qualified, CheckCircle2],["گۆڕدراو", metrics.converted, CheckCircle2],["داخراو", metrics.closed, XCircle]].map(([label, value, Icon]: any) => <Card key={label} className="border-slate-800 bg-[#0E1625] p-4"><div className="flex items-center justify-between"><div><p className="text-[11px] text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-white">{value}</p></div><Icon className="h-5 w-5 text-emerald-400" /></div></Card>)}
      </div>

      <Card className="border-slate-800 bg-[#0E1625] p-4"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="گەڕان بە ناو، ئیمەیڵ، کۆمپانیا..." className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-3 text-sm text-white outline-none focus:border-emerald-500" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as any)} className="h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white"><option value="all">هەموو دۆخەکان</option>{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></Card>

      {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden border-slate-800 bg-[#0E1625]"><div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400"><tr><th className="p-3">کەس/کۆمپانیا</th><th className="p-3">پەیوەندی</th><th className="p-3">خزمەتگوزاری</th><th className="p-3">دۆخ</th><th className="p-3">بەروار</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">بارکردن...</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">هیچ داواکارییەک نییە.</td></tr> : filtered.map((item) => <tr key={item.id} onClick={() => { setSelected(item); setNote(item.adminNote || ''); }} className={`cursor-pointer border-b border-slate-800/70 hover:bg-slate-800/40 ${selected?.id === item.id ? 'bg-emerald-500/10' : ''}`}><td className="p-3"><p className="font-bold text-white">{item.fullName || '—'}</p><p className="text-slate-500">{item.organization || '—'}</p></td><td className="p-3"><p className="text-slate-200">{item.email || '—'}</p><p className="text-slate-500">{item.phone || '—'}</p></td><td className="p-3 text-slate-300">{item.service || item.type || '—'}</td><td className="p-3"><span className="rounded-full bg-slate-800 px-2 py-1 text-slate-200">{STATUS_LABELS[item.status || 'received']}</span></td><td className="p-3 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '—'}</td></tr>)}</tbody></table></div></Card>

        <Card className="border-slate-800 bg-[#0E1625] p-4">{!selected ? <p className="py-10 text-center text-sm text-slate-500">داواکارییەک هەڵبژێرە.</p> : <div className="space-y-4"><div><h2 className="font-black text-white">{selected.fullName}</h2><p className="text-xs text-slate-400">{selected.organization || '—'}</p></div><div className="rounded-xl bg-slate-950/60 p-3 text-xs leading-6 text-slate-300 whitespace-pre-wrap">{selected.message || '—'}</div><label className="block text-xs text-slate-400">دۆخ<select value={selected.status || 'received'} disabled={saving} onChange={(event) => void updateRecord(selected.id, { status: event.target.value as ConversionStatus })} className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white">{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="block text-xs text-slate-400">بەرپرسی داواکاری<input value={selected.assignedTo || ''} onChange={(event) => setSelected({ ...selected, assignedTo: event.target.value })} onBlur={() => void updateRecord(selected.id, { assignedTo: selected.assignedTo || '' })} className="mt-2 h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white" /></label><label className="block text-xs text-slate-400">تێبینی ناوخۆیی<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label><Button disabled={saving} onClick={() => void updateRecord(selected.id, { adminNote: note })} className="w-full bg-emerald-600 hover:bg-emerald-500">{saving ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردنی تێبینی'}</Button></div>}</Card>
      </div>
    </div>
  );
}
