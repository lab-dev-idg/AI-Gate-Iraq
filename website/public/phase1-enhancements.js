(() => {
  'use strict';

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
