(() => {
  const URL = 'https://www.aigateiraq.com/';
  const lang = () => ['ku','ar','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'ku';
  const copy = {
    ku:{open:'هاوبەشکردن',title:'AI Gate Iraq هاوبەش بکە',copy:'کۆپیکردنی لینک',copied:'لینکەکە کۆپی کرا',print:'چاپکردن',email:'ئیمەیڵ',close:'داخستن'},
    ar:{open:'مشاركة',title:'شارك AI Gate Iraq',copy:'نسخ الرابط',copied:'تم نسخ الرابط',print:'طباعة',email:'البريد',close:'إغلاق'},
    en:{open:'Share',title:'Share AI Gate Iraq',copy:'Copy link',copied:'Link copied',print:'Print',email:'Email',close:'Close'}
  };
  const text = () => lang()==='ar' ? 'AI Gate Iraq — منصة ذكية للتجارة والخدمات اللوجستية في العراق.' : lang()==='en' ? 'AI Gate Iraq — Smart trade and logistics intelligence for Iraq.' : 'AI Gate Iraq — دەروازەی زیرەکی بازرگانی و لۆجیستی بۆ عێراق.';
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  const root = document.createElement('div');
  root.className = 'share-suite';
  root.innerHTML = `<button class="share-fab" type="button" aria-haspopup="dialog">${icon}<span></span></button><div class="share-backdrop" hidden></div><section class="share-panel" role="dialog" aria-modal="true" hidden><header><h2></h2><button type="button" data-close>×</button></header><div class="share-grid"><button data-native>${icon}<span></span></button><button data-copy>🔗<span></span></button><a data-linkedin target="_blank" rel="noopener">in<span>LinkedIn</span></a><a data-facebook target="_blank" rel="noopener">f<span>Facebook</span></a><a data-x target="_blank" rel="noopener">𝕏<span>X</span></a><a data-whatsapp target="_blank" rel="noopener">◉<span>WhatsApp</span></a><a data-email>✉<span></span></a><button data-print>⌘<span></span></button></div></section><div class="share-toast" hidden></div>`;
  document.body.append(root);
  const fab=root.querySelector('.share-fab'), panel=root.querySelector('.share-panel'), backdrop=root.querySelector('.share-backdrop'), toast=root.querySelector('.share-toast');
  const labels=()=>{const t=copy[lang()];fab.querySelector('span').textContent=t.open;panel.querySelector('h2').textContent=t.title;panel.querySelector('[data-native] span').textContent=t.open;panel.querySelector('[data-copy] span').textContent=t.copy;panel.querySelector('[data-email] span').textContent=t.email;panel.querySelector('[data-print] span').textContent=t.print;panel.querySelector('[data-close]').setAttribute('aria-label',t.close)};
  const close=()=>{panel.hidden=true;backdrop.hidden=true;document.body.classList.remove('share-open')};
  const open=()=>{labels();panel.hidden=false;backdrop.hidden=false;document.body.classList.add('share-open');panel.querySelector('[data-close]').focus()};
  const notice=(msg)=>{toast.textContent=msg;toast.hidden=false;setTimeout(()=>toast.hidden=true,2200)};
  const copyLink=async()=>{try{await navigator.clipboard.writeText(URL)}catch{const e=document.createElement('textarea');e.value=URL;document.body.append(e);e.select();document.execCommand('copy');e.remove()}notice(copy[lang()].copied)};
  fab.addEventListener('click',open);backdrop.addEventListener('click',close);panel.querySelector('[data-close]').addEventListener('click',close);panel.querySelector('[data-copy]').addEventListener('click',copyLink);panel.querySelector('[data-print]').addEventListener('click',()=>window.print());
  panel.querySelector('[data-native]').addEventListener('click',async()=>navigator.share ? navigator.share({title:document.title,text:text(),url:URL}) : copyLink());
  panel.querySelector('[data-linkedin]').href=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(URL)}`;
  panel.querySelector('[data-facebook]').href=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`;
  panel.querySelector('[data-x]').href=`https://twitter.com/intent/tweet?text=${encodeURIComponent(text())}&url=${encodeURIComponent(URL)}`;
  panel.querySelector('[data-whatsapp]').href=`https://wa.me/?text=${encodeURIComponent(text()+' '+URL)}`;
  panel.querySelector('[data-email]').href=`mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(text()+'\n\n'+URL)}`;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
  new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  labels();
})();
