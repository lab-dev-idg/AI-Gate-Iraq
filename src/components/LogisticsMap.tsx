import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle, Anchor, Truck, Plane } from 'lucide-react';
import { useLanguage } from '@/src/lib/LanguageContext';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    gm_authFailure?: () => void;
    __googleMapsAuthFailed?: boolean;
    onGoogleMapsAuthFailed?: () => void;
  }
}

const LOGISTICS_HUBS = [
  { 
    name: 'بەندەری ئوم قەسر', 
    lat: 30.0381, 
    lng: 47.9261, 
    description: 'Umm Qasr Port',
    type: 'port'
  },
  { 
    name: 'دەروازەی ئیبراهیم خەلیل', 
    lat: 37.1594, 
    lng: 42.5639, 
    description: 'Ibrahim Khalil Border',
    type: 'border'
  },
  { 
    name: 'فڕۆکەخانەی هەولێر', 
    lat: 36.2369, 
    lng: 43.9592, 
    description: 'Erbil Airport',
    type: 'airport'
  },
];

const ICONS: Record<string, string> = {
  port: 'https://cdn-icons-png.flaticon.com/512/2892/2892695.png', // Ship
  border: 'https://cdn-icons-png.flaticon.com/512/2554/2554904.png', // Truck
  airport: 'https://cdn-icons-png.flaticon.com/512/2311/2311894.png', // Plane
};

export function LogisticsMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    // Intercept Google Maps Auth & Activation failures
    const handleAuthFailure = () => {
      console.warn("Google Maps SDK failed to authenticate or load (maybe ApiNotActivatedMapError).");
      setMapError("ApiNotActivatedMapError");
    };

    window.gm_authFailure = handleAuthFailure;
    window.onGoogleMapsAuthFailed = handleAuthFailure;

    // If an authentication failure was already caught before mount, use it immediately
    if (window.__googleMapsAuthFailed) {
      handleAuthFailure();
      return;
    }

    if (typeof window.google?.maps?.Map === 'function') {
      setIsReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (typeof window.google?.maps?.Map === 'function') {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 100);

    const script = document.getElementById('google-maps-script');
    const handleLoad = () => {
      if (typeof window.google?.maps?.Map === 'function') {
        setIsReady(true);
        clearInterval(interval);
      }
    };
    const handleError = () => {
      setMapError("ScriptLoadError");
    };

    script?.addEventListener('load', handleLoad);
    script?.addEventListener('error', handleError);

    return () => {
      clearInterval(interval);
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);
      window.onGoogleMapsAuthFailed = undefined;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current || mapError) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 33.3152, lng: 44.3661 }, // Baghdad center
        zoom: 5,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            style: { color: '#ffffff' }
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0e1726' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#1b2e4b' }]
          }
        ]
      });

      LOGISTICS_HUBS.forEach((hub) => {
        const marker = new window.google.maps.Marker({
          position: { lat: hub.lat, lng: hub.lng },
          map,
          title: hub.name,
          icon: {
            url: ICONS[hub.type],
            scaledSize: new window.google.maps.Size(32, 32),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 32),
          },
          animation: window.google.maps.Animation.DROP
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #1e293b; padding: 8px; font-family: sans-serif;">
              <h3 style="margin: 0; font-size: 14px; font-weight: bold;">${hub.name}</h3>
              <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">${hub.description}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    } catch (e: any) {
      console.error("Error creating map instance:", e);
      setMapError("MapInitError");
    }
  }, [isReady, mapError]);

  const errorDetails = {
    ku: {
      title: "کێشە لە کاراکردنی نەخشەدا هەیە",
      desc: "کلیلی Google Maps بنیاتنراوە بەڵام 'Maps JavaScript API' لە Google Cloud Console بۆ ئەم کلیلی کاتییە کارا نەکراوە (ApiNotActivatedMapError).",
      step1: "١. سەردانی Google Cloud Console بکە.",
      step2: "٢. پڕۆژەی دروست هەڵبژێرە و بچۆ بەشی 'APIs & Services'.",
      step3: "٣. بەدوای 'Maps JavaScript API' بگەڕێ و کلیک لە 'Enable' بکە.",
      alternative: "مەڵبەندە لۆجیستییە بەردەستەکان و دەروازەکانی عێراق:",
    },
    ar: {
      title: "هناك مشكلة في تفعيل الخريطة",
      desc: "مفتاح Google Maps تم توفيره ولكن 'Maps JavaScript API' غير ممكّن في واجهة تحكم Google Cloud Console لهذا المفتاح (ApiNotActivatedMapError).",
      step1: "١. اطلب لوحة تحكم Google Cloud Console.",
      step2: "٢. اختر مشروعك الخاص واذهب إلى قسم 'APIs & Services'.",
      step3: "٣. ابحث عن 'Maps JavaScript API' واضغط على تمكين 'Enable'.",
      alternative: "المراكز اللوجستية والمنافذ المتاحة في العراق:",
    }
  };

  const h = errorDetails[lang as 'ku' | 'ar'] || errorDetails['ku'];

  if (mapError) {
    return (
      <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
            <MapPin className="w-5 h-5 text-emerald-500 animate-pulse" />
            {lang === 'ar' ? 'المنافذ والمراكز اللوجستية' : 'مەڵبەند و دەروازە لۆجیستییەکان'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">{h.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  {h.desc}
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'خطوات التفعيل السهلة:' : 'ڕێکاری ئاسانی چالاککردن:'}</p>
                  <p className="text-slate-500 dark:text-slate-400">{h.step1}</p>
                  <p className="text-slate-500 dark:text-slate-400">{h.step2}</p>
                  <p className="text-slate-500 dark:text-slate-400">{h.step3}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wide">
              {h.alternative}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {LOGISTICS_HUBS.map((hub, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      {hub.type === 'port' ? <Anchor className="w-3.5 h-3.5" /> : hub.type === 'airport' ? <Plane className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950 dark:text-white">{hub.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{hub.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded font-semibold text-slate-600 dark:text-slate-400">
                      {hub.lat.toFixed(4)}°, {hub.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
          <MapPin className="w-5 h-5 text-emerald-500" />
          {lang === 'ar' ? 'نشرة خرائط المنافذ' : 'نەخشەی دەروازەکان'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0 overflow-hidden relative">
        <div ref={mapRef} className="w-full h-48 md:h-64 rounded-b-2xl" />
        {!isReady && (
          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center rounded-b-2xl">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-white mb-1 font-arabic">
              {lang === 'ar' ? 'الخريطة ليست نشطة' : 'نەخشە کارا نەکراوە'}
            </p>
            <p className="text-xs text-slate-400">
              {lang === 'ar' 
                ? 'يرجى تعيين مفتاح Google Maps في الإعدادات.' 
                : 'تکایە کلیلی Google Maps لە ڕێکخستنەکان دابنێ'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

