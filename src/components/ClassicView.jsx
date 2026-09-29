import React, { useState, useEffect } from 'react';
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  Tv,
  Gamepad2,
  CheckCircle2,
  Layers,
  Activity,
  Boxes,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa6';
import projectsData from '../../content/projects.json';
import profileData from '../../content/profile.json';
import { audio } from '../audio/LoFiAudioEngine';

export default function ClassicView({ onOpenAIChat, onToggle3D }) {
  const [copied, setCopied] = useState(false);
  const [audioState, setAudioState] = useState(audio.getStatus());
  const email = 'adriansetiawan26@gmail.com';

  useEffect(() => {
    return audio.subscribe((status) => {
      setAudioState(status);
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audio.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sm font-black font-mono text-emerald-300">
                AD
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm tracking-wide">
                  ADRIAN TRI SETIAWAN
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono border border-emerald-500/30">
                  SYSTEMS ENGINEER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Computer Vision · Distributed Backends · Autonomous Crawlers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                audio.togglePlay();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Toggle Lo-Fi Music"
            >
              {audioState.isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lo-Fi Music</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span>Play Lo-Fi</span>
                </>
              )}
            </button>

            {/* Launch 3D World Button */}
            <button
              onClick={() => {
                audio.playClick();
                onToggle3D();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Enter 3D World</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Available for Contract Engineering & High-Impact Roles</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Building high-throughput computer vision, resilient crawler architectures, and production distributed systems.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            I am a fullstack systems engineer based in Indonesia. I design and ship production infrastructure across real-time RTSP CCTV biometrics (512D ArcFace embeddings), high-concurrency microservices (FastAPI, Bun, Elysia), autonomous web crawlers (150+ BUMN portals), and interactive 3D WebGL experiences.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Direct Email</span>
            </a>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : email}</span>
            </button>

            <a
              href="https://github.com/AdrianTriSetiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenAIChat}
              className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center gap-1.5 transition-colors ml-auto"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Companion</span>
            </button>
          </div>
        </section>

        {/* Featured Projects Dossier */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Featured Engineering Systems</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Verified Production Deployments
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {project.tag}
                      </span>
                      {project.private ? (
                        <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Private System
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-300">
                          Open Source
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {project.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Site</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Key Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {project.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex flex-col"
                      >
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {m.label}
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-300 mt-0.5">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.summary}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {project.detail}
                </p>

                {/* Architecture Diagram */}
                {project.architecture && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-300 overflow-x-auto leading-relaxed">
                    <code>{project.architecture}</code>
                  </div>
                )}

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Capabilities Matrix */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Core Technical Capabilities</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Battle-Tested Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span>Computer Vision & Biometrics</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ArcFace 512D facial embedding extraction, cosine similarity indexing with PostgreSQL pgvector, OpenCV multi-stream RTSP frame decoders, and anti-spoofing heuristics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Distributed Backends & Microservices</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Asynchronous Python (FastAPI/AsyncIO), ultra-fast TypeScript microservices (Bun/Elysia.js), Server-Sent Events (SSE) streaming, and real-time WebSockets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Autonomous Crawlers & Data Engineering</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Headless distributed scraping pipelines monitoring 150+ Indonesian BUMN tender portals, Supabase CDC event streams, and relational PostgreSQL optimization.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Modern Frontends & 3D WebGL</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                React, Next.js, SvelteKit, Vue 3, Three.js 60 FPS zero-allocation render loops, shader tuning, and responsive UI ergonomics with Tailwind CSS.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800 text-center text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Adrian Tri Setiawan. Engineered for performance and clarity.</p>
        </footer>
      </div>
    </div>
  );
}
