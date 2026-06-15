import { ServiceKey } from '@/src/lib/services';
import MarketWorkspace from '@/src/features/market/MarketWorkspace';
import BordersWorkspace from '@/src/features/borders/BordersWorkspace';
import CurrencyWorkspace from '@/src/features/currency/CurrencyWorkspace';
import CostWorkspace from '@/src/features/cost/CostWorkspace';
import KycWorkspace from '@/src/features/kyc/KycWorkspace';
import ProcurementWorkspace from '@/src/features/procurement/ProcurementWorkspace';
import TrackingWorkspace from '@/src/features/tracking/TrackingWorkspace';
import MapWorkspace from '@/src/features/map/MapWorkspace';

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
    <>
      {activeService === 'market' && <MarketWorkspace lang={lang} t={t} />}
      {activeService === 'borders' && <BordersWorkspace lang={lang} t={t} />}
      {activeService === 'currency' && <CurrencyWorkspace />}
      {activeService === 'cost' && <CostWorkspace />}
      {activeService === 'kyc' && <KycWorkspace />}
      {activeService === 'procurement' && <ProcurementWorkspace />}
      {activeService === 'tracking' && <TrackingWorkspace />}
      {activeService === 'map' && <MapWorkspace />}
    </>
  );
};

export default ServiceWorkspace;
