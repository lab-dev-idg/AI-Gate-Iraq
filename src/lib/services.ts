import { Bot, Sparkles, MapPin, DollarSign, Package, UserCheck, Building2, FileText, Globe, BarChart3, LucideIcon } from 'lucide-react';
import { getServicePromptChips } from './servicePrompts';

export type ServiceKey =
  | 'assistant'
  | 'market'
  | 'borders'
  | 'currency'
  | 'cost'
  | 'kyc'
  | 'procurement'
  | 'tracking'
  | 'map'
  | 'inquiry'
  | 'audit';

export interface ServiceItem {
  key: ServiceKey;
  label_ku: string;
  label_ar: string;
  label_en: string;
  icon: LucideIcon;
  color: string;
}

export const SERVICES: ServiceItem[] = [
  { key: 'assistant', label_ku: 'یاریدەدەری زیرەک', label_ar: 'المساعد الذكي', label_en: 'Smart Assistant', icon: Bot, color: 'text-emerald-500' },
  { key: 'market', label_ku: 'کارتێکردن و کورتەی بازاڕ', label_ar: 'ملخص السوق والتجارة', label_en: 'Market & Trade', icon: Sparkles, color: 'text-blue-500' },
  { key: 'borders', label_ku: 'دۆخی مەرزەکان', label_ar: 'حالة المنافذ', label_en: 'Border Status', icon: MapPin, color: 'text-rose-500' },
  { key: 'currency', label_ku: 'گۆڕینەوەی دراو', label_ar: 'محول العملات', label_en: 'Currency Converter', icon: DollarSign, color: 'text-amber-500' },
  { key: 'cost', label_ku: 'خەمڵاندنی تێچوو', label_ar: 'حاسبة التكاليف', label_en: 'Cost Estimator', icon: Package, color: 'text-indigo-500' },
  { key: 'kyc', label_ku: 'تۆمارکردن / KYC', label_ar: 'التسجيل و KYC', label_en: 'Registration / KYC', icon: UserCheck, color: 'text-teal-500' },
  { key: 'procurement', label_ku: 'دابینکردنی کاڵا', label_ar: 'توريد البضائع', label_en: 'Goods Sourcing', icon: Building2, color: 'text-violet-500' },
  { key: 'tracking', label_ku: 'بەدواداچوونی بار', label_ar: 'تتبع الشحنات', label_en: 'Shipment Tracking', icon: FileText, color: 'text-sky-500' },
  { key: 'map', label_ku: 'نەخشەی دەروازەکان', label_ar: 'خريطة المنافذ', label_en: 'Logistics Map', icon: Globe, color: 'text-emerald-500' },
  { key: 'audit', label_ku: 'وردبینی و چاکسازی', label_ar: 'تدقيق وتحسين', label_en: 'Audit & Improvement', icon: BarChart3, color: 'text-fuchsia-500' },
  { key: 'inquiry', label_ku: 'داوای دیمۆ / پەیوەندی', label_ar: 'طلب ديمو / اتصال', label_en: 'Demo / Contact', icon: Sparkles, color: 'text-emerald-500' },
];

const pick = (lang: string, ku: string, ar: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : ku;

export const getServiceName = (service: ServiceKey, lang: 'ku' | 'ar' | 'en'): string => {
  switch (service) {
    case 'assistant': return pick(lang, 'ڕاوێژی گشتی', 'الاستشارات العامة', 'General Advisory');
    case 'market': return pick(lang, 'کارتێکردن و کورتەی بازاڕ', 'ملخص السوق والتجارة', 'Market & Trade Intelligence');
    case 'borders': return pick(lang, 'دۆخی مەرزەکان', 'حالة المعابر والمنافذ', 'Border & Crossing Status');
    case 'currency': return pick(lang, 'گۆڕینەوەی دراو', 'محول وتصريف العملات', 'Currency Converter');
    case 'cost': return pick(lang, 'خەمڵاندنی تێچوو', 'حاسبة وتخمين التكاليف', 'Shipping Cost Estimator');
    case 'kyc': return pick(lang, 'تۆمارکردنی کۆمپانیا / KYC', 'التسجيل و KYC', 'Company Registration / KYC');
    case 'procurement': return pick(lang, 'دابینکردنی کاڵا', 'توريد البضائع', 'Goods Sourcing');
    case 'tracking': return pick(lang, 'بەدواداچوونی بار', 'تتبع الشحنات', 'Shipment Tracking');
    case 'map': return pick(lang, 'نەخشەی دەروازەکان', 'الخارطة اللوجستية', 'Logistics Map');
    case 'audit': return pick(lang, 'وردبینی پلاتفۆڕم و چاکسازی UI/UX', 'تدقيق المنصة وتحسين UI/UX', 'Platform Audit & UI/UX Improvement');
    case 'inquiry': return pick(lang, 'داوای دیمۆ / پەیوەندی', 'طلب ديمو / اتصال', 'Demo Request / Contact');
  }
};

export const getPromptChips = (
  service: ServiceKey,
  lang: 'ku' | 'ar' | 'en',
) => getServicePromptChips(service, lang);
