(() => {
  'use strict';

  const labels = {
    ku: 'دەربارەی ئێمە',
    ar: 'من نحن',
    en: 'About'
  };

  const currentLanguage = () => ['ku', 'ar', 'en'].includes(document.documentElement.lang)
    ? document.documentElement.lang
    : 'ku';

  const ensureAboutLink = () => {
    const nav = document.getElementById('mainNav');
    if (nav && !nav.querySelector('a[href="/about.html"]')) {
      const link = document.createElement('a');
      link.href = '/about.html';
      link.dataset.phase2About = 'true';
      link.textContent = labels[currentLanguage()];
      nav.insertBefore(link, nav.querySelector('.mobile-app-link'));
    }

    document.querySelectorAll('[data-phase2-about]').forEach((link) => {
      link.textContent = labels[currentLanguage()];
    });
  };

  const loadAuditLayer = () => {
    if (!document.querySelector('link[href="/styles/site-audit.css"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = '/styles/site-audit.css';
      document.head.appendChild(stylesheet);
    }

    if (!document.querySelector('script[src="/site-audit.js"]')) {
      const script = document.createElement('script');
      script.src = '/site-audit.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  };

  ensureAboutLink();

  const conversionStyles = document.createElement('link');
  conversionStyles.rel = 'stylesheet';
  conversionStyles.href = '/styles/conversion-suite.css';
  if (!document.querySelector('link[href="/styles/conversion-suite.css"]')) {
    document.head.appendChild(conversionStyles);
  }

  const conversionScript = document.createElement('script');
  conversionScript.src = '/conversion-suite.js';
  conversionScript.defer = true;
  conversionScript.addEventListener('load', () => {
    if (!document.querySelector('script[src="/conversion-suite-fix.js"]')) {
      const fixScript = document.createElement('script');
      fixScript.src = '/conversion-suite-fix.js';
      fixScript.defer = true;
      document.body.appendChild(fixScript);
    }
  });
  if (!document.querySelector('script[src="/conversion-suite.js"]')) {
    document.body.appendChild(conversionScript);
  } else if (!document.querySelector('script[src="/conversion-suite-fix.js"]')) {
    const fixScript = document.createElement('script');
    fixScript.src = '/conversion-suite-fix.js';
    fixScript.defer = true;
    document.body.appendChild(fixScript);
  }

  if (!document.querySelector('script[src="/hero-mouse-parallax.js"]')) {
    const parallaxScript = document.createElement('script');
    parallaxScript.src = '/hero-mouse-parallax.js';
    parallaxScript.defer = true;
    document.body.appendChild(parallaxScript);
  }

  loadAuditLayer();

  new MutationObserver(ensureAboutLink).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });

  document.querySelectorAll('.faq-list details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;

      document.querySelectorAll('.faq-list details[open]').forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });

  const form = document.getElementById('pilotApplicationForm');

  form?.addEventListener('submit', (event) => {
    if (form.checkValidity()) return;

    event.preventDefault();
    form.reportValidity();
  });
})();
