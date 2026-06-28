import { Bot, GitBranch, Loader2, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/src/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  lang: 'ku' | 'ar';
  t: any;
  onSelectMessage: (msg: Message) => void;
  onEditMessage?: (msg: Message, index: number) => void;
  onBranchFromMessage?: (msg: Message, index: number) => void;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = ({ messages, isLoading, lang, onSelectMessage, onBranchFromMessage, chatScrollRef }: ChatMessagesProps) => (
  <div
    ref={chatScrollRef}
    className="chat-message-scroll min-h-0 flex-1 touch-pan-y overscroll-contain overflow-y-auto overflow-x-hidden bg-slate-50/60 px-3 py-4 [-webkit-overflow-scrolling:touch] dark:bg-[#091222] sm:px-4 sm:py-5 md:px-6"
  >
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-2">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex w-full max-w-[92%] items-start gap-2.5 sm:max-w-[86%] md:max-w-[78%] ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar className={`mt-1 h-9 w-9 shrink-0 border shadow-sm ${isUser ? 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800' : 'border-primary/30 bg-primary'}`}>
                  {isUser ? <AvatarFallback className="bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200"><User className="h-4 w-4" /></AvatarFallback> : <><AvatarImage src="/bot-icon.png" /><AvatarFallback className="bg-primary text-white"><Bot className="h-4 w-4" /></AvatarFallback></>}
                </Avatar>
                <div onClick={() => !isUser && onSelectMessage(message)} className={`min-w-0 flex-1 rounded-2xl border px-4 py-3.5 shadow-sm ${isUser ? 'rounded-tr-md border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-[#111D31] dark:text-slate-100' : 'cursor-pointer rounded-tl-md border-blue-500/30 bg-[#123B78] text-white hover:bg-[#174687]'}`}>
                  <div className={`prose prose-sm max-w-none break-words leading-7 ${isUser ? 'text-slate-900 dark:prose-invert dark:text-slate-100' : 'prose-invert text-white'}`}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`block text-[10px] font-medium ${isUser ? 'text-slate-500 dark:text-slate-400' : 'text-white/65'}`}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isUser && onBranchFromMessage && index > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onBranchFromMessage(message, index);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
                      >
                        <GitBranch className="h-3 w-3" />
                        {lang === 'ar' ? 'فرع المحادثة' : 'لقی گفتوگۆ'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {isLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end"><div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Loader2 className="h-4 w-4 animate-spin" /><span>{lang === 'ar' ? 'جارٍ تحليل الطلب...' : 'خەریکی شیکردنەوەی داواکارییەکەیە...'}</span></div></motion.div>}
    </div>
  </div>
);

export default ChatMessages;
