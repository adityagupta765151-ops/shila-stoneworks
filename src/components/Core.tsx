import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, useGSAP, reduced, fine, lenisRef } from "../lib/gsap";

export function Logo({ className = "h-9 w-9", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="10" fill={light ? "#f2f1ee" : "#123129"} />
      <path d="M14 50 L14 18 L34 12 L50 16 L50 48 L30 54 Z" fill={light ? "#123129" : "#f2f1ee"} />
      <path d="M14 30 C24 26 26 40 36 34 S46 26 50 30" stroke="#9b3b2e" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
export function Wordmark({ light = false }: { light?: boolean }) {
  return <span className="flex items-center gap-3"><Logo light={light} /><span className={`flex flex-col leading-none ${light ? "text-statuario" : ""}`}>
    <span className="disp text-[22px] italic">Shila</span><span className="lbl mt-0.5 text-[9px] opacity-70">Stoneworks</span></span></span>;
}

/* C001 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.1 }); lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, []);
  return <>{children}</>;
}

/* C002 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } }); });
  return <div ref={bar} className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left scale-x-0 bg-rosso" />;
}

/* C008 preloader: a slab gets polished, left to right */
export function Preloader({ onDone }: { onDone: () => void }) {
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  useGSAP(() => {
    if (reduced()) { setDone(true); onDone(); return; }
    const o = { v: 0 };
    gsap.timeline({ onComplete: () => { setDone(true); onDone(); } })
      .fromTo(".pl-polish", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power2.inOut" })
      .to(o, { v: 1200, duration: 1.4, ease: "power2.inOut", onUpdate: () => { num.current!.textContent = Math.round(o.v).toLocaleString("en-IN"); } }, 0)
      .to(".pl-root", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }, "+=0.15");
  });
  if (done) return null;
  return (
    <div className="pl-root fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-verde text-statuario" style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="relative h-40 w-64 overflow-hidden rounded-sm md:h-48 md:w-80">
        <img src="./img/statuario-honed.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <img src="./img/statuario.jpg" alt="" className="pl-polish absolute inset-0 h-full w-full object-cover" />
      </div>
      <span className="lbl text-statuario/70">Polishing · <span ref={num}>0</span> sq ft</span>
    </div>
  );
}

/* C075 + C076 + C077 */
const LINKS = [["Stones", "stones"], ["Finishes", "finishes"], ["Visualiser", "visualiser"], ["Calculator", "calculator"]];
export function Navbar() {
  const ref = useRef<HTMLElement>(null), menu = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false);
  useGSAP(() => {
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
      ref.current!.style.transform = s.direction === 1 && s.scroll() > 300 ? "translateY(-100%)" : "translateY(0)";
      setSolid(s.scroll() > 40);
    } });
  });
  useGSAP(() => {
    if (!open || !menu.current) return;
    gsap.fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
    gsap.from(".mlink", { y: 60, opacity: 0, stagger: 0.06, delay: 0.25, duration: 0.7, ease: "power3.out" });
  }, { dependencies: [open] });
  return (
    <>
      <nav ref={ref} style={{ paddingTop: "env(safe-area-inset-top,0px)" }} className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "border-b border-seam bg-statuario/85 backdrop-blur-md" : ""}`}>
        <div className="gutter flex h-[72px] items-center justify-between">
          <a href="#top" aria-label="Shila Stoneworks home"><Wordmark /></a>
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map(([l, h]) => <a key={h} href={`#${h}`} className="group relative text-sm">{l}<span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-rosso transition-transform duration-300 group-hover:scale-x-100" /></a>)}
            <Magnetic><a href="#visit" className="inline-block bg-verde px-5 py-3 text-sm font-medium text-statuario hover:bg-rosso">Visit the yard</a></Magnetic>
          </div>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="relative z-[70] h-10 w-10 md:hidden">
            <span className={`absolute left-2 right-2 h-px transition-transform ${open ? "top-5 rotate-45 bg-statuario" : "top-4 bg-ink"}`} />
            <span className={`absolute left-2 right-2 h-px transition-transform ${open ? "top-5 -rotate-45 bg-statuario" : "top-6 bg-ink"}`} />
          </button>
        </div>
      </nav>
      {open && (
        <div ref={menu} className="gutter fixed inset-0 z-[65] flex flex-col justify-center gap-1 bg-verde text-statuario">
          {[...LINKS, ["Visit the yard", "visit"]].map(([l, h]) => (
            <a key={h} href={`#${h}`} onClick={() => setOpen(false)} className="mlink disp border-b border-statuario/15 py-4 text-5xl italic">{l}</a>
          ))}
        </div>
      )}
    </>
  );
}

