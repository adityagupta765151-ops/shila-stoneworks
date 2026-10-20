import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, reduced } from "../lib/gsap";
import { Head, Magnetic } from "./Core";
import { IMG, inr, STONES, type Stone } from "../data";

/* C051 horizontal library + C010 velocity skew + C024 price scramble + C046 slab → fullscreen */
export function Library({ onTry }: { onTry: (id: string) => void }) {
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<Stone | null>(null);
  const st = useRef<Flip.FlipState | null>(null), closing = useRef<string | null>(null);
  useGSAP(() => {
    const skew = gsap.quickTo(".slab-card", "skewX", { duration: 0.5, ease: "power3" });
    ScrollTrigger.matchMedia({ "(min-width: 769px)": () => {
      if (reduced()) return;
      const tw = gsap.to(track.current, { x: () => -(track.current!.scrollWidth - innerWidth), ease: "none",
        scrollTrigger: { trigger: sec.current, pin: true, scrub: 1, end: () => "+=" + (track.current!.scrollWidth - innerWidth), invalidateOnRefresh: true,
          onUpdate: (s) => skew(gsap.utils.clamp(-8, 8, -s.getVelocity() / 260)), onScrubComplete: () => skew(0) } });
      gsap.utils.toArray<HTMLElement>(".slab-img").forEach((el) =>
        gsap.fromTo(el, { backgroundPositionX: "0%" }, { backgroundPositionX: "100%", ease: "none", scrollTrigger: { trigger: el, containerAnimation: tw, start: "left right", end: "right left", scrub: true } }));
      gsap.utils.toArray<HTMLElement>(".slab-price").forEach((el) =>
        ScrollTrigger.create({ trigger: el, containerAnimation: tw, start: "left 90%", once: true,
          onEnter: () => gsap.to(el, { duration: 1, scrambleText: { text: el.dataset.v!, chars: "0123456789₹,", speed: 0.6 } }) }));
    } });
  });
  const open = (s: Stone) => { st.current = Flip.getState(`[data-flip-id="slab-${s.id}"]`); setSel(s); };
  const close = () => { if (!sel) return; if (reduced()) { setSel(null); return; }
    gsap.to(".sd-panel > *", { opacity: 0, duration: 0.15 }); st.current = Flip.getState(".sd-img"); closing.current = sel.id; setSel(null); };
  useLayoutEffect(() => {
    if (reduced() || !st.current) return;
    if (sel) {
      Flip.from(st.current, { targets: ".sd-img", duration: 0.85, ease: "power3.inOut", absolute: true });
      gsap.from(".sd-panel > *", { y: 30, opacity: 0, stagger: 0.05, delay: 0.5, duration: 0.6, ease: "power3.out" });
      gsap.from(".sd-bg", { opacity: 0, duration: 0.5 });
    } else if (closing.current) {
      Flip.from(st.current, { targets: `[data-flip-id="slab-${closing.current}"]`, duration: 0.7, ease: "power3.inOut", zIndex: 120 });
      closing.current = null;
    }
    st.current = null;
  }, [sel]);
  return (
    <section ref={sec} id="stones" className="overflow-hidden bg-slab md:flex md:h-screen md:items-center">
      <div ref={track} className="gutter flex flex-col gap-10 py-24 md:w-max md:flex-row md:items-stretch md:gap-6 md:py-0">
        <div className="flex flex-col justify-center md:w-[32vw] md:shrink-0 md:pr-8">
          <Head no="02" kicker="Stone library" title="Eight slabs, standing in the yard." />
          <p className="mt-6 max-w-[34ch] text-grey">Tap a slab to see it full size, with its origin, thickness and price per sq ft.</p>
        </div>
        {STONES.map((s, i) => (
          <button key={s.id} onClick={() => open(s)} data-cursor="Open slab" className="slab-card group flex flex-col bg-statuario text-left will-change-transform md:h-[72vh] md:w-[300px] md:shrink-0">
            <div data-flip-id={`slab-${s.id}`} className="slab-img relative h-72 w-full md:h-auto md:flex-1" style={{ backgroundImage: `url(${IMG(s.id)})`, backgroundSize: "220% auto", backgroundPosition: "0% 50%" }}>
              <span className={`lbl absolute left-3 top-3 px-2 py-1 ${s.dark ? "bg-statuario text-ink" : "bg-ink text-statuario"}`}>{s.kind}</span>
              <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.4)_48%,transparent_60%)] bg-[length:250%_100%] bg-[position:120%_0] transition-[background-position] duration-1000 group-hover:bg-[position:-40%_0]" />
            </div>
            <div className="w-full border-t border-seam p-5">
              <div className="lbl text-grey">Lot {String(i + 1).padStart(2, "0")} · {s.origin}</div>
              <h3 className="disp mt-2 text-3xl italic">{s.name}</h3>
              <div className="mt-4 flex items-end justify-between">
                <span className="lbl text-grey">{s.thick} · {s.finish}</span>
                <span className="font-mono text-rosso"><span className="slab-price" data-v={inr(s.price)}>{inr(s.price)}</span><span className="text-xs text-grey">/sq ft</span></span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div data-lenis-prevent role="dialog" aria-modal="true" aria-label={`${sel.name} slab`} onKeyDown={(e) => e.key === "Escape" && close()} className="fixed inset-0 z-[80] overflow-y-auto">
          <div className="sd-bg fixed inset-0 bg-statuario" />
          <div className="relative grid min-h-full md:grid-cols-[1.4fr_1fr]">
            <div className="relative h-[55vh] md:sticky md:top-0 md:h-screen">
              <div data-flip-id={`slab-${sel.id}`} className="sd-img absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG(sel.id)})` }} />
              <span className="lbl absolute bottom-4 left-4 bg-statuario px-2 py-1">Full slab · 290 × 180 cm</span>
            </div>
            <div className="sd-panel gutter flex flex-col justify-center gap-6 py-12 md:px-14">
              <button autoFocus onClick={close} className="lbl self-start border border-ink px-4 py-2 hover:bg-ink hover:text-statuario">← Back to the yard</button>
              <div className="lbl text-grey">{sel.kind} · {sel.origin}</div>
              <h3 className="disp text-[clamp(52px,6.5vw,104px)] italic">{sel.name}</h3>
              <p className="max-w-[40ch] text-lg text-grey">{sel.note}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-y border-seam py-5 text-sm">
                <dt className="lbl text-grey">Thickness</dt><dd className="font-mono">{sel.thick}</dd>
                <dt className="lbl text-grey">Finish</dt><dd>{sel.finish}</dd>
                <dt className="lbl text-grey">Best for</dt><dd>{sel.dark ? "Counters, feature walls, vanities" : "Living floors, stairs, wall cladding"}</dd>
                <dt className="lbl text-grey">Price</dt><dd className="font-mono text-rosso">{inr(sel.price)} / sq ft</dd>
              </dl>
              <div className="flex flex-wrap gap-3">
                <Magnetic><button onClick={() => { onTry(sel.id); setSel(null); setTimeout(() => (document.querySelector('a[href="#visualiser"]') as HTMLAnchorElement | null)?.click(), 50); }}
                  className="bg-ink px-6 py-4 font-medium text-statuario hover:bg-rosso">Try it on your floor →</button></Magnetic>
                <a href="#calculator" onClick={() => setSel(null)} className="border border-ink px-6 py-4 font-medium hover:bg-ink hover:text-statuario">Estimate cost</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
