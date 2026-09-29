import React from 'react';
import { X, Sparkles, MapPin, Compass, Briefcase, GraduationCap } from 'lucide-react';
import profileData from '../../../content/profile.json';

const MILESTONES = [
  {
    period: '2024 — Present',
    role: 'Fullstack Engineer & AI R&D Specialist',
    company: 'Independent Engineering & Institutional Systems',
    description:
      'Engineered FaceGate (automated RTSP CCTV face recognition attendance with 512-d embeddings), EProcMon (24/7 BUMN tender monitoring with automated scrapers & AI classification), and custom assistant systems.',
    tags: ['FastAPI', 'OpenCV', 'Bun', 'SvelteKit', 'PostgreSQL', 'AI Agents'],
  },
  {
    period: '2023 — 2024',
    role: 'Enterprise Web & Dashboard Developer',
    company: 'Industrial Manufacturing Systems',
    description:
      'Designed and deployed the Procurement Charting Suite for sugar factory operations, managing multi-tier data visualization, automated exports, and internal analytics tools.',
    tags: ['Vue 3', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Analytics'],
  },
  {
    period: '2021 — 2023',
    role: 'Computer Science & AI Systems Exploration',
    company: 'Research & Applied Development',
    description:
      'Deep exploration in machine learning algorithms, deep learning models (YOLO, custom CNNs), desktop automation with Python and OpenCV, and distributed systems fundamentals.',
    tags: ['Python', 'Deep Learning', 'PyTorch', 'IoT / RTSP', 'Computer Vision'],
  },
];

export default function ExperienceModal({ onClose }) {
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
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Journey & Experience</h2>
              <p className="text-xs text-slate-400">Career Milestones & Engineering Evolution</p>
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
          {/* Bio Overview */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white">Adrian Tri Setiawan</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{profileData.base || 'Jakarta / Surabaya, Indonesia'}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {profileData.intro ||
                'Fullstack engineer moving at the intersection of web architecture, computer vision, deep learning, and practical R&D. Committed to building systems that feel alive, durable, and clean.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Fullstack Engineering
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Machine Learning & CV
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
                System Architecture
              </span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Career Timeline
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700/80">
              {MILESTONES.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-orange-400 border-2 border-slate-900 group-hover:scale-125 transition-transform" />

                  <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <span className="text-xs font-mono font-bold text-orange-400">{item.period}</span>
                      <span className="text-xs text-slate-400">{item.company}</span>
                    </div>
                    <h5 className="font-semibold text-sm text-white">{item.role}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-900/60 border border-slate-700/60 text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
