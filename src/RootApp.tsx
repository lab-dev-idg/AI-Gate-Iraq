import App from './App';
import PlatformLandingPage from './landing/PlatformLandingPage';
import { useLanguage } from './lib/LanguageContext';

export default function RootApp() {
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
