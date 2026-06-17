import { useRef, useState } from 'react';
import { Send, Paperclip, X, FileText, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAdminFeatureFlagEnabled } from '@/src/admin/adminStore';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (overridePrompt?: string) => void;
  isLoading: boolean;
  placeholder: string;
  footerText: string;
  lang: 'ku' | 'ar';
}

export const ChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  placeholder,
  footerText,
  lang,
}: ChatInputProps) => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFileUploadEnabled = getAdminFeatureFlagEnabled('enable_file_upload', true);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendAction();
    }
  };

  const handleSendAction = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !attachment) return;

    let finalPrompt = trimmedInput;
    if (attachment) {
      throw new Error('FILE_UPLOAD_UNAVAILABLE');
    }

    onSend(finalPrompt);
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5 MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(
        lang === 'ar'
          ? 'حجم الملف يتجاوز الحد المسموح به (5 ميجابايت).'
          : 'قەبارەی فایلەکە لە ٥ مێگابایت زیاترە.'
      );
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    // Validate type
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(
        lang === 'ar'
          ? 'نوع الملف غير مدعوم في هذه التجربة (PNG, JPG, WEBP, PDF, TXT).'
          : 'جۆری فایلەکە پشتیوانی نەکراوە (PNG، JPG، WEBP، PDF، TXT).'
      );
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    setAttachment(file);
    setErrorMsg(null);
  };

  return (
    <div className="p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 shrink-0 w-full max-w-full pb-[env(safe-area-inset-bottom)] sm:pb-5">
      {/* File Validation Error Message Banner */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Attachment Chip Preview */}
      {attachment && (
        <div className="max-w-4xl mx-auto mb-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 col-span-1">
              {attachment.type.startsWith('image/') ? (
                <Image className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div className="text-left font-sans min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px] xs:max-w-xs md:max-w-md">
                {attachment.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {(attachment.size / 1024).toFixed(1)} KB • {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setAttachment(null)}
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
        {/* Hidden File Input element */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"
          className="hidden"
        />

        {/* Attachment Click Trigger Button */}
        {isFileUploadEnabled && (
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="h-12 w-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 p-0"
            title={lang === 'ar' ? 'إرفاق ملف' : 'هاوپێچکردنی فایل'}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        )}

        {/* Input & Send Action element */}
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ps-4 pe-14 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            dir="rtl"
          />
          <Button
            onClick={handleSendAction}
            disabled={isLoading || (!input.trim() && !attachment)}
            className="absolute end-1.5 top-1.5 h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 transition-all active:scale-95"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 md:mt-3.5 uppercase tracking-widest font-black opacity-80 hidden xs:block">
        {footerText}
      </p>
    </div>
  );
};

export default ChatInput;
