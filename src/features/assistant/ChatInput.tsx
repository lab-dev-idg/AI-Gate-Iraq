import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (overridePrompt?: string) => void;
  isLoading: boolean;
  placeholder: string;
  footerText: string;
  lang: 'ku' | 'ar';
}

export const ChatInput = ({ input, setInput, onSend, isLoading, placeholder, footerText, lang }: ChatInputProps) => {
  const send = () => {
    const value = input.trim();
    if (!value || isLoading) return;
    onSend(value);
  };

  return (
    <div className="sticky bottom-0 z-20 w-full shrink-0 border-t border-slate-200 bg-white/95 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0E1728]/95 sm:px-4 md:px-5">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Input
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={placeholder}
            dir="rtl"
            className="h-12 rounded-2xl border-slate-300 bg-slate-50 ps-4 pe-14 text-[15px] font-semibold text-slate-900 placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#111D31] dark:text-white dark:placeholder:text-slate-400"
          />
          <Button
            type="button"
            size="icon"
            onClick={send}
            disabled={isLoading || !input.trim()}
            className="absolute end-1.5 top-1.5 h-9 w-9 rounded-xl bg-emerald-500 text-slate-950 shadow-md hover:bg-emerald-400 disabled:opacity-40"
            aria-label={lang === 'ar' ? 'إرسال' : 'ناردن'}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mx-auto mt-2 hidden max-w-5xl text-center text-[10px] font-bold tracking-wide text-slate-500 dark:text-slate-400 sm:block">{footerText}</p>
    </div>
  );
};

export default ChatInput;
