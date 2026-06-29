import { BusinessSession, RecentPrompt, RecentServiceAction, SessionDrafts } from '../types/session';
import { ServiceKey } from '../types/services';
import { Message } from '../types/chat';

const STORAGE_KEY = 'ai_gate_iraq_session';
const VERSION = '1.0.0';
const WORKSPACE_CHANGE_EVENT = 'ai-gate-workspace-change';

export const DEFAULT_SESSION = (lang: 'ku' | 'ar' = 'ku'): BusinessSession => ({
  version: VERSION,
  activeService: 'assistant',
  chatScope: 'assistant',
  language: lang,
  chatMessages: [],
  chatBranches: [],
  activeBranchId: 'main',
  recentPrompts: [],
  recentServiceActions: [],
  drafts: {},
  updatedAt: Date.now()
});

function notifyWorkspaceChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(WORKSPACE_CHANGE_EVENT));
  }
}

function normalizeService(service?: ServiceKey): ServiceKey {
  return service === 'audit' ? 'assistant' : (service || 'assistant');
}

export function loadSession(currentLang: 'ku' | 'ar' = 'ku'): BusinessSession {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_SESSION(currentLang);
    const session = JSON.parse(data) as BusinessSession;
    if (session.version !== VERSION) return DEFAULT_SESSION(currentLang);
    return {
      ...DEFAULT_SESSION(currentLang),
      ...session,
      activeService: normalizeService(session.activeService),
      chatScope: normalizeService(session.chatScope),
      chatBranches: session.chatBranches || [],
      activeBranchId: session.activeBranchId || 'main',
      drafts: { ...session.drafts }
    };
  } catch (error) {
    console.error('Failed to load session from local storage:', error);
    return DEFAULT_SESSION(currentLang);
  }
}

export function saveSession(changes: Partial<BusinessSession>): void {
  try {
    const current = loadSession(changes.language);
    let messages = changes.chatMessages !== undefined ? changes.chatMessages : current.chatMessages;
    if (messages && messages.length > 80) {
      messages = [messages[0], ...messages.slice(-79)];
    }

    let branches = changes.chatBranches !== undefined ? changes.chatBranches : current.chatBranches;
    branches = (branches || []).map((branch) => ({
      ...branch,
      serviceKey: normalizeService(branch.serviceKey),
      messages: branch.messages.length > 80 ? [branch.messages[0], ...branch.messages.slice(-79)] : branch.messages
    })).slice(0, 12);

    const updated: BusinessSession = {
      ...current,
      ...changes,
      activeService: normalizeService(changes.activeService ?? current.activeService),
      chatScope: normalizeService(changes.chatScope ?? current.chatScope),
      chatMessages: messages,
      chatBranches: branches,
      activeBranchId: changes.activeBranchId ?? current.activeBranchId,
      drafts: {
        ...current.drafts,
        ...(changes.drafts || {})
      },
      updatedAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyWorkspaceChanged();
  } catch (error) {
    console.error('Failed to save session to local storage:', error);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyWorkspaceChanged();
  } catch (error) {
    console.error('Failed to clear session from local storage:', error);
  }
}

export function addRecentPrompt(text: string, serviceKey: ServiceKey): void {
  try {
    const current = loadSession();
    const cleanText = text.trim();
    if (!cleanText) return;
    const filtered = current.recentPrompts.filter(p => p.text.toLowerCase() !== cleanText.toLowerCase());
    const newPrompt: RecentPrompt = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      text: cleanText,
      serviceKey: normalizeService(serviceKey),
      timestamp: Date.now()
    };
    saveSession({ recentPrompts: [newPrompt, ...filtered].slice(0, 6) });
  } catch (error) {
    console.error('Failed to record recent prompt:', error);
  }
}

export function addServiceAction(actionName: string, serviceKey: ServiceKey): void {
  try {
    const current = loadSession();
    const newAction: RecentServiceAction = {
      id: `action_${Date.now()}`,
      actionName,
      serviceKey: normalizeService(serviceKey),
      timestamp: Date.now()
    };
    saveSession({ recentServiceActions: [newAction, ...current.recentServiceActions].slice(0, 10) });
  } catch (error) {
    console.error('Failed to record service action:', error);
  }
}

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
    text += `المستندات والمسودات قيد التحضير:\n\n`;

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
      text += `${idx + 1}. [${msg.role === 'user' ? 'التاجر' : 'المساعد الذكي'}]: ${msg.text}\n\n`;
    });
  } else {
    text += `=========================================\n`;
    text += `       کورتەی دانیشتنی کار - AI Gate Iraq  \n`;
    text += `=========================================\n`;
    text += `ڕێکەوتی هەناردەکردن: ${datetime}\n`;
    text += `بەڵگەنامە و ڕەشنووسەکانی ئامادەکردن:\n\n`;

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

    text += `[ڕاوێژکاری و وتووێژ لەگەڵ یاوەری زیرەک] (${session.chatMessages.length} نامە):\n`;
    session.chatMessages.forEach((msg, idx) => {
      text += `${idx + 1}. [${msg.role === 'user' ? 'بازرگان' : 'یاوەری زیرەک'}]: ${msg.text}\n\n`;
    });
  }

  const filename = `AI_Gate_Iraq_Session_${new Date().toISOString().slice(0, 10)}.txt`;
  return { text, filename };
}
