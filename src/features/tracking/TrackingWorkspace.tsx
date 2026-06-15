import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const ShipmentTracker = lazy(() => import('@/src/components/ShipmentTracker').then(m => ({ default: m.ShipmentTracker })));

export const TrackingWorkspace = () => {
  return (
    <div className="max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <ShipmentTracker />
      </Suspense>
    </div>
  );
};

export default TrackingWorkspace;
