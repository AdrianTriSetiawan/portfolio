import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for GLTFExporter in Node/Bun
class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (typeof this.onloadend === 'function') {
        this.onloadend();
      }
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;

const exportGLB = async (scene, outputPath) => {
  const exporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(Buffer.from(result)),
      (error) => reject(error),
      { binary: true }
    );
  });
  fs.writeFileSync(outputPath, glbBuffer);
  console.log(`Saved ${path.basename(outputPath)} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);
};

// ============================================================================
// 1. ORIGINAL AVATAR (Stylized Portfolio Guardian & Software Engineer)
// ============================================================================
function createOriginalAvatar() {
  const root = new THREE.Group();
  root.name = 'AvatarRoot';

  // Materials Palette
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfd0, roughness: 0.7, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.6, metalness: 0.1 });
  const hairStreakMat = new THREE.MeshStandardMaterial({ color: 0x88c0d0, roughness: 0.5, metalness: 0.2 });
  const hoodieMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.8, metalness: 0.1 });
  const hoodieTrimMat = new THREE.MeshStandardMaterial({ color: 0x5e81ac, roughness: 0.7, metalness: 0.15 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2e3440, roughness: 0.85, metalness: 0.05 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, roughness: 0.6, metalness: 0.2 });
  const shoeAccentMat = new THREE.MeshStandardMaterial({ color: 0xd08770, roughness: 0.5, metalness: 0.2 });
  const headphoneMat = new THREE.MeshStandardMaterial({ color: 0x4c566a, roughness: 0.4, metalness: 0.6 });
  const headphoneGlowMat = new THREE.MeshStandardMaterial({
    color: 0x88c0d0,
    emissive: 0x88c0d0,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.3 });
  const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x5e81ac, roughness: 0.4 });
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x111622 });

  // --- Hips & Pelvis ---
  const hips = new THREE.Group();
  hips.name = 'Hips';
  hips.position.set(0, 0.85, 0);
  root.add(hips);

  const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.22), pantsMat);
  pelvisMesh.position.set(0, 0, 0);
  hips.add(pelvisMesh);

  // --- Spine & Torso ---
  const spine = new THREE.Group();
  spine.name = 'Spine';
  spine.position.set(0, 0.12, 0);
  hips.add(spine);

  // Tech Hoodie Torso
  const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.26), hoodieMat);
  torsoMesh.position.set(0, 0.22, 0);
  spine.add(torsoMesh);

  // Hoodie Front Zipper & Accent Stripes
  const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.42, 0.02), hoodieTrimMat);
  zipper.position.set(0, 0.22, 0.132);
  spine.add(zipper);

  // Engineer Chest Badge / Hologram
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.02), headphoneGlowMat);
  badge.position.set(-0.1, 0.3, 0.133);
  spine.add(badge);

  // Hoodie Collar / Hood folded at neck
  const hoodFold = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.18), hoodieTrimMat);
  hoodFold.position.set(0, 0.44, -0.05);
  spine.add(hoodFold);

  // --- Neck & Head ---
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.48, 0);
  spine.add(head);

  // Neck
  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 12), skinMat);
  neckMesh.position.set(0, 0.04, 0);
  head.add(neckMesh);

  // Head Base
  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.26), skinMat);
  headMesh.position.set(0, 0.22, 0);
  head.add(headMesh);

  // Stylized Eyes (Expressive)
  const leftEyeWhite = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.08), eyeWhiteMat);
  leftEyeWhite.position.set(-0.075, 0.22, 0.132);
  head.add(leftEyeWhite);

  const leftEyeIris = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.055), eyeIrisMat);
  leftEyeIris.position.set(-0.075, 0.22, 0.133);
  head.add(leftEyeIris);

  const leftEyePupil = new THREE.Mesh(new THREE.PlaneGeometry(0.022, 0.03), eyePupilMat);
  leftEyePupil.position.set(-0.075, 0.22, 0.134);
  head.add(leftEyePupil);

  const rightEyeWhite = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.08), eyeWhiteMat);
  rightEyeWhite.position.set(0.075, 0.22, 0.132);
  head.add(rightEyeWhite);

  const rightEyeIris = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.055), eyeIrisMat);
  rightEyeIris.position.set(0.075, 0.22, 0.133);
  head.add(rightEyeIris);

  const rightEyePupil = new THREE.Mesh(new THREE.PlaneGeometry(0.022, 0.03), eyePupilMat);
  rightEyePupil.position.set(0.075, 0.22, 0.134);
  head.add(rightEyePupil);

  // Stylized Hair: Main Volume
  const hairMain = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.3), hairMat);
  hairMain.position.set(0, 0.33, -0.02);
  head.add(hairMain);

  // Hair Bangs & Side Locks
  const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.06), hairMat);
  bangs.position.set(0, 0.31, 0.13);
  head.add(bangs);

  const hairStreak = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.07), hairStreakMat);
  hairStreak.position.set(-0.08, 0.29, 0.132);
  head.add(hairStreak);

  // Audio Headset Accessory
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16, 1, true, 0, Math.PI), headphoneMat);
  band.rotation.z = Math.PI / 2;
  band.position.set(0, 0.35, 0);
  head.add(band);

  const leftEarpad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), headphoneGlowMat);
  leftEarpad.rotation.z = Math.PI / 2;
  leftEarpad.position.set(-0.16, 0.22, 0);
  head.add(leftEarpad);

  const rightEarpad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), headphoneGlowMat);
  rightEarpad.rotation.z = Math.PI / 2;
  rightEarpad.position.set(0.16, 0.22, 0);
  head.add(rightEarpad);

  // --- Left Arm ---
  const leftArm = new THREE.Group();
  leftArm.name = 'LeftArm';
  leftArm.position.set(-0.25, 0.38, 0);
  spine.add(leftArm);

  const leftUpperSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.24, 10), hoodieMat);
  leftUpperSleeve.position.set(0, -0.12, 0);
  leftArm.add(leftUpperSleeve);

  const leftForeArm = new THREE.Group();
  leftForeArm.name = 'LeftForeArm';
  leftForeArm.position.set(0, -0.24, 0);
  leftArm.add(leftForeArm);

  const leftLowerSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.2, 10), hoodieTrimMat);
  leftLowerSleeve.position.set(0, -0.1, 0);
  leftForeArm.add(leftLowerSleeve);

  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.09, 0.055), skinMat);
  leftHand.position.set(0, -0.23, 0);
  leftForeArm.add(leftHand);

  // --- Right Arm ---
  const rightArm = new THREE.Group();
  rightArm.name = 'RightArm';
  rightArm.position.set(0.25, 0.38, 0);
  spine.add(rightArm);

  const rightUpperSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.24, 10), hoodieMat);
  rightUpperSleeve.position.set(0, -0.12, 0);
  rightArm.add(rightUpperSleeve);

  const rightForeArm = new THREE.Group();
  rightForeArm.name = 'RightForeArm';
  rightForeArm.position.set(0, -0.24, 0);
  rightArm.add(rightForeArm);

  const rightLowerSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.2, 10), hoodieTrimMat);
  rightLowerSleeve.position.set(0, -0.1, 0);
  rightForeArm.add(rightLowerSleeve);

  const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.09, 0.055), skinMat);
  rightHand.position.set(0, -0.23, 0);
  rightForeArm.add(rightHand);

  // --- Left Leg ---
  const leftUpLeg = new THREE.Group();
  leftUpLeg.name = 'LeftUpLeg';
  leftUpLeg.position.set(-0.11, -0.08, 0);
  hips.add(leftUpLeg);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 10), pantsMat);
  leftThigh.position.set(0, -0.17, 0);
  leftUpLeg.add(leftThigh);

  const leftLeg = new THREE.Group();
  leftLeg.name = 'LeftLeg';
  leftLeg.position.set(0, -0.34, 0);
  leftUpLeg.add(leftLeg);

  const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.32, 10), pantsMat);
  leftCalf.position.set(0, -0.16, 0);
  leftLeg.add(leftCalf);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.2), shoeMat);
  leftBoot.position.set(0, -0.35, 0.04);
  leftLeg.add(leftBoot);

  const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.22), shoeAccentMat);
  leftSole.position.set(0, -0.42, 0.04);
  leftLeg.add(leftSole);

  // --- Right Leg ---
  const rightUpLeg = new THREE.Group();
  rightUpLeg.name = 'RightUpLeg';
  rightUpLeg.position.set(0.11, -0.08, 0);
  hips.add(rightUpLeg);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 10), pantsMat);
  rightThigh.position.set(0, -0.17, 0);
  rightUpLeg.add(rightThigh);

  const rightLeg = new THREE.Group();
  rightLeg.name = 'RightLeg';
  rightLeg.position.set(0, -0.34, 0);
  rightUpLeg.add(rightLeg);

  const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.32, 10), pantsMat);
  rightCalf.position.set(0, -0.16, 0);
  rightLeg.add(rightCalf);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.2), shoeMat);
  rightBoot.position.set(0, -0.35, 0.04);
  rightLeg.add(rightBoot);

  const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, 0.22), shoeAccentMat);
  rightSole.position.set(0, -0.42, 0.04);
  rightLeg.add(rightSole);

  // Cast and receive shadows across all meshes
  root.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });

  return root;
}

// ============================================================================
// 2. ORIGINAL RYOKAN (Traditional Japanese Atelier & Engineering Studio)
// ============================================================================
function createOriginalRyokan() {
  const root = new THREE.Group();
  root.name = 'RyokanRoot';

  // Architectural Materials
  const timberDarkMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.85, metalness: 0.05 });
  const timberPlankMat = new THREE.MeshStandardMaterial({ color: 0x6e4730, roughness: 0.75, metalness: 0.05 });
  const wallStuccoMat = new THREE.MeshStandardMaterial({ color: 0xf4eee4, roughness: 0.9, metalness: 0.02 });
  const roofTileMat = new THREE.MeshStandardMaterial({ color: 0x2b333c, roughness: 0.7, metalness: 0.15 });
  const roofRidgeMat = new THREE.MeshStandardMaterial({ color: 0x1f242b, roughness: 0.6, metalness: 0.2 });
  const shojiPaperMat = new THREE.MeshStandardMaterial({
    color: 0xfffcf0,
    emissive: 0xffd28a,
    emissiveIntensity: 0.45,
    roughness: 0.6,
  });
  const shojiLatticeMat = new THREE.MeshStandardMaterial({ color: 0x2d1c14, roughness: 0.9 });
  const stoneBaseMat = new THREE.MeshStandardMaterial({ color: 0x5a5752, roughness: 0.95 });
  const lanternGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffe099,
    emissive: 0xffa500,
    emissiveIntensity: 0.9,
    roughness: 0.3,
  });
  const norenFabricMat = new THREE.MeshStandardMaterial({ color: 0x8b2635, roughness: 0.85 });

  // 1. Foundation & Stone Plinth
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.4, 7.5), stoneBaseMat);
  foundation.position.set(-1.0, 0.2, -7.5);
  root.add(foundation);

  // 2. Wooden Veranda (Engawa)
  const engawaDeck = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.15, 1.2), timberPlankMat);
  engawaDeck.position.set(-1.0, 0.45, -4.0);
  root.add(engawaDeck);

  // Engawa Pillars
  for (let x = -5.6; x <= 3.6; x += 1.8) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.16), timberDarkMat);
    pillar.position.set(x, 1.7, -3.5);
    root.add(pillar);
  }

  // 3. Central Pavilion & Main Hall Walls
  const mainWall = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.8, 6.0), wallStuccoMat);
  mainWall.position.set(-0.5, 1.8, -7.5);
  root.add(mainWall);

  // West Wing Room
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 5.5), wallStuccoMat);
  westWall.position.set(-4.5, 1.7, -7.8);
  root.add(westWall);

  // East Wing Atelier (stops at x = 3.4 to leave lawn path open!)
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.6, 4.5), wallStuccoMat);
  eastWall.position.set(2.2, 1.7, -7.2);
  root.add(eastWall);

  // 4. Traditional Japanese Entrance Genkan (centered at X=0, Z=-4.6)
  const genkanStep = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.8), timberPlankMat);
  genkanStep.position.set(0.0, 0.5, -4.3);
  root.add(genkanStep);

  const genkanFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 0.2), timberDarkMat);
  genkanFrame.position.set(0.0, 1.7, -4.6);
  root.add(genkanFrame);

  // Sliding Shoji Doors
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), shojiPaperMat);
  leftDoor.position.set(-0.48, 1.6, -4.58);
  root.add(leftDoor);

  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), shojiPaperMat);
  rightDoor.position.set(0.48, 1.6, -4.58);
  root.add(rightDoor);

  // Shoji Grid Lattices on Doors
  [-0.48, 0.48].forEach((doorX) => {
    for (let dy = 0.8; dy <= 2.4; dy += 0.35) {
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.025, 0.08), shojiLatticeMat);
      hBar.position.set(doorX, dy, -4.57);
      root.add(hBar);
    }
  });

  // Japanese Noren Fabric Curtains above Entrance
  const noren = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.04), norenFabricMat);
  noren.position.set(0.0, 2.5, -4.54);
  root.add(noren);

  // Studio Atelier Wooden Signboard (Kanji: 庵 Atelier Tri)
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.06), timberDarkMat);
  signBoard.position.set(0.0, 2.9, -4.52);
  root.add(signBoard);

  // 5. Entrance Andon Lanterns
  [-1.3, 1.3].forEach((lx) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), timberDarkMat);
    post.position.set(lx, 1.25, -4.3);
    root.add(post);

    const lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.32), lanternGlowMat);
    lanternBox.position.set(lx, 1.7, -4.3);
    root.add(lanternBox);

    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.16, 4), roofTileMat);
    lanternCap.rotation.y = Math.PI / 4;
    lanternCap.position.set(lx, 1.95, -4.3);
    root.add(lanternCap);
  });

  // 6. Traditional Japanese Multi-Tiered Curved Tile Roofs
  // Entrance Eaves Roof
  const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 1.6), roofTileMat);
  porchRoof.position.set(0.0, 3.1, -4.3);
  porchRoof.rotation.x = -0.15;
  root.add(porchRoof);

  // Lower Main Eaves Roof
  const lowerEaves = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.35, 8.2), roofTileMat);
  lowerEaves.position.set(-1.0, 3.2, -7.5);
  root.add(lowerEaves);

  const lowerRidge = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.2, 0.35), roofRidgeMat);
  lowerRidge.position.set(-1.0, 3.4, -3.5);
  root.add(lowerRidge);

  // Upper Primary Roof (Irimoya Multi-tier)
  const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(4.2, 2.2, 4), roofTileMat);
  upperRoof.rotation.y = Math.PI / 4;
  upperRoof.scale.set(1.4, 1.0, 1.1);
  upperRoof.position.set(-1.0, 4.4, -7.5);
  root.add(upperRoof);

  // Top Ornamental Ridge Beam
  const ridgeTop = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 0.4), roofRidgeMat);
  ridgeTop.position.set(-1.0, 5.5, -7.5);
  root.add(ridgeTop);

  // 7. Garden Side Windows (Shoji screens on East and West)
  const eastShoji = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 2.4), shojiPaperMat);
  eastShoji.position.set(3.4, 1.7, -7.2);
  root.add(eastShoji);

  const westShoji = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 2.4), shojiPaperMat);
  westShoji.position.set(-6.5, 1.7, -7.8);
  root.add(westShoji);

  root.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });

  return root;
}

// ============================================================================
// 3. ORIGINAL SAKURA TREE (Gnarled Organic Trunk & Fluffy Layered Blossom Canopy)
// ============================================================================
function createOriginalSakuraTree() {
  const root = new THREE.Group();
  root.name = 'SakuraTreeRoot';

  // Bark & Blossom Materials
  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x3d2314, // Weathered rich cherry bark
    roughness: 0.9,
    metalness: 0.05,
  });
  const branchMat = new THREE.MeshStandardMaterial({
    color: 0x4a2e1b,
    roughness: 0.85,
    metalness: 0.05,
  });
  const blossomDeepMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6, // Vibrant sakura blossom core
    roughness: 0.75,
    metalness: 0.02,
  });
  const blossomBlushMat = new THREE.MeshStandardMaterial({
    color: 0xffb7c5, // Traditional blooming sakura pink
    roughness: 0.8,
    metalness: 0.02,
  });
  const blossomPaleMat = new THREE.MeshStandardMaterial({
    color: 0xffe4e8, // Delicate sunny blossom highlight
    roughness: 0.85,
    metalness: 0.02,
  });

  // --- Organic Gnarled Trunk ---
  // Base roots flaring into ground
  const rootFlairs = [
    { x: 0.8, z: 0.5, rotZ: -0.4, rotY: 0.3, len: 1.8 },
    { x: -0.7, z: 0.6, rotZ: 0.45, rotY: -0.5, len: 1.7 },
    { x: 0.2, z: -0.8, rotX: 0.4, rotY: 1.8, len: 1.6 },
    { x: -0.6, z: -0.6, rotX: -0.3, rotZ: 0.3, len: 1.5 },
  ];

  rootFlairs.forEach((rf) => {
    const rootMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, rf.len, 7), barkMat);
    rootMesh.position.set(rf.x * 0.7, 0.5, rf.z * 0.7);
    if (rf.rotZ) rootMesh.rotation.z = rf.rotZ;
    if (rf.rotX) rootMesh.rotation.x = rf.rotX;
    if (rf.rotY) rootMesh.rotation.y = rf.rotY;
    root.add(rootMesh);
  });

  // Lower Main Trunk
  const lowerTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 3.0, 10), barkMat);
  lowerTrunk.position.set(0, 1.5, 0);
  root.add(lowerTrunk);

  // Mid Trunk (twisted gently)
  const midTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.75, 3.2, 10), barkMat);
  midTrunk.position.set(0.15, 4.2, 0.05);
  midTrunk.rotation.z = -0.12;
  midTrunk.rotation.x = 0.08;
  root.add(midTrunk);

  // Upper Fork Trunk
  const upperTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 2.5, 9), barkMat);
  upperTrunk.position.set(0.4, 6.6, 0.15);
  upperTrunk.rotation.z = -0.18;
  root.add(upperTrunk);

  // --- Spreading Organic Boughs & Branches ---
  const branches = [
    { start: [0.3, 5.5, 0.1], dir: [2.2, 2.2, 0.8], rad: 0.32, len: 3.2, rot: [0.2, 0.4, -0.7] },
    { start: [-0.1, 5.2, 0.2], dir: [-2.4, 2.0, -0.6], rad: 0.3, len: 3.4, rot: [-0.3, -0.6, 0.8] },
    { start: [0.2, 6.2, -0.2], dir: [0.8, 2.4, -2.2], rad: 0.28, len: 3.0, rot: [-0.8, 1.2, -0.3] },
    { start: [0.4, 7.2, 0.3], dir: [-1.2, 2.6, 2.0], rad: 0.26, len: 3.0, rot: [0.7, -0.8, 0.4] },
    { start: [0.5, 7.6, 0.0], dir: [0.2, 2.8, -0.2], rad: 0.25, len: 2.8, rot: [0.1, 0.0, -0.1] },
  ];

  branches.forEach((b) => {
    const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(b.rad * 0.6, b.rad, b.len, 7), branchMat);
    bMesh.position.set(b.start[0] + b.dir[0] * 0.45, b.start[1] + b.dir[1] * 0.45, b.start[2] + b.dir[2] * 0.45);
    bMesh.rotation.set(...b.rot);
    root.add(bMesh);
  });

  // --- Layered Blooming Blossom Canopies (Puffy Clouds) ---
  const blossomClusters = [
    // Center High Crown
    { pos: [0.4, 10.2, 0.0], size: [2.8, 2.0, 2.8], mat: blossomPaleMat },
    { pos: [0.1, 9.6, -0.5], size: [2.5, 1.8, 2.5], mat: blossomBlushMat },
    { pos: [0.6, 9.8, 0.5], size: [2.4, 1.8, 2.4], mat: blossomBlushMat },

    // East Spreading Canopy (Right side)
    { pos: [2.8, 8.4, 1.0], size: [3.0, 2.1, 2.8], mat: blossomBlushMat },
    { pos: [3.4, 7.8, 0.8], size: [2.2, 1.6, 2.2], mat: blossomPaleMat },
    { pos: [2.2, 8.8, 0.4], size: [2.4, 1.7, 2.4], mat: blossomDeepMat },

    // West Spreading Canopy (Left side)
    { pos: [-2.6, 8.2, -0.6], size: [3.2, 2.2, 3.0], mat: blossomBlushMat },
    { pos: [-3.2, 7.5, -0.8], size: [2.3, 1.6, 2.3], mat: blossomPaleMat },
    { pos: [-1.8, 8.6, -0.2], size: [2.5, 1.8, 2.4], mat: blossomDeepMat },

    // Southward Front Canopy
    { pos: [-0.6, 7.8, 2.4], size: [2.8, 2.0, 2.6], mat: blossomBlushMat },
    { pos: [-0.4, 7.2, 3.0], size: [2.0, 1.5, 2.0], mat: blossomPaleMat },

    // Northward Rear Canopy
    { pos: [1.0, 8.6, -2.4], size: [2.8, 1.9, 2.6], mat: blossomBlushMat },
    { pos: [1.2, 8.0, -3.0], size: [2.1, 1.5, 2.0], mat: blossomDeepMat },
  ];

  blossomClusters.forEach((cl, idx) => {
    // Low-poly icosahedron / sphere with organic deformation for fluffy blossom texture
    const geo = new THREE.DodecahedronGeometry(cl.size[0], 1);
    const cluster = new THREE.Mesh(geo, cl.mat);
    cluster.name = `SakuraCluster_${idx}`;
    cluster.position.set(...cl.pos);
    cluster.scale.set(1.0, cl.size[1] / cl.size[0], cl.size[2] / cl.size[0]);
    cluster.rotation.set((idx * 0.4) % Math.PI, (idx * 0.7) % Math.PI, (idx * 0.3) % Math.PI);
    root.add(cluster);
  });

  root.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });

  return root;
}

// ============================================================================
// MAIN BUILD EXECUTION
// ============================================================================
async function main() {
  console.log('Generating Authentic Procedural 3D Asset Set...');
  const outDir = path.resolve('/tmp/portfolio/public/models');
  fs.mkdirSync(outDir, { recursive: true });

  const avatar = createOriginalAvatar();
  await exportGLB(avatar, path.join(outDir, 'OriginalAvatar.glb'));

  const ryokan = createOriginalRyokan();
  await exportGLB(ryokan, path.join(outDir, 'OriginalRyokan.glb'));

  const sakura = createOriginalSakuraTree();
  await exportGLB(sakura, path.join(outDir, 'OriginalSakuraTree.glb'));

  console.log('All Original Assets generated successfully!');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
