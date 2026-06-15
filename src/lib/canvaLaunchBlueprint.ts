/**
 * AI Gate Iraq - Canva Pitch Deck & Launch Material Blueprint
 * This file serves as the official structured content store for creating Canva assets,
 * pitch decks, social posts, demo videos, and visual communications.
 */

export interface Slide {
  title: string;
  subtitle: string;
  bullets: string[];
  visualSuggestion: string;
  speakerNote: string;
}

export interface Proposal {
  headline: string;
  oneSentencePitch: string;
  problem: string;
  solution: string;
  targetUsers: string[];
  coreServices: string[];
  pilotStatus: string;
  partnershipAsk: string;
  contactPlaceholder: string;
}

export interface SocialPost {
  title: string;
  en: string;
  ku: string;
  ar: string;
}

export interface NarrationScript {
  en: string;
  ku: string;
  ar: string;
}

export interface VisualGuide {
  colors: { name: string; hex: string; role: string }[];
  typography: { sans: string; display: string; mono: string; rationale: string };
  iconStyle: string;
  layoutStyle: string;
  mockups: string[];
  whatToAvoid: string[];
}

export const CANVA_PITCH_DECK: Slide[] = [
  {
    title: "AI Gate Iraq",
    subtitle: "AI Business Gateway for Iraq",
    bullets: [
      "The next-generation AI-powered assistant for Iraqi trade and commerce.",
      "Empowering traders, SMEs, and importers with instant regulatory and workflow intelligence.",
      "Navigating shipping, customs, and currency conversions in one sleek interface."
    ],
    visualSuggestion: "Dark, sleek background (#0D1B2A) featuring the AI Gate Iraq logo, glowing emerald accents (#52B788), and premium gold modern serif fonts.",
    speakerNote: "Welcome everyone. Today, I am proud to present the pilot release of AI Gate Iraq — the first dedicated intelligent assistant designed to streamline business, sourcing, and international trade in Iraq."
  },
  {
    title: "The Problem",
    subtitle: "Fragmented & Informal Business Info",
    bullets: [
      "Information is scattered across physical offices, outdated websites, or informal groups.",
      "SMEs lose vital time and capital trying to understand local customs rules, customs codes, and dynamic fees.",
      "Parallel exchange rates, global factory sourcing, and clearance procedures are non-transparent.",
      "Language barriers prevent smaller merchants from sourcing goods directly from Turkey or China."
    ],
    visualSuggestion: "A visual comparison of chaotic paper files and siloed channels versus a streamlined digital stream. High contrast red/gold alerts on dark gray backgrounds.",
    speakerNote: "In Iraq, starting or running an import business is exceptionally manual. Importers or small merchants spend days calling contacts, searching unofficial channels, or risking customs rejections because the data isn't easily accessible."
  },
  {
    title: "The Solution",
    subtitle: "A Single AI-Assisted Workspace",
    bullets: [
      "A centralized smart interface running a custom-trained server-side Gemini Business Advisor.",
      "Localized interactive calculators for shipping rates, customs duties, and tariff estimations.",
      "Direct parallel market exchange rates paired with official IQD calculations.",
      "Immediate multilingual interface switching between Kurdish, Arabic, and English."
    ],
    visualSuggestion: "A mockup of the cohesive AI Gate Iraq workspace showing the Chat interface on the left and active service calculators on the right in responsive side-by-side grids.",
    speakerNote: "AI Gate Iraq is the answer. It consolidates scattered intelligence into a simple, beautiful, and multilingual AI workspace. Importers can instantly solve trade questions, run calculators, check border statuses, and get vendor profiles."
  },
  {
    title: "Product Overview",
    subtitle: "AI Advisor Meets Specialized Tools",
    bullets: [
      "Smart Chat proxy querying verified trade policies and logistics information safely.",
      "Bento-grid workspace where tools open within a unified context.",
      "Secure KYC/Business Profiles to onboard verified commercial entities.",
      "Direct global sourcing forms that generate standardized RFQs for supplier outreach."
    ],
    visualSuggestion: "SaaS layout illustration resembling a modern bento grid with individual cards highlighting different components of the workspace.",
    speakerNote: "We don't just offer standard general AI chats. Our platform links the Gemini AI directly with functional tools like an active currency converter, shipping estimators, and business registry mocks to build a truly actionable cockpit."
  },
  {
    title: "Core Services",
    subtitle: "Full-Stack Utility Ecosystem",
    bullets: [
      "AI Business Advisor: Conversational trade & regulations companion.",
      "Market Signal & Regulatory Bulletins: Real-time tariff and rule updates.",
      "Cost Estimator & Shipping Calculator: Precise port-to-door shipping estimates.",
      "Parallel-vs-Official Currency Converter.",
      "Sourcing Pipeline: Automated RFQs for China/Turkey commercial outreach."
    ],
    visualSuggestion: "A matrix of icons representing the 9 principal workspaces, each coupled with short value propositions highlighted in mint emerald tags.",
    speakerNote: "Here is our full capability catalog. From analyzing local market bulletins to creating global manufacture RFQs and tracking shipping progress, we have mapped out the entire lifecycle of an Iraqi import startup."
  },
  {
    title: "Target Audience",
    subtitle: "Who We Empower",
    bullets: [
      "Iraqi Traders: Managing complex international supply chains.",
      "Local SMEs: Expanding operations with direct supplier importing.",
      "Logistics Providers: Verifying crossing wait-times at gate crossings.",
      "Startup Founders & Innovators: Fast-tracking local company setups."
    ],
    visualSuggestion: "Clean portraits or modern abstract geometric shapes representing different target segments, with crisp text boxes mapping out their immediate friction points.",
    speakerNote: "Our pilot targets Iraqi traders, local business owners, and logistics firms who face the highest operational costs. We help them move faster by transforming difficult local procedures into clear guides."
  },
  {
    title: "The Demo Workflow",
    subtitle: "From Query to Action in 60 Seconds",
    bullets: [
      "1. Ask: Input business query or choose from rapid prompt suggestions.",
      "2. Calculate: Feed outputs into interactive rate and custom fee modules.",
      "3. Format: Prepare compliance documents via Sourcing or KYC templates.",
      "4. Launch: Ready-to-use business reports and container tracking details."
    ],
    visualSuggestion: "A four-step linear flow diagram connecting the chat prompt, calculated estimate output, submission form, and final export.",
    speakerNote: "Let's look at how intuitive this is. A trader types a query about customs; they immediately use the Cost Estimator right there in the panel, generate an RFQ, and track their incoming container-all under one beautiful app."
  },
  {
    title: "Pilot Preview Status",
    subtitle: "A Responsible, Honest Launch",
    bullets: [
      "This release is a Pilot Preview, fully functional for demonstration and user feedback.",
      "Server-side Gemini AI utilizes temporary fallbacks on quota limit triggers.",
      "Advanced database systems (Auth & Firestore) are scaffolded and secure.",
      "Ready for immediate pilot deployment and localized merchant testing."
    ],
    visualSuggestion: "A clean dashboard graphic showing the system check status: Linter [PASSED], Build [PASSED], AI Proxy [ACTIVE], DB [READY]. Highlight a 'PILOT PREVIEW' gold badge.",
    speakerNote: "We believe in extreme engineering and product honesty. This version is built on our optimized, fully compiled server-side architecture. It is fully ready for preview but is safely marked with honest demo data flags where direct production integrations are pending."
  },
  {
    title: "Strategic Roadmap",
    subtitle: "Future Expansion Framework",
    bullets: [
      "Phase 3.5: Merchant pilot group onboardings for initial feedback loops.",
      "Phase 4: Real-time API integration with global shipping registries.",
      "Phase 4.5: Full production deployment, real currency exchange API ties.",
      "Phase 5: Secure ASYCUDA customs code query interfaces directly."
    ],
    visualSuggestion: "A visually engaging roadmap timeline stretching from left to right, matching deep slate background with gold milestones.",
    speakerNote: "Looking forward, our blueprint establishes a clear upgrade queue. We plan to integrate directly with global freight registries and local trade boards, turning AI Gate Iraq into the ultimate business operations engine."
  },
  {
    title: "Partnership & Launch",
    subtitle: "Join the Vision",
    bullets: [
      "Join us as a launching pilot merchant.",
      "Provide early feedback to help tailor model guidelines.",
      "Partner with us to streamline customs, freight, and business integration in Iraq.",
      "Let's build the digital trade gateway of tomorrow."
    ],
    visualSuggestion: "A warm, high-contrast final slide showing contact details, elegant QR code placeholder for live preview workspace, and 'AI Gate Iraq' displayed with spacious display lettering.",
    speakerNote: "We invite you to co-pilot or support our integration of AI Gate Iraq. Let's make commerce in Iraq fast, transparent, and AI-powered. Thank you."
  }
];

