import React, { useState } from 'react';
import { X, ExternalLink, Lock, CheckCircle2, Terminal } from 'lucide-react';
import projectsData from '../../../content/projects.json';

export default function ProjectModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id || 'facegate');
  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Featured Engineering Projects</h2>
              <p className="text-xs text-slate-400">Architected by Adrian Tri Setiawan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Left sidebar tabs + Right details */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Projects Navigation Sidebar */}
          <div className="w-full md:w-72 border-r border-slate-800 p-3 overflow-y-auto space-y-1.5 bg-slate-950/40">
            {projectsData.map((project) => {
              const isSelected = project.id === selectedId;
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                      : 'border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="truncate">{project.name.split('—')[0]}</span>
                    {project.private ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                        Public
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">{project.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Project Details Panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeProject.tag}
                </span>
                {activeProject.highlight && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Flagship
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {activeProject.name}
              </h3>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Overview & Impact
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">{activeProject.summary}</p>
            </div>

            {/* Architecture Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Technical Architecture
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{activeProject.detail}</p>
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              {activeProject.link ? (
                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confidential / Institutional Production System</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
