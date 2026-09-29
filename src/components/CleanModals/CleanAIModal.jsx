import React, { useState, useRef, useEffect } from 'react';
import CleanModalFrame from './CleanModalFrame';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

const QUICK_PROMPTS = [
  'Explain the FaceGate ArcFace architecture & latency',
  'How does EProcMon scrape 150+ BUMN portals reliably?',
  'What is Adrian\'s primary tech stack and experience?',
  'How do I contact Adrian for senior engineering roles?',
];

const KNOWLEDGE_BASE = {
  facegate: `FaceGate is Adrian's production biometric access control system. It utilizes ArcFace 512-dimensional embeddings with cosine similarity search across a 10,000+ identity gallery. 
Key architectural highlights:
• Latency: <280ms end-to-end inference per frame.
• Accuracy: 99.82% Top-1 verification rate on benchmark datasets.
• Video Pipeline: Asynchronous RTSP stream decoding using OpenCV and custom ring-buffers.
• Deployment: Containerized with Docker and optimized with TensorRT on NVIDIA Jetson / GPU edge servers.`,

  eprocmon: `EProcMon is an enterprise tender monitoring orchestrator monitoring 150+ Indonesian BUMN and state procurement portals.
Key architectural highlights:
• Resilient Scraping: Playwright headless browser pool with TLS fingerprinting and stealth anti-bot bypass.
• Distributed Workers: Celery/Redis queue distributing scrape tasks across rotating IP proxies.
• Data Normalization: Automated deduplication and schema normalization into PostgreSQL with TimescaleDB indexing.
• Alerting: Real-time Telegram and email notifications for high-value tenders.`,

  stack: `Adrian is a Senior Software Engineer specializing in:
• AI & Computer Vision: PyTorch, ArcFace, OpenCV, TensorRT, YOLOv8, MediaPipe.
• High-Concurrency Backends: Go (Golang), Python (AsyncIO/FastAPI), Node.js.
• Databases & Queues: PostgreSQL, Redis, RabbitMQ, TimescaleDB.
• 3D & Creative Web: Three.js, WebGL, React, Tailwind CSS.
• Infrastructure: Docker, Linux VPS, Nginx, CI/CD, Systemd.`,

  contact: `You can reach Adrian directly via:
• Email: adrian.tri.setiawan@gmail.com
• GitHub: https://github.com/adriansetiawan
• LinkedIn: https://linkedin.com/in/adrian-tri-setiawan
• Telegram: https://t.me/adriansetiawan`,
};

export default function CleanAIModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Greetings traveler! I am Lady Lunaria, Adrian\'s autonomous AI companion. Ask me anything about Adrian\'s systems architecture, computer vision models, or backend engineering.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    audio.playClick();
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('facegate') || lower.includes('arcface') || lower.includes('latency') || lower.includes('vision')) {
        reply = KNOWLEDGE_BASE.facegate;
      } else if (lower.includes('eprocmon') || lower.includes('bumn') || lower.includes('scrap') || lower.includes('tender')) {
        reply = KNOWLEDGE_BASE.eprocmon;
      } else if (lower.includes('stack') || lower.includes('skill') || lower.includes('tech') || lower.includes('experience')) {
        reply = KNOWLEDGE_BASE.stack;
      } else if (lower.includes('contact') || lower.includes('reach') || lower.includes('hire') || lower.includes('email')) {
        reply = KNOWLEDGE_BASE.contact;
      } else {
        reply = `Adrian is a Senior Software Engineer & AI Specialist with extensive production experience building high-performance systems like FaceGate (ArcFace biometric vision) and EProcMon (150+ tender scrapers). Feel free to ask specifically about his computer vision pipelines, Go/Python backends, or contact details!`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <CleanModalFrame
      stationTag="AI COMPANION SHRINE"
      title="Lady Lunaria Core"
      accentColor="#8B5CF6"
      maxWidth="max-w-3xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col overflow-hidden min-h-[480px] bg-[#FFFDF9]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                    isUser ? 'bg-[#3B82F6]' : 'bg-[#8B5CF6]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#3B82F6] text-white rounded-tr-xs shadow-xs'
                      : 'bg-[#FAF6F0] text-[#37281D] border border-[#ede3d7] rounded-tl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#ede3d7] flex items-center gap-1.5 text-xs text-[#8a7260]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse delay-200" />
                <span className="font-mono ml-1">Consulting knowledge graph...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-5 py-2.5 border-t border-[#f0e7dd] bg-[#FAF6F0]/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#F4ECE2] border border-[#decbb8] text-[11px] text-[#5c4432] whitespace-nowrap transition shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#f0e7dd] bg-[#FFFDF9] flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Ask Lady Lunaria about Adrian's systems..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF6F0] border border-[#ede3d7] text-xs sm:text-sm text-[#37281D] placeholder-[#a8907e] focus:outline-none focus:border-[#8B5CF6] focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#8B5CF6] hover:bg-[#7c4ce0] disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </CleanModalFrame>
  );
}
