import React, { useState, useEffect, useCallback } from 'react';
import ThreeWorld, { STATIONS } from './components/ThreeWorld';
import HUD from './components/HUD';
import ClassicView from './components/ClassicView';
import ProjectModal from './components/Modals/ProjectModal';
import SkillModal from './components/Modals/SkillModal';
import ExperienceModal from './components/Modals/ExperienceModal';
import ContactModal from './components/Modals/ContactModal';
import AIChatModal from './components/Modals/AIChatModal';
import { audio } from './audio/LoFiAudioEngine';

export default function App() {
  const [is2DMode, setIs2DMode] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });

  // Escape key closes open modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProximityChange = useCallback((station) => {
    setCurrentStation(station);
  }, []);

  const handleOpenStation = useCallback((station) => {
    if (!station) return;
    audio.playClick();

    switch (station.id) {
      case 'projects':
        setActiveModal('projects');
        break;
      case 'skills':
        setActiveModal('skills');
        break;
      case 'journey':
      case 'sanctuary':
        setActiveModal('journey');
        break;
      case 'contact':
        setActiveModal('contact');
        break;
      case 'ai-beacon':
        setActiveModal('ai');
        break;
      default:
        setActiveModal('journey');
    }
  }, []);

  const handleTeleport = useCallback((stationId) => {
    setTeleportTarget(stationId);
    // Reset after trigger so subsequent clicks work
    setTimeout(() => setTeleportTarget(null), 100);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D Game World */}
      {!is2DMode && (
        <>
          <ThreeWorld
            onProximityChange={handleProximityChange}
            onOpenStation={handleOpenStation}
            teleportTarget={teleportTarget}
            joystickInput={joystickInput}
            isInspecting={!!activeModal}
          />
          <HUD
            currentStation={currentStation}
            onInspect={handleOpenStation}
            onTeleport={handleTeleport}
            is2DMode={is2DMode}
            onToggle2D={() => setIs2DMode(true)}
            onJoystickMove={setJoystickInput}
          />
        </>
      )}

      {/* 2D Classic Portfolio Fallback */}
      {is2DMode && (
        <div className="w-full h-full overflow-y-auto">
          <ClassicView
            onOpenAIChat={() => setActiveModal('ai')}
            onToggle3D={() => setIs2DMode(false)}
          />
        </div>
      )}

      {/* Interactive Station Modals */}
      {activeModal === 'projects' && (
        <ProjectModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'skills' && (
        <SkillModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'journey' && (
        <ExperienceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'contact' && (
        <ContactModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'ai' && (
        <AIChatModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