export const CANVA_ONE_PAGE_PROPOSAL: Proposal = {
  headline: "AI Gate Iraq: The Intelligent Trade and Sourcing Companion for modern Iraqi Businesses",
  oneSentencePitch: "AI Gate Iraq is a full-stack, AI-powered business assistant platform helping Iraqi traders, SMEs, and founders understand trade, logistics, and market decisions faster.",
  problem: "Traders and SMEs in Iraq lose considerable time and margin trying to understand fragmented customs policies, fluctuating parallel exchange rates, and manual sourcing channels across borders.",
  solution: "We provide an integrated bento-style SaaS workspace pairing a highly custom-trained Gemini AI Assistant with 8+ localized utilities (Currency Converter, Sourcing RFQ templates, Customs & Freight Cost Estimator, and Crossing Guides) in three native languages.",
  targetUsers: [
    "Iraqi Importers & Traders",
    "SMEs sourcing materials from China/Turkey",
    "Cross-border shipping & logistics operators",
    "Local business founders needing regulatory help"
  ],
  coreServices: [
    "AI Business Advisor (Gemini)",
    "Regulatory Bulletins & Market Summaries",
    "Ibrahim Khalil & Umm Qasr Crossing Status",
    "Parallel Market exchange premium rate tracking",
    "Shipping fee & import custom custom estimators",
    "Global RFQ Sourcing Pipeline"
  ],
  pilotStatus: "Currently compiled and running inside an optimized React + Express container server. Safely features server-side API proxying and memory caches to prevent client-side key exposure and provide high availability. Ready for live demo and merchant testing.",
  partnershipAsk: "Seeking commercial test pilots, strategic freight forwarder partnerships, and regulatory advisory groups to scale data integrations and launch the production suite.",
  contactPlaceholder: "AI Gate Iraq Lead / info@aigateiraq.app / www.aigateiraq.app"
};

