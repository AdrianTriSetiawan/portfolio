import React, { useEffect } from 'react';
import { X, CheckCircle2, Shield } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

export default function ShrineModalFrame({
  stationTag = 'SYSTEMS CONSOLE // ARCHIVE',
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
      border: 'border-emerald-500/40 shadow-[0_0_40px_rgba(52,211,153,0.18)]',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
      glow: 'bg-emerald-400',
    },
    sky: {
      border: 'border-sky-500/40 shadow-[0_0_40px_rgba(56,189,248,0.18)]',
      badge: 'bg-sky-500/10 text-sky-300 border-sky-400/40',
      glow: 'bg-sky-400',
    },
    purple: {
      border: 'border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.18)]',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-400/40',
      glow: 'bg-purple-400',
    },
    orange: {
      border: 'border-amber-500/40 shadow-[0_0_40px_rgba(251,191,36,0.18)]',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
      glow: 'bg-amber-400',
    },
    rose: {
      border: 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.18)]',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-400/40',
      glow: 'bg-rose-400',
    },
  }[accentColor] || {
    border: 'border-emerald-500/40 shadow-[0_0_40px_rgba(52,211,153,0.18)]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
    glow: 'bg-emerald-400',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-slate-950/95 border ${accentStyles.border} rounded-2xl flex flex-col overflow-hidden text-slate-100 font-sans shadow-2xl backdrop-blur-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <header className="relative z-10 px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${accentStyles.badge} flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${accentStyles.glow} animate-pulse`} />
              {stationTag}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
              Adrian Tri Setiawan · Portfolio System
            </span>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="group flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-400/50 text-slate-400 hover:text-rose-200 transition text-xs font-mono"
          >
            <span>ESC</span>
            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
          </button>
        </header>

        {/* Modal Main Body Content */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
