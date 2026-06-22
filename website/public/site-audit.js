(() => {
  'use strict';

  const copy = {
    ku: {
      kicker: 'مۆدێلی کارکردن',
      title: 'سێ چین بۆ بڕیاردان و جێبەجێکردنی بازرگانی',
      lead: 'ئەم بەشە پێکهاتەی کارکردنی سیستەمەکە پیشان دەدات؛ لە کۆکردنەوەی زانیارییەوە تا جێبەجێکردن، پشکنین و پەسەندکردن.',
      cards: [
        ['زیرەکی و زانیاری','کۆکردنەوە، ڕێکخستن و شیکردنەوەی زانیارییە بازرگانی و لۆجیستییەکان بۆ دروستکردنی بنەمای بڕیار.'],
        ['جێبەجێکردن و بەدواداچوون','گۆڕینی بڕیار بۆ هەنگاوی کار، دیاریکردنی بەرپرسیارێتی و بەدواداچوونی پێشکەوتن لە یەک شوێنی کاردا.'],
        ['پشکنین و پەسەندکردن','پاراستنی مێژووی کار، بڕیار و بەڵگەکان بە شێوەیەک کە ئامادەی پشکنین و پەسەندکردن بن.']
      ],
      outcome: 'ئەنجام: بڕیاری خێراتر، کردارێکی ڕوونتر و مێژوویەکی پارێزراو بۆ هەر پڕۆسەیەک.'
    },
    ar: {
      kicker:'نموذج التشغيل',
      title:'ثلاث طبقات لصنع القرار والتنفيذ التجاري',
      lead:'يوضح هذا القسم بنية عمل النظام من جمع المعلومات إلى التنفيذ والمراجعة والاعتماد.',
      cards:[
        ['الذكاء والمعلومات','جمع وتنظيم وتحليل المعلومات التجارية واللوجستية لبناء أساس واضح للقرار.'],
        ['التنفيذ والمتابعة','تحويل القرار إلى خطوات عمل وتحديد المسؤوليات ومتابعة التقدم في مساحة واحدة.'],
        ['المراجعة والاعتماد','حفظ سجل العمل والقرارات والأدلة بصورة جاهزة للمراجعة والاعتماد.']
      ],
      outcome:'النتيجة: قرارات أسرع وتنفيذ أوضح وسجل محمي لكل عملية.'
    },
    en: {
      kicker:'Operating Model',
      title:'Three layers for commercial decision-making and execution',
      lead:'This section explains the system architecture from intelligence gathering through execution, review and approval.',
      cards:[
        ['Intelligence and Information','Collect, structure and analyze commercial and logistics information to create a clear decision foundation.'],
        ['Execution and Tracking','Turn decisions into actions, assign ownership and track progress within one operational workspace.'],
        ['Review and Approval','Preserve work, decisions and evidence in a form ready for review and approval.']
      ],
      outcome:'Outcome: faster decisions, clearer execution and a protected history for every process.'
    }
  };

  const lang = () => copy[document.documentElement.lang] ? document.documentElement.lang : 'ku';

  const sanitize = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) continue;
      const current = node.nodeValue || '';
      const next = current
        .replaceAll('قابل‌پشکنین','ئامادە بۆ پشکنین و پەسەندکردن')
        .replaceAll('قابل پشکنین','ئامادە بۆ پشکنین و پەسەندکردن');
      if (next !== current) node.nodeValue = next;
    }
  };

  const renderSolution = () => {
    const section = document.getElementById('solution');
    if (!section) return;
    const t = copy[lang()];
    const cards = t.cards.map((item,index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('');
    section.className = 'section operating-model-section';
    section.innerHTML = `<div class="container"><div class="operating-model-head"><div><span class="section-kicker">${t.kicker}</span><h2>${t.title}</h2></div><p>${t.lead}</p></div><div class="operating-model-grid">${cards}</div><div class="operating-model-outcome">${t.outcome}</div></div>`;
  };

  const removeDuplicates = () => {
    document.querySelectorAll('#phase2TrustSections').forEach((node,index) => { if (index > 0) node.remove(); });
    document.querySelectorAll('#enterpriseTrustLayer').forEach(node => node.remove());
  };

  const apply = () => {
    renderSolution();
    removeDuplicates();
    sanitize();
  };

  apply();

  let pending = false;
  new MutationObserver(() => {
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      removeDuplicates();
      sanitize();
    });
  }).observe(document.body,{childList:true,subtree:true,characterData:true});

  new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
