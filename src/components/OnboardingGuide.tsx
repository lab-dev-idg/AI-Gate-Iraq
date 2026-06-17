import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Calculator,
  TrendingUp,
  Compass,
  FileCheck,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceKey } from '../types/services';

interface OnboardingGuideProps {
  lang: 'ku' | 'ar';
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (service: ServiceKey, initialPrompt?: string) => void;
}

export function OnboardingGuide({ lang, t, isOpen, onClose, onActionClick }: OnboardingGuideProps) {
  const [step, setStep] = useState(1);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const stepsCount = 3;
  const handleNext = () => step < stepsCount ? setStep(step + 1) : onClose();
  const handlePrev = () => step > 1 && setStep(step - 1);

  const quickActions = [
    {
      label: t.onboarding.actionAskAI,
      service: 'assistant' as ServiceKey,
      prompt: isAr
        ? 'ما هي المستندات المطلوبة لتأسيس شركة تجارية محدودة في العراق؟'
        : 'چ بەڵگەنامەیەک پێویستە بۆ دامەزراندنی کۆمپانیایەکی بازرگانی سنووردار لە عێراق؟',
    },
    { label: t.onboarding.actionCalc, service: 'cost' as ServiceKey },
    { label: t.onboarding.actionConvert, service: 'currency' as ServiceKey },
    { label: t.onboarding.actionBorder, service: 'borders' as ServiceKey },
    { label: t.onboarding.actionProcure, service: 'procurement' as ServiceKey },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 font-arabic text-right flex flex-col max-h-[90vh]"
          dir="rtl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label={isAr ? 'إغلاق' : 'داخستن'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{t.onboarding.title}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
              <span>{step}</span><span>/</span><span>{stepsCount}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center space-y-2">
                    <Compass className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-50">{t.onboarding.title}</h2>
                    <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-bold">{t.onboarding.subtitle}</p>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{t.onboarding.desc}</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-50 border-r-4 border-emerald-500 pr-2">
                    {isAr ? 'استكشاف الأقسام والأدوات' : 'گەڕان بەدوای بەشەکان و ئامرازەکان'}
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { icon: Sparkles, title: t.onboarding.step1Title, desc: t.onboarding.step1Desc, tone: 'blue' },
                      { icon: Calculator, title: t.onboarding.step2Title, desc: t.onboarding.step2Desc, tone: 'emerald' },
                      { icon: Database, title: t.onboarding.step3Title, desc: t.onboarding.step3Desc, tone: 'purple' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                          <div className={`p-2 bg-${item.tone}-500/10 text-${item.tone}-500 rounded-lg`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200">{item.title}</h4>
                            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-50 border-r-4 border-emerald-500 pr-2">
                      {isAr ? 'ابدأ استخدام خدماتك الآن' : 'ئێستا دەست بە بەکارهێنانی خزمەتگوزارییەکان بکە'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {isAr ? 'اختر إحدى الخدمات التالية للبدء مباشرة:' : 'یەکێک لەم خزمەتگوزارییانە هەڵبژێرە بۆ دەستپێکردنی ڕاستەوخۆ:'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onActionClick(action.service, action.prompt);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/85 hover:border-emerald-500/40 rounded-xl hover:bg-emerald-50/20 transition-all text-right"
                      >
                        <span className="flex items-center gap-1.5">
                          {action.service === 'assistant' && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                          {action.service === 'cost' && <Calculator className="w-3.5 h-3.5 text-emerald-500" />}
                          {action.service === 'currency' && <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />}
                          {action.service === 'borders' && <Compass className="w-3.5 h-3.5 text-amber-500" />}
                          {action.service === 'procurement' && <FileCheck className="w-3.5 h-3.5 text-purple-500" />}
                          <span>{action.label}</span>
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={handlePrev} disabled={step === 1} className="gap-1">
              <ArrowRight className="w-4 h-4" />
              {isAr ? 'السابق' : 'پێشوو'}
            </Button>
            <Button onClick={handleNext} className="gap-1 bg-emerald-600 hover:bg-emerald-500 text-white">
              {step === stepsCount ? (isAr ? 'ابدأ الآن' : 'دەست پێ بکە') : (isAr ? 'التالي' : 'دواتر')}
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
