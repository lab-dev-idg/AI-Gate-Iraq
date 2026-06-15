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

export const WorkflowGuide = ({
  activeService,
  lang,
  onQuestionClick,
}: WorkflowGuideProps) => {
  const workflow = BUSINESS_WORKFLOWS[activeService];
  if (!workflow) return null;

  const wTrans = translations[lang === 'ar' ? 'ar' : 'ku'].workflow || {
    checklistTitle: lang === 'ar' ? 'قائمة تدقيق ودليل خطوات العمل' : 'بۆردی ڕێنمایی و بەرنامەی کار',
    requiredInputs: lang === 'ar' ? 'المعلومات المطلوبة' : 'زانیارییە پێویستەکان',
    documentsLabel: lang === 'ar' ? 'الوثائق والمستندات المطلوبة' : 'دۆکیومێنت و بەڵگەنامەکان',
    risksLabel: lang === 'ar' ? 'المخاطر والتحديات المحتملة' : 'مەترسی و بەربەستە باوەکان',
    nextActionsLabel: lang === 'ar' ? 'الإجراءات والخطوات التالية' : 'هەنگاوە پێشنیارکراوەکان',
    askNextSteps: lang === 'ar' ? 'ما هي هذه الخطوات بالتفصيل؟' : 'ڕێگەچارە و هەنگاوەکان چیین؟',
    askDocs: lang === 'ar' ? 'ما هي الوثائق المطلوبة؟' : 'چ بەڵگە جێگیرێک پێویستە؟',
    askPrepare: lang === 'ar' ? 'اكتب لي مسودة طلب شراء رسمی' : 'داوا بکە بابەت بۆ بنووسێ',
    explainResult: lang === 'ar' ? 'اشرح لي هذه النتيجة' : 'ئەم ئەنجامەم بۆ ڕوون بکەوە',
    demoLabel: lang === 'ar' ? 'بيانات تجريبية / محاكاة محدودة' : 'داتای تەمسیلی و سنووردار'
  };

  return (
    <Card className="w-full max-w-full min-w-0 border border-slate-200/60 dark:border-slate-800/80 shadow-md bg-white dark:bg-slate-950/40 rounded-2xl overflow-hidden font-arabic transition-shadow hover:shadow-lg">
      <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-3 sm:px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-800 dark:text-white leading-relaxed break-words min-w-0">
            {wTrans.checklistTitle}
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 whitespace-normal sm:whitespace-nowrap shrink-0 leading-relaxed">
          {wTrans.demoLabel}
        </Badge>
      </div>
      
      <CardContent className="p-3 sm:p-4 space-y-4 text-xs font-sans min-w-0">
        {workflow.requiredInputs && workflow.requiredInputs.length > 0 && (
          <div className="space-y-2 min-w-0">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic leading-relaxed">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="break-words">{wTrans.requiredInputs}</span>
            </h4>
            <ul className="space-y-1.5 min-w-0">
              {workflow.requiredInputs.map((input, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-relaxed min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span className="break-words min-w-0">{lang === 'ar' ? input.ar : input.ku}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {workflow.documents && workflow.documents.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 min-w-0">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic leading-relaxed">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="break-words">{wTrans.documentsLabel}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {workflow.documents.map((doc, idx) => (
                <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-none font-medium text-[10px] py-1 px-2.5 rounded-lg whitespace-normal leading-relaxed">
                  {lang === 'ar' ? doc.ar : doc.ku}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {workflow.risks && workflow.risks.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 min-w-0">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic leading-relaxed">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="break-words">{wTrans.risksLabel}</span>
            </h4>
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1.5 min-w-0">
              {workflow.risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[10.5px] text-rose-700 dark:text-rose-300 leading-relaxed min-w-0">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span className="break-words min-w-0">{lang === 'ar' ? risk.ar : risk.ku}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {workflow.nextActions && workflow.nextActions.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 min-w-0">
            <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-arabic leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="break-words">{wTrans.nextActionsLabel}</span>
            </h4>
            <ol className="space-y-1.5 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 min-w-0">
              {workflow.nextActions.map((action, idx) => (
                <li key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed flex gap-1.5 min-w-0">
                  <span className="text-emerald-500 font-bold shrink-0">{idx + 1}.</span>
                  <span className="break-words min-w-0">{lang === 'ar' ? action.ar : action.ku}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {workflow.suggestedQuestions && workflow.suggestedQuestions.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-4 min-w-0">
            {workflow.suggestedQuestions.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="w-full min-h-10 h-auto justify-start text-[11px] font-bold font-arabic rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-2 whitespace-normal leading-relaxed hover:-translate-y-0.5 transition-all text-start flex items-center gap-2 min-w-0"
                onClick={() => onQuestionClick(lang === 'ar' ? q.prompt.ar : q.prompt.ku)}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="break-words min-w-0">{lang === 'ar' ? q.label.ar : q.label.ku}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowGuide;