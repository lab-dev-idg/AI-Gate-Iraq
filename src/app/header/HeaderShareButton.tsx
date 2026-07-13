import { memo } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderShareButtonProps {
  label: string;
  onShare: () => void;
}

function HeaderShareButton({ label, onShare }: HeaderShareButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onShare}
      aria-label={label}
      title={label}
      className="flex h-9 min-w-9 shrink-0 gap-1.5 rounded-lg px-2 text-xs font-black text-slate-800 transition-colors duration-100 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-700 lg:px-3"
    >
      <Share2 className="h-4 w-4 shrink-0" />
      <span className="hidden xl:inline">{label}</span>
    </Button>
  );
}

export default memo(HeaderShareButton);
