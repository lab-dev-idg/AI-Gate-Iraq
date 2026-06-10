import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/src/components/AuthProvider';
import { LanguageProvider } from '@/src/lib/LanguageContext';

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Only attempt to load the script if the key is present and doesn't look like a placeholder
if (googleMapsKey && googleMapsKey !== 'YOUR_API_KEY' && googleMapsKey.trim() !== '') {
  const script = document.getElementById('google-maps-script') as HTMLScriptElement;
  if (script) {
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
  }
} else {
  console.warn("Google Maps API key is missing or invalid. Map features will be disabled. Set VITE_GOOGLE_MAPS_API_KEY in settings.");
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
