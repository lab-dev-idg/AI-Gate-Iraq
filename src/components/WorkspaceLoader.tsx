import { Loader2 } from 'lucide-react';

export const WorkspaceLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[300px] gap-3 text-slate-500 dark:text-slate-400 font-arabic">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    <span className="text-xs font-black">باردەکرێت... تکایە چاوەڕوان بە | جاري التحميل... يرجى الانتظار</span>
  </div>
);

export default WorkspaceLoader;
