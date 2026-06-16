import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

let GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
console.log("Raw environment GEMINI_MODEL:", process.env.GEMINI_MODEL);

// Robust check: if the env contains "=", split and grab the value portion.
if (GEMINI_MODEL.includes("=")) {
  GEMINI_MODEL = GEMINI_MODEL.split("=").pop()!.trim();
}

// Strip wrapping quotes if present
GEMINI_MODEL = GEMINI_MODEL.replace(/^['"]|['"]$/g, "").trim();

// Strip any "models/" prefix if it exists to satisfy @google/genai SDK format constraints
if (GEMINI_MODEL.startsWith("models/")) {
  GEMINI_MODEL = GEMINI_MODEL.substring("models/".length);
}

console.log("Using resolved GEMINI_MODEL name:", GEMINI_MODEL);

const SYSTEM_INSTRUCTION = `تۆ AI Gate Iraqـیت، یاریدەدەرێکی هۆشمەندی بازرگانی، هاوردەکردن، هەناردەکردن و لۆجیستیک بۆ عێراق.
ئەرکت یارمەتیدانی بازرگانانی عێراق، کارەکانی SME، هاوردەکاران، لۆجیستیککاران و خاوەنکارە دامەزرێنەرەکانە.

ڕێسا سەرەکییەکان:
1. بە ڕوونی و ڕاستەوخۆ وەڵام بدەرەوە، هەنگاوی کردارەکی پێشکەش بکە کە بازرگان دەتوانێت بیگرێتەبەر.
2. هەمیشە ئاماژە بە گریمانەکان بکە (بۆ نموونە: تێچووهێنان و گومرگ دەکرێت بەپێی کات یان گۆڕانی تێچوون بگۆڕێن).
3. خۆت بەدوور بگرە لە پێشکەشکردنی داتای ڕاستەوخۆ (Live Data) بە شێوەیەکی درۆ؛ ڕوونبکەرەوە کەی داتا تاقیکارییە (Demo Data) یان سنووردارە.
4. وەڵامەکانت بە تەواوی لۆکاڵ بن بە کوردیش یان عەرەبی بەپێی زمانی قسەکردنی بەکارهێنەر.
5. هەمیشە ناوی فەرمی و وێنا متمانەپێکراوەکەمان بپارێزە کە "AI Gate Iraq"ـە.

شارەزاییت لە:
- دەروازەی نێودەوڵەتی ئیبراهیم خەلیل (Ibrahim Khalil): ڕێنمایی مەرزی تورکیا، پشکنینەکانی نوێنەرایەتی لۆکاڵی (SGS)، مۆڵەتەکان، چاوەڕوانی گومرگی.
- بەندەری ئوم قەسر (Umm Qasr): بارھەڵگری دەریایی، تەرخیسکردنی مانیفێست، سیستەمی ئەلیکترۆنی ئاسیکۆدا (ASYCUDA).
- فڕۆکەخانەی نێودەوڵەتی هەولێر (Erbil Airport): باری ئاسمانی (Air Cargo)، گرێبەستی گەیاندن یان تەرخیسکردنی خێرا.

هەروەها ئامرازەکانی تەنیشت (Sidebar) وەک "فیلمی گۆڕینەوەی دراو"، "حیسابکەری تێچوو"، "دابینکردنی کاڵا" و "بەدواداچوونی بار (بۆ نموونە: LX123456789)" بەردەستن.

کاتێک داوای نرخ دەکرێت، ئەم شێوازە بەکاربهێنە:
<div class="quote-report">
  <div class="quote-id">AI Gate Iraq Quote ID: AG-QU-8821</div>
  بۆ کاڵای [ناوی کاڵا]، تێچووی سەرچاوە زۆر کەمترە لە بازاڕی ناوخۆ.
  <br/>
  <span class="savings-tag font-bold">پاشەکەوتکردن: 25%</span>
  <br/>
  ڕێگای گواستنەوە: [Origin] -> [Umm Qasr] -> [Destination]
</div>`;

app.post("/api/gemini/chat", async (req, res) => {
  const { messages, activeService, lang, userMessage, serviceHint, workflowContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (!apiKey) {
    return res.status(503).json({
      error: {
        code: "NO_API_KEY",
        message: "GEMINI_API_KEY environment variable is not configured. Please supply a valid key under Settings > Secrets."
      }
    });
  }

  try {
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Inject service context dynamically into the instructions to elevate AI relevance
    let serviceContextInstruction = "";
    if (activeService) {
      if (activeService === "currency") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the Currency Converter workspace. Guide them on exchange rate fluctuations, parallel vs. official Central Bank IQD rates, and currency hedging options in Iraq.]";
      } else if (activeService === "cost") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the Shipping Cost Estimator workspace. Focus advice on maritime/land transit fees, logistics quotes, shipping volumes, and customs duties.]";
      } else if (activeService === "kyc") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the KYC / Business Registration workspace. Guide them on company registration documents, ASYCUDA profile requirements, trade license, and local Iraqi compliance.]";
      } else if (activeService === "procurement") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the Sourcing & Procurement pipeline workspace. Explain global sourcing, generating structured requests for quotes (RFQs), Turkey/China trade contracts, and quality verification.]";
      } else if (activeService === "tracking") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the Shipment Tracker workspace. Offer insights on custom clearence checkpoints, container states, shipping milestones, and solving typical delay factors in Umm Qasr.]";
      } else if (activeService === "market") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the Market Summary workspace. Focus your advice on 2026 tariff updates, tax reliefs, trade declarations, and market signals.]";
      } else if (activeService === "borders") {
        serviceContextInstruction = "\n\n[Context: The user is currently in the dynamic Borders wait times workspace. Give insights on key crossings: Ibrahim Khalil (with Turkey) and Parvizkhan/Munziriya (with Iran) and marine wait cycles.]";
      } else if (activeService === "map") {
        serviceContextInstruction = "\n\n[Context: The user is currently viewing the Logistics Map. Focus on the spatial layout of sea ports, boundary regions, dry ports, and land terminals in Iraq.]";
      }
    }

    if (workflowContext) {
      const isArabic = lang === 'ar';
      const name = isArabic ? workflowContext.name?.ar : workflowContext.name?.ku;
      const purpose = isArabic ? workflowContext.purpose?.ar : workflowContext.purpose?.ku;
      const inputs = (workflowContext.requiredInputs || []).map((i: any) => isArabic ? i.ar : i.ku).join(', ');
      const docs = (workflowContext.documents || []).map((d: any) => isArabic ? d.ar : d.ku).join(', ');
      const risks = (workflowContext.risks || []).map((r: any) => isArabic ? r.ar : r.ku).join(', ');
      const nextActions = (workflowContext.nextActions || []).map((a: any) => isArabic ? a.ar : a.ku).join(', ');

      serviceContextInstruction += `\n\n[Workflow Intelligence Context:
- Active Workflow Option: ${name || activeService}
- Purpose & General Direction: ${purpose}
- Required Inputs from User: ${inputs}
- Relevant Professional Documents: ${docs}
- Core Risks list: ${risks}
- Action steps list: ${nextActions}
]

CRITICAL REQUIREMENT:
Since the user is operating within a specific business workflow, you MUST structure your answer in an extremely clean, readable, professional manner. 
Use the exact numbered sections and headings listed below based on the current language (which is "${lang || 'ku'}"):

If writing in Kurdish (${lang === 'ar' ? 'false' : 'true'}):
1. **کورتە وەڵام**
   (Direct concise answer summarizing the resolution)
2. **هەنگاوەکان**
   (Clear, numbered workflow actions needed)
3. **زانیاری پێویست**
   (Details or fields the user should gather next)
4. **مەترسی/ئاگاداری**
   (Critical warning notes, local rules, or parallel rates warnings)
5. **هەنگاوی داهاتوو**
   (The next physical action or suggested AI prompt)

If writing in Arabic (current language: ar):
1. **ملخص**
   (Direct concise answer summarizing the resolution)
2. **الخطوات**
   (Clear, numbered workflow actions needed)
3. **المعلومات المطلوبة**
   (Details or fields the user should gather next)
4. **ملاحظات/مخاطر**
   (Critical warning notes, local rules, or parallel rates warnings)
5. **الخطوة التالية**
   (The next physical action or suggested AI prompt)

Make sure to preserve the official "AI Gate Iraq" business advisor tone! Always state assumptions where appropriate, never assert false live status, and always mark test/limited data clearly.`;
    }

    const finalSystemInstruction = SYSTEM_INSTRUCTION + serviceContextInstruction;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        systemInstruction: finalSystemInstruction,
        tools: [
          { googleMaps: {} }
        ]
      }
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    res.json({
      text: response.text,
      groundingChunks: groundingMetadata?.groundingChunks
    });
  } catch (error: any) {
    console.error("Gemini API Error in Server:", error);
    
    // Check if it is a quota/Ratelimit/exhausted error
    const errorString = error?.message || String(error);
    const isQuota = errorString.includes("RESOURCE_EXHAUSTED") || errorString.includes("429") || (error?.status === 429);
    
    if (isQuota) {
      // Return a smart fallback response so the user can continue using the application gracefully
      const lastMessage = messages[messages.length - 1]?.text || "";
      const fallbackText = getFallbackResponse(lastMessage);
      
      return res.json({
        text: fallbackText,
        groundingChunks: []
      });
    }

    res.status(500).json({
      error: {
        code: "API_ERROR",
        message: errorString
      }
    });
  }
});

