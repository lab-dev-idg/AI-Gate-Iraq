import { AdminState } from './adminTypes';

export const DEFAULT_ADMIN_STATE: AdminState = {
  services: [
    {
      id: '1',
      key: 'assistant',
      titleKu: 'ڕاوێژکاری بازرگانی ژیری دەستکرد',
      titleAr: 'مستشار الأعمال الذكي',
      titleEn: 'AI Business Advisor',
      descriptionKu: 'گفتوگۆکردنی ڕاستەوخۆ لەگەڵ ڕاوێژکاری لێهاتوو بۆ یارمەتیدانی هاوردە و هەناردە.',
      descriptionAr: 'دردشة تفاعلية للحصول على استشارات جمركية وقانونية فورية.',
      descriptionEn: 'Interactive chat with AI for instant customs and trade advice.',
      enabled: true,
      visible: true,
      order: 1,
      status: 'active',
      pilotNoteKu: 'ئەمە وەشانێکی تاقیکارییە بۆ نیشاندانی توانای ڕاوێژکاری ژیری دەستکرد.',
      pilotNoteAr: 'هذه نسخة تجريبية لاستعراض قدرات الذكاء الاصطناعي.',
      adminNote: 'Main service component'
    },
    {
      id: '2',
      key: 'market',
      titleKu: 'پوختەی بازاڕ و ڕێساکان',
      titleAr: 'ملخص السوق واللوائح',
      titleEn: 'Market Summary',
      descriptionKu: 'بینینی نوێترین گۆڕانکاری و بڵاوکراوەکانی بازاڕی عێراق.',
      descriptionAr: 'متابعة أحدث أسعار السلع واللوائح التجارية.',
      descriptionEn: 'View latest Iraqi market prices and trade directives.',
      enabled: true,
      visible: true,
      order: 2,
      status: 'active',
      pilotNoteKu: 'داتاکان تەنها بۆ تاقیکردنەوەی سەکۆکەیە.',
      pilotNoteAr: 'البيانات لأغراض العرض التوضيحي فقط.',
      adminNote: 'Market overview engine'
    },
    {
      id: '3',
      key: 'borders',
      titleKu: 'بارودۆخی دەروازەکان',
      titleAr: 'حالة المعابر الحدودية',
      titleEn: 'Border Status',
      descriptionKu: 'پشکنینی کاتی چاوەڕوانی و قەرەباڵغی دەروازە سنورییەکان.',
      descriptionAr: 'متابعة كشوفات الانتظار والازدحام في المنافذ الحدودية.',
      descriptionEn: 'Check wait times and congestion at border checkpoints.',
      enabled: true,
      visible: true,
      order: 3,
      status: 'active'
    },
    {
      id: '4',
      key: 'currency',
      titleKu: 'گۆڕینەوەی دراو',
      titleAr: 'محول العملات',
      titleEn: 'Currency Converter',
      descriptionKu: 'بەراوردکردنی نرخی فەرمی لەگەڵ نرخی هاوشێوەی بازاڕ.',
      descriptionAr: 'مقارنة الأسعار الرسمية للدولار مع أسواق التداول الموازية.',
      descriptionEn: 'Compare official Central Bank rates with parallel market rates.',
      enabled: true,
      visible: true,
      order: 4,
      status: 'active'
    },
    {
      id: '5',
      key: 'cost',
      titleKu: 'خەمڵاندنی تێچووی گواستنەوە',
      titleAr: 'حساب تكلفة الشحن والتعرفة',
      titleEn: 'Cost Estimator',
      descriptionKu: 'خەمڵاندنی تەسریحەی گومرگی و باج بەپێی کێش و جۆر.',
      descriptionAr: 'تقدير الرسوم الجمركية والضرائب بناءً على الوزن والنوع.',
      descriptionEn: 'Estimate customs tariffs and logistics costs.',
      enabled: true,
      visible: true,
      order: 5,
      status: 'active'
    },
    {
      id: '6',
      key: 'kyc',
      titleKu: 'تۆمارکردنی کۆمپانیا (KYC)',
      titleAr: 'تأهيل حسابات الشركات KYC',
      titleEn: 'KYC Business Account',
      descriptionKu: 'پڕکردنەوەی جۆری زانیاری کۆمپانیاکان بۆ ڕێکارە یاساییەکان.',
      descriptionAr: 'إعداد ملفات تأهيل الشركات للمطابقة القانونية والامتثال.',
      descriptionEn: 'Step-by-step business verification compliance simulation.',
      enabled: true,
      visible: true,
      order: 6,
      status: 'active'
    },
    {
      id: '7',
      key: 'procurement',
      titleKu: 'سەرچاوە و کڕین',
      titleAr: 'الشراء والمناقصات المحلية',
      titleEn: 'Procurement & Sourcing',
      descriptionKu: 'دروستکردنی داواکاری نرخ (RFQ) بە گرێدانی بازاڕی عێراقی.',
      descriptionAr: 'صياغة عروض الأسعار ونماذج الشراء الآمنة.',
      descriptionEn: 'Generate RFQs and structure product sourcing templates.',
      enabled: true,
      visible: true,
      order: 7,
      status: 'active'
    },
    {
      id: '8',
      key: 'tracking',
      titleKu: 'بەدواداچوونی بار',
      titleAr: 'تتبع الشحنات والحاويات',
      titleEn: 'Shipment Tracking',
      descriptionKu: 'بینینی هەنگاوەکانی پشکنینی گومرگی و گەیشتنی بار.',
      descriptionAr: 'استقصاء مسار الحاويات ومراحل الإفراج الجمركي.',
      descriptionEn: 'Track customs approval milestones and border status.',
      enabled: true,
      visible: true,
      order: 8,
      status: 'active'
    },
    {
      id: '9',
      key: 'map',
      titleKu: 'نەخشەی لۆجیستی عێراق',
      titleAr: 'الخارطة اللوجستية للعراق',
      titleEn: 'Logistics Map',
      descriptionKu: 'نەخشەی کارلێکەر بۆ کێشانی هێڵ و دەروازە بازرگانییەکان.',
      descriptionAr: 'استكشاف المنافذ الجافة والموانئ ومسارات النقل الداخلي.',
      descriptionEn: 'Interactive visual planner for trade routes and checkpoints.',
      enabled: true,
      visible: true,
      order: 9,
      status: 'active'
    }
  ],
  prompts: [
    {
      id: 'p1',
      serviceKey: 'assistant',
      labelKu: 'ڕێساکانی هاوردەی دەرمان',
      labelAr: 'تعليمات استيراد الأدوية',
      promptKu: 'ڕێنمایی و مەرجە بنەڕەتییەکان بۆ هاوردەکردنی دەرمان بۆ عێراق چییە؟',
      promptAr: 'ما هي الشروط الأساسية لاستيراد الأدوية والمستلزمات الطبية للعراق؟',
      enabled: true,
      order: 1
    },
    {
      id: 'p2',
      serviceKey: 'assistant',
      labelKu: 'باجی گومرگی ئۆتۆمبێل',
      labelAr: 'التعرفة الجمركية للسيارات',
      promptKu: 'ڕێژەی باج و دەرهێنانی تەسریحەی گومرگی بۆ ئۆتۆمبێلەکان چۆنە؟',
      promptAr: 'ما هي نسب جمارك السيارات والضوابط المتبعة في إقليم كوردستان وبقية المحافظات؟',
      enabled: true,
      order: 2
    }
  ],
  workflows: [
    {
      id: 'ws1',
      serviceKey: 'kyc',
      titleKu: 'پشکنینی بەڵگەنامەکان',
      titleAr: 'فحص المستندات',
      descriptionKu: 'تەواوکردنی نووسراوی ژووری بازرگانی و ناسنامەی کۆمپانیا.',
      descriptionAr: 'توفير السجل التجاري وهوية الغرفة التجارية العراقية.',
      order: 1,
      enabled: true
    },
    {
      id: 'ws2',
      serviceKey: 'kyc',
      titleKu: 'تۆمارکردنی ڕێگەپێدانی گومرگی',
      titleAr: 'تسجيل الرقم الجمركي الموحد',
      descriptionKu: 'دەرهێنانی کۆدی یەکگرتووی گومرگی بۆ بەشداریکردن لە هاوردە.',
      descriptionAr: 'الحصول على الرمز الجمركي الموحد لبدء العمليات الرسمية.',
      order: 2,
      enabled: true
    }
  ],
  flags: [
    {
      key: 'show_pilot_limits',
      labelKu: 'نیشاندانی هۆشداری تاقیکاری',
      descriptionKu: 'نیشاندانی تێکستی ڕوونکەرەوە کە ئەمە ماڵپەڕێکی ڕاستەقینەی گومرگ یان بانک نییە.',
      enabled: true
    },
    {
      key: 'enable_multimodal',
      labelKu: 'پشتیوانیکردنی دەستکاریکردنی فایل',
      descriptionKu: 'چالاککردنی وەرگرتن و سەرنجدانی فایل لە بواری یاریدەدەری زیرەکدا.',
      enabled: true
    }
  ],
  intake: [
    {
      id: 'i1',
      name: 'ڕزگار حەمە',
      company: 'کۆمپانیای بازرگانی عێراقی نوێ',
      contact: 'rizgar@test-iraq.com',
      serviceInterest: 'procurement',
      category: 'خۆراک و دەرمان',
      message: 'سڵاو، ئێمە دەمانەوێت مەرجەکانی کرینی باری خۆراک لە بەندەری ئوم قەسرەوە بزانین.',
      status: 'new',
      adminNote: 'نیازی کڕینی ئارد و ڕۆن',
      createdAt: '2026-06-16T10:00:00Z',
      updatedAt: '2026-06-16T10:00:00Z'
    },
    {
      id: 'i2',
      name: 'ئازاد محەمەد',
      company: 'کۆمپانیای لۆجیستی ئاریان',
      contact: '+964 770 123 4567',
      serviceInterest: 'tracking',
      category: 'کەرەستەی بیناسازی',
      message: 'پێویستمان بە سیستەمی بەدواداچوونی پێشەنگە بۆ سێ کانتینەر کە گەیشتوونەتە ئیبراهیم خەلیل.',
      status: 'reviewing',
      adminNote: 'پەیوەندی درا بە مۆبایلەکەیەوە بۆ ناردنی کۆد تاوتوێکرا',
      createdAt: '2026-06-15T15:30:00Z',
      updatedAt: '2026-06-16T09:15:00Z'
    }
  ],
  contents: [
    {
      id: 'c1',
      key: 'welcome_notice',
      titleKu: 'بەخێربێن بۆ سەکۆی نیشتمانی بۆ بازرگانی و کار',
      titleAr: 'مرحباً بكم في البوابة الوطنية للتجارة والأعمال',
      bodyKu: 'ڕاوێژکارێکی زیرەک بۆ هاوردە و لۆجیستیکی پێشکەوتوو لە عێراق.',
      bodyAr: 'بوابتك الذكية لتسهيل أعمال الاستيراد واللوائح الجمركية في العراق.',
      visible: true,
      updatedAt: '2026-06-16T05:00:00Z'
    }
  ],
  logs: [
    {
      id: 'log1',
      actorName: 'سەرپەرشتیاری تاقیکاری (Admin)',
      action: 'دروستکردن',
      entity: 'سیستەم',
      description: 'دەستپێکردنی تۆماری کۆنترۆڵی ئادمین بۆ دابینکردنی مۆدێلی نەخشەی بنەڕەتی.',
      createdAt: '2026-06-16T05:10:00Z'
    }
  ]
};
