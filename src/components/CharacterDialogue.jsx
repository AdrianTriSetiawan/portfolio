import React, { useState, useEffect, useRef } from 'react';

export const GREETING_TEXT =
  "Hi, I'm Adrian Tri Setiawan! 🌸 Welcome to my interactive 3D portfolio. Explore the garden and studio, inspect glowing stations, or step inside!";

export const GREETING_DIALOGUES = [GREETING_TEXT];

export default function CharacterDialogue({ onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const typeTimerRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;
    setDisplayText('');
    setIsTyping(true);
    let charIdx = 0;

    clearInterval(typeTimerRef.current);
    typeTimerRef.current = setInterval(() => {
      charIdx += 2;
      if (charIdx <= GREETING_TEXT.length) {
        setDisplayText(GREETING_TEXT.slice(0, charIdx));
      } else {
        setDisplayText(GREETING_TEXT);
        setIsTyping(false);
        clearInterval(typeTimerRef.current);
      }
    }, 18);

    return () => clearInterval(typeTimerRef.current);
  }, [isVisible]);

  const dismissDialogue = () => {
    if (isTyping) {
      clearInterval(typeTimerRef.current);
      setDisplayText(GREETING_TEXT);
      setIsTyping(false);
      return;
    }
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (['Space', 'Enter', 'KeyE'].includes(e.code)) {
        e.preventDefault();
        dismissDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isTyping]);

  if (!isVisible) return null;

  return (
    <div
      onClick={dismissDialogue}
      className="fixed inset-0 z-40 pointer-events-auto flex flex-col items-center justify-end pb-28 sm:pb-32 px-4 select-none cursor-pointer"
    >
      <div className="playerSay-ui animate-popIn flex flex-col items-center gap-3 !max-w-md sm:!max-w-lg !px-6 !py-4 text-center">
        <span className="text-[#5c3511] font-semibold text-sm sm:text-base leading-relaxed">
          {displayText}
        </span>
        <div className="pt-1">
          <button
            type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-white bg-[#83511F] hover:bg-[#633a11] active:scale-95 px-4 py-1.5 rounded-full border border-[#83511F]/50 shadow-md cursor-pointer transition-all"
          >
            Let's Explore →
          </button>
        </div>
      </div>
    </div>
  );
}
