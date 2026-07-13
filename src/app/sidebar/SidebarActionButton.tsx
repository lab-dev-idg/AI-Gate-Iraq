import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SidebarActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  expanded: boolean;
  active?: boolean;
}

function SidebarActionButton({ icon: Icon, label, onClick, expanded, active = false }: SidebarActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex h-11 w-full items-center rounded-xl transition-colors duration-100 ${expanded ? 'justify-start gap-3 px-3' : 'justify-center lg:justify-start lg:gap-3 lg:px-3'} ${active ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className={`${expanded ? 'block' : 'hidden lg:block'} min-w-0 truncate text-sm font-bold`}>{label}</span>
    </button>
  );
}

export default memo(SidebarActionButton);
