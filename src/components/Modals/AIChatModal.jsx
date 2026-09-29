import React, { useState, useEffect, useRef } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
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
        'Greetings, Traveler! I am Lunaria, the Celestial AI familiar of the Sanctuary. Ask me anything about Adrian’s engineering projects, computer vision architecture, or tech stack!',
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
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
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
                // partial chunk
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
            "Adrian is a Fullstack & AI R&D Engineer specializing in Computer Vision (OpenCV, PyTorch), high-throughput FastAPI/Python microservices, modern React/Vue web systems, and autonomous agent systems. You can reach him directly at adriansetiawan26@gmail.com!",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <ShrineModalFrame
      stationTag="AI COMPANION SHRINE // LADY LUNARIA"
      accentColor="purple"
      maxWidth="max-w-3xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col overflow-hidden min-h-[440px]">
        {/* Chat History Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-br-sm shadow-md font-sans'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm font-sans'
                  }`}
                >
                  {!isUser && !msg.content && isStreaming ? (
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono py-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Channeling neural response from Lunaria...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
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
          <div className="px-5 py-2 flex flex-wrap gap-1.5 border-t border-slate-800/60 bg-slate-950/60">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isStreaming}
                className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/30 transition text-left"
              >
                ✦ {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isStreaming
                ? 'Lunaria is channeling thoughts...'
                : 'Ask Lunaria about Adrian’s engineering, stack, or experience...'
            }
            disabled={isStreaming}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-400 transition font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-mono text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </ShrineModalFrame>
  );
}
