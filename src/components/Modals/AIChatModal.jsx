import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

const STARTER_PROMPTS = [
  'Tell me about FaceGate and how the CV pipeline works.',
  'What is Adrian’s technical stack and background?',
  'How was EProcMon built for BUMN tenders?',
  'Can Adrian build a custom AI or fullstack system for me?',
];

export default function AIChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Greetings, wanderer! I am Lady Lunaria, Adrian’s AI companion for this celestial tavern. Ask me anything about his engineering projects, machine learning research, or technical stack.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isStreaming) return;

    audio.playClick();
    const userMsg = { role: 'user', content: textToSend.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsStreaming(true);

    // Placeholder for assistant response
    const assistantMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      // Primary endpoint is /api/portfolio-chat, fallback to /api/chat
      let response = await fetch('/api/portfolio-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend.trim(), sessionId }),
      });

      if (!response.ok && response.status === 404) {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend.trim(), sessionId }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                      role: 'assistant',
                      content: accumulatedText,
                    };
                    return next;
                  });
                }
              } catch (e) {
                // not JSON or partial chunk
              }
            }
          }
        }
      }

      audio.playZoneChime();
    } catch (err) {
      console.warn('AI Chat request error, applying fallback:', err);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content:
            "Adrian is a Fullstack & AI R&D Engineer specializing in Computer Vision, FastAPI/Python, modern React/Vue web systems, and autonomous agent systems. You can reach him directly at adriansetiawan26@gmail.com!",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl h-[85vh] bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-[0_0_50px_rgba(157,78,221,0.2)] flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Lady Lunaria</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-slate-400">Connected to Adrian's Portfolio Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content || (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts */}
        {messages.length <= 2 && (
          <div className="px-5 py-2 flex flex-wrap gap-1.5 border-t border-slate-800/60 bg-slate-950/20">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isStreaming}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isStreaming ? 'Lunaria is responding...' : 'Ask Lunaria about Adrian’s work...'}
            disabled={isStreaming}
            className="flex-1 bg-slate-800/70 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-400/80 transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shadow-md transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
