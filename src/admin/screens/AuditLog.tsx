import React, { useState } from 'react';
import { Logs, Search, Trash2, Shield, Calendar, Clock, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminAuditLog } from '../adminTypes';
import { formatKuDate } from '../adminUtils';

interface AuditLogProps {
  logs: AdminAuditLog[];
}

export const AuditLog = ({ logs }: AuditLogProps) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    if (filterType === 'intake') return matchesSearch && (log.entity === 'داواکاری' || log.entity === 'Intake');
    if (filterType === 'content') return matchesSearch && (log.entity === 'بەشی ناوەڕۆک' || log.entity === 'Content');
    if (filterType === 'services') return matchesSearch && (log.entity === 'خزمەتگوزاری' || log.entity === 'Service');
    if (filterType === 'settings') return matchesSearch && (log.entity === 'سیستەم' || log.entity === 'ڕێکخستن' || log.entity === 'ფڵაگی تایبەتمەندی');
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header section */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Logs className="w-5 h-5 text-emerald-400" />
          <span>تۆماری کردارەکانی بەڕێوەبردن (Audit Log)</span>
        </h2>
        <p className="text-xs text-slate-400">
          تۆمارکردن و بینینی ڕووداوە چوستەکان هەنگاو بە هەنگاو کە لە سەرپەرشتی پلاتفۆرمەوە کراون.
        </p>
      </div>

      {/* Filters options panel */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/15 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="گەڕان لە تۆمارەکان..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-slate-950/40 border border-slate-800 text-white rounded-xl px-4 text-xs focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-600 block pe-10"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 border border-slate-800/50'
            }`}
          >
            هەموو کردارەکان
          </button>
          <button
            onClick={() => setFilterType('intake')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'intake'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 border border-slate-800/50'
            }`}
          >
            داواکاری
          </button>
          <button
            onClick={() => setFilterType('content')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'content'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 border border-slate-800/50'
            }`}
          >
            ناوەڕۆک
          </button>
          <button
            onClick={() => setFilterType('services')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'services'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 border border-slate-800/50'
            }`}
          >
            خزمەتگوزاری
          </button>
          <button
            onClick={() => setFilterType('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'settings'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 border border-slate-800/50'
            }`}
          >
            ڕێکخستن
          </button>
        </div>
      </div>

      {/* Main Table viewports */}
      <Card className="bg-slate-900/10 border border-slate-800/80 rounded-2xl overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/85 text-slate-400 font-extrabold uppercase font-sans">
                  <th className="p-4">بەروار و کات</th>
                  <th className="p-4">سەرپەرشتیار / بەکارهێنەر</th>
                  <th className="p-4">کردار</th>
                  <th className="p-4">بەش</th>
                  <th className="p-4">وردەکاری و دەستکاریکردن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/30 transition-all">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {formatKuDate(log.createdAt)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{log.actorName}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 text-[10px] font-black">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-400">{log.entity}</td>
                    <td className="p-4 text-slate-100 font-sans select-all leading-normal">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">تۆمار یا کردارێک نەدۆزرایەوە</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              هێشتا هیچ کردارێک تۆمار نەکراوە یان گەڕانەکەت هیچ ئەنجامێکی نەبوو.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
