import { lazy, Suspense } from 'react';
import { ServiceKey } from '@/src/lib/services';
import { WorkspaceLoader } from '@/src/components/WorkspaceLoader';

const loadMarketWorkspace = () => import('@/src/features/market/MarketWorkspace');
const loadBordersWorkspace = () => import('@/src/features/borders/BordersWorkspace');
const loadCurrencyWorkspace = () => import('@/src/features/currency/CurrencyWorkspace');
const loadCostWorkspace = () => import('@/src/features/cost/CostWorkspace');
const loadKycWorkspace = () => import('@/src/features/kyc/KycWorkspace');
const loadProcurementWorkspace = () => import('@/src/features/procurement/ProcurementWorkspace');
const loadTrackingWorkspace = () => import('@/src/features/tracking/TrackingWorkspace');
const loadMapWorkspace = () => import('@/src/features/map/MapWorkspace');
const loadAuditWorkspace = () => import('@/src/features/audit/AuditWorkspace');

const MarketWorkspace = lazy(loadMarketWorkspace);
const BordersWorkspace = lazy(loadBordersWorkspace);
const CurrencyWorkspace = lazy(loadCurrencyWorkspace);
const CostWorkspace = lazy(loadCostWorkspace);
const KycWorkspace = lazy(loadKycWorkspace);
const ProcurementWorkspace = lazy(loadProcurementWorkspace);
const TrackingWorkspace = lazy(loadTrackingWorkspace);
const MapWorkspace = lazy(loadMapWorkspace);
const AuditWorkspace = lazy(loadAuditWorkspace);

const workspaceLoaders: Partial<Record<ServiceKey, () => Promise<unknown>>> = {
  market: loadMarketWorkspace,
  borders: loadBordersWorkspace,
  currency: loadCurrencyWorkspace,
  cost: loadCostWorkspace,
  kyc: loadKycWorkspace,
  procurement: loadProcurementWorkspace,
  tracking: loadTrackingWorkspace,
  map: loadMapWorkspace,
  audit: loadAuditWorkspace,
};

const preloadedServices = new Set<ServiceKey>();

export function preloadServiceWorkspace(service: ServiceKey) {
  const loader = workspaceLoaders[service];
  if (!loader || preloadedServices.has(service)) return;

  preloadedServices.add(service);
  void loader().catch(() => preloadedServices.delete(service));
}

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
