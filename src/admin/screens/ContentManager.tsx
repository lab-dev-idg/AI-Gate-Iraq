import React, { useState, useEffect } from 'react';
import { FileText, Save, Eye, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminContentSection } from '../adminTypes';

interface ContentManagerProps {
  contents: AdminContentSection[];
  onUpdateContent: (id: string, patch: Partial<AdminContentSection>) => void;
  onResetToDefault: () => void;
}

export const ContentManager = ({ contents, onUpdateContent, onResetToDefault }: ContentManagerProps) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [titleKu, setTitleKu] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [internalKey, setInternalKey] = useState('');
  const [bodyKu, setBodyKu] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [visible, setVisible] = useState(true);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load the first content section by default
  useEffect(() => {
    if (contents.length > 0 && !selectedId) {
      setSelectedId(contents[0].id);
    }
  }, [contents, selectedId]);

  // Sync state with selected content section
  useEffect(() => {
    const section = contents.find(c => c.id === selectedId);
    if (section) {
      setTitleKu(section.titleKu || '');
      setTitleAr(section.titleAr || '');
      setInternalKey(section.key || '');
      setBodyKu(section.bodyKu || '');
      setBodyAr(section.bodyAr || '');
      setVisible(section.visible !== false);
    }
  }, [selectedId, contents]);

  const handleSave = () => {
    if (!selectedId) return;
    onUpdateContent(selectedId, {
      titleKu,
      titleAr,
      key: internalKey,
      bodyKu,
      bodyAr,
      visible
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    const section = contents.find(c => c.id === selectedId);
    if (section) {
      setTitleKu(section.titleKu || '');
      setTitleAr(section.titleAr || '');
      setInternalKey(section.key || '');
      setBodyKu(section.bodyKu || '');
      setBodyAr(section.bodyAr || '');
      setVisible(section.visible !== false);
    }
  };

  const selectedSection = contents.find(c => c.id === selectedId);

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Heading Group */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی ناوەڕۆکی لاپەڕەکان</span>
        </h2>
        <p className="text-xs text-slate-400">
          لێرە دەتوانیت ناونیشان، وەسف، ئاگاداری و دەقی بەشەکانی پلاتفۆرم بگۆڕیت بەبێ دەستکاری کۆد.
        </p>
      </div>

      {/* Select and Control Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-5">
            
            {/* Dropdown Selector */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 block">هەڵبژاردنی بەشی ناوەڕۆک بۆ دەستکاریکردن</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 text-xs focus:ring-emerald-500 focus:border-emerald-500 font-sans"
              >
                {contents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titleKu || c.key} — ({c.key})
                  </option>
                ))}
              </select>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">ناونیشان بە کوردی (Sorani)</label>
                <Input
                  value={titleKu}
                  onChange={(e) => setTitleKu(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">الترجمة العربية (العنوان)</label>
                <Input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10 text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 block">ناسێنەری ناوخۆیی (English / Internal Key)</label>
                <Input
                  value={internalKey}
                  onChange={(e) => setInternalKey(e.target.value)}
                  className="bg-slate-950/30 border-slate-800/60 text-slate-400 text-xs rounded-xl h-10 font-mono"
                  disabled
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">ناسێنەری سیستەمی کۆکەن ناتوانرێت هاوبەش بکرێت بۆ ڕێگریکردن لە شکانی پلاتفۆرم.</span>
              </div>

              {/* Textareas for Large Description texts */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block">وەسف / دەقی بەشەکە بە کوردی</label>
                <textarea
                  value={bodyKu}
                  onChange={(e) => setBodyKu(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block">النص أو المتن باللغة العربية</label>
                <textarea
                  value={bodyAr}
                  onChange={(e) => setBodyAr(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-right font-sans"
                  dir="rtl"
                />
              </div>

              {/* Visible status toggler */}
              <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80 mt-1">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">پیشاندان لە ڕوکاردا (Visible Status)</p>
                  <p className="text-[10px] text-slate-500">ئایا دەتەوێت ئەم ناونیشانە یەکسەر بەکاربهێنرێت لەسەر ڕوپەڕی سەرەکی بازاڕەکەدا؟</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className={`w-11 h-6 rounded-full p-1 transition-all ${
                    visible ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                  } flex items-center`}
                >
                  <span className="w-4 h-4 rounded-full bg-white block" />
                </button>
              </div>

            </div>

            {/* Error alerts or saved confirmations */}
            {saveSuccess && (
              <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                بەسەرکەوتوویی پاشەکەوت کرا! گۆڕانکارییەکان ئێستا چالاکن بۆ بەکارهێنەران.
              </p>
            )}

            {/* Actions panel */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 mt-4">
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-10 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl px-4 font-bold"
              >
                هەڵوەشاندنەوە
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs text-slate-300 border-slate-800 hover:bg-slate-800 rounded-xl px-3.5 font-bold"
                >
                  <Eye className="w-4 h-4 me-1" />
                  <span>پێشبینین</span>
                </Button>

                <Button
                  onClick={handleSave}
                  size="sm"
                  className="h-10 text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl px-5 font-bold gap-1 shadow-lg shadow-emerald-600/15"
                >
                  <Save className="w-4 h-4" />
                  <span>پاشەکەوتکردن</span>
                </Button>
              </div>
            </div>

          </Card>
        </div>

        {/* Right Side: Info Panel & Interactive Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-900/30 border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2.5">زانیاری گرنگی بەش</h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-400">
              <p>
                ئەم بەشە بە تەواوی ئۆتۆماتیکی (No-Code Command) تەنها بە نوێکردنەوەی ئەم فۆڕمە سەرجەم دەقەکانی سەر لاپەڕەی گشتی بەخێرهاتن گۆڕانکاریان تێدا دەکرێت.
              </p>
              <div className="bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl flex items-start gap-2 text-amber-500">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-normal font-medium">
                  لەم وەشانە تاقیکارییەدا، پاشەکەوتکردن بە فەرمی لە LocalStorage دەپارێزرێت بۆ ئەوەی بێ زانینی هێڵی داتابەیس پشکنینەکان کارا بن.
                </p>
              </div>
            </div>
            <div className="pt-1.5">
              <Button
                onClick={() => {
                  if (window.confirm('ئایا دڵنیای لە گەڕاندنەوەی سەرجەم ناوەڕۆکەکان بۆ وەشانی نەخشە بنەڕەتییەکە؟')) {
                    onResetToDefault();
                  }
                }}
                variant="ghost"
                className="w-full h-9 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 text-[11px] font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5 me-1" />
                <span>گەڕاندنەوە بۆ بنەڕەت</span>
              </Button>
            </div>
          </Card>

          {/* Collapsible Preview Section */}
          {(isPreviewOpen || true) && (
            <Card className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">نموونەی بینینی خێرا</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-400">RTL RTL</span>
              </div>
              
              <div className="space-y-3 text-right">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">کوردی سۆرانی</p>
                  <h4 className="text-sm font-extrabold text-white">{titleKu || 'لێرە ناونیشان دەبینرێت'}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{bodyKu || 'لێرە دەقی تەواو یان وەسف نیشان دەدرێت...'}</p>
                </div>
                
                <div className="h-px bg-slate-900" />
                
                <div className="space-y-1" dir="rtl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">الترجمة العربية</p>
                  <h4 className="text-sm font-extrabold text-white">{titleAr || 'هنا يظهر العنوان العربي'}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{bodyAr || 'هنا يظهر تفصيل وشرح المتن المترجم...'}</p>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
};
