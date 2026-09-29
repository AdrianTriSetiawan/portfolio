import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { audio } from '../audio/LoFiAudioEngine';

// Interactive Stations mapped to the Japanese Ryokan diorama
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

// --- 1. COLLISION DEFINITIONS ---
const AVATAR_RADIUS = 0.38;

// Cylindrical obstacles (trees, lanterns, stone pillars)
const CYLINDRICAL_OBSTACLES = [
  // Garden Sakura Trees
  { x: -2.76, z: 1.86, r: 0.75 },
  { x: 2.17, z: 3.35, r: 0.7 },
  { x: -2.08, z: 3.07, r: 0.6 },
  { x: 2.81, z: 8.41, r: 0.8 },
  { x: -3.67, z: 8.99, r: 0.75 },
  { x: -7.92, z: -3.27, r: 0.85 },
  { x: -9.07, z: -3.34, r: 0.85 },
  { x: -7.04, z: -10.66, r: 0.8 },
  { x: 8.31, z: -3.37, r: 0.85 },
  { x: 9.27, z: -3.06, r: 0.8 },
  { x: 10.74, z: 1.35, r: 0.8 },
  { x: 10.36, z: 1.66, r: 0.8 },
  { x: 9.84, z: 2.48, r: 0.8 },
  { x: 6.79, z: -9.17, r: 0.8 },
  { x: 7.25, z: -10.01, r: 0.85 },
  { x: -5.75, z: 8.31, r: 0.9 },
  { x: 9.42, z: 11.52, r: 0.9 },
  { x: -11.89, z: 16.78, r: 1.5 },
  { x: 11.29, z: 17.45, r: 1.5 },

  // Stone Lanterns (tōrō) & Pillars
  { x: 2.6, z: 1.35, r: 0.6 },
  { x: -4.76, z: 1.6, r: 0.6 },
  { x: 1.63, z: 8.59, r: 0.55 },
  { x: -1.59, z: 8.59, r: 0.55 },
  { x: 4.22, z: 2.76, r: 0.55 },
  { x: -3.19, z: 2.76, r: 0.55 },
];

// Box obstacles (AABB: [minX, maxX, minZ, maxZ])
const BOX_OBSTACLES = [
  // 1. House Structure (Ryokan Walls):
  // West wing of Ryokan
  { minX: -6.8, maxX: -1.55, minZ: -13.0, maxZ: -4.4 },
  // East wing of Ryokan
  { minX: 1.55, maxX: 6.8, minZ: -13.0, maxZ: -4.4 },
  // Back wall behind entrance door
  { minX: -1.55, maxX: 1.55, minZ: -13.0, maxZ: -4.3 },

  // 2. River & Water Bounds (Cannot walk into river/pond):
  // The river runs across Z in [2.8, 8.45]
  // Bridge crossing is at X in [-1.75, 1.75], Z in [2.8, 8.5]
  // Left River / Gorge
  { minX: -17.0, maxX: -1.75, minZ: 2.8, maxZ: 8.45 },
  // Right River / Pond
  { minX: 1.75, maxX: 17.0, minZ: 2.8, maxZ: 8.45 },

  // 3. Bridge Railings:
  { minX: -2.3, maxX: -1.65, minZ: 3.1, maxZ: 8.2 },
  { minX: 1.65, maxX: 2.3, minZ: 3.1, maxZ: 8.2 },

  // 4. South Boundary Wooden Fence:
  { minX: -14.0, maxX: 14.0, minZ: 13.8, maxZ: 16.0 },

  // 5. East Mountain / Cliff (cannot walk off into rock/void):
  { minX: 7.6, maxX: 18.0, minZ: -14.0, maxZ: -4.2 },
  { minX: 11.2, maxX: 18.0, minZ: -4.2, maxZ: 2.8 },
  { minX: 11.4, maxX: 18.0, minZ: 8.4, maxZ: 14.5 },

  // 6. West Cliff / Island Edge:
  { minX: -18.0, maxX: -10.2, minZ: -14.0, maxZ: 2.8 },
  { minX: -18.0, maxX: -11.0, minZ: 8.4, maxZ: 14.5 },
];

