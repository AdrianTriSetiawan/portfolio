import React from 'react';
import CleanModalFrame from './CleanModalFrame';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';

const EXPERIENCES = [
  {
    role: 'Lead Systems & AI Engineer',
    company: 'Enterprise AI & Procurement Systems',
    period: '2023 - Present',
    location: 'Surabaya / Remote',
    color: '#D27D46',
    summary: 'Spearheaded end-to-end architecture of computer vision pipelines, multi-agent AI ecosystems, and distributed tender intelligence.',
    achievements: [
      'Architected FaceGate ArcFace 512D biometric access pipeline achieving <280ms inference latency and 99.82% Top-1 accuracy.',
      'Engineered EProcMon distributed scraping orchestrator spanning 150+ BUMN and governmental procurement portals with 99.9% uptime.',
      'Designed Lunaria AI: autonomous agent orchestration platform with streaming SSE, vector memory indexing, and tool execution.',
    ],
    tech: ['Python', 'PyTorch', 'Go', 'FastAPI', 'PostgreSQL', 'Docker', 'Three.js'],
  },
  {
    role: 'Fullstack & Backend Engineer',
    company: 'Enterprise Web & Surveillance Infrastructure',
    period: '2021 - 2023',
    location: 'Indonesia',
    color: '#3B82F6',
    summary: 'Built high-throughput hardware surveillance integrations, automated ETL engines, and robust client portals.',
    achievements: [
      'Integrated EZVIZ surveillance SDK and RTSP hardware decoders for real-time video monitoring and multi-camera event alerts.',
      'Implemented distributed PostgreSQL query optimization, connection pooling, and Redis caching layers for high concurrent traffic.',
      'Authored automated data cleaning and normalization pipelines processing tens of thousands of tender records weekly.',
    ],
    tech: ['Go', 'Node.js', 'React', 'Redis', 'PostgreSQL', 'RabbitMQ', 'Nginx'],
  },
];

export default function CleanExperienceModal({ onClose }) {
  return (
    <CleanModalFrame
      stationTag="MILESTONES & JOURNEY"
      title="Engineering Experience & Impact"
      accentColor="#10B981"
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FFFDF9]">
        <div className="border-b border-[#f0e7dd] pb-4">
          <h3 className="text-2xl font-extrabold text-[#37281D] tracking-tight">
            Career Journey & Milestones
          </h3>
          <p className="text-sm text-[#6b4e36] mt-1">
            Track record of shipping production-critical software, biometric vision models, and distributed data systems.
          </p>
        </div>

        <div className="space-y-6">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#FAF6F0] border border-[#ede3d7] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e7dd] pb-3">
                <div>
                  <h4 className="text-lg font-bold text-[#37281D]">{exp.role}</h4>
                  <div className="text-sm font-medium text-[#D27D46]">{exp.company}</div>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#8a7260]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5c4432] leading-relaxed">
                {exp.summary}
              </p>

              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
                  Key Achievements
                </span>
                <ul className="space-y-2">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4a3b30]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#F4ECE2] text-[#6b4e36] border border-[#decbb8]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CleanModalFrame>
  );
}
