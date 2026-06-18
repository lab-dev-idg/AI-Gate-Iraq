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

export const AssistantWorkspace = (props: AssistantWorkspaceProps) => {
  const { lang, t, chatScope, setChatScope, messages, input, setInput, isLoading, onSend, onSelectMessage, chatScrollRef, promptChips } = props;
  const footerText = `AI Gate Iraq • 2026`;

  return (
    <Card className="flex min-h-[calc(100dvh-210px)] w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-[#0E1728] lg:min-h-0 lg:h-full">
      <div className="flex shrink-0 flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-[#111D31] sm:flex-row sm:items-center sm:justify-between md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center gap-2 text-base font-black leading-tight text-slate-900 dark:text-white md:text-lg">
              {lang === 'ar' ? 'مستشار الأعمال واللوجستيات الذكي' : 'ڕاوێژکاری لۆجیستی و بازرگانی زیرەک'}
              {chatScope !== 'assistant' && <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-300">{getServiceName(chatScope, lang)}</span>}
            </h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
              {lang === 'ar' ? `جاهز لمساعدتك في: ${getServiceName(chatScope, 'ar')}` : `ئامادەیە بۆ یارمەتیدانت لە: ${getServiceName(chatScope, 'ku')}`}
            </p>
          </div>
        </div>
        <select value={chatScope} onChange={event => setChatScope(event.target.value as ServiceKey)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-black text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-[#091222] dark:text-slate-100 sm:w-auto sm:min-w-[190px]">
          {SERVICES.filter(service => service.key !== 'inquiry').map(service => <option key={service.key} value={service.key}>{lang === 'ar' ? service.label_ar : service.label_ku}</option>)}
        </select>
      </div>

      <ChatMessages messages={messages} isLoading={isLoading} lang={lang} t={t} onSelectMessage={onSelectMessage} chatScrollRef={chatScrollRef} />
      <PromptChips chips={promptChips} onChipClick={onSend} />
      <ChatInput input={input} setInput={setInput} onSend={overridePrompt => onSend(overridePrompt)} isLoading={isLoading} placeholder={t.chat.placeholder} footerText={footerText} lang={lang} />
    </Card>
  );
};

export default AssistantWorkspace;
