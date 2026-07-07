(() => {
  const pairs = new Map([
    ['ئاسایش', 'پاراستن'],
    ['پلاتفۆرمی زیرەکی بازرگانی و لۆجیستی بۆ عێراق', 'پلاتفۆرمی زیرەکی بازرگانی و گواستنەوە بۆ عێراق'],
    ['دیزاینکراو بۆ بازاڕی عێراق', 'دروستکراو بۆ بازاڕی عێراق'],
    ['ڕاوێژکاری بازرگانی و لۆجیستی', 'ڕاوێژکاری بازرگانی و گواستنەوە'],
    ['زمانی پشتیوانیکراو', 'زمانە بەردەستەکان'],
    ['بۆ تیمەکانی هاوردە، بازرگانی و لۆجیستیک', 'بۆ گرووپەکانی هاوردە، بازرگانی و گواستنەوە'],
    ['ڕێکخستنی بڕیار و دۆکیومێنتەکان لە یەک شوێن', 'ڕێکخستنی بڕیار و بەڵگەنامەکان لە یەک شوێن'],
    ['دیزاینکراو بە بنەمای ئاسایش و سادگی', 'دروستکراو بە بنەمای پاراستن و سادەیی']
  ]);

  const apply = () => {
    if (document.documentElement.lang !== 'ku') return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const value = node.textContent?.trim();
      if (value && pairs.has(value)) node.textContent = pairs.get(value);
    }
  };

  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  apply();
})();
