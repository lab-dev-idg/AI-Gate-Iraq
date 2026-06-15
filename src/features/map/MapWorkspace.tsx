import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const LogisticsMap = lazy(() => import('@/src/components/LogisticsMap').then(m => ({ default: m.LogisticsMap })));

export const MapWorkspace = () => {
  return (
    <div className="max-w-3xl h-[600px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      <Suspense fallback={<WorkspaceLoader />}>
        <LogisticsMap />
      </Suspense>
    </div>
  );
};

export default MapWorkspace;
