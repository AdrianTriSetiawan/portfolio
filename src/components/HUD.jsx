import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../audio/LoFiAudioEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Mail,
  Bot,
} from 'lucide-react';
import { STATIONS } from './ThreeWorld';

export default function HUD({
  currentStation,
  onInspect,
  onTeleport,
  is2DMode,
  onToggle2D,
  onJoystickMove,
}) {
  const [audioState, setAudioState] = useState(audio.getStatus());
  const [showTeleportMenu, setShowTeleportMenu] = useState(false);

  // Subscribe to Lo-Fi Audio Engine
  useEffect(() => {
    return audio.subscribe((status) => {
      setAudioState(status);
    });
  }, []);

  // Virtual Joystick Pointer Handlers
  const stickRef = useRef(null);
  const knobRef = useRef(null);
  const [isTouchingStick, setIsTouchingStick] = useState(false);
  const stickCenterRef = useRef({ x: 0, y: 0 });

  const handleStickDown = (e) => {
    e.preventDefault();
    if (!stickRef.current) return;
    const rect = stickRef.current.getBoundingClientRect();
    stickCenterRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setIsTouchingStick(true);
    handleStickMove(e);
  };

  const handleStickMove = (e) => {
    if (!isTouchingStick && e.type !== 'pointerdown') return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const dx = clientX - stickCenterRef.current.x;
    const dy = clientY - stickCenterRef.current.y;
    const radius = 45; // max travel radius
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(distance, radius);
    const angle = Math.atan2(dy, dx);

    const normX = (Math.cos(angle) * clampedDist) / radius;
    const normY = (Math.sin(angle) * clampedDist) / radius;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${normX * radius}px, ${normY * radius}px)`;
    }

    if (onJoystickMove) {
      onJoystickMove({ x: normX, y: normY });
    }
  };

  const handleStickUp = () => {
    setIsTouchingStick(false);
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
    if (onJoystickMove) {
      onJoystickMove({ x: 0, y: 0 });
    }
  };

  const stationIcons = {
    sanctuary: Compass,
    projects: Terminal,
    skills: Cpu,
    journey: Sparkles,
    contact: Mail,
    'ai-beacon': Bot,
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-3 md:p-6 select-none font-sans">
      {/* --- TOP BAR: Header, Audio HUD, Teleport & Mode Toggle --- */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Profile Card Pill */}
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full shadow-lg text-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white leading-tight">
              Adrian Tri Setiawan
            </h1>
            <p className="text-[11px] text-slate-400 tracking-wider">Fullstack & AI Engineer</p>
          </div>
        </div>

        {/* Center: Island Teleport Quick Buttons (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/75 backdrop-blur-md border border-slate-700/50 rounded-full shadow-lg">
          {STATIONS.map((station) => {
            const Icon = stationIcons[station.id] || Compass;
            const isActive = currentStation?.id === station.id;
            return (
              <button
                key={station.id}
                onClick={() => {
                  audio.playClick();
                  onTeleport(station.id);
                }}
                className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{station.name.replace(' Island', '').replace(' Pavilion', '')}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Audio Player HUD & 2D/3D Mode Switch */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio HUD Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-full shadow-lg text-slate-200">
            <button
              onClick={() => {
                audio.playClick();
                audio.toggle();
              }}
              title={audioState.isPlaying ? 'Pause Lo-Fi Music' : 'Play Lo-Fi Music'}
              className="p-1 rounded-full hover:bg-slate-800 text-emerald-400 transition"
            >
              {audioState.isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>

            {/* Track Title */}
            <div className="hidden sm:flex flex-col text-[11px] leading-tight pr-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                Lo-Fi Radio
              </span>
              <span className="font-mono text-emerald-300 max-w-[130px] truncate">
                {audioState.trackName}
              </span>
            </div>

            {/* Volume & Mute */}
            <button
              onClick={() => {
                audio.playClick();
                audio.toggleMute();
              }}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              {audioState.isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.isMuted ? 0 : audioState.volume}
              onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
              className="w-14 h-1 accent-emerald-400 bg-slate-700 rounded-lg cursor-pointer hidden md:block"
            />
          </div>

          {/* 2D / 3D Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              onToggle2D();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full text-xs font-semibold shadow-lg border border-purple-400/30 transition-transform active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{is2DMode ? '3D World' : '2D View'}</span>
          </button>
        </div>
      </header>

      {/* --- PROXIMITY INTERACTION BANNER (CENTER BOTTOM) --- */}
      {currentStation && (
        <div className="pointer-events-auto self-center mb-16 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-3.5 bg-slate-900/90 backdrop-blur-xl border border-emerald-400/50 rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.25)] text-slate-100 max-w-lg">
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="font-semibold text-emerald-300 text-sm tracking-wide">
                  {currentStation.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentStation.tagline}</p>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                onInspect(currentStation);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>Inspect Station [E]</span>
            </button>
          </div>
        </div>
      )}

      {/* --- BOTTOM ROW: Controls Helper (Desktop) & Touch Controls (Mobile) --- */}
      <footer className="flex items-end justify-between w-full">
        {/* Desktop Controls Legend */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-full text-[11px] text-slate-400">
          <span>
            Move: <b className="text-slate-200">W, A, S, D</b>
          </span>
          <span>•</span>
          <span>
            Jump: <b className="text-slate-200">Space</b>
          </span>
          <span>•</span>
          <span>
            Orbit: <b className="text-slate-200">Drag Mouse</b>
          </span>
          <span>•</span>
          <span>
            Inspect: <b className="text-slate-200">[E]</b>
          </span>
        </div>

        {/* Mobile Teleport Dropdown / Drawer Button */}
        <div className="lg:hidden pointer-events-auto relative">
          <button
            onClick={() => setShowTeleportMenu(!showTeleportMenu)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-xs text-slate-200 shadow-md"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Islands</span>
          </button>

          {showTeleportMenu && (
            <div className="absolute bottom-12 left-0 w-44 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-50">
              {STATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    audio.playClick();
                    onTeleport(station.id);
                    setShowTeleportMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-left rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{station.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile On-Screen Virtual Joystick & Action Button */}
        <div className="md:hidden pointer-events-auto flex items-end justify-between w-full mt-auto">
          {/* Joystick Base */}
          <div
            ref={stickRef}
            onPointerDown={handleStickDown}
            onPointerMove={handleStickMove}
            onPointerUp={handleStickUp}
            onPointerCancel={handleStickUp}
            className="w-24 h-24 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 flex items-center justify-center relative touch-none select-none shadow-xl"
          >
            <div
              ref={knobRef}
              className="w-10 h-10 rounded-full bg-emerald-400/90 shadow-[0_0_14px_rgba(52,211,153,0.6)] pointer-events-none transition-transform duration-75"
            />
          </div>

          {/* Action / Jump Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if (currentStation) {
                  audio.playClick();
                  onInspect(currentStation);
                } else {
                  audio.playJump();
                }
              }}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_18px_rgba(52,211,153,0.4)] flex flex-col items-center justify-center active:scale-90 transition-transform select-none"
            >
              <span>{currentStation ? 'INSPECT' : 'JUMP'}</span>
              <span className="text-[9px] opacity-70">{currentStation ? '[E]' : '[Space]'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
