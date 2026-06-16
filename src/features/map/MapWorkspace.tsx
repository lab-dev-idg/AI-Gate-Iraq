import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const LogisticsMap = lazy(() => import('@/src/components/LogisticsMap').then(m => ({ default: m.LogisticsMap })));

export const MapWorkspace = () => {
  return (
    <div className="max-w-3xl w-full">
      <Suspense fallback={<WorkspaceLoader />}>
        <LogisticsMap />
      </Suspense>
    </div>
  );
};

export default MapWorkspace;
