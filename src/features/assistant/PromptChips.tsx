import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptChipsProps {
  chips: { label: string; prompt: string }[];
  onChipClick: (prompt: string) => void;
}

// Prompt chips lock: horizontal scroll inside row only; never widen page.
export const PromptChips = ({ chips, onChipClick }: PromptChipsProps) => {
  return (
    <div className="px-5 py-3 flex gap-2 w-full max-w-full overflow-x-auto overflow-y-visible no-scrollbar scroll-smooth border-t border-slate-100 dark:border-slate-800/40 shrink-0 select-none">
      {chips.map((action, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400 hover:-translate-y-0.5 shadow-sm shrink-0"
          onClick={() => onChipClick(action.prompt)}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default PromptChips;
