# Jyarsh — box unfold on scroll

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger (`@gsap/react`).

A kraft drawer box sits on the table. As you scroll, a finger lifts the satin ribbon, the drawer slides out,
the thank-you card rises to reveal a Jyarsh piece on the velvet, the piece lifts out, then the sleeve and tray
unfold flat and the piece and card settle beside them.

```bash
npm install
npm run dev     # http://localhost:3000
```

## Files

| Path | What it does |
| --- | --- |
| `components/jyarsh/JyarshUnfold.tsx` | The pinned scroll section: heading, 3D scene, GSAP timeline, lighting and shadows |
| `components/jyarsh/Ribbon.tsx` | The hinged satin ribbon (the fold) |
| `components/jyarsh/Jewel.tsx` | The jewellery piece in the tray |
| `public/jewellery/` | Product photo (transparent WebP, trimmed to the piece) |
| `components/jyarsh/Logo.tsx` | Gold-foil wordmark with the diamond J |
| `components/jyarsh/icons.tsx` | Line icons used on the packaging |
| `lib/box.ts` | Box dimensions, closed/flat states and ribbon poses |
| `lib/content.ts` | Every word printed on the box and card |
| `app/globals.css` | 3D primitives, kraft texture, velvet, satin |

## How it works

- **One state object, one render.** GSAP tweens plain numbers (`BoxState` + ribbon angles) and a single
  `render()` writes every transform straight to the DOM. React renders the markup once and never re-renders
  while you scroll.
- **The box is a hinged net.** The sleeve top is the root; walls, bottom and glue flap are nested children, so
  unfolding is just tweening each hinge back to 0°. The drawer is a tray (base + 4 walls) that flips over to
  show its printed underside.
- **Lighting.** Each face gets a `--sh` shade value from its current angle, so walls darken as they turn away
  from the light and even out once flat.

## The ribbon fold

`Ribbon.tsx` is a chain of 10 segments, each nested inside the one before it with its own `rotateX` hinge, so
bending one hinge carries everything after it, like fabric. A pose is a list of hinge angles
(`RIBBON_POSES` in `lib/box.ts`):

| Pose | When |
| --- | --- |
| `rest` | Box closed: runs down the drawer front, turns over the bottom edge, lies on the table |
| `pull` | A finger lifts it out before the drawer slides |
| `rest` again (`back.out` ease) | Let go: it drops back with a small bounce |
| `hang` | Drawer lifted: hangs free with a soft curl |
| `fold` | Box flat: the tail folds 180° back over itself into a tab |

Each segment re-lights itself from its cumulative angle (tilted up catches light, turned down falls into
shade) and bent hinges get a thin crease highlight. Both sides of the satin render, so the folded-back layer
shows.

The ribbon is its **own 3D layer**, outside the box's `preserve-3d` tree, with the drawer-front transform chain
copied onto it every frame. Inside the same tree the browser slices intersecting planes, which left visible
seams where the ribbon crossed the tray edge.

To change the fold, edit the angles in `RIBBON_POSES`. For a longer or smoother ribbon, change
`RIBBON.segments` / `RIBBON.step` and give every pose the same number of angles.

## Changing the piece

Drop a transparent PNG/WebP into `public/jewellery/` and point `piece` in `lib/content.ts` at it
(`slug`, `name`, `src`). It is fitted into a 150 px square in the tray (`JEWEL_SIZE` in `lib/box.ts`), so trim
empty space around the piece for the best fit.

## Re-skinning

- Copy: `lib/content.ts`
- Box size: `BOX` in `lib/box.ts` (sleeve 220 × 220 × 60, tray 214)
- Kraft, velvet and satin colours: `app/globals.css`
- Fonts: `app/layout.tsx` (Cormorant Garamond, Poppins, Allura via `next/font`)
