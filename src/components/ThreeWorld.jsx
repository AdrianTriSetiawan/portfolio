import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { audio } from '../audio/LoFiAudioEngine';

// Island Stations coordinates and meta
export const STATIONS = [
  {
    id: 'sanctuary',
    name: 'Sanctuary Spawn',
    title: 'Adrian Tri Setiawan',
    tagline: 'Fullstack Engineer & AI R&D',
    position: [0, 0, 0],
    color: 0xffd166,
    prompt: 'Press [E] or Tap to Inspect Bio',
  },
  {
    id: 'projects',
    name: 'Projects Pavilion',
    title: 'Featured Engineering Works',
    tagline: 'FaceGate, EProcMon, Lunaria, EZVIZ, Procurement Suite',
    position: [-26, 2, -4],
    color: 0x06d6a0,
    prompt: 'Press [E] or Tap to Browse Projects',
  },
  {
    id: 'skills',
    name: 'Skills Grove',
    title: 'Technical Arsenal',
    tagline: 'Frontend, Backend, AI/ML, Databases',
    position: [0, 3, -28],
    color: 0x118ab2,
    prompt: 'Press [E] or Tap to View Skills',
  },
  {
    id: 'journey',
    name: 'Journey Lookout',
    title: 'Experience & Milestones',
    tagline: 'Fullstack, AI R&D, System Architecture',
    position: [26, 3.5, -2],
    color: 0xf78c6c,
    prompt: 'Press [E] or Tap to View Journey',
  },
  {
    id: 'contact',
    name: 'Contact Haven',
    title: 'Direct Reach & Socials',
    tagline: 'Email, GitHub, LinkedIn, Telegram',
    position: [2, 1.5, 22],
    color: 0xef476f,
    prompt: 'Press [E] or Tap to Connect',
  },
  {
    id: 'ai-beacon',
    name: 'AI Companion Shrine',
    title: 'Lady Lunaria & Clawbot AI',
    tagline: 'Interactive LLM Assistant powered by SSE API',
    position: [11, 1.8, 8],
    color: 0x9d4edd,
    prompt: 'Press [E] or Tap to Chat with AI',
  },
];

