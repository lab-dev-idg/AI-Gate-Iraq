import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const ShippingCalculator = lazy(() => import('@/src/components/ShippingCalculator').then(m => ({ default: m.ShippingCalculator })));

export const CostWorkspace = () => {
  return (
    <div className="max-w-3xl w-full text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <ShippingCalculator />
      </Suspense>
    </div>
  );
};

export default CostWorkspace;
