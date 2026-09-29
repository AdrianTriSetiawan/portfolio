import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

export default function CleanModalFrame({
  stationTag = 'STATION // ARCHIVE',
  title = 'System Inspection',
  accentColor = '#D27D46',
  onClose,
  maxWidth = 'max-w-4xl',
  children,
}) {
  useEffect(() => {
    audio.playZoneChime();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[88vh] bg-[#FFFDF9] border-2 border-[#e5dcd3] rounded-3xl flex flex-col overflow-hidden text-[#37281D] font-sans shadow-2xl`}
        style={{
          boxShadow: '0 20px 40px -15px rgba(118, 55, 0, 0.15), 0 0 0 1px rgba(118, 55, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <header className="relative z-10 px-6 py-4 border-b border-[#f0e7dd] bg-[#FFFDF9]/95 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border text-white shadow-sm"
              style={{ backgroundColor: accentColor, borderColor: accentColor }}
            >
              {stationTag}
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#37281D] leading-tight">
                {title}
              </span>
              <span className="text-[11px] text-[#8a7260] font-medium hidden sm:inline-block">
                Adrian Tri Setiawan · Senior Engineer & AI Specialist
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6eee5] hover:bg-[#ebdccf] text-[#6b4e36] transition font-medium text-xs border border-[#decbb8] shadow-sm"
            aria-label="Close"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Modal Main Body */}
        <div className="relative z-10 flex-1 overflow-hidden flex flex-col bg-[#FFFDF9]">
          {children}
        </div>
      </div>
    </div>
  );
}
