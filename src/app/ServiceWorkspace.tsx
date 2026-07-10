import { lazy, Suspense } from 'react';
import { ServiceKey } from '@/src/lib/services';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const MarketWorkspace = lazy(() => import('@/src/features/market/MarketWorkspace'));
const BordersWorkspace = lazy(() => import('@/src/features/borders/BordersWorkspace'));
const CurrencyWorkspace = lazy(() => import('@/src/features/currency/CurrencyWorkspace'));
const CostWorkspace = lazy(() => import('@/src/features/cost/CostWorkspace'));
const KycWorkspace = lazy(() => import('@/src/features/kyc/KycWorkspace'));
const ProcurementWorkspace = lazy(() => import('@/src/features/procurement/ProcurementWorkspace'));
const TrackingWorkspace = lazy(() => import('@/src/features/tracking/TrackingWorkspace'));
const MapWorkspace = lazy(() => import('@/src/features/map/MapWorkspace'));
const AuditWorkspace = lazy(() => import('@/src/features/audit/AuditWorkspace'));

interface ServiceWorkspaceProps {
  activeService: ServiceKey;
  lang: 'ku' | 'ar';
  t: any;
}

export const ServiceWorkspace = ({
  activeService,
  lang,
  t,
}: ServiceWorkspaceProps) => {
  return (
    <Suspense fallback={<WorkspaceLoader />}>
      {activeService === 'market' && <MarketWorkspace lang={lang} t={t} />}
      {activeService === 'borders' && <BordersWorkspace lang={lang} t={t} />}
      {activeService === 'currency' && <CurrencyWorkspace />}
      {activeService === 'cost' && <CostWorkspace />}
      {activeService === 'kyc' && <KycWorkspace />}
      {activeService === 'procurement' && <ProcurementWorkspace />}
      {activeService === 'tracking' && <TrackingWorkspace />}
      {activeService === 'map' && <MapWorkspace />}
      {activeService === 'audit' && <AuditWorkspace lang={lang} />}
    </Suspense>
  );
};

export default ServiceWorkspace;
