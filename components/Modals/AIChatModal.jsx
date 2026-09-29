import React, { useState, useEffect, useRef } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import { Send, Bot, User, Sparkles, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

const STARTER_PROMPTS = [
  'Explain FaceGate’s RTSP ingestion, anti-spoofing heuristics, and pgvector cosine search.',
  'How was EProcMon designed to reliably monitor 150+ Indonesian BUMN tender portals?',
  'What is Adrian’s technical stack for real-time computer vision and asynchronous backends?',
  'What architecture did Adrian use for the industrial manufacturing procurement suite?',
];

export default function AIChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am Lunaria, the AI conversational assistant for Adrian’s portfolio. You can query me on Adrian’s computer vision pipelines (FaceGate), automated crawler architectures (EProcMon), microservices (FastAPI/Bun), or fullstack 3D systems.',
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
      console.warn('AI Chat request fallback:', err);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content:
            "Adrian Tri Setiawan is a Fullstack & AI R&D Engineer specializing in Computer Vision (OpenCV, 512D ArcFace embeddings, pgvector), high-throughput FastAPI/Python & Bun/Elysia microservices, modern reactive frontends (React, SvelteKit, Vue 3, Three.js), and autonomous web crawlers. Direct inquiries can be sent to adriansetiawan26@gmail.com!",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <ShrineModalFrame
      stationTag="AI COMPANION // LUNARIA STREAMING ENGINE"
      accentColor="purple"
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/70 min-h-[500px]">
        {/* Curated Technical Prompt Chips */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>Curated Engineering Queries:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isStreaming}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs font-mono text-slate-300 hover:text-purple-200 transition-colors disabled:opacity-50 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs sm:text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0 text-purple-300">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-xl border leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-100'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-1.5 text-purple-300 animate-pulse font-mono text-xs">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Streaming response...
                  </span>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Query technical details, system architecture, or tech stack..."
            disabled={isStreaming}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </ShrineModalFrame>
  );
}
