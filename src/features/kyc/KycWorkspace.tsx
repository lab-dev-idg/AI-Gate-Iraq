import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const KYCForm = lazy(() => import('@/src/components/KYCForm').then(m => ({ default: m.KYCForm })));

export const KycWorkspace = () => {
  return (
    <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <KYCForm />
      </Suspense>
    </div>
  );
};

export default KycWorkspace;