/* C063 */
export function Reveal({ children, stagger = 0.08, className = "" }: { children: React.ReactNode; stagger?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(ref.current!.children, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger, scrollTrigger: { trigger: ref.current, start: "top 86%" } });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}

/* C021 */
export function Lines({ text, as: Tag = "h2", className = "", delay = 0, onLoad = false }: { text: string; as?: any; className?: string; delay?: number; onLoad?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    document.fonts.ready.then(() => {
      if (!ref.current) return;
      SplitText.create(ref.current, { type: "lines", mask: "lines", autoSplit: true,
        onSplit: (s) => gsap.from(s.lines, { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1, delay,
          scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: "top 88%" } }) });
    });
  });
  return <Tag ref={ref} className={className}>{text}</Tag>;
}

/* C022 */
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    document.fonts.ready.then(() => {
      if (!ref.current) return;
      const s = SplitText.create(ref.current, { type: "words" });
      gsap.fromTo(s.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 50%", scrub: true } });
    });
  });
  return <p ref={ref} className={className}>{text}</p>;
}

/* C026 */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-seam py-6">
      <div className="inline-flex whitespace-nowrap" style={{ animation: "marquee 45s linear infinite" }}>
        {row.map((t, i) => <span key={i} className="disp flex shrink-0 items-center gap-10 pr-10 text-4xl italic md:text-6xl">{t}<span className="h-2 w-2 rotate-45 bg-rosso" /></span>)}
      </div>
    </div>
  );
}

export function Head({ no, kicker, title, note, light = false }: { no: string; kicker: string; title: string; note?: string; light?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <div className={`lbl mb-5 flex items-center gap-3 ${light ? "text-statuario/70" : "text-grey"}`}><span className="text-rosso">{no}</span><span className="h-px w-8 bg-current" />{kicker}</div>
        <Lines text={title} className="disp text-[clamp(40px,6vw,88px)]" />
      </div>
      {note && <p className={`max-w-[38ch] md:col-span-4 md:justify-self-end ${light ? "text-statuario/70" : "text-grey"}`}>{note}</p>}
    </div>
  );
}

/* C009 curtain transition for in-page navigation: a marble panel wipes over, the page jumps, the panel lifts */
export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute("href")!.slice(1); const el = id === "top" ? document.body : document.getElementById(id); if (!el) return;
      e.preventDefault();
      const go = () => { if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate: true, offset: id === "top" ? 0 : -72, force: true }); else el.scrollIntoView(); };
      if (reduced()) { go(); return; }
      gsap.timeline()
        .set(ref.current, { display: "block" })
        .fromTo(ref.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.55, ease: "power4.inOut" })
        .add(go)
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.65, ease: "power4.inOut", delay: 0.1 })
        .set(ref.current, { display: "none" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[85] hidden bg-cover bg-center" style={{ backgroundImage: "url(./img/udaipur.jpg)" }}>
      <div className="absolute inset-0 grid place-items-center bg-verde/40"><Logo className="h-16 w-16" light /></div>
    </div>
  );
}

/* C006 + C007 cursor: precise dot + lagging ring that labels what you're pointing at */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState(""), [on, setOn] = useState(false);
  useEffect(() => {
    if (!fine() || reduced()) return;
    setOn(true); document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);
  useEffect(() => {
    if (!on) return;
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.08 }), yd = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" }), yr = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    const mv = (e: PointerEvent) => {
      xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY);
      const t = e.target as HTMLElement, l = t.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      setLabel(l); gsap.to(ring.current, { width: l ? 96 : t.closest("a,button") ? 56 : 36, height: l ? 96 : t.closest("a,button") ? 56 : 36, duration: 0.35, ease: "power3" });
    };
    addEventListener("pointermove", mv); return () => removeEventListener("pointermove", mv);
  }, [on]);
  if (!on) return null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-rosso" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[99] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/50 bg-statuario/20 backdrop-blur-[2px]">
        <span className="lbl text-[10px] text-ink">{label}</span>
      </div>
    </>
  );
}

/* C079 magnetic */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !fine() || reduced()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" }), y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * strength); y((e.clientY - r.top - r.height / 2) * strength); };
    const lv = () => { x(0); y(0); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerleave", lv);
    return () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerleave", lv); };
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}
