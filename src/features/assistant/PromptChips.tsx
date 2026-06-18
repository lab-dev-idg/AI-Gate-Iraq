import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptChipsProps {
  chips: { label: string; prompt: string }[];
  onChipClick: (prompt: string) => void;
}

export const PromptChips = ({ chips, onChipClick }: PromptChipsProps) => (
  <div className="no-scrollbar flex w-full shrink-0 snap-x snap-mandatory gap-2 overflow-x-auto border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-[#0E1728] sm:px-4 md:px-5">
    {chips.map((action, index) => (
      <Button
        key={index}
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChipClick(action.prompt)}
        className="min-h-10 shrink-0 snap-start whitespace-nowrap rounded-full border-slate-300 bg-slate-50 px-4 text-xs font-black text-slate-800 hover:border-emerald-500 hover:bg-emerald-500 hover:text-slate-950 dark:border-slate-700 dark:bg-[#111D31] dark:text-slate-100 dark:hover:border-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-slate-950"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
        {action.label}
      </Button>
    ))}
  </div>
);

export default PromptChips;
