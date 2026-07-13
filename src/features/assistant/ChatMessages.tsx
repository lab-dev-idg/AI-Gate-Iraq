import { Bot, GitBranch, Loader2, Maximize2, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/src/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  lang: 'ku' | 'ar' | 'en';
  t: any;
  onSelectMessage: (msg: Message) => void;
  onEditMessage?: (msg: Message, index: number) => void;
  onBranchFromMessage?: (msg: Message, index: number) => void;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
}

const label = (lang: 'ku' | 'ar' | 'en', ku: string, ar: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : ku;

export const ChatMessages = ({ messages, isLoading, lang, onSelectMessage, onBranchFromMessage, chatScrollRef }: ChatMessagesProps) => (
  <div ref={chatScrollRef} className="chat-message-scroll min-h-0 flex-1 touch-pan-y overscroll-contain overflow-y-auto overflow-x-hidden bg-[#F6F8FB] px-3 py-4 [-webkit-overflow-scrolling:touch] dark:bg-[#091222] sm:px-4 sm:py-5 md:px-6">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-2">
      <div className="sticky top-0 z-10 flex justify-center px-1">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-black leading-5 text-slate-700 shadow-sm backdrop-blur dark:border-blue-500/40 dark:bg-[#111D31]/95 dark:text-blue-200 sm:text-xs">
          <Maximize2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
          <span>{label(lang, 'کلیک لە وەڵامی ڕاوێژکار بکە بۆ خوێندنەوەی گەورەتر.', 'اضغط على إجابة المساعد لقراءتها بحجم أكبر.', 'Click an assistant response to read it larger.')}</span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex w-full max-w-[94%] items-start gap-2.5 sm:max-w-[88%] md:max-w-[80%] ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar className={`mt-1 h-9 w-9 shrink-0 border shadow-sm ${isUser ? 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800' : 'border-blue-300/50 bg-[#14345F]'}`}>
                  {isUser ? <AvatarFallback className="bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200"><User className="h-4 w-4" /></AvatarFallback> : <><AvatarImage src="/bot-icon.png" /><AvatarFallback className="bg-[#14345F] text-white"><Bot className="h-4 w-4" /></AvatarFallback></>}
                </Avatar>
                <div
                  onClick={() => !isUser && onSelectMessage(message)}
                  role={!isUser ? 'button' : undefined}
                  tabIndex={!isUser ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (!isUser && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      onSelectMessage(message);
                    }
                  }}
                  aria-label={!isUser ? label(lang, 'کردنەوەی وەڵام بە قەبارەی گەورەتر', 'فتح الإجابة بحجم أكبر', 'Open response in a larger view') : undefined}
                  className={`group min-w-0 flex-1 rounded-2xl border px-4 py-3.5 shadow-sm ${isUser ? 'chat-bubble-user rounded-tr-md border-slate-200 bg-white text-slate-900 shadow-slate-200/70 dark:border-slate-700 dark:bg-[#111D31] dark:text-slate-100' : 'chat-bubble-assistant cursor-pointer rounded-tl-md border-[#214B82] bg-[#102B4E] text-white shadow-slate-300/60 transition hover:border-sky-300/80 hover:bg-[#12345F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F8FB] dark:focus-visible:ring-offset-[#091222]'}`}
                >
                  {!isUser && (
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black text-sky-100/90">
                      <Maximize2 className="h-3 w-3 transition-transform group-hover:scale-110" aria-hidden="true" />
                      <span>{label(lang, 'کردنەوە', 'تكبير', 'Expand')}</span>
                    </div>
                  )}
                  <div className={`chat-markdown prose prose-sm max-w-none break-words text-[15px] leading-8 ${isUser ? 'chat-markdown-user' : 'chat-markdown-assistant prose-invert'}`}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`block text-[10px] font-medium ${isUser ? 'text-slate-500 dark:text-slate-400' : 'text-sky-100/70'}`}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isUser && onBranchFromMessage && index > 0 && (
                      <button type="button" onClick={(event) => { event.stopPropagation(); onBranchFromMessage(message, index); }} className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300">
                        <GitBranch className="h-3 w-3" />
                        {label(lang, 'لقی گفتوگۆ', 'فرع المحادثة', 'Branch chat')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {isLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end"><div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Loader2 className="h-4 w-4 animate-spin" /><span>{label(lang, 'خەریکی شیکردنەوەی داواکارییەکەیە...', 'جارٍ تحليل الطلب...', 'Analyzing your request...')}</span></div></motion.div>}
    </div>
  </div>
);

export default ChatMessages;
