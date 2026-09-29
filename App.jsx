import React, { useState, useEffect, useCallback } from 'react';
import CleanWorld from './components/CleanWorld';
import CleanHUD from './components/CleanHUD';
import LoadingScreen from './components/LoadingScreen';
import ClassicView from './components/ClassicView';
import CleanProjectModal from './components/CleanModals/CleanProjectModal';
import CleanSkillModal from './components/CleanModals/CleanSkillModal';
import CleanExperienceModal from './components/CleanModals/CleanExperienceModal';
import CleanContactModal from './components/CleanModals/CleanContactModal';
import CleanAIModal from './components/CleanModals/CleanAIModal';
import { audio } from './audio/LoFiAudioEngine';

export default function App() {
  const [is2DMode, setIs2DMode] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('Entering Sakura Garden...');
  const [isLoadComplete, setIsLoadComplete] = useState(false);
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

  // Clear joystick input when modal opens
  useEffect(() => {
    if (activeModal) {
      setJoystickInput({ x: 0, y: 0 });
    }
  }, [activeModal]);

  const handleProximityChange = useCallback((station) => {
    setCurrentStation(station);
  }, []);

  const handleOpenStation = useCallback((station) => {
    if (!station) return;
    audio.playClick();
    setJoystickInput({ x: 0, y: 0 });
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
        setActiveModal('projects');
    }
  }, []);

  const handleTeleport = useCallback((stationId) => {
    setTeleportTarget(stationId);
    setTimeout(() => setTeleportTarget(null), 100);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAF6F0] select-none font-sans">
      {/* 3D Clean Diorama World */}
      {!is2DMode && (
        <>
          <CleanWorld
            onProximityChange={handleProximityChange}
            onOpenStation={handleOpenStation}
            teleportTarget={teleportTarget}
            joystickInput={joystickInput}
            isInspecting={!!activeModal}
            onLoadProgress={(p, status) => {
              setLoadProgress(p);
              setLoadStatus(status);
            }}
            onLoadComplete={() => {
              setIsLoadComplete(true);
            }}
          />
          <CleanHUD
            currentStation={currentStation}
            onInspect={handleOpenStation}
            onTeleport={handleTeleport}
            is2DMode={is2DMode}
            onToggle2D={() => setIs2DMode(true)}
            onJoystickMove={setJoystickInput}
          />
        </>
      )}

      {/* 2D Classic Portfolio Recruiter View */}
      {is2DMode && (
        <div className="w-full h-full overflow-y-auto">
          <ClassicView
            onOpenAIChat={() => setActiveModal('ai')}
            onToggle3D={() => setIs2DMode(false)}
          />
        </div>
      )}

      {/* Station Modals */}
      {activeModal === 'projects' && (
        <CleanProjectModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'skills' && (
        <CleanSkillModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'journey' && (
        <CleanExperienceModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'contact' && (
        <CleanContactModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'ai' && (
        <CleanAIModal onClose={() => setActiveModal(null)} />
      )}

      {/* Sleek Japanese Loading Screen */}
      {isLoading && (
        <LoadingScreen
          progress={loadProgress}
          statusText={loadStatus}
          isComplete={isLoadComplete}
          onDismiss={() => setIsLoading(false)}
        />
      )}
    </div>
  );
}
