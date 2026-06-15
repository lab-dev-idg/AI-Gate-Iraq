import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const ShippingCalculator = lazy(() => import('@/src/components/ShippingCalculator').then(m => ({ default: m.ShippingCalculator })));

export const CostWorkspace = () => {
  return (
    <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <ShippingCalculator />
      </Suspense>
    </div>
  );
};

export default CostWorkspace;
