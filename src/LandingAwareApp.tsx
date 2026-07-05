import App from './App';
import PlatformLandingPage from './landing/PlatformLandingPage';
import { useLanguage } from '@/src/lib/LanguageContext';

export default function LandingAwareApp() {
  const { lang, setLang } = useLanguage();
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return (
      <PlatformLandingPage
        lang={lang}
        setLang={setLang}
        onEnter={() => window.location.assign('/workspace')}
      />
    );
  }

  return <App />;
}
