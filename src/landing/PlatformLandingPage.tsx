import { ArrowRight, BarChart3, Bot, CheckCircle2, Globe2, LockKeyhole, PackageSearch, Route, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import type { RuntimeLanguage } from '@/src/lib/LanguageContext';

interface PlatformLandingPageProps {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
  onEnter: () => void;
}

const content = {
  ku: {
    features: 'تواناکان', useCases: 'بەکارهێنان', security: 'ئاسایش', open: 'کردنەوەی پلاتفۆرم',
    eyebrow: 'پلاتفۆرمی زیرەکی بازرگانی و لۆجیستی بۆ عێراق', titleA: 'بڕیارە بازرگانییەکانت', titleB: 'خێراتر و ڕوونتر بکە',
    lead: 'AI Gate Iraq ڕێنمایی، خەمڵاندنی تێچوو، دابینکردن، گومرگ و بەدواداچوونی بار لە یەک شوێنی کاری زیرەکدا کۆدەکاتەوە.',
    explore: 'بینینی تواناکان', trustA: 'دیزاینکراو بۆ بازاڕی عێراق', trustB: 'کوردی، عەرەبی، ئینگلیزی', trustC: 'Firebase + App Check',
    previewTitle: 'ڕاوێژکاری بازرگانی و لۆجیستی', question: 'چۆن تێچووی هاوردەکردنی بارێک بۆ هەولێر بخەمڵێنم؟',
    answer: 'جۆری کاڵا، کێش، قەبارە، شوێنی سەرچاوە و ڕێڕەوی گواستنەوە بنێرە تا خەمڵاندنێکی ڕێکخراو ئامادە بکەم.',
    core: 'خزمەتگوزاری سەرەکی', langs: 'زمانی پشتیوانیکراو', workspace: 'شوێنی کاری یەکگرتوو',
    featuresEyebrow: 'تواناکانی پلاتفۆرم', featuresTitle: 'هەموو ئامرازە پێویستەکان لە یەک شوێندا',
    featuresLead: 'لە پرسیاری سادە تا بڕیاری هاوردەکردن، پلاتفۆرمەکە هەنگاو بە هەنگاو یارمەتیت دەدات.',
    f1: 'ڕاوێژکاری زیرەک', f1d: 'وەڵامی ڕێکخراو بۆ پرسیارەکانی بازرگانی، گومرگ و لۆجیستیک.',
    f2: 'خەمڵاندنی تێچوو', f2d: 'خەمڵاندنی سەرەتایی بۆ گواستنەوە، باج و تێچووی دابەشکردن.',
    f3: 'دابینکردن و KYC', f3d: 'ئامادەکردنی RFQ، پشکنینی دابینکەر و ڕێنمایی KYC.',
    f4: 'بازاڕ و مەرزەکان', f4d: 'کورتەی بازاڕ، دۆخی مەرز و ڕێڕەوی لۆجیستی.',
    useEyebrow: 'بۆ کێ دروستکراوە؟', useTitle: 'بۆ تیمەکانی هاوردە، بازرگانی و لۆجیستیک',
    u1: 'کەمکردنەوەی کاتی گەڕان بەدوای زانیاری', u2: 'ڕێکخستنی بڕیار و دۆکیومێنتەکان لە یەک شوێن', u3: 'خەمڵاندنی خێراتر پێش پەیوەندی بە دابینکەر', u4: 'پاراستنی مێژووی گفتوگۆ و کار',
    secEyebrow: 'متمانە و پاراستن', secTitle: 'دیزاینکراو بە بنەمای ئاسایش و سادگی', secText: 'Firebase Authentication، Firestore Rules و App Check بۆ کەمکردنەوەی داواکاری نادروست و پاراستنی دەستگەیشتن بەکاردهێنرێن.',
    ctaTitle: 'ئامادەی بڕیاردانی زیرەکتر بیت؟', ctaText: 'شوێنی کارەکە بکەرەوە و یەکەم پرسیاری بازرگانیی خۆت بنێرە.', cta: 'دەستپێکردن بە AI Gate Iraq',
  },
  ar: {
    features: 'الميزات', useCases: 'الاستخدامات', security: 'الأمان', open: 'فتح المنصة',
    eyebrow: 'منصة ذكاء تجاري ولوجستي للعراق', titleA: 'اجعل قرارات أعمالك', titleB: 'أسرع وأكثر وضوحاً',
    lead: 'يجمع AI Gate Iraq الإرشاد وتقدير التكاليف والتوريد والجمارك وتتبع الشحنات في مساحة عمل ذكية واحدة.',
    explore: 'استعراض الميزات', trustA: 'مصمم للسوق العراقي', trustB: 'كردي، عربي، إنجليزي', trustC: 'Firebase + App Check',
    previewTitle: 'مستشار التجارة والخدمات اللوجستية', question: 'كيف أقدّر تكلفة استيراد شحنة إلى أربيل؟', answer: 'أرسل نوع البضاعة والوزن والحجم والمنشأ ومسار الشحن لأجهز لك تقديراً منظماً.',
    core: 'خدمات أساسية', langs: 'لغات مدعومة', workspace: 'مساحة عمل موحدة',
    featuresEyebrow: 'قدرات المنصة', featuresTitle: 'الأدوات الأساسية في مكان واحد', featuresLead: 'من السؤال الأولي إلى قرار الاستيراد، تساعدك المنصة خطوة بخطوة.',
    f1: 'مستشار ذكي', f1d: 'إجابات عملية ومنظمة للتجارة والجمارك والخدمات اللوجستية.', f2: 'تقدير التكاليف', f2d: 'تقدير أولي للشحن والرسوم والتوزيع الداخلي.', f3: 'التوريد وKYC', f3d: 'إعداد طلبات RFQ وفحص الموردين وإرشادات KYC.', f4: 'السوق والمنافذ', f4d: 'ملخصات السوق وحالة المنافذ والمسارات اللوجستية.',
    useEyebrow: 'لمن صُممت؟', useTitle: 'لفرق الاستيراد والتجارة واللوجستيات', u1: 'تقليل الوقت الضائع في البحث عن المعلومات', u2: 'تنظيم القرارات والمستندات في مساحة واحدة', u3: 'تقديرات أسرع قبل التواصل مع الموردين', u4: 'الاحتفاظ بسجل المحادثات والعمل',
    secEyebrow: 'الثقة والحماية', secTitle: 'مصممة على أساس الأمان والبساطة', secText: 'تستخدم المنصة Firebase Authentication وFirestore Rules وApp Check لتقليل الطلبات غير الموثوقة وحماية الوصول.',
    ctaTitle: 'هل أنت مستعد لاتخاذ قرارات أذكى؟', ctaText: 'افتح مساحة العمل وأرسل أول سؤال تجاري لك.', cta: 'ابدأ مع AI Gate Iraq',
  },
  en: {
    features: 'Features', useCases: 'Use cases', security: 'Security', open: 'Open platform',
    eyebrow: 'Trade and logistics intelligence for Iraq', titleA: 'Make business decisions', titleB: 'faster and clearer',
    lead: 'AI Gate Iraq brings guidance, cost estimation, sourcing, customs, and shipment workflows into one intelligent workspace.',
    explore: 'Explore features', trustA: 'Built for the Iraqi market', trustB: 'Kurdish, Arabic, English', trustC: 'Firebase + App Check',
    previewTitle: 'Trade & Logistics Advisor', question: 'How can I estimate the cost of importing a shipment to Erbil?', answer: 'Share the product type, weight, dimensions, origin, and route so I can prepare a structured estimate.',
    core: 'Core services', langs: 'Supported languages', workspace: 'Unified workspace',
    featuresEyebrow: 'Platform capabilities', featuresTitle: 'Essential tools in one place', featuresLead: 'From the first question to an import decision, the platform supports your workflow step by step.',
    f1: 'Smart advisory', f1d: 'Practical, structured guidance for trade, customs, and logistics.', f2: 'Cost estimation', f2d: 'Early estimates for freight, duties, and inland distribution.', f3: 'Sourcing & KYC', f3d: 'RFQ preparation, supplier checks, and KYC guidance.', f4: 'Market & borders', f4d: 'Market summaries, border status, and logistics routes.',
    useEyebrow: 'Who is it for?', useTitle: 'Import, trade, and logistics teams', u1: 'Reduce time spent searching across scattered sources', u2: 'Organize decisions and documents in one workspace', u3: 'Estimate faster before engaging suppliers', u4: 'Keep a clear history of conversations and work',
    secEyebrow: 'Trust and protection', secTitle: 'Designed around security and simplicity', secText: 'Firebase Authentication, Firestore Rules, and App Check help reduce untrusted requests and protect access.',
    ctaTitle: 'Ready to make smarter decisions?', ctaText: 'Open the workspace and send your first business question.', cta: 'Start with AI Gate Iraq',
  },
} as const;

const icons = [Bot, BarChart3, PackageSearch, Route];

export default function PlatformLandingPage({ lang, setLang, onEnter }: PlatformLandingPageProps) {
  const t = content[lang];
  const ltr = lang === 'en';
  const cards = [[t.f1, t.f1d], [t.f2, t.f2d], [t.f3, t.f3d], [t.f4, t.f4d]];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07111f] text-white" dir={ltr ? 'ltr' : 'rtl'}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.20),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#07111f_0%,#091827_48%,#07111f_100%)]" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black">AI</span><div><div className="flex items-center gap-2 text-sm font-black sm:text-base">AI Gate Iraq <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[9px] text-amber-200">PRO</span></div><div className="text-[9px] font-semibold tracking-[0.18em] text-slate-400">SMART TRADE PLATFORM</div></div></div>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-300 lg:flex"><a href="#features" className="hover:text-white">{t.features}</a><a href="#use-cases" className="hover:text-white">{t.useCases}</a><a href="#security" className="hover:text-white">{t.security}</a></nav>
          <div className="flex items-center gap-2"><div className="flex rounded-xl border border-white/10 bg-white/5 p-1">{(['ku', 'ar', 'en'] as RuntimeLanguage[]).map((item) => <button key={item} onClick={() => setLang(item)} className={`h-8 min-w-9 rounded-lg px-2 text-[10px] font-black ${lang === item ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{item.toUpperCase()}</button>)}</div><button onClick={onEnter} className="hidden h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-slate-950 sm:inline-flex">{t.open}<ArrowRight className={`h-4 w-4 ${ltr ? '' : 'rotate-180'}`} /></button></div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300"><Sparkles className="h-4 w-4" />{t.eyebrow}</div><h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">{t.titleA}<br /><span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">{t.titleB}</span></h1><p className="mt-7 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">{t.lead}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={onEnter} className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-black shadow-xl shadow-blue-600/20 hover:bg-blue-500">{t.open}<ArrowRight className={`h-4 w-4 ${ltr ? '' : 'rotate-180'}`} /></button><a href="#features" className="inline-flex h-13 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-black text-slate-200">{t.explore}</a></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-400">{[t.trustA, t.trustB, t.trustC].map((x) => <span key={x} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{x}</span>)}</div></div>
          <div className="relative"><div className="absolute -inset-6 rounded-[2.5rem] bg-blue-600/15 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0d1b2d]/90 shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-[10px] font-black">AI</span><div><p className="text-sm font-black">AI Gate Iraq</p><p className="text-[10px] text-slate-400">{t.previewTitle}</p></div></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black text-emerald-300">LIVE</span></div><div className="space-y-5 p-5 sm:p-7"><div className="max-w-[88%] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">{t.question}</div><div className="ms-auto max-w-[92%] rounded-2xl border border-blue-400/25 bg-blue-600/20 p-4 text-sm leading-7 text-blue-50">{t.answer}</div></div></div></div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025]"><div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-y-0">{[['9', t.core], ['3', t.langs], ['1', t.workspace]].map(([v, l]) => <div key={l} className="px-6 py-7 text-center"><strong className="text-3xl font-black">{v}</strong><p className="mt-1 text-xs font-bold text-slate-400">{l}</p></div>)}</div></section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">{t.featuresEyebrow}</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">{t.featuresTitle}</h2><p className="mt-5 text-base leading-8 text-slate-400">{t.featuresLead}</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{cards.map(([title, text], i) => { const Icon = icons[i]; return <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/15 text-blue-300"><Icon className="h-6 w-6" /></span><h3 className="mt-6 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>; })}</div></section>

        <section id="use-cases" className="border-y border-white/10 bg-[#0b1727]"><div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">{t.useEyebrow}</p><h2 className="mt-4 text-3xl font-black sm:text-5xl">{t.useTitle}</h2></div><div className="grid gap-4">{[t.u1, t.u2, t.u3, t.u4].map((x, i) => <div key={x} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-sm font-black text-emerald-300">0{i + 1}</span><p className="pt-1 text-sm font-bold leading-7 text-slate-300">{x}</p></div>)}</div></div></section>

        <section id="security" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"><div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/15 via-white/[0.035] to-emerald-500/10 p-7 sm:p-10 lg:p-14"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center"><div className="flex gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600"><ShieldCheck className="h-7 w-7" /></span><span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300"><LockKeyhole className="h-7 w-7" /></span><span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300"><Globe2 className="h-7 w-7" /></span></div><div><p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">{t.secEyebrow}</p><h2 className="mt-4 text-3xl font-black sm:text-4xl">{t.secTitle}</h2><p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300">{t.secText}</p></div></div></div></section>

        <section className="px-4 pb-24 sm:px-6"><div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-400/20 bg-blue-600 px-6 py-12 text-center"><TrendingUp className="mx-auto h-9 w-9" /><h2 className="mt-5 text-3xl font-black sm:text-4xl">{t.ctaTitle}</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100">{t.ctaText}</p><button onClick={onEnter} className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-blue-700">{t.cta}<ArrowRight className={`h-4 w-4 ${ltr ? '' : 'rotate-180'}`} /></button></div></section>
      </main>
      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-xs font-semibold text-slate-500">© 2026 AI Gate Iraq — Smart Trade & Logistics Platform</footer>
    </div>
  );
}
