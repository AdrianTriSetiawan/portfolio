import React, { useState } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  Code2,
  Cpu,
  BrainCircuit,
  Database,
  Sparkles,
  ShieldAlert,
  Flame,
  Star,
  Layers,
} from 'lucide-react';
import profileData from '../../../content/profile.json';

const MATERIA_CATEGORIES = [
  {
    name: 'Neural & Computer Vision Materia',
    tier: 'MYTHIC TIER',
    badgeColor: 'border-purple-400/40 bg-purple-500/15 text-purple-300',
    barColor: 'from-purple-500 to-pink-500',
    icon: BrainCircuit,
    description: 'High-dimensional biometric embeddings, RTSP CCTV analysis, and LLM orchestration.',
    skills: [
      { name: 'Computer Vision / OpenCV', level: 'Lv. 96', exp: '96%' },
      { name: 'PyTorch & Deep Learning', level: 'Lv. 92', exp: '92%' },
      { name: 'LLM Agents & Streaming RAG', level: 'Lv. 95', exp: '95%' },
      { name: 'Facial Embeddings (512-dim)', level: 'Lv. 98', exp: '98%' },
    ],
  },
  {
    name: 'High-Throughput Backend Engine',
    tier: 'LEGENDARY TIER',
    badgeColor: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
    barColor: 'from-emerald-500 to-teal-400',
    icon: Cpu,
    description: 'Asynchronous microservices, real-time WebSockets/SSE, and automated crawlers.',
    skills: [
      { name: 'Python / FastAPI / AsyncIO', level: 'Lv. 98', exp: '98%' },
      { name: 'Node.js / Bun / TypeScript', level: 'Lv. 95', exp: '95%' },
      { name: 'Go Microservices', level: 'Lv. 88', exp: '88%' },
      { name: 'WebSocket & SSE Streaming', level: 'Lv. 96', exp: '96%' },
    ],
  },
  {
    name: '3D Graphics & Reactive Interface',
    tier: 'EPIC TIER',
    badgeColor: 'border-sky-400/40 bg-sky-500/15 text-sky-300',
    barColor: 'from-sky-500 to-cyan-400',
    icon: Code2,
    description: 'WebGL, Three.js shaders, reactive component state machines, and micro-interactions.',
    skills: [
      { name: 'Three.js / WebGL / Shaders', level: 'Lv. 93', exp: '93%' },
      { name: 'React / Next.js / Vite', level: 'Lv. 97', exp: '97%' },
      { name: 'Vue 3 / Composition API', level: 'Lv. 94', exp: '94%' },
      { name: 'Tailwind CSS & Animations', level: 'Lv. 99', exp: '99%' },
    ],
  },
  {
    name: 'Relational Cloud & Systems Relics',
    tier: 'ANCIENT TIER',
    badgeColor: 'border-amber-400/40 bg-amber-500/15 text-amber-300',
    barColor: 'from-amber-500 to-orange-400',
    icon: Database,
    description: 'Zero-latency query optimization, Docker containerization, and Linux runtime tooling.',
    skills: [
      { name: 'PostgreSQL / Supabase', level: 'Lv. 95', exp: '95%' },
      { name: 'Docker / Linux Administration', level: 'Lv. 92', exp: '92%' },
      { name: 'MySQL / Multi-tenant DBs', level: 'Lv. 90', exp: '90%' },
      { name: 'Git Workflow & CI Automation', level: 'Lv. 96', exp: '96%' },
    ],
  },
];

export default function SkillModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <ShrineModalFrame
      stationTag="SKILLS GROVE // MATERIA TREE"
      accentColor="sky"
      onClose={onClose}
    >
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Materia Tree Philosophy Card */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-sky-950/40 border border-sky-500/30 overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Archmage Arsenal Passives</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 italic">
                "{profileData.motto || 'Jack of all trades, master of integration. Fast adaptation to new problem domains.'}"
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono">
              <Star className="w-3.5 h-3.5 fill-current text-sky-400" />
              <span>Rank S Skillmaster</span>
            </div>
          </div>
        </div>

        {/* Materia Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MATERIA_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4 group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${cat.badgeColor}`}>
                      {cat.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{cat.description}</p>

                  {/* Skills Level Bars */}
                  <div className="space-y-2.5">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 font-medium">{skill.name}</span>
                          <span className="text-sky-300 font-bold">{skill.level}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${cat.barColor} transition-all duration-500`}
                            style={{ width: skill.exp }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer slot */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Equipped in Active Spellbook</span>
                  <span className="text-emerald-400">Ready to Cast</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combat Passives / Key Engineering Traits */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Inherent Archetype Traits</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <b className="text-white block mb-0.5">✦ Autonomous Solo Shipper</b>
              <span>Self-contained execution from zero to deployed containerized production.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <b className="text-white block mb-0.5">✦ Unstandardized Solver</b>
              <span>Excels at solving messy requirements with elegant high-maintainability code.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <b className="text-white block mb-0.5">✦ Zero Overhead Philosophy</b>
              <span>Avoids bloated abstractions; prioritizes mechanical sympathy & durability.</span>
            </div>
          </div>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
