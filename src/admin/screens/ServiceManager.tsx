import React, { useState } from 'react';
import { Briefcase, ArrowUp, ArrowDown, Save, Eye, EyeOff, ShieldAlert, Check, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminServiceConfig } from '../adminTypes';

interface ServiceManagerProps {
  services: AdminServiceConfig[];
  onUpdateService: (key: string, patch: Partial<AdminServiceConfig>) => void;
  onReorderService: (key: string, direction: 'up' | 'down') => void;
}

export const ServiceManager = ({ services, onUpdateService, onReorderService }: ServiceManagerProps) => {
  const [selectedKey, setSelectedKey] = useState<string>(services[0]?.key || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edits
  const activeService = services.find(s => s.key === selectedKey) || services[0];

  const [titleKu, setTitleKu] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descriptionKu, setDescriptionKu] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [status, setStatus] = useState<AdminServiceConfig['status']>('active');
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(true);
  const [pilotNoteKu, setPilotNoteKu] = useState('');
  const [pilotNoteAr, setPilotNoteAr] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // When selected service changes, populate fields
  React.useEffect(() => {
    if (activeService) {
      setTitleKu(activeService.titleKu || '');
      setTitleAr(activeService.titleAr || '');
      setDescriptionKu(activeService.descriptionKu || '');
      setDescriptionAr(activeService.descriptionAr || '');
      setStatus(activeService.status || 'active');
      setEnabled(activeService.enabled !== false);
      setVisible(activeService.visible !== false);
      setPilotNoteKu(activeService.pilotNoteKu || '');
      setPilotNoteAr(activeService.pilotNoteAr || '');
      setAdminNote(activeService.adminNote || '');
    }
  }, [selectedKey, activeService]);

  const handleSave = () => {
    if (!selectedKey) return;
    onUpdateService(selectedKey, {
      titleKu,
      titleAr,
      descriptionKu,
      descriptionAr,
      status,
      enabled,
      visible,
      pilotNoteKu,
      pilotNoteAr,
      adminNote
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleActive = (val: boolean) => {
    setEnabled(val);
    setStatus(val ? 'active' : 'disabled');
  };

  // Sort services by order for listing
  const sortedServices = [...services].sort((a,b) => a.order - b.order);

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Heading section */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی خزمەتگوزارییەکان</span>
        </h2>
        <p className="text-xs text-slate-400">
          ڕێکخستن، ڕیزبەندکردن، و پیشاندانی خزمەتگوزاری و مۆدیولەکانی ماڵپەڕ لە بەردەست بەکارهێنەران بەبێ دەستکاری لۆجیکەکەی.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Tab column: Services selection list with sorting */}
        <div className="space-y-3">
          <Card className="bg-slate-900/40 border-slate-800 p-4 rounded-2xl space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">لیستی خزمەتگوزارییەکان ({services.length})</h3>
            
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {sortedServices.map((service, index) => {
                const isActive = service.key === selectedKey;
                return (
                  <div
                    key={service.key}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-sans ${
                      isActive
                        ? 'bg-emerald-600/15 border-emerald-500/30 text-white font-bold'
                        : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800 text-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedKey(service.key)}
                      className="flex-1 text-right py-0.5 truncate outline-none select-none px-1"
                    >
                      <span className="text-[10px] text-slate-500 font-mono me-1.5">#{service.order}</span>
                      <span>{service.titleKu}</span>
                    </button>

                    {/* Quick Move and status indicators */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderService(service.key, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
                        title="بەرزکردنەوە"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderService(service.key, 'down');
                        }}
                        disabled={index === sortedServices.length - 1}
                        className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-900 transition-colors"
                        title="نزمکردنەوە"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-slate-900/30 border-slate-850 p-4 rounded-2xl text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">چۆنیەتی کارکردن:</p>
            <p>ڕیزبەندی سەرەوە یەکسەر دەردەکەوێت لە دەروازەی ماڵپەڕەکەدا. دەتوانیت هەر بەشێک ناچالاک یان تەنها دیمۆ نیشان بدەیت لە کاتی گۆڕینی دۆخەکەدا.</p>
          </Card>
        </div>

        {/* Left main: Service Configurator Editor */}
        <div className="lg:col-span-2">
          {activeService ? (
            <Card className="bg-slate-900/30 border-slate-800 p-6 rounded-2xl space-y-5">
              
              {/* Service Title and Indicators */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">{titleKu || activeService.titleKu}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">سروشت: {activeService.key} • ناسێنەری ناوخۆیی</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  }`}>
                    {enabled ? 'چالاککراو' : 'ناچالاک'}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">ناوی کوردی (سۆرانی)</label>
                  <Input
                    value={titleKu}
                    onChange={(e) => setTitleKu(e.target.value)}
                    className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-300 block">الاسم باللغة العربية</label>
                  <Input
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block">وەسفی کوردی</label>
                  <textarea
                    value={descriptionKu}
                    onChange={(e) => setDescriptionKu(e.target.value)}
                    rows={2.5}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block">الوصف باللغة العربية</label>
                  <textarea
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    rows={2.5}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-right font-sans"
                    dir="rtl"
                  />
                </div>

                {/* Status Toggles and Selector dropdowns */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">دۆخی دیاریکراوی خزمەتگوزاری</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 text-xs focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">چالاک (Active)</option>
                    
                    <option value="coming_soon">بەم زووانە (Coming Soon)</option>
                    <option value="disabled">لەکارخراوە (Disabled)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">ڕیزبەندی دەستپێک (Order Index)</label>
                  <Input
                    type="number"
                    value={activeService.order}
                    disabled
                    className="bg-slate-950/30 border-slate-800/40 text-slate-400 text-xs rounded-xl h-10 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">ڕیزبەندی بە شێوەی کارلێکەر بە لای ڕاستدا ڕێکدەخرێت.</span>
                </div>

                {/* Quick Toggle Switches */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
                    <div className="space-y-0.5 text-right">
                      <span className="text-xs font-bold text-slate-200 block">خزمەتگوزارییە چالاکە؟</span>
                      <span className="text-[10px] text-slate-500 block">ئایا مۆدیولەکە وەڵام بداتەوە؟</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(!enabled)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-all ${
                        enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                      } flex items-center`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white block" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
                    <div className="space-y-0.5 text-right">
                      <span className="text-xs font-bold text-slate-200 block">دیار بێت لە لیستدا؟</span>
                      <span className="text-[10px] text-slate-500 block">نیشاندانی دوگمەکەی لە سەرەکی</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      className={`w-10 h-5.5 rounded-full p-0.5 transition-all ${
                        visible ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                      } flex items-center`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white block" />
                    </button>
                  </div>

                </div>

                {/* Optional Pilot Notes fields */}
                <div className="space-y-1.5 sm:col-span-2 pt-1">
                  <label className="text-xs font-bold text-slate-300 block">تێبینی بەکارهێنان</label>
                  <Input
                    value={pilotNoteKu}
                    onChange={(e) => setPilotNoteKu(e.target.value)}
                    placeholder="تێبینی بەکارهێنان بنووسە..."
                    className="bg-slate-950/60 border-slate-800 text-slate-200 text-xs rounded-xl h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 block">تێبینی ناوخۆیی بەڕێوەبەر (تەنها لێرە دەبینرێت)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={1.5}
                    placeholder="تێبینی ناوخۆیی..."
                    className="w-full bg-slate-950/20 border border-slate-800 text-slate-400 text-xs rounded-xl p-2 resize-none"
                  />
                </div>

              </div>

              {saveSuccess && (
                <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                  ڕێکخستنەکانی خزمەتگوزاری {titleKu || activeService.titleKu} بەسەرکەوتوویی پاشەکەوت کرا و چالاک کرا!
                </p>
              )}

              {/* Save row buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
                <Button
                  onClick={() => handleToggleActive(!enabled)}
                  variant="outline"
                  size="sm"
                  className={`h-9 text-xs rounded-xl px-3 font-bold border-slate-850 ${
                    enabled ? 'hover:text-rose-400 hover:bg-rose-500/10' : 'hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {enabled ? 'ناچالاککردن' : 'چالاککردن'}
                </Button>

                <Button
                  onClick={handleSave}
                  size="sm"
                  className="h-9 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl px-4 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>پاشەکەوتکردن</span>
                </Button>
              </div>

            </Card>
          ) : (
            <div className="p-8 text-center text-slate-500">هیچ خزمەتگوزارییەک لە بەردەستدا نییە.</div>
          )}
        </div>

      </div>
    </div>
  );
};
