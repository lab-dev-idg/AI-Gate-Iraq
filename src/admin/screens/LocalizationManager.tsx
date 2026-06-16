import React, { useState, useEffect } from 'react';
import { Languages, Search, Save, Download, Plus, Trash2, HelpCircle, FileJson } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TermItem {
  key: string;
  ku: string;
  ar: string;
  notes: string;
}

const DEFAULT_TERMS: TermItem[] = [
  { key: 'ui_send', ku: 'بنێرە', ar: 'إرسال', notes: 'ದುگمەی ناردنی نامە لە چات' },
  { key: 'ui_placeholder', ku: 'پرسیارێک بنووسە لێرە...', ar: 'اكتب سؤالك هنا...', notes: 'جێگەی تێکستی نووسینی نامە' },
  { key: 'ui_new_chat', ku: 'گفتوگۆیەکی نوێ', ar: 'محادثة جديدة', notes: 'سەرپەرشتیکردنی قۆناغی چاتی نوێ' },
  { key: 'ui_advisor_title', ku: 'ڕاوێژکاری بازرگانی ژیری دەستکرد', ar: 'مستشار الأعمال الذكي', notes: 'ناونیشانی مۆدیولی سەرەکی' },
  { key: 'ui_submit', ku: 'تەواوکردن', ar: 'إرسال الطلب', notes: 'دوگمەی پێشکەشکردنی فۆرمەکان' },
  { key: 'ui_search', ku: 'بگەڕێ...', ar: 'بحث...', notes: 'تیپینی گەڕان بە گشتی' },
  { key: 'ui_no_data', ku: 'زانیاری نەدۆزرایەوە', ar: 'لم يتم العثور على بيانات', notes: 'تێکستی پێش نیشاندانی داتا' },
  { key: 'ui_loading', ku: 'کەمێک چاوەڕوان بە...', ar: 'جاري التحميل...', notes: 'دۆخی کارکردنی بارکردن' }
];

