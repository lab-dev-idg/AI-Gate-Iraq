(() => {
  'use strict';

  const language = () => ['ku', 'ar', 'en'].includes(document.documentElement.lang)
    ? document.documentElement.lang
    : 'ku';

  const content = {
    ku: {
      kicker: 'مۆدێلی کارکردن',
      title: 'سێ چین بۆ بڕیاردان و جێبەجێکردنی بازرگانی',
      lead: 'ئەم بەشە جیاوازە لە نموونەی کارکردن؛ لێرە پێکهاتەی سەرەکیی سیستەمەکە پیشان دەدرێت، نە بەراوردی دۆخی پێشتر و دۆخی نوێ.',
      c1t: 'زیرەکی و زانیاری',
      c1d: 'کۆکردنەوە، ڕێکخستن و شیکردنەوەی زانیارییە بازرگانی و لۆجیستییەکان بۆ دروستکردنی بنەمای بڕیار.',
      c2t: 'جێبەجێکردن و بەدواداچوون',
      c2d: 'گۆڕینی بڕیار بۆ هەنگاوی کار، دیاریکردنی بەرپرسیارێتی و بەدواداچوونی پێشکەوتن لە یەک شوێنی کاردا.',
      c3t: 'پشکنین و پەسەندکردن',
      c3d: 'پاراستنی مێژووی کار، بڕیار و بەڵگەکان بە شێوەیەک کە ئامادەی پشکنین و پەسەندکردن بن.',
      outcome: 'ئەنجام: بڕیاری خێراتر، کردارێکی ڕوونتر و مێژوویەکی پارێزراو بۆ هەر پڕۆسەیەک.'
    },
    ar: {
      kicker: 'نموذج التشغيل',
      title: 'ثلاث طبقات لصنع القرار والتنفيذ التجاري',
      lead: 'يختلف هذا القسم عن سيناريو الحالة؛ فهو يوضح البنية التشغيلية للمنصة بدلاً من مقارنة الوضع السابق والجديد.',
      c1t: 'الذكاء والمعلومات',
      c1d: 'جمع وتنظيم وتحليل المعلومات التجارية واللوجستية لبناء أساس واضح للقرار.',
      c2t: 'التنفيذ والمتابعة',
      c2d: 'تحويل القرار إلى خطوات عمل وتحديد المسؤوليات ومتابعة التقدم في مساحة واحدة.',
      c3t: 'المراجعة والاعتماد',
      c3d: 'حفظ سجل العمل والقرارات والأدلة بصورة جاهزة للمراجعة والاعتماد.',
      outcome: 'النتيجة: قرارات أسرع، تنفيذ أوضح، وسجل محمي لكل عملية.'
    },
    en: {
      kicker: 'Operating Model',
      title: 'Three layers for commercial decision-making and execution',
      lead: 'This section is intentionally distinct from the case scenario: it explains the platform operating architecture rather than comparing before and after states.',
      c1t: 'Intelligence and Information',
      c1d: 'Collect, structure and analyze commercial and logistics information to create a clear decision foundation.',
      c2t: 'Execution and Tracking',
      c2d: 'Turn decisions into actions, assign ownership and track progress within one operational workspace.',
      c3t: 'Review and Approval',
      c3d: 'Preserve work, decisions and evidence in a form ready for review and approval.',
      outcome: 'Outcome: faster decisions, clearer execution and a protected history for every process.'
    }
  };

  const replaceForbiddenTerms = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return;
      node.nodeValue = node.nodeValue
        .replaceAll('قابل‌پشکنین', 'ئامادە بۆ پشکنین و پەسەندکردن')
        .replaceAll('قابل پشکنین', 'ئامادە بۆ پشکنین و پەسەندکردن');
    });
  };

  const renderOperatingModel = () => {
    const section = document.getElementById('solution');
    if (!section) return;
    const t = content[language()];
    section.classList.add('operating-model-section');
    section.innerHTML = `
      <div class="container">
        <div class="operating-model-head reveal visible">
          <div>
            <span class="section-kicker">${t.kicker}</span>
            <h2>${t.title}</h2>
          </div>
          <p>${t.lead}</p>
        </div>
        <div class="operating-model-grid reveal visible">
          <article><span>01</span><h3>${t.c1t}</h3><p>${t.c1d}</p></article>
          <article><span>02</span><h3>${t.c2t}</h3><p>${t.c2d}</p></article>
          <article><span>03</span><h3>${t.c3t}</h3><p>${t.c3d}</p></article>
        </div>
        <div class="operating-model-outcome reveal visible">${t.outcome}</div>
      </div>`;
  };

  const removeDuplicateLayers = () => {
    const phase2 = document.querySelectorAll('#phase2TrustSections');
    phase2.forEach((node, index) => { if (index > 0) node.remove(); });
    const enterprise = document.querySelectorAll('#enterpriseTrustLayer');
    enterprise.forEach((node, index) => { if (index > 0) node.remove(); });
  };

  const applyAudit = () => {
    renderOperatingModel();
    removeDuplicateLayers();
    replaceForbiddenTerms();
  };

  applyAudit();

  new MutationObserver(() => {
    removeDuplicateLayers();
    replaceForbiddenTerms();
  }).observe(document.body, { childList: true, subtree: true, characterData: true });

  new MutationObserver(applyAudit).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
})();