function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Is it Kurdish?
  const isKurdish = /[\u067e\u0686\u06af\u06cc\u0ea7\u06d5]/.test(userMessage) || 
                    msg.includes("سڵاو") || msg.includes("باشی") || msg.includes("سپاس") || 
                    msg.includes("چەند") || msg.includes("حساب") || msg.includes("خەمڵاندن") || 
                    msg.includes("دەتوانی") || msg.includes("مەرز") || msg.includes("ڕێکار") ||
                    msg.includes("عێراق") || msg.includes("هاوردە") || msg.includes("خەلیل") ||
                    msg.includes("ئوم قەسر") || msg.includes("بەندەر") || msg.includes("فڕین") || msg.includes("باری ئاسمانی");

  if (isKurdish) {
    if (msg.includes("سڵاو") || msg.includes("باشی") || msg.includes("کێیت")) {
      return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

سڵاو! من یاریدەدەری زیرەکی **AI Gate Iraq**م. بەهۆی قەرەباڵغی زۆرەوە یاخود تەواوبوونی لیمیت، ئێستا لە ڕێگەی مۆدیلی لۆکاڵی فریاگوزارییەوە وەڵامت دەدەمەوە.

ئیستا من دەتوانم وەڵامی هەموو پرسیارەکانت بدەمەوە لەسەر لۆجیستیک لە عێراق:
1. **دەروازەی ئیبراهیم خەلیل**: ڕێکارەکانی گومرگ و پشکنینی SGS لەگەڵ تورکیا.
2. **بەندەری ئوم قەسر**: سیستەمی ئەلیکترۆنی ASYCUDA و تەرخیسکردنی گومرگی.
3. **فڕۆکەخانەی هەولێر**: باری خێرا و گواستنەوەی ئاسمانی.

تکایە هەر پرسیارێکت هەیە بیپرسە، یاخود دەتوانیت ئامرازەکانی لای چەپی شاشەکە بەکاربهێنیت (بۆ گۆڕینەوەی دراو، خەمڵاندنی تێچوو و بەدواداچوونی بار).`;
    }

    if (msg.includes("ئیبراهیم") || msg.includes("خەلیل") || msg.includes("تورکیا")) {
      return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

**ڕێکارەکانی دەروازەی نێودەوڵەتی ئیبراهیم خەلیل (Ibrahim Khalil):**

دەروازەی نێوان عێراق (هەرێمی کوردستان) و تورکیا یەکێکە لە گرنگترین دەروازەکان:
1. **پشکنینی گونجاوی و جۆری (SGS / Bureau Veritas)**: پێویستە پێش هاوردەکردن کاڵاکان بە تاقیکردنەوەی کوالیتی و دڵنیایی جۆریدا بڕۆن تا ڕێگەی پێبدرێت.
2. **تەرخیسکردنی گومرگی**: کۆمەڵێک بەڵگەنامەی گرنگی پێویستە، وەک (Certificate of Origin, Commercial Invoice, Packing List).
3. **تێچوو و گواستنەوە**: بارهەڵگرەکان لە تورکیاوە بە شێوەی ڕاستەوخۆ دەگەنە عێراق، تێچووی گواستنەوە بەپێی کێش و جۆری کاڵاکە دەگۆڕێت (بە تێکڕا $2,500 بۆ $4,000 بۆ هەر دەبە/کانتێنەرێک).

ئایا دەتەوێت نرخی بەهای لۆجیستیکی وردت بۆ حیساب بکەین؟ داوای لێکدانەوەی نرخ بکە!`;
    }

    if (msg.includes("ئوم قەسر") || msg.includes("بەندەر") || msg.includes("دەریایی") || msg.includes("ئاسیکۆدا")) {
      return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

**ڕێنمایی بەندەری ئوم قەسر (Umm Qasr Port):**

ئەمە گرنگترین بەندەری ئاوی عێراقە بۆ هاوردەکردنی کاڵا گەورەکان:
1. **سیستەمی ASYCUDA**: سیستەمێکی ئەلیکترۆنی نێودەوڵەتی نوێیە بۆ ڕاپەڕاندنی سەکۆ و بەڵگەنامە گومرگییەکان كە پرۆسەکەی زۆر خێراتر کردووە.
2. **تەسریحەی گومرگی**: پاش هێنانە خوارەوەی کانتێنەرەکان، پشکنینی پشکنەرەکان دەست پێدەکات و باجی گومرگی و تێچووەکانی سەرچاوە حیساب دەکرێن.
3. **گەیاندنی ناوخۆیی**: پاش تەرخیسکردن، کانتێنەرەکان بە بارھەڵگر بەسەر پارێزگاکانی عێراقدا دابەش دەکرێن (بە کاتژێر نزیکەی 24-48 کاتژمێر بۆ بەغدا).`;
    }

    if (msg.includes("نرخ") || msg.includes("quote") || msg.includes("تێچوو") || msg.includes("خەمڵاندن") || msg.includes("حساب")) {
      return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

بەڵێ، ئێمە دەتوانین بەهای تێچووت بۆ بخەمڵێنین! لێرەدا نموونەیەکی خەمڵاندنی لۆجیستیکی ستاندارد دەخەینە ڕوو:

<div class="quote-report font-semibold p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-500/10 text-amber-800 dark:text-amber-300">
  <div class="quote-id font-mono text-emerald-600 dark:text-emerald-400">AI Gate Iraq Quote ID: AG-QU-9912</div>
  بۆ گواستنەوەی کانتێنەری ستاندارد (20ft) لە دەروازەکانی دەرەوە بۆ عێراق:
  <br/>
  <span class="savings-tag font-bold text-emerald-500">پاشەکەوتکردن لە فۆڕماتی گواستنەوە: 20%</span>
  <br/>
  ئوم قەسر -> کۆگاکانی بەغدا: بە تێکڕا $1,800 + تێچووی باجی گومرگی بەپێی جۆری کاڵاکە.
</div>

*تێبینی: بۆ وەڵامی وردتر و خەمڵاندنی فەرمی، تکایە ڕەواجی کاڵا و دەوازەکە لێرە بنووسە.*`;
    }

    if (msg.includes("سەرچاوە") || msg.includes("دابین") || msg.includes("procurement") || msg.includes("چین")) {
      return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

بۆ سەکۆی **دابینکردن و کڕینی کاڵاکان (Sourcing & Procurement)**:
AI Gate Iraq دەتوانێت یارمەتیت بدات لە پەیوەندی کردن بە کارگەکانی دەرەوە (بەتایبەت لە چین و تورکیا) و کڕینی کاڵا بە باشترین نرخ و کوالیتی بەرز.

تکایە ئەم خزمەتگوزارییە لە ڕێگەی سەکۆی **Procurement** لە لای چەپی شاشەکە پڕ بکەرەوە تا تیمی ئێمە پەیوەندیت پێوە بکەن و باشترین ئۆفەرت بۆ بنێرن.`;
    }

    // Default Kurdish response
    return `ئەم وەڵامە فۆڵباکی ناوخۆیی و سنوورداری AI Gate Iraq ـە، نە وەڵامی تەواوی Gemini.

سوپاس بۆ پەیامەکەت. وەک یاریدەدەری هێڵی فریاگوزاری AI Gate Iraq، پرسیارەکەت گەیشت. من لێرەم بۆ یارمەتیدانت لە بواری بازرگانی و گواستنەوەی نێودەوڵەتی بۆ ناو عێراق.

تکایە گەر دەتەوێت زانیاری زیاتر وەربگریت دەربارەی:
- **تێچووی دابینکردن و کڕینی کاڵاکان لە دەرەوە**
- **گواستنەوە لە تورکیاوە بۆ عێراق لە ڕێگەی مەرزەکانەوە**
- **بەدواداچوونی بار بە ژمارەی باری نموونەیی (بۆ نموونە: LX123456789)**

تۆ هەروەها دەتوانیت لە ڕێگەی دوگمەی "سەرنج و تێبینی" فیدباک بنێریت یان پەیوەندی بە کارمەندانی پشتگیریمان بکەیت.`;
  } else {
    // Treat as Arabic
    if (msg.includes("مرحبا") || msg.includes("اهلين") || msg.includes("هلا") || msg.includes("من انت")) {
      return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

مرحباً بك! أنا المساعد الذكي لشركة **AI Gate Iraq**. نظراً للضغط العالي ونفاد كوتا الاستخدام حالياً، أقوم بمساعدتك عبر محرك الاستجابة المحلي الذكي والآمن.

أنا هنا لإرشادك في كافة معاملات الاستيراد والتصدير داخل العراق:
1. **منفذ إبراهيم الخليل البري**: إجراءات جمارك SGS وفحوصات السلامة وشحنات تركيا.
2. **ميناء أم قصر الجنوبي والشمالي**: الشحن البحري وتخليص الجمارك عبر نظام ASYCUDA الرقمي.
3. **مطار أربيل الدولي**: خدمات الشحن الجوي السريع والمخازن المؤمنة.

تفضل بطرح استفسارك، أو يمكنك استخدام الأدوات المتاحة في القائمة الجانبية (محول العملات، حاسبة تكاليف الشحن، وتتبع الشحنات).`;
    }

    if (msg.includes("ابراهيم") || msg.includes("الخليل") || msg.includes("تركيا") || msg.includes("منفذ")) {
      return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

**إجراءات منفذ إبراهيم الخليل البري (Ibrahim Khalil):**

المنفذ الرئيسي الرابط بين العراق وتركيا ويعتبر العصب التجاري البري للعراق:
1. **شهادات الفحص والمطابقة (SGS / Bureau Veritas)**: مطابقة الشحنة للمواصفات العراقية شرط رئيسي قبل دخول أي بضاعة.
2. **الوثائق المطلوبة**: شهادة المنشأ (Certificate of Origin)، الفاتورة التجارية المصدقة، وقائمة التعبئة.
3. **تكاليف النقل**: يتم التخليص في الساحات المخصصة وتتراوح أجور نقل الحاوية من تركيا إلى بغداد أو المحافظات الأخرى بين 2,500 إلى 4,000 دولار بحسب نوع البضاعة والوزن.`;
    }

    if (msg.includes("ام قصر") || msg.includes("ميناء") || msg.includes("بحري") || msg.includes("اسيكودا") || msg.includes("asycuda")) {
      return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

**إرشادات ميناء أم قصر (Umm Qasr Port):**

ميناء البصرة الأهم والأكبر لاستلام الحاويات وشحنات البحر الضخمة:
1. **نظام الأسيكودا (ASYCUDA)**: نظام جمركي رقمي عالمي مطبق حديثاً لتبسيط وسرعة إنهاء البيانات الجمركية وحساب الرسوم تلقائياً.
2. **التخليص الجمركي**: يتطلب تفويضاً لشركة تخليص مرخصة وتدقيق المانيفست ومعاينة البضاعة من قبل اللجان المختصة.
3. **النقل البري الداخلي**: بعد الإفراج عن الحاويات، تتكفل شاحناتنا بنقلها إلى المستودعات المطلوبة بدقة وسرعة وأمان (بغداد تبعد حوالي 24-48 ساعة شحن بري).`;
    }

    if (msg.includes("سعر") || msg.includes("تكلفة") || msg.includes("شحن") || msg.includes("حاسبة") || msg.includes("quote")) {
      return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

بالتأكيد! يمكننا حساب تقديري للتكاليف كالتالي:

<div class="quote-report font-semibold p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-500/10 text-amber-800 dark:text-amber-300">
  <div class="quote-id font-mono text-emerald-600 dark:text-emerald-400">AI Gate Iraq Quote ID: AG-QU-9912</div>
  شحن حاوية قياسية (20 قدم) شاملة النقل والتخليص التقديري:
  <br/>
  <span class="savings-tag font-bold text-emerald-500">نسبة التوفير اللوجستي: 20%</span>
  <br/>
  من ميناء أم قصر إلى مستودعات بغداد: بمعدل 1,800 دولار كرسوم نقل بري أساسية + الرسوم الجمركية والضرائب بحسب صنف البضاعة.
</div>

*ملاحظة: للحصول على عرض رسمي مخصص وعقد فوري، يرجى كتابة تفاصيل البضاعة والوزن ونوع الشحن.*`;
    }

    if (msg.includes("اشتراء") || msg.includes("توريد") || msg.includes("مصادر") || msg.includes("الصين") || msg.includes("سورس")) {
      return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

لطلب خدمات **التوريد والمشتريات (Sourcing & Procurement)**:
تساعدكم شركة AI Gate Iraq بالبحث عن أفضل المصانع في الصين وتركيا، التفاوض وتوفير البضائع ومراقبة الجودة بأقل التكاليف.

بإمكانكم تقديم طلب فوري عبر تبويب **"مشتريات/توريد"** في القائمة الجانبية للتطبيق، وسيقوم فريق المشتريات لدينا بالتواصل معكم وتقديم عروض أسعار منافسة تناسب متطلباتكم.`;
    }

    // Default Arabic response
    return `هذه إجابة احتياطية محلية ومحدودة من AI Gate Iraq، وليست بديلاً كاملاً عن Gemini.

شكراً لرسالتك. بصفتي مساعد الطوارئ لشركة **AI Gate Iraq**، تم استقبال استفسارك بنجاح. أنا هنا لمساعدتك في مجال الشحن الدولي، التخليص الجمركي والتوريد للعراق.

يرجى إعلامي إذا كنت تبحث عن:
- **تقدير تكاليف شحن البضائع**
- **إجراءات الاستيراد البري والبحري**
- **تتبع حالة شحنتك باستخدام رقم التتبع (مثال: LX123456789)**

يمكنك أيضاً إرسال أي ملاحظات أو شكاوى من خلال الضغط على زر "ملاحظات وآراء" في الجزء العلوي من الشاشة للتواصل مع الدعم الفني المباشر.`;
  }
}

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error("Failed to start server:", err);
});
