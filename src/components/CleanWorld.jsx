import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { audio } from '../audio/LoFiAudioEngine';

// Interactive Stations mapped to the diorama geometry
export const CLEAN_STATIONS = [
  {
    id: 'projects',
    name: 'Projects Archive',
    title: 'Featured Engineering Systems',
    tagline: 'FaceGate (ArcFace), EProcMon (150+ Scrapers), Lunaria AI, EZVIZ SDK',
    position: [0.0, 2.0, -3.8],
    lookTarget: [0.0, 2.5, -4.5],
    radius: 3.2,
    color: '#D27D46',
    prompt: 'Press [E] or Tap to Browse Projects',
  },
  {
    id: 'skills',
    name: 'Technical Arsenal',
    title: 'Skills & Architecture',
    tagline: 'Computer Vision, High-Concurrency Backends, Scrapers, 3D Web',
    position: [-5.6, 2.8, -1.0],
    lookTarget: [-6.0, 2.8, -1.0],
    radius: 3.2,
    color: '#3B82F6',
    prompt: 'Press [E] or Tap to Inspect Skills',
  },
  {
    id: 'journey',
    name: 'Milestones & Journey',
    title: 'Engineering Experience',
    tagline: 'Senior Fullstack & AI R&D Lead · Gov, Enterprise & BUMN Systems',
    position: [-8.0, 3.2, -9.5],
    lookTarget: [-8.0, 4.0, -11.5],
    radius: 3.5,
    color: '#10B981',
    prompt: 'Press [E] or Tap to View Journey',
  },
  {
    id: 'contact',
    name: 'Contact Haven',
    title: 'Direct Reach & Socials',
    tagline: 'Email, GitHub, LinkedIn, Telegram',
    position: [2.6, 3.2, 1.2],
    lookTarget: [2.6, 3.2, 1.2],
    radius: 2.8,
    color: '#F59E0B',
    prompt: 'Press [E] or Tap to Connect',
  },
  {
    id: 'ai-beacon',
    name: 'Lady Lunaria AI Shrine',
    title: 'Autonomous AI Companion',
    tagline: 'Interactive LLM Assistant & Architecture Advisor',
    position: [12.8, 2.8, 0.5],
    lookTarget: [13.5, 2.5, 2.5],
    radius: 3.2,
    color: '#8B5CF6',
    prompt: 'Press [E] or Tap to Chat with AI',
  },
];