function isPositionBlocked(x, z) {
  // Hard diorama boundaries
  if (z < -13.0 || z > 13.6) return true;
  if (x < -10.8 || x > 13.6) return true;

  // Box obstacle collision check
  for (let i = 0; i < BOX_OBSTACLES.length; i++) {
    const b = BOX_OBSTACLES[i];
    if (
      x >= b.minX - AVATAR_RADIUS &&
      x <= b.maxX + AVATAR_RADIUS &&
      z >= b.minZ - AVATAR_RADIUS &&
      z <= b.maxZ + AVATAR_RADIUS
    ) {
      return true;
    }
  }

  // Cylindrical obstacle check
  for (let i = 0; i < CYLINDRICAL_OBSTACLES.length; i++) {
    const c = CYLINDRICAL_OBSTACLES[i];
    const dx = x - c.x;
    const dz = z - c.z;
    const distSq = dx * dx + dz * dz;
    const minD = c.r + AVATAR_RADIUS;
    if (distSq < minD * minD) {
      return true;
    }
  }

  return false;
}

// --- 2. PROCEDURAL 3D ANIME GIRL HAIR & ACCESSORIES ---
function createAnimeGirlHair() {
  const hairGroup = new THREE.Group();
  hairGroup.name = 'AnimeGirlHair';

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1f1d26, // Silky dark charcoal-indigo anime hair
    roughness: 0.42,
    metalness: 0.15,
  });

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xd62828, // Vibrant Japanese crimson red ribbon
    roughness: 0.38,
    metalness: 0.08,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Warm gold kanzashi ornament
    roughness: 0.28,
    metalness: 0.85,
  });

  const sakuraPetalMat = new THREE.MeshStandardMaterial({
    color: 0xffb7c5, // Sakura blossom pink
    roughness: 0.45,
    metalness: 0.05,
  });

  // mixamorig:Head center is at Y = 0.78, Z = 0.08
  hairGroup.position.set(0, 0.78, 0.08);

  // 1. Crown Hair Volume (Smooth lush anime hair cap covering head)
  const capGeo = new THREE.SphereGeometry(0.76, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.86);
  const capMesh = new THREE.Mesh(capGeo, hairMat);
  capMesh.position.set(0, 0.1, -0.12);
  capMesh.scale.set(1.02, 1.05, 1.12);
  capMesh.castShadow = true;
  hairGroup.add(capMesh);

  // 2. Cute Front Bangs / Fringe across forehead
  const bangsCount = 9;
  for (let i = 0; i < bangsCount; i++) {
    const angle = (i - (bangsCount - 1) / 2) * 0.24;
    const bangGeo = new THREE.ConeGeometry(0.12, 0.52, 8);
    bangGeo.rotateX(Math.PI);
    const bangMesh = new THREE.Mesh(bangGeo, hairMat);
    const x = Math.sin(angle) * 0.52;
    const z = Math.cos(angle) * 0.58;
    bangMesh.position.set(x, 0.08, z);
    bangMesh.rotation.set(0.38, 0, -angle * 0.75);
    bangMesh.castShadow = true;
    hairGroup.add(bangMesh);
  }

  // 3. Side Locks (Hime cut bangs framing the cheeks down to shoulders)
  [-1, 1].forEach((side) => {
    const lockGeo = new THREE.ConeGeometry(0.1, 0.85, 8);
    lockGeo.rotateX(Math.PI);
    const lockMesh = new THREE.Mesh(lockGeo, hairMat);
    lockMesh.position.set(side * 0.46, -0.45, 0.18);
    lockMesh.rotation.set(0.12, 0, side * 0.16);
    lockMesh.castShadow = true;
    hairGroup.add(lockMesh);

    // Cute red ribbon tie at side
    const tieGeo = new THREE.TorusGeometry(0.05, 0.018, 8, 16);
    const tieMesh = new THREE.Mesh(tieGeo, ribbonMat);
    tieMesh.position.set(side * 0.45, -0.52, 0.18);
    hairGroup.add(tieMesh);
  });

  // 4. Twin Tails / Flowing Pigtails
  [-1, 1].forEach((side) => {
    const tailGroup = new THREE.Group();
    tailGroup.position.set(side * 0.42, 0.06, -0.22);
    tailGroup.rotation.set(-0.2, side * 0.3, side * 0.35);

    // Big red ribbon bow
    const bowCenterGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const bowCenter = new THREE.Mesh(bowCenterGeo, ribbonMat);
    tailGroup.add(bowCenter);

    [-1, 1].forEach((wing) => {
      const wingGeo = new THREE.ConeGeometry(0.07, 0.22, 8);
      wingGeo.rotateZ((wing * Math.PI) / 2);
      const wingMesh = new THREE.Mesh(wingGeo, ribbonMat);
      wingMesh.position.set(wing * 0.12, 0, 0);
      tailGroup.add(wingMesh);
    });

    const ribbonTailGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.35, 6);
    const ribbonTail = new THREE.Mesh(ribbonTailGeo, ribbonMat);
    ribbonTail.position.set(0, -0.2, 0);
    ribbonTail.rotation.z = side * 0.2;
    tailGroup.add(ribbonTail);

    // Flowing hair strands of twin tail
    const strandCount = 4;
    for (let s = 0; s < strandCount; s++) {
      const strandGeo = new THREE.ConeGeometry(0.09 - s * 0.012, 1.05 + s * 0.1, 8);
      strandGeo.rotateX(Math.PI);
      const strandMesh = new THREE.Mesh(strandGeo, hairMat);
      strandMesh.position.set((s - 1.5) * 0.05, -0.52 - s * 0.04, -s * 0.05);
      strandMesh.rotation.set(0.16, 0, side * (0.16 + s * 0.05));
      strandMesh.castShadow = true;
      tailGroup.add(strandMesh);
    }

    hairGroup.add(tailGroup);
  });

  // 5. Traditional Japanese Sakura Flower Hairpin (Kanzashi)
  const kanzashiGroup = new THREE.Group();
  kanzashiGroup.position.set(0.42, 0.08, 0.12);
  kanzashiGroup.rotation.set(0.2, 0.4, -0.3);

  const pinGeo = new THREE.CylinderGeometry(0.012, 0.007, 0.35, 8);
  const pinMesh = new THREE.Mesh(pinGeo, goldMat);
  pinMesh.rotation.z = Math.PI / 3;
  kanzashiGroup.add(pinMesh);

  for (let p = 0; p < 5; p++) {
    const angle = (p * Math.PI * 2) / 5;
    const petalGeo = new THREE.SphereGeometry(0.048, 8, 8);
    petalGeo.scale(1.0, 0.38, 1.8);
    const petalMesh = new THREE.Mesh(petalGeo, sakuraPetalMat);
    petalMesh.position.set(Math.cos(angle) * 0.055, Math.sin(angle) * 0.055, 0.012);
    petalMesh.rotation.z = angle;
    kanzashiGroup.add(petalMesh);
  }

  const centerGeo = new THREE.SphereGeometry(0.024, 10, 10);
  const centerMesh = new THREE.Mesh(centerGeo, goldMat);
  centerMesh.position.z = 0.035;
  kanzashiGroup.add(centerMesh);

  const tasselGeo = new THREE.CylinderGeometry(0.006, 0.016, 0.18, 6);
  const tasselMesh = new THREE.Mesh(tasselGeo, goldMat);
  tasselMesh.position.set(0.025, -0.12, 0.025);
  kanzashiGroup.add(tasselMesh);

  hairGroup.add(kanzashiGroup);
  return hairGroup;
}

