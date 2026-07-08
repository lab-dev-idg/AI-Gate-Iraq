(() => {
  'use strict';

  const PLATFORM_LANDING_URL = 'https://app.aigateiraq.com/';
  const LEGACY_PLATFORM_HOSTS = new Set([
    
    
    
  ]);

  const root = document.documentElement;
  const body = document.body;
  const year = document.getElementById('year');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const languageButtons = [...document.querySelectorAll('[data-lang]')];
  const textNodes = [...document.querySelectorAll('[data-i18n]')];
  const attributeNodes = [...document.querySelectorAll('[data-i18n-aria-label], [data-i18n-title]')];
  const kurdish = Object.fromEntries(textNodes.map((node) => [node.dataset.i18n, node.textContent.trim()]));
  let translations = { ku: kurdish, ar: {}, en: {} };
  let activeLanguage = 'ku';
  let lastFocusedElement = null;

  const routePlatformLinksToLanding = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        const isPlatformLink =
          LEGACY_PLATFORM_HOSTS.has(url.hostname) ||
          url.hostname === 'app.aigateiraq.com' ||
          link.dataset.i18n === 'nav.openApp' ||
          link.dataset.i18n === 'hero.primaryCta' ||
          link.dataset.i18n === 'cta.primary';

        if (!isPlatformLink) return;

        link.href = PLATFORM_LANDING_URL;
        link.removeAttribute('target');
        link.removeAttribute('rel');
      } catch {
        // Ignore malformed or non-HTTP links.
      }
    });
  };

  routePlatformLinksToLanding();

  const metaByLanguage = {
    ku: { dir: 'rtl', locale: 'ku_IQ', title: 'AI Gate Iraq — یەک دەروازە بۆ بازرگانی و گواستنەوە', description: 'AI Gate Iraq — یەک دەروازە بۆ خزمەتگوزارییە بازرگانی و گواستنەوەییەکان لە عێراق.', open: 'کردنەوەی لیست', close: 'داخستنی لیست' },
    ar: { dir: 'rtl', locale: 'ar_IQ', title: 'AI Gate Iraq — بوابة واحدة للتجارة والخدمات اللوجستية', description: 'منصة ذكية ومنظمة لخدمات التجارة والاستيراد والنقل والتوريد في العراق.', open: 'فتح القائمة', close: 'إغلاق القائمة' },
    en: { dir: 'ltr', locale: 'en_US', title: 'AI Gate Iraq — One Gateway for Trade and Logistics', description: 'An intelligent workspace for trade, import, transport, sourcing and logistics in Iraq.', open: 'Open menu', close: 'Close menu' },
  };

  const interfaceTranslations = {
    ar: {
      'a11y.skip': 'الانتقال إلى المحتوى الرئيسي',
      'a11y.home': 'الصفحة الرئيسية لـ AI Gate Iraq',
      'a11y.mainNav': 'التنقل الرئيسي',
      'a11y.language': 'تغيير اللغة',
      'a11y.preview': 'معاينة منصة AI Gate Iraq',
      'footer.privacy': 'سياسة الخصوصية',
      'footer.terms': 'شروط الاستخدام',
      'footer.ai': 'إخلاء مسؤولية الذكاء الاصطناعي',
      'footer.about': 'عن AI Gate Iraq',
      'footer.contact': 'الاتصال والدعم',
    },
    en: {
      'a11y.skip': 'Skip to main content',
      'a11y.home': 'AI Gate Iraq home',
      'a11y.mainNav': 'Main navigation',
      'a11y.language': 'Change language',
      'a11y.preview': 'AI Gate Iraq platform preview',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Use',
      'footer.ai': 'AI Disclaimer',
      'footer.about': 'About AI Gate Iraq',
      'footer.contact': 'Contact and Support',
    },
  };

  if (year) year.textContent = String(new Date().getFullYear());

  const loadShareSuite = () => {
    if (!document.querySelector('link[data-share-suite-style]')) {
      const shareStyle = document.createElement('link');
      shareStyle.rel = 'stylesheet';
      shareStyle.href = '/styles/share-tools.css';
      shareStyle.dataset.shareSuiteStyle = '';
      document.head.append(shareStyle);
    }

    if (!document.querySelector('script[data-share-suite-loader]')) {
      const shareScript = document.createElement('script');
      shareScript.src = '/share-tools.js';
      shareScript.defer = true;
      shareScript.dataset.shareSuiteLoader = '';
      document.head.append(shareScript);
    }
  };

  window.addEventListener('pointerdown', loadShareSuite, { once: true, passive: true });
  window.addEventListener('keydown', loadShareSuite, { once: true });

  const setMeta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
  const focusableMenuItems = () => mainNav ? [...mainNav.querySelectorAll('a[href],button:not([disabled])')] : [];
  const updateMenuLabel = (open) => menuToggle?.setAttribute('aria-label', open ? metaByLanguage[activeLanguage].close : metaByLanguage[activeLanguage].open);

  const closeMenu = (restoreFocus = false) => {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    updateMenuLabel(false);
    if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  const openMenu = () => {
    if (!mainNav || !menuToggle) return;
    lastFocusedElement = document.activeElement;
    mainNav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    updateMenuLabel(true);
    focusableMenuItems()[0]?.focus();
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => mainNav.classList.contains('open') ? closeMenu(true) : openMenu());
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (event) => {
      if (!mainNav.classList.contains('open')) return;
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); return; }
      if (event.key !== 'Tab') return;
      const items = focusableMenuItems();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
  }

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  }

  const applyLanguage = (language) => {
    const safeLanguage = ['ku', 'ar', 'en'].includes(language) ? language : 'ku';
    const dictionary = translations[safeLanguage] || translations.ku;
    const meta = metaByLanguage[safeLanguage];
    activeLanguage = safeLanguage;
    root.lang = safeLanguage;
    root.dir = meta.dir;
    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:locale"]', meta.locale);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);

    textNodes.forEach((node) => {
      const value = dictionary[node.dataset.i18n] || translations.ku[node.dataset.i18n];
      if (value) node.textContent = value;
    });
    attributeNodes.forEach((node) => {
      const ariaKey = node.dataset.i18nAriaLabel;
      const titleKey = node.dataset.i18nTitle;
      if (ariaKey) node.setAttribute('aria-label', dictionary[ariaKey] || translations.ku[ariaKey] || node.getAttribute('aria-label'));
      if (titleKey) node.setAttribute('title', dictionary[titleKey] || translations.ku[titleKey] || node.getAttribute('title'));
    });
    languageButtons.forEach((button) => {
      const active = button.dataset.lang === safeLanguage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    routePlatformLinksToLanding();
    updateMenuLabel(Boolean(mainNav?.classList.contains('open')));
    try { localStorage.setItem('aigateiraq-language', safeLanguage); } catch {}
  };

  languageButtons.forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));

  const initialize = async () => {
    try {
      const response = await fetch('/translations.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
      const remote = await response.json();
      translations = {
        ku: kurdish,
        ar: { ...(remote.ar || {}), ...interfaceTranslations.ar },
        en: { ...(remote.en || {}), ...interfaceTranslations.en },
      };
    } catch (error) {
      console.warn('Translations could not be loaded; Kurdish remains available.', error);
    }
    let preferred = 'ku';
    try { preferred = localStorage.getItem('aigateiraq-language') || 'ku'; } catch {}
    applyLanguage(preferred);
  };

  void initialize();
})();
