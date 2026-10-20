import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  Scale,
  Check
} from 'lucide-react';
import { Property } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';
import { chatWithAiAdvisor } from '../lib/geminiClient';

interface AiAdvisorWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  properties: Property[];
  currency: Currency;
  onSelectProperty: (p: Property) => void;
  onOpenConsultation: () => void;
  currentPropertyContext?: Property | null;
  comparePropertyIds?: string[];
  onToggleCompare?: (property: Property, e: React.MouseEvent) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  recommendedProperties?: Property[];
  clarifyingQuestion?: string | null;
  suggestedQuestions?: string[];
  showContactAgentOption?: boolean;
  isAiGrounded?: boolean;
  error?: boolean;
}

export const AiAdvisorWidget: React.FC<AiAdvisorWidgetProps> = ({
  isOpen,
  onToggle,
  properties,
  currency,
  onSelectProperty,
  onOpenConsultation,
  currentPropertyContext,
  comparePropertyIds = [],
  onToggleCompare,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      text: "Marhaba. Welcome to HS ESTATE Private Advisory. I am your Dubai luxury property specialist grounded in our live database of trophy residences.\n\nHow may I assist your portfolio today? You may ask about specific areas, yields, Golden Visa eligibility, or request property comparisons.",
      time: 'Just now',
      suggestedQuestions: [
        "Beachfront villas on Palm Jumeirah",
        "What is the UAE Golden Visa threshold?",
        "Compare rental yields in Downtown vs Marina",
        "Show penthouses with Burj Khalifa views",
      ],
      isAiGrounded: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggested, setActiveSuggested] = useState<string[]>([
    "Beachfront villas on Palm Jumeirah",
    "What is the UAE Golden Visa threshold?",
    "Compare rental yields in Downtown vs Marina",
    "Show penthouses with Burj Khalifa views",
  ]);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    setLastFailedMessage(null);
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Build chat history for Gemini multi-turn context
    const historyPayload = messages
      .filter((m) => !m.error)
      .slice(-6)
      .map((m) => ({
        role: (m.sender === 'ai' ? 'model' : 'user') as 'model' | 'user',
        text: m.text,
      }));

    try {
      // Real server-side Gemini AI conversation
      const result = await chatWithAiAdvisor(
        text,
        historyPayload,
        currentPropertyContext?.id
      );

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: result.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProperties: result.matchedProperties && result.matchedProperties.length > 0
          ? result.matchedProperties
          : undefined,
        clarifyingQuestion: result.clarifyingQuestion,
        suggestedQuestions: result.suggestedQuestions,
        showContactAgentOption: result.showContactAgentOption,
        isAiGrounded: result.isAiGrounded,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (result.suggestedQuestions && result.suggestedQuestions.length > 0) {
        setActiveSuggested(result.suggestedQuestions);
      }
    } catch (err: any) {
      console.warn('AI Advisor call failed, rendering graceful retry state:', err);
      setLastFailedMessage(text);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: "I experienced a brief connection interruption with the Dubai intelligence engine. You can retry immediately or connect directly with our Senior Advisory Desk.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
        showContactAgentOption: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSend(lastFailedMessage);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#0B1220] hover:bg-[#111C30] border border-[#C8A96B] text-white px-4 py-3 shadow-2xl transition-all hover:scale-105 group"
        aria-label="Open HS ESTATE AI Property Advisor"
      >
        <div className="w-8 h-8 rounded-full bg-[#C8A96B] flex items-center justify-center text-[#0B1220] font-bold">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFC58E] block">AI Advisor</span>
          <span className="text-xs font-semibold text-white">Private Desk</span>
        </div>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[640px] h-[580px] bg-[#0B1220] border border-[#C8A96B]/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#111C30] border-b border-[#C8A96B]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#C8A96B] bg-[#0B1220] flex items-center justify-center text-[#C8A96B]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-white tracking-wide">HS ESTATE AI Advisor</h4>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#DFC58E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Grounded in Dubai Verified Catalog</span>
                </div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Advisor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner if viewing specific property */}
          {currentPropertyContext && (
            <div className="px-4 py-2 bg-[#0B1220] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate">
                Active Context: <strong className="text-white">{currentPropertyContext.title}</strong>
              </span>
              <span className="text-[#DFC58E] font-mono shrink-0 ml-2">
                {formatCurrency(currentPropertyContext.priceAed, currency)}
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1220]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 shrink-0 border border-[#C8A96B]/40 bg-[#111C30] flex items-center justify-center text-[#C8A96B] mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[88%] ${msg.sender === 'user' ? 'bg-[#C8A96B] text-[#0B1220]' : 'bg-[#111C30] border border-slate-800 text-slate-200'} p-3.5 text-xs leading-relaxed`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Clarifying Question callout */}
                  {msg.clarifyingQuestion && (
                    <div className="mt-3 p-2.5 bg-[#0B1220] border border-[#C8A96B]/50 flex items-start gap-2 text-[#DFC58E]">
                      <HelpCircle className="w-3.5 h-3.5 text-[#C8A96B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
                          Advisor Clarification:
                        </span>
                        <span className="text-xs text-white">{msg.clarifyingQuestion}</span>
                      </div>
                    </div>
                  )}

                  {/* Property Card recommendations inside AI chat */}
                  {msg.recommendedProperties && msg.recommendedProperties.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#DFC58E] block">
                        Verified Matching Residences:
                      </span>
                      {msg.recommendedProperties.map((p) => {
                        const isComparing = comparePropertyIds.includes(p.id);

                        return (
                          <div
                            key={p.id}
                            className="p-2.5 bg-[#0B1220] border border-slate-700 hover:border-[#C8A96B] flex flex-col gap-2 transition-all"
                          >
                            <div
                              onClick={() => {
                                onSelectProperty(p);
                                onToggle();
                              }}
                              className="flex items-center gap-2.5 cursor-pointer group"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-14 h-14 object-cover shrink-0 border border-slate-700"
                              />
                              <div className="overflow-hidden flex-1">
                                <h5 className="font-serif font-bold text-white text-[11px] truncate group-hover:text-[#DFC58E]">
                                  {p.title}
                                </h5>
                                <p className="text-[10px] text-slate-400 truncate">{p.neighborhood} · {p.bedrooms} Beds</p>
                                <span className="text-[11px] font-mono text-[#DFC58E] font-bold tabular-nums">
                                  {formatCurrency(p.priceAed, currency)}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C8A96B] shrink-0" />
                            </div>

                            {/* Comparison & Details action row */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                              {onToggleCompare && (
                                <button
                                  type="button"
                                  onClick={(e) => onToggleCompare(p, e)}
                                  className={`px-2 py-0.5 font-mono uppercase tracking-wider flex items-center gap-1 border transition-colors ${
                                    isComparing
                                      ? 'bg-[#C8A96B] text-[#0B1220] border-[#C8A96B]'
                                      : 'bg-[#111C30] text-slate-300 border-slate-700 hover:border-[#C8A96B]'
                                  }`}
                                >
                                  {isComparing ? <Check className="w-2.5 h-2.5" /> : <Scale className="w-2.5 h-2.5" />}
                                  <span>{isComparing ? 'Comparing' : '+ Compare'}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  onSelectProperty(p);
                                  onToggle();
                                }}
                                className="text-[#DFC58E] hover:underline font-mono"
                              >
                                View Specs →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Contact Agent Option */}
                  {msg.showContactAgentOption && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenConsultation();
                          onToggle();
                        }}
                        className="w-full py-2 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Schedule Consultation with Alexander Sterling</span>
                      </button>
                    </div>
                  )}

                  {/* Error Retry Option */}
                  {msg.error && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="text-xs text-[#DFC58E] hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry Query</span>
                      </button>
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-[#0B1220]/70' : 'text-slate-500'} font-mono`}>
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 shrink-0 bg-[#C8A96B] flex items-center justify-center text-[#0B1220] mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-7 h-7 shrink-0 border border-[#C8A96B]/40 bg-[#111C30] flex items-center justify-center text-[#C8A96B]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="italic">HS Advisor analyzing Dubai verified database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-2 bg-[#111C30] border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {activeSuggested.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="whitespace-nowrap shrink-0 text-[11px] px-2.5 py-1 bg-[#0B1220] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-[#DFC58E] hover:border-[#C8A96B]/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#0B1220] border-t border-[#C8A96B]/30 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about properties, compare yields, or request viewings..."
              className="flex-1 bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-3.5 bg-[#C8A96B] hover:bg-[#DFC58E] disabled:opacity-40 text-[#0B1220] transition-colors flex items-center justify-center"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
