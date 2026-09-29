import React, { useEffect } from 'react';
import { X, Sparkles, Coffee, Zap, Trophy, ShieldCheck } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

export default function ShrineModalFrame({
  title,
  subtitle,
  stationTag = 'SHRINE CONSOLE // LEVEL 99',
  accentColor = 'emerald', // emerald, sky, purple, orange, rose
  onClose,
  maxWidth = 'max-w-4xl',
  children,
}) {
  // Play atmospheric chime when inspection shrine opens
  useEffect(() => {
    audio.playZoneChime();
  }, []);

  const accentStyles = {
    emerald: {
      border: 'border-emerald-500/50 shadow-[0_0_35px_rgba(52,211,153,0.22)]',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
      glow: 'bg-emerald-400',
    },
    sky: {
      border: 'border-sky-500/50 shadow-[0_0_35px_rgba(56,189,248,0.22)]',
      badge: 'bg-sky-500/15 text-sky-300 border-sky-400/40',
      glow: 'bg-sky-400',
    },
    purple: {
      border: 'border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.22)]',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-400/40',
      glow: 'bg-purple-400',
    },
    orange: {
      border: 'border-amber-500/50 shadow-[0_0_35px_rgba(251,191,36,0.22)]',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
      glow: 'bg-amber-400',
    },
    rose: {
      border: 'border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.22)]',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-400/40',
      glow: 'bg-rose-400',
    },
  }[accentColor] || {
    border: 'border-emerald-500/50 shadow-[0_0_35px_rgba(52,211,153,0.22)]',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    glow: 'bg-emerald-400',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-slate-900/95 border ${accentStyles.border} rounded-3xl flex flex-col overflow-hidden text-slate-100 font-sans shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Cyber Scanline Texture */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,22,34,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-0" />

        {/* Decorative RPG Corner Brackets */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 tracking-widest z-10 pointer-events-none">
          [ ✦ SYS_OK ]
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 tracking-widest z-10 pointer-events-none">
          [ V99.4_ACTIVE ]
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 tracking-widest z-10 pointer-events-none">
          [ ⚡ ARCHMAGE ]
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 tracking-widest z-10 pointer-events-none">
          [ NEURAL_SYNC ]
        </div>

        {/* --- RPG CONSOLE TOP STATUS BAR --- */}
        <header className="relative z-10 px-5 pt-5 pb-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-col gap-3">
          {/* Top Line: Station Badge, Level Title, Close Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${accentStyles.badge} flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${accentStyles.glow} animate-ping`} />
                {stationTag}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                // ADRIANDEV_OS
              </span>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-400/50 text-slate-300 hover:text-rose-200 transition text-xs font-mono"
            >
              <span>[ ESC ]</span>
              <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Character RPG Status Banner: Archmage Lv.99 + Stats Bars */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            {/* Left: Avatar Badge & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 p-[2px] shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg font-black text-amber-300">
                    巫
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black font-mono text-[9px] rounded-md shadow">
                  Lv.99
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span>Adrian Tri Setiawan</span>
                    <span className="text-[11px] font-normal text-amber-300 font-mono">
                      (Archmage of Fullstack & Neural Engineering)
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400 tracking-wide mt-0.5">
                  Class: <b className="text-slate-200">Miko Guardian of Systems</b> • Base: <b className="text-slate-200">Surabaya / Jakarta</b>
                </p>
              </div>
            </div>

            {/* Right: RPG Stats Bars (Coffee Mana, Code Stamina, Shipping Rate) */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              {/* Coffee Mana */}
              <div className="flex flex-col gap-1 min-w-[90px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-sky-300">
                    <Coffee className="w-3 h-3" /> Mana
                  </span>
                  <span className="text-sky-400 font-bold">999/999</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full w-full" />
                </div>
              </div>

              {/* Code Stamina */}
              <div className="flex flex-col gap-1 min-w-[90px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Zap className="w-3 h-3" /> Stamina
                  </span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                </div>
              </div>

              {/* Shipping Rate */}
              <div className="hidden sm:flex flex-col gap-1 min-w-[90px]">
                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Trophy className="w-3 h-3" /> Ship
                  </span>
                  <span className="text-amber-400 font-bold">100%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Modal Main Body Content */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
