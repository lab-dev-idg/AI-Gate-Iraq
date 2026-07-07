(() => {
  const replacements = {
    'hero.title': 'یەک دەروازە بۆ بازرگانی و گواستنەوەی عێراق',
    'hero.lead': 'AI Gate Iraq خزمەتگوزارییە پەرتەوازەکانی هاوردەکردن، گواستنەوە، دابینکردن و ڕاوێژکاری بازرگانی لە یەک شوێنی کاری زیرەک و ڕێکخراودا کۆدەکاتەوە.',
    'hero.trust1': 'دروستکراو بۆ بازاڕی عێراق',
    'hero.trust3': 'گونجاو بۆ مۆبایل',
    'preview.title': 'ڕاوێژکاری بازرگانی و گواستنەوە',
    'solution.problem1': 'کاری دەستی و کات‌خۆر',
    'solution.problem3': 'هەڵەی زیاتر لە خەمڵاندن و ژمێریاری',
    'services.s2d': 'کۆکردنەوەی هۆکارە سەرەکییەکان بۆ خەمڵاندنی سەرەتایی تێچوو.',
    'services.s3d': 'ژمێرین و بەراوردکردنی نرخەکان بە شێوەیەکی ڕێکخراو.',
    'services.s6d': 'لیستی پشکنین و ڕێنمایی بۆ بەڵگەنامە و هەنگاوەکانی ناساندن.',
    'pilot.support': 'یارمەتی',
    'pilot.supportValue': 'ڕێنمایی و بەدواداچوون',
    'security.title': 'دروستکراو بۆ کارکردنی پیشەیی و پارێزراو'
  };

  const apply = () => {
    if (document.documentElement.lang !== 'ku') return;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const text = replacements[node.dataset.i18n];
      if (text) node.textContent = text;
    });
  };

  apply();
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  new MutationObserver(apply).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['lang'] });
})();
