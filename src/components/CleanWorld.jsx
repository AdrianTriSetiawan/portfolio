import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { audio } from '../audio/LoFiAudioEngine';
import { resolveCollisions, AVATAR_RADIUS } from './CollisionSystem';

// Interactive Stations mapped across Outdoor Garden and Indoor House Studio
export const CLEAN_STATIONS = [
  // --- Outdoor Garden Stations ---
  {
    id: 'entrance-door',
    location: 'outdoor',
    name: 'House Front Door',
    title: "Enter Adrian's Studio",
    tagline: 'Step inside the cozy studio and engineering workstation',
    position: [0.0, 1.48, -4.2],
    radius: 1.45,
    prompt: '[E] Enter House',
    actionType: 'transition',
  },
  {
    id: 'contact',
    location: 'outdoor',
    name: 'Garden Mailbox',
    title: 'Direct Reach & Socials',
    tagline: 'Email, GitHub, LinkedIn, Telegram',
    position: [2.7, 1.48, 1.5],
    radius: 2.2,
    color: '#F59E0B',
    prompt: '[E] Open Contact & Mail',
    actionType: 'modal',
    modalId: 'contact',
  },
  {
    id: 'skills',
    location: 'outdoor',
    name: 'Garden Tea Table',
    title: 'Technical Stack',
    tagline: 'AI R&D, full-stack development, and applied computer vision',
    position: [-2.8, 1.48, 0.4],
    radius: 2.5,
    color: '#3B82F6',
    prompt: '[E] Inspect Technical Arsenal',
    actionType: 'modal',
    modalId: 'skills',
  },
  {
    id: 'lotus-pond',
    location: 'outdoor',
    name: 'Lotus Pond',
    title: 'Lotus Pond & Garden Fauna',
    tagline: 'Tranquil waters, koi fish, and relaxing garden ambience',
    position: [0.0, 0.5, 4.2],
    radius: 1.8,
    color: '#10B981',
    prompt: '[E] Lotus Pond',
    actionType: 'modal',
    modalId: 'ai',
  },
  {
    id: 'ai-beacon',
    location: 'outdoor',
    name: 'Tree Stump / AI Shrine',
    title: 'Portfolio AI Guide',
    tagline: 'Portfolio guide for Adrian’s projects, profile, and contact details',
    position: [5.8, 1.48, 1.8],
    radius: 1.4,
    color: '#9333EA',
    prompt: '[E] Speak with Lady Lunaria AI',
    actionType: 'modal',
    modalId: 'ai',
  },
  // --- Indoor House Studio Stations (Y ≈ 200) ---
  {
    id: 'exit-door',
    location: 'indoor',
    name: 'Interior Exit Door',
    title: 'Return to Sakura Garden',
    tagline: 'Step out to the tranquil outdoor garden and koi pond',
    position: [0.0, 200.8, 8.6],
    radius: 2.2,
    color: '#10B981',
    prompt: '[E] Exit to Garden',
    actionType: 'transition',
  },
  {
    id: 'projects',
    location: 'indoor',
    name: 'Engineering Dev Desk',
    title: 'Project Portfolio',
    tagline: 'InsightFace, Lunaria, EZVIZ, Procurement, ASTREAM, and VS Code extensions',
    position: [6.1, 200.8, 4.6],
    radius: 2.6,
    color: '#D27D46',
    prompt: '[E] Browse Projects',
    actionType: 'modal',
    modalId: 'projects',
  },
  {
    id: 'indoor-tech',
    location: 'indoor',
    name: 'Server Rack & Arsenal',
    title: 'Technical Stack',
    tagline: 'Fullstack engineering, machine learning, AI, and deep learning',
    position: [-2.2, 200.8, -7.8],
    radius: 2.5,
    color: '#3B82F6',
    prompt: '[E] Technical Arsenal',
    actionType: 'modal',
    modalId: 'skills',
  },
  {
    id: 'journey',
    location: 'indoor',
    name: 'Studio Whiteboard',
    title: 'Current Role & Profile',
    tagline: 'Fullstack Engineer and AI R&D Builder · Jakarta / Surabaya',
    position: [0.2, 200.8, -4.6],
    radius: 2.5,
    color: '#10B981',
    prompt: '[E] Current Role',
    actionType: 'modal',
    modalId: 'journey',
  },
];
// Runtime-only Japanese restyle. The clean Worawork source remains untouched.
function applyJapanesePlayerStyle(charScene) {
  const creamTint = new THREE.Color('#fff7ed');

  charScene.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
    const styledMaterials = sourceMaterials.map((sourceMaterial) => {
      const material = sourceMaterial.clone();
      material.color.copy(creamTint);
      material.roughness = Math.max(material.roughness || 0.7, 0.78);
      material.metalness = Math.min(material.metalness || 0, 0.04);
      material.name = `${sourceMaterial.name || 'CharacterMaterial'}_JapaneseRuntime`;
      return material;
    });
    child.material = Array.isArray(child.material) ? styledMaterials : styledMaterials[0];
    child.castShadow = true;
    child.receiveShadow = true;
  });

  const indigo = new THREE.MeshStandardMaterial({
    color: '#263b68',
    roughness: 0.82,
    metalness: 0.02,
  });
  const vermilion = new THREE.MeshStandardMaterial({
    color: '#b75545',
    roughness: 0.82,
  });
  const cream = new THREE.MeshStandardMaterial({
    color: '#f8ead4',
    roughness: 0.86,
  });
  const sakura = new THREE.MeshStandardMaterial({
    color: '#e8799d',
    roughness: 0.7,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: '#c58b45',
    roughness: 0.55,
    metalness: 0.25,
  });

  // The avatar faces the +Z camera; costume details belong on that surface.
  const accents = new THREE.Group();
  accents.name = 'JapaneseRuntimeAccents';

  const obi = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.16, 0.08), vermilion);
  obi.position.set(0, 1.27, 0.37);
  accents.add(obi);

  const leftHaoriEdge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.58, 0.07), indigo);
  leftHaoriEdge.position.set(-0.23, 1.52, 0.37);
  accents.add(leftHaoriEdge);
  const rightHaoriEdge = leftHaoriEdge.clone();
  rightHaoriEdge.position.x = 0.23;
  accents.add(rightHaoriEdge);

  const leftCollar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.05), cream);
  leftCollar.position.set(-0.07, 1.53, 0.41);
  leftCollar.rotation.z = -0.4;
  accents.add(leftCollar);
  const rightCollar = leftCollar.clone();
  rightCollar.position.x = 0.07;
  rightCollar.rotation.z = 0.4;
  accents.add(rightCollar);

  const obiKnot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), gold);
  obiKnot.position.set(0, 1.27, 0.43);
  accents.add(obiKnot);

  const hairPin = new THREE.Group();
  hairPin.position.set(0.4, 3.18, 0.22);
  for (const [x, y, z] of [[0, 0.12, 0], [0.12, 0, 0], [-0.12, 0, 0], [0, -0.12, 0]]) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), sakura);
    petal.scale.set(1, 0.65, 0.35);
    petal.position.set(x, y, z);
    hairPin.add(petal);
  }
  const pinCenter = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), gold);
  hairPin.add(pinCenter);
  accents.add(hairPin);

  charScene.add(accents);
}
// Clear runtime derivative used instead of the old low-scale dodecahedron blob.
// It has a visible dark trunk, branching limbs, separated layered blossom clusters,
// and remains independent from both Player.glb and the preserved GLB source.
function createRuntimeSakuraTree() {
  const tree = new THREE.Group();
  tree.name = 'RuntimeSakuraTree';
  const bark = new THREE.MeshStandardMaterial({ color: '#3b2418', roughness: 0.92 });
  const branchBark = new THREE.MeshStandardMaterial({ color: '#523020', roughness: 0.9 });
  const blossomPink = new THREE.MeshStandardMaterial({ color: '#f29ab2', roughness: 0.82 });
  const blossomLight = new THREE.MeshStandardMaterial({ color: '#ffd9e2', roughness: 0.86 });
  const blossomDeep = new THREE.MeshStandardMaterial({ color: '#d85f86', roughness: 0.78 });

  const addLimb = (start, end, radius, material) => {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(to, from);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.72, radius, direction.length(), 8),
      material
    );
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    tree.add(mesh);
  };

  addLimb([0, 0, 0], [0.05, 2.8, 0.02], 0.46, bark);
  addLimb([0.05, 2.45, 0.02], [-0.15, 4.25, 0.08], 0.32, bark);
  addLimb([-0.12, 3.65, 0.06], [0.02, 5.05, 0.0], 0.24, branchBark);
  addLimb([-0.1, 3.45, 0.05], [-1.55, 4.65, 0.16], 0.18, branchBark);
  addLimb([0.0, 3.75, 0.03], [1.6, 4.75, -0.1], 0.18, branchBark);
  addLimb([-0.02, 4.3, 0.0], [-1.15, 5.55, -0.2], 0.14, branchBark);
  addLimb([0.0, 4.55, 0.0], [1.05, 5.65, 0.18], 0.14, branchBark);
  addLimb([0.02, 4.8, 0.0], [0.1, 6.0, 0.0], 0.12, branchBark);

  const clusters = [
    [-1.7, 4.85, 0.15, 0.72, blossomPink],
    [1.75, 4.95, -0.12, 0.78, blossomLight],
    [-1.25, 5.7, -0.15, 0.7, blossomLight],
    [1.1, 5.8, 0.2, 0.72, blossomPink],
    [0.12, 6.25, 0.0, 0.82, blossomDeep],
  ];
  clusters.forEach(([x, y, z, radius, material], index) => {
    const cluster = new THREE.Group();
    cluster.position.set(x, y, z);
    const offsets = [[0, 0, 0], [radius * 0.62, 0.06, 0.02], [-radius * 0.56, 0.08, 0.03], [0, radius * 0.45, 0.05]];
    offsets.forEach(([ox, oy, oz], petalIndex) => {
      const petal = new THREE.Mesh(
        new THREE.SphereGeometry(radius * (petalIndex === 0 ? 0.75 : 0.5), 12, 8),
        petalIndex === 3 && index % 2 === 0 ? blossomLight : material
      );
      petal.position.set(ox, oy, oz);
      petal.scale.set(1.15, 0.78, 0.95);
      petal.castShadow = true;
      petal.receiveShadow = true;
      cluster.add(petal);
    });
    tree.add(cluster);
  });
  return tree;
}




