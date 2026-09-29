import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { audio } from '../audio/LoFiAudioEngine';

// Island Stations coordinates, dimensions, and metadata
export const STATIONS = [
  {
    id: 'sanctuary',
    name: 'Sanctuary Spawn',
    title: 'Adrian Tri Setiawan',
    tagline: 'Fullstack Engineer & AI R&D Specialist',
    position: [0, 0, 0],
    radius: 7.5,
    color: 0xffd166,
    prompt: 'Press [E] or Tap to Inspect Bio',
  },
  {
    id: 'projects',
    name: 'Projects Pavilion',
    title: 'Featured Engineering Works',
    tagline: 'FaceGate, EProcMon, Lunaria, EZVIZ, Procurement Suite',
    position: [-26, 2, -4],
    radius: 9.0,
    color: 0x06d6a0,
    prompt: 'Press [E] or Tap to Browse Projects',
  },
  {
    id: 'skills',
    name: 'Skills Grove',
    title: 'Technical Arsenal & Materia',
    tagline: 'Frontend, Backend, AI/ML, Databases & Cloud',
    position: [0, 3, -28],
    radius: 8.5,
    color: 0x118ab2,
    prompt: 'Press [E] or Tap to View Skills',
  },
  {
    id: 'journey',
    name: 'Journey Lookout',
    title: 'Experience & Quest Log',
    tagline: 'Fullstack, AI R&D, System Architecture',
    position: [26, 3.5, -2],
    radius: 8.0,
    color: 0xf78c6c,
    prompt: 'Press [E] or Tap to View Journey',
  },
  {
    id: 'contact',
    name: 'Contact Haven',
    title: 'Direct Reach & Socials',
    tagline: 'Email, GitHub, LinkedIn, Telegram',
    position: [2, 1.5, 22],
    radius: 7.5,
    color: 0xef476f,
    prompt: 'Press [E] or Tap to Connect',
  },
  {
    id: 'ai-beacon',
    name: 'AI Companion Shrine',
    title: 'Lady Lunaria & Clawbot Core',
    tagline: 'Interactive LLM Assistant powered by SSE Streaming API',
    position: [11, 1.8, 8],
    radius: 4.8,
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

  const propsRef = useRef({ onProximityChange, onOpenStation, isInspecting, joystickInput });
  useEffect(() => {
    propsRef.current = { onProximityChange, onOpenStation, isInspecting, joystickInput };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x181a2e);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x23253b, 0.012);

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.2,
      250
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
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
    scene.environmentIntensity = 0.85;
    pmrem.dispose();

    // --- 2. Post-Processing Chain (Tuned Bloom & Tone Mapping) ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Post-Processing: UnrealBloomPass tuned to threshold 0.88, strength 0.3, radius 0.2
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.3,   // strength: 0.3
      0.2,   // radius: 0.2
      0.88   // threshold: 0.88 (no blinding white rings)
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // --- 3. Lighting: Twilight Pastel Sun & Ambient Glow ---
    const ambientLight = new THREE.HemisphereLight(0xf5d0c5, 0x22263d, 1.45);
    scene.add(ambientLight);

    const sunsetLight = new THREE.DirectionalLight(0xffa07a, 2.0);
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

    // Drifting Fireflies & Luminous Sakura Embers
    const fireflyCount = 140;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflyPhases = new Float32Array(fireflyCount);
    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3 + 0] = (Math.random() - 0.5) * 80;
      fireflyPositions[i * 3 + 1] = 1.0 + Math.random() * 14;
      fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      fireflyPhases[i] = Math.random() * Math.PI * 2;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.42,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflies);

    // --- 5. Floating Islands Construction with Polished Details ---
    const islandsGroup = new THREE.Group();

    // Shared pooled materials & geometries across islands
    const sharedRockMat = new THREE.MeshStandardMaterial({
      color: 0x191e2b,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });
    const sharedMoundMat = new THREE.MeshStandardMaterial({
      color: 0x36483c,
      roughness: 0.85,
      flatShading: true,
    });
    const sharedPaverMat = new THREE.MeshStandardMaterial({
      color: 0x485160,
      roughness: 0.9,
      flatShading: true,
    });
    const sharedLanternDarkMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xffd166,
      emissiveIntensity: 1.8,
    });
    const sharedLanternRoofMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
    });
    const sharedMoundGeo = new THREE.DodecahedronGeometry(0.8, 1);
    const sharedPaverGeo = new THREE.BoxGeometry(0.9, 0.08, 0.6);
    const sharedLanternBoxGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const sharedLanternRoofGeo = new THREE.ConeGeometry(0.35, 0.25, 4);

    // Helper to create aesthetic floating island with rock base, grass top, and subtle rim
    function createIsland(x, y, z, radius, height, mainColor = 0x2d3446, rimColor = 0xffd166) {
      const island = new THREE.Group();
      island.position.set(x, y, z);

      // Top grass / pavement plateau
      const topGeo = new THREE.CylinderGeometry(radius, radius * 1.08, 0.9, 14);
      const topMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        roughness: 0.75,
        metalness: 0.15,
        flatShading: true,
      });
      const top = new THREE.Mesh(topGeo, topMat);
      top.receiveShadow = true;
      top.position.y = 0;
      top.frustumCulled = true;
      island.add(top);

      // Underside hanging craggy rocks (cone tapering down)
      const baseGeo = new THREE.ConeGeometry(radius * 1.05, height, 8);
      baseGeo.rotateX(Math.PI);
      const base = new THREE.Mesh(baseGeo, sharedRockMat);
      base.position.y = -height / 2;
      base.frustumCulled = true;
      island.add(base);

      // Edge glow rim strip (Subtle, tuned emissive intensity 0.45)
      const rimGeo = new THREE.TorusGeometry(radius * 1.04, 0.07, 6, 28);
      rimGeo.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshStandardMaterial({
        color: rimColor,
        emissive: rimColor,
        emissiveIntensity: 0.45,
        roughness: 0.4,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.y = 0.42;
      rim.frustumCulled = true;
      island.add(rim);

      // Stylized cozy details: low-poly grass mounds & stone pathway
      for (let m = 0; m < 5; m++) {
        const mAngle = (m / 5) * Math.PI * 2 + 0.3;
        const mDist = radius * 0.65;
        const mound = new THREE.Mesh(sharedMoundGeo, sharedMoundMat);
        mound.position.set(Math.cos(mAngle) * mDist, 0.4, Math.sin(mAngle) * mDist);
        mound.scale.set(1.1, 0.5, 1.1);
        mound.frustumCulled = true;
        island.add(mound);
      }

      // Stone pathway stepping slabs leading inward
      for (let p = 0; p < 4; p++) {
        const paver = new THREE.Mesh(sharedPaverGeo, sharedPaverMat);
        paver.position.set(0, 0.47, radius * 0.8 - p * 1.2);
        paver.rotation.y = (Math.random() - 0.5) * 0.15;
        paver.receiveShadow = true;
        paver.frustumCulled = true;
        island.add(paver);
      }

      // Floating Cozy Lantern
      const lanternGroup = new THREE.Group();
      const lanternBox = new THREE.Mesh(sharedLanternBoxGeo, sharedLanternDarkMat);
      lanternBox.frustumCulled = true;

      const lanternRoof = new THREE.Mesh(sharedLanternRoofGeo, sharedLanternRoofMat);
      lanternRoof.position.y = 0.4;
      lanternRoof.rotation.y = Math.PI / 4;
      lanternRoof.frustumCulled = true;

      lanternGroup.add(lanternBox, lanternRoof);
      lanternGroup.position.set(radius * 0.72, 1.4, -radius * 0.3);
      island.add(lanternGroup);

      return island;
    }

    // 1. Sanctuary Island (Spawn)
    const sanctuaryIsland = createIsland(0, 0, 0, 7.5, 5.5, 0x2b3044, 0xffd166);
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

    // Glowing Stone Shrine Lantern
    const shrineLantern = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.2, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0xffd166,
        emissiveIntensity: 2.2,
      })
    );
    shrineLantern.position.set(0, 1.1, -2.8);
    sanctuaryIsland.add(shrineLantern);
    islandsGroup.add(sanctuaryIsland);

    // 2. Projects Pavilion Island
    const projectsIsland = createIsland(-26, 2, -4, 9.0, 6.5, 0x26333c, 0x06d6a0);
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
        emissiveIntensity: 1.8,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.2, 0.32);

      termGroup.add(termPedestal, screen);
      projectsIsland.add(termGroup);
    }
    islandsGroup.add(projectsIsland);

    // 3. Skills Grove Island
    const skillsIsland = createIsland(0, 3, -28, 8.5, 6.0, 0x22363b, 0x118ab2);
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
      emissiveIntensity: 0.35,
      roughness: 0.6,
      flatShading: true,
    });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(0, 4.5, 0);
    foliage.castShadow = true;
    skillsIsland.add(foliage);

    // Floating Orbiting Skill Materia Orbs
    const skillOrbsGroup = new THREE.Group();
    const orbColors = [0x61dafb, 0x38bdf8, 0x4ade80, 0xa855f7];
    const orbGeo = new THREE.OctahedronGeometry(0.45, 0);
    orbColors.forEach((col, idx) => {
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: col,
        emissiveIntensity: 2.2,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      const angle = (idx / 4) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 3.6, 2.2, Math.sin(angle) * 3.6);
      skillOrbsGroup.add(orb);
    });
    skillsIsland.add(skillOrbsGroup);
    islandsGroup.add(skillsIsland);

    // 4. Journey Lookout Island
    const journeyIsland = createIsland(26, 3.5, -2, 8.0, 5.8, 0x3b2d38, 0xf78c6c);
    // Milestone Obelisk Columns
    [0.7, 1.4, 2.2, 3.0].forEach((h, i) => {
      const obeliskGeo = new THREE.BoxGeometry(0.7, h, 0.7);
      const obeliskMat = new THREE.MeshStandardMaterial({
        color: 0x1c2130,
        roughness: 0.4,
        metalness: 0.6,
      });
      const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
      obelisk.position.set(-2.5 + i * 1.6, h / 2 + 0.4, -1.8);
      obelisk.castShadow = true;

      const capGeo = new THREE.ConeGeometry(0.5, 0.4, 4);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0xf78c6c,
        emissiveIntensity: 2.0,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-2.5 + i * 1.6, h + 0.6, -1.8);
      journeyIsland.add(obelisk, cap);
    });
    islandsGroup.add(journeyIsland);

    // 5. Contact Haven Island
    const contactIsland = createIsland(2, 1.5, 22, 7.5, 5.0, 0x362c33, 0xef476f);
    const firePit = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.18, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 })
    );
    firePit.rotation.x = Math.PI / 2;
    firePit.position.set(0, 0.55, 0);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 0.9, 5),
      new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 2.8,
      })
    );
    flame.position.set(0, 0.9, 0);

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 4.2, 8),
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
    const aiIsland = createIsland(11, 1.8, 8, 4.8, 4.0, 0x2c253d, 0x9d4edd);
    const aiCrystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x9d4edd,
        emissiveIntensity: 2.4,
        roughness: 0.15,
        metalness: 0.4,
      })
    );
    aiCrystal.position.set(0, 2.0, 0);
    aiIsland.add(aiCrystal);

    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.03, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xc77dff })
    );
    haloRing.rotation.x = Math.PI / 4;
    haloRing.position.set(0, 2.0, 0);
    aiIsland.add(haloRing);
    islandsGroup.add(aiIsland);

    scene.add(islandsGroup);

    // --- 6. Glowing Sky-Bridges Connecting Sanctuary to All Surrounding Islands ---
    const bridgesGroup = new THREE.Group();
    const destinationStations = STATIONS.filter((s) => s.id !== 'sanctuary');

    // Bridge road & rail materials
    const bridgeRoadMat = new THREE.MeshStandardMaterial({
      color: 0x2a3348,
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true,
    });
    const bridgeGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffd166,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });

    destinationStations.forEach((dest) => {
      const start = new THREE.Vector3(0, 0.45, 0);
      const end = new THREE.Vector3(dest.position[0], dest.position[1] + 0.45, dest.position[2]);
      const mid = new THREE.Vector3(
        dest.position[0] * 0.5,
        Math.max(0, dest.position[1]) + 1.4,
        dest.position[2] * 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(24);

      // Construct bridge path surface using segmented quads
      const bridgeGeo = new THREE.BufferGeometry();
      const vertices = [];
      const uvs = [];
      const indices = [];
      const halfWidth = 0.95;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const nextPt = points[Math.min(i + 1, points.length - 1)];
        const prevPt = points[Math.max(i - 1, 0)];
        const dir = nextPt.clone().sub(prevPt).normalize();
        const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

        vertices.push(
          pt.x - normal.x * halfWidth, pt.y, pt.z - normal.z * halfWidth,
          pt.x + normal.x * halfWidth, pt.y, pt.z + normal.z * halfWidth
        );
        uvs.push(0, i / points.length, 1, i / points.length);

        if (i < points.length - 1) {
          const baseIdx = i * 2;
          indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
          indices.push(baseIdx + 1, baseIdx + 3, baseIdx + 2);
        }
      }

      bridgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      bridgeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      bridgeGeo.setIndex(indices);
      bridgeGeo.computeVertexNormals();

      const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeRoadMat);
      bridgeMesh.receiveShadow = true;
      bridgeMesh.frustumCulled = true;
      bridgesGroup.add(bridgeMesh);

      // Glowing edge rails along the bridge
      const leftRailPoints = [];
      const rightRailPoints = [];
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const nextPt = points[Math.min(i + 1, points.length - 1)];
        const prevPt = points[Math.max(i - 1, 0)];
        const dir = nextPt.clone().sub(prevPt).normalize();
        const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

        leftRailPoints.push(new THREE.Vector3(pt.x - normal.x * halfWidth, pt.y + 0.15, pt.z - normal.z * halfWidth));
        rightRailPoints.push(new THREE.Vector3(pt.x + normal.x * halfWidth, pt.y + 0.15, pt.z + normal.z * halfWidth));
      }

      const leftCurve = new THREE.CatmullRomCurve3(leftRailPoints);
      const rightCurve = new THREE.CatmullRomCurve3(rightRailPoints);
      const railGeo = new THREE.TubeGeometry(leftCurve, 24, 0.045, 6, false);
      const railGeoR = new THREE.TubeGeometry(rightCurve, 24, 0.045, 6, false);

      const railLeft = new THREE.Mesh(railGeo, bridgeGlowMat);
      const railRight = new THREE.Mesh(railGeoR, bridgeGlowMat);
      railLeft.frustumCulled = true;
      railRight.frustumCulled = true;
      bridgesGroup.add(railLeft, railRight);

      // Small glowing lanterns along the bridge arch
      const bridgeLanternMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: dest.color || 0xffd166,
        emissiveIntensity: 1.8,
      });
      const bridgeLanternGeo = new THREE.BoxGeometry(0.25, 0.35, 0.25);
      [0.3, 0.5, 0.7].forEach((t) => {
        const p = curve.getPoint(t);
        const lanternMesh = new THREE.Mesh(bridgeLanternGeo, bridgeLanternMat);
        lanternMesh.position.set(p.x, p.y + 0.3, p.z);
        lanternMesh.frustumCulled = true;
        bridgesGroup.add(lanternMesh);
      });
    });

    scene.add(bridgesGroup);

    // --- 7. Stylized Anime Miko Character (Japanese Shrine Maiden Avatar) ---
    const avatar = new THREE.Group();
    avatar.position.set(0, 1.35, 0);

    // Internal Miko Body Hierarchy for procedural movement & idle animations
    const mikoRoot = new THREE.Group();
    avatar.add(mikoRoot);

    // Color Palette
    const mikoColors = {
      skin: 0xffe2cd,       // Warm peach skin tone
      kosode: 0xfdfbf7,     // Traditional white silk robe
      hakama: 0xc1121f,     // Sacred scarlet red hakama
      obi: 0xffffff,        // White waist obi sash
      hair: 0x1f1a2e,       // Deep midnight-indigo anime hair
      eyes: 0x4a154b,       // Cute violet-amber anime eye color
      geta: 0x8b5a2b,       // Wooden geta sandal base
      gold: 0xffd166,       // Golden kanzashi & talisman accent
    };

    // Shared stylized materials
    const skinMat = new THREE.MeshStandardMaterial({ color: mikoColors.skin, roughness: 0.6 });
    const kosodeMat = new THREE.MeshStandardMaterial({ color: mikoColors.kosode, roughness: 0.55 });
    const hakamaMat = new THREE.MeshStandardMaterial({ color: mikoColors.hakama, roughness: 0.5 });
    const obiMat = new THREE.MeshStandardMaterial({ color: mikoColors.obi, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: mikoColors.hair, roughness: 0.45, flatShading: true });
    const redTrimMat = new THREE.MeshStandardMaterial({ color: mikoColors.hakama, roughness: 0.4 });
    const getaMat = new THREE.MeshStandardMaterial({ color: mikoColors.geta, roughness: 0.7 });

    // A. Pelvis & Flared Hakama Skirt
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.52;
    mikoRoot.add(pelvis);

    // Flared pleated hakama skirt (tapering cone)
    const skirtGeo = new THREE.ConeGeometry(0.38, 0.54, 12, 1, true);
    const skirtMesh = new THREE.Mesh(skirtGeo, hakamaMat);
    skirtMesh.position.y = -0.16;
    skirtMesh.castShadow = true;
    pelvis.add(skirtMesh);

    // White Obi waist sash
    const obiMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.25, 0.12, 12),
      obiMat
    );
    obiMesh.position.y = 0.08;
    pelvis.add(obiMesh);

    // Hakama back tie bow
    const bowMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.08, 0.08),
      redTrimMat
    );
    bowMesh.position.set(0, 0.08, 0.23);
    pelvis.add(bowMesh);

    // Left & Right Legs with white tabi socks and wooden geta sandals
    const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.44, 8);
    const getaGeo = new THREE.BoxGeometry(0.11, 0.045, 0.20);
    const strapGeo = new THREE.BoxGeometry(0.08, 0.02, 0.06);

    // Left Leg Group
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.11, -0.22, 0);
    const leftSock = new THREE.Mesh(legGeo, kosodeMat);
    leftSock.position.y = -0.18;
    leftSock.castShadow = true;
    const leftGeta = new THREE.Mesh(getaGeo, getaMat);
    leftGeta.position.set(0, -0.42, 0.02);
    const leftStrap = new THREE.Mesh(strapGeo, redTrimMat);
    leftStrap.position.set(0, -0.39, 0.04);
    leftLeg.add(leftSock, leftGeta, leftStrap);
    pelvis.add(leftLeg);

    // Right Leg Group
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.11, -0.22, 0);
    const rightSock = new THREE.Mesh(legGeo, kosodeMat);
    rightSock.position.y = -0.18;
    rightSock.castShadow = true;
    const rightGeta = new THREE.Mesh(getaGeo, getaMat);
    rightGeta.position.set(0, -0.42, 0.02);
    const rightStrap = new THREE.Mesh(strapGeo, redTrimMat);
    rightStrap.position.set(0, -0.39, 0.04);
    rightLeg.add(rightSock, rightGeta, rightStrap);
    pelvis.add(rightLeg);

    // B. Torso & Kosode Kimono Robe
    const torso = new THREE.Group();
    torso.position.y = 0.65;
    mikoRoot.add(torso);

    // Upper Kimono Robe Body
    const torsoGeo = new THREE.CylinderGeometry(0.20, 0.23, 0.36, 10);
    const torsoMesh = new THREE.Mesh(torsoGeo, kosodeMat);
    torsoMesh.position.y = 0.16;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Kimono V-neck crossover with scarlet inner lapel
    const lapelGeo = new THREE.BoxGeometry(0.12, 0.18, 0.04);
    const lapelMesh = new THREE.Mesh(lapelGeo, redTrimMat);
    lapelMesh.position.set(0, 0.22, -0.19);
    lapelMesh.rotation.x = 0.1;
    torso.add(lapelMesh);

    // Left Arm & Flowing Kimono Sleeve
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.25, 0.26, 0);

    const armGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.28, 8);
    const leftArmMesh = new THREE.Mesh(armGeo, kosodeMat);
    leftArmMesh.position.y = -0.12;
    leftArm.add(leftArmMesh);

    // Flowing wide Kimono sleeve hanging down
    const sleeveGeo = new THREE.BoxGeometry(0.10, 0.32, 0.24);
    const leftSleeveMesh = new THREE.Mesh(sleeveGeo, kosodeMat);
    leftSleeveMesh.position.set(-0.04, -0.22, 0);
    // Red sleeve trim
    const sleeveTrimGeo = new THREE.BoxGeometry(0.105, 0.04, 0.245);
    const leftSleeveTrim = new THREE.Mesh(sleeveTrimGeo, redTrimMat);
    leftSleeveTrim.position.set(-0.04, -0.36, 0);
    leftArm.add(leftSleeveMesh, leftSleeveTrim);

    const handGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0, -0.27, 0.02);
    leftArm.add(leftHand);
    torso.add(leftArm);

    // Right Arm & Sacred Gohei Wand
    const rightArm = new THREE.Group();
    rightArm.position.set(0.25, 0.26, 0);

    const rightArmMesh = new THREE.Mesh(armGeo, kosodeMat);
    rightArmMesh.position.y = -0.12;
    rightArm.add(rightArmMesh);

    const rightSleeveMesh = new THREE.Mesh(sleeveGeo, kosodeMat);
    rightSleeveMesh.position.set(0.04, -0.22, 0);
    const rightSleeveTrim = new THREE.Mesh(sleeveTrimGeo, redTrimMat);
    rightSleeveTrim.position.set(0.04, -0.36, 0);
    rightArm.add(rightSleeveMesh, rightSleeveTrim);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0, -0.27, 0.02);
    rightArm.add(rightHand);

    // Sacred Wooden Gohei Wand with glowing white folded Shide paper
    const goheiGroup = new THREE.Group();
    goheiGroup.position.set(0.02, -0.24, -0.08);
    goheiGroup.rotation.x = -Math.PI / 4;

    const wandShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.70, 6),
      new THREE.MeshStandardMaterial({ color: 0x9c6644, roughness: 0.6 })
    );
    wandShaft.position.y = 0.22;
    goheiGroup.add(wandShaft);

    // Folded Zigzag Shide streamers (glowing white with golden aura)
    const shideMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff275,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    for (let s = 0; s < 3; s++) {
      const shideGeo = new THREE.BoxGeometry(0.08, 0.12, 0.02);
      const shideMesh = new THREE.Mesh(shideGeo, shideMat);
      shideMesh.position.set((s % 2 === 0 ? 0.05 : -0.05), 0.44 - s * 0.09, 0);
      shideMesh.rotation.z = (s % 2 === 0 ? 0.3 : -0.3);
      goheiGroup.add(shideMesh);
    }
    rightArm.add(goheiGroup);
    torso.add(rightArm);

    // C. Anime Head, Face, Hair & Kanzashi
    const head = new THREE.Group();
    head.position.y = 1.05;
    mikoRoot.add(head);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.20, 16, 16);
    headGeo.scale(1.0, 1.08, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    head.add(headMesh);

    // Cute Anime Eyes (Big violet iris with specular shine highlights)
    const eyeMat = new THREE.MeshBasicMaterial({ color: mikoColors.eyes });
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const eyeGeo = new THREE.SphereGeometry(0.038, 8, 8);
    eyeGeo.scale(0.8, 1.2, 0.3);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.075, 0.01, -0.18);
    const leftShine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), shineMat);
    leftShine.position.set(-0.068, 0.03, -0.19);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.075, 0.01, -0.18);
    const rightShine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), shineMat);
    rightShine.position.set(0.082, 0.03, -0.19);

    head.add(leftEye, leftShine, rightEye, rightShine);

    // Cute blush dots
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xff85a1, transparent: true, opacity: 0.65 });
    const blushGeo = new THREE.SphereGeometry(0.025, 8, 8);
    blushGeo.scale(1.4, 0.6, 0.2);
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.09, -0.04, -0.17);
    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.09, -0.04, -0.17);
    head.add(leftBlush, rightBlush);

    // Midnight Hair: Bangs, Side Locks & Flowing Ponytail
    const bangsGeo = new THREE.SphereGeometry(0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const bangsMesh = new THREE.Mesh(bangsGeo, hairMat);
    bangsMesh.position.set(0, 0.04, 0);
    head.add(bangsMesh);

    // Twin side locks framing face
    const sideLockGeo = new THREE.ConeGeometry(0.045, 0.35, 6);
    const leftLock = new THREE.Mesh(sideLockGeo, hairMat);
    leftLock.position.set(-0.16, -0.10, -0.10);
    leftLock.rotation.z = -0.15;
    const rightLock = new THREE.Mesh(sideLockGeo, hairMat);
    rightLock.position.set(0.16, -0.10, -0.10);
    rightLock.rotation.z = 0.15;
    head.add(leftLock, rightLock);

    // Long flowing back hair ponytail
    const hairBack = new THREE.Group();
    hairBack.position.set(0, 0.06, 0.16);

    const ponyGeo = new THREE.ConeGeometry(0.14, 0.65, 8);
    ponyGeo.rotateX(Math.PI);
    const ponyMesh = new THREE.Mesh(ponyGeo, hairMat);
    ponyMesh.position.y = -0.32;
    hairBack.add(ponyMesh);

    // Red Kanzashi hair ribbon with golden bell ornament
    const kanzashiRibbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.06, 0.06),
      redTrimMat
    );
    kanzashiRibbon.position.set(0, 0.02, 0.02);
    const bellMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshStandardMaterial({ color: mikoColors.gold, metalness: 0.8, roughness: 0.3 })
    );
    bellMesh.position.set(0, -0.04, 0.03);
    hairBack.add(kanzashiRibbon, bellMesh);
    head.add(hairBack);

    // Floating sacred sakura petals & blessing orbs orbiting her
    const blessingOrbs = new THREE.Group();
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffb7b2,
      emissive: 0xffb7b2,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    for (let p = 0; p < 4; p++) {
      const petal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05, 0), petalMat);
      const pAngle = (p / 4) * Math.PI * 2;
      petal.position.set(Math.cos(pAngle) * 0.7, 0.5 + Math.sin(p) * 0.3, Math.sin(pAngle) * 0.7);
      blessingOrbs.add(petal);
    }
    avatar.add(blessingOrbs);

    // Soft Contact Shadow Plane underneath
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const sCtx = shadowCanvas.getContext('2d');
    const radGrad = sCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
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
    shadowMesh.position.y = -0.55;
    avatar.add(shadowMesh);

    scene.add(avatar);

    // --- 8. Controls & Input Handling & Pre-Allocated Scratch Objects ---
    const keys = new Set();
    const moveVector = new THREE.Vector2();
    const velocity = new THREE.Vector3();
    const targetVelocity = new THREE.Vector3();

    // Scratch objects outside requestAnimationFrame loop (Zero Allocation Render Loop)
    const tempVec = new THREE.Vector3();
    const targetPos = new THREE.Vector3();
    const moveVec = new THREE.Vector2();
    const camTarget = new THREE.Vector3();

    let isJumping = false;
    let jumpTime = 0;
    let currentGroundY = 1.35; // Dynamic ground tracking
    const handleKeyDown = (e) => {
      // Guard against typing inside chat or modal forms
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      if (propsRef.current.isInspecting) {
        keys.clear();
        return;
      }
      keys.add(e.code);
      if (e.code === 'KeyE' || e.code === 'Enter') {
        if (stateRef.current.activeStation) {
          audio.playClick();
          if (propsRef.current.onOpenStation) {
            propsRef.current.onOpenStation(stateRef.current.activeStation);
          }
        }
      }
      if (e.code === 'Space' && !isJumping) {
        isJumping = true;
        jumpTime = 0;
        audio.playJump();
      }
    };

    const handleKeyUp = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      keys.delete(e.code);
    };

    const handleBlur = () => {
      keys.clear();
      velocity.set(0, 0, 0);
      targetVelocity.set(0, 0, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Orbit Drag with Mouse / Touch
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
      avatar.position.set(found.position[0], found.position[1] + 1.35, found.position[2]);
      currentGroundY = found.position[1] + 1.35;
      velocity.set(0, 0, 0);
      targetVelocity.set(0, 0, 0);
      audio.playTeleport();
    };

    // --- 9. Dynamic Island & Sky-Bridge Height Tracking ---
    function calculateTargetGroundHeight(px, pz) {
      let targetY = 1.35; // Default sanctuary spawn surface
      let foundSurface = false;

      // 1. Check if avatar is within any island radius
      for (let i = 0; i < STATIONS.length; i++) {
        const st = STATIONS[i];
        const dx = px - st.position[0];
        const dz = pz - st.position[2];
        const dist = Math.hypot(dx, dz);

        if (dist <= st.radius + 0.8) {
          // Standing on top of island plateau
          targetY = st.position[1] + 1.35;
          foundSurface = true;
          break;
        }
      }

      // 2. If not on an island, check if traversing along any sky-bridge
      if (!foundSurface) {
        destinationStations.forEach((dest) => {
          const vx = dest.position[0];
          const vz = dest.position[2];
          const lenSq = vx * vx + vz * vz;
          if (lenSq > 0) {
            if (dot >= 0.02 && dot <= 0.98) {
              const projX = dot * vx;
              const projZ = dot * vz;
              const perpDist = Math.hypot(px - projX, pz - projZ);
              if (perpDist < 2.0) {
                // Smooth bridge surface tracking matching bezier curve arch + character center
                const bridgeArchY = (1 - dot) * 0.45 + dot * (dest.position[1] + 0.45) + Math.sin(dot * Math.PI) * 1.4;
                targetY = bridgeArchY + 0.95;
                foundSurface = true;
              }
            }
          }
        });
      }

      // 3. Void fallback: smoothly interpolate to nearest island ground
      if (!foundSurface) {
        let minDist = Infinity;
        let nearestSt = STATIONS[0];
        STATIONS.forEach((st) => {
          const d = Math.hypot(px - st.position[0], pz - st.position[2]);
          if (d < minDist) {
            minDist = d;
            nearestSt = st;
          }
        });
        targetY = Math.max(1.0, nearestSt.position[1] + 1.35);
      }

      return targetY;
    }

    // --- 10. Animation & Render Loop (Locked 60 FPS, Zero Allocations) ---
    let animationFrameId;
    let clock = new THREE.Clock();
    let walkCycle = 0;
    let idleTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      // Clear keys and motion when inspecting modal
      if (propsRef.current.isInspecting) {
        keys.clear();
        velocity.set(0, 0, 0);
        targetVelocity.set(0, 0, 0);
      }

      // Read keyboard inputs
      moveVector.set(0, 0);
      if (!propsRef.current.isInspecting) {
        if (keys.has('KeyW') || keys.has('ArrowUp')) moveVector.y -= 1;
        if (keys.has('KeyS') || keys.has('ArrowDown')) moveVector.y += 1;
        if (keys.has('KeyA') || keys.has('ArrowLeft')) moveVector.x -= 1;
        if (keys.has('KeyD') || keys.has('ArrowRight')) moveVector.x += 1;

        // Add touch joystick input with deadzone
        const joy = propsRef.current.joystickInput;
        if (joy && (joy.x !== 0 || joy.y !== 0)) {
          if (Math.hypot(joy.x, joy.y) >= 0.08) {
            moveVector.x += joy.x;
            moveVector.y += joy.y;
          }
        }
      }
      if (moveVector.lengthSq() > 1) moveVector.normalize();

      // Transform movement relative to camera orbit angle
      const forwardX = -Math.sin(cameraOrbitAngle);
      const forwardZ = -Math.cos(cameraOrbitAngle);
      const rightX = Math.cos(cameraOrbitAngle);
      const rightZ = -Math.sin(cameraOrbitAngle);

      const worldMoveX = rightX * moveVector.x - forwardX * moveVector.y;
      const worldMoveZ = rightZ * moveVector.x - forwardZ * moveVector.y;

      // Smooth exponential velocity lerp & drift clamping
      const speed = 9.8;
      if (moveVector.lengthSq() === 0) {
        targetVelocity.set(0, 0, 0);
      } else {
        targetVelocity.set(worldMoveX, 0, worldMoveZ).multiplyScalar(speed);
      }
      const smooth = 1 - Math.exp(-12.0 * delta);
      velocity.lerp(targetVelocity, smooth);
      if (velocity.lengthSq() < 0.002) {
        velocity.set(0, 0, 0);
      }
      avatar.position.addScaledVector(velocity, delta);

      // Rotate avatar heading towards movement direction
      if (velocity.lengthSq() > 0.05) {
        const targetRotY = Math.atan2(velocity.x, -velocity.z);
        avatar.rotation.y = THREE.MathUtils.lerp(avatar.rotation.y, targetRotY, smooth);
      }

      // Dynamic Ground Height Tracking (NEVER clip into rocks)
      const targetGroundY = calculateTargetGroundHeight(avatar.position.x, avatar.position.z);
      currentGroundY = THREE.MathUtils.lerp(currentGroundY, targetGroundY, 1 - Math.exp(-8.0 * delta));

      // Jump / Hover Bobbing Calculation
      if (isJumping) {
        jumpTime += delta * 6;
        avatar.position.y = currentGroundY + Math.sin(jumpTime) * 2.2;
        if (jumpTime >= Math.PI) {
          isJumping = false;
        }
      } else {
        const idleHover = Math.sin(elapsed * 3.5) * 0.035;
        avatar.position.y = currentGroundY + idleHover;
      }

      // Procedural Miko Character Animations (Walking, Breathing, Sleeve & Hair Sway)
      const horizSpeed = Math.hypot(velocity.x, velocity.z);
      if (horizSpeed > 0.15) {
        // Walking / Running Animation
        walkCycle += delta * horizSpeed * 2.2;
        leftLeg.rotation.x = Math.sin(walkCycle) * 0.65;
        rightLeg.rotation.x = -Math.sin(walkCycle) * 0.65;

        leftArm.rotation.x = -Math.sin(walkCycle) * 0.45;
        rightArm.rotation.x = Math.sin(walkCycle) * 0.45;
        leftArm.rotation.z = 0.22 + Math.cos(walkCycle) * 0.08;
        rightArm.rotation.z = -0.22 - Math.cos(walkCycle) * 0.08;

        // Dynamic hair & hakama flutter
        hairBack.rotation.x = -0.18 - horizSpeed * 0.03;
        skirtMesh.rotation.z = Math.sin(walkCycle) * 0.05;
        mikoRoot.position.y = Math.abs(Math.sin(walkCycle)) * 0.06;
      } else {
        // Idle Animation: Soft breathing & breeze flutter
        idleTime += delta;
        mikoRoot.position.y = Math.sin(idleTime * 2.4) * 0.025;

        leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, smooth);
        rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, smooth);

        leftArm.rotation.x = Math.sin(idleTime * 1.5) * 0.06;
        rightArm.rotation.x = -Math.sin(idleTime * 1.5) * 0.06;
        leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.16 + Math.sin(idleTime * 2.0) * 0.03, smooth);
        rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.16 - Math.sin(idleTime * 2.0) * 0.03, smooth);

        hairBack.rotation.x = THREE.MathUtils.lerp(hairBack.rotation.x, Math.sin(idleTime * 2.0) * 0.06, smooth);
        skirtMesh.rotation.z = THREE.MathUtils.lerp(skirtMesh.rotation.z, 0, smooth);
      }

      // Jump flare
      if (isJumping) {
        leftArm.rotation.z = 0.8;
        rightArm.rotation.z = -0.8;
        hairBack.rotation.x = 0.25;
      }

      // Rotate floating blessing sakura orbs
      blessingOrbs.rotation.y += delta * 1.2;

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

      // Camera Follow Rig with Smooth Lag & Orbit (Zero Allocation using camTarget)
      const orbitDistance = 11.5;
      const orbitHeight = propsRef.current.isInspecting ? 5.0 : 7.8;
      camTarget.set(
        avatar.position.x + Math.sin(cameraOrbitAngle) * orbitDistance,
        avatar.position.y + orbitHeight,
        avatar.position.z + Math.cos(cameraOrbitAngle) * orbitDistance
      );

      const camLag = 1 - Math.exp(-delta / 0.18);
      camera.position.lerp(camTarget, camLag);
      camera.lookAt(avatar.position.x, avatar.position.y + 0.8, avatar.position.z);
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
        if (propsRef.current.onProximityChange) {
          propsRef.current.onProximityChange(nearestStation);
        }
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
      window.removeEventListener('blur', handleBlur);
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
  }, []);

  // Hook external teleport requests
  useEffect(() => {
    if (teleportTarget && stateRef.current.teleportTo) {
      stateRef.current.teleportTo(teleportTarget);
    }
  }, [teleportTarget]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
}
