import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ progress = 0, statusText, isComplete, onDismiss }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setFading(true);
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onDismiss]);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF6F0] select-none transition-opacity duration-700 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 40%, rgba(255, 230, 236, 0.45) 0%, rgba(250, 246, 240, 0.95) 75%)`,
      }}
    >
      {/* Drifting Floating Sakura Petals in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-[#ffb7c5] to-[#f472b6] opacity-70 animate-petal-drift"
            style={{
              width: `${12 + (i % 4) * 5}px`,
              height: `${18 + (i % 4) * 6}px`,
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              left: `${(i * 6.5) % 100}%`,
              top: `${-10 + (i * 7) % 30}%`,
              animationDelay: `${(i * 0.45).toFixed(1)}s`,
              animationDuration: `${5 + (i % 5) * 1.2}s`,
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </div>

      {/* Main Japanese Gate / Mon Emblem Container */}
      <div className="relative flex flex-col items-center px-8 py-10 rounded-3xl bg-[#FFFDF9]/85 backdrop-blur-md border border-[#E8DEC8] shadow-2xl max-w-sm sm:max-w-md w-[90%] text-center">
        {/* Japanese Crimson Red Sun & Sakura Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 rounded-full bg-[#E11D48]/15 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#BE123C] to-[#F43F5E] shadow-lg flex items-center justify-center">
            {/* Sakura 5-Petal Flower Symbol */}
            <svg
              className="w-9 h-9 text-white animate-spin-slow"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ animationDuration: '24s' }}
            >
              <path d="M12 2C13 5 15 7 18 7C15 9 14 12 15 15C13 14 11 15 9 17C9 14 7 13 4 13C7 11 8 9 7 6C9 7 11 6 12 2Z" />
            </svg>
          </div>
        </div>

        {/* Japanese Kanji + English Typography */}
        <div className="mb-2">
          <span className="text-xs tracking-[0.35em] uppercase text-[#BE123C] font-semibold">
            桜の庭園 // DIORAMA REALM
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B2D42] mt-1 tracking-tight">
            Sakura Garden
          </h1>
        </div>

        <p className="text-xs text-[#6B5A4B] mb-7 font-sans font-medium tracking-wide">
          Adrian Tri Setiawan · Interactive Ryokan Portfolio
        </p>

        {/* Progress Bar Container */}
        <div className="w-full mb-3">
          <div className="w-full h-2 rounded-full bg-[#E8DEC8]/60 overflow-hidden p-0.5 border border-[#DECBB8]/50 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F472B6] via-[#FB7185] to-[#E11D48] transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        {/* Progress Percentage & Status */}
        <div className="flex items-center justify-between w-full text-xs font-mono font-medium text-[#7C6652]">
          <span className="truncate max-w-[240px]">
            {statusText || `Entering Sakura Garden...`}
          </span>
          <span className="font-bold text-[#BE123C] ml-2">
            {clampedProgress}%
          </span>
        </div>
      </div>

      {/* Subtle footer */}
      <div className="absolute bottom-6 text-[11px] text-[#A89685] tracking-widest uppercase">
        60 FPS · Three.js · Japanese Lo-Fi Audio
      </div>
    </div>
  );
}