export default function CleanWorld({
  onProximityChange,
  onOpenStation,
  teleportTarget,
  joystickInput,
  isInspecting,
  isMovementLocked = false,
  onLoadProgress,
  onLoadComplete,
}) {
  const mountRef = useRef(null);
  const [isScreenFading, setIsScreenFading] = useState(false);
  const isIndoorRef = useRef(false);
  const transitionLockRef = useRef(false);

  const stateRef = useRef({
    activeStation: null,
    teleportTo: null,
  });

  const propsRef = useRef({
    onProximityChange,
    onOpenStation,
    isInspecting,
    isMovementLocked,
    joystickInput,
    onLoadProgress,
    onLoadComplete,
  });

  useEffect(() => {
    propsRef.current = {
      onProximityChange,
      onOpenStation,
      isInspecting,
      isMovementLocked,
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
    scene.background = new THREE.Color('#fbecee');

    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 16;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      500
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting System ---
    const ambientLight = new THREE.AmbientLight(0xfff5f0, 2.4);
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

    // Indoor Cozy Lighting (around Y = 200)
    const indoorAmbient = new THREE.PointLight(0xffdfba, 2.8, 25, 1.2);
    indoorAmbient.position.set(0, 206, 0);
    scene.add(indoorAmbient);

    const deskLight = new THREE.PointLight(0x93c5fd, 3.2, 8, 1.4);
    deskLight.position.set(6.1, 203.2, 4.6);
    scene.add(deskLight);

    // --- 3. Falling Sakura Blossom Petals ---
    const petalCount = 450;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities = [];

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3 + 0] = (Math.random() - 0.5) * 36;
      petalPositions[i * 3 + 1] = Math.random() * 14 + 0.5;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 36;

      petalVelocities.push({
        fallSpeed: 0.75 + Math.random() * 0.85,
        driftSpeedX: (Math.random() - 0.2) * 0.65,
        driftSpeedZ: (Math.random() - 0.4) * 0.55,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.8 + Math.random() * 2.2,
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

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
      size: 0.38,
      map: petalTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const petalSystem = new THREE.Points(petalGeo, petalMat);
    scene.add(petalSystem);

    // --- 4. Authentic 3D Character Avatar (Player.glb) ---
    const player = {
      group: new THREE.Group(),
      mesh: null,
      mixer: null,
      actions: {},
      currentAction: 'Idle',
      position: new THREE.Vector3(0, 1.48, 1.2), // Spawn on wooden path outdoor
      currentRotation: 0,
      isMoving: false,
      speed: 4.8,
    };
    player.group.position.copy(player.position);
    scene.add(player.group);

    // Expose debug info for testing
    window.__portfolioDebug = {
      player,
      propsRef,
      stateRef,
      isIndoorRef,
    };

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

    // Outline meshes dictionary from Models.glb
    const outlineMeshes = {};

    // --- 5. Models Loading with THREE.LoadingManager ---
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

    // Load World Models (Models.glb)
    gltfLoader.load(
      '/models/Models.glb?v=clean_v4_japanese_material',
      (gltf) => {
        if (isDisposed) return;
        const worldScene = gltf.scene;

        worldScene.traverse((child) => {
          if (child.isMesh) {
            // Hide obsolete borrowed European cottage and crumpled foliage from Models.glb
            if (
              child.name === 'Home_lp' ||
              child.name === 'Plane019' ||
              child.name === 'Trees_lp'
            ) {
              child.visible = false;
              return;
            }

            child.castShadow = true;
            child.receiveShadow = true;
            // Collect and configure white outline meshes for interactive objects
            if (child.name.includes('Outline')) {
              outlineMeshes[child.name] = child;
              child.visible = false; // Initially hidden; lights up on proximity
              child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95,
              });
            }

            // Japanese Sakura Blossom foliage
            const isFoliage =
              child.name.toLowerCase().includes('tree') ||
              child.name.toLowerCase().includes('leaf') ||
              child.name.toLowerCase().includes('leaves') ||
              (child.material && child.material.name && child.material.name.toLowerCase().includes('tree'));

            if (isFoliage) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffb7c5, // Blooming Sakura Pink
                roughness: 0.85,
                metalness: 0.05,
              });
            } else if (child.material) {
              child.material.roughness = Math.max(0.65, child.material.roughness || 0.7);
              child.material.metalness = Math.min(0.08, child.material.metalness || 0);
            }
          }
        });
        // Create custom server rack white outline mesh if not already in Models.glb
        fetch('/models/rack_positions.json')
          .then((res) => res.json())
          .then((positions) => {
            if (isDisposed) return;
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
            const mat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.9,
            });
            const rackOutline = new THREE.Mesh(geo, mat);
            rackOutline.visible = false;
            scene.add(rackOutline);
            outlineMeshes['Server_Rack_Outline'] = rackOutline;
          })
          .catch(() => {});

        scene.add(worldScene);
      },
      undefined,
      (err) => console.error('Failed to load Models.glb:', err)
    );

    // 5a. Load Authentic Japanese Atelier / Ryokan (OriginalRyokan.glb)
    const ryokanGroup = new THREE.Group();
    scene.add(ryokanGroup);

    gltfLoader.load(
      '/models/OriginalRyokan.glb',
      (gltf) => {
        if (isDisposed) return;
        const ryokan = gltf.scene;
        ryokan.position.set(0.0, 1.48, 0.0);
        ryokan.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        ryokanGroup.add(ryokan);
      },
      undefined,
      (err) => console.error('Failed to load OriginalRyokan.glb:', err)
    );

    // 5b. Runtime sakura derivative: the checked-in GLB is preserved, but its
    // small dodecahedron canopy reads as pink blobs at diorama scale.
    const sakuraTreesGroup = new THREE.Group();
    scene.add(sakuraTreesGroup);

    const sakuraTreePlacements = [
      { position: [-7.8, 1.4, 0.8], scale: 0.62, rotY: 0.35 },
      { position: [-4.8, 1.4, 1.8], scale: 0.58, rotY: -1.1 },
      { position: [-8.5, 1.4, -2.5], scale: 0.7, rotY: -0.4 },
    ];
    sakuraTreePlacements.forEach((cfg) => {
      const tree = createRuntimeSakuraTree();
      tree.position.set(...cfg.position);
      tree.scale.setScalar(cfg.scale);
      tree.rotation.y = cfg.rotY;
      sakuraTreesGroup.add(tree);
    });


    // 5c. Load the clean Worawork-style source; Japanese styling is runtime-only.
    gltfLoader.load(
      '/models/Player.glb?v=worawork_clean_japanese_runtime',
      (gltf) => {
        if (isDisposed) return;
        const charScene = gltf.scene;
        // Source bounds are 2.9491 W × 3.5902 H × 2.0122 D; 0.9 gives
        // 3.2312 world units of readable height without clipping the diorama.
        charScene.scale.set(0.9, 0.9, 0.9);
        charScene.position.set(0, 0, 0);
        charScene.rotation.y = 0;
        applyJapanesePlayerStyle(charScene);

        player.mesh = charScene;
        player.group.add(charScene);
        player.mixer = new THREE.AnimationMixer(charScene);
        gltf.animations.forEach((clip) => {
          player.actions[clip.name] = player.mixer.clipAction(clip);
        });
        if (player.actions.Idle) player.actions.Idle.play();

        // The clean source uses Mixamo's original bone names.
        const findBone = (names) => {
          for (const name of names) {
            const obj = charScene.getObjectByName(name);
            if (obj) return obj;
          }
          return null;
        };
        player.bones = {
          leftUpperLeg: findBone(['mixamorig:LeftUpLeg', 'LeftUpLeg', 'J_Bip_L_UpperLeg']),
          rightUpperLeg: findBone(['mixamorig:RightUpLeg', 'RightUpLeg', 'J_Bip_R_UpperLeg']),
          leftLowerLeg: findBone(['mixamorig:LeftLeg', 'LeftLeg', 'J_Bip_L_LowerLeg']),
          rightLowerLeg: findBone(['mixamorig:RightLeg', 'RightLeg', 'J_Bip_R_LowerLeg']),
          leftUpperArm: findBone(['mixamorig:LeftArm', 'LeftArm', 'J_Bip_L_UpperArm']),
          rightUpperArm: findBone(['mixamorig:RightArm', 'RightArm', 'J_Bip_R_UpperArm']),
          spine: findBone(['mixamorig:Spine', 'Spine', 'J_Bip_C_Spine']),
          head: findBone(['mixamorig:Head', 'Head', 'J_Bip_C_Head']),
        };
      },
      undefined,
      (err) => console.error('Failed to load Player.glb:', err)
    );

    // Helper to transition player animation smoothly
    const setPlayerAction = (name) => {
      if (!player.actions[name] || player.currentAction === name) return;
      const prev = player.actions[player.currentAction];
      const next = player.actions[name];
      if (prev) prev.fadeOut(0.2);
      next.reset().fadeIn(0.2).play();
      player.currentAction = name;
    };

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
          if (child.name === 'Duck_Outline' || child.name.includes('Outline')) {
            outlineMeshes['Duck_Outline'] = child;
            child.visible = false;
            child.material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.95,
            });
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

    // --- 6. Station Interaction Rings & Visual Markers ---
    // Subtle, glowing circular ground rings (RingGeometry with soft pulsing opacity) at each station
    const stationRings = [];
    CLEAN_STATIONS.forEach((station) => {
      const isIndoor = station.location === 'indoor';
      const ringY = station.id === 'lotus-pond' ? 0.5 : (isIndoor ? 200.82 : 1.48);
      const ringGroup = new THREE.Group();
      ringGroup.position.set(station.position[0], ringY, station.position[2]);
      const innerGeo = new THREE.RingGeometry(0.9, 1.15, 32);
      innerGeo.rotateX(-Math.PI / 2);
      const ringColor = new THREE.Color(station.color);
      const innerMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      ringGroup.add(innerMesh);

      // Subtle inner disc glow
      const discGeo = new THREE.CircleGeometry(0.9, 32);
      discGeo.rotateX(-Math.PI / 2);
      const discMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      ringGroup.add(discMesh);

      // Outer vibrant accent ring
      const outerGeo = new THREE.RingGeometry(1.22, 1.30, 32);
      outerGeo.rotateX(-Math.PI / 2);
      const outerMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      ringGroup.add(outerMesh);

      // Subtle glowing pulsating light
      const ringLight = new THREE.PointLight(station.color, 1.5, 3.5);
      ringLight.position.set(0, 0.3, 0);
      ringGroup.add(ringLight);

      scene.add(ringGroup);
      stationRings.push({
        station,
        group: ringGroup,
        innerMesh,
        innerMat,
        discMat,
        outerMat,
        ringLight,
        baseInnerOpacity: 0.85,
        baseDiscOpacity: 0.22,
        baseOuterOpacity: 0.65,
      });
    });
    const keys = { w: false, a: false, s: false, d: false, shift: false };
    const clickTarget = { active: false, position: new THREE.Vector3() };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleKeyDown = (e) => {
      if (propsRef.current.isMovementLocked) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.code === 'ArrowUp') keys.w = true;
      if (k === 's' || e.code === 'ArrowDown') keys.s = true;
      if (k === 'a' || e.code === 'ArrowLeft') keys.a = true;
      if (k === 'd' || e.code === 'ArrowRight') keys.d = true;
      if (e.key === 'Shift') keys.shift = true;

      // [E] or Space key interaction trigger
      if ((e.code === 'KeyE' || e.code === 'Space') && !propsRef.current.isInspecting) {
        const active = stateRef.current.activeStation;
        if (active) {
          e.preventDefault();
          executeStationAction(active);
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.code === 'ArrowUp') keys.w = false;
      if (k === 's' || e.code === 'ArrowDown') keys.s = false;
      if (k === 'a' || e.code === 'ArrowLeft') keys.a = false;
      if (k === 'd' || e.code === 'ArrowRight') keys.d = false;
      if (e.key === 'Shift') keys.shift = false;
    };

    const handlePointerDown = (e) => {
      if (propsRef.current.isMovementLocked) return;
      if (e.target !== renderer.domElement) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const groundPlane = new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        isIndoorRef.current ? -200.8 : -1.55
      );
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);

      if (intersection) {
        // Check if user clicked directly on a station marker
        let clickedStation = null;
        for (const station of CLEAN_STATIONS) {
          if (
            (isIndoorRef.current && station.location !== 'indoor') ||
            (!isIndoorRef.current && station.location !== 'outdoor')
          ) {
            continue;
          }
          const dx = intersection.x - station.position[0];
          const dz = intersection.z - station.position[2];
          if (Math.hypot(dx, dz) < station.radius * 0.9) {
            clickedStation = station;
            break;
          }
        }

        if (clickedStation) {
          executeStationAction(clickedStation);
        } else {
          clickTarget.position.copy(intersection);
          clickTarget.active = true;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);

    // --- 8. Smooth House Interior / Outdoor Transition Flow ---
    const executeStationAction = (station) => {
      if (station.actionType === 'transition') {
        // Keep the threshold explicit: proximity only advertises [E]; one press
        // owns the fade/teleport so movement cannot oscillate at the doorway.
        if (transitionLockRef.current) return;
        transitionLockRef.current = true;
        audio.playClick();
        setIsScreenFading(true);

        setTimeout(() => {
          if (station.id === 'entrance-door') {
            isIndoorRef.current = true;
            player.position.set(0, 200.8, 5.8);
            player.currentRotation = Math.PI;
            player.targetRotation = Math.PI;
            scene.background.set('#1a1622');
          } else if (station.id === 'exit-door') {
            isIndoorRef.current = false;
            player.position.set(0, 1.48, -2.2);
            player.currentRotation = 0;
            player.targetRotation = 0;
            scene.background.set('#fbecee');
          }

          player.group.position.copy(player.position);
          clickTarget.active = false;

          setTimeout(() => {
            setIsScreenFading(false);
            transitionLockRef.current = false;
          }, 350);
        }, 350);
      } else if (station.actionType === 'modal') {
        if (propsRef.current.onOpenStation) {
          propsRef.current.onOpenStation(station);
        }
      }
    };

    // Teleport handler
    stateRef.current.teleportTo = (stationId) => {
      const station = CLEAN_STATIONS.find((s) => s.id === stationId);
      if (!station) return;

      setIsScreenFading(true);
      setTimeout(() => {
        const targetIndoor = station.location === 'indoor';
        isIndoorRef.current = targetIndoor;
        scene.background.set(targetIndoor ? '#1a1622' : '#fbecee');

        player.position.set(station.position[0], targetIndoor ? 200.8 : 1.48, station.position[2] + 1.2);
        player.group.position.copy(player.position);
        clickTarget.active = false;

        setTimeout(() => {
          setIsScreenFading(false);
        }, 350);
      }, 350);
    };

    // Camera lerp targets
    const camOffset = new THREE.Vector3(0, 19, 18);
    const lookOffset = new THREE.Vector3(0, 0, -2);
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3();

    // Clock
    const clock = new THREE.Clock();

    // --- 9. Main Animation & Physics Loop ---
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Animate Sakura Blossom Petals
      const positions = petalGeo.attributes.position.array;
      for (let i = 0; i < petalCount; i++) {
        const vel = petalVelocities[i];
        positions[i * 3 + 1] -= vel.fallSpeed * delta;
        positions[i * 3 + 0] += (vel.driftSpeedX + Math.sin(time * vel.wobbleSpeed + vel.wobblePhase) * 0.4) * delta;
        positions[i * 3 + 2] += (vel.driftSpeedZ + Math.cos(time * vel.wobbleSpeed + vel.wobblePhase) * 0.3) * delta;

        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 13 + Math.random() * 2;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 36;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 36;
        }
      }
      petalGeo.attributes.position.needsUpdate = true;
      petalSystem.visible = !isIndoorRef.current; // Hide petals while indoors
      if (sakuraTreesGroup) sakuraTreesGroup.visible = !isIndoorRef.current;
      if (ryokanGroup) ryokanGroup.visible = !isIndoorRef.current;

      // Animate Duck Companion (outdoor pond)
      if (duck.mixer) {
        duck.mixer.update(delta);
      }
      duck.group.visible = !isIndoorRef.current;

      duck.wanderTimer -= delta;
      if (duck.wanderTimer <= 0) {
        duck.wanderTimer = 3 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.5 + Math.random() * 1.8;
        duck.targetPos.set(0.0 + Math.cos(angle) * dist, 0.45, 5.8 + Math.sin(angle) * dist);
      }

      const toDuckTarget = new THREE.Vector3().subVectors(duck.targetPos, duck.position);
      toDuckTarget.y = 0;
      const duckDist = toDuckTarget.length();

      if (duckDist > 0.15) {
        toDuckTarget.normalize();
        duck.position.addScaledVector(toDuckTarget, 0.6 * delta);
        duck.group.position.copy(duck.position);
        duck.group.rotation.y = Math.atan2(toDuckTarget.x, toDuckTarget.z);
        if (duck.actions['Duck_Walk'] && !duck.actions['Duck_Walk'].isRunning()) {
          duck.actions['Duck_Walk'].play();
        }
      } else {
        if (duck.actions['Duck_Idle'] && !duck.actions['Duck_Idle'].isRunning()) {
          duck.actions['Duck_Idle'].play();
        }
      }

      // --- Movement Input Integration ---
      const { joystickInput, isInspecting, isMovementLocked } = propsRef.current;
      let moveX = 0;
      let moveZ = 0;

      if (!isInspecting && !isMovementLocked) {
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

        // Apply Candidate Movement
        const candidatePos = {
          x: player.position.x + deltaX,
          z: player.position.z + deltaZ,
        };

        // --- WATERTIGHT OBSTACLE COLLISION & SLIDING RESOLUTION ---
        const resolved = resolveCollisions(candidatePos, isIndoorRef.current, AVATAR_RADIUS);
        player.position.x = resolved.x;
        player.position.z = resolved.z;

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

      // Animate 3D Humanoid Anime Girl Character
      if (player.bones) {
        const { leftUpperLeg, rightUpperLeg, leftLowerLeg, rightLowerLeg, leftUpperArm, rightUpperArm, spine, head } = player.bones;

        if (isMoving) {
          player.walkTime = (player.walkTime || 0) + delta * (keys.shift ? 1.4 : 1.0);
          const legSwing = Math.sin(player.walkTime * 8) * 0.45;
          const armSwing = Math.sin(player.walkTime * 8) * 0.35;

          // Leg swing
          if (leftUpperLeg) leftUpperLeg.rotation.x = legSwing;
          if (rightUpperLeg) rightUpperLeg.rotation.x = -legSwing;

          // Knee bend for realism
          if (leftLowerLeg) leftLowerLeg.rotation.x = Math.max(0, -legSwing * 0.8);
          if (rightLowerLeg) rightLowerLeg.rotation.x = Math.max(0, legSwing * 0.8);

          // Arm counter-swing
          if (leftUpperArm) {
            leftUpperArm.rotation.x = -armSwing;
            leftUpperArm.rotation.z = 0;
          }
          if (rightUpperArm) {
            rightUpperArm.rotation.x = armSwing;
            rightUpperArm.rotation.z = 0;
          }

          // Gentle head bob
          if (head) {
            head.rotation.x = Math.sin(player.walkTime * 16) * 0.04;
          }

          // Dynamic spine lean
          if (spine) {
            spine.rotation.x = 0.04 + Math.sin(player.walkTime * 16) * 0.02;
          }
        } else {
          // When idle: gentle spine breathing
          const idleTime = time;
          if (spine) {
            spine.rotation.x = Math.sin(idleTime * 2) * 0.03;
          }
          if (leftUpperArm) {
            leftUpperArm.rotation.x = 0;
            leftUpperArm.rotation.z = Math.sin(idleTime * 2) * 0.02;
          }
          if (rightUpperArm) {
            rightUpperArm.rotation.x = 0;
            rightUpperArm.rotation.z = -Math.sin(idleTime * 2) * 0.02;
          }
          if (leftUpperLeg) leftUpperLeg.rotation.x = 0;
          if (rightUpperLeg) rightUpperLeg.rotation.x = 0;
          if (leftLowerLeg) leftLowerLeg.rotation.x = 0;
          if (rightLowerLeg) rightLowerLeg.rotation.x = 0;
          if (head) {
            head.rotation.x = 0;
            head.rotation.y = Math.sin(idleTime * 0.7) * 0.05;
          }
        }
      }

      // Height sync based on location
      player.position.y = isIndoorRef.current ? 200.8 : 1.48;
      player.group.position.copy(player.position);

      if (player.mixer) {
        player.mixer.update(delta);
      }
      // --- Station Interaction Rings Animation & Proximity ---
      const elapsedTime = clock.getElapsedTime();
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;

      stationRings.forEach((ring) => {
        const isTargetVisible = isIndoorRef.current
          ? ring.station.location === 'indoor'
          : ring.station.location === 'outdoor';
        ring.group.visible = isTargetVisible;

        if (isTargetVisible) {
          const isPlayerInside = stateRef.current.activeStation?.id === ring.station.id;
          const scaleMult = isPlayerInside ? 1.08 * pulse : pulse;
          ring.group.scale.set(scaleMult, 1, scaleMult);

          const opacityMult = isPlayerInside ? 1.15 : 1.0;
          ring.innerMat.opacity = Math.min(1.0, ring.baseInnerOpacity * opacityMult * (0.88 + 0.12 * Math.sin(elapsedTime * 4)));
          ring.discMat.opacity = Math.min(0.45, ring.baseDiscOpacity * opacityMult * (0.88 + 0.12 * Math.sin(elapsedTime * 3)));
          ring.outerMat.opacity = Math.min(0.85, ring.baseOuterOpacity * opacityMult * (0.88 + 0.12 * Math.sin(elapsedTime * 4)));
          if (ring.ringLight) {
            ring.ringLight.intensity = (isPlayerInside ? 2.5 : 1.5) * (0.88 + 0.12 * Math.sin(elapsedTime * 3));
          }
        }
      });

      // --- Proximity to Stations & White Outline Lighting ---
      let nearest = null;
      let minDistance = Infinity;

      CLEAN_STATIONS.forEach((station) => {
        if (
          (isIndoorRef.current && station.location !== 'indoor') ||
          (!isIndoorRef.current && station.location !== 'outdoor')
        ) {
          return;
        }

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

        // Highlight matching white outline mesh
        Object.keys(outlineMeshes).forEach((name) => {
          outlineMeshes[name].visible = false;
        });

        if (nearest) {
          if (nearest.id === 'contact' && outlineMeshes['Clickable_MailBox_Outline']) {
            outlineMeshes['Clickable_MailBox_Outline'].visible = true;
          } else if (nearest.id === 'entrance-door' && outlineMeshes['Entrance_Outline']) {
            outlineMeshes['Entrance_Outline'].visible = true;
          } else if (nearest.id === 'lotus-pond') {
            ['Clickable_Lighting_PondL_Outline', 'Clickable_Lighting_PondR_Outline'].forEach((name) => {
              if (outlineMeshes[name]) outlineMeshes[name].visible = true;
            });
          } else if (nearest.id === 'skills' && outlineMeshes['Sitting_Chair_R_Outline']) {
            outlineMeshes['Sitting_Chair_R_Outline'].visible = true;
          } else if (nearest.id === 'exit-door' && outlineMeshes['Exit_Outline']) {
            outlineMeshes['Exit_Outline'].visible = true;
          } else if (nearest.id === 'projects' && outlineMeshes['Sitting_PC_Outline']) {
            outlineMeshes['Sitting_PC_Outline'].visible = true;
          } else if (nearest.id === 'journey' && outlineMeshes['Note_Outline']) {
            outlineMeshes['Note_Outline'].visible = true;
          } else if (nearest.id === 'indoor-tech' && outlineMeshes['Server_Rack_Outline']) {
            outlineMeshes['Server_Rack_Outline'].visible = true;
          }
        }
      }
      // --- Camera Tracking with Smooth Lerp ---
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

      sunLight.position.set(camera.position.x + 8, camera.position.y + 14, camera.position.z - 4);
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

  // Teleportation reaction
  useEffect(() => {
    if (teleportTarget && stateRef.current.teleportTo) {
      stateRef.current.teleportTo(teleportTarget);
    }
  }, [teleportTarget]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* WoraWork Black Screen Fade Transition Overlay */}
      <div className={`screen-fade-overlay ${isScreenFading ? 'fade-active' : ''}`} />
    </div>
  );
}
