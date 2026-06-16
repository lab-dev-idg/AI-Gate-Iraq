import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const ShipmentTracker = lazy(() => import('@/src/components/ShipmentTracker').then(m => ({ default: m.ShipmentTracker })));

export const TrackingWorkspace = () => {
  return (
    <div className="max-w-3xl w-full text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <ShipmentTracker />
      </Suspense>
    </div>
  );
};

export default TrackingWorkspace;
