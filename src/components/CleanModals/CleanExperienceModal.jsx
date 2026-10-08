import React from 'react';
import CleanModalFrame from './CleanModalFrame';
import { MapPin, CheckCircle2 } from 'lucide-react';
import profileData from '../../../content/profile.json';

const EXPERIENCES = [
  {
    role: 'Fullstack Engineer and AI R&D Builder',
    company: 'PT Piramida Teknologi Informasi (PTI)',
    location: 'Jakarta / Surabaya, Indonesia',
    summary: 'Currently employed at PTI — not open to work, but available for freelance.',
    highlights: profileData.highlights,
    tech: profileData.stack,
  },
];

export default function CleanExperienceModal({ onClose }) {
  return (
    <CleanModalFrame
      stationTag="CURRENT ROLE"
      title="Current Role & Profile"
      accentColor="#10B981"
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FFFDF9]">
        <div className="border-b border-[#f0e7dd] pb-4">
          <h3 className="text-2xl font-extrabold text-[#37281D] tracking-tight">
            Current Role & Profile
          </h3>
          <p className="text-sm text-[#6b4e36] mt-1">
            {profileData.intro}
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
                  Profile Highlights
                </span>
                <ul className="space-y-2">
                  {exp.highlights.map((item, i) => (
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
