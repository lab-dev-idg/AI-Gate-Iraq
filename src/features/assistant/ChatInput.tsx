import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder: string;
  footerText: string;
}

export const ChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  placeholder,
  footerText,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 shrink-0 w-full max-w-full pb-[env(safe-area-inset-bottom)] sm:pb-5">
      <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ps-4 pe-14 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          dir="rtl"
        />
        <Button 
          onClick={onSend} 
          disabled={isLoading || !input.trim()}
          className="absolute end-1.5 h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 transition-all active:scale-95"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 md:mt-3.5 uppercase tracking-widest font-black opacity-80 hidden xs:block">
        {footerText}
      </p>
    </div>
  );
};

export default ChatInput;
