// Geometry, the scroll-driven state, and the ribbon poses.
// All units are CSS px in the box's own space (scaled to the viewport later).

export const BOX = {
  w: 220, // sleeve width and length (square box)
  t: 60, // box thickness
  drawer: 214, // drawer tray size (3px clearance each side)
  wall: 54, // drawer wall height
} as const;

/** The full scene state. GSAP tweens these numbers; render() turns them into transforms. */
export type BoxState = {
  rx: number; rz: number; sx: number; sy: number; bz: number; // camera + centring
  side: number; bot: number; glue: number; // sleeve hinges (deg, 90 = folded)
  dx: number; dy: number; dz: number; flip: number; dw: number; // drawer position, flip, wall hinges
  cx: number; cy: number; cz: number; cs: number; // thank-you card
  jx: number; jy: number; jz: number; js: number; jlift: number; // jewellery piece (jlift 0 = on velvet, 1 = held up)
  shadow: number; // table shadow opacity
};

export const CLOSED: BoxState = {
  rx: 52, rz: 14, sx: 0, sy: 20, bz: 30,
  side: 90, bot: 90, glue: 88,
  dx: 0, dy: 0, dz: 0, flip: 0, dw: 90,
  cx: 0, cy: 0, cz: 0, cs: 1,
  jx: 0, jy: 0, jz: 0, js: 1, jlift: 0,
  shadow: 1,
};

/** Final flat layout: sleeve net on top; below it the flipped tray, and a column with the piece above the card. */
export const FLAT = { sx: -120, sy: -195, dx: -9, dy: 311, cx: 296, cy: 410, jx: 296, jy: 225 } as const;

/** Layout footprint of the final state, used to fit the scene to the viewport. */
export const FOOTPRINT = { w: 680, h: 650 } as const;

/** Size of the square the jewellery photo is fitted into while it lies in the tray. */
export const JEWEL_SIZE = 150;

/* ---------------- ribbon ---------------- */

export const RIBBON = {
  segments: 10,
  step: 4, // px per segment
  width: 26,
  slitY: 22, // where the ribbon leaves the drawer front, measured up from the tray's bottom edge
} as const;

/**
 * Each pose is the hinge angle (deg) between one ribbon segment and the next.
 * Positive angles swing the ribbon outward, away from the drawer front.
 */
export const RIBBON_POSES = {
  // drawer closed: runs down the front, turns over the bottom edge, lies on the table
  rest: [0, 0, 0, 0, 0, 42, 48, 0, 0, -6],
  // being pulled: lifted straight out toward the viewer
  pull: [0, 0, 0, 0, 18, 26, 26, 12, 6, 2],
  // drawer lifted off the table: hangs with a soft curl at the tip
  hang: [0, 0, 0, 0, 0, 4, 0, 3, 0, -4],
  // box laid flat: the tail folds back up over itself into a neat tab
  fold: [0, 0, 0, 0, 0, 90, 90, 0, 0, 0],
} as const;

export type RibbonPose = keyof typeof RIBBON_POSES;

export function poseToState(name: RibbonPose) {
  const out: Record<string, number> = {};
  RIBBON_POSES[name].forEach((a, i) => (out[`a${i}`] = a));
  return out;
}
