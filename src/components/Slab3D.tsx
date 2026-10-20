import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP, reduced } from "../lib/gsap";
import { IMG, STONES } from "../data";
const SlabCanvas = lazy(() => import("./SlabCanvas"));

const CHAPTERS = [
  ["The face", "Polished on a 16-head line until the veins sit under a glass-clear surface."],
  ["The edge", "18 mm thick, edges hand-finished: straight, bevelled or bullnose for steps."],
  ["The back", "Fragile stones like onyx get a fibreglass mesh backing, so they don't crack in transit."],
];
export function Slab3D() {
  const sec = useRef<HTMLElement>(null), progress = useRef(reduced() ? 0.15 : 0);
  const [id, setId] = useState("statuario"), [ch, setCh] = useState(0), [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "600px" });
    io.observe(sec.current!); return () => io.disconnect();
  }, []);
  useGSAP(() => {
    if (reduced()) return;
    ScrollTrigger.create({ trigger: sec.current, start: "top top", end: "+=220%", pin: true, scrub: true,
      onUpdate: (s) => { progress.current = s.progress; setCh(Math.min(2, Math.floor(s.progress * 3))); } });
  });
  return (
    <section ref={sec} className="relative h-[100svh] overflow-hidden bg-ink text-statuario">
      <div className="absolute inset-0">
        {show && <Suspense fallback={<div className="absolute inset-0 grid place-items-center lbl text-statuario/50">Loading slab…</div>}><SlabCanvas id={id} progress={progress} /></Suspense>}
      </div>
      <div className="gutter pointer-events-none relative flex h-full flex-col justify-between py-24">
        <div className="max-w-md">
          <div className="lbl mb-4 flex items-center gap-3 text-statuario/60"><span className="text-rosso">03</span><span className="h-px w-8 bg-current" />Turn the slab</div>
          <h2 className="disp text-[clamp(40px,5.4vw,80px)]">One slab, every side.</h2>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-sm">
            <div className="lbl text-rosso">0{ch + 1} / 03</div>
            <div className="disp mt-2 text-4xl italic">{CHAPTERS[ch][0]}</div>
            <p className="mt-2 text-statuario/70">{CHAPTERS[ch][1]}</p>
          </div>
          <div className="pointer-events-auto flex gap-2">
            {STONES.slice(0, 7).map((x) => (
              <button key={x.id} onClick={() => setId(x.id)} aria-pressed={id === x.id} title={x.name} data-cursor={x.name.split(" ")[0]}
                className={`h-11 w-11 border-2 bg-cover transition-transform hover:-translate-y-1 ${id === x.id ? "border-rosso" : "border-statuario/20"}`} style={{ backgroundImage: `url(${IMG(x.id)})` }}><span className="sr-only">{x.name}</span></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
