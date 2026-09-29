import React, { useState } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  ExternalLink,
  Lock,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Boxes,
  Cpu,
  GitBranch,
} from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa6';
import projectsData from '../../../content/projects.json';
import { audio } from '../../audio/LoFiAudioEngine';

export default function ProjectModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id || 'facegate');
  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  return (
    <ShrineModalFrame
      stationTag="PROJECTS ARCHIVE // PRODUCTION SYSTEMS"
      accentColor="emerald"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left: Engineering Systems Navigation Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 overflow-y-auto space-y-2 bg-slate-950/70">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Production Systems
            </span>
            <span className="text-slate-500">{projectsData.length} Deployed</span>
          </div>

          {projectsData.map((project) => {
            const isSelected = project.id === selectedId;

            return (
              <button
                key={project.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedId(project.id);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1.5 border text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-400/50 text-white shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                    {project.tag.split('·')[0].trim()}
                  </span>
                  {project.private ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300/90 flex items-center gap-1 font-mono">
                      <Lock className="w-2.5 h-2.5" /> Private Repo
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                      Open Source
                    </span>
                  )}
                </div>

                <div className="font-semibold text-xs sm:text-sm text-white truncate">
                  {project.name.split('—')[0].trim()}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                  {project.summary}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Technical Dossier & Architecture Panel */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900/40">
          {/* Header Banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> PRODUCTION DEPLOYED
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeProject.tag}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeProject.name}
            </h2>
          </div>

          {/* Real Engineering Key Metrics */}
          {activeProject.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeProject.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-300 mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* System Specification & Observable Impact */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>System Objective & Real-World Implementation</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeProject.summary}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
              {activeProject.detail}
            </p>
          </div>

          {/* Architecture / Data Flow Monospace Diagram */}
          {activeProject.architecture && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Architecture & Data Flow Diagram</span>
              </h3>
              <pre className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-300 overflow-x-auto leading-relaxed selection:bg-emerald-500/30">
                <code>{activeProject.architecture}</code>
              </pre>
            </div>
          )}

          {/* Technology Stack / Utilized Libraries */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-purple-400" />
              <span>Core Technology Stack & Runtime</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-slate-800/60 border border-slate-700/70 rounded-lg text-xs font-mono text-slate-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links & Repository Anchors */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {activeProject.link && (
                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Deployment</span>
                </a>
              )}

              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs rounded-xl transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect GitHub Repository</span>
                </a>
              )}

              {!activeProject.link && !activeProject.github && (
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Institutional Production System (Proprietary / NDA Protected)</span>
                </div>
              )}
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
              Engineered & Maintained by Adrian Tri Setiawan
            </span>
          </div>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
