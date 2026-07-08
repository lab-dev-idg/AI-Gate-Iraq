import React, { useState } from 'react';
import { Route, Save, Trash2, ArrowUp, ArrowDown, Plus, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminWorkflowStep, AdminServiceConfig } from '../adminTypes';

interface WorkflowManagerProps {
  workflows: AdminWorkflowStep[];
  services: AdminServiceConfig[];
  onAddWorkflow: (serviceKey: string) => void;
  onDeleteWorkflow: (id: string) => void;
  onUpdateWorkflow: (id: string, patch: Partial<AdminWorkflowStep>) => void;
  onReorderWorkflow: (id: string, direction: 'up' | 'down') => void;
}

export const WorkflowManager = ({
  workflows,
  services,
  onAddWorkflow,
  onDeleteWorkflow,
  onUpdateWorkflow,
  onReorderWorkflow
}: WorkflowManagerProps) => {
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>('kyc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form buffer states
  const [titleKu, setTitleKu] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descriptionKu, setDescriptionKu] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Filter workflows by selected service
  const filteredWorkflows = workflows
    .filter((w) => w.serviceKey === selectedServiceKey)
    .sort((a,b) => a.order - b.order);

  const startEdit = (step: AdminWorkflowStep) => {
    setEditingId(step.id);
    setTitleKu(step.titleKu || '');
    setTitleAr(step.titleAr || '');
    setDescriptionKu(step.descriptionKu || '');
    setDescriptionAr(step.descriptionAr || '');
    setEnabled(step.enabled !== false);
  };

  const handleSaveWorkflow = (id: string) => {
    onUpdateWorkflow(id, {
      titleKu,
      titleAr,
      descriptionKu,
      descriptionAr,
      enabled
    });
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddNew = () => {
    onAddWorkflow(selectedServiceKey);
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Header labels */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Route className="w-5 h-5 text-emerald-400" />
          <span>بەڕێوەبردنی ڕێڕەوی کار و هەنگاوەکان</span>
        </h2>
        <p className="text-xs text-slate-400">
          هەنگاوەکانی یارمەتی کۆمپانیاکان یاخود تاقیکردنەوە گومرگییەکان لێرەوە ڕێکبخە لە شێوازی قۆناغی چالاکدا.
        </p>
      </div>

      {/* Select filter & addition button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/15 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap">پاڵاوتن بەپێی خزمەتگوزاری:</span>
          <select
            value={selectedServiceKey}
            onChange={(e) => {
              setSelectedServiceKey(e.target.value);
              setEditingId(null);
            }}
            className="h-10 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 text-xs focus:ring-emerald-500 font-sans min-w-[200px]"
          >
            {services.map((s) => (
              <option key={s.key} value={s.key}>
                {s.titleKu}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleAddNew}
          className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold gap-1.5 shadow-lg shadow-emerald-600/15 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>زیادکردنی هەنگاوی نوێ</span>
        </Button>
      </div>

      {saveSuccess && (
        <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
          هەنگاو بە سەرکەوتوویی پاشەکەوت کرا!
        </p>
      )}

      {/* Steps listing */}
      {filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredWorkflows.map((step, index) => {
            const isEditing = editingId === step.id;
            return (
              <Card key={step.id} className="bg-slate-900/30 border-slate-800/80 p-5 rounded-2xl space-y-4">
                
                {/* Step info header */}
                <div className="flex items-start justify-between border-b border-slate-800/60 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono">ناسێنەری هەنگاو: {step.id} • قۆناغی ژمارە {step.order}</span>
                    <h4 className="text-sm font-extrabold text-white">
                      {isEditing ? (
                        <span className="text-emerald-400">ئێستا دەستکاری دەکرێت...</span>
                      ) : (
                        step.titleKu || 'ناوی هەنگاو'
                      )}
                    </h4>
                  </div>

                  {/* Order switch panel buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onReorderWorkflow(step.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-950"
                      title="بەرزکردنەوە"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onReorderWorkflow(step.id, 'down')}
                      disabled={index === filteredWorkflows.length - 1}
                      className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-950"
                      title="نزمکردنەوە"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-px bg-slate-800 mx-1" />

                    <button
                      onClick={() => {
                        if (window.confirm('ئایا دڵنیای لە سڕینەوەی ئەم هەنگاوە؟')) {
                          onDeleteWorkflow(step.id);
                        }
                      }}
                      className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"
                      title="سڕینەوە"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form fields OR text presentation */}
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold">ناوی هەنگاو بە کوردی</label>
                      <Input
                        value={titleKu}
                        onChange={(e) => setTitleKu(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold block text-right">عنوان الخطوة باللغة العربية</label>
                      <Input
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-200 text-xs rounded-xl text-right"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs text-slate-400 font-bold">ڕوونکردنەوەی هەنگاوەکە بە کوردی</label>
                      <textarea
                        value={descriptionKu}
                        onChange={(e) => setDescriptionKu(e.target.value)}
                        rows={2.5}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs text-slate-400 font-bold block text-right">الشرح باللغة العربية</label>
                      <textarea
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        rows={2.5}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 resize-none text-right font-sans"
                        dir="rtl"
                      />
                    </div>

                    {/* Status active switch */}
                    <div className="sm:col-span-2 flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
                      <span className="text-xs font-bold text-slate-300">ڕێپێدراو (Active Status)</span>
                      <button
                        onClick={() => setEnabled(!enabled)}
                        className={`w-9 h-5 rounded-full p-0.5 ${
                          enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                        } flex items-center transition-all`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-white block" />
                      </button>
                    </div>

                    {/* Save actions panels */}
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-1 border-t border-slate-900/60">
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="ghost"
                        size="sm"
                        className="h-8.5 rounded-lg text-xs font-bold"
                      >
                        لابردن
                      </Button>
                      <Button
                        onClick={() => handleSaveWorkflow(step.id)}
                        size="sm"
                        className="h-8.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white px-3.5 animate-in"
                      >
                        پاشەکەوتکردن
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-4 text-slate-400 leading-normal">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold">ناوی هەنگاو (کوردی):</span>
                        <span className="font-semibold text-slate-200">{step.titleKu}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold text-right">الاسم بالعربية:</span>
                        <span className="font-semibold text-slate-200 block text-right">{step.titleAr}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2">
                      <div>
                        <span className="text-slate-500 text-[10px] font-bold block">وەسف بە کوردی:</span>
                        <p className="font-sans text-slate-300 leading-relaxed text-xs">{step.descriptionKu}</p>
                      </div>
                      <div className="h-px bg-slate-900" />
                      <div>
                        <span className="text-slate-500 text-[10px] font-bold block text-right">الوصف بالعربية:</span>
                        <p className="font-sans text-slate-300 leading-relaxed text-xs text-right" dir="rtl">{step.descriptionAr}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span className={`px-2 py-0.5 rounded ${step.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {step.enabled ? 'چالاککراوە' : 'ناچالاک'}
                      </span>
                      <Button
                        onClick={() => startEdit(step)}
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] font-bold hover:bg-slate-800 text-emerald-400 hover:text-emerald-300"
                      >
                        دەستکاریکردنی هەنگاو
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-slate-900/10 border-slate-800 p-8 text-center rounded-2xl">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">هیچ قۆناغ یان ڕێڕەوێک ساز نەکراوە</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            بۆ هاندانی کۆمپانیاکان لەم مۆدیولەدا تکایە قۆناغێکی کار زیاد بکە.
          </p>
        </Card>
      )}

    </div>
  );
};
