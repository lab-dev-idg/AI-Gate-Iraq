import { Loader2, Bot, User, MapPin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = ({
  messages,
  isLoading,
  lang,
  t,
  onSelectMessage,
  chatScrollRef,
}: ChatMessagesProps) => {
  return (
    <div
      ref={chatScrollRef}
      className="flex-1 min-h-[320px] lg:min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain chat-scroll p-3 sm:p-4 md:p-6 bg-slate-50/25 dark:bg-slate-950/25"
    >
      <div className="space-y-5 min-w-0 max-w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex min-w-0 max-w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-2 sm:gap-3 min-w-0 max-w-[94%] sm:max-w-[88%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar className={`hidden xs:flex w-8 h-8 mt-1 border shadow-sm shrink-0 ${msg.role === 'model' ? 'bg-primary border-primary/20' : 'bg-slate-100 border-slate-200'}`}>
                  {msg.role === 'model' ? (
                    <>
                      <AvatarImage src="/bot-icon.png" />
                      <AvatarFallback className="bg-primary text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="text-slate-500 bg-slate-50"><User className="w-4 h-4" /></AvatarFallback>
                  )}
                </Avatar>
                <div
                  onClick={() => msg.role === 'model' && onSelectMessage(msg)}
                  className={`group relative min-w-0 max-w-full p-3 sm:p-4 rounded-xl shadow-sm cursor-default ${
                    msg.role === 'model' ? 'cursor-pointer hover:shadow-md hover:scale-[1.005] transition-all duration-200' : ''
                  } ${
                    msg.role === 'user'
                      ? 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-200/40 dark:border-slate-800/80'
                      : 'bg-primary text-primary-foreground rounded-tl-none'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none min-w-0 break-words overflow-wrap-anywhere leading-relaxed ${msg.role === 'user' ? 'dark:prose-invert text-slate-800 dark:text-slate-100' : 'text-primary-foreground'}`}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20 space-y-2 min-w-0">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">{t.chat.sources}</p>
                      <div className="flex flex-wrap gap-2 min-w-0">
                        {msg.groundingChunks.map((chunk, i) => {
                          const web = chunk.web;
                          const maps = chunk.maps;
                          if (maps) {
                            return (
                              <a
                                key={i}
                                href={maps.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-colors max-w-full min-w-0"
                              >
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{maps.title || t.chat.viewMap}</span>
                              </a>
                            );
                          }
                          if (web) {
                            return (
                              <a
                                key={i}
                                href={web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-colors max-w-full min-w-0"
                              >
                                <Globe className="w-3 h-3 shrink-0" />
                                <span className="truncate">{web.title || t.chat.source}</span>
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                  <span className={`text-[10px] mt-2 block opacity-50 ${msg.role === 'user' ? 'text-slate-500' : 'text-primary-foreground'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pr-2 sm:pr-11 min-w-0">
            <div className="bg-emerald-500/10 p-3.5 rounded-2xl flex items-center gap-2.5 border border-emerald-500/20 shadow-sm max-w-full min-w-0">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-arabic animate-pulse leading-relaxed break-words">
                {lang === 'ar' ? 'تفكير ذكي... جاري تحليل ودراسة البيانات اللوجستية بالعراق' : 'بیرکردنەوەی ژیرانە... خەریکی شیکردنەوەی داتای لۆجیستییە لە عێراق'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;