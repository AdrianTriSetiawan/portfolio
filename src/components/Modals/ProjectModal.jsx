import React, { useState } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  ExternalLink,
  Lock,
  CheckCircle2,
  Terminal,
  Shield,
  Award,
  Scroll,
  Sparkles,
  Boxes,
} from 'lucide-react';
import projectsData from '../../../content/projects.json';
import { audio } from '../../audio/LoFiAudioEngine';

export default function ProjectModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id || 'facegate');
  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  // Assign RPG Quest Ranks
  const getQuestRank = (project) => {
    if (project.highlight) return { rank: 'RANK S', color: 'text-amber-300 border-amber-400/40 bg-amber-500/10' };
    if (project.tag.includes('AI') || project.tag.includes('Computer Vision')) {
      return { rank: 'RANK S', color: 'text-purple-300 border-purple-400/40 bg-purple-500/10' };
    }
    return { rank: 'RANK A', color: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10' };
  };

  return (
    <ShrineModalFrame
      stationTag="PROJECTS PAVILION // QUEST BOUNTY ARCHIVE"
      accentColor="emerald"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
        {/* Left: Quest Log Navigation Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 overflow-y-auto space-y-2 bg-slate-950/60">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-emerald-400" /> Active Quests
            </span>
            <span>{projectsData.length} Cleared</span>
          </div>

          {projectsData.map((project) => {
            const isSelected = project.id === selectedId;
            const questRank = getQuestRank(project);

            return (
              <button
                key={project.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedId(project.id);
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all flex flex-col gap-1 border ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-white shadow-[0_0_15px_rgba(52,211,153,0.18)]'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${questRank.color}`}>
                    {questRank.rank}
                  </span>
                  {project.private ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 flex items-center gap-1 font-mono">
                      <Lock className="w-2.5 h-2.5" /> Confidential
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                      Public Quest
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                  {project.name.split('—')[0]}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-mono">
                  {project.tag}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Quest Dossier & Loot Panel */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-slate-900/40">
          {/* Header Banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${getQuestRank(activeProject).color}`}>
                {getQuestRank(activeProject).rank} BOUNTY
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> QUEST CLEARED & DEPLOYED
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeProject.tag}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {activeProject.name}
            </h2>
          </div>

          {/* Quest Briefing Card */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Quest Mission & Observable Impact</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeProject.summary}
            </p>
          </div>

          {/* Technical Architecture Schematics */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>System Blueprint & Architecture</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeProject.detail}
            </p>
          </div>

          {/* Loot / Tech Drops */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-purple-400" />
              <span>Loot Drops & Utilized Materia</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-mono text-slate-200 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quest Completion Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {activeProject.link ? (
              <a
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Inspect Source Artifact</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                <Lock className="w-3.5 h-3.5" />
                <span>Confidential Production Enterprise System</span>
              </div>
            )}
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
              Status: 100% Verified Production
            </span>
          </div>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
