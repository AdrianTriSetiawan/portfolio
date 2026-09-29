import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  Volume2,
  VolumeX,
  FileText,
  Compass,
  Sparkles,
  Layers,
  Cpu,
  Milestone,
  Mail,
  X,
  Move,
  MousePointer,
  ArrowRight,
} from 'lucide-react';
import { audio } from '../audio/LoFiAudioEngine';

export default function CleanHUD({
  currentStation,
  onInspect,
  onTeleport,
  is2DMode,
  onToggle2D,
  onJoystickMove,
}) {
  const [showHelp, setShowHelp] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const joystickRef = useRef(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });

  // Toggle Audio
  const handleToggleAudio = () => {
    audio.playClick();
    if (!isPlayingAudio) {
      audio.start();
      setIsPlayingAudio(true);
    } else {
      audio.stop();
      setIsPlayingAudio(false);
    }
  };

  // Mobile Joystick Touch Handling
  const handleTouchStart = (e) => {
    setJoystickActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const normX = (Math.cos(angle) * clampedDist) / maxRadius;
    const normY = (Math.sin(angle) * clampedDist) / maxRadius;

    setTouchPos({ x: Math.cos(angle) * clampedDist, y: Math.sin(angle) * clampedDist });
    if (onJoystickMove) {
      onJoystickMove({ x: normX, y: normY });
    }
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    setTouchPos({ x: 0, y: 0 });
    if (onJoystickMove) {
      onJoystickMove({ x: 0, y: 0 });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden font-sans">
      {/* Top Left: Controls & Recruiter Mode Buttons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2.5 pointer-events-auto">
        <button
          onClick={() => {
            audio.playClick();
            setShowHelp(true);
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border-2 border-[#e5dcd3] shadow-md flex items-center justify-center text-[#6b4e36] transition hover:scale-105 active:scale-95"
          title="Controls & Instructions"
        >
          <HelpCircle className="w-5 h-5 text-[#83511F]" />
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onToggle2D();
          }}
          className="h-10 sm:h-11 px-3.5 sm:px-4 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border-2 border-[#e5dcd3] shadow-md flex items-center gap-2 text-xs font-bold text-[#6b4e36] transition hover:scale-105 active:scale-95"
          title="Switch to Fast 2D Recruiter View"
        >
          <FileText className="w-4 h-4 text-[#D27D46]" />
          <span>2D Recruiter CV</span>
        </button>
      </div>

      {/* Top Right: Audio / Ambient Music Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-auto">
        <button
          onClick={handleToggleAudio}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95 ${
            isPlayingAudio
              ? 'bg-[#FFFDF9] border-[#D27D46] text-[#D27D46]'
              : 'bg-[#FFFDF9]/90 border-[#e5dcd3] text-[#8a7260]'
          }`}
          title={isPlayingAudio ? 'Mute Ambient Music' : 'Play Lo-Fi Music'}
        >
          {isPlayingAudio ? (
            <Volume2 className="w-5 h-5 text-[#D27D46] animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#8a7260]" />
          )}
        </button>
      </div>

      {/* Proximity Station Floating Interaction Banner */}
      {currentStation && (
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto animate-bounce">
          <button
            onClick={() => onInspect(currentStation)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FFFDF9] border-2 border-[#D27D46] shadow-xl text-[#37281D] font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition"
            style={{
              boxShadow: '0 10px 25px -5px rgba(210, 125, 70, 0.3)',
            }}
          >
            <span className="w-6 h-6 rounded-full bg-[#D27D46] text-white flex items-center justify-center text-xs font-mono font-bold">
              E
            </span>
            <span>{currentStation.prompt || `Inspect ${currentStation.title}`}</span>
            <ArrowRight className="w-4 h-4 text-[#D27D46]" />
          </button>
        </div>
      )}

      {/* Bottom Station Quick Navigation Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border-2 border-[#e5dcd3] shadow-lg max-w-[92vw] overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTeleport('projects')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4ECE2] text-[#5c4432] text-xs font-bold transition whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-[#D27D46]" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => onTeleport('skills')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4ECE2] text-[#5c4432] text-xs font-bold transition whitespace-nowrap"
          >
            <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Arsenal</span>
          </button>

          <button
            onClick={() => onTeleport('journey')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4ECE2] text-[#5c4432] text-xs font-bold transition whitespace-nowrap"
          >
            <Milestone className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Journey</span>
          </button>

          <button
            onClick={() => onTeleport('contact')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4ECE2] text-[#5c4432] text-xs font-bold transition whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Mailbox</span>
          </button>

          <button
            onClick={() => onTeleport('ai-beacon')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F4ECE2] text-[#5c4432] text-xs font-bold transition whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>AI Shrine</span>
          </button>
        </div>
      </div>

      {/* Mobile Touch Joystick (Visible on small touchscreens) */}
      <div className="sm:hidden absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-24 h-24 rounded-full bg-white/70 backdrop-blur-md border-2 border-[#decbb8] shadow-md flex items-center justify-center touch-none"
        >
          <div
            className="w-10 h-10 rounded-full bg-[#D27D46] shadow-sm transition-transform duration-75"
            style={{
              transform: `translate(${touchPos.x}px, ${touchPos.y}px)`,
            }}
          />
        </div>
      </div>

      {/* Controls Help Modal (Matching WoraWork's tactile cream paper card) */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs pointer-events-auto select-none"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border-3 border-dashed border-[#D27D46]/70 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                audio.playClick();
                setShowHelp(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4ECE2] text-[#83511F] flex items-center justify-center hover:bg-[#ebdccf] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-[#83511F] tracking-wide">
                Island Controls
              </h2>
              <p className="text-xs text-[#a8907e] font-medium">
                Explore Adrian's 3D Sanctuary & Engineering Portfolio
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Move */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#e5dcd3] flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#83511F] uppercase tracking-wider">
                  Move
                </span>
                <div className="flex flex-col items-center gap-1 font-mono font-bold text-xs text-[#83511F]">
                  <span className="w-7 h-7 rounded-lg bg-white border border-[#decbb8] shadow-xs flex items-center justify-center">
                    W
                  </span>
                  <div className="flex gap-1">
                    <span className="w-7 h-7 rounded-lg bg-white border border-[#decbb8] shadow-xs flex items-center justify-center">
                      A
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-white border border-[#decbb8] shadow-xs flex items-center justify-center">
                      S
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-white border border-[#decbb8] shadow-xs flex items-center justify-center">
                      D
                    </span>
                  </div>
                </div>
              </div>

              {/* Run */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#e5dcd3] flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#83511F] uppercase tracking-wider">
                  Run (Hold)
                </span>
                <span className="px-4 py-2 rounded-lg bg-white border border-[#decbb8] shadow-xs text-xs font-mono font-bold text-[#83511F] mt-2">
                  Shift
                </span>
              </div>

              {/* Interact */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#e5dcd3] flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#83511F] uppercase tracking-wider">
                  Interact
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-8 h-8 rounded-lg bg-white border border-[#decbb8] shadow-xs flex items-center justify-center text-xs font-mono font-bold text-[#83511F]">
                    E
                  </span>
                  <span className="text-xs text-[#a8907e] font-mono">/ Click</span>
                </div>
              </div>

              {/* Fast View */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#e5dcd3] flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#83511F] uppercase tracking-wider">
                  Recruiter CV
                </span>
                <button
                  onClick={() => {
                    setShowHelp(false);
                    onToggle2D();
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#D27D46] text-white text-xs font-bold mt-2 shadow-xs"
                >
                  Switch 2D
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] text-[#8a7260]">
              Tip: You can also click anywhere on the ground to walk directly!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