export const LocalizationManager = () => {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newKu, setNewKu] = useState('');
  const [newAr, setNewAr] = useState('');
  const [newNotes, setNewNotes] = useState('');
  
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editKu, setEditKu] = useState('');
  const [editAr, setEditAr] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);

  // Load from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('aigate_admin_localization_terms');
    if (saved) {
      try {
        setTerms(JSON.parse(saved));
      } catch (err) {
        setTerms(DEFAULT_TERMS);
      }
    } else {
      setTerms(DEFAULT_TERMS);
    }
  }, []);

  const saveToStorage = (updated: TermItem[]) => {
    setTerms(updated);
    localStorage.setItem('aigate_admin_localization_terms', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreate = () => {
    if (!newKey.trim()) return;
    if (terms.some(t => t.key === newKey.trim())) {
      alert('ئەم کلیلە پێشتر تۆمارکراوە!');
      return;
    }

    const newItem: TermItem = {
      key: newKey.trim().toLowerCase(),
      ku: newKu.trim(),
      ar: newAr.trim(),
      notes: newNotes.trim()
    };

    const updated = [...terms, newItem];
    saveToStorage(updated);
    
    // Reset inputs
    setNewKey('');
    setNewKu('');
    setNewAr('');
    setNewNotes('');
  };

  const handleDelete = (key: string) => {
    if (window.confirm('ئایا دڵنیای لە سڕینەوەی ئەم دەستەواژەیە؟')) {
      const updated = terms.filter(t => t.key !== key);
      saveToStorage(updated);
    }
  };

  const startEdit = (term: TermItem) => {
    setEditingKey(term.key);
    setEditKu(term.ku);
    setEditAr(term.ar);
    setEditNotes(term.notes);
  };

  const handleSaveEdit = (key: string) => {
    const updated = terms.map(t => {
      if (t.key === key) {
        return { ...t, ku: editKu, ar: editAr, notes: editNotes };
      }
      return t;
    });
    saveToStorage(updated);
    setEditingKey(null);
  };

  // Filter
  const filteredTerms = terms.filter(t => 
    t.key.includes(searchQuery.toLowerCase()) ||
    t.ku.includes(searchQuery) ||
    t.ar.includes(searchQuery) ||
    t.notes.includes(searchQuery)
  );

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(terms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ai_gate_iraq_translations.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Header labels */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Languages className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی وەرگێڕان و مۆدیولی سەرەکی</span>
        </h2>
        <p className="text-xs text-slate-400">
          سازکردنی گشتی فەرهەنگی وشە و کاروبارەکانی پلاتفۆرم بە دوو زمانی فەرمی (Kurdish Sorani & Arabic) بە نۆ کۆدینگ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: Terms table/cards and search */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search Panel bar */}
          <Card className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="گەڕان بەپێی کلیل یان وەرگێڕان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800/80 rounded-xl pr-10 pl-3 text-xs text-slate-200 placeholder-slate-500 font-sans outline-none focus:border-emerald-500"
              />
            </div>

            <Button
              onClick={handleExportJson}
              variant="outline"
              size="sm"
              className="h-10 text-xs border-slate-800 hover:bg-slate-800 rounded-xl px-4 font-bold text-slate-300 gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>داگرتنی گشتی (JSON)</span>
            </Button>
          </Card>

          {saveSuccess && (
            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
              وەرگێڕانەکان پاشەکەوت کران و نوێکراونەتەوە لە فۆڕمی بەکارهێناندا!
            </p>
          )}

          {/* Terms grid cards */}
          <div className="space-y-3">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term) => {
                const isEditing = editingKey === term.key;
                return (
                  <Card key={term.key} className="bg-slate-900/20 border-slate-800 p-4.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-805 pb-2">
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">{term.key}</span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              handleSaveEdit(term.key);
                            } else {
                              startEdit(term);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-slate-950/60 border border-slate-850 hover:bg-slate-800 text-[10px] font-bold text-emerald-400 transition-colors"
                        >
                          {isEditing ? 'پاشەکەوت' : 'دەستکاری'}
                        </button>
                        
                        <button
                          onClick={() => handleDelete(term.key)}
                          className="p-1 rounded hover:bg-rose-500/10 text-slate-600 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold">کوردی</span>
                            <Input
                              value={editKu}
                              onChange={(e) => setEditKu(e.target.value)}
                              className="bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold block text-right">العربية</span>
                            <Input
                              value={editAr}
                              onChange={(e) => setEditAr(e.target.value)}
                              className="bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl text-right"
                              dir="rtl"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold">تێبینی یان شوێن</span>
                          <Input
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">کوردی:</span>
                            <span className="font-semibold text-slate-200">{term.ku || 'مەوجوود نییە'}</span>
                          </div>
                          <div className="text-right" dir="rtl">
                            <span className="text-[10px] text-slate-500 font-bold block">العربية:</span>
                            <span className="font-semibold text-slate-200">{term.ar || 'غير متوفر'}</span>
                          </div>
                        </div>
                        
                        {term.notes && (
                          <div className="pt-1.5 border-t border-slate-900 text-[10px] text-slate-500">
                            مەبەست: {term.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            ) : (
              <Card className="bg-slate-900/10 border border-slate-800 p-8 text-center rounded-2xl">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">هیچ ئەنجامێک بۆ گەڕانەکەت نەدۆزرایەوە</h3>
                <p className="text-xs text-slate-500 mt-1">تکایە دەستەواژەی دی تاقیکەوە یان کلیلێکی نوێ زیاد بکە.</p>
              </Card>
            )}
          </div>

        </div>

        {/* Right side: Add translations form */}
        <div className="space-y-6">
          <Card className="bg-slate-900/30 border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>زیادکردنی کلیلی نوێ</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">کلیلی زمانی (Language Key)</label>
                <Input
                  placeholder="نموونە: ui_welcome"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">وەرگێڕانی کوردی (Soranî)</label>
                <Input
                  placeholder="تێکستی کوردی"
                  value={newKu}
                  onChange={(e) => setNewKu(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">الترجمة العربية</label>
                <Input
                  placeholder="الوصف بالعربية"
                  value={newAr}
                  onChange={(e) => setNewAr(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10 text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block">تێبینی شوێن (Notes)</label>
                <Input
                  placeholder="دەکەوێتە کام لاپەڕەوە..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10"
                />
              </div>

              <Button
                onClick={handleCreate}
                disabled={!newKey.trim()}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold gap-1 shadow-lg shadow-emerald-600/15"
              >
                <Plus className="w-4 h-4" />
                <span>تۆمارکردنی نوێ</span>
              </Button>
            </div>
          </Card>

          {/* Export / JSON section */}
          <Card className="bg-slate-900/20 border-slate-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300">مەبەست و گواستنەوە</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              سیستەمەکە لێرەوە دەتوانێت فایلی گشتی زمان بۆ کاتبهێندرێتە دەرەوە و لە قۆناغی بەرهەمهێنان بەکاربهێنرێت بەبێ کێشە.
            </p>
            <Button
              onClick={() => setShowJsonExport(!showJsonExport)}
              variant="outline"
              size="sm"
              className="w-full h-9 text-xs border-slate-800 text-slate-400 font-bold rounded-lg"
            >
              <FileJson className="w-3.5 h-3.5 me-1" />
              <span>پیشاندان لەم لاپەڕەیەدا</span>
            </Button>

            {showJsonExport && (
              <textarea
                readOnly
                value={JSON.stringify(terms, null, 2)}
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[9px] text-emerald-400 resize-none mt-2"
              />
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
