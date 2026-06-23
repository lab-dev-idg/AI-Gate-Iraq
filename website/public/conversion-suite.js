(() => {
  'use strict';

  const STORAGE = {
    consent: 'agi_consent_v1',
    draft: 'agi_conversion_draft_v1',
    events: 'agi_events_v1'
  };

  const lang = () => ['ku','ar','en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'ku';
  const copy = {
    ku: { title:'داوای پیشاندانی تایبەت یان تاقیکردنەوەی سەرەتایی', lead:'زانیارییە سەرەکییەکان بنووسە؛ تیمەکەمان پێداچوونەوە دەکات و ڕێڕەوی گونجاو پێشکەش دەکات.', step1:'زانیاری کۆمپانیا', step2:'پێویستی و ئامانج', step3:'پێداچوونەوە و ناردن', next:'هەنگاوی دواتر', back:'گەڕانەوە', submit:'ناردنی داواکاری', sending:'داواکارییەکە دەنێردرێت...', company:'ناوی کۆمپانیا', name:'ناوی بەرپرسی پەیوەندی', email:'ئیمەیڵی کاری', phone:'ژمارەی پەیوەندی', sector:'بواری کار', team:'قەبارەی تیم', intent:'جۆری داواکاری', demo:'پیشاندانی تایبەت', pilot:'تاقیکردنەوەی سەرەتایی', partner:'هاوبەشی ستراتیژی', challenge:'گرنگترین کێشە یان پێویستی', timeline:'کاتی دەستپێکردنی پێشبینیکراو', consent:'ڕەزامەندم زانیارییەکانم بۆ وەڵامدانەوە بە داواکارییەکەم بەکاربهێنرێن.', success:'داواکارییەکەت بە سەرکەوتوویی تۆمار کرا.', error:'نەتوانرا داواکارییەکە بنێردرێت؛ تکایە دووبارە هەوڵ بدەوە.', cookieTitle:'ڕێکخستنی تایبەتمەندی', cookieText:'کوکییە پێویستەکان بۆ کارکردنی وێبسایت بەکاردێن. شیکارییە هەڵبژاردەییەکان تەنها بە ڕەزامەندی تۆ چالاک دەبن.', accept:'پەسەندکردنی هەموو', reject:'تەنها پێویستەکان', settings:'ڕێکخستن', save:'پاشەکەوتکردن', analytics:'شیکاری و پێوانە', analyticsText:'یارمەتیمان دەدات تێبگەین کام بەشەکان بەکاردێن، بەبێ کۆکردنەوەی زانیاری هەستیار.', privacy:'کۆنتڕۆڵی تایبەتمەندی' },
    ar: { title:'طلب عرض خاص أو تجربة أولية', lead:'أدخل المعلومات الأساسية ليقوم فريقنا بمراجعتها واقتراح المسار المناسب.', step1:'بيانات الشركة', step2:'الحاجة والهدف', step3:'المراجعة والإرسال', next:'التالي', back:'رجوع', submit:'إرسال الطلب', sending:'جارٍ إرسال الطلب...', company:'اسم الشركة', name:'اسم جهة الاتصال', email:'البريد المهني', phone:'رقم الاتصال', sector:'قطاع العمل', team:'حجم الفريق', intent:'نوع الطلب', demo:'عرض خاص', pilot:'تجربة أولية', partner:'شراكة استراتيجية', challenge:'أهم تحد أو احتياج', timeline:'موعد البدء المتوقع', consent:'أوافق على استخدام بياناتي للرد على طلبي.', success:'تم تسجيل طلبك بنجاح.', error:'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.', cookieTitle:'إعدادات الخصوصية', cookieText:'نستخدم ملفات أساسية لتشغيل الموقع، ولا نفعل التحليلات الاختيارية دون موافقتك.', accept:'قبول الكل', reject:'الأساسية فقط', settings:'الإعدادات', save:'حفظ', analytics:'التحليلات', analyticsText:'تساعدنا على فهم استخدام الأقسام دون جمع بيانات حساسة.', privacy:'ضوابط الخصوصية' },
    en: { title:'Request a Private Demo or Initial Pilot', lead:'Provide the core information and our team will review it and propose the appropriate path.', step1:'Company Details', step2:'Need and Objective', step3:'Review and Submit', next:'Next', back:'Back', submit:'Submit Request', sending:'Submitting request...', company:'Company Name', name:'Contact Name', email:'Business Email', phone:'Phone', sector:'Sector', team:'Team Size', intent:'Request Type', demo:'Private Demo', pilot:'Initial Pilot', partner:'Strategic Partnership', challenge:'Primary challenge or need', timeline:'Expected Start', consent:'I consent to the use of my information to respond to this request.', success:'Your request was recorded successfully.', error:'The request could not be submitted. Please try again.', cookieTitle:'Privacy Settings', cookieText:'Essential storage is used to operate the site. Optional analytics is enabled only with your consent.', accept:'Accept All', reject:'Essential Only', settings:'Settings', save:'Save', analytics:'Analytics', analyticsText:'Helps us understand section usage without collecting sensitive information.', privacy:'Privacy Controls' }
  };
  const t = key => copy[lang()][key] || copy.ku[key] || key;

  const track = (name, meta = {}) => {
    let consent = {};
    try { consent = JSON.parse(localStorage.getItem(STORAGE.consent) || '{}'); } catch {}
    if (!consent.analytics) return;
    try {
      const events = JSON.parse(localStorage.getItem(STORAGE.events) || '[]');
      events.push({ name, meta, at: new Date().toISOString(), path: location.pathname });
      localStorage.setItem(STORAGE.events, JSON.stringify(events.slice(-100)));
    } catch {}
  };

  const ensureForm = () => {
    if (document.getElementById('demo-request')) return;
    const host = document.createElement('section');
    host.className = 'section conversion-suite-section';
    host.id = 'demo-request';
    host.innerHTML = `<div class="container"><div class="conversion-shell"><aside><span class="section-kicker">AI Gate Iraq</span><h2>${t('title')}</h2><p>${t('lead')}</p><ol><li class="active">${t('step1')}</li><li>${t('step2')}</li><li>${t('step3')}</li></ol></aside><form id="conversionForm" novalidate><input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px"><div class="conversion-step active" data-step="0"><div class="form-grid"><label>${t('company')}<input name="company" required maxlength="120"></label><label>${t('name')}<input name="name" required maxlength="100"></label><label>${t('email')}<input name="email" type="email" required maxlength="160"></label><label>${t('phone')}<input name="phone" inputmode="tel" required minlength="6" maxlength="32"></label><label>${t('sector')}<input name="sector" required maxlength="100"></label><label>${t('team')}<select name="team" required><option value=""></option><option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option></select></label></div></div><div class="conversion-step" data-step="1"><div class="form-grid"><label>${t('intent')}<select name="intent" required><option value=""></option><option value="demo">${t('demo')}</option><option value="pilot">${t('pilot')}</option><option value="partner">${t('partner')}</option></select></label><label>${t('timeline')}<select name="timeline" required><option value=""></option><option>0-30 days</option><option>1-3 months</option><option>3-6 months</option><option>6+ months</option></select></label><label class="full">${t('challenge')}<textarea name="challenge" required minlength="20" maxlength="1200" rows="7"></textarea></label></div></div><div class="conversion-step" data-step="2"><div id="conversionReview" class="conversion-review"></div><label class="consent-row"><input type="checkbox" name="privacyConsent" required><span>${t('consent')}</span></label></div><div class="form-status" id="conversionStatus" role="status" aria-live="polite"></div><div class="form-actions"><button type="button" class="button button-secondary" id="conversionBack">${t('back')}</button><button type="button" class="button button-primary" id="conversionNext">${t('next')}</button><button type="submit" class="button button-primary" id="conversionSubmit">${t('submit')}</button></div></form></div></div>`;
    (document.querySelector('#contact') || document.querySelector('.final-cta'))?.before(host);

    const form = host.querySelector('#conversionForm');
    const steps = [...host.querySelectorAll('.conversion-step')];
    const nav = [...host.querySelectorAll('aside li')];
    const back = host.querySelector('#conversionBack');
    const next = host.querySelector('#conversionNext');
    const submit = host.querySelector('#conversionSubmit');
    const review = host.querySelector('#conversionReview');
    const status = host.querySelector('#conversionStatus');
    let index = 0;

    try {
      const draft = JSON.parse(localStorage.getItem(STORAGE.draft) || '{}');
      Object.entries(draft).forEach(([key, value]) => { const field = form.elements.namedItem(key); if (field && field.type !== 'checkbox') field.value = value; });
    } catch {}

    const render = () => {
      steps.forEach((step, i) => step.classList.toggle('active', i === index));
      nav.forEach((item, i) => item.classList.toggle('active', i <= index));
      back.hidden = index === 0;
      next.hidden = index === steps.length - 1;
      submit.hidden = index !== steps.length - 1;
      if (index === 2) {
        const data = new FormData(form);
        review.innerHTML = ['company','name','email','phone','sector','team','intent','timeline','challenge'].map(key => `<div><span>${key}</span><strong>${String(data.get(key) || '—')}</strong></div>`).join('');
      }
      track('conversion_step_view', { step: index + 1 });
    };

    const validateCurrent = () => [...steps[index].querySelectorAll('input,select,textarea')].every(field => field.reportValidity());
    next.addEventListener('click', () => { if (!validateCurrent()) return; index += 1; render(); });
    back.addEventListener('click', () => { index = Math.max(0, index - 1); render(); });
    form.addEventListener('input', () => {
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.privacyConsent;
      delete data.website;
      try { localStorage.setItem(STORAGE.draft, JSON.stringify(data)); } catch {}
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity() || submit.disabled) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const requestType = data.intent === 'partner' ? 'contact' : data.intent;
      const payload = {
        type: requestType,
        language: lang(),
        fullName: String(data.name || ''),
        email: String(data.email || ''),
        phone: String(data.phone || ''),
        organization: String(data.company || ''),
        role: '',
        country: 'Iraq',
        city: '',
        service: String(data.sector || ''),
        message: `Team size: ${data.team || '—'}\nTimeline: ${data.timeline || '—'}\n\n${data.challenge || ''}`,
        consent: data.privacyConsent === 'on',
        sourceUrl: location.href,
        website: String(data.website || '')
      };

      submit.disabled = true;
      submit.textContent = t('sending');
      status.textContent = '';

      try {
        const response = await fetch('https://ai-gate-iraq.onrender.com/api/conversion/submissions', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result?.error?.message || 'SUBMISSION_FAILED');

        status.textContent = t('success');
        track('conversion_submit', { intent: data.intent, sector: data.sector, submissionId: result?.data?.id || null });
        try { localStorage.removeItem(STORAGE.draft); } catch {}
        form.reset();
        index = 0;
        render();
      } catch (error) {
        console.error('Conversion submission failed.', error);
        status.textContent = t('error');
      } finally {
        submit.disabled = false;
        submit.textContent = t('submit');
      }
    });

    render();
  };

  const ensureConsent = () => {
    const existing = localStorage.getItem(STORAGE.consent);
    const buildSettings = () => {
      document.getElementById('privacyPanel')?.remove();
      const panel = document.createElement('div');
      panel.id = 'privacyPanel';
      panel.className = 'privacy-panel';
      let current = {};
      try { current = JSON.parse(localStorage.getItem(STORAGE.consent) || '{}'); } catch {}
      panel.innerHTML = `<div class="privacy-dialog" role="dialog" aria-modal="true"><button class="privacy-close" type="button">×</button><h3>${t('privacy')}</h3><label class="privacy-toggle"><span><strong>${t('analytics')}</strong><small>${t('analyticsText')}</small></span><input id="analyticsConsent" type="checkbox" ${current.analytics ? 'checked' : ''}></label><button id="savePrivacy" class="button button-primary" type="button">${t('save')}</button></div>`;
      document.body.appendChild(panel);
      panel.querySelector('.privacy-close').onclick = () => panel.remove();
      panel.querySelector('#savePrivacy').onclick = () => {
        const analytics = panel.querySelector('#analyticsConsent').checked;
        localStorage.setItem(STORAGE.consent, JSON.stringify({ essential: true, analytics, updatedAt: new Date().toISOString() }));
        panel.remove();
      };
    };

    if (!existing) {
      const banner = document.createElement('div');
      banner.className = 'cookie-banner';
      banner.innerHTML = `<div><h3>${t('cookieTitle')}</h3><p>${t('cookieText')}</p></div><div><button data-action="reject" class="button button-secondary">${t('reject')}</button><button data-action="settings" class="button button-secondary">${t('settings')}</button><button data-action="accept" class="button button-primary">${t('accept')}</button></div>`;
      document.body.appendChild(banner);
      banner.addEventListener('click', event => {
        const action = event.target.dataset.action;
        if (!action) return;
        if (action === 'settings') return buildSettings();
        localStorage.setItem(STORAGE.consent, JSON.stringify({ essential: true, analytics: action === 'accept', updatedAt: new Date().toISOString() }));
        banner.remove();
      });
    }

    if (!document.getElementById('privacyControlButton')) {
      const button = document.createElement('button');
      button.id = 'privacyControlButton';
      button.className = 'privacy-control-button';
      button.type = 'button';
      button.textContent = t('privacy');
      button.onclick = buildSettings;
      document.body.appendChild(button);
    }
  };

  ensureForm();
  ensureConsent();
  track('page_view', { title: document.title });
})();
