import React, { useState } from 'react';
import CleanModalFrame from './CleanModalFrame';
import {
  ExternalLink,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Cpu,
  Shield,
  Server,
  Zap,
} from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa6';
import projectsData from '../../../content/projects.json';
import { audio } from '../../audio/LoFiAudioEngine';

export default function CleanProjectModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id || 'facegate');
  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  return (
    <CleanModalFrame
      stationTag="PROJECTS ARCHIVE"
      title="Production Engineering Systems"
      accentColor="#D27D46"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left: Projects Navigation Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#f0e7dd] p-4 overflow-y-auto space-y-2.5 bg-[#FAF6F0]">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D27D46]" /> Deployed Systems
            </span>
            <span className="text-[#a8907e]">{projectsData.length} Projects</span>
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
                className={`w-full text-left p-3.5 rounded-2xl transition-all flex flex-col gap-1.5 border text-left ${
                  isSelected
                    ? 'bg-white border-[#D27D46] shadow-md shadow-[#D27D46]/10 translate-x-1'
                    : 'bg-[#F4ECE2]/60 hover:bg-white/80 border-[#e8ded5] text-[#5c4432]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-sm tracking-tight ${
                      isSelected ? 'text-[#D27D46]' : 'text-[#37281D]'
                    }`}
                  >
                    {project.title}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#D27D46]" />
                  )}
                </div>
                <p className="text-xs text-[#7d6756] line-clamp-1 leading-snug">
                  {project.tagline || project.subtitle}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 text-[10px] rounded-md font-mono bg-[#ece2d6] text-[#6b4e36] font-semibold">
                    {project.category || 'Production'}
                  </span>
                  {Array.isArray(project.metrics) && project.metrics[0] && (
                    <span className="text-[10px] text-[#8a7260] font-mono">
                      {project.metrics[0].value}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Specification Panel */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#FFFDF9]">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#f0e7dd] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F4ECE2] text-[#D27D46] border border-[#e8ded5]">
                  {activeProject.category || 'System Architecture'}
                </span>
                {activeProject.status && (
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-[#10B981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {activeProject.status}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#37281D] tracking-tight">
                {activeProject.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6b4e36] mt-1 font-medium">
                {activeProject.tagline || activeProject.subtitle}
              </p>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ece2] hover:bg-[#e8ded5] text-[#37281D] border border-[#decbb8] text-xs font-semibold transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D27D46] hover:bg-[#b86633] text-white text-xs font-semibold shadow-sm transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live System</span>
                </a>
              )}
            </div>
          </div>

          {/* Key Metrics Strip */}
          {Array.isArray(activeProject.metrics) && activeProject.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF6F0] border border-[#ede3d7]">
              {activeProject.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#8a7260] uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#D27D46]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* System Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-[#8a7260] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#D27D46]" /> System Overview
            </h3>
            <p className="text-sm leading-relaxed text-[#4a3b30]">
              {activeProject.description}
            </p>
          </div>

          {/* Architectural Highlights / Concrete Engineering */}
          {activeProject.highlights && activeProject.highlights.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-bold text-[#8a7260] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" /> Technical Implementation & Architecture
              </h3>
              <ul className="space-y-2">
                {activeProject.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4a3b30] leading-normal"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture Pipeline / Flow */}
          {activeProject.architecture && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-[#8a7260] uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#8B5CF6]" /> Pipeline Diagram
              </h3>
              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#ede3d7] font-mono text-xs text-[#5c4432] overflow-x-auto whitespace-pre">
                {activeProject.architecture}
              </div>
            </div>
          )}

          {/* Tech Stack Pills */}
          {activeProject.tags && (
            <div className="space-y-2 pt-2 border-t border-[#f0e7dd]">
              <span className="text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
                Technologies & Frameworks
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#F4ECE2] text-[#5c4432] border border-[#decbb8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CleanModalFrame>
  );
}
