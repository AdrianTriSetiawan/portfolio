// Comprehensive Watertight Collision System for Adrian's Portfolio
// Based on exact WoraWork geometry and obstacle boundaries.
// Provides mathematical sliding penetration resolution to prevent sticking.

export const AVATAR_RADIUS = 0.5;

// --- Outdoor Obstacle Definitions ---
export const OUTDOOR_BOXES = [
  // 1. Ryokan Main House Structure & Veranda:
  // West Wing of Ryokan
  { minX: -6.8, maxX: -1.35, minZ: -13.0, maxZ: -4.3 },
  // East Wing of Ryokan (wall ends at X ≈ 3.6, leaves right corridor X in [3.6, 8.0] open!)
  { minX: 1.25, maxX: 3.6, minZ: -10.5, maxZ: -4.6 },
  // Back Wall behind entrance door (doorway clear at X: [-1.35, 1.35], Z: [-5.0, -3.8])
  { minX: -1.35, maxX: 1.35, minZ: -13.0, maxZ: -5.5 },

  // 2. Picnic table, chairs, books, coffee (X: [-4.8, -2.4], Z: [-1.6, 0.1]):
  // Keeps garden tea table path X: [-3.2, -0.8], Z: [-0.8, 1.5] clear and accessible!
  { minX: -4.8, maxX: -2.4, minZ: -1.6, maxZ: 0.1 },

  // 3. Shed / Shelter southwest by river:
  { minX: -12.4, maxX: -6.6, minZ: 8.0, maxZ: 13.5 },

  // 4. River & water bounds. The central bridge opening stays x ∈ [-1.95, 1.95].
  // Water surface: z ∈ [3.8, 8.5], with explicit solid banks on every visible edge.
  { minX: -18.0, maxX: -2.1, minZ: 3.8, maxZ: 8.5 },
  { minX: 2.1, maxX: 18.0, minZ: 3.8, maxZ: 8.5 },
  // South banks stop at the bridge abutments; these prevent corner entry without
  // sealing the walkable right-lawn route at x > 2.1, z < 3.35.
  { minX: -18.0, maxX: -2.1, minZ: 3.35, maxZ: 3.8 },
  { minX: 2.1, maxX: 18.0, minZ: 3.35, maxZ: 3.8 },
  // North banks close the visible water openings while leaving the bridge exit open.
  { minX: -18.0, maxX: -2.1, minZ: 8.5, maxZ: 8.95 },
  { minX: 2.1, maxX: 18.0, minZ: 8.5, maxZ: 8.95 },
  // Bridge Left & Right Railings
  { minX: -2.5, maxX: -1.95, minZ: 3.9, maxZ: 8.3 },
  { minX: 1.95, maxX: 2.5, minZ: 3.9, maxZ: 8.3 },

  // 5. South & Perimeter Boundary Fences
  { minX: -14.0, maxX: 14.0, minZ: 13.6, maxZ: 16.0 },

  // 6. Mountain / Cliffs Bounds
  { minX: 7.6, maxX: 18.0, minZ: -14.0, maxZ: -4.0 },
  { minX: 13.6, maxX: 18.0, minZ: -4.0, maxZ: 2.8 },
  { minX: 11.4, maxX: 18.0, minZ: 8.4, maxZ: 14.5 },
  { minX: -18.0, maxX: -10.2, minZ: -14.0, maxZ: 2.8 },
];

export const OUTDOOR_CIRCLES = [
  // Keep the cut stump solid; the shrine ring is centered on it.
  { x: 5.8, z: 1.8, r: 0.35 },
  // Runtime sakura trunks.
  { x: -7.8, z: 0.8, r: 0.29 },
  { x: -4.8, z: 1.8, r: 0.27 },
  { x: -8.5, z: -2.5, r: 0.32 },
  // Outdoor lantern posts.
  { x: -3.19, z: 2.76, r: 0.4 },
  { x: 1.63, z: 8.59, r: 0.4 },
  { x: -1.59, z: 8.59, r: 0.4 },
];

