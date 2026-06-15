import { BusinessSession, RecentPrompt, RecentServiceAction, SessionDrafts } from '../types/session';
import { ServiceKey } from '../types/services';
import { Message } from '../types/chat';

const STORAGE_KEY = 'ai_gate_iraq_session';
const VERSION = '1.0.0';

export const DEFAULT_SESSION = (lang: 'ku' | 'ar' = 'ku'): BusinessSession => ({
  version: VERSION,
  activeService: 'assistant',
  chatScope: 'assistant',
  language: lang,
  chatMessages: [],
  recentPrompts: [],
  recentServiceActions: [],
  drafts: {},
  updatedAt: Date.now()
});

/**
 * Safely loads the business session from localStorage.
 */
export function loadSession(currentLang: 'ku' | 'ar' = 'ku'): BusinessSession {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return DEFAULT_SESSION(currentLang);
    }
    const session = JSON.parse(data) as BusinessSession;
    if (session.version !== VERSION) {
      // Version mismatch cleanup if structure changed dramatically
      return DEFAULT_SESSION(currentLang);
    }
    return {
      ...DEFAULT_SESSION(currentLang),
      ...session,
      drafts: {
        ...session.drafts
      }
    };
  } catch (error) {
    console.error('Failed to load session from local storage:', error);
    return DEFAULT_SESSION(currentLang);
  }
}

/**
 * Safely saves the session changes to localStorage.
 */
export function saveSession(changes: Partial<BusinessSession>): void {
  try {
    const current = loadSession(changes.language);
    let messages = changes.chatMessages !== undefined ? changes.chatMessages : current.chatMessages;

    // Safety cap: Limit to top 80 chat messages to protect localStorage size limits
    if (messages && messages.length > 80) {
      // Keep the very first assistant greeting message, and the most recent 79 messages
      messages = [messages[0], ...messages.slice(-79)];
    }

    const updated: BusinessSession = {
      ...current,
      ...changes,
      chatMessages: messages,
      drafts: {
        ...current.drafts,
        ...(changes.drafts || {})
      },
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save session to local storage:', error);
  }
}

/**
 * Erases the active local session.
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session from local storage:', error);
  }
}

/**
 * Records a prompt chosen or sent by the user to the list of recent prompts.
 */
export function addRecentPrompt(text: string, serviceKey: ServiceKey): void {
  try {
    const current = loadSession();
    const cleanText = text.trim();
    if (!cleanText) return;

    // Remove duplicates to keep list distinct and tidy
    const filtered = current.recentPrompts.filter(p => p.text.toLowerCase() !== cleanText.toLowerCase());
    const newPrompt: RecentPrompt = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      text: cleanText,
      serviceKey,
      timestamp: Date.now()
    };

    // Keep top 6 items
    const limited = [newPrompt, ...filtered].slice(0, 6);
    saveSession({ recentPrompts: limited });
  } catch (error) {
    console.error('Failed to record recent prompt:', error);
  }
}

/**
 * Records a key customer business action (e.g. calculation, shipment search).
 */
export function addServiceAction(actionName: string, serviceKey: ServiceKey): void {
  try {
    const current = loadSession();
    const newAction: RecentServiceAction = {
      id: `action_${Date.now()}`,
      actionName,
      serviceKey,
      timestamp: Date.now()
    };
    const limited = [newAction, ...current.recentServiceActions].slice(0, 10);
    saveSession({ recentServiceActions: limited });
  } catch (error) {
    console.error('Failed to record service action:', error);
  }
}

/**
 * Generates an elegant and clear text or JSON payload for business record exporting.
 */
