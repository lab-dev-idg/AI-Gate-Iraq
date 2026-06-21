#!/usr/bin/env bash
set -euo pipefail
cd "${1:-/workspaces/AI-Gate-Iraq}"

git checkout phase-2/trust-conversion
git pull --rebase origin phase-2/trust-conversion

python3 <<'PY'
from pathlib import Path
p = Path('website/public/phase2-trust-sections.js')
s = p.read_text(encoding='utf-8')
replacements = {
"pk:'هاوبەش و پشتیوان'":"pk:'تۆڕی هاوکاری و متمانە'",
"pt:'دروستکردنی متمانە لەگەڵ دەزگا و کۆمپانیای هەڵبژێردراو'":"pt:'هاوبەشی ستراتیژی بۆ گەشەپێدانی ژێرخانی بازرگانیی دیجیتاڵ'",
"pl:'AI Gate Iraq بۆ هاوکاری لەگەڵ کۆمپانیا و دامەزراوەکان ئامادەیە بۆ دروستکردنی pilot و بەڵگەی ئەنجام.'":"pl:'AI Gate Iraq لەگەڵ کۆمپانیا، دامەزراوە و دەزگاکانی پەرەپێداندا کار دەکات بۆ دروستکردنی تاقیکردنەوەی ڕاستەقینە، هەڵسەنگاندنی ئەنجام و گەشەپێدانی چارەسەری گونجاو بۆ بازاڕی عێراق.'",
"ck:'Case Study'":"ck:'نموونەی کارکردن'",
"ct:'لە کێشەی ڕۆژانەوە بۆ پڕۆسەیەکی قابل‌پشکنین'":"ct:'لە کارێکی پەرتەوازەوە بۆ پڕۆسەیەکی یەکگرتوو و قابل‌پشکنین'",
"cl:'سناریۆیەکی کاری بۆ کۆمپانیای هاوردە و لۆجیستیک.'":"cl:'سناریۆی خوارەوە نیشان دەدات کۆمپانیایەکی هاوردە و لۆجیستیک چۆن دەتوانێت خەمڵاندن، دابینکردن، گواستنەوە و مێژووی بڕیارەکان لە یەک شوێنی کاردا بەڕێوەببات.'",
"b:'پێش AI Gate Iraq'":"b:'دۆخی پێشتر'",
"b1:'زانیاری لە چەندین کەناڵ'":"b1:'زانیاری لە پەیام، فایل و کەناڵی جیاوازدا دابەش بووە.'",
"b2:'خەمڵاندنی دەستی و هەڵەهەڵگر'":"b2:'خەمڵاندنی تێچوو بە دەستی و بەبێ مێژووی یەکگرتوو ئەنجام دەدرێت.'",
"b3:'نەبوونی مێژووی یەکگرتوو'":"b3:'بڕیار و گۆڕانکارییەکان بە شێوەیەکی ڕوون تۆمار ناکرێن.'",
"a:'دوای بەکارهێنان'":"a:'دۆخی نوێ'",
"a1:'یەک شوێنی کار بۆ تیم'":"a1:'هەموو زانیاری و کردارەکان لە یەک پڕۆسەدا کۆدەکرێنەوە.'",
"a2:'خەمڵاندنی ڕوون و هەنگاوی کردارەکی'":"a2:'خەمڵاندن و هەڵبژاردەکان بە شێوەی ڕوون و قابل‌پشکنین پیشان دەدرێن.'",
"a3:'مێژووی پارێزراو و قابل‌پشکنین'":"a3:'مێژووی کار، بڕیار و پەیوەندییەکان بە شێوەی پارێزراو دەمێننەوە.'",
"cn:'ئەم case study ـە سناریۆیەکی نموونەییە؛ ئەنجامی ڕاستەقینە دوای pilot بڵاودەکرێتەوە.'":"cn:'ئەم نموونەیە بۆ ڕوونکردنەوەی شێوازی کارکردنی پلاتفۆرمەکەیە. ئەنجامی ڕاستەقینە دوای تەواوبوونی تاقیکردنەوەی سەرەتایی بە داتا و پێوانە بڵاودەکرێتەوە.'",
"tk:'دەنگی بەکارهێنەر'":"tk:'دەنگی بازار'",
"tt:'ئەو شتەی کە کۆمپانیاکان پێویستیانە'":"tt:'پێویستییەکی ڕاستەقینە لە بازاڕی لۆجیستیک و بازرگانی'",
"q:'پێویستمان بە سیستەمێکە کە زانیارییە پەرتەوازەکان کۆبکاتەوە و هەنگاوی دواتر بە ڕوونی پیشان بدات.'":"q:'ئێمە پێویستمان بە سیستەمێکە کە زانیارییە پەرتەوازەکان لە یەک شوێندا کۆبکاتەوە، هەنگاوی دواتر ڕوون بکاتەوە و بڕیاردان بۆ تیم خێراتر بکات.'",
"cok:'پەیوەندی'":"cok:'پەیوەندی بازرگانی'",
"cot:'بۆ demo، pilot یان هاوبەشی ستراتیژی پەیوەندیمان پێوە بکە'":"cot:'بۆ پیشاندانی تایبەت، تاقیکردنەوەی سەرەتایی یان هاوبەشی ستراتیژی پەیوەندیمان پێوە بکە'",
"col:'تیمەکەمان بۆ هەڵسەنگاندنی پێویستی کۆمپانیاکەت ئامادەیە.'":"col:'تیمەکەمان پێویستییەکانی کۆمپانیاکەت هەڵدەسەنگێنێت، سنووری کار دیاری دەکات و ڕێڕەوی جێبەجێکردن بە شێوەی ڕوون پێشکەش دەکات.'",
"demo:'داوای Demo'":"demo:'داوای پیشاندانی تایبەت'",
"pilot:'داوای Pilot'":"pilot:'داوای تاقیکردنەوەی سەرەتایی'",
"<span>Email</span>":"<span>ئیمەیڵی بازرگانی</span>",
"<span>Location</span>":"<span>ناوەندی کار</span>"
}
for old,new in replacements.items():
    if old not in s:
        raise SystemExit(f'Missing expected text: {old}')
    s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