export const SOCIAL_LAUNCH_PACK: SocialPost[] = [
  {
    title: "1. Launch Announcement",
    en: "We are thrilled to introduce AI Gate Iraq - a revolutionary AI-powered trade advisor and business workspace customized specifically for Iraqi merchants, founders, and SMEs. Explore trade laws, estimate customs, and source products globally in one beautiful Arabic, Kurdish, and English app! 🚀 Try our pilot preview today: https://aigateiraq.app",
    ku: "دلخۆشین بە ڕاگەیاندنی پلاتفۆرمی AI Gate Iraq! دەروازەیەکی نوێی زیرەکی دەستکرد بۆ ڕاوێژی بازرگانی، خەمڵاندنی گومرگ و دابینکردنی کاڵا بۆ سەرجەم بازرگانان و کۆمپانیاکانی عێراق بە زمانەکانی کوردی، عەرەبی و ئینگلیزی. ئۆفەری ئەزموونی پایلۆت ئێستا بەردەستە! 🚀",
    ar: "يسعدنا إطلاق AI Gate Iraq - المنصة المتكاملة الأولى المدعومة بالذكاء الاصطناعي لحساب تكاليف الشحن وتسهيل الاستيراد للشركات والتجار العراقيين باللغات العربية والكردية والإنكليزية بذكاء وسهولة لا متناهية. جرب النسخة التجريبية الحين! 🚀"
  },
  {
    title: "2. Problem Awareness",
    en: "Importing goods into Iraq should not require endless phone calls, unpredictable costs, and guesswork. AI Gate Iraq centralizes scattered borders wait-times, custom tariffs, and parallel exchange rates to give your SME clear, immediate answers. Bring your business questions to the gateway today! 💡",
    ku: "هاوردەکردنی کاڵا بۆ ناو عێراق چیتر پێویستی بە تەلەفۆنی بێکۆتا و خەمڵاندنی ناڕوون نییە. AI Gate Iraq تەواوی زانیارییەکانی گومرگ، نرخ و ڕێنماییەکان لە یەک شوێنی مۆدێرندا کۆدەکاتەوە و دڵنیایی دەبەخشێت بە کارەکەت. 💡",
    ar: "الاستيراد للعراق لا يجب أن يكون معقداً أو مليئاً بالمصاريف المفاجئة بعد الآن. تجمع منصة AI Gate Iraq أسعار الصرف، الرسوم الجمركية المتوقعة، وأوقات الانتظار في تطبيق واحد لتسهيل قرارات شركاتكم. 💡"
  },
  {
    title: "3. AI Business Advisor",
    en: "Meet your 24/7 Iraqi trade compliance expert. AI Gate Iraq's server-side Gemini Business Advisor is ready to resolve complex questions about ASYCUDA codes, Ibrahim Khalil policies, and port procedures. Try our instant response chips and start getting smart answers today! 🧠✨",
    ku: "یاریدەدەری زیرەکی خودکاری AI Gate Iraq لێرەیە بۆ وەڵامدانەوەی پرسیارە ئاڵۆزەکانی پێوەست بە کۆدە گومرگییەکان، مانیفێست، دەروازە سنورییەکان و زانیاری هاوردەکردن لە هەر کاتێک بێت. 🧠✨",
    ar: "تعرف على مستشارك الذكي على مدار الساعة. يجيب المساعد الذكي في AI Gate Iraq على استفسارات الجمارك، كود التعرفة وموانئ الدخول بشكل فوري وبوثوقية عالية. جربه الآن! 🧠✨"
  },
  {
    title: "4. Currency and Cost Tools",
    en: "Parallel exchange rates vs. official Central Bank rates? Customs duty percentages vs. freight prices? Stop switching spreadsheets. AI Gate Iraq’s interactive calculators let you convert currency and estimate shipping costs side-by-side with complete visual clarity. 📊💵",
    ku: "جیاوازی نرخی دۆلار لەنێوان بانک و بازاڕی تەریبی عێراق؟ تێچووی گواستنەوە و گومرگی کاڵاکانت؟ بە بەکارهێنانی حیسابکەری هۆشمەندی ئێمە، لە چرکەیەکدا وردترین زانیاریت پێدەگات. 📊💵",
    ar: "تذبذب أسعار صرف الدولار الموازي؟ تكاليف الشحن ومصاريف الميناء؟ تحكم ببياناتك المالية عبر حاسبة الأسعار ومحول العملات المدمج داخل AI Gate Iraq للحصول على أرقام دقيقة وحقيقية. 📊💵"
  },
  {
    title: "5. Sourcing & Procurement",
    en: "Ready to source from factories in Turkey or China but don't know where to start? Use AI Gate Iraq to generate standardized, high-quality RFQ requests, detail specifications, and explore global manufacturing safely. Upgrade your sourcing playbook now! 🏭🏗️",
    ku: "دەتەوێت کاڵا ڕاستەوخۆ لە کارگەکانی چین یان تورکیاوە بکڕیت بەڵام سەرەتای کارەکە نازانیت؟ لەڕێی سیستمەکەمانەوە بە فەرمی باشترین مۆدێلی کڕین و دابینکردنی کاڵاکان بە کەمترین تێچوو ڕێکبخە. 🏭🏗️",
    ar: "هل ترغب بالاستيراد مباشرة من مصانع تركيا أو الصين ولا تعرف كيف تبدأ؟ تتيح لك منصة AI Gate Iraq إنشاء طلبات تسعير رسمية ومواصفات بضائع لتأمين وتوريد شحناتك بأعلى معايير الأمان اللوجستي. 🏭🏗️"
  },
  {
    title: "6. Shipment Tracking",
    en: "Keep your cargo visible. Enter your active manifest ID to check custom milestone approvals, border arrival forecasts, and release alerts within our Shipment Tracking dashboard. Transparency has a new home. 🚢📦",
    ku: "کاڵاکانت هەمیشە لەژێر چاودێری بن. لەڕێی بەشی چاودێری بارەکەت، بە ئاسانی مۆڵەتی گومرگی، ڕێکەوتی گەیشتن و دۆخی گەیاندنی کانتینەرەکانت بزانە لەناو عێراقدا. 🚢📦",
    ar: "ابق على اطلاع دائم بمكان شحنتك. أدخل رقم بوليصة الشحن لمعرفة آخر التحديثات الجمركية وتواريخ الوصول المتوقعة للمنافذ البرية والبحرية مع نظام التتبع الذكي لدينا. 🚢📦"
  },
  {
    title: "7. Pilot Preview Invitation",
    en: "AI Gate Iraq is currently in Pilot Preview. We have carefully built this to show Iraqi businesses what is possible when AI meets trade log tools. Come try it out, explore our beautiful dashboards, and provide feedback to mold our official release! 🤝",
    ku: "پلاتفۆرمی AI Gate Iraq لە ئێستادا لە قۆناغی 'ئەزموونی پایلۆت'دایە. سەردانمان بکە، بڕگەکان بسنجە و یارمەتیدەرمان بە تا زیاتر سیستەمەکە گەشە پێبدەین بۆ خزمەتکردنی تەواو بە شێوازی بازرگانیت. 🤝",
    ar: "بوابتنا الآن متاحة بنسخة تجريبية لاستكشاف الفكرة. لقد صممنا AI Gate Iraq لنثبت كيف للذكاء الاصطناعي النهوض بمستوى التجارة. جرب المنصة الآن وشاركنا تقييمكم الثمين! 🤝"
  },
  {
    title: "8. Partnership Invitation",
    en: "Attention Iraqi business organizations, customs clearing houses, and freight forwarders: let's build the future of digitized trade together. Discover our deployment blueprint and participate as a co-development partner in AI Gate Iraq. 📞 Secure your invite.",
    ku: "پەیوەندی بە کارگێڕان، کۆمپانیاکانی گواستنەوە و یەکێتییە بازرگانییەکانی عێراقەوە: وەرن با پێکەوە داهاتوویەکی زیرەک تر بۆ لۆجستی و کاروباری دەروازەکان بونیاد بنێین. پەیوەندیمان پێوە بکەن بۆ پێکەوەبەستن. 📞",
    ar: "دعوة لشركات النقل والتجارة ومؤسسات التخليص الجمركي في العراق للتكاتف معنا لبناء مستقبل رقمي أذكى. تواصل معنا اليوم لمعرفة سبل الاندماج والشراكة ضمن AI Gate Iraq. 📞"
  }
];

