#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-/workspaces/AI-Gate-Iraq}"
cd "$REPO"

git checkout phase-2/trust-conversion
git pull --rebase origin phase-2/trust-conversion

python3 <<'PY'
from pathlib import Path

root = Path('.')
skip = {'.git', 'node_modules', 'dist', 'coverage', '.next'}
exts = {'.html','.js','.ts','.tsx','.json','.css','.md','.mjs','.cjs','.txt','.yml','.yaml'}

for path in root.rglob('*'):
    if not path.is_file() or any(part in skip for part in path.parts) or path.suffix.lower() not in exts:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    updated = text.replace('قابل‌پشکنین','ئامادە بۆ پشکنین و پەسەندکردن').replace('قابل پشکنین','ئامادە بۆ پشکنین و پەسەندکردن')
    if updated != text:
        path.write_text(updated, encoding='utf-8')

# Make the same cleanup available on the About page.
about = Path('website/public/about.html')
if about.exists():
    text = about.read_text(encoding='utf-8')
    css = '  <link rel="stylesheet" href="/styles/site-audit.css" />\n'
    js = '  <script src="/site-audit.js" defer></script>\n'
    if css not in text:
        text = text.replace('  <link rel="stylesheet" href="/styles/phase2-trust.css" />\n', '  <link rel="stylesheet" href="/styles/phase2-trust.css" />\n' + css, 1)
    if js not in text:
        text = text.replace('  <script src="/about.js" defer></script>\n', '  <script src="/about.js" defer></script>\n' + js, 1)
    about.write_text(text, encoding='utf-8')

# Remove abandoned duplicate implementations.
for rel in ('website/public/enterprise-trust.js','website/public/styles/enterprise-trust.css'):
    p = Path(rel)
    if p.exists():
        p.unlink()
PY

cat > website/public/site-audit.js <<'EOF_JS'
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
EOF_JS

cat > website/public/styles/site-audit.css <<'EOF_CSS'
.operating-model-section{position:relative;padding:104px 0;background:radial-gradient(circle at 12% 18%,rgba(37,99,235,.12),transparent 32%),linear-gradient(180deg,#081426,#07111f);overflow:hidden}.operating-model-section::after{content:"";position:absolute;inset:auto -120px -160px auto;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(45,224,180,.1),transparent 70%);pointer-events:none}.operating-model-head{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:64px;align-items:end}.operating-model-head h2{font-size:clamp(2.2rem,4.6vw,4.8rem);line-height:1.14;letter-spacing:-.035em;margin:14px 0 0}.operating-model-head>p{margin:0;color:#aebfd0;line-height:2;font-size:1.02rem}.operating-model-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:42px}.operating-model-grid article{position:relative;min-height:280px;padding:30px;border:1px solid rgba(120,165,216,.2);border-radius:26px;background:linear-gradient(145deg,rgba(17,39,67,.94),rgba(7,22,39,.99));box-shadow:0 28px 90px rgba(0,7,20,.28);overflow:hidden;transition:transform .25s ease,border-color .25s ease}.operating-model-grid article:hover{transform:translateY(-6px);border-color:rgba(45,224,180,.42)}.operating-model-grid article::after{content:"";position:absolute;width:180px;height:180px;border-radius:50%;inset:auto -70px -90px auto;background:radial-gradient(circle,rgba(50,137,255,.15),transparent 68%)}.operating-model-grid span{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:linear-gradient(135deg,rgba(48,130,255,.2),rgba(45,224,180,.12));border:1px solid rgba(96,172,255,.22);color:#59d8ff;font-weight:900}.operating-model-grid h3{font-size:1.28rem;margin:48px 0 14px}.operating-model-grid p{position:relative;z-index:1;color:#9eb0c3;line-height:1.9;margin:0}.operating-model-outcome{margin-top:22px;padding:18px 22px;border:1px solid rgba(45,224,180,.2);border-radius:18px;background:linear-gradient(90deg,rgba(45,224,180,.08),rgba(41,120,255,.06));color:#d8e8f7;font-weight:800;line-height:1.75}.comparison-grid{display:none!important}@media(max-width:980px){.operating-model-head{grid-template-columns:1fr;gap:24px}.operating-model-grid{grid-template-columns:1fr}.operating-model-grid article{min-height:230px}}@media(max-width:640px){.operating-model-section{padding:76px 0}.operating-model-head h2{font-size:clamp(2rem,10vw,3.2rem)}.operating-model-grid article{padding:24px}.operating-model-outcome{font-size:.9rem}}
EOF_CSS

npm --prefix website run check
npm run lint
npm run build
git diff --check

git add -A
git commit -m "refactor(website): complete global content audit and remove duplicate section patterns"
git push origin phase-2/trust-conversion
