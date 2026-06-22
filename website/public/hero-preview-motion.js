(() => {
  'use strict';

  const preview = document.querySelector('.platform-preview');
  const bot = preview?.querySelector('.chat-bubble.bot');
  const user = preview?.querySelector('.chat-bubble.user');
  const cards = preview ? [...preview.querySelectorAll('.preview-cards > div')] : [];

  if (!preview || !bot || !user || cards.length === 0) return;

  const getLanguage = () => ['ku', 'ar', 'en'].includes(document.documentElement.lang)
    ? document.documentElement.lang
    : 'ku';

  const copy = {
    ku: {
      bot: 'سڵاو، چۆن دەتوانم لە گواستنەوە، گومرگ یان دابینکردندا هاوکارت بم؟',
      user: 'تێچووی گواستنەوەی بارێک بۆ هەولێر چۆن خەمڵێنرێت؟'
    },
    ar: {
      bot: 'مرحباً، كيف يمكنني مساعدتك في النقل أو الجمارك أو التوريد؟',
      user: 'كيف يمكن تقدير كلفة شحنة متجهة إلى أربيل؟'
    },
    en: {
      bot: 'Hello, how can I help with transport, customs or sourcing?',
      user: 'How can I estimate the cost of a shipment to Erbil?'
    }
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cycle = 0;
  let timer = null;

  const wait = (ms) => new Promise((resolve) => {
    timer = window.setTimeout(resolve, ms);
  });

  const typeText = async (element, text, speed = 28) => {
    element.textContent = '';
    element.classList.add('is-typing');
    for (const character of [...text]) {
      element.textContent += character;
      await wait(speed);
    }
    element.classList.remove('is-typing');
  };

  const setCardState = (activeIndex) => {
    cards.forEach((card, index) => {
      card.classList.toggle('is-active', index === activeIndex);
      card.classList.toggle('is-complete', index < activeIndex);
    });
  };

  const run = async () => {
    if (reduceMotion) return;

    const token = ++cycle;
    const text = copy[getLanguage()];

    preview.classList.add('is-animated');
    bot.classList.remove('is-visible');
    user.classList.remove('is-visible');
    setCardState(-1);

    await wait(350);
    if (token !== cycle) return;
    bot.classList.add('is-visible');
    await typeText(bot, text.bot, 24);

    await wait(650);
    if (token !== cycle) return;
    user.classList.add('is-visible');
    await typeText(user, text.user, 22);

    for (let index = 0; index < cards.length; index += 1) {
      await wait(500);
      if (token !== cycle) return;
      setCardState(index);
    }

    await wait(2200);
    if (token === cycle) void run();
  };

  const style = document.createElement('style');
  style.textContent = `
    .platform-preview.is-animated .chat-bubble{opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease}
    .platform-preview.is-animated .chat-bubble.is-visible{opacity:1;transform:translateY(0)}
    .platform-preview .chat-bubble.is-typing::after{content:' ';display:inline-block;width:2px;height:1em;margin-inline-start:4px;background:currentColor;vertical-align:-.1em;animation:agiCursor .7s steps(1) infinite}
    .platform-preview .preview-cards>div{transition:transform .3s ease,border-color .3s ease,background .3s ease,box-shadow .3s ease}
    .platform-preview .preview-cards>div.is-active{transform:translateY(-5px);border-color:rgba(45,224,180,.55);background:rgba(45,224,180,.08);box-shadow:0 16px 35px rgba(0,0,0,.22)}
    .platform-preview .preview-cards>div.is-complete{border-color:rgba(63,151,255,.38)}
    @keyframes agiCursor{0%,49%{opacity:1}50%,100%{opacity:0}}
    @media (prefers-reduced-motion: reduce){.platform-preview .chat-bubble,.platform-preview .preview-cards>div{transition:none!important;animation:none!important}}
  `;
  document.head.appendChild(style);

  new MutationObserver(() => {
    cycle += 1;
    if (timer) window.clearTimeout(timer);
    bot.textContent = copy[getLanguage()].bot;
    user.textContent = copy[getLanguage()].user;
    void run();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  void run();
})();
