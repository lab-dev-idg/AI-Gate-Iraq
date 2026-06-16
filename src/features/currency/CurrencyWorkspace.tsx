import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const CurrencyConverter = lazy(() => import('@/src/components/CurrencyConverter').then(m => ({ default: m.CurrencyConverter })));

export const CurrencyWorkspace = () => {
  return (
    <div className="max-w-3xl w-full text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <CurrencyConverter />
      </Suspense>
    </div>
  );
};

export default CurrencyWorkspace;
