"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { content } from "@/lib/content";
import { BOX, CLOSED, FLAT, FOOTPRINT, RIBBON, RIBBON_POSES, poseToState, type BoxState } from "@/lib/box";
import { FoilDefs, Logo } from "./Logo";
import { Icon } from "./icons";
import Ribbon, { type RibbonHandle } from "./Ribbon";
import { Jewel } from "./Jewel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Refs = Record<string, HTMLElement | null>;
type ShadeKey = "top" | "wallL" | "wallR" | "bottom" | "drawerFront" | "drawerBack" | "drawerRight" | "drawerLeft" | "drawerBase";

const D = BOX.drawer;
const half = D / 2;

export default function JyarshUnfold() {
  const pin = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const el = useRef<Refs>({});
  const shade = useRef<Partial<Record<ShadeKey, HTMLElement | null>>>({});
  const ribbon = useRef<RibbonHandle>(null);

  const reg = (key: string) => (node: HTMLElement | null) => {
    el.current[key] = node;
  };
  const sh = (key: ShadeKey) => (node: HTMLElement | null) => {
    shade.current[key] = node;
  };

  useGSAP(
    () => {
      const r = el.current;
      const st: BoxState = { ...CLOSED };
      const rib = poseToState("rest");
      let k = 1;
      let progress = 0;

      const setShade = (key: ShadeKey, v: number) => shade.current[key]?.style.setProperty("--sh", Math.max(0, v).toFixed(3));

      function fit() {
        const hh = head.current ? head.current.getBoundingClientRect().bottom + 16 : 0;
        const foot = 24;
        // fit the scene in the space below the heading
        const room = window.innerHeight - hh - foot;
        k = Math.min(window.innerWidth / FOOTPRINT.w, room / FOOTPRINT.h, 1.3);
        r.fit!.style.top = r.ambient!.style.top = `${hh + room / 2}px`;
      }

      function render() {
        const camera = `translate(${st.sx}px,${st.sy}px) rotateX(${st.rx}deg) rotateZ(${st.rz}deg)`;
        const drawer = `translate3d(${st.dx}px,${st.dy}px,${-BOX.t + 4 + st.dz}px) rotateY(${st.flip}deg)`;

        r.fit!.style.transform = `scale(${k})`;
        r.scene!.style.transform = camera;
        r.box!.style.transform = `translateZ(${st.bz}px)`;
        r.wallL!.style.transform = `rotateY(${-st.side}deg)`;
        r.wallR!.style.transform = `rotateY(${st.side}deg)`;
        r.bottom!.style.transform = `rotateY(${st.bot}deg)`;
        r.glue!.style.transform = `rotateY(${st.glue}deg)`;
        r.drawer!.style.transform = drawer;
        r.dwF!.style.transform = `rotateX(${st.dw}deg)`;
        r.dwB!.style.transform = `rotateX(${-st.dw}deg)`;
        r.dwR!.style.transform = `rotateY(${-st.dw}deg)`;
        r.dwL!.style.transform = `rotateY(${st.dw}deg)`;
        r.card!.style.transform = `translate3d(${st.cx}px,${st.cy}px,${-BOX.t + 7 + st.cz}px) scale(${st.cs})`;
        r.jewel!.style.transform = `translate3d(${st.jx}px,${st.jy}px,${-BOX.t + 5 + st.jz}px) scale(${st.js})`;
        // the piece's shadow is tight on the velvet and grows soft and far as it lifts
        const jl = st.jlift;
        r.jewel!.style.setProperty("--jx", `${(3 + 9 * jl).toFixed(1)}px`);
        r.jewel!.style.setProperty("--jy", `${(5 + 18 * jl).toFixed(1)}px`);
        r.jewel!.style.setProperty("--jb", `${(5 + 14 * jl).toFixed(1)}px`);
        r.jewel!.style.setProperty("--ja", (0.6 - 0.42 * jl).toFixed(2));

        // Ribbon layer: the exact drawer-front transform chain, then out to the slit.
        if (ribbon.current?.layer) {
          ribbon.current.layer.style.transform =
            `${camera} translateZ(${st.bz}px) ${drawer} translate(0,${half}px) rotateX(${st.dw}deg) translate(${-half}px,0)` +
            ` translate3d(${half - RIBBON.width / 2}px,${RIBBON.slitY}px,-1px) rotateX(180deg)`;
          ribbon.current.setPose(Array.from({ length: RIBBON.segments }, (_, i) => rib[`a${i}`]));
        }

        // Light from the upper left: faces darken as they turn away.
        const tilt = st.rx / CLOSED.rx, s = st.side / 90, b = st.bot / 90, w = st.dw / 90;
        setShade("top", 0.02 * tilt);
        setShade("wallR", 0.26 * s + 0.04 * tilt);
        setShade("wallL", 0.42 * s);
        setShade("bottom", 0.5 * b);
        setShade("drawerFront", 0.14 * w * tilt + 0.06 * w);
        setShade("drawerBack", 0.3 * w);
        setShade("drawerRight", 0.24 * w);
        setShade("drawerLeft", 0.34 * w);
        setShade("drawerBase", 0.1 * (1 - st.flip / 180));

        // Table shadows follow the sleeve and the drawer, and fade as things lift.
        const lift = Math.min(1, st.dz / 40);
        r.gsBox!.style.opacity = r.gsBoxT!.style.opacity = String(st.shadow);
        r.gsDr!.style.transform = `translate3d(${st.dx + 8}px,${st.dy + 14}px,-67px)`;
        r.gsDrT!.style.transform = `translate3d(${st.dx + 2}px,${st.dy + 2}px,-66.6px)`;
        r.gsDr!.style.opacity = r.gsDrT!.style.opacity = String(st.shadow * (1 - lift) * Math.min(1, st.dy / 40));
        r.ambient!.style.opacity = String(st.shadow);
        r.ambient!.style.transform = `translateY(${110 * k}px) scale(${k})`;

        // Foil sheen drifts as you scroll.
        pin.current?.style.setProperty("--sheen", `${(24 + progress * 46).toFixed(1)}%`);
      }

      fit();
      render();

      const pose = (name: keyof typeof RIBBON_POSES) => poseToState(name);
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate() {
          progress = this.progress();
          render();
        },
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: "+=4400",
          pin: true,
          scrub: 0.8,
          onRefresh() {
            fit();
            render();
          },
        },
      });

      tl.to(r.cue!, { opacity: 0, duration: 0.3 }, 0)
        // 1. a finger lifts the ribbon, then pulls the drawer out with it
        .to(rib, { ...pose("pull"), duration: 0.35, ease: "power2.out" }, 0)
        .to(st, { dy: 150, cy: 150, jy: 150, duration: 1, ease: "power2.inOut" }, 0.2)
        .to(st, { rz: 8, rx: 48, duration: 1.2 }, 0)
        // ...and lets go: the ribbon drops back onto the table with a little bounce
        .to(rib, { ...pose("rest"), duration: 0.6, ease: "back.out(2.2)" }, 1.2)
        // 2. the thank-you card lifts out, revealing the piece on the velvet
        .to(st, { cz: 110, cy: -95, cs: 1.05, duration: 1, ease: "power3.out" }, 1.25)
        // hold on the open drawer so the piece can be seen
        .to(st, { rx: 42, rz: 6, duration: 0.9 }, 1.9)
        // 3. the piece lifts straight up out of the tray (clear of the walls before the drawer moves)
        .to(st, { jz: 150, js: 1.1, jlift: 1, duration: 0.7, ease: "power2.out" }, 2.5)
        // drawer slides clear and lifts; the ribbon now hangs free
        .to(st, { dy: 340, dz: 120, duration: 0.8 }, 3.1)
        .to(rib, { ...pose("hang"), duration: 0.7, ease: "sine.inOut" }, 3.1)
        // everything turns to face you and unfolds flat
        .to(st, { rx: 0, rz: 0, bz: 0, sx: FLAT.sx, sy: FLAT.sy, duration: 1.4 }, 3.4)
        .to(st, { shadow: 0, duration: 0.7 }, 3.3)
        .to(st, { side: 0, duration: 1.1 }, 3.8)
        .to(st, { bot: 0, duration: 1.1 }, 4.0)
        .to(st, { glue: 0, duration: 0.9 }, 4.3)
        .to(st, { dx: FLAT.dx, dy: FLAT.dy, flip: 180, duration: 1.2 }, 3.9)
        .to(st, { dw: 0, dz: 56, duration: 1 }, 4.4)
        // the ribbon tail folds back over itself into a neat tab
        .to(rib, { ...pose("fold"), duration: 0.9, ease: "power3.inOut" }, 4.6)
        // 4. the piece and the card settle beside the tray
        .to(st, { jx: FLAT.jx, jy: FLAT.jy, jz: 55, js: 1, jlift: 0.55, duration: 1.2, ease: "power3.inOut" }, 4.6)
        .to(st, { cx: FLAT.cx, cy: FLAT.cy, cz: 53, cs: 1.2, duration: 1.2, ease: "power3.inOut" }, 5.0)
        .to({}, { duration: 0.5 });

      const onResize = () => {
        fit();
        render();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: pin }
  );

  return (
    <section ref={pin} className="relative h-screen overflow-hidden supports-[height:100svh]:h-[100svh]">
      <FoilDefs />

      <div className="fixed left-7 top-[calc(env(safe-area-inset-top,0px)+26px)] z-10">
        <Logo size={20} />
      </div>

      <div ref={head} className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top,0px)+clamp(64px,9vh,96px))] z-[4] px-6 text-center">
        <h1 className="font-display text-[clamp(34px,5.2vw,64px)] font-medium leading-[1.02] tracking-[-0.01em] text-ink">{content.heading}</h1>
        <span className="mx-auto mb-3 mt-4 block h-px w-14 bg-[linear-gradient(90deg,transparent,#B48838_20%,#E2C47F_50%,#B48838_80%,transparent)]" />
        <p className="text-[clamp(12px,1.1vw,14px)] text-muted">{content.subheading}</p>
      </div>

      {/* broad ambient shadow under the closed box */}
      <div
        ref={reg("ambient")}
        className="pointer-events-none absolute left-1/2 -ml-[220px] -mt-[60px] h-[120px] w-[440px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,45,15,.16),rgba(70,45,15,0))]"
        style={{ top: "calc(50% + var(--head-h,0px) / 2)" }}
      />

      <div ref={reg("fit")} className="absolute left-1/2 h-0 w-0" style={{ top: "calc(50% + var(--head-h,0px) / 2)", perspective: 1600 }}>
        <div ref={reg("scene")} className="p3 left-0 top-0">
          <div ref={reg("box")} className="p3 left-0 top-0">
            {/* table shadows */}
            <div ref={reg("gsBox")} className="table-shadow" style={{ left: -114, top: -114, width: 228, height: 228, transform: "translate3d(10px,16px,-67px)" }} />
            <div ref={reg("gsBoxT")} className="table-shadow tight" style={{ left: -111, top: -111, width: 222, height: 222, transform: "translate3d(2px,2px,-66.6px)" }} />
            <div ref={reg("gsDr")} className="table-shadow" style={{ left: -half, top: -half, width: D, height: D }} />
            <div ref={reg("gsDrT")} className="table-shadow tight" style={{ left: -half, top: -half, width: D, height: D }} />

            <Jewel ref={reg("jewel")} piece={content.piece} />
            <ThankYouCard cardRef={reg("card")} />
            <Drawer reg={reg} sh={sh} />
            <Sleeve reg={reg} sh={sh} />
          </div>
        </div>
        <Ribbon ref={ribbon} />
      </div>

      <div ref={reg("cue")} className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+26px)] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[13px] text-muted">
        <span className="scroll-cue relative h-6 w-4 rounded-[10px] border-[1.5px] border-current after:absolute after:left-1/2 after:top-[5px] after:-ml-px after:h-[5px] after:w-0.5 after:animate-bounce after:rounded-sm after:bg-current" />
        {content.scrollCue}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

