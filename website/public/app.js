(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const year = document.getElementById('year');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const languageButtons = Array.from(document.querySelectorAll('[data-lang]'));
  const translatableNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const attributeNodes = Array.from(document.querySelectorAll('[data-i18n-aria-label], [data-i18n-title]'));
  const kurdish = Object.fromEntries(translatableNodes.map((node) => [node.dataset.i18n, node.textContent.trim()]));

  let translations = { ku: kurdish, ar: {}, en: {} };
  let activeLanguage = 'ku';
  let lastFocusedElement = null;

  const languageMeta = {
    ku: {
      dir: 'rtl',
      locale: 'ku_IQ',
      title: 'AI Gate Iraq — یەک دەروازە بۆ بازرگانی و لۆجیستیک',
      description: 'AI Gate Iraq — یەک دەروازە بۆ خزمەتگوزارییە بازرگانی و لۆجیستییەکان لە عێراق.',
      menuOpen: 'کردنەوەی لیست',
      menuClose: 'داخستنی لیست',
    },
    ar: {
      dir: 'rtl',
      locale: 'ar_IQ',
      title: 'AI Gate Iraq — بوابة واحدة للتجارة والخدمات اللوجستية',
      description: 'منصة ذكية ومنظمة لخدمات التجارة والاستيراد والنقل والتوريد في العراق.',
      menuOpen: 'فتح القائمة',
      menuClose: 'إغلاق القائمة',
    },
    en: {
      dir: 'ltr',
      locale: 'en_US',
      title: 'AI Gate Iraq — One Gateway for Trade and Logistics',
      description: 'An intelligent workspace for trade, import, transport, sourcing and logistics in Iraq.',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
  };

  if (year) year.textContent = String(new Date().getFullYear());

  const setMeta = (selector, attribute, value) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  };

  const getFocusableMenuElements = () => {
    if (!mainNav) return [];
    return Array.from(mainNav.querySelectorAll('a[href], button:not([disabled])'));
  };

  const updateMenuLabel = (open) => {
    if (!menuToggle) return;
    const meta = languageMeta[activeLanguage];
    menuToggle.setAttribute('aria-label', open ? meta.menuClose : meta.menuOpen);
  };

  const closeMenu = ({ restoreFocus = false } = {}) => {
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
    const [firstFocusable] = getFocusableMenuElements();
    if (firstFocusable) firstFocusable.focus();
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) closeMenu({ restoreFocus: true });
      else openMenu();
    });

    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

    document.addEventListener('keydown', (event) => {
      if (!mainNav.classList.contains('open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusableMenuElements();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const revealNodes = Array.from(document.querySelectorAll('.reveal'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  }

  const applyLanguage = (lang) => {
    const safeLang = ['ku', 'ar', 'en'].includes(lang) ? lang : 'ku';
    const dictionary = translations[safeLang] || translations.ku;
    const meta = languageMeta[safeLang];
    activeLanguage = safeLang;

    root.lang = safeLang;
    root.dir = meta.dir;
    document.title = meta.title;

    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:locale"]', 'content', meta.locale);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);

    translatableNodes.forEach((node) => {
      const key = node.dataset.i18n;
      const value = dictionary[key] || translations.ku[key];
      if (value) node.textContent = value;
    });

    attributeNodes.forEach((node) => {
      const ariaKey = node.dataset.i18nAriaLabel;
      const titleKey = node.dataset.i18nTitle;
      if (ariaKey) node.setAttribute('aria-label', dictionary[ariaKey] || translations.ku[ariaKey] || node.getAttribute('aria-label'));
      if (titleKey) node.setAttribute('title', dictionary[titleKey] || translations.ku[titleKey] || node.getAttribute('title'));
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === safeLang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    updateMenuLabel(Boolean(mainNav?.classList.contains('open')));

    try {
      localStorage.setItem('aigateiraq-language', safeLang);
    } catch {
      // The selected language remains active when storage is unavailable.
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
