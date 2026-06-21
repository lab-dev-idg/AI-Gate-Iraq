(() => {
  'use strict';

  const translations = {
    ku: {},
    ar: {
      'a11y.skip': 'الانتقال إلى المحتوى الرئيسي',
      'nav.home': 'الرئيسية',
      'nav.mission': 'المهمة',
      'nav.founder': 'المؤسس',
      'nav.principles': 'المبادئ',
      'hero.kicker': 'عن AI Gate Iraq',
      'hero.title': 'بنية ذكية للتجارة والخدمات اللوجستية في العراق',
      'hero.lead': 'AI Gate Iraq مشروع تقني تجاري صمم لتقليل تعقيد الاستيراد والنقل والجمارك والتوريد وصنع القرار التجاري.',
      'hero.cta1': 'طلب المشاركة',
      'hero.cta2': 'العودة إلى الموقع',
      'nodes.trade': 'ذكاء التجارة',
      'nodes.logistics': 'الخدمات اللوجستية الذكية',
      'nodes.decision': 'دعم القرار',
      'mission.kicker': 'مهمتنا',
      'mission.title': 'تحويل العمليات المتفرقة إلى نظام موحد وواضح',
      'mission.lead': 'نبني منصة تجمع المعلومات والتقديرات والموردين ومتابعة الشحنات والإرشاد التجاري في مساحة عمل واحدة.',
      'mission.p1t': 'وضوح القرار',
      'mission.p1d': 'تدعم القرارات بالبيانات والسجل والخيارات القابلة للمراجعة.',
      'mission.p2t': 'تبسيط العمل',
      'mission.p2d': 'تتحول العمليات المعقدة إلى خطوات واضحة وقابلة للتنفيذ.',
      'mission.p3t': 'بناء الثقة',
      'mission.p3d': 'تدار المعلومات والحسابات وسجل العمل في بيئة محمية.',
      'founder.role': 'المؤسس والرئيس التنفيذي',
      'founder.location': 'أربيل، العراق',
      'founder.kicker': 'القيادة والرؤية',
      'founder.title': 'بناء أساس لعراق أذكى وأكثر ترابطاً',
      'founder.bio1': 'مصطفى جلال خوشناو هو مؤسس AI Gate Iraq، وهي مبادرة استراتيجية تركز على الذكاء الاصطناعي والحكومة الرقمية وتسهيل التجارة والبنية التحتية الرقمية في العراق.',
      'founder.bio2': 'تقوم رؤيته على أن تكون التكنولوجيا أداة عملية تقلل التعقيد، وتسرع القرار، وتزيد الثقة في العمليات التجارية.',
      'founder.f1': 'الذكاء الاصطناعي والأتمتة',
      'founder.f2': 'الحكومة الرقمية',
      'founder.f3': 'تسهيل التجارة',
      'founder.f4': 'البنية الرقمية الوطنية',
      'principles.kicker': 'مبادئ العمل',
      'principles.title': 'تقنية من أجل نتائج حقيقية',
      'principles.p1t': 'الفعل قبل المعلومات',
      'principles.p1d': 'يجب أن يوضح كل قسم الخطوة التالية للمستخدم.',
      'principles.p2t': 'الوضوح قبل التعقيد',
      'principles.p2d': 'يجب أن يقلل النظام التعقيد، لا أن يضاعفه.',
      'principles.p3t': 'الثقة عبر التصميم',
      'principles.p3d': 'الحماية والوضوح وسجل العمل جزء من التجربة الأساسية.',
      'principles.p4t': 'مصمم للعراق',
      'principles.p4d': 'تؤخذ اللغة والسوق والعمليات والاحتياجات المحلية في الاعتبار من البداية.',
      'cta.kicker': 'شراكة استراتيجية',
      'cta.title': 'شاركنا في بناء البنية التجارية للمستقبل',
      'cta.primary': 'طلب المشاركة',
      'cta.secondary': 'اتصل بنا',
      'footer.privacy': 'سياسة الخصوصية'
    },
    en: {
      'a11y.skip': 'Skip to main content',
      'nav.home': 'Home',
      'nav.mission': 'Mission',
      'nav.founder': 'Founder',
      'nav.principles': 'Principles',
      'hero.kicker': 'About AI Gate Iraq',
      'hero.title': 'Intelligent infrastructure for trade and logistics in Iraq',
      'hero.lead': 'AI Gate Iraq is a trade-technology initiative designed to reduce complexity across importing, transport, customs, sourcing and commercial decision-making.',
      'hero.cta1': 'Apply to Participate',
      'hero.cta2': 'Return to Website',
      'nodes.trade': 'Trade Intelligence',
      'nodes.logistics': 'Smart Logistics',
      'nodes.decision': 'Decision Support',
      'mission.kicker': 'Our Mission',
      'mission.title': 'Turning fragmented processes into one clear, unified system',
      'mission.lead': 'We are building a platform that brings information, estimates, suppliers, shipment tracking and commercial guidance into one workspace.',
      'mission.p1t': 'Decision clarity',
      'mission.p1d': 'Decisions are supported by data, history and reviewable options.',
      'mission.p2t': 'Simplified operations',
      'mission.p2d': 'Complex processes are converted into clear, actionable steps.',
      'mission.p3t': 'Trust by design',
      'mission.p3d': 'Information, accounts and work history are managed in a protected environment.',
      'founder.role': 'Founder & CEO',
      'founder.location': 'Erbil, Iraq',
      'founder.kicker': 'Leadership and Vision',
      'founder.title': 'Building the foundation for a smarter, more connected Iraq',
      'founder.bio1': 'Mustafa Jalal Khoshnaw is the founder of AI Gate Iraq, a strategic initiative focused on artificial intelligence, digital government, trade facilitation and Iraq’s digital infrastructure.',
      'founder.bio2': 'His vision is for technology to become a practical instrument that reduces complexity, accelerates decisions and builds trust across commercial operations.',
      'founder.f1': 'AI and Automation',
      'founder.f2': 'Digital Government',
      'founder.f3': 'Trade Facilitation',
      'founder.f4': 'National Digital Infrastructure',
      'principles.kicker': 'Operating Principles',
      'principles.title': 'Technology for real outcomes',
      'principles.p1t': 'Action before information',
      'principles.p1d': 'Every section should make the user’s next step clear.',
      'principles.p2t': 'Clarity before complexity',
      'principles.p2d': 'The system should reduce complexity rather than add to it.',
      'principles.p3t': 'Trust by design',
      'principles.p3d': 'Protection, transparency and work history are part of the core experience.',
      'principles.p4t': 'Built for Iraq',
      'principles.p4d': 'Language, market realities, workflows and local needs are considered from the start.',
      'cta.kicker': 'Strategic Partnership',
      'cta.title': 'Join us in building the trade infrastructure of the future',
      'cta.primary': 'Apply to Participate',
      'cta.secondary': 'Contact Us',
      'footer.privacy': 'Privacy Policy'
    }
  };

  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const ku = Object.fromEntries(nodes.map((node) => [node.dataset.i18n, node.textContent.trim()]));
  translations.ku = ku;

  const meta = {
    ku: { dir: 'rtl', title: 'دەربارەی AI Gate Iraq' },
    ar: { dir: 'rtl', title: 'عن AI Gate Iraq' },
    en: { dir: 'ltr', title: 'About AI Gate Iraq' }
  };

  const applyLanguage = (language) => {
    const safe = translations[language] ? language : 'ku';
    document.documentElement.lang = safe;
    document.documentElement.dir = meta[safe].dir;
    document.title = meta[safe].title;
    nodes.forEach((node) => {
      const value = translations[safe][node.dataset.i18n] || translations.ku[node.dataset.i18n];
      if (value) node.textContent = value;
    });
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === safe;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('aigateiraq-language', safe); } catch {}
  };

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  let preferred = 'ku';
  try { preferred = localStorage.getItem('aigateiraq-language') || 'ku'; } catch {}
  applyLanguage(preferred);
})();