export const DEMO_NARRATION_SCRIPT: NarrationScript = {
  ku: "سڵاو و ڕێز لە بینەرانی بەڕێز. ئەمڕۆ پێم خۆشە بە شانازییەوە کورتەیەکی سەرنجڕاکێشی پلاتفۆرمی **AI Gate Iraq**تان پێشکەش بکەم. ئەمە یەکەم لۆکالیزەکردنی تەواوی زیرەکی دەستکردە بۆ خزمەتی بازرگانی، لۆجستی و کاروباری کۆمپانیاکان لە عێراق. " +
      "کاتێک دەچیتە ناو چاتی ڕاوێژکاری زیرەک، دەبینیت چۆن بە زمانەکانی کوردی و عەرەبی بە دەستبەجێ وەڵامت دەداتەوە لەسەر مۆڵەتنامە، تێچووەکان و کۆدی گومرگی. " +
      "سەیر بکەن، دەتوانیت بە یەک کلیک لە تەنیشت چاتەکەوە بچیتە ناو 'حیسابکەری نرخ و باری شحن' یان 'مۆدیلی دۆخی دەروازەکان و دراو'، بڕیار لەسەر کڕینی کاڵاکانت بدەیت و فۆرمی دابینکردن چەن خێرا پڕ بکەیتەوە. " +
      "ئەم وەشانە لە ئێستادا 'ئەزموونی پایلۆتە' و داتا تاقیکارییەکان بەکاردەهێنێت بۆ پێشاندانی هێزی تەواو و سادەیی پلاتفۆرمەکەمان پێش بڵاوبوونەوەی فەرمی. سوپاس بۆ هاوکاریتان.",
  
  ar: "مرحباً بكم جميعاً. أود اليوم مرافقتكم في استعراض سريع لمنصة **AI Gate Iraq** — أول بيئة عمل لوجستية وتجارية ذكية مصممة خصيصاً للتجار والشركات في العراق. " +
      "بمجرد استخدامك لمستشار الأعمال المدعوم بالذكاء الاصطناعي، ستلاحظ السرعة والدقة في تقديم الاستجابات باللغات العربية والكردية فيما يخص تعاملات الاستيراد، مستندات ASYCUDA، وموانئ الدخول. " +
      "شاهد كيف يمكنك بنقرة واحدة الانتقال إلى حاسبة رسوم الجمارك وتقدير الشحن، مقارنة أسعار الصرف، تتبع المستندات، وإعداد طلبات التوريد بشكل مهني وسلسل. " +
      "هذه النسخة حالياً هي 'إطلاق تجريبي استكشافي' مجهزة بالكامل لضمان تقديم فكرة واضحة ومبسطة تسهل اتخاذ القرارات وحوكمة سلاسل الإمداد بأحدث نماذج الذكاء الاصطناعي. شكراً لكم.",
  
  en: "Hello everyone. Today, I'm thrilled to demo **AI Gate Iraq** — the premiere AI-powered operations workspace customized specifically for trade, sourcing, and logistics in Iraq. " +
      "Once you prompt our server-side intelligent business advisor, you get native localized feedback in Arabic, Kurdish, or English regarding licensing, customs procedures, and ASYCUDA codes. " +
      "Notice how cleanly you can open side-by-side modules like the Cost Estimator, Currency Tracker, or global Sourcing request forms to align with your daily business workflows instantly. " +
      "This release is a Pilot Preview engineered with strict security to highlight the system capabilities using stable demo references, paving the way for real-world merchant operations. Thank you."
};

