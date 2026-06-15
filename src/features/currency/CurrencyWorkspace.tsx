import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const CurrencyConverter = lazy(() => import('@/src/components/CurrencyConverter').then(m => ({ default: m.CurrencyConverter })));

export const CurrencyWorkspace = () => {
  return (
    <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <CurrencyConverter />
      </Suspense>
    </div>
  );
};

export default CurrencyWorkspace;
