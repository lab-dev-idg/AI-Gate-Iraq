(() => {
  'use strict';

  const root = document.documentElement;
  const year = document.getElementById('year');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const languageButtons = Array.from(document.querySelectorAll('[data-lang]'));
  const translatableNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const kurdish = Object.fromEntries(
    translatableNodes.map((node) => [node.dataset.i18n, node.textContent.trim()]),
  );

  let translations = { ku: kurdish, ar: {}, en: {} };

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = !mainNav.classList.contains('open');
      mainNav.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });

    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const revealNodes = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }

  const languageMeta = {
    ku: {
      dir: 'rtl',
      title: 'AI Gate Iraq — یەک دەروازە بۆ بازرگانی و لۆجیستیک',
      description: 'AI Gate Iraq — یەک دەروازە بۆ خزمەتگوزارییە بازرگانی و لۆجیستییەکان لە عێراق.',
    },
    ar: {
      dir: 'rtl',
      title: 'AI Gate Iraq — بوابة واحدة للتجارة والخدمات اللوجستية',
      description: 'منصة ذكية ومنظمة لخدمات التجارة والاستيراد والنقل والتوريد في العراق.',
    },
    en: {
      dir: 'ltr',
      title: 'AI Gate Iraq — One Gateway for Trade and Logistics',
      description: 'An intelligent workspace for trade, import, transport, sourcing and logistics in Iraq.',
    },
  };

  const applyLanguage = (lang) => {
    const safeLang = ['ku', 'ar', 'en'].includes(lang) ? lang : 'ku';
    const dictionary = translations[safeLang] || translations.ku;
    const meta = languageMeta[safeLang];

    root.lang = safeLang;
    root.dir = meta.dir;
    document.title = meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', meta.description);

    translatableNodes.forEach((node) => {
      const key = node.dataset.i18n;
      const value = dictionary[key] || translations.ku[key];
      if (value) node.textContent = value;
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === safeLang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    try {
      localStorage.setItem('aigateiraq-language', safeLang);
    } catch {
      // Language still applies when storage is unavailable.
    }
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  const initializeLanguage = async () => {
    try {
      const response = await fetch('/translations.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
      const remote = await response.json();
      translations = { ku: kurdish, ar: remote.ar || {}, en: remote.en || {} };
    } catch (error) {
      console.warn('Translations could not be loaded; Kurdish remains available.', error);
    }

    let preferred = 'ku';
    try {
      preferred = localStorage.getItem('aigateiraq-language') || 'ku';
    } catch {
      preferred = 'ku';
    }
    applyLanguage(preferred);
  };

  void initializeLanguage();
})();
