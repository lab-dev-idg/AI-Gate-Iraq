import { useState } from 'react';
import { ShoppingBag, Send, History, Package, DollarSign, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/src/lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export function ProcurementSourcing() {
  const { t } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    qty: '',
    currentPrice: '',
    targetPrice: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.qty) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t.procurement.success, {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    });

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
            {showHistory ? t.procurement.submit : 'مێژوو'}
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
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.procurement.itemName}</Label>
                <Input 
                  required
                  placeholder="بابەتەکە چییە؟"
                  value={formData.itemName}
                  onChange={e => setFormData({...formData, itemName: e.target.value})}
                  className="h-10 text-xs text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl"
                />
              </div>
 
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.procurement.qty}</Label>
                  <Input 
                    required
                    type="number"
                    placeholder="1000"
                    value={formData.qty}
                    onChange={e => setFormData({...formData, qty: e.target.value})}
                    className="h-10 text-xs text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.procurement.targetPrice}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    <Input 
                      placeholder="ناچاری نییە"
                      type="number"
                      value={formData.targetPrice}
                      onChange={e => setFormData({...formData, targetPrice: e.target.value})}
                      className="h-10 text-xs text-right pl-8 bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl"
                    />
                  </div>
                </div>
              </div>
 
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.procurement.notes}</Label>
                <Textarea 
                  placeholder={t.procurement.notes + "..."}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="min-h-[80px] text-xs text-right resize-none bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl p-3"
                />
              </div>
 
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 tracking-wide shadow-sm rounded-xl transition-all">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-1.5 w-full">
                    <span>{t.procurement.submit}</span>
                    <Send className="w-4 h-4 rtl:-rotate-180" />
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
                <p className="text-xs">هیچ داواکارییەک نییە</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