export default function CleanWorld({
  onProximityChange,
  onOpenStation,
  teleportTarget,
  joystickInput,
  isInspecting,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    teleportTo: null,
    activeStation: null,
  });

  const propsRef = useRef({ onProximityChange, onOpenStation, isInspecting, joystickInput });
  useEffect(() => {
    propsRef.current = { onProximityChange, onOpenStation, isInspecting, joystickInput };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId = null;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    // Warm diorama clay background
    scene.background = new THREE.Color('#d48a40');

    const aspect = container.clientWidth / container.clientHeight;
    // Orthographic camera for authentic isometric diorama framing
    const frustumSize = 16;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );

    // Initial camera position matching WoraWork formula: [x, y+20, z+18]
    camera.position.set(0, 20, 18);
    camera.lookAt(0, 1, -2);
    camera.zoom = container.clientWidth < 768 ? 0.75 : 1.0;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting System (Camera-Coupled Sunlight & Soft Ambient) ---
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbf2, 3.8);
    sunLight.position.set(12, 28, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Warm accent point lights on lanterns
    const lanternPositions = [
      [1.63, 1.8, 8.59],
      [-1.59, 1.8, 8.59],
      [4.22, 4.2, 2.76],
      [-3.19, 4.2, 2.76],
      [2.6, 4.5, 1.14],
    ];
    lanternPositions.forEach(([x, y, z]) => {
      const pl = new THREE.PointLight(0xffd28f, 1.8, 8, 1.2);
      pl.position.set(x, y, z);
      scene.add(pl);
    });

    // --- 3. Ambient Floating Sparkles / Dust Motes ---
    const sparklesCount = 80;
    const sparklesGeo = new THREE.BufferGeometry();
    const sparklesPos = new Float32Array(sparklesCount * 3);
    for (let i = 0; i < sparklesCount; i++) {
      sparklesPos[i * 3 + 0] = (Math.random() - 0.5) * 36;
      sparklesPos[i * 3 + 1] = Math.random() * 8 + 1;
      sparklesPos[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    sparklesGeo.setAttribute('position', new THREE.BufferAttribute(sparklesPos, 3));
    const sparklesMat = new THREE.PointsMaterial({
      color: 0xffe6a3,
      size: 0.18,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const sparklesMesh = new THREE.Points(sparklesGeo, sparklesMat);
    scene.add(sparklesMesh);

    // --- 4. 3D Model Loading ---
    const gltfLoader = new GLTFLoader();

    // Player state & animations
    const player = {
      group: new THREE.Group(),
      mesh: null,
      mixer: null,
      actions: {},
      currentAction: 'Idle',
      position: new THREE.Vector3(0, 2.3, 0.8), // Spawn near wooden bridge
      velocity: new THREE.Vector3(),
      targetRotation: 0,
      currentRotation: 0,
      isMoving: false,
      speed: 4.8,
    };
    player.group.position.copy(player.position);
    scene.add(player.group);

    // Duck companion
    const duck = {
      group: new THREE.Group(),
      mixer: null,
      actions: {},
      position: new THREE.Vector3(1.2, 0.5, 6.5),
      targetPos: new THREE.Vector3(1.2, 0.5, 6.5),
      wanderTimer: 0,
    };
    duck.group.position.copy(duck.position);
    scene.add(duck.group);

    // Load World Models (Models.glb)
    gltfLoader.load(
      '/models/Models.glb',
      (gltf) => {
        if (isDisposed) return;
        const worldScene = gltf.scene;

        worldScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Hide sensor proxy meshes so they don't block the visual diorama
            if (child.name.includes('_Sensor')) {
              child.visible = false;
            }
            if (child.material) {
              child.material.roughness = Math.max(0.65, child.material.roughness || 0.7);
              child.material.metalness = Math.min(0.08, child.material.metalness || 0);
            }
          }
        });

        scene.add(worldScene);
      },
      undefined,
      (err) => console.error('Failed to load Models.glb:', err)
    );

    // Load Player Avatar (Player.glb)
    gltfLoader.load(
      '/models/Player.glb',
      (gltf) => {
        if (isDisposed) return;
        const charScene = gltf.scene;
        charScene.scale.set(0.9, 0.9, 0.9);
        charScene.position.set(0, 0, 0);

        charScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        player.mesh = charScene;
        player.group.add(charScene);

        // Animation Mixer
        player.mixer = new THREE.AnimationMixer(charScene);
        gltf.animations.forEach((clip) => {
          const action = player.mixer.clipAction(clip);
          player.actions[clip.name] = action;
        });

        if (player.actions['Idle']) {
          player.actions['Idle'].play();
        } else if (gltf.animations.length > 0) {
          player.mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      (err) => console.error('Failed to load Player.glb:', err)
    );

    // Load Duck Companion (Duck.glb)
    gltfLoader.load(
      '/models/Duck.glb',
      (gltf) => {
        if (isDisposed) return;
        const duckScene = gltf.scene;
        duckScene.scale.set(0.7, 0.7, 0.7);

        duckScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        duck.group.add(duckScene);
        duck.mixer = new THREE.AnimationMixer(duckScene);
        gltf.animations.forEach((clip) => {
          duck.actions[clip.name] = duck.mixer.clipAction(clip);
        });

        if (duck.actions['Duck_Idle']) {
          duck.actions['Duck_Idle'].play();
        }
      },
      undefined,
      (err) => console.error('Failed to load Duck.glb:', err)
    );

    // --- 5. Floating 3D Station Markers & Rings ---
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    CLEAN_STATIONS.forEach((station) => {
      // Glow ring on the ground
      const ringGeo = new THREE.RingGeometry(0.7, 0.95, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(station.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(station.position[0], station.position[1] + 0.05, station.position[2]);
      markersGroup.add(ringMesh);

      // Subtle beacon cylinder
      const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 24, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(station.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(station.position[0], station.position[1] + 0.2, station.position[2]);
      markersGroup.add(beamMesh);

      station.ringMesh = ringMesh;
      station.beamMesh = beamMesh;
    });

    // Helper: switch player animation
    const setPlayerAction = (name) => {
      if (!player.actions[name] || player.currentAction === name) return;
      const prev = player.actions[player.currentAction];
      const next = player.actions[name];
      if (prev) prev.fadeOut(0.2);
      if (next) {
        next.reset().fadeIn(0.2).play();
        player.currentAction = name;
      }
    };

    // --- 6. Input Handling (WASD / Arrows / Touch / Click) ---
    const keys = { w: false, a: false, s: false, d: false, shift: false };
    const clickTarget = { active: false, position: new THREE.Vector3() };

    const handleKeyDown = (e) => {
      if (propsRef.current.isInspecting) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.w = true;
      if (k === 'a' || k === 'arrowleft') keys.a = true;
      if (k === 's' || k === 'arrowdown') keys.s = true;
      if (k === 'd' || k === 'arrowright') keys.d = true;
      if (e.key === 'Shift') keys.shift = true;

      // Interact [E] or Space
      if (k === 'e' || k === ' ') {
        if (stateRef.current.activeStation) {
          propsRef.current.onOpenStation(stateRef.current.activeStation);
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.w = false;
      if (k === 'a' || k === 'arrowleft') keys.a = false;
      if (k === 's' || k === 'arrowdown') keys.s = false;
      if (k === 'd' || k === 'arrowright') keys.d = false;
      if (e.key === 'Shift') keys.shift = false;
    };

    // Click on canvas to move player or click station
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.2);

    const handlePointerDown = (e) => {
      if (propsRef.current.isInspecting) return;
      // If clicking interactive HUD/buttons, skip
      if (e.target.closest('button') || e.target.closest('.hud-element')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
        // Check if clicked directly on a station
        let clickedStation = null;
        for (const station of CLEAN_STATIONS) {
          const dx = intersection.x - station.position[0];
          const dz = intersection.z - station.position[2];
          if (Math.hypot(dx, dz) < station.radius) {
            clickedStation = station;
            break;
          }
        }

        if (clickedStation) {
          propsRef.current.onOpenStation(clickedStation);
        } else {
          clickTarget.position.copy(intersection);
          clickTarget.active = true;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);

    // --- 7. Teleport Handler ---
    stateRef.current.teleportTo = (stationId) => {
      const station = CLEAN_STATIONS.find((s) => s.id === stationId);
      if (!station) return;
      audio.playTeleport();
      player.position.set(station.position[0], station.position[1], station.position[2] + 1.2);
      player.group.position.copy(player.position);
      clickTarget.active = false;
    };

    // --- 8. Main Render Loop ---
    const clock = new THREE.Clock();
    const camOffset = new THREE.Vector3(0, 20, 18);
    const lookOffset = new THREE.Vector3(0, 1, -2);
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 1, -2);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Update sparkles floating animation
      if (sparklesMesh) {
        sparklesMesh.rotation.y = time * 0.02;
      }

      // Pulse station marker rings
      CLEAN_STATIONS.forEach((station, i) => {
        if (station.ringMesh) {
          const pulse = 1 + Math.sin(time * 3 + i) * 0.08;
          station.ringMesh.scale.set(pulse, pulse, pulse);
        }
        if (station.beamMesh) {
          station.beamMesh.rotation.y += delta * 0.5;
        }
      });

      // Update Duck AI (waddles around pond)
      if (duck.mixer) {
        duck.mixer.update(delta);
      }
      duck.wanderTimer -= delta;
      if (duck.wanderTimer <= 0) {
        duck.wanderTimer = 3.5 + Math.random() * 3;
        duck.targetPos.set(
          1.0 + (Math.random() - 0.5) * 3,
          0.5,
          6.5 + (Math.random() - 0.5) * 3
        );
      }
      const duckDist = duck.position.distanceTo(duck.targetPos);
      if (duckDist > 0.15) {
        const duckDir = new THREE.Vector3().subVectors(duck.targetPos, duck.position).normalize();
        duck.position.addScaledVector(duckDir, delta * 0.9);
        duck.group.position.copy(duck.position);
        duck.group.rotation.y = Math.atan2(duckDir.x, duckDir.z);
        if (duck.actions['Duck_Walk']) {
          duck.actions['Duck_Walk'].play();
        }
      } else {
        if (duck.actions['Duck_Idle']) {
          duck.actions['Duck_Idle'].play();
        }
      }

      // --- Movement Input Integration ---
      const { joystickInput, isInspecting } = propsRef.current;
      let moveX = 0;
      let moveZ = 0;

      if (!isInspecting) {
        // Keyboard inputs
        if (keys.w) moveZ -= 1;
        if (keys.s) moveZ += 1;
        if (keys.a) moveX -= 1;
        if (keys.d) moveX += 1;

        // Mobile joystick inputs
        if (joystickInput && (Math.abs(joystickInput.x) > 0.05 || Math.abs(joystickInput.y) > 0.05)) {
          moveX += joystickInput.x;
          moveZ += joystickInput.y;
          clickTarget.active = false;
        }

        // Click-to-move
        if (clickTarget.active) {
          const toTargetX = clickTarget.position.x - player.position.x;
          const toTargetZ = clickTarget.position.z - player.position.z;
          const dist = Math.hypot(toTargetX, toTargetZ);
          if (dist > 0.3) {
            moveX = toTargetX / dist;
            moveZ = toTargetZ / dist;
          } else {
            clickTarget.active = false;
          }
        }
      }

      const inputLen = Math.hypot(moveX, moveZ);
      const isMoving = inputLen > 0.1;
      player.isMoving = isMoving;

      if (isMoving) {
        clickTarget.active = false;
        const normX = moveX / inputLen;
        const normZ = moveZ / inputLen;

        const currentSpeed = keys.shift ? player.speed * 1.5 : player.speed;
        player.position.x += normX * currentSpeed * delta;
        player.position.z += normZ * currentSpeed * delta;

        // Island boundaries (clamp so character stays on diorama)
        player.position.x = THREE.MathUtils.clamp(player.position.x, -16, 16);
        player.position.z = THREE.MathUtils.clamp(player.position.z, -15, 12);

        // Smooth rotation towards movement direction
        player.targetRotation = Math.atan2(normX, normZ);
        let diff = player.targetRotation - player.currentRotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        player.currentRotation += diff * Math.min(delta * 12, 1);

        player.group.rotation.y = player.currentRotation;

        setPlayerAction(keys.shift ? 'Run' : 'Walk');
      } else {
        setPlayerAction('Idle');
      }

      player.group.position.copy(player.position);

      if (player.mixer) {
        player.mixer.update(delta);
      }

      // --- Proximity to Stations ---
      let nearest = null;
      let minDistance = Infinity;
      CLEAN_STATIONS.forEach((station) => {
        const dx = player.position.x - station.position[0];
        const dz = player.position.z - station.position[2];
        const dist = Math.hypot(dx, dz);
        if (dist < station.radius && dist < minDistance) {
          nearest = station;
          minDistance = dist;
        }
      });

      if (nearest !== stateRef.current.activeStation) {
        stateRef.current.activeStation = nearest;
        propsRef.current.onProximityChange(nearest);
        if (nearest) {
          audio.playClick();
        }
      }

      // --- Camera Tracking (Smooth Damping) ---
      targetCamPos.set(
        player.position.x + camOffset.x,
        player.position.y + camOffset.y,
        player.position.z + camOffset.z
      );
      targetLookAt.set(
        player.position.x + lookOffset.x,
        player.position.y + lookOffset.y,
        player.position.z + lookOffset.z
      );

      // Smooth camera lerp matching WoraWork's delta * 5 formula
      camera.position.lerp(targetCamPos, delta * 5.0);
      currentLookAt.lerp(targetLookAt, delta * 5.0);
      camera.lookAt(currentLookAt);

      // Move sunlight with camera to keep shadow map crisp
      sunLight.position.set(camera.position.x + 8, camera.position.y + 12, camera.position.z - 4);
      sunLight.target.position.copy(currentLookAt);
      sunLight.target.updateMatrixWorld();

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const curAspect = w / h;

      camera.left = (-frustumSize * curAspect) / 2;
      camera.right = (frustumSize * curAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.zoom = w < 768 ? 0.75 : 1.0;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // External teleport trigger
  useEffect(() => {
    if (teleportTarget && stateRef.current.teleportTo) {
      stateRef.current.teleportTo(teleportTarget);
    }
  }, [teleportTarget]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
}
