import React from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  Compass,
  MapPin,
  Sparkles,
  Milestone,
  ShieldCheck,
  Calendar,
  Flame,
  Star,
} from 'lucide-react';
import profileData from '../../../content/profile.json';

const CHRONICLES = [
  {
    period: '2024 — Present',
    level: 'Lv. 90 → Lv. 99',
    title: 'Fullstack Engineer & AI R&D Specialist',
    realm: 'Independent Engineering & Institutional Systems',
    description:
      'Engineered FaceGate (automated RTSP CCTV face recognition attendance with 512-d embeddings), EProcMon (24/7 BUMN tender monitoring with automated scrapers & AI classification), and custom assistant systems.',
    loot: ['FastAPI', 'OpenCV', 'Bun', 'SvelteKit', 'PostgreSQL', 'AI Agents'],
    achievement: 'Engineered multi-tenant enterprise biometric & monitoring systems',
  },
  {
    period: '2023 — 2024',
    level: 'Lv. 75 → Lv. 90',
    title: 'Enterprise Web & Dashboard Architect',
    realm: 'Industrial Manufacturing Systems',
    description:
      'Designed and deployed the Procurement Charting Suite for sugar factory operations, managing multi-tier data visualization, automated exports, and internal analytics tools.',
    loot: ['Vue 3', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Analytics'],
    achievement: 'Optimized real-time factory procurement telemetry & exports',
  },
  {
    period: '2021 — 2023',
    level: 'Lv. 40 → Lv. 75',
    title: 'Applied AI & Computer Science Foundations',
    realm: 'Research & Applied Development',
    description:
      'Deep exploration in machine learning algorithms, deep learning models (YOLO, custom CNNs), desktop automation with Python and OpenCV, and distributed systems fundamentals.',
    loot: ['Python', 'Deep Learning', 'PyTorch', 'IoT / RTSP', 'Computer Vision'],
    achievement: 'Mastered computer vision pipelines & algorithmic problem solving',
  },
];

export default function ExperienceModal({ onClose }) {
  return (
    <ShrineModalFrame
      stationTag="JOURNEY LOOKOUT // CAREER CHRONICLES"
      accentColor="orange"
      onClose={onClose}
    >
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Archmage Character Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-amber-950/30 border border-amber-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Adrian Tri Setiawan</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  Lv.99 Archmage
                </span>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{profileData.base || 'Surabaya / Jakarta, Indonesia'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Available for High-Impact Projects</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {profileData.intro ||
              'Fullstack engineer moving at the intersection of web architecture, computer vision, deep learning, and practical R&D. Committed to building systems that feel alive, durable, and clean.'}
          </p>

          <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              ✦ Fullstack Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
              ✦ Deep Learning & Vision
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
              ✦ Systems Engineering
            </span>
          </div>
        </div>

        {/* Career Timeline Milestones */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <Milestone className="w-3.5 h-3.5 text-amber-400" />
            <span>Chronological Campaign Quest Log</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-orange-500 before:to-slate-800">
            {CHRONICLES.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Glowing Milestone Marker */}
                <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-900 shadow-[0_0_10px_#f59e0b] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30">
                        {item.period}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        [{item.level}]
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{item.realm}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white tracking-wide">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{item.description}</p>
                  </div>

                  {/* Achievement Banner */}
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs font-mono text-amber-200">
                    <Star className="w-3 h-3 text-amber-400 fill-current shrink-0" />
                    <span><b>Achievement:</b> {item.achievement}</span>
                  </div>

                  {/* Loot Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.loot.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/80 border border-slate-700 text-slate-300"
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
    </ShrineModalFrame>
  );
}
