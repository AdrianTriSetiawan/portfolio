import React, { useState } from 'react';
import {
  ExternalLink,
  Mail,
  Check,
  Cpu,
  Bot,
  MapPin,
  Layers,
  Compass,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin, FaTelegram as Telegram } from 'react-icons/fa6';
import projectsData from '../../content/projects.json';
import profileData from '../../content/profile.json';
import { audio } from '../audio/LoFiAudioEngine';

export default function ClassicView({ onOpenAIChat, onToggle3D }) {
  const [copied, setCopied] = useState(false);
  const email = 'adriansetiawan26@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audio.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#37281D] font-sans selection:bg-[#D27D46]/20 selection:text-[#D27D46] pb-24">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#e5dcd3] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onToggle3D();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D27D46] hover:bg-[#b86633] text-white text-xs font-bold shadow-sm transition hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Return to 3D World</span>
          </button>
          <span className="hidden sm:inline-block text-xs font-mono font-bold text-[#8a7260]">
            Adrian Tri Setiawan · Engineering CV
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F4ECE2] border border-[#decbb8] text-xs font-bold text-[#8B5CF6] transition shadow-xs"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Lady Lunaria AI</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F4ECE2] border border-[#decbb8] text-xs font-bold text-[#37281D] transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">Copied</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-[#D27D46]" />
                <span>Contact</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Hero Section */}
        <section className="p-7 sm:p-9 rounded-3xl bg-[#FFFDF9] border-2 border-[#e5dcd3] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <img
                src="/profile/adrian-portrait.jpg"
                alt="Portrait of Adrian Tri Setiawan"
                className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-full object-cover border-2 border-[#decbb8]"
              />
              <div className="min-w-0">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F4ECE2] text-[#D27D46] border border-[#decbb8] inline-block mb-3">
                  Fullstack Engineer & AI R&D Builder
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#37281D] tracking-tight">
                  Adrian Tri Setiawan
                </h1>
                <p className="text-sm sm:text-base text-[#6b4e36] mt-1.5 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D27D46]" />
                  <span>{profileData.base} · Indonesia</span>
                </p>
              </div>
            </div>

            {/* Social Pills */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/AdrianTriSetiawan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FAF6F0] hover:bg-[#F4ECE2] border border-[#decbb8] flex items-center justify-center text-[#37281D] transition"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/adrian-tri-setiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FAF6F0] hover:bg-[#F4ECE2] border border-[#decbb8] flex items-center justify-center text-[#3B82F6] transition"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/adriansetiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FAF6F0] hover:bg-[#F4ECE2] border border-[#decbb8] flex items-center justify-center text-[#10B981] transition"
                title="Telegram"
              >
                <Telegram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#4a3b30] leading-relaxed">
            {profileData.intro}
          </p>

        </section>

        {/* Featured Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#37281D] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D27D46]" />
              <span>Selected Projects</span>
            </h2>
            <span className="text-xs font-mono font-bold text-[#8a7260]">
              {projectsData.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF9] border-2 border-[#e5dcd3] shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F4ECE2] text-[#D27D46] border border-[#decbb8]">
                        {project.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#37281D]">
                      {project.name}
                    </h3>

                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D27D46] hover:bg-[#b86633] text-white text-xs font-semibold shadow-xs transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open project</span>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4a3b30] leading-relaxed">
                  {project.summary}
                </p>
                {project.detail && (
                  <p className="text-xs sm:text-sm text-[#4a3b30] leading-relaxed">
                    {project.detail}
                  </p>
                )}


                {project.stack && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f0e7dd]">
                    {project.stack.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#FAF6F0] text-[#6b4e36] border border-[#ede3d7]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Stack */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#37281D] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#3B82F6]" />
            <span>Technical Stack</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {profileData.stack.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-xs font-mono bg-[#FFFDF9] text-[#6b4e36] border border-[#ede3d7]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Footer */}
        <section className="p-7 sm:p-9 rounded-3xl bg-[#FFFDF9] border-2 border-[#e5dcd3] text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#37281D]">
            Let's Build Something High-Impact Together
          </h2>
          <p className="text-sm text-[#6b4e36] max-w-lg mx-auto">
            Currently employed at PT Piramida Teknologi Informasi (PTI); available for freelance inquiries.
          </p>
          <div className="pt-2">
            <button
              onClick={handleCopy}
              className="px-6 py-3 rounded-full bg-[#D27D46] hover:bg-[#b86633] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2 hover:scale-105"
            >
              {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy adriansetiawan26@gmail.com'}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
