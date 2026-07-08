import { useMemo, useState } from 'react';
import { Anchor, ExternalLink, MapPin, Plane, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/src/lib/LanguageContext';

const HUBS = [
  { id: 'umm-qasr', nameKu: 'بەندەری ئوم قەسر', nameAr: 'ميناء أم قصر', subtitle: 'Umm Qasr Port', lat: 30.0381, lng: 47.9261, type: 'port' },
  { id: 'ibrahim-khalil', nameKu: 'دەروازەی ئیبراهیم خەلیل', nameAr: 'منفذ إبراهيم الخليل', subtitle: 'Ibrahim Khalil Border', lat: 37.1594, lng: 42.5639, type: 'border' },
  { id: 'erbil-airport', nameKu: 'فڕۆکەخانەی نێودەوڵەتی هەولێر', nameAr: 'مطار أربيل الدولي', subtitle: 'Erbil International Airport', lat: 36.2369, lng: 43.9592, type: 'airport' },
  { id: 'basra-port', nameKu: 'بەندەری بەسرە', nameAr: 'ميناء البصرة', subtitle: 'Basra Logistics Area', lat: 30.5085, lng: 47.7804, type: 'port' },
];

export function LogisticsMap() {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState(HUBS[0].id);
  const active = HUBS.find(hub => hub.id === activeId) || HUBS[0];

  const embedUrl = useMemo(
    () => `https://www.google.com/maps?q=${active.lat},${active.lng}&z=10&output=embed`,
    [active.lat, active.lng],
  );
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`;

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0E1728] text-slate-100 shadow-lg">
      <CardHeader className="border-b border-slate-700/80 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
          <MapPin className="h-5 w-5 text-emerald-400" />
          {lang === 'ar' ? 'خريطة المراكز اللوجستية' : 'نەخشەی مەڵبەندە گواستنەوەییەکان'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {HUBS.map(hub => {
            const Icon = hub.type === 'port' ? Anchor : hub.type === 'airport' ? Plane : Truck;
            const selected = hub.id === active.id;
            return (
              <button
                key={hub.id}
                onClick={() => setActiveId(hub.id)}
                className={`rounded-xl border p-3 text-right transition ${selected ? 'border-emerald-400/60 bg-emerald-500/15' : 'border-slate-700 bg-[#111D31] hover:border-slate-500 hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded-lg p-2 ${selected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}><Icon className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-black text-white">{lang === 'ar' ? hub.nameAr : hub.nameKu}</p>
                    <p className="mt-1 text-xs font-medium text-slate-300">{hub.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#091222]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 p-4">
            <div>
              <h3 className="text-lg font-black text-white">{lang === 'ar' ? active.nameAr : active.nameKu}</h3>
              <p className="mt-1 text-xs font-medium text-slate-300">{active.subtitle} · {active.lat.toFixed(4)}, {active.lng.toFixed(4)}</p>
            </div>
            <a href={externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-300 hover:bg-emerald-500/20">
              <ExternalLink className="h-4 w-4" />
              {lang === 'ar' ? 'فتح في خرائط Google' : 'کردنەوە لە Google Maps'}
            </a>
          </div>
          <iframe
            title={active.subtitle}
            src={embedUrl}
            className="h-[430px] w-full border-0 bg-slate-900"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="text-xs font-medium leading-6 text-slate-300">
          {lang === 'ar'
            ? 'المواقع المعروضة مرجعية لتسهيل التخطيط اللوجستي. تحقّق من حالة المنفذ ومواعيد العمل من الجهة المشغّلة قبل اتخاذ القرار.'
            : 'شوێنە پیشاندراوەکان بۆ ڕێنمایی پلاندانانی گواستنەوەن؛ پێش بڕیاردان دۆخی دەروازە و کاتی کارکردن لە دەزگای بەڕێوەبەر پشتڕاست بکەرەوە.'}
        </p>
      </CardContent>
    </Card>
  );
}

export default LogisticsMap;
