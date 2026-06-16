import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const ProcurementSourcing = lazy(() => import('@/src/components/ProcurementSourcing').then(m => ({ default: m.ProcurementSourcing })));

export const ProcurementWorkspace = () => {
  return (
    <div className="max-w-3xl w-full text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <ProcurementSourcing />
      </Suspense>
    </div>
  );
};

export default ProcurementWorkspace;
