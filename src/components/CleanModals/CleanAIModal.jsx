import React, { useState, useRef, useEffect } from 'react';
import CleanModalFrame from './CleanModalFrame';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';
import projectsData from '../../../content/projects.json';
import profileData from '../../../content/profile.json';
const QUICK_PROMPTS = [
  'Tell me about the InsightFace attendance project',
  'Which projects are in the portfolio?',
  "Which technologies are in Adrian's profile?",
  'How can I contact Adrian for freelance work?',
];

const KNOWLEDGE_BASE = {
  profile: `Adrian is a ${profileData.role}. Based in ${profileData.base}, Indonesia. ${profileData.intro}`,
  stack: `Technologies listed in Adrian's profile: ${profileData.stack.join(', ')}.`,
  contact: `For freelance inquiries, contact Adrian at:
• Email: adriansetiawan26@gmail.com
• GitHub: https://github.com/AdrianTriSetiawan/
• LinkedIn: https://linkedin.com/in/adrian-tri-setiawan
• Telegram: https://t.me/adriansetiawan`,
};

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const findProject = (text) => {
  const queryTokens = normalize(text).split(' ').filter((token) => token.length > 3);
  return projectsData.find((project) => {
    const projectTokens = normalize(`${project.id} ${project.name} ${project.tag}`).split(' ');
    return queryTokens.some((token) => projectTokens.includes(token));
  });
};

const listProjects = () =>
  projectsData.map((project) => `${project.name}\n${project.summary}`).join('\n\n');

export default function CleanAIModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "I'm Lady Lunaria, the guide to Adrian's portfolio. Ask me about his profile, projects, technical stack, or contact details.",
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

      const project = findProject(text);

      if (project) {
        reply = [
          project.name,
          project.summary,
          project.detail,
          project.stack?.length ? `Stack: ${project.stack.join(', ')}` : '',
        ].filter(Boolean).join('\n\n');
      } else if (lower.includes('architecture') || lower.includes('system') || lower.includes('scrap') || lower.includes('tender') || lower.includes('bumn')) {
        reply = `I couldn't match that to a current project. Projects listed here:\n\n${listProjects()}`;
      } else if (lower.includes('project') || lower.includes('portfolio')) {
        reply = listProjects();
      } else if (lower.includes('stack') || lower.includes('skill') || lower.includes('tech')) {
        reply = KNOWLEDGE_BASE.stack;
      } else if (lower.includes('contact') || lower.includes('reach') || lower.includes('hire') || lower.includes('email')) {
        reply = KNOWLEDGE_BASE.contact;
      } else {
        reply = KNOWLEDGE_BASE.profile;
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
                <span className="font-mono ml-1">Checking portfolio data...</span>
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
            placeholder="Ask about Adrian's profile, projects, or contact details..."
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
