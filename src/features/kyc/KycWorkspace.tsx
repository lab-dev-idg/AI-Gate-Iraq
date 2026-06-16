import { lazy, Suspense } from 'react';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const KYCForm = lazy(() => import('@/src/components/KYCForm').then(m => ({ default: m.KYCForm })));

export const KycWorkspace = () => {
  return (
    <div className="max-w-3xl w-full text-slate-800 dark:text-slate-100">
      <Suspense fallback={<WorkspaceLoader />}>
        <KYCForm />
      </Suspense>
    </div>
  );
};

export default KycWorkspace;
