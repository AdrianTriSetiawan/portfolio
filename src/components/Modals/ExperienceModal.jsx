import React from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';
import profileData from '../../../content/profile.json';

const CAREER_TRACK = [
  {
    period: '2024 — Present',
    role: 'Lead Systems & AI R&D Engineer',
    organization: 'Independent Engineering & Institutional Systems',
    location: 'Surabaya / Jakarta, Indonesia',
    summary:
      'Architected mission-critical enterprise systems spanning distributed computer vision, autonomous crawlers, and high-concurrency microservices.',
    deliverables: [
      'Engineered FaceGate biometric attendance engine: Sub-280ms p95 latency, 512D ArcFace embeddings, pgvector cosine search, multi-camera RTSP ingestion watchdog.',
      'Developed EProcMon: 24/7 scraping pipeline across 150+ Indonesian BUMN and LPSE portals, utilizing Bun, Elysia.js, Supabase Realtime, and Discord event dispatchers.',
      'Constructed Lunaria AI assistant framework with structured token streaming and dynamic tool execution.',
    ],
    technologies: ['FastAPI', 'Python', 'OpenCV', 'Bun', 'Elysia.js', 'PostgreSQL', 'pgvector', 'SvelteKit', 'React'],
  },
  {
    period: '2023 — 2024',
    role: 'Fullstack Systems Architect',
    organization: 'Industrial Manufacturing Systems',
    location: 'East Java, Indonesia',
    summary:
      'Spearheaded enterprise web dashboards and telemetry pipelines for industrial agro-manufacturing and factory procurement operations.',
    deliverables: [
      'Architected Procurement Charting Suite for sugar factory operations, unifying disparate supply chain intakes and yield metrics.',
      'Engineered high-performance charting primitives with multi-format export engines (vector PNG, Excel/CSV pipelines).',
      'Implemented role-based access control and audited logging pipelines for internal operational governance.',
    ],
    technologies: ['Vue 3', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Apache ECharts', 'Docker'],
  },
  {
    period: '2021 — 2023',
    role: 'Applied AI & Computer Science Foundations',
    organization: 'Research & Applied Engineering',
    location: 'Indonesia',
    summary:
      'Rigorous research and implementation of deep learning architectures, embedded camera automation, and distributed Linux environments.',
    deliverables: [
      'Developed desktop automation suites and camera monitoring tools utilizing OpenCV and custom socket protocols.',
      'Conducted benchmarking and optimization of convolutional neural networks for object detection and face alignment.',
      'Authored automated data processing pipelines for high-volume unstructured datasets.',
    ],
    technologies: ['Python 3', 'PyTorch', 'OpenCV', 'Linux', 'Git', 'AsyncIO'],
  },
];

export default function ExperienceModal({ onClose }) {
  return (
    <ShrineModalFrame
      stationTag="TRACK RECORD // CAREER MILESTONES"
      accentColor="orange"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-slate-900/40">
        {/* Profile Summary Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Adrian Tri Setiawan
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Surabaya / Jakarta, Indonesia</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Available for Contract & High-Impact Roles</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full-Lifecycle Production Track Record</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Fullstack systems engineer operating at the convergence of high-throughput web architecture, distributed backends, computer vision, and autonomous agent systems. Known for rapid domain assimilation, uncompromising performance standards, and building resilient production software.
          </p>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Career Milestones & Engineering Deployments</span>
          </div>

          <div className="space-y-4">
            {CAREER_TRACK.map((exp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/90 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/30">
                      {exp.period}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">
                      {exp.role}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {exp.organization} — {exp.location}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {exp.summary}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Key Deliverables & Verified Impact:
                  </div>
                  <ul className="space-y-1 pl-1">
                    {exp.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800/80">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/50 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
