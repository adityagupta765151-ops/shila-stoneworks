import { useRef } from "react";
import { gsap, useGSAP, reduced } from "../lib/gsap";
import { Logo } from "./Core";

/* C099 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo(".ft-word", { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true } });
  }, { scope: ref });
  return (
    <footer ref={ref} className="overflow-hidden bg-ink text-statuario" style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      <a href="#visit" className="block overflow-hidden border-b border-statuario/15 py-10">
        <span className="ft-word disp block whitespace-nowrap text-center text-[clamp(64px,14vw,220px)] italic">Visit the yard <span className="not-italic text-rosso">→</span></span>
      </a>
      <div className="gutter grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-start gap-3"><Logo className="h-11 w-11" light /><div><div className="disp text-2xl italic">Shila</div><div className="lbl text-statuario/60">Stoneworks</div></div></div>
        <div><div className="lbl mb-3 text-rosso">Yard</div><p className="text-statuario/70">Naini Industrial Area<br />Prayagraj 211008</p></div>
        <div><div className="lbl mb-3 text-rosso">Hours</div><p className="text-statuario/70">Mon–Sat 9 AM – 7 PM</p></div>
        <div><div className="lbl mb-3 text-rosso">Stock</div><p className="text-statuario/70">Marble · Granite · Onyx<br />Vitrified & terrazzo tiles</p></div>
      </div>
      <div className="gutter lbl flex flex-wrap justify-between gap-3 pb-8 text-statuario/40"><span>Demo site · brand, stock and prices are samples</span><span>Designed & built by pixelvantastudio</span></div>
    </footer>
  );
}
