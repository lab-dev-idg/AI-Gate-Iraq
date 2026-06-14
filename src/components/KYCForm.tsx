import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, CheckCircle2, UserCheck, File, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/src/lib/LanguageContext';

export const KYCForm = () => {
  const { lang, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      toast.info(lang === 'ar' ? 'تم اختيار الملف بنجاح!' : 'بەڵگەنامەکە بە سەرکەوتوویی تەرخانکرا!');
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t.kyc.success, {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
    });

    setFormData({
      companyName: '',
      licenseNumber: ''
    });
    setFileName(null);
    setIsSubmitting(false);
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" dir="rtl">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-950 dark:text-white font-arabic">
          <UserCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
          {t.kyc.title}
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.kyc.subtitle}</p>
      </CardHeader>
      
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t.kyc.companyName}</Label>
            <Input 
              type="text" 
              className="bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 h-10 rounded-xl" 
              placeholder={t.kyc.companyNamePlaceholder}
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t.kyc.licenseNumber}</Label>
            <Input 
              type="text" 
              className="bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 h-10 rounded-xl" 
              placeholder={t.kyc.licensePlaceholder}
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900 group">
            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              {fileName ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-2">
                    <File className="w-6 h-6 text-emerald-500" />
                    <button 
                      onClick={handleRemoveFile}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                      title="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm max-w-xs truncate">{fileName}</span>
                  <span className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'الملف جاهز للإرسال' : 'بەڵگەنامەکە ئامادەیە'}
                  </span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">{t.kyc.uploadTitle}</span>
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">{t.kyc.uploadSubtitle}</p>
                </>
              )}
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold h-11 shadow-md shadow-emerald-500/10 rounded-xl transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t.kyc.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
