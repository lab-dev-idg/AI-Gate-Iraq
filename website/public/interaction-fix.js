(() => {
  'use strict';

  const PLATFORM_URL = 'https://app.aigateiraq.com/';

  const isPlatformLink = (link) => {
    if (!(link instanceof HTMLAnchorElement)) return false;
    const key = link.dataset.i18n || '';
    if (['nav.openApp', 'hero.primaryCta', 'cta.primary'].includes(key)) return true;
    try {
      const url = new URL(link.href, location.origin);
      return [
        'app.aigateiraq.com',
        'ai-gate-iraq-platform.web.app',
        'ai-gate-iraq-platform.firebaseapp.com',
        'ai-gate-iraq-platform.aigateiraq.workers.dev',
      ].includes(url.hostname);
    } catch {
      return false;
    }
  };

  const normalize = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (!isPlatformLink(link)) return;
      link.href = PLATFORM_URL;
      link.removeAttribute('target');
      link.removeAttribute('rel');
    });
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

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('#menuToggle')) {
      event.preventDefault();
      toggleMenu();
      return;
    }

    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    if (isPlatformLink(link)) {
      event.preventDefault();
      location.assign(PLATFORM_URL);
      return;
    }

    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') && href.length > 1) {
      const section = document.querySelector(href);
      if (!section) return;
      event.preventDefault();
      document.getElementById('mainNav')?.classList.remove('open');
      document.body.classList.remove('menu-open');
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, true);

  document.addEventListener('DOMContentLoaded', normalize);
  window.addEventListener('pageshow', normalize);
  normalize();
})();
