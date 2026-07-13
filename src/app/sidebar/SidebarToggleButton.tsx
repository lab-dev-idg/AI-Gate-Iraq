import { memo } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarToggleButtonProps {
  expanded: boolean;
  label: string;
  onToggle: () => void;
}

function SidebarToggleButton({ expanded, label, onToggle }: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-colors duration-100 hover:bg-blue-500 hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-offset-[#0B1220]"
    >
      {expanded ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
    </button>
  );
}

export default memo(SidebarToggleButton);
