import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import LandingAwareApp from './LandingAwareApp';
import './index.css';
import './responsive.css';
import './english.css';
import './soraniPlatformCleanup';
import { LanguageProvider } from '@/src/lib/LanguageContext';
import AppErrorBoundary from '@/src/components/AppErrorBoundary';

const AuthProvider = lazy(() =>
  import('@/src/components/AuthProvider').then((module) => ({ default: module.AuthProvider }))
);

const AppBootFallback = () => (
  <div className="grid min-h-screen place-items-center bg-[#07111f] text-white" dir="rtl">
    <div className="text-center">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
      <p className="text-sm font-bold text-slate-300">پلاتفۆرم بار دەکرێت...</p>
    </div>
  </div>
);

declare global {
  interface Window {
    gm_authFailure?: () => void;
    __googleMapsAuthFailed?: boolean;
    onGoogleMapsAuthFailed?: () => void;
  }
}

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (googleMapsKey && googleMapsKey !== 'YOUR_API_KEY' && googleMapsKey.trim() !== '') {
  window.gm_authFailure = () => {
    console.warn('Google Maps authentication or activation failure detected early.');
    window.__googleMapsAuthFailed = true;
    if (typeof window.onGoogleMapsAuthFailed === 'function') {
      window.onGoogleMapsAuthFailed();
    }
  };

  const script = document.getElementById('google-maps-script') as HTMLScriptElement;
  if (script) {
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
  }
}

const ProtectedRuntime = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const requiresAuthContext = path !== '/';

  if (!requiresAuthContext) return <LandingAwareApp />;

  return (
    <Suspense fallback={<AppBootFallback />}>
      <AuthProvider>
        <LandingAwareApp />
      </AuthProvider>
    </Suspense>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <LanguageProvider>
        <ProtectedRuntime />
      </LanguageProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
