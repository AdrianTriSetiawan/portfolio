import React, { useState } from 'react';
import {
  ExternalLink,
  Lock,
  Mail,
  Copy,
  Check,
  Terminal,
  Cpu,
  BrainCircuit,
  Database,
  Code2,
  Sparkles,
  Bot,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa6';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background lo-fi ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider text-sm">ADRIANDEV</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audio.playClick();
                onToggle3D();
              }}
              className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25 transition text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter 3D World</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Jakarta / Surabaya, Indonesia</span>
            <span>•</span>
            <span className="text-emerald-400">Available for projects</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Adrian Tri Setiawan
            <span className="block text-xl sm:text-2xl font-medium text-slate-400 mt-2">
              Fullstack & AI R&D Engineer
            </span>
          </h1>

          <p className="max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
            {profileData.intro ||
              'Crafting intelligent computer vision systems, high-throughput backend APIs, and aesthetic web applications. Bridging deep learning research with production-grade engineering.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:adriansetiawan26@gmail.com"
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </a>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
            </button>

            <a
              href="https://github.com/AdrianTriSetiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="https://linkedin.com/in/adrian-tri-setiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 hover:text-sky-300 transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Featured Projects Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Featured Engineering Projects</span>
              </h2>
              <p className="text-xs text-slate-400">Production systems, AI platforms, and automated tooling</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      {project.tag}
                    </span>
                    {project.private ? (
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Private</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded">
                        Public
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{project.summary}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-slate-800/60 rounded text-[11px] text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>View Code</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Arsenal / Skills */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span>Technical Skills & Arsenal</span>
            </h2>
            <p className="text-xs text-slate-400">Core technologies leveraged in production and research</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Frontend</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Next.js', 'Vue 3', 'Tailwind', 'Three.js', 'Vite', 'TypeScript'].map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-slate-800/80 rounded text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Backend</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Python', 'FastAPI', 'Node.js', 'Bun', 'Express', 'Go', 'Flask'].map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-slate-800/80 rounded text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <BrainCircuit className="w-4 h-4" />
                <span>AI & Deep Learning</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Computer Vision', 'OpenCV', 'PyTorch', 'LLMs', 'Prompt Engineering', 'RAG'].map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-slate-800/80 rounded text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Database className="w-4 h-4" />
                <span>Databases & Infra</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['PostgreSQL', 'Supabase', 'MySQL', 'MongoDB', 'Docker', 'Linux'].map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-slate-800/80 rounded text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>© {new Date().getFullYear()} Adrian Tri Setiawan. Built with Three.js, React & Web Audio API.</p>
          <p className="text-slate-600">Lo-Fi Ambient Tavern Edition</p>
        </footer>
      </div>

      {/* Floating AI Chat Launcher Button */}
      <button
        onClick={() => {
          audio.playClick();
          onOpenAIChat();
        }}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-transform active:scale-90 flex items-center gap-2 text-xs font-semibold cursor-pointer"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">Ask AI Assistant</span>
      </button>
    </div>
  );
}