export default function CleanWorld({
  onProximityChange,
  onOpenStation,
  teleportTarget,
  joystickInput,
  isInspecting,
  onLoadProgress,
  onLoadComplete,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    teleportTo: null,
    activeStation: null,
  });

  const propsRef = useRef({
    onProximityChange,
    onOpenStation,
    isInspecting,
    joystickInput,
    onLoadProgress,
    onLoadComplete,
  });
  useEffect(() => {
    propsRef.current = {
      onProximityChange,
      onOpenStation,
      isInspecting,
      joystickInput,
      onLoadProgress,
      onLoadComplete,
    };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId = null;
    let hasAllModelsLoaded = false;
    let renderedFramesCount = 0;
    let hasNotifiedComplete = false;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    // Soft Japanese Sakura dawn sky background
    scene.background = new THREE.Color('#fbecee');

    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 16;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );

    camera.position.set(0, 20, 18);
    camera.lookAt(0, 1, -2);
    camera.zoom = container.clientWidth < 768 ? 0.75 : 1.0;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // 60 FPS locked, capped DPR 1.5 as per engineering specs
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting System (Camera-Coupled Sunlight & Soft Ambient) ---
    const ambientLight = new THREE.AmbientLight(0xfff5f0, 2.3);
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

    // --- 3. Traditional Japanese Lanterns & Accents ---
    // A. Hanging Red Japanese Paper Lanterns (Chōchin) with Warm Amber Glow
    function createChochin(x, y, z) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const redMat = new THREE.MeshStandardMaterial({
        color: 0xcc181e,
        emissive: 0x991014,
        emissiveIntensity: 0.65,
        roughness: 0.35,
      });

      const bodyGeo = new THREE.SphereGeometry(0.24, 16, 12);
      bodyGeo.scale(1.0, 1.35, 1.0);
      const bodyMesh = new THREE.Mesh(bodyGeo, redMat);
      group.add(bodyMesh);

      const capGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16);
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
      const topCap = new THREE.Mesh(capGeo, blackMat);
      topCap.position.y = 0.33;
      group.add(topCap);

      const btmCap = new THREE.Mesh(capGeo, blackMat);
      btmCap.position.y = -0.33;
      group.add(btmCap);

      const pl = new THREE.PointLight(0xffa23a, 2.2, 7, 1.4);
      pl.position.set(0, 0, 0);
      group.add(pl);

      scene.add(group);
      return group;
    }

    // B. Traditional Japanese Stone Lanterns (Tōrō)
    function createStoneToro(x, y, z) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x8a8a8e,
        roughness: 0.85,
        metalness: 0.05,
      });

      const fireMat = new THREE.MeshStandardMaterial({
        color: 0xffe29a,
        emissive: 0xffa022,
        emissiveIntensity: 1.2,
        roughness: 0.3,
      });

      const baseGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.22, 6);
      const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
      baseMesh.position.y = 0.11;
      group.add(baseMesh);

      const postGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.6, 6);
      const postMesh = new THREE.Mesh(postGeo, stoneMat);
      postMesh.position.y = 0.52;
      group.add(postMesh);

      const midGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.14, 6);
      const midMesh = new THREE.Mesh(midGeo, stoneMat);
      midMesh.position.y = 0.89;
      group.add(midMesh);

      const fireGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.3, 6);
      const fireMesh = new THREE.Mesh(fireGeo, fireMat);
      fireMesh.position.y = 1.11;
      group.add(fireMesh);

      const roofGeo = new THREE.ConeGeometry(0.55, 0.28, 6);
      const roofMesh = new THREE.Mesh(roofGeo, stoneMat);
      roofMesh.position.y = 1.38;
      group.add(roofMesh);

      const jewelGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const jewelMesh = new THREE.Mesh(jewelGeo, stoneMat);
      jewelMesh.position.y = 1.58;
      group.add(jewelMesh);

      const pl = new THREE.PointLight(0xffb74d, 1.8, 6, 1.3);
      pl.position.y = 1.11;
      group.add(pl);

      scene.add(group);
      return group;
    }

    createChochin(0.0, 4.4, -4.1); // Ryokan Entrance Chōchin
    createChochin(-1.8, 2.7, 8.4); // Bridge South Left
    createChochin(1.8, 2.7, 8.4);  // Bridge South Right

    createStoneToro(2.5, 0.6, 2.2);   // Pond Edge Tōrō
    createStoneToro(-2.5, 0.6, 2.2);  // Courtyard Left Tōrō
    createStoneToro(2.4, 0.6, 8.8);   // South Path Tōrō
    createStoneToro(-2.4, 0.6, 8.8);  // South Path Tōrō

    // --- 4. Falling Sakura Petals Particle System ---
    const petalCount = 420;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities = [];

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3 + 0] = (Math.random() - 0.5) * 34;
      petalPositions[i * 3 + 1] = Math.random() * 12 + 0.5;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 34;

      petalVelocities.push({
        fallSpeed: 0.75 + Math.random() * 0.85,
        driftSpeedX: (Math.random() - 0.2) * 0.65,
        driftSpeedZ: (Math.random() - 0.4) * 0.55,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.8 + Math.random() * 2.2,
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

    // Procedural Sakura Petal Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const pctx = canvas.getContext('2d');
    const grad = pctx.createRadialGradient(32, 28, 4, 32, 32, 28);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#ffb7c5');
    grad.addColorStop(0.75, '#f472b6');
    grad.addColorStop(1, 'rgba(244, 114, 182, 0)');
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.ellipse(32, 30, 22, 14, Math.PI / 4, 0, Math.PI * 2);
    pctx.fill();

    const petalTexture = new THREE.CanvasTexture(canvas);
    const petalMat = new THREE.PointsMaterial({
      size: 0.36,
      map: petalTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const petalSystem = new THREE.Points(petalGeo, petalMat);
    scene.add(petalSystem);

    // --- 5. 3D Model Loading with THREE.LoadingManager ---
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (url, loaded, total) => {
      const percent = Math.round((loaded / total) * 100);
      if (propsRef.current.onLoadProgress) {
        propsRef.current.onLoadProgress(percent, `Entering Sakura Garden... ${percent}%`);
      }
    };

    loadingManager.onLoad = () => {
      hasAllModelsLoaded = true;
    };

    const gltfLoader = new GLTFLoader(loadingManager);

    // Cute Anime Girl Player Avatar State
    const player = {
      group: new THREE.Group(),
      mesh: null,
      mixer: null,
      actions: {},
      currentAction: 'Idle',
      position: new THREE.Vector3(0, 2.3, 0.8), // Spawn near wooden bridge
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
      '/models/Models.glb?v=sakura_v9',
      (gltf) => {
        if (isDisposed) return;
        const worldScene = gltf.scene;

        worldScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
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

    // Load Cute Japanese Anime Girl (Player.glb)
    gltfLoader.load(
      '/models/Player.glb?v=cute_anime_v9',
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

        // Attach Procedural 3D Anime Girl Hair & Ribbon Bows to Head Bone
        const headBone = charScene.getObjectByName('mixamorig:Head');
        if (headBone) {
          const animeHair = createAnimeGirlHair();
          headBone.add(animeHair);
        }

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
      '/models/Duck.glb?v=v2',
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

    // --- 6. Floating 3D Station Markers & Rings ---
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    CLEAN_STATIONS.forEach((station) => {
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

    // --- 7. Input Handling (Keyboard, Touch, Click) ---
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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2.2);

    const handlePointerDown = (e) => {
      if (propsRef.current.isInspecting) return;
      if (e.target.closest('button') || e.target.closest('.hud-element') || e.target.closest('input')) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
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

    // --- 8. Teleport Handler ---
    stateRef.current.teleportTo = (stationId) => {
      const station = CLEAN_STATIONS.find((s) => s.id === stationId);
      if (!station) return;
      audio.playTeleport();
      player.position.set(station.position[0], station.position[1], station.position[2] + 1.2);
      player.group.position.copy(player.position);
      clickTarget.active = false;
    };

    // --- 9. Main Render Loop & Physics Engine ---
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

      // Animate falling sakura petals
      const positions = petalGeo.attributes.position.array;
      for (let i = 0; i < petalCount; i++) {
        const v = petalVelocities[i];
        positions[i * 3 + 1] -= v.fallSpeed * delta;
        positions[i * 3 + 0] += (v.driftSpeedX + Math.sin(time * v.wobbleSpeed + v.wobblePhase) * 0.35) * delta;
        positions[i * 3 + 2] += (v.driftSpeedZ + Math.cos(time * v.wobbleSpeed + v.wobblePhase) * 0.3) * delta;

        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 12 + Math.random() * 3;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 34;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
        }
      }
      petalGeo.attributes.position.needsUpdate = true;

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

      // Update Duck AI (waddles around pond edge)
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
        if (keys.w) moveZ -= 1;
        if (keys.s) moveZ += 1;
        if (keys.a) moveX -= 1;
        if (keys.d) moveX += 1;

        if (joystickInput && (Math.abs(joystickInput.x) > 0.05 || Math.abs(joystickInput.y) > 0.05)) {
          moveX += joystickInput.x;
          moveZ += joystickInput.y;
          clickTarget.active = false;
        }

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
        const deltaX = normX * currentSpeed * delta;
        const deltaZ = normZ * currentSpeed * delta;

        // --- OBSTACLE COLLISION & SLIDING PHYSICS ---
        const candidateX = player.position.x + deltaX;
        const candidateZ = player.position.z + deltaZ;

        // 1. Try full diagonal movement
        if (!isPositionBlocked(candidateX, candidateZ)) {
          player.position.x = candidateX;
          player.position.z = candidateZ;
        } else if (!isPositionBlocked(candidateX, player.position.z)) {
          // 2. Slide horizontally along X axis
          player.position.x = candidateX;
        } else if (!isPositionBlocked(player.position.x, candidateZ)) {
          // 3. Slide vertically along Z axis
          player.position.z = candidateZ;
        }

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

      // --- Camera Tracking ---
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

      camera.position.lerp(targetCamPos, delta * 5.0);
      currentLookAt.lerp(targetLookAt, delta * 5.0);
      camera.lookAt(currentLookAt);

      sunLight.position.set(camera.position.x + 8, camera.position.y + 12, camera.position.z - 4);
      sunLight.target.position.copy(currentLookAt);
      sunLight.target.updateMatrixWorld();

      renderer.render(scene, camera);

      // Verify all assets are 100% loaded AND at least 3 frames have rendered before unmounting loading screen
      if (hasAllModelsLoaded && !hasNotifiedComplete) {
        renderedFramesCount++;
        if (renderedFramesCount >= 3) {
          hasNotifiedComplete = true;
          if (propsRef.current.onLoadComplete) {
            propsRef.current.onLoadComplete();
          }
        }
      }
    };

    animate();

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

  useEffect(() => {
    if (teleportTarget && stateRef.current.teleportTo) {
      stateRef.current.teleportTo(teleportTarget);
    }
  }, [teleportTarget]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
}