export function exportSessionSummary(session: BusinessSession, lang: 'ku' | 'ar'): { text: string; filename: string } {
  const isAr = lang === 'ar';
  const datetime = new Date(session.updatedAt).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let text = '';
  if (isAr) {
    text += `=========================================\n`;
    text += `       ملخص جلسة العمل - AI Gate Iraq    \n`;
    text += `=========================================\n`;
    text += `تاريخ التصدير: ${datetime}\n`;
    text += `المستندات المحلية والمسودات قيد التحضير:\n\n`;

    if (session.drafts.kycCompanyName) {
      text += `[معلومات توثيق التاجر (KYC)]:\n`;
      text += `- الاسم التجاري: ${session.drafts.kycCompanyName}\n`;
      text += `- الكيان القانوني: ${session.drafts.kycCompanyType || 'غير محدد'}\n`;
      text += `- المدير المفوض: ${session.drafts.kycDirectorName || 'غير محدد'}\n`;
      text += `- الرقم الضريبي: ${session.drafts.kycTaxId || 'غير محدد'}\n\n`;
    }

    if (session.drafts.procurementCategory) {
      text += `[تفاصيل توريد السلع وبطاقة المشتريات]:\n`;
      text += `- الفئة المطلوبة: ${session.drafts.procurementCategory}\n`;
      text += `- الكمية: ${session.drafts.procurementQty || 'غير محدد'}\n`;
      text += `- رغبات ومواصفات المصنع: ${session.drafts.procurementSpecs || 'لا توجد تفاصيل'}\n\n`;
    }

    if (session.drafts.trackingNumber) {
      text += `[آخر شحنة تم تتبعها]:\n`;
      text += `- رقم البوليصة: ${session.drafts.trackingNumber}\n\n`;
    }

    if (session.drafts.currencyAmount) {
      text += `[أحدث عملية تحويل عملات]:\n`;
      text += `- المبلغ: ${session.drafts.currencyAmount} من ${session.drafts.currencyFrom} إلى ${session.drafts.currencyTo}\n\n`;
    }

    if (session.drafts.costWeight) {
      text += `[حاسبة التكاليف التخمينية للشحن]:\n`;
      text += `- الوزن: ${session.drafts.costWeight} كغم، الحجم التجاري: ${session.drafts.costVolume || '0'}\n`;
      text += `- مسار الشحن: من ${session.drafts.costOrigin || '-'} إلى ${session.drafts.costDestination || '-'}\n\n`;
    }

    text += `[الاستشارات والمحادثات مع المساعد الذكي] (${session.chatMessages.length} رسالة):\n`;
    session.chatMessages.forEach((msg, idx) => {
      const roleName = msg.role === 'user' ? 'التاجر' : 'المساعد الذكي';
      text += `${idx + 1}. [${roleName}]: ${msg.text}\n\n`;
    });

    text += `-----------------------------------------\n`;
    text += `ملاحظة: هذه البيانات تم تصديرها من التخزين المؤقت المحلي لمتصفحك فقط للحفاظ على الخصوصية الكاملة للأعمال.\n`;
  } else {
    text += `=========================================\n`;
    text += `       کورتەی دانیشتنی کار - AI Gate Iraq  \n`;
    text += `=========================================\n`;
    text += `ڕێکەوتی هەناردەکردن: ${datetime}\n`;
    text += `بەڵگەنامە و ڕەشنووسە ناوخۆییەکانی ئامادەکردن:\n\n`;

    if (session.drafts.kycCompanyName) {
      text += `[زانیاری تۆمارکانی بازرگان / KYC]:\n`;
      text += `- ناوی بازرگانی: ${session.drafts.kycCompanyName}\n`;
      text += `- جۆری کار: ${session.drafts.kycCompanyType || 'دیاری نەکراوە'}\n`;
      text += `- بەڕێوبەری ڕێگەپێدراو: ${session.drafts.kycDirectorName || 'دیاری نەکراوە'}\n`;
      text += `- ژمارەی باج: ${session.drafts.kycTaxId || 'دیاری نەکراوە'}\n\n`;
    }

    if (session.drafts.procurementCategory) {
      text += `[کارت و وردەکارییەکانی دابینکردنی کاڵا]:\n`;
      text += `- پۆلی کاڵا: ${session.drafts.procurementCategory}\n`;
      text += `- بڕی پێویست: ${session.drafts.procurementQty || 'دیاری نەکراوە'}\n`;
      text += `- تایبەتمەندی کارگە: ${session.drafts.procurementSpecs || 'تێبینی نییە'}\n\n`;
    }

    if (session.drafts.trackingNumber) {
      text += `[دوا بەدواداچوونی بار]:\n`;
      text += `- ژمارەی مانیفێست یان بڵیسە: ${session.drafts.trackingNumber}\n\n`;
    }

    if (session.drafts.currencyAmount) {
      text += `[دوایین گۆڕینەوەی دراو]:\n`;
      text += `- بڕی دراو: ${session.drafts.currencyAmount} لە ${session.drafts.currencyFrom} بۆ ${session.drafts.currencyTo}\n\n`;
    }

    if (session.drafts.costWeight) {
      text += `[خەمڵاندنی تێچووی گەیاندن و لۆجیستی]:\n`;
      text += `- کێش: ${session.drafts.costWeight} کگم، قەبارە: ${session.drafts.costVolume || '0'}\n`;
      text += `- گواستنەوە: لە ${session.drafts.costOrigin || '-'} بۆ ${session.drafts.costDestination || '-'}\n\n`;
    }

    text += `[ڕاوێژکاری و وتووێژ لەگەڵ یاور دیسک] (${session.chatMessages.length} نامە):\n`;
    session.chatMessages.forEach((msg, idx) => {
      const roleName = msg.role === 'user' ? 'بازرگان' : 'یاوەری زیرەک';
      text += `${idx + 1}. [${roleName}]: ${msg.text}\n\n`;
    });

    text += `-----------------------------------------\n`;
    text += `تێبینی: ئەم زانیارییانە لە وێبگەڕی ناوخۆیی خۆتەوە دەرهێنراون بە مەبەستی پاراستنی نهێنێ مەلەفە بازرگانییەکانت.\n`;
  }

  const filename = `AI_Gate_Iraq_Session_${new Date().toISOString().slice(0, 10)}.txt`;
  return { text, filename };
}