export const VISUAL_GUIDE: VisualGuide = {
  colors: [
    { name: "Deep Slate Navy", hex: "#0D1B2A", role: "Primary canvas background, establishing a premium, serious, corporate SaaS density." },
    { name: "Mint Guild Emerald", hex: "#52B788", role: "Brand signature accents, success badges, buttons, active focus state lines, and indicators." },
    { name: "Premium Gold / Amber", hex: "#E0A96D", role: "Subtle decorative badges, warning cards, VIP highlights, and limited preview notices." }
  ],
  typography: {
    sans: "Inter (For robust, crisp multi-screen SaaS body content, ensuring readable forms and layout labels).",
    display: "Outfit / Space Grotesk (For modern displays, bold headings, and tech-forward branding).",
    mono: "JetBrains Mono / Fira Code (For tracking numbers, monetary math ratios, parallel currency offsets, and container sizes).",
    rationale: "Aligns classical financial respect and corporate stability with state-of-the-art computational intelligence."
  },
  iconStyle: "Sleek, lightweight line vectors imported exclusively from 'lucide-react'. Avoid solid fills or cartoon colors to preserve corporate trust.",
  layoutStyle: "Bento Grid Dashboard with spacious margins, elegant persistent sidebar for global navigation, card headers stacked beautifully, and a scrollable chat thread using balanced typography.",
  mockups: [
    "Laptop Mockup showcasing the dual-column Workspace: chat thread active with clear prompt chips on the left, costing results detailing custom percentages on the right.",
    "Mobile Responsive Mockup displaying the collapse drawer layout, demonstrating that touch targets exceed 44px with comfortable readability under RTL directions."
  ],
  whatToAvoid: [
    "Overuse of golden tones (keep gold strictly for minimal premium accents and warning signals).",
    "Unplanned red/blue gradient banners that look unauthentic or unprofessional.",
    "Cluttering the clean margin spaces with unrequested running container statistics or simulated system pings."
  ]
};
