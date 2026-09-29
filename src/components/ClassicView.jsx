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
  Coffee,
  Zap,
  Trophy,
  Scroll,
  ShieldCheck,
  Flame,
  Star,
  Boxes,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa6';
import projectsData from '../../content/projects.json';
import profileData from '../../content/profile.json';
import { audio } from '../audio/LoFiAudioEngine';

export default function ClassicView({ onOpenAIChat, onToggle3D }) {
  const [copied, setCopied] = useState(false);
  const [crtMode, setCrtMode] = useState(true);
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
      {/* Optional CRT Scanline Overlay */}
      {crtMode && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,22,34,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-45" />
      )}

      {/* Cozy Dusk / Twilight Starry Animated Sky Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft colorful twilight nebulae */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />

        {/* Twinkling CSS Stars */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* --- TOP HEADER & RETRO CASSETTE MUSIC PLAYER --- */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
          {/* Logo & Game Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-400 p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sm font-black text-amber-300">
                  巫
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-white text-sm tracking-wider">
                    ADRIANDEV
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    V99.4 COZY HUB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Archmage Fullstack & AI R&D</p>
              </div>
            </div>

            {/* CRT Scanline Toggle (Mobile & Desktop) */}
            <button
              onClick={() => {
                audio.playClick();
                setCrtMode(!crtMode);
              }}
              title="Toggle Retro CRT Scanline Filter"
              className={`md:hidden px-3 py-1.5 rounded-full text-xs font-mono border transition flex items-center gap-1.5 ${
                crtMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{crtMode ? 'CRT: ON' : 'CRT: OFF'}</span>
            </button>
          </div>

          {/* Center: Retro Lo-Fi Cassette Tape Player */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 w-full md:w-auto justify-between md:justify-start">
            {/* Cassette Tape Spindles (Spins when playing) */}
            <div className="flex items-center gap-1.5 px-1">
              <div
                className={`w-4 h-4 rounded-full border-2 border-emerald-400/60 border-t-emerald-300 flex items-center justify-center ${
                  audioState.isPlaying ? 'animate-spin' : ''
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
              </div>
              <div className="w-2 h-0.5 bg-slate-700" />
              <div
                className={`w-4 h-4 rounded-full border-2 border-emerald-400/60 border-b-emerald-300 flex items-center justify-center ${
                  audioState.isPlaying ? 'animate-spin' : ''
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Track Info & Equalizer */}
            <div className="flex flex-col min-w-[120px] max-w-[160px]">
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                Lo-Fi Tape Deck
              </span>
              <span className="text-xs font-mono text-slate-200 truncate">
                {audioState.trackName}
              </span>
            </div>

            {/* Play / Pause */}
            <button
              onClick={() => {
                audio.playClick();
                audio.toggle();
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-emerald-400 transition"
              title={audioState.isPlaying ? 'Pause' : 'Play Lo-Fi Music'}
            >
              {audioState.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            {/* Volume / Mute */}
            <button
              onClick={() => {
                audio.playClick();
                audio.toggleMute();
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition"
              title="Toggle Mute"
            >
              {audioState.isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right Action: Enter 3D World & CRT Toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                audio.playClick();
                setCrtMode(!crtMode);
              }}
              title="Toggle Retro CRT Scanline Filter"
              className={`hidden md:flex px-3 py-2 rounded-2xl text-xs font-mono border transition items-center gap-1.5 ${
                crtMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{crtMode ? 'CRT: ON' : 'CRT: OFF'}</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onToggle3D();
              }}
              className="flex-1 md:flex-none px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Enter 3D World</span>
            </button>
          </div>
        </header>

        {/* --- CHARACTER STATUS HUD CARD (RPG ARCHMAGE PROFILE) --- */}
        <section className="relative p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Character Info & Avatar */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 p-[3px] shadow-xl flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[21px] flex items-center justify-center text-3xl font-black text-amber-300">
                    巫
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-emerald-500 text-slate-950 font-black font-mono text-[10px] rounded-lg shadow-md">
                  Lv.99
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Adrian Tri Setiawan
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Archmage Class
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Fullstack Engineer & AI R&D Specialist
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Surabaya / Jakarta, Indonesia
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ready for High-Impact Quests
                  </span>
                </div>
              </div>
            </div>

            {/* RPG Status Bars */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
              {/* Coffee Mana */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <Coffee className="w-3.5 h-3.5" /> Coffee Mana
                  </span>
                  <span className="text-sky-400 font-bold">999 / 999</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full w-full" />
                </div>
              </div>

              {/* Code Stamina */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <Zap className="w-3.5 h-3.5" /> Code Stamina
                  </span>
                  <span className="text-emerald-400 font-bold">100% Full</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                </div>
              </div>

              {/* Shipping Rate */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Trophy className="w-3.5 h-3.5" /> Shipping Rate
                  </span>
                  <span className="text-amber-400 font-bold">100% S-Rank</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Overview */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
            {profileData.intro ||
              'Crafting intelligent computer vision systems, high-throughput backend APIs, and aesthetic web applications. Bridging deep learning research with production-grade engineering.'}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIChat}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Consult Lunaria AI</span>
            </button>

            <a
              href={`mailto:${email}`}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-medium transition flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-rose-400" />
              <span>Dispatch Quest Email</span>
            </a>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : email}</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <a
                href="https://github.com/AdrianTriSetiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/in/adrian-tri-setiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 transition"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* --- QUEST ARCHIVES (FEATURED ENGINEERING PROJECTS) --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Quest Archives
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              [ {projectsData.length} Bounties Cleared ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      RANK S BOUNTY
                    </span>
                    {project.private ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 flex items-center gap-1 border border-amber-500/20">
                        <Lock className="w-2.5 h-2.5" /> Enterprise Confidential
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        Public Artifact
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    {project.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 bg-slate-950/80 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-emerald-400">
                      Status: Production Deployed
                    </span>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                      >
                        <span>View Artifact</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- EQUIPPED ABILITIES / SKILL TREE --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-sky-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Equipped Abilities & Materia
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              [ Active Spellbook ]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-purple-500/30 space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-300 block">
                MYTHIC TIER
              </span>
              <h4 className="font-bold text-sm text-white">Neural & Vision</h4>
              <p className="text-xs text-slate-400">Computer Vision, OpenCV, PyTorch, LLMs, 512-d Biometrics</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-300 block">
                LEGENDARY TIER
              </span>
              <h4 className="font-bold text-sm text-white">Backend Systems</h4>
              <p className="text-xs text-slate-400">FastAPI, Python AsyncIO, Node.js, Bun, WebSockets, Go</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-sky-500/30 space-y-2">
              <span className="text-[10px] font-mono font-bold text-sky-300 block">
                EPIC TIER
              </span>
              <h4 className="font-bold text-sm text-white">3D & Reactive Web</h4>
              <p className="text-xs text-slate-400">Three.js, WebGL, React, Next.js, Vue 3, Tailwind CSS</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/30 space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-300 block">
                ANCIENT TIER
              </span>
              <h4 className="font-bold text-sm text-white">Cloud & Relational</h4>
              <p className="text-xs text-slate-400">PostgreSQL, Supabase, Docker, Linux Administration, CI</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-800 text-center text-xs font-mono text-slate-500">
          <p>ADRIANDEV // ARCHMAGE OF FULLSTACK & NEURAL REALMS • SURABAYA, ID</p>
        </footer>
      </div>
    </div>
  );
}
