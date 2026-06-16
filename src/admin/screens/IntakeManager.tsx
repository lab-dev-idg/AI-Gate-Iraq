import React, { useState } from 'react';
import { Search, Filter, Inbox, FileText, CheckCircle2, AlertCircle, Edit, Save, Trash2, X, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminIntakeItem } from '../adminTypes';
import { getIntakeStatusLabelKu, getIntakeStatusColorClass, formatKuDate } from '../adminUtils';

interface IntakeManagerProps {
  intakes: AdminIntakeItem[];
  onUpdateStatus: (id: string, status: AdminIntakeItem['status']) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const IntakeManager = ({ intakes, onUpdateStatus, onUpdateNote }: IntakeManagerProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminIntakeItem['status']>('all');
  const [selectedItem, setSelectedItem] = useState<AdminIntakeItem | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Handle filtering
  const filtered = intakes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.contact.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (item: AdminIntakeItem) => {
    setSelectedItem(item);
    setTempNote(item.adminNote || '');
  };

  const handleSaveNote = () => {
    if (selectedItem) {
      onUpdateNote(selectedItem.id, tempNote);
      // Update selectedItem state to reflect the updated note
      setSelectedItem({ ...selectedItem, adminNote: tempNote });
    }
  };

  const filterButtons = [
    { key: 'all' as const, label: 'هەموو' },
    { key: 'new' as const, label: 'نوێ' },
    { key: 'reviewing' as const, label: 'لە پێداچوونەوە' },
    { key: 'contacted' as const, label: 'پەیوەندی پێوەکراوە' },
    { key: 'closed' as const, label: 'داخراوە' },
    { key: 'archived' as const, label: 'ئەرشیف کراوە' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Inbox className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی داواکارییەکان</span>
        </h2>
        <p className="text-xs text-slate-400">
          لێرە دەتوانیت داواکاری، پەیام، داوای دیمۆ و پەیوەندییەکانی بەکارهێنەران بەڕێوەببەیت.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/10 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="گەڕان لە داواکارییەکان..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 bg-slate-950/40 border-slate-800 text-white rounded-xl focus-visible:ring-emerald-500 focus-visible:border-emerald-500 placeholder:text-slate-600 block pe-10"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Scrollable filters wrapper */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto py-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === btn.key
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-900/40 hover:bg-slate-800 text-slate-400 border border-slate-800/60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Table listing intakes */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="bg-slate-900/30 border-slate-800/80 p-5 rounded-2xl transition-all hover:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{item.name}</span>
                  {item.company && (
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                      {item.company}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getIntakeStatusColorClass(item.status)}`}>
                    {getIntakeStatusLabelKu(item.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500">پەیوەندی:</span> <span className="text-slate-200 select-all font-sans">{item.contact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">خزمەتگوزاری:</span> <span className="text-emerald-400 font-semibold">{item.serviceInterest}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">جۆر:</span> <span className="text-slate-200">{item.category}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/25 p-2 rounded-xl border border-slate-900/60 select-all font-sans">
                  {item.message}
                </p>

                {item.adminNote && (
                  <div className="text-[11px] text-amber-500/90 font-sans flex items-center gap-1">
                    <span className="font-bold">تێبینی ناوخۆیی ئادمین:</span>
                    <span className="truncate">{item.adminNote}</span>
                  </div>
                )}
              </div>

              {/* Status and Action controls columns */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/40">
                <Button
                  onClick={() => handleOpenDetail(item)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-bold border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ببینە و تێبینی</span>
                </Button>

                {item.status !== 'reviewing' && (
                  <Button
                    onClick={() => onUpdateStatus(item.id, 'reviewing')}
                    size="sm"
                    className="h-8 text-xs font-black bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 rounded-lg"
                  >
                    پێداچوونەوە
                  </Button>
                )}

                {item.status !== 'contacted' && (
                  <Button
                    onClick={() => onUpdateStatus(item.id, 'contacted')}
                    size="sm"
                    className="h-8 text-xs font-black bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 hover:text-emerald-400 rounded-lg"
                  >
                    پەیوەندی پێوەکرا
                  </Button>
                )}

                {item.status !== 'closed' && (
                  <Button
                    onClick={() => onUpdateStatus(item.id, 'closed')}
                    size="sm"
                    className="h-8 text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg"
                  >
                    داخستن
                  </Button>
                )}

                {item.status !== 'archived' && (
                  <Button
                    onClick={() => onUpdateStatus(item.id, 'archived')}
                    size="sm"
                    className="h-8 text-xs font-semibold bg-purple-500/12 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg"
                  >
                    ئەرشیف
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900/10 border-slate-800/60 p-12 text-center rounded-2xl">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">هیچ داواکارییەک نەدۆزرایەوە</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            هیچ نووسراوێک یان پەیوەندییەک لەگەڵ مەرجی گەڕانەکەتدا یەکناگرێتەوە.
          </p>
        </Card>
      )}

      {/* DETAIL MODAL DRAWER SIMULATION */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="w-full max-w-lg bg-[#0e1423] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-right relative">
            
            {/* Modal header details */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>وردەکاری داواکاری یەک لایەن</span>
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 px-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
              >
                داخستن
              </button>
            </div>

            {/* Content data items list */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">ناوی تەواو</p>
                  <p className="font-bold text-white mt-0.5">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">کۆمپانیا</p>
                  <p className="font-bold text-white mt-0.5">{selectedItem.company || 'نییە'}</p>
                </div>
                <div>
                  <p className="text-slate-500">ڕێگای پەیوەندی</p>
                  <p className="font-bold text-emerald-400 font-sans mt-0.5">{selectedItem.contact}</p>
                </div>
                <div>
                  <p className="text-slate-500">بەرواری ناردن</p>
                  <p className="font-mono text-slate-400 mt-0.5">{formatKuDate(selectedItem.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">پەیام / ناوەڕۆکی داواکاری</p>
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 font-sans select-all leading-relaxed whitespace-pre-wrap">
                  {selectedItem.message}
                </div>
              </div>

              {/* Admin note segment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  تێبینی ناوخۆیی (تەنها بۆ ئادمینەکان مژار دەکرێت)
                </label>
                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="لێرە دەتوانیت سەرنج یان تێبینی نوێ زانیاری کۆبکەیتەوە..."
                  className="w-full h-24 bg-slate-950/80 border border-slate-800 text-white rounded-xl p-3 text-xs focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-600 block resize-none"
                />
              </div>
            </div>

            {/* Modal actions panel footer */}
            <div className="flex items-center gap-2 justify-end pt-2 border-t border-slate-800/80">
              <Button
                onClick={() => setSelectedItem(null)}
                variant="ghost"
                className="h-10 text-xs font-bold font-sans text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl px-4"
              >
                لابردن
              </Button>
              <Button
                onClick={() => {
                  handleSaveNote();
                  setSelectedItem(null);
                }}
                className="h-10 text-xs font-bold font-sans bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 flex items-center gap-1 shadow-lg shadow-emerald-600/10"
              >
                <Save className="w-4 h-4" />
                <span>پاشەکەوتکردن</span>
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
