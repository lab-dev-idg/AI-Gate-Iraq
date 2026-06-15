import { Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MarketWorkspaceProps {
  lang: 'ku' | 'ar';
  t: any;
}

export const MarketWorkspace = ({ lang, t }: MarketWorkspaceProps) => {
  return (
    <div className="space-y-6 max-w-3xl text-slate-800 dark:text-slate-100">
      <Card className="border border-emerald-500/10 shadow-md bg-gradient-to-br from-slate-950 via-slate-900 to-primary text-white rounded-2xl p-5">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2 font-arabic text-emerald-400">
            <Sparkles className="w-5 h-5 text-emerald-400 font-bold" />
            {t.sidebar.marketSummary}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-5">
          <div className="space-y-1.5">
            <p className="text-xs text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.newTariff}</p>
            <p className="text-sm leading-relaxed text-slate-100">{t.sidebar.newTariffDesc}</p>
            <p className="text-xs text-slate-300 mt-2">
              {lang === 'ar' 
                ? 'تم إدخال بعض الخطوات الإضافية لتسهيل إجراءات الإعفاءات ومنع الازدواجات الضريبية في العام الجديد ٢٠٢٦.' 
                : 'چەند هەنگاوێکی نوێ گرتراونەتە بەر بە مەبەستی ڕێگریکردن لە دووجار باجدان و ئاسانکردنی لێخۆشبوونە گومرگییەکان.'}
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <div className="space-y-1.5">
            <p className="text-xs text-emerald-300 uppercase font-black tracking-widest">{t.sidebar.procedures}</p>
            <p className="text-sm leading-relaxed text-slate-100">{t.sidebar.proceduresDesc}</p>
            <p className="text-xs text-slate-300 mt-2">
              {lang === 'ar' 
                ? 'نظام الجمارك المحوسب (أسيكودا) يبسط كافة تفاصيل تقديم المنافستو الجمركي بنسبة خطأ قليلة.'
                : 'سیستەمی ئەلیکترۆنی ئاسیکۆدا دەبێتە هۆی کەمکردنەوەی جیاوازییەکانی بەها و کار ئاسانی تەواو دەکات بۆ ڕاپەڕاندنی مۆڵەت.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pro tip */}
      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 font-arabic">
          {lang === 'ar' ? 'توضيح هام بخصوص النظم الجمركية في العراق' : 'تێبینی بۆ ڕێنماییە گومرگییەکان لە عێراق'}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          {lang === 'ar' 
            ? 'تنصح لوحة أعمال العراق جميع الشركات والمستوردين بالتحقق المسبق من تصنيف رمز النظام المنسق (HS Code) للبضائع قبل الشراء لتفادي غرامات الجمارك وضمان تسيير الشحنات بسرعة عبر موانئ البصرة ونقاط التحقق البرية.'
            : 'دەستەی کارگێڕی بازرگانی عێراق داوا لە نوێنەری کۆمپانیاکان دەکات کە پێش هاوردەکردنی هەر چەشنە کاڵایەک کۆدی جیهانی کاڵاکە (HS Code) بە وردی بخوێننەوە بۆ ئەوەی دووچاری سزای دواکەوتن و لێبڕین نەبن لە مەرزی ئوم قەسر یان شوێنەکانی تر.'}
        </p>
      </div>
    </div>
  );
};

export default MarketWorkspace;
