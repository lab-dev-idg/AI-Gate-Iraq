import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  HelpCircle, 
  Calculator, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  FileCheck,
  CheckCircle2,
  Database
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

  const handleNext = () => {
    if (step < stepsCount) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const quickActionsDefault = [
    {
      label: t.onboarding.actionAskAI,
      service: 'assistant' as ServiceKey,
      prompt: isAr 
        ? 'ما هي المستندات المطلوبة لتأسيس شركة تجارية محدودة في العراق؟'
        : 'چ بەڵگەنامەیەک پێویستە بۆ دامەزراندنی کۆمپانیایەکی بازرگانی سنووردار لە عێراق؟'
    },
    {
      label: t.onboarding.actionCalc,
      service: 'cost' as ServiceKey,
    },
    {
      label: t.onboarding.actionConvert,
      service: 'currency' as ServiceKey,
    },
    {
      label: t.onboarding.actionBorder,
      service: 'borders' as ServiceKey,
    },
    {
      label: t.onboarding.actionProcure,
      service: 'procurement' as ServiceKey,
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 font-arabic text-right flex flex-col max-h-[90vh]"
          dir="rtl"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Header */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                {t.onboarding.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
              <span>{step}</span>
              <span>/</span>
              <span>{stepsCount}</span>
            </div>
          </div>

          {/* Content scroll area */}
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
                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-50">
                      {t.onboarding.title}
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                      {t.onboarding.subtitle}
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {t.onboarding.desc}
                  </p>

                  {/* Honesty note */}
                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{t.onboarding.pilotNote}</p>
                  </div>
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
                    {lang === 'ar' ? 'استكشاف الأقسام والأدوات' : 'گەڕان بەدوای بەشەکان و ئامرازەکان'}
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200">
                          {t.onboarding.step1Title}
                        </h4>
                        <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {t.onboarding.step1Desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200">
                          {t.onboarding.step2Title}
                        </h4>
                        <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {t.onboarding.step2Desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                        <Database className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200">
                          {t.onboarding.step3Title}
                        </h4>
                        <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {t.onboarding.step3Desc}
                        </p>
                      </div>
                    </div>
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
                      {lang === 'ar' ? 'ابدأ كسب الأرباح والأعمال فورا' : 'دەستبەجێ دەست بە کارەکان بکە'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {lang === 'ar' 
                        ? 'انقر على أحد الروابط الموجهة التالية لبدء العمل المباشر وتخصيص تجربتك:' 
                        : 'کلیک لەسەر یەکێک لەم هەنگاوانەی خوارەوە بکە بۆ دەستپێکردنی ڕاستەوخۆ:'}
                    </p>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickActionsDefault.map((act, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onActionClick(act.service, act.prompt);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/85 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 rounded-xl hover:bg-emerald-50/20 transition-all text-right cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          {act.service === 'assistant' && <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          {act.service === 'cost' && <Calculator className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          {act.service === 'currency' && <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                          {act.service === 'borders' && <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          {act.service === 'procurement' && <FileCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                          <span>{act.label}</span>
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Privacy note */}
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 dark:border-blue-500/30 rounded-xl flex items-start gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium">
                    <Database className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{t.onboarding.localNote}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Footer buttons */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold font-arabic rounded-xl"
            >
              {t.onboarding.skip}
            </Button>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="rounded-xl font-arabic text-xs font-bold gap-1 pr-2.5 border-slate-200 dark:border-slate-800"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{t.onboarding.prev}</span>
                </Button>
              )}

              <Button
                variant="default"
                size="sm"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-arabic text-xs font-black gap-1 pl-2.5 shadow-md shadow-emerald-500/15"
              >
                <span>{step === stepsCount ? t.onboarding.startNow : t.onboarding.next}</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