// --- Indoor Obstacle Definitions (Y ≈ 200) ---
export const INDOOR_BOXES = [
  // Perimeter Walls of the House Room
  // North Wall
  { minX: -11.0, maxX: 11.0, minZ: -11.5, maxZ: -10.2 },
  // South Wall (West side of door)
  { minX: -11.0, maxX: -1.2, minZ: 9.8, maxZ: 11.5 },
  // South Wall (East side of door)
  { minX: 1.2, maxX: 11.0, minZ: 9.8, maxZ: 11.5 },
  // West Wall
  { minX: -11.5, maxX: -10.2, minZ: -11.5, maxZ: 11.5 },
  // East Wall
  { minX: 10.2, maxX: 11.5, minZ: -11.5, maxZ: 11.5 },

  // Internal Furniture:
  // 1. Dev Desk / PC Workstation (East side):
  { minX: 4.8, maxX: 7.5, minZ: 0.8, maxZ: 6.8 },

  // 2. Bed & Bedside Bench (Northeast corner):
  { minX: 3.5, maxX: 8.5, minZ: -10.5, maxZ: -2.8 },

  // 3. Lounge Sofa & Coffee Table (West / Southwest):
  { minX: -8.5, maxX: -2.4, minZ: 1.2, maxZ: 7.5 },

  // 4. Kitchenette / Refrigerator / Tech Shelf (Northwest):
  { minX: -11.0, maxX: -1.0, minZ: -10.5, maxZ: -6.5 },
  // Kitchen Stool
  { minX: -8.0, maxX: -4.0, minZ: -6.8, maxZ: -4.8 },

  // 5. Center Room Dividing Screen:
  { minX: -3.2, maxX: 2.8, minZ: 0.1, maxZ: 0.8 },
];

export const INDOOR_CIRCLES = [
  // Room corner lamps & pillars
  { x: 3.5, z: 9.8, r: 0.45 },
  { x: -9.8, z: -9.7, r: 0.5 },
];

/**
 * Resolves player collision using mathematical penetration depth resolution.
 * If player overlaps with an obstacle, calculates the minimal translation vector
 * and pushes player out smoothly along the obstacle normal:
 *   player.position.x += normalX * penetration;
 *   player.position.z += normalZ * penetration;
 * This sliding physics mathematically prevents the player from ever penetrating
 * an obstacle OR getting stuck in a corner.
 */
export function resolveCollisions(pos, isIndoor, radius = AVATAR_RADIUS) {
  let px = pos.x;
  let pz = pos.z;

  const boxes = isIndoor ? INDOOR_BOXES : OUTDOOR_BOXES;
  const circles = isIndoor ? INDOOR_CIRCLES : OUTDOOR_CIRCLES;

  // Diorama Edge Clamps
  if (!isIndoor) {
    px = Math.max(-10.8, Math.min(13.6, px));
    pz = Math.max(-13.0, Math.min(13.6, pz));
  } else {
    px = Math.max(-10.2, Math.min(10.2, px));
    pz = Math.max(-10.2, Math.min(9.6, pz));
  }

  // Extra passes recover cleanly from deep entry at the indoor doorway and
  // overlapping furniture corners (kitchen/partition/bed).
  for (let iter = 0; iter < 8; iter++) {
    // 1. Box resolution (Watertight Sliding Physics)
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      const cx = Math.max(b.minX, Math.min(px, b.maxX));
      const cz = Math.max(b.minZ, Math.min(pz, b.maxZ));
      const dx = px - cx;
      const dz = pz - cz;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        if (distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const penetration = radius - dist;
          const normalX = dx / dist;
          const normalZ = dz / dist;
          px += normalX * penetration;
          pz += normalZ * penetration;
        } else {
          // Player center is inside AABB: push out along minimal penetration axis
          const left = px - b.minX;
          const right = b.maxX - px;
          const top = pz - b.minZ;
          const bottom = b.maxZ - pz;
          const minVal = Math.min(left, right, top, bottom);
          if (minVal === left) px = b.minX - radius;
          else if (minVal === right) px = b.maxX + radius;
          else if (minVal === top) pz = b.minZ - radius;
          else pz = b.maxZ + radius;
        }
      }
    }

    // 2. Circle resolution (Watertight Sliding Physics)
    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      const dx = px - c.x;
      const dz = pz - c.z;
      const distSq = dx * dx + dz * dz;
      const minDist = radius + c.r;

      if (distSq < minDist * minDist) {
        if (distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const penetration = minDist - dist;
          const normalX = dx / dist;
          const normalZ = dz / dist;
          px += normalX * penetration;
          pz += normalZ * penetration;
        } else {
          px += minDist;
        }
      }
    }
  }

  return { x: px, z: pz };
}
