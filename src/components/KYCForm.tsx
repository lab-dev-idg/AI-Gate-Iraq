import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export const KYCForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('داواکارییەکەت با سەرکەوتوویی نێردرا بۆ پێداچوونەوە.', {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    });

    setFormData({
      companyName: '',
      licenseNumber: ''
    });
    setIsSubmitting(false);
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" dir="rtl">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-950 dark:text-white font-arabic">
          <UserCheck className="w-5 h-5 text-emerald-500" />
          تۆمارکردنی ئەکاونتی بازرگانی (KYC)
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تکایە زانیارییەکان بە وردی پڕ بکەرەوە بۆ ئەوەی متمانەی حەواڵەکردنت بۆ چالاک بێت.</p>
      </CardHeader>
      
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ناوی بازرگان / کۆمپانیا</Label>
            <Input 
              type="text" 
              className="bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 h-10 rounded-xl" 
              placeholder="بۆ نموونە: کۆمپانیای لۆمبێناکس"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ژمارەی مۆڵەتی بازرگانی</Label>
            <Input 
              type="text" 
              className="bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 h-10 rounded-xl" 
              placeholder="000000"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900 group">
            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <UploadCloud className="w-8 h-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">بارکردنی وێنەی ناسنامە یان مۆڵەت (Upload)</span>
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
              <p className="text-[10px] text-slate-500 mt-2 font-mono">JPG, PNG یان PDF (زۆرترین قەبارە ٥ مێگابایت)</p>
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-sm rounded-xl transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'ناردنی داواکاری بۆ پێداچوونەوە'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
