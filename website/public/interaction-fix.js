(() => {
  'use strict';

  const PLATFORM_URL = 'https://app.aigateiraq.com/';

  const platformKeys = new Set([
    'nav.openApp',
    'hero.primaryCta',
    'cta.primary',
  ]);

  const platformHosts = new Set([
    'app.aigateiraq.com',
    'ai-gate-iraq-platform.aigateiraq.workers.dev',
    'ai-gate-iraq-platform.web.app',
    'ai-gate-iraq-platform.firebaseapp.com',
  ]);

  const isPlatformLink = (element) => {
    if (!(element instanceof HTMLAnchorElement)) return false;
    if (platformKeys.has(element.dataset.i18n || '')) return true;

    try {
      const url = new URL(element.href, window.location.origin);
      return platformHosts.has(url.hostname);
    } catch {
      return false;
    }
  };

  const normalizePlatformLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (!isPlatformLink(link)) return;
      link.href = PLATFORM_URL;
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.dataset.platformLink = 'landing';
    });
  };

  const closeMenu = () => {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('menuToggle');
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('menuToggle');
    if (!nav || !toggle) return;

    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  const applyLanguageFallback = (language) => {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    try {
      localStorage.setItem('aigateiraq-language', language);
    } catch {}

    if (window.location.hash) return;
  };

  document.addEventListener('DOMContentLoaded', normalizePlatformLinks);
  window.addEventListener('pageshow', normalizePlatformLinks);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const menuButton = target.closest('#menuToggle');
    if (menuButton) {
      event.preventDefault();
      toggleMenu();
      return;
    }

    const languageButton = target.closest('[data-lang]');
    if (languageButton instanceof HTMLElement) {
      applyLanguageFallback(languageButton.dataset.lang || 'ku');
      return;
    }

    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    if (isPlatformLink(link)) {
      event.preventDefault();
      window.location.assign(PLATFORM_URL);
      return;
    }

    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') && href.length > 1) {
      const destination = document.querySelector(href);
      if (destination) {
        event.preventDefault();
        closeMenu();
        destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    }
  }, true);

  new MutationObserver(normalizePlatformLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'data-i18n', 'class'],
  });

  normalizePlatformLinks();
})();