export default function ThreeWorld({
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x181a2e);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x23253b, 0.015);

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      180
    );
    camera.position.set(0, 10, 14);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
      depth: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment (Zero-file IBL reflection)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();

    // --- 2. Post-Processing Chain (Bloom & Tone Mapping) ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.48, // bloom strength
      0.35, // bloom radius
      0.82  // threshold for emissives
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // --- 3. Lighting: Twilight Pastel Sun & Ambient Glow ---
    const ambientLight = new THREE.HemisphereLight(0xf0c5b5, 0x1f2238, 1.4);
    scene.add(ambientLight);

    const sunsetLight = new THREE.DirectionalLight(0xffa07a, 2.2);
    sunsetLight.position.set(-18, 28, 16);
    sunsetLight.castShadow = true;
    sunsetLight.shadow.mapSize.set(1024, 1024);
    sunsetLight.shadow.camera.near = 0.5;
    sunsetLight.shadow.camera.far = 80;
    sunsetLight.shadow.camera.left = -32;
    sunsetLight.shadow.camera.right = 32;
    sunsetLight.shadow.camera.top = 32;
    sunsetLight.shadow.camera.bottom = -32;
    sunsetLight.shadow.bias = -0.0006;
    scene.add(sunsetLight);

    // --- 4. Twilight Sky Dome & Low-Poly Cloud Sea ---
    // Procedural Sky Dome
    const skyGeo = new THREE.SphereGeometry(140, 24, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x13152c) },    // deep twilight indigo
        horizonColor: { value: new THREE.Color(0xd27575) },// sunset peach
        bottomColor: { value: new THREE.Color(0x2c223b) }, // warm purple haze
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 col = h > 0.0 ? mix(horizonColor, topColor, pow(h, 0.6)) : mix(horizonColor, bottomColor, -h);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // Dreamy Low-Poly Cloud Sea below the islands
    const cloudsGroup = new THREE.Group();
    const cloudGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x413c58,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
    for (let i = 0; i < 35; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      const angle = (i / 35) * Math.PI * 2;
      const radius = 25 + (i % 5) * 8;
      cloud.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 8,
        -11 + Math.sin(i * 3) * 2,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 8
      );
      const scale = 1.2 + Math.random() * 2.2;
      cloud.scale.set(scale * 1.8, scale * 0.7, scale * 1.5);
      cloudsGroup.add(cloud);
    }
    scene.add(cloudsGroup);

    // Drifting Fireflies & Luminous Embers
    const fireflyCount = 140;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflyPhases = new Float32Array(fireflyCount);
    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3 + 0] = (Math.random() - 0.5) * 75;
      fireflyPositions[i * 3 + 1] = 1.0 + Math.random() * 12;
      fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 75;
      fireflyPhases[i] = Math.random() * Math.PI * 2;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.45,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflies);

    // --- 5. Floating Islands Construction ---
    const islandsGroup = new THREE.Group();

    // Helper to create aesthetic floating island with rock base & grass top
    function createIsland(x, y, z, radius, height, mainColor = 0x2d3446) {
      const island = new THREE.Group();
      island.position.set(x, y, z);

      // Top grass / pavement plateau
      const topGeo = new THREE.CylinderGeometry(radius, radius * 1.08, 0.9, 12);
      const topMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        roughness: 0.75,
        metalness: 0.15,
        flatShading: true,
      });
      const top = new THREE.Mesh(topGeo, topMat);
      top.receiveShadow = true;
      top.position.y = 0;
      island.add(top);

      // Underside hanging craggy rocks (cone tapering down)
      const baseGeo = new THREE.ConeGeometry(radius * 1.05, height, 8);
      baseGeo.rotateX(Math.PI);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x191e2b,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -height / 2;
      island.add(base);

      // Edge glow rim strip
      const rimGeo = new THREE.TorusGeometry(radius * 1.04, 0.08, 6, 24);
      rimGeo.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffd166,
        emissiveIntensity: 0.9,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.y = 0.42;
      island.add(rim);

      return island;
    }

    // 1. Sanctuary Island (Spawn)
    const sanctuaryIsland = createIsland(0, 0, 0, 7.5, 5.5, 0x2b3044);
    // Torii archway / Gate
    const archMat = new THREE.MeshStandardMaterial({ color: 0xef476f, roughness: 0.4 });
    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.8, 8);
    const leftPillar = new THREE.Mesh(pillarGeo, archMat);
    leftPillar.position.set(-2.2, 1.9, -3.0);
    leftPillar.castShadow = true;
    const rightPillar = new THREE.Mesh(pillarGeo, archMat);
    rightPillar.position.set(2.2, 1.9, -3.0);
    rightPillar.castShadow = true;
    const beamGeo = new THREE.BoxGeometry(5.4, 0.45, 0.45);
    const beam = new THREE.Mesh(beamGeo, archMat);
    beam.position.set(0, 3.8, -3.0);
    beam.castShadow = true;
    sanctuaryIsland.add(leftPillar, rightPillar, beam);

    // Glowing Stone Lantern
    const lanternGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xffd166,
      emissiveIntensity: 3.0,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 1.1, -2.8);
    sanctuaryIsland.add(lantern);
    islandsGroup.add(sanctuaryIsland);

    // 2. Projects Pavilion Island
    const projectsIsland = createIsland(-26, 2, -4, 9.0, 6.5, 0x26333c);
    // 5 Holographic Project Terminal Pedestals
    const terminalGeo = new THREE.BoxGeometry(1.2, 1.8, 0.6);
    const screenGeo = new THREE.PlaneGeometry(1.0, 1.2);
    const projectColors = [0x06d6a0, 0x118ab2, 0x9d4edd, 0xffd166, 0xef476f];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 1.6 - 1.2;
      const termGroup = new THREE.Group();
      termGroup.position.set(Math.sin(angle) * 5.2, 1.1, Math.cos(angle) * 5.2);
      termGroup.lookAt(0, 1.1, 0);

      const termPedestal = new THREE.Mesh(
        terminalGeo,
        new THREE.MeshStandardMaterial({ color: 0x1c232d, roughness: 0.3 })
      );
      termPedestal.castShadow = true;
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: projectColors[i],
        emissiveIntensity: 2.2,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.2, 0.32);

      termGroup.add(termPedestal, screen);
      projectsIsland.add(termGroup);
    }
    islandsGroup.add(projectsIsland);

    // 3. Skills Grove Island
    const skillsIsland = createIsland(0, 3, -28, 8.5, 6.0, 0x22363b);
    // Central Celestial Tree (Low-poly Cherry Blossom / Crystal Tree)
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.9, 4.0, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2b27, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 2.0, 0);
    trunk.castShadow = true;
    skillsIsland.add(trunk);

    const foliageGeo = new THREE.DodecahedronGeometry(2.4, 1);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0xff99c8,
      emissive: 0xff99c8,
      emissiveIntensity: 0.45,
      roughness: 0.6,
      flatShading: true,
    });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(0, 4.5, 0);
    foliage.castShadow = true;
    skillsIsland.add(foliage);

    // Floating Orbiting Skill Orbs
    const skillOrbsGroup = new THREE.Group();
    const orbColors = [0x61dafb, 0x38bdf8, 0x4ade80, 0xa855f7]; // React cyan, Tailwind, Node green, AI purple
    const orbGeo = new THREE.OctahedronGeometry(0.45, 0);
    orbColors.forEach((col, idx) => {
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: col,
        emissiveIntensity: 2.6,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      const angle = (idx / 4) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 3.6, 2.2, Math.sin(angle) * 3.6);
      skillOrbsGroup.add(orb);
    });
    skillsIsland.add(skillOrbsGroup);
    islandsGroup.add(skillsIsland);

    // 4. Journey Lookout Island
    const journeyIsland = createIsland(26, 3.5, -2, 8.0, 5.8, 0x3b2d38);
    // Milestone Obelisk Columns
    [0.7, 1.4, 2.2, 3.0].forEach((height, i) => {
      const obeliskGeo = new THREE.BoxGeometry(0.7, height, 0.7);
      const obeliskMat = new THREE.MeshStandardMaterial({
        color: 0x1c2130,
        roughness: 0.4,
        metalness: 0.6,
      });
      const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
      obelisk.position.set(-2.5 + i * 1.6, height / 2 + 0.4, -1.8);
      obelisk.castShadow = true;

      // Glow cap
      const capGeo = new THREE.ConeGeometry(0.5, 0.4, 4);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0xf78c6c,
        emissiveIntensity: 2.4,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-2.5 + i * 1.6, height + 0.6, -1.8);
      journeyIsland.add(obelisk, cap);
    });
    islandsGroup.add(journeyIsland);

    // 5. Contact Haven Island
    const contactIsland = createIsland(2, 1.5, 22, 7.5, 5.0, 0x362c33);
    // Cozy Campsite Campfire / Hearth
    const rockRingGeo = new THREE.TorusGeometry(0.9, 0.18, 6, 12);
    rockRingGeo.rotateX(Math.PI / 2);
    const firePit = new THREE.Mesh(
      rockRingGeo,
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 })
    );
    firePit.position.set(0, 0.55, 0);

    const flameGeo = new THREE.ConeGeometry(0.4, 0.9, 5);
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff5500,
      emissiveIntensity: 3.5,
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0.9, 0);

    // Satellite Relay Mast / Beacon
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.2, 8);
    const mast = new THREE.Mesh(
      mastGeo,
      new THREE.MeshStandardMaterial({ color: 0x485665, metalness: 0.8 })
    );
    mast.position.set(-2.6, 2.5, -2.0);
    const dishGeo = new THREE.SphereGeometry(0.7, 8, 8, 0, Math.PI);
    dishGeo.rotateX(-Math.PI / 3);
    const dish = new THREE.Mesh(
      dishGeo,
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.9 })
    );
    dish.position.set(-2.6, 4.4, -2.0);

    contactIsland.add(firePit, flame, mast, dish);
    islandsGroup.add(contactIsland);

    // 6. AI Companion Shrine / Beacon
    const aiIsland = createIsland(11, 1.8, 8, 4.8, 4.0, 0x2c253d);
    // Hovering holographic crystal / Clawbot Core
    const aiCrystalGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const aiCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0x9d4edd,
      emissiveIntensity: 2.8,
      roughness: 0.15,
      metalness: 0.4,
    });
    const aiCrystal = new THREE.Mesh(aiCrystalGeo, aiCrystalMat);
    aiCrystal.position.set(0, 2.0, 0);
    aiIsland.add(aiCrystal);

    const haloRingGeo = new THREE.TorusGeometry(1.3, 0.03, 8, 32);
    haloRingGeo.rotateX(Math.PI / 4);
    const haloRing = new THREE.Mesh(
      haloRingGeo,
      new THREE.MeshBasicMaterial({ color: 0xc77dff })
    );
    haloRing.position.set(0, 2.0, 0);
    aiIsland.add(haloRing);
    islandsGroup.add(aiIsland);

    scene.add(islandsGroup);

    // --- 6. Explorer Drone Avatar ---
    const avatar = new THREE.Group();
    avatar.position.set(0, 1.4, 0);

    // Drone Hull
    const hullGeo = new THREE.CapsuleGeometry(0.38, 0.7, 8, 16);
    hullGeo.rotateX(Math.PI / 2);
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: 0x2b3040,
      roughness: 0.28,
      metalness: 0.75,
      clearcoat: 0.6,
    });
    const hullMesh = new THREE.Mesh(hullGeo, hullMat);
    hullMesh.castShadow = true;
    avatar.add(hullMesh);

    // Glowing Cyan Visor Eye
    const visorGeo = new THREE.SphereGeometry(0.24, 16, 16);
    visorGeo.scale(1.0, 0.65, 1.4);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x00f5d4,
      emissiveIntensity: 2.5,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.12, -0.22);
    avatar.add(visorMesh);

    // Left & Right Anti-Grav Wings
    const wingGeo = new THREE.TorusGeometry(0.42, 0.045, 8, 24);
    wingGeo.rotateX(Math.PI / 2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x485665, metalness: 0.9, roughness: 0.3 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.68, 0, 0);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.68, 0, 0);
    avatar.add(leftWing, rightWing);

    // Thruster Particle Core
    const thrusterGeo = new THREE.CylinderGeometry(0.12, 0.02, 0.35, 12);
    thrusterGeo.rotateX(Math.PI / 2);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x00f5d4,
      emissiveIntensity: 3.5,
    });
    const thrusterMesh = new THREE.Mesh(thrusterGeo, thrusterMat);
    thrusterMesh.position.set(0, 0, 0.48);
    avatar.add(thrusterMesh);

    // Soft Contact Shadow Plane underneath
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const sCtx = shadowCanvas.getContext('2d');
    const radGrad = sCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = radGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.0;
    avatar.add(shadowMesh);

    scene.add(avatar);

    // --- 7. Controls & Input Handling ---
    const keys = new Set();
    const moveVector = new THREE.Vector2();
    const velocity = new THREE.Vector3();
    const targetVelocity = new THREE.Vector3();
    let isJumping = false;
    let jumpTime = 0;

    const handleKeyDown = (e) => {
      keys.add(e.code);
      if (e.code === 'KeyE' || e.code === 'Enter') {
        if (stateRef.current.activeStation) {
          audio.playClick();
          onOpenStation(stateRef.current.activeStation);
        }
      }
      if (e.code === 'Space' && !isJumping) {
        isJumping = true;
        jumpTime = 0;
        audio.playJump();
      }
    };
    const handleKeyUp = (e) => {
      keys.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Orbit Drag with Mouse
    let isDragging = false;
    let prevMouseX = 0;
    let cameraOrbitAngle = 0;

    const handlePointerDown = (e) => {
      if (e.target === renderer.domElement) {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };
    const handlePointerMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        cameraOrbitAngle += deltaX * 0.005;
        prevMouseX = e.clientX;
      }
    };
    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Teleportation Trigger
    stateRef.current.teleportTo = (stationId) => {
      const found = STATIONS.find((s) => s.id === stationId);
      if (!found) return;
      avatar.position.set(found.position[0], found.position[1] + 1.2, found.position[2]);
      velocity.set(0, 0, 0);
      audio.playTeleport();
    };

    // --- 8. Animation & Render Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Read keyboard inputs
      moveVector.set(0, 0);
      if (keys.has('KeyW') || keys.has('ArrowUp')) moveVector.y -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) moveVector.y += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) moveVector.x -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) moveVector.x += 1;

      // Add touch joystick input
      if (joystickInput && (joystickInput.x !== 0 || joystickInput.y !== 0)) {
        moveVector.x += joystickInput.x;
        moveVector.y += joystickInput.y;
      }
      if (moveVector.lengthSq() > 1) moveVector.normalize();

      // Transform movement relative to camera orbit angle
      const forwardX = -Math.sin(cameraOrbitAngle);
      const forwardZ = -Math.cos(cameraOrbitAngle);
      const rightX = Math.cos(cameraOrbitAngle);
      const rightZ = -Math.sin(cameraOrbitAngle);

      const worldMoveX = rightX * moveVector.x - forwardX * moveVector.y;
      const worldMoveZ = rightZ * moveVector.x - forwardZ * moveVector.y;

      // Smooth exponential velocity lerp
      const speed = 10.5;
      targetVelocity.set(worldMoveX, 0, worldMoveZ).multiplyScalar(speed);
      const smooth = 1 - Math.exp(-12.0 * delta);
      velocity.lerp(targetVelocity, smooth);
      avatar.position.addScaledVector(velocity, delta);

      // Rotate avatar heading
      if (velocity.lengthSq() > 0.05) {
        const targetRotY = Math.atan2(velocity.x, -velocity.z);
        avatar.rotation.y = THREE.MathUtils.lerp(avatar.rotation.y, targetRotY, smooth);
      }

      // Roll / Bank banking tilt
      const bankAngle = -moveVector.x * 0.28;
      avatar.rotation.z = THREE.MathUtils.lerp(avatar.rotation.z, bankAngle, smooth);

      // Pitch on acceleration
      const pitchAngle = moveVector.y * 0.16;
      avatar.rotation.x = THREE.MathUtils.lerp(avatar.rotation.x, pitchAngle, smooth);

      // Hover / Jump bobbing
      if (isJumping) {
        jumpTime += delta * 6;
        avatar.position.y = 1.4 + Math.sin(jumpTime) * 2.2;
        if (jumpTime >= Math.PI) {
          isJumping = false;
        }
      } else {
        avatar.position.y = 1.4 + Math.sin(elapsed * 4.0) * 0.08;
      }

      // Animate ambient scenery: Fireflies float & glow
      const posAttr = fireflyGeo.attributes.position;
      for (let i = 0; i < fireflyCount; i++) {
        const py = fireflyPositions[i * 3 + 1] + Math.sin(elapsed * 1.5 + fireflyPhases[i]) * 0.8;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;

      // Animate Skill Grove Orbs & AI Crystal
      skillOrbsGroup.rotation.y += delta * 0.9;
      aiCrystal.rotation.y += delta * 1.1;
      aiCrystal.rotation.z += delta * 0.7;
      haloRing.rotation.z -= delta * 1.4;

      // Camera Follow Rig with Smooth Lag & Orbit
      const orbitDistance = 11.5;
      const orbitHeight = isInspecting ? 5.0 : 8.5;
      const camTargetX = avatar.position.x + Math.sin(cameraOrbitAngle) * orbitDistance;
      const camTargetZ = avatar.position.z + Math.cos(cameraOrbitAngle) * orbitDistance;
      const camTargetY = avatar.position.y + orbitHeight;

      const camLag = 1 - Math.exp(-delta / 0.18);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, camLag);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY, camLag);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, camLag);
      camera.lookAt(avatar.position.x, avatar.position.y + 0.6, avatar.position.z);

      // Proximity Detection against stations
      let nearestStation = null;
      let minDistance = 5.2; // radius threshold
      STATIONS.forEach((st) => {
        const dx = avatar.position.x - st.position[0];
        const dz = avatar.position.z - st.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDistance) {
          nearestStation = st;
          minDistance = dist;
        }
      });

      if (nearestStation !== stateRef.current.activeStation) {
        if (nearestStation) {
          audio.playZoneChime();
        }
        stateRef.current.activeStation = nearestStation;
        onProximityChange(nearestStation);
      }

      composer.render();
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.resolution.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      composer.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [onProximityChange, onOpenStation, joystickInput, isInspecting]);

  // Hook external teleport requests
  useEffect(() => {
    if (teleportTarget && stateRef.current.teleportTo) {
      stateRef.current.teleportTo(teleportTarget);
    }
  }, [teleportTarget]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
}
