import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import CleanHUD from './components/CleanHUD';
import LoadingScreen from './components/LoadingScreen';
import ClassicView from './components/ClassicView';
import CharacterDialogue from './components/CharacterDialogue';
import { audio } from './audio/LoFiAudioEngine';

// Lazy load heavy 3D worlds and modals for instant initial load (sub-second FCP)
const CleanWorld = lazy(() => import('./components/CleanWorld'));
const ThreeWorld = lazy(() => import('./components/ThreeWorld'));
const CleanProjectModal = lazy(() => import('./components/CleanModals/CleanProjectModal'));
const CleanSkillModal = lazy(() => import('./components/CleanModals/CleanSkillModal'));
const CleanExperienceModal = lazy(() => import('./components/CleanModals/CleanExperienceModal'));
const CleanContactModal = lazy(() => import('./components/CleanModals/CleanContactModal'));
const CleanAIModal = lazy(() => import('./components/CleanModals/CleanAIModal'));
export default function App() {
  const [is2DMode, setIs2DMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === '2d' || params.get('mode') === '2d' || params.get('classic') === 'true';
    }
    return false;
  });
  const [currentStation, setCurrentStation] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(!is2DMode);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('Entering Sakura Garden...');
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);
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
  // If in 2D mode, dismiss loading screen immediately
  useEffect(() => {
    if (is2DMode) {
      setIsLoading(false);
    }
  }, [is2DMode]);


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
          <Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0] z-10">
                <div className="w-10 h-10 border-3 border-[#D27D46]/20 border-t-[#D27D46] rounded-full animate-spin" />
                <p className="mt-3 text-xs font-mono tracking-widest text-[#7C6652] uppercase">
                  Entering Garden...
                </p>
              </div>
            }
          >
            <CleanWorld
              onProximityChange={handleProximityChange}
              onOpenStation={handleOpenStation}
              teleportTarget={teleportTarget}
              joystickInput={joystickInput}
              isInspecting={!!activeModal}
              isMovementLocked={isDialogueOpen}
              onLoadProgress={(p, status) => {
                setLoadProgress(p);
                setLoadStatus(status);
              }}
              onLoadComplete={() => {
                setIsLoadComplete(true);
              }}
            />
          </Suspense>
          <CleanHUD
            currentStation={currentStation}
            onInspect={handleOpenStation}
            onTeleport={handleTeleport}
            is2DMode={is2DMode}
            onToggle2D={() => setIs2DMode(true)}
            onJoystickMove={setJoystickInput}
          />
          {/* Initial Character Greeting Dialogue (WoraWork style onboarding) */}
          {!isLoading && isDialogueOpen && (
            <CharacterDialogue
              onComplete={() => setIsDialogueOpen(false)}
            />
          )}
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
      <Suspense fallback={null}>
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
      </Suspense>
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
