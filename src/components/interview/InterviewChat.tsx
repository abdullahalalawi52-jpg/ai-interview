import React, { FormEvent, RefObject } from "react";
import Link from "next/link";
import { Mic, MicOff, Send, Bot, Trophy, User, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { InterviewConfig } from "@/types/interview";
import { UIMessage as Message } from "ai";

const MessageBubble = React.memo(({ message }: { message: Message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-3xl p-5 shadow-sm ${message.role === 'user' ? 'bg-primary text-on-primary rounded-br-sm' : 'bg-surface text-on-surface border border-outline-variant/50 rounded-bl-sm'}`}>
        {message.parts?.filter((p) => p.type === 'text').map((p, i) => {
          const textContent = (p as { text: string }).text;
          const displayText = message.role === 'assistant' ? textContent.replace(/\[CODE\]|\[END_INTERVIEW\]/g, '') : textContent;
          return (
            <p key={i} className="font-body-lg leading-relaxed whitespace-pre-wrap text-start">{displayText}</p>
          );
        })}
      </div>
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface InterviewChatProps {
  config: InterviewConfig;
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isFinished: boolean;
  elapsedTime: number;
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  toggleListening: () => void;
  formatTime: (seconds: number) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  interviewId: string | null;
}

export default function InterviewChat({
  config,
  messages,
  isLoading,
  isListening,
  isFinished,
  elapsedTime,
  input,
  setInput,
  onSubmit,
  toggleListening,
  formatTime,
  messagesEndRef,
  interviewId
}: InterviewChatProps) {
  const { t } = useLanguage();

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const textPart = lastAssistantMsg?.parts?.find(p => p.type === 'text');
  const lastAssistantText = (textPart && 'text' in textPart ? String(textPart.text) : "") || "";
  const requiresCode = config.interviewType === 'technical' && (lastAssistantText.includes('[CODE]') || lastAssistantText.includes('```'));

  return (
    <div className={`flex flex-col lg:flex-row w-full h-full gap-4 ${requiresCode ? 'max-w-[90rem]' : 'max-w-[64rem]'}`}>
      
      {/* Code Editor for Technical Interviews */}
      {requiresCode && (
        <div className="hidden lg:flex flex-col w-1/2 bg-[#1e1e1e] rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant/30">
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-[#404040]">
            <div className="text-gray-300 font-mono text-sm font-bold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ms-2 text-xs">solution.js</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue={`// ${t("interview.codeEditorTitle")}\n\nfunction solveProblem() {\n  \n}\n`}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 16,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                padding: { top: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth"
              }}
            />
          </div>
        </div>
      )}

      <div className={`flex flex-col h-full gap-4 ${requiresCode ? 'w-full lg:w-1/2' : 'w-full'}`}>
        {/* Video Call UI Simulation */}
        <div className="flex-none grid grid-cols-2 gap-4 h-48 sm:h-64 mb-2">
          {/* AI Avatar */}
          <div className="relative bg-surface-container-high rounded-3xl overflow-hidden flex items-center justify-center shadow-inner border border-outline-variant/30">
            <div className={`absolute top-4 start-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-on-surface ${isLoading ? 'border border-primary text-primary' : ''}`}>
              <Bot className="w-3 h-3" />
              {t("interview.chat.aiName")}
            </div>
            {isLoading ? (
                <div className="flex gap-2">
                  <span className="w-3 h-12 bg-primary rounded-full animate-pulse"></span>
                  <span className="w-3 h-16 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-3 h-10 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-3 h-14 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></span>
                </div>
            ) : (
              <Bot className="w-24 h-24 text-primary/30" />
            )}
          </div>

          {/* User Avatar */}
          <div className="relative bg-surface-container-highest rounded-3xl overflow-hidden flex items-center justify-center shadow-inner border border-outline-variant/30">
            <div className="absolute top-4 start-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-on-surface">
              <User className="w-3 h-3" />
              {t("interview.chat.you")}
            </div>
            <div className="absolute top-4 end-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-on-surface">
              <Clock className="w-3 h-3" />
              {formatTime(elapsedTime)}
            </div>
            {isListening ? (
                <div className="w-24 h-24 bg-error/20 rounded-3xl flex items-center justify-center animate-pulse">
                  <Mic className="w-12 h-12 text-error" />
                </div>
            ) : (
              <User className="w-24 h-24 text-on-surface-variant/30" />
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-surface/80 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.filter(m => {
              const textPart = m.parts?.find((p: { type: string }) => p.type === 'text') as { type: 'text', text: string } | undefined;
              return m.role !== 'system' && (!textPart || (!textPart.text.includes(t("defaults.readyToStart"))));
            }).map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface text-on-surface border border-outline-variant/50 rounded-3xl rounded-bl-sm p-5 shadow-sm flex gap-2 items-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!isFinished ? (
            <div className="p-4 bg-surface/90 border-t border-outline-variant/30 backdrop-blur-sm">
              <form onSubmit={onSubmit} className="flex gap-3 items-end max-w-[56rem] mx-auto">
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? t("interview.chat.micStop") : t("interview.chat.micStart")}
                  className={`p-4 rounded-2xl flex-shrink-0 transition-all duration-300 shadow-sm ${isListening ? 'bg-error text-on-error animate-pulse shadow-[0_0_15px_rgba(186,26,26,0.5)]' : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 hover:shadow-md'}`}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? t("interview.chat.placeholderListening") : t("interview.chat.placeholderNormal")}
                    className={`w-full bg-surface-variant text-on-surface-variant p-4 pr-12 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-primary min-h-[60px] max-h-[150px] transition-all font-body-lg shadow-inner text-start ${isListening ? 'ring-2 ring-error/50' : ''}`}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) onSubmit(e as unknown as FormEvent<HTMLFormElement>);
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-4 rounded-2xl bg-primary text-on-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Send className="w-6 h-6 rtl:-scale-x-100" />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 bg-tertiary-container text-on-tertiary-container border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-start">
                <Trophy className="w-8 h-8 text-tertiary" />
                <div>
                  <h3 className="font-bold text-lg">{t("interview.finished.title")}</h3>
                  <p className="text-sm opacity-80">{t("interview.finished.desc")}</p>
                </div>
              </div>
              <Link href={interviewId ? `/gap-analyzer?interviewId=${interviewId}` : "#"} className={`px-6 py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg text-center ${interviewId ? 'bg-tertiary text-on-tertiary hover:bg-tertiary/90' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'}`}>
                {interviewId ? t("interview.finished.goToGap") : t("interview.finished.saving")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
