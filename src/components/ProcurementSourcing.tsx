import { useState, useEffect } from 'react';
import { ShoppingBag, Send, History, Package, DollarSign, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/src/lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

export function ProcurementSourcing() {
  const { lang, t } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const drafts = loadSession().drafts;
    return {
      itemName: drafts.procurementCategory || '',
      qty: drafts.procurementQty || '',
      currentPrice: '',
      targetPrice: '',
      notes: drafts.procurementSpecs || ''
    };
  });

  useEffect(() => {
    saveSession({
      drafts: {
        procurementCategory: formData.itemName,
        procurementQty: formData.qty,
        procurementSpecs: formData.notes
      }
    });
  }, [formData.itemName, formData.qty, formData.notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.qty) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t.procurement.success, {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    });

    addServiceAction(`Sourcing: ${formData.itemName} (${formData.qty} pcs)`, 'procurement');

    setFormData({
      itemName: '',
      qty: '',
      currentPrice: '',
      targetPrice: '',
      notes: ''
    });
    setIsSubmitting(false);
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center justify-between text-slate-950 dark:text-white font-arabic">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            {t.procurement.title}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)}
            className="h-8 px-2 text-xs gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold"
          >
            {showHistory ? <PlusCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
            {showHistory ? (lang === 'ar' ? 'طلب جديد' : 'داواکاری نوێ') : t.procurement.history}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-4 text-right"
              dir="rtl"
            >
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic mb-0.5 block">{t.procurement.itemName}</Label>
                <Input 
                  required
                  placeholder={t.procurement.itemNamePlaceholder}
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                  className="h-11 text-xs text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold shadow-inner focus-visible:ring-emerald-500"
                />
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic mb-0.5 block">{t.procurement.qty}</Label>
                  <Input 
                    required
                    type="number"
                    placeholder="1000"
                    value={formData.qty}
                    onChange={e => setFormData({...formData, qty: e.target.value})}
                    className="h-11 text-xs text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold shadow-inner focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic mb-0.5 block">{t.procurement.targetPrice}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                    <Input 
                      placeholder={lang === 'ar' ? 'اختياري' : 'ناچاری نییە'}
                      type="number"
                      value={formData.targetPrice}
                      onChange={e => setFormData({...formData, targetPrice: e.target.value})}
                      className="h-11 text-xs text-right pl-9 pr-4 bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl font-semibold shadow-inner focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
 
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic mb-0.5 block">{t.procurement.notes}</Label>
                <Textarea 
                  placeholder={t.procurement.notes + "..."}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="min-h-[100px] text-xs text-right resize-none bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl p-3.5 font-semibold shadow-inner focus-visible:ring-emerald-500"
                />
              </div>
 
              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold h-11 tracking-wider shadow-md shadow-emerald-500/10 rounded-xl transition-all">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full font-arabic">
                    <span>{t.procurement.submit}</span>
                    <Send className="w-4 h-4 rtl:-rotate-180 shrink-0" />
                  </div>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3 py-2"
            >
              <div className="text-center py-8 opacity-40">
                <Package className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold">{t.procurement.noHistory}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
