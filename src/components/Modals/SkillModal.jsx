import React from 'react';
import { X, Cpu, Code2, Database, BrainCircuit, Wrench, Sparkles } from 'lucide-react';
import profileData from '../../../content/profile.json';

const SKILL_CATEGORIES = [
  {
    name: 'Frontend Engineering',
    icon: Code2,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    description: 'Modern, reactive, and aesthetic web interfaces with micro-interactions and 3D graphics.',
    skills: ['React', 'Next.js', 'Vue 3', 'Tailwind CSS', 'Three.js', 'Vite', 'TypeScript', 'Turbopack'],
  },
  {
    name: 'Backend & APIs',
    icon: Cpu,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    description: 'High-throughput, asynchronous API microservices and automated background workers.',
    skills: ['Python', 'FastAPI', 'Node.js', 'Bun', 'Express', 'Go', 'Flask', 'REST / SSE / WebSockets'],
  },
  {
    name: 'AI, Machine Learning & R&D',
    icon: BrainCircuit,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    description: 'Real-time Computer Vision pipelines, 512-dim facial embeddings, and LLM agent orchestration.',
    skills: ['Computer Vision', 'OpenCV', 'PyTorch', 'LLMs & Agents', 'Prompt Systems', 'Deep Learning', 'RAG'],
  },
  {
    name: 'Databases & Infrastructure',
    icon: Database,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    description: 'Reliable relational and document data storage with realtime synchronization.',
    skills: ['PostgreSQL', 'Supabase', 'MySQL', 'MongoDB', 'Docker', 'Linux / Bash', 'Git / CI'],
  },
];

export default function SkillModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Technical Arsenal & Skills</h2>
              <p className="text-xs text-slate-400">Specializations across Fullstack, AI, and Systems</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Engineering Motto / Intro */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Philosophy</span>
            </div>
            <p className="text-sm italic text-slate-300">
              "{profileData.motto || 'Jack of all trades, master of integration. Fast adaptation to new problem domains.'}"
            </p>
          </div>

          {/* Grid of Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="p-4 rounded-2xl bg-slate-800/35 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-1.5 rounded-lg ${cat.bg} ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-sm text-white">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{cat.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-900/80 border border-slate-700/70 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths & Highlights */}
          <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Key Engineering Strengths
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Autonomous end-to-end execution: ideation, architecture, coding, deployment, and testing.</li>
              <li>Strong problem-solving capability in unstandardized, challenging requirement spaces.</li>
              <li>Comfortable with low overhead, high maintainability, and clean software craftsmanship.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
