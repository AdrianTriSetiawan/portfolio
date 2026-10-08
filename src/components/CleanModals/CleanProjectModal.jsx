import React, { useState } from 'react';
import CleanModalFrame from './CleanModalFrame';
import { ExternalLink, Layers } from 'lucide-react';
import projectsData from '../../../content/projects.json';
import { audio } from '../../audio/LoFiAudioEngine';

export default function CleanProjectModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(projectsData[0]?.id || 'insightface');
  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  return (
    <CleanModalFrame
      stationTag="PROJECTS ARCHIVE"
      title="Project Portfolio"
      accentColor="#D27D46"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left: Projects Navigation Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#f0e7dd] p-4 overflow-y-auto space-y-2.5 bg-[#FAF6F0]">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D27D46]" /> Portfolio Projects
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
                    {project.name}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#D27D46]" />
                  )}
                </div>
                <p className="text-xs text-[#7d6756] line-clamp-1 leading-snug">
                  {project.tag}
                </p>
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
                  {activeProject.tag}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#37281D] tracking-tight">
                {activeProject.name}
              </h2>
            </div>

            {/* Project Link */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeProject.link && (
                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ece2] hover:bg-[#e8ded5] text-[#37281D] border border-[#decbb8] text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open project</span>
                </a>
              )}
            </div>
          </div>


          {/* System Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-[#8a7260] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D27D46]" /> Project Overview
            </h3>
            <p className="text-sm leading-relaxed text-[#4a3b30]">
              {activeProject.summary}
            </p>
            {activeProject.detail && (
              <p className="text-sm leading-relaxed text-[#4a3b30]">
                {activeProject.detail}
              </p>
            )}
          </div>


          {/* Tech Stack Pills */}
          {activeProject.stack && (
            <div className="space-y-2 pt-2 border-t border-[#f0e7dd]">
              <span className="text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
                Technologies & Frameworks
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProject.stack.map((tag) => (
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
