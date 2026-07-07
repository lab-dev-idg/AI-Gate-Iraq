import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import PlatformLandingPage from './PlatformLandingPage';
import type { RuntimeLanguage } from '@/src/lib/LanguageContext';

interface Props {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
  onEnter: () => void;
}

export default function PlatformLandingPageSorani({ lang, setLang, onEnter }: Props) {
  if (lang !== 'ku') {
    return <PlatformLandingPage lang={lang} setLang={setLang} onEnter={onEnter} />;
  }

  const features = [
    ['ڕاوێژکاری زیرەک', 'وەڵامی ڕێکخراو بۆ پرسیارەکانی بازرگانی، گومرگ و گواستنەوە.'],
    ['خەمڵاندنی تێچوو', 'خەمڵاندنی سەرەتایی بۆ گواستنەوە، باج و دابەشکردن.'],
    ['دابینکردن و ناساندن', 'ئامادەکردنی داواکاری، پشکنینی دابینکەر و ڕێنمایی ناساندن.'],
    ['بازاڕ و مەرزەکان', 'کورتەی بازاڕ، دۆخی مەرز و ڕێڕەوی گواستنەوە.'],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07111f] text-white" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black">AI</span>
            <div><strong>AI Gate Iraq</strong><p className="text-[10px] text-slate-400">پلاتفۆرمی زیرەکی بازرگانی و گواستنەوە</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              {(['ku', 'ar', 'en'] as RuntimeLanguage[]).map((item) => (
                <button key={item} onClick={() => setLang(item)} className={`h-8 min-w-9 rounded-lg px-2 text-[10px] font-black ${lang === item ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{item.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={onEnter} className="hidden h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-slate-950 sm:inline-flex">کردنەوەی پلاتفۆرم<ArrowLeft className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300"><Sparkles className="h-4 w-4" />دروستکراو بۆ بازاڕی عێراق</div>
            <h1 className="text-4xl font-black leading-[1.15] sm:text-5xl lg:text-7xl">بڕیارە بازرگانییەکانت<br /><span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">خێراتر و ڕوونتر بکە</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">AI Gate Iraq ڕاوێژکاری، خەمڵاندنی تێچوو، دابینکردن، گومرگ و بەدواداچوونی بار لە یەک شوێنی کاری زیرەکدا کۆدەکاتەوە.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={onEnter} className="h-13 rounded-2xl bg-blue-600 px-6 text-sm font-black">کردنەوەی پلاتفۆرم</button><a href="#features" className="inline-flex h-13 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-black">بینینی تواناکان</a></div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs font-bold text-slate-400">{['کوردی، عەرەبی و ئینگلیزی', 'پاراستنی دەستگەیشتن', 'گونجاو بۆ مۆبایل'].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</span>)}</div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-[#0d1b2d] p-6 shadow-2xl">
            <p className="text-sm font-black">ڕاوێژکاری بازرگانی و گواستنەوە</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7">چۆن تێچووی هاوردەکردنی بارێک بۆ هەولێر بخەمڵێنم؟</div>
            <div className="mt-4 me-auto rounded-2xl border border-blue-400/25 bg-blue-600/20 p-4 text-sm leading-7">جۆری کاڵا، کێش، قەبارە، شوێنی سەرچاوە و ڕێڕەوی گواستنەوە بنێرە تاکو خەمڵاندنێکی ڕێکخراو ئامادە بکەم.</div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-xs font-black tracking-[0.2em] text-blue-300">تواناکانی پلاتفۆرم</p>
          <h2 className="mt-4 text-3xl font-black sm:text-5xl">هەموو ئامرازە پێویستەکان لە یەک شوێندا</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{features.map(([title, text]) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><h3 className="text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/15 to-emerald-500/10 p-8 sm:p-12">
            <ShieldCheck className="h-10 w-10 text-emerald-300" />
            <h2 className="mt-5 text-3xl font-black">دروستکراو بە بنەمای پاراستن و سادەیی</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">چوونەژوورەوە، دەستگەیشتن و مێژووی کار بە شێوەیەکی ڕێکخراو و پارێزراو بەڕێوەدەبرێن.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
