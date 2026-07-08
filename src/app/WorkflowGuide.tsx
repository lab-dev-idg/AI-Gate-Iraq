import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, FileText, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { ServiceKey } from '@/src/lib/services';
import { BUSINESS_WORKFLOWS } from '@/src/lib/businessWorkflows';
import { translations } from '@/src/lib/translations';

interface WorkflowGuideProps {
  activeService: ServiceKey;
  lang: 'ku' | 'ar';
  onQuestionClick: (prompt: string) => void;
}

export const WorkflowGuide = ({ activeService, lang, onQuestionClick }: WorkflowGuideProps) => {
  const workflow = BUSINESS_WORKFLOWS[activeService];
  if (!workflow) return null;

  const wTrans = translations[lang === 'ar' ? 'ar' : 'ku'].workflow || {
    checklistTitle: lang === 'ar' ? 'قائمة تدقيق ودليل خطوات العمل' : 'بۆردی ڕێنمایی و بەرنامەی کار',
    requiredInputs: lang === 'ar' ? 'المعلومات المطلوبة' : 'زانیارییە پێویستەکان',
    documentsLabel: lang === 'ar' ? 'الوثائق والمستندات المطلوبة' : 'بەڵگەنامە و بەڵگەنامەکان',
    risksLabel: lang === 'ar' ? 'المخاطر والتحديات المحتملة' : 'مەترسی و بەربەستە باوەکان',
    nextActionsLabel: lang === 'ar' ? 'الإجراءات والخطوات التالية' : 'هەنگاوە پێشنیارکراوەکان',
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/80 shadow-md bg-white dark:bg-slate-950/40 rounded-2xl overflow-hidden font-arabic transition-all hover:shadow-lg">
      <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-4 py-3.5 border-b border-slate-150 dark:border-slate-800/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
        <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">
          {wTrans.checklistTitle}
        </span>
      </div>

      <CardContent className="p-5 space-y-5 text-xs font-sans">
        {workflow.requiredInputs?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {wTrans.requiredInputs}
            </h4>
            <ul className="space-y-2 pr-1 text-right" dir="rtl">
              {workflow.requiredInputs.map((input, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span className="text-[11px] md:text-xs break-words whitespace-normal font-medium">{lang === 'ar' ? input.ar : input.ku}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {workflow.documents?.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {wTrans.documentsLabel}
            </h4>
            <div className="flex flex-wrap gap-2 justify-start" dir="rtl">
              {workflow.documents.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-350 border-none font-semibold text-[10.5px] py-1 px-3 rounded-lg break-words whitespace-normal">
                  {lang === 'ar' ? item.ar : item.ku}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {workflow.risks?.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {wTrans.risksLabel}
            </h4>
            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2 text-right" dir="rtl">
              {workflow.risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="break-words whitespace-normal font-medium">{lang === 'ar' ? risk.ar : risk.ku}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {workflow.nextActions?.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic">
              <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {wTrans.nextActionsLabel}
            </h4>
            <ol className="space-y-2 pr-1 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 text-right" dir="rtl">
              {workflow.nextActions.map((action, idx) => (
                <li key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <span className="text-emerald-500 font-black shrink-0 text-[11px] mt-0.5">{idx + 1}.</span>
                  <span className="break-words whitespace-normal font-medium">{lang === 'ar' ? action.ar : action.ku}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {workflow.suggestedQuestions?.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            {workflow.suggestedQuestions.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="w-full text-right justify-start text-[11px] font-bold font-arabic rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 text-emerald-700 dark:text-emerald-300 py-3 px-3.5 whitespace-normal leading-relaxed hover:-translate-y-0.5 transition-all flex items-start gap-2"
                onClick={() => onQuestionClick(lang === 'ar' ? q.prompt.ar : q.prompt.ku)}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="break-words whitespace-normal flex-1">{lang === 'ar' ? q.label.ar : q.label.ku}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowGuide;