PY

cat >> website/public/styles/phase2-conversion.css <<'CSS'

/* Enterprise trust and conversion refinement */
#phase2TrustSections>section{padding-block:104px;background:linear-gradient(180deg,#07111f,#09182a)}
#phase2TrustSections>section:nth-child(even){background:radial-gradient(circle at 15% 15%,rgba(37,99,235,.13),transparent 34%),#081527}
#phase2TrustSections .section-heading{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:56px;align-items:end;max-width:none;margin-bottom:38px}
#phase2TrustSections .section-heading h2{font-size:clamp(2.2rem,4vw,4.2rem);line-height:1.16;letter-spacing:-.035em;margin-block:14px 0}
#phase2TrustSections .section-heading>p{max-width:none;color:#aebfd0;line-height:2;margin:0}
#phase2TrustSections .section-kicker{display:inline-flex;align-items:center;gap:10px;color:#2de0b4;font-weight:900}
#phase2TrustSections .section-kicker:before{content:"";width:32px;height:1px;background:#2de0b4}
.partner-grid{gap:18px}.partner-grid article{min-height:250px;padding:26px;border-radius:24px;background:linear-gradient(145deg,rgba(17,39,67,.92),rgba(7,22,39,.98));box-shadow:0 26px 80px rgba(0,7,20,.3);transition:.25s}.partner-grid article:hover{transform:translateY(-6px);border-color:rgba(46,224,180,.4)}.partner-grid article span{display:grid;place-items:center;width:44px;height:44px;border-radius:13px;background:rgba(49,132,255,.15);color:#56d8ff}.partner-grid article strong{font-size:1.18rem;line-height:1.6}
.case-grid{grid-template-columns:1fr 1fr;gap:22px}.case-column{padding:32px;border-radius:28px;box-shadow:0 28px 85px rgba(0,7,20,.32)}.case-column h3{font-size:1.5rem}.case-column li{line-height:1.85}.case-note{padding:16px 18px;border:1px solid rgba(126,163,205,.14);border-radius:16px;background:rgba(7,19,34,.7);font-size:.86rem;line-height:1.75}
.testimonial-card{padding:42px;border-radius:30px;grid-template-columns:.75fr 1.25fr;box-shadow:0 34px 100px rgba(0,7,20,.34)}.testimonial-card blockquote>p{font-size:clamp(1.25rem,2vw,1.8rem);line-height:1.9}.testimonial-card blockquote footer{gap:8px}.testimonial-card blockquote footer span{line-height:1.65}
.contact-card{padding:42px;border-radius:30px;grid-template-columns:1.1fr .9fr;background:radial-gradient(circle at 80% 20%,rgba(46,224,180,.12),transparent 28%),linear-gradient(135deg,rgba(15,50,86,.94),rgba(7,24,42,.98));box-shadow:0 36px 110px rgba(0,7,20,.34)}.contact-details>div{padding:18px 20px;border-radius:17px;background:rgba(6,19,34,.62)}.contact-details span{display:block;margin-bottom:4px;text-transform:none;letter-spacing:0}.contact-details a,.contact-details strong{display:block;line-height:1.6}
@media(max-width:1000px){#phase2TrustSections .section-heading,.testimonial-card,.contact-card{grid-template-columns:1fr}.partner-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:650px){#phase2TrustSections>section{padding-block:74px}#phase2TrustSections .section-heading{display:block}.partner-grid,.case-grid{grid-template-columns:1fr}.testimonial-card,.contact-card{padding:24px}.contact-actions,.contact-actions .button{width:100%}}
CSS

npm --prefix website run check
npm run lint
npm run build
git diff --check

git add website/public/phase2-trust-sections.js website/public/styles/phase2-conversion.css
git commit -m "refactor(website): upgrade phase 2 sections to enterprise standard"
git push origin phase-2/trust-conversion
