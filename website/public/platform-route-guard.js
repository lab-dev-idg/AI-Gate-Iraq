(() => {
  'use strict';

  if (!document.querySelector('script[src="/sorani-cleanup.js"]')) {
    const soraniCleanup = document.createElement('script');
    soraniCleanup.src = '/sorani-cleanup.js';
    soraniCleanup.defer = true;
    document.head.appendChild(soraniCleanup);
  }

  const PLATFORM_LANDING_URL = 'https://app.aigateiraq.com/';
  const PLATFORM_HOSTS = new Set([
    'app.aigateiraq.com',
    
    'ai-gate-iraq-platform.web.app',
    'ai-gate-iraq-platform.firebaseapp.com',
  ]);
  const PLATFORM_I18N_KEYS = new Set([
    'nav.openApp',
    'hero.primaryCta',
    'cta.primary',
  ]);

  const isPlatformControl = (element) => {
    if (!(element instanceof HTMLElement)) return false;

    const i18nKey = element.dataset.i18n || '';
    if (PLATFORM_I18N_KEYS.has(i18nKey)) return true;

    if (element instanceof HTMLAnchorElement) {
      try {
        const url = new URL(element.href, window.location.origin);
        if (PLATFORM_HOSTS.has(url.hostname)) return true;
      } catch {
        return false;
      }
    }

    return element.matches('.mobile-app-link, [data-platform-link], [data-open-platform]');
  };

  const normalizePlatformControl = (element) => {
    if (!(element instanceof HTMLElement) || !isPlatformControl(element)) return;

    if (element instanceof HTMLAnchorElement) {
      element.href = PLATFORM_LANDING_URL;
      element.removeAttribute('target');
      element.removeAttribute('rel');
    }

    element.dataset.platformLink = 'landing';
  };

  const normalizeAll = (root = document) => {
    root.querySelectorAll?.('a[href], [data-i18n], .mobile-app-link, [data-platform-link], [data-open-platform]')
      .forEach(normalizePlatformControl);
  };

  normalizeAll();

  document.addEventListener('click', (event) => {
    const control = event.target instanceof Element
      ? event.target.closest('a, button, [role="button"]')
      : null;

    if (!(control instanceof HTMLElement) || !isPlatformControl(control)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(PLATFORM_LANDING_URL);
  }, true);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        normalizePlatformControl(node);
        normalizeAll(node);
      });

      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
        normalizePlatformControl(mutation.target);
      }
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'data-i18n', 'class'],
  });
})();