type PartProps = {
  reg: (key: string) => (node: HTMLElement | null) => void;
  sh: (key: ShadeKey) => (node: HTMLElement | null) => void;
};

function Sleeve({ reg, sh }: PartProps) {
  const W = BOX.w, T = BOX.t;
  return (
    <div className="p3" style={{ left: -W / 2, top: -W / 2, width: W, height: W }}>
      <div ref={sh("top")} className="face kraft crease grid place-items-center">
        <Logo size={25} />
      </div>
      <div className="face face-back kraft-inner" />
      <div className="p3 rim"><div className="face" /></div>

      {/* left wall */}
      <div ref={reg("wallL")} className="p3" style={{ right: "100%", top: 0, width: T, height: W, transformOrigin: "100% 50%" }}>
        <div ref={sh("wallL")} className="face kraft crease grid place-items-center">
          <span className="-rotate-90"><Logo size={12} /></span>
        </div>
        <div className="face face-back kraft-inner" />
      </div>

      {/* right wall → bottom → glue flap */}
      <div ref={reg("wallR")} className="p3" style={{ left: "100%", top: 0, width: T, height: W, transformOrigin: "0 50%" }}>
        <div ref={sh("wallR")} className="face kraft crease grid place-items-center">
          <span className="-rotate-90"><Logo size={12} /></span>
        </div>
        <div className="face face-back kraft-inner" />
        <div className="p3 rim"><div className="face" /></div>

        <div ref={reg("bottom")} className="p3" style={{ left: "100%", top: 0, width: W, height: W, transformOrigin: "0 50%" }}>
          <div ref={sh("bottom")} className="face kraft crease">
            <div className="absolute inset-x-3 inset-y-3.5 flex flex-col">
              <h3 className="mb-2 text-center text-[14px] font-semibold text-[#3A2810]">{content.why.title}</h3>
              <ul className="grid flex-1 grid-cols-2 gap-1.5">
                {content.why.items.map((it) => (
                  <li
                    key={it.label}
                    className="flex flex-col items-center justify-center gap-[3px] whitespace-pre-line rounded-md border border-[rgba(138,94,34,.55)] bg-[rgba(252,247,236,.82)] p-[3px] text-center text-[7.5px] font-medium leading-tight text-[#33240E] shadow-[0_1.5px_0_rgba(138,94,34,.55)]"
                  >
                    <Icon name={it.icon} className="h-5 w-5" />
                    {it.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="face face-back kraft-inner" />

          <div ref={reg("glue")} className="p3" style={{ left: "100%", top: 0, width: 20, height: W, transformOrigin: "0 50%" }}>
            <div className="face kraft" style={{ clipPath: "polygon(0 0,100% 10%,100% 90%,0 100%)" }} />
            <div className="face face-back kraft-inner" style={{ clipPath: "polygon(0 0,100% 10%,100% 90%,0 100%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Drawer({ reg, sh }: PartProps) {
  const H = BOX.wall;
  return (
    <div ref={reg("drawer")} className="p3" style={{ left: -half, top: -half, width: D, height: D }}>
      <div className="face velvet" />
      {/* underside of the tray: shown once the drawer flips over */}
      <div ref={sh("drawerBase")} className="face face-back kraft crease">
        <div className="absolute inset-x-4 bottom-3.5 top-[26px] grid grid-cols-2 grid-rows-[auto_1fr_1fr] gap-x-2.5 gap-y-2">
          <div className="col-span-2 flex justify-center"><Logo size={14} /></div>
          {content.promises.map((p) => (
            <div key={p.label} className="flex flex-col items-center justify-center gap-1 whitespace-pre-line text-center text-[8.5px] font-semibold leading-tight text-[#33240E]">
              <Icon name={p.icon} className="h-[30px] w-[30px]" />
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div ref={reg("dwF")} className="p3" style={{ left: 0, top: "100%", width: D, height: H, transformOrigin: "50% 0" }}>
        <div className="face velvet ao-t" />
        <div ref={sh("drawerFront")} className="face face-back kraft crease" />
        <div className="p3 drim"><div className="face" /></div>
      </div>
      <div ref={reg("dwB")} className="p3" style={{ left: 0, bottom: "100%", width: D, height: H, transformOrigin: "50% 100%" }}>
        <div className="face velvet ao-b" />
        <div ref={sh("drawerBack")} className="face face-back kraft crease" />
      </div>
      <div ref={reg("dwR")} className="p3" style={{ left: "100%", top: 0, width: H, height: D, transformOrigin: "0 50%" }}>
        <div className="face velvet ao-l" />
        <div ref={sh("drawerRight")} className="face face-back kraft crease" />
      </div>
      <div ref={reg("dwL")} className="p3" style={{ right: "100%", top: 0, width: H, height: D, transformOrigin: "100% 50%" }}>
        <div className="face velvet ao-r" />
        <div ref={sh("drawerLeft")} className="face face-back kraft crease" />
      </div>
    </div>
  );
}

function ThankYouCard({ cardRef }: { cardRef: (node: HTMLElement | null) => void }) {
  return (
    <div ref={cardRef} className="p3" style={{ left: -95, top: -75, width: 190, height: 150 }}>
      <div className="face flex flex-col items-center justify-center rounded-sm bg-[linear-gradient(160deg,#FFFDF8,#F6F1E7)] p-2.5 text-center shadow-[0_0_0_.6px_rgba(0,0,0,.07),0_14px_26px_-10px_rgba(50,30,10,.35)]">
        <div className="font-script text-[34px] leading-[0.9] text-[#231E18]">{content.card.thanks}</div>
        <div className="mt-2 flex items-end gap-1.5 text-[6.5px] text-[#3F382F]">
          <span>{content.card.forChoosing}</span>
          <Logo size={15} />
        </div>
        <p className="mb-2 mt-2.5 whitespace-pre-line text-[7px] leading-relaxed text-[#3A352E]">{content.card.message}</p>
        <div className="text-[9px] tracking-[3px] text-[#B8892F]" aria-label="5 stars">★★★★★</div>
      </div>
    </div>
  );
}
