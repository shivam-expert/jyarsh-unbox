"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { JEWEL_SIZE } from "@/lib/box";
import { content } from "@/lib/content";

type Piece = typeof content.piece;

/**
 * The jewellery piece. It lies on the velvet under the thank-you card, lifts straight
 * up out of the tray, and settles beside the card. GSAP drives its transform and the
 * shadow variables (--jx, --jy, --jb, --ja) on the outer element.
 */
export const Jewel = forwardRef<HTMLDivElement, { piece: Piece }>(function Jewel({ piece }, ref) {
  return (
    <div
      ref={ref}
      className="p3"
      style={{ left: -JEWEL_SIZE / 2, top: -JEWEL_SIZE / 2, width: JEWEL_SIZE, height: JEWEL_SIZE }}
    >
      <div className="face overflow-visible">
        <Image src={piece.src} alt={piece.name} fill sizes="300px" priority className="jewel-photo object-contain" />
      </div>
    </div>
  );
});
