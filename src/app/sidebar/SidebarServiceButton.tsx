import { memo, useCallback } from 'react';
import { preloadServiceWorkspace } from '@/src/app/ServiceWorkspace';
import type { ServiceItem, ServiceKey } from '@/src/lib/services';

interface SidebarServiceButtonProps {
  service: ServiceItem;
  label: string;
  active: boolean;
  expanded: boolean;
  onSelect: (service: ServiceKey) => void;
}

function SidebarServiceButton({ service, label, active, expanded, onSelect }: SidebarServiceButtonProps) {
  const Icon = service.icon;
  const preload = useCallback(() => preloadServiceWorkspace(service.key), [service.key]);
  const handleClick = useCallback(() => {
    preloadServiceWorkspace(service.key);
    onSelect(service.key);
  }, [onSelect, service.key]);

  return (
    <button
      type="button"
      title={label}
      aria-current={active ? 'page' : undefined}
      onPointerDown={preload}
      onClick={handleClick}
      className={`flex h-11 w-full items-center rounded-xl transition-colors duration-100 ${expanded ? 'justify-start gap-3 px-3' : 'justify-center lg:justify-start lg:gap-3 lg:px-3'} ${active ? 'bg-[#1F6FEB] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : service.color}`} />
      <span className={`${expanded ? 'block' : 'hidden lg:block'} min-w-0 truncate text-sm font-bold`}>{label}</span>
    </button>
  );
}

export default memo(SidebarServiceButton);
