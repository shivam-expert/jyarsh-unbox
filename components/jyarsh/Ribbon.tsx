"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { RIBBON } from "@/lib/box";

export type RibbonHandle = {
  /** The layer that follows the drawer front; its transform is set by the parent. */
  layer: HTMLDivElement | null;
  /** Apply hinge angles (deg) to each segment and re-light the satin. */
  setPose: (angles: number[]) => void;
};

/**
 * A satin ribbon made of hinged segments. Each segment is nested inside the
 * previous one, so bending one hinge carries everything below it, like fabric.
 *
 * It renders as its own 3D layer (outside the box's preserve-3d tree) so the
 * browser never slices it against the box panels; the parent copies the
 * drawer-front transform onto it every frame.
 */
const Ribbon = forwardRef<RibbonHandle>(function Ribbon(_, ref) {
  const layer = useRef<HTMLDivElement>(null);
  const segs = useRef<(HTMLDivElement | null)[]>([]);
  const fronts = useRef<(HTMLDivElement | null)[]>([]);
  const backs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    get layer() {
      return layer.current;
    },
    setPose(angles) {
      let total = 0;
      for (let i = 0; i < RIBBON.segments; i++) {
        const a = angles[i] ?? 0;
        total += a;
        const seg = segs.current[i];
        if (seg) seg.style.transform = `rotateX(${a.toFixed(2)}deg)`;

        // Light from above: a segment tilted up catches it, one turned down falls into shade.
        const lit = Math.sin((total * Math.PI) / 180);
        const crease = Math.min(1, Math.abs(a) / 60) * 0.55;
        paint(fronts.current[i], lit, crease);
        paint(backs.current[i], -lit, crease);
      }
    },
  }));

  function paint(face: HTMLDivElement | null, lit: number, crease: number) {
    if (!face) return;
    face.style.setProperty(
      "--rib-light",
      lit >= 0 ? `rgba(255,246,218,${(lit * 0.38).toFixed(3)})` : `rgba(40,22,6,${(-lit * 0.42).toFixed(3)})`
    );
    face.style.setProperty("--rib-crease", crease.toFixed(3));
  }

  const segH = RIBBON.step + 0.8; // slight overlap hides hairline seams between segments

  // A plain render function (not a nested component) so React never remounts the chain.
  function segment(i: number): JSX.Element {
    return (
      <div
        ref={(el) => {
          segs.current[i] = el;
        }}
        key={i}
        className="rib-seg"
        style={{ top: i === 0 ? 0 : RIBBON.step, height: RIBBON.step }}
      >
        <div
          ref={(el) => {
            fronts.current[i] = el;
          }}
          className="rib-face satin"
          style={{ height: segH }}
        />
        <div
          ref={(el) => {
            backs.current[i] = el;
          }}
          className="rib-face satin"
          style={{ height: segH, transform: "rotateY(180deg)" }}
        />
        {i < RIBBON.segments - 1 && segment(i + 1)}
      </div>
    );
  }

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 origin-top-left"
      style={{ width: RIBBON.width, height: 0, transformStyle: "preserve-3d" }}
    >
      {/* slit in the drawer front and the soft shadow the ribbon throws on the board */}
      <div
        className="absolute rounded-full"
        style={{ left: -2, top: -1.6, width: RIBBON.width + 4, height: 1.8, background: "rgba(42,24,4,.6)", transform: "translateZ(-0.6px)" }}
      />
      <div
        className="absolute"
        style={{ left: 2, top: 1, width: RIBBON.width, height: 20, background: "rgba(42,24,4,.32)", filter: "blur(1.5px)", transform: "translateZ(-0.8px)" }}
      />
      {segment(0)}
    </div>
  );
});

export default Ribbon;
