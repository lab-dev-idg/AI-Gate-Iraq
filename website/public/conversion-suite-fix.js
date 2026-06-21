(() => {
  'use strict';

  const legacy = document.querySelector('.pilot-application#pilot-apply');
  if (legacy) legacy.remove();

  const suite = document.getElementById('demo-request');
  if (!suite) return;

  if (!document.getElementById('pilot-apply')) {
    const anchor = document.createElement('span');
    anchor.id = 'pilot-apply';
    anchor.className = 'conversion-anchor';
    anchor.setAttribute('aria-hidden', 'true');
    suite.prepend(anchor);
  }

  const form = suite.querySelector('#conversionForm');
  const steps = [...suite.querySelectorAll('.conversion-step')];
  const navItems = [...suite.querySelectorAll('aside ol li')];
  const back = suite.querySelector('#conversionBack');
  const next = suite.querySelector('#conversionNext');
  const submit = suite.querySelector('#conversionSubmit');
  const review = suite.querySelector('#conversionReview');

  if (!form || steps.length !== 3 || navItems.length !== 3) return;

  let current = steps.findIndex((step) => step.classList.contains('active'));
  if (current < 0) current = 0;
  let maxUnlocked = current;

  const currentIsValid = () => [...steps[current].querySelectorAll('input, select, textarea')]
    .every((field) => field.checkValidity());

  const refreshReview = () => {
    if (!review || current !== 2) return;
    const data = new FormData(form);
    const labels = {
      company: 'ناوی کۆمپانیا',
      name: 'ناوی پەیوەندیکار',
      email: 'ئیمەیڵی کاری',
      phone: 'ژمارەی پەیوەندی',
      sector: 'بواری کار',
      team: 'قەبارەی تیم',
      intent: 'جۆری داواکاری',
      timeline: 'کاتی دەستپێکردن',
      challenge: 'پێویستی سەرەکی'
    };
    review.innerHTML = Object.keys(labels)
      .map((key) => `<div><span>${labels[key]}</span><strong>${String(data.get(key) || '—')}</strong></div>`)
      .join('');
  };

  const render = () => {
    steps.forEach((step, index) => step.classList.toggle('active', index === current));
    navItems.forEach((item, index) => {
      item.classList.toggle('active', index === current);
      item.classList.toggle('completed', index < current || index < maxUnlocked);
      item.classList.toggle('locked', index > maxUnlocked);
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', index <= maxUnlocked ? '0' : '-1');
      item.setAttribute('aria-current', index === current ? 'step' : 'false');
      item.setAttribute('aria-disabled', index > maxUnlocked ? 'true' : 'false');
    });
    if (back) back.hidden = current === 0;
    if (next) next.hidden = current === steps.length - 1;
    if (submit) submit.hidden = current !== steps.length - 1;
    refreshReview();
  };

  const goTo = (target) => {
    if (target > maxUnlocked) return;
    current = target;
    render();
  };

  navItems.forEach((item, index) => {
    const activate = () => goTo(index);
    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  next?.addEventListener('click', () => {
    const fields = [...steps[current].querySelectorAll('input, select, textarea')];
    const valid = fields.every((field) => field.reportValidity());
    if (!valid) return;
    maxUnlocked = Math.max(maxUnlocked, Math.min(current + 1, steps.length - 1));
    current = Math.min(current + 1, steps.length - 1);
    render();
  }, true);

  back?.addEventListener('click', () => {
    current = Math.max(0, current - 1);
    render();
  }, true);

  form.addEventListener('input', () => {
    if (currentIsValid()) maxUnlocked = Math.max(maxUnlocked, current + 1);
    render();
  });

  document.querySelectorAll('a[href="#pilot-apply"]').forEach((link) => {
    link.addEventListener('click', () => {
      requestAnimationFrame(() => suite.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
  });

  render();
})();
