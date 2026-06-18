import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './responsive.css';
import { AuthProvider } from '@/src/components/AuthProvider';
import { LanguageProvider } from '@/src/lib/LanguageContext';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
);
