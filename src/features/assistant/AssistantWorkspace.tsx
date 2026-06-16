import { Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SERVICES, getServiceName, ServiceKey } from '@/src/lib/services';
import { Message } from '@/src/types/chat';
import ChatMessages from './ChatMessages';
import PromptChips from './PromptChips';
import ChatInput from './ChatInput';

interface AssistantWorkspaceProps {
  lang: 'ku' | 'ar';
  t: any;
  chatScope: ServiceKey;
  setChatScope: (scope: ServiceKey) => void;
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  onSend: (overridePrompt?: string) => void;
  onSelectMessage: (msg: Message) => void;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
  promptChips: { label: string; prompt: string }[];
}

export const AssistantWorkspace = ({
  lang,
  t,
  chatScope,
  setChatScope,
  messages,
  input,
  setInput,
  isLoading,
  onSend,
  onSelectMessage,
  chatScrollRef,
  promptChips,
}: AssistantWorkspaceProps) => {
  const footerText = `AI Gate Iraq • 2026 • ${
    lang === 'ar' ? 'البوابة الوطنية للتجارة والأعمال' : 'سەکۆی نیشتمانی بۆ بازرگانی و کار'
  }`;

  return (
    <Card className="flex-1 flex flex-col min-h-[calc(100svh-170px)] lg:min-h-0 min-w-0 w-full max-w-full overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-white dark:bg-slate-900/30 rounded-2xl h-full">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shrink-0 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <Bot className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-850 dark:text-white font-arabic flex items-center flex-wrap gap-1.5 leading-tight min-w-0 break-words">
              {lang === 'ar' ? 'مستشار الأعمال واللوجستيات الذكي' : 'ڕاوێژکاری لۆجیستی و بازرگانی زیرەک'}
              {chatScope !== 'assistant' && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 whitespace-nowrap shrink-0">
                  {getServiceName(chatScope, lang)}
                </span>
              )}
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed break-words">
              {lang === 'ar'
                ? `مستشار الذكاء الاصطناعي مستعد لمساعدتك في: ${getServiceName(chatScope, 'ar')}`
                : `ڕاوێژکاری زیرەک ئامادەیە بۆ یارمەتیدانت لە: ${getServiceName(chatScope, 'ku')}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-arabic shrink-0 self-end sm:self-center max-w-full">
          <span className="text-[10px] text-slate-400 font-black hidden sm:inline whitespace-nowrap">
            {lang === 'ar' ? 'التركيز:' : 'تیشکۆ:'}
          </span>
          <select
            value={chatScope}
            onChange={(e) => setChatScope(e.target.value as ServiceKey)}
            className="h-9 max-w-[180px] text-[10px] font-black border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-900 cursor-pointer text-slate-700 dark:text-slate-200 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 transition-colors"
          >
            {SERVICES.map((srv) => (
              <option key={srv.key} value={srv.key}>
                {lang === 'ar' ? srv.label_ar : srv.label_ku}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        lang={lang}
        t={t}
        onSelectMessage={onSelectMessage}
        chatScrollRef={chatScrollRef}
      />

      <PromptChips
        chips={promptChips}
        onChipClick={onSend}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => onSend()}
        isLoading={isLoading}
        placeholder={t.chat.placeholder}
        footerText={footerText}
      />
    </Card>
  );
};

export default AssistantWorkspace;