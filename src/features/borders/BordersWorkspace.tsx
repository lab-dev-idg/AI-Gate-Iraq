import { MapPin, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IRAN_BORDER_STATUS } from '@/src/types';

interface BordersWorkspaceProps {
  lang: 'ku' | 'ar';
  t: any;
}

export const BordersWorkspace = ({ lang, t }: BordersWorkspaceProps) => {
  return (
    <div className="space-y-6 max-w-3xl text-slate-800 dark:text-slate-100">
      <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
            <MapPin className="w-5 h-5 text-rose-500" />
            {t.sidebar.borderStatus}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {IRAN_BORDER_STATUS.map((border) => (
            <div key={border.name} className="space-y-2 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100/50 dark:border-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{border.name}</span>
                <Badge 
                  variant={border.status === 'active' ? 'secondary' : 'destructive'} 
                  className={border.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900'}
                >
                  {border.status === 'active' ? t.sidebar.borderActive : t.sidebar.borderBusy}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>{t.sidebar.waitingTime}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{border.waitTime}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl p-4 text-xs font-sans">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-black font-arabic mb-1">{lang === 'ar' ? 'تنبيه جمركي عاجل' : 'ئاگاداری گومرگی گرنگ'}</strong>
            {lang === 'ar' 
              ? 'قد يزداد وقت الانتظار للشاحنات في منفذ إبراهيم الخليل لأسباب تتعلق بالتدقيق الموسّم وإجراءات المعاينة الفنية. يوصى بمتابعة حالة الانتظار عبر مستشارنا الذكي لسلامة سلسلة التوريد.'
              : 'ڕەنگە کاتی چاوەڕوانی بۆ بارهەڵگرە گەورەکان لە مەرزی نێودەوڵەتی ئیبراهیم خەلیل زیاتر بێت بەهۆی پشکنینی ناوەکی و فەرمیی تایبەت بە کاڵاکان. پێشنیار کراوە هەمیشە گەشتەکەت ڕێکبخەیتەوە.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BordersWorkspace;
