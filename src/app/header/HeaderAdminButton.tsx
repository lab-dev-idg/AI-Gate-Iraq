import { memo } from 'react';
import { ShieldCheck } from 'lucide-react';

interface HeaderAdminButtonProps {
  label: string;
}

function HeaderAdminButton({ label }: HeaderAdminButtonProps) {
  return (
    <a
      href="/admin"
      className="flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 text-[10px] font-black text-amber-700 transition-colors duration-100 hover:bg-amber-500 hover:text-white dark:text-amber-300 sm:px-2.5 lg:px-3 lg:text-xs"
      aria-label={label}
      title={label}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}

export default memo(HeaderAdminButton);
