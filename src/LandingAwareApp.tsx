import { lazy, Suspense } from 'react';
import PlatformLandingPage from './landing/PlatformLandingPage';
import { useLanguage } from '@/src/lib/LanguageContext';

const WorkspaceApp = lazy(() => import('./App'));

const WorkspaceFallback = () => (
  <div className="grid min-h-screen place-items-center bg-[#07111f] text-white" dir="rtl">
    <div className="text-center">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
      <p className="text-sm font-bold text-slate-300">شوێنی کار بار دەکرێت...</p>
    </div>
  </div>
);

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

  return (
    <Suspense fallback={<WorkspaceFallback />}>
      <WorkspaceApp />
    </Suspense>
  );
}
