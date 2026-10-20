import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "../lib/gsap";
import { Head, Reveal, ScrubText } from "./Core";
import { IMG, inr, STONES } from "../data";

/* Intro */
export function Intro() {
  const facts = [["8", "stones in the yard this week"], ["18 mm", "standard slab thickness"], ["±1 mm", "cutting tolerance"], ["7 days", "from order to laid floor"]];
  return (
    <section className="gutter py-24 md:py-36">
      <div className="lbl mb-8 text-grey"><span className="text-rosso">01</span> — The yard</div>
      <ScrubText className="disp max-w-[22ch] text-[clamp(34px,4.8vw,76px)] !leading-[1.06]"
        text="Every slab is different. So we stand them in the light, let you walk along them, and cut your floor from the one you choose." />
      <Reveal className="mt-20 grid grid-cols-2 gap-y-10 border-t border-seam pt-10 md:grid-cols-4">
        {facts.map(([v, l], i) => (
          <div key={l} className={`pr-4 ${i ? "md:border-l md:border-seam md:pl-8" : ""}`}>
            <div className="disp text-5xl md:text-6xl">{v}</div><div className="mt-3 text-sm text-grey">{l}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* C041 polished vs honed */
export function Finishes() {
  const [id, setId] = useState("nero");
  const [pos, setPos] = useState(50);
  const s = STONES.find((x) => x.id === id)!;
  const box = useRef<HTMLDivElement>(null);
  const drag = (e: React.PointerEvent) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const r = box.current!.getBoundingClientRect(); setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <section id="finishes" className="gutter py-24 md:py-36">
      <Head no="04" kicker="Finishes" title="Polished or honed?" note="Same slab, two finishes. Polished reflects light and shows the veins. Honed is matt, less slippery and better for bathrooms." />
      <div className="mt-12 flex flex-wrap gap-2">
        {STONES.filter((x) => x.kind !== "Tile").map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} aria-pressed={id === x.id}
            className={`flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${id === x.id ? "border-ink bg-ink text-statuario" : "border-seam hover:border-ink"}`}>
            <span className="h-4 w-4 rounded-full border border-seam" style={{ backgroundImage: `url(${IMG(x.id)})`, backgroundSize: "cover" }} />{x.name}
          </button>
        ))}
      </div>
      <div ref={box} onPointerDown={drag} onPointerMove={drag} className="relative mt-6 aspect-[16/9] max-w-full touch-none select-none overflow-hidden bg-slab md:aspect-[21/9]">
        <img src={IMG(id, true)} alt={`${s.name}, honed finish`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={IMG(id)} alt={`${s.name}, polished finish`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,.35)_45%,transparent_55%)]" />
        </div>
        <span className="lbl absolute left-4 top-4 bg-statuario px-2 py-1">Polished</span>
        <span className="lbl absolute right-4 top-4 bg-statuario px-2 py-1">Honed</span>
        <div className="absolute inset-y-0 w-px bg-statuario" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-statuario text-ink shadow-lg">⇆</span>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-4 text-sm text-grey"><span className="lbl">Compare</span>
        <input id="fin-range" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} className="w-full max-w-xs" /></label>
    </section>
  );
}

/* Visualiser: CSS 3D room */
const SIZES = [{ l: "60 × 60 cm", w: 60, h: 60 }, { l: "60 × 120 cm", w: 60, h: 120 }, { l: "80 × 160 cm", w: 80, h: 160 }, { l: "Slab · 180 × 290 cm", w: 180, h: 290 }];
export function Visualiser({ id, setId }: { id: string; setId: (id: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    /* C062: the section grows from an inset card to full bleed as it scrolls in */
    gsap.fromTo(wrap.current, { clipPath: "inset(6% 5% 6% 5% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
      scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "top 15%", scrub: true } });
  });
  const [size, setSize] = useState(1), [grout, setGrout] = useState<"light" | "dark">("light");
  const sz = SIZES[size], s = STONES.find((x) => x.id === id)!;
  const px = 2.2; // px per cm on the floor plane
  const tw = sz.w * px, th = sz.h * px;
  const gc = grout === "light" ? "rgba(255,255,255,.75)" : "rgba(20,23,22,.55)";
  return (
    <section id="visualiser">
      <div ref={wrap} className="gutter bg-verde py-24 text-statuario md:py-36">
        <Head light no="05" kicker="Floor visualiser" title="Try it on your floor." note="Pick a stone, a tile size and a grout colour. The floor below updates as you choose." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="relative aspect-[4/3] max-w-full overflow-hidden bg-[#e9e6df] md:aspect-[16/10]" style={{ perspective: "900px" }}>
            {/* back wall + window */}
            <div className="absolute inset-x-0 top-0 h-[52%] bg-[linear-gradient(#efece6,#e2ded6)]">
              <div className="absolute left-[12%] top-[14%] h-[70%] w-[26%] border-[6px] border-[#d8d3c9] bg-[linear-gradient(160deg,#cfe0e6,#f6f2e8)]" />
              <svg viewBox="0 0 300 120" className="absolute bottom-0 right-[8%] w-[46%]" aria-hidden>
                <rect x="10" y="40" width="280" height="60" rx="10" fill="#6d7d76" /><rect x="0" y="30" width="40" height="70" rx="10" fill="#5f6f68" />
                <rect x="260" y="30" width="40" height="70" rx="10" fill="#5f6f68" /><rect x="30" y="20" width="110" height="40" rx="8" fill="#76867f" />
                <rect x="160" y="20" width="110" height="40" rx="8" fill="#76867f" /><rect x="30" y="100" width="8" height="20" fill="#3b2a1f" /><rect x="262" y="100" width="8" height="20" fill="#3b2a1f" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-2 bg-[#cfc9be]" />
            </div>
            {/* floor */}
            <div className="absolute left-1/2 top-[52%] h-[260%] w-[300%] -translate-x-1/2 transition-[background] duration-500"
              style={{ transformOrigin: "50% 0", transform: "rotateX(76deg)",
                backgroundImage: `linear-gradient(90deg, ${gc} 2px, transparent 2px), linear-gradient(${gc} 2px, transparent 2px), url(${IMG(id)})`,
                backgroundSize: `${tw}px ${th}px, ${tw}px ${th}px, ${Math.max(tw, 300)}px ${Math.max(th, 300)}px`,
                backgroundPosition: "center top" }} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[52%] bg-[linear-gradient(rgba(0,0,0,.18),transparent_40%,rgba(255,255,255,.08))]" />
            <div className="absolute bottom-3 left-3 bg-statuario/90 px-3 py-2 text-ink"><div className="lbl text-grey">On the floor</div><div className="disp text-xl italic">{s.name} · {sz.l}</div></div>
          </div>
          <div className="space-y-8">
            <fieldset><legend className="lbl mb-3 text-statuario/60">Stone</legend>
              <div className="grid grid-cols-4 gap-2">
                {STONES.map((x) => (
                  <button key={x.id} onClick={() => setId(x.id)} aria-pressed={id === x.id} title={x.name}
                    className={`aspect-square border-2 transition-transform hover:scale-105 ${id === x.id ? "border-rosso" : "border-transparent"}`}
                    style={{ backgroundImage: `url(${IMG(x.id)})`, backgroundSize: "cover" }}><span className="sr-only">{x.name}</span></button>
                ))}
              </div>
            </fieldset>
            <fieldset><legend className="lbl mb-3 text-statuario/60">Tile size</legend>
              <div className="grid grid-cols-2 gap-2">{SIZES.map((x, i) => (
                <button key={x.l} onClick={() => setSize(i)} aria-pressed={size === i} className={`border px-3 py-2.5 text-left text-sm ${size === i ? "border-statuario bg-statuario text-ink" : "border-statuario/30 hover:border-statuario"}`}>{x.l}</button>))}</div>
            </fieldset>
            <fieldset><legend className="lbl mb-3 text-statuario/60">Grout</legend>
              <div className="flex gap-2">{(["light", "dark"] as const).map((g) => (
                <button key={g} onClick={() => setGrout(g)} aria-pressed={grout === g} className={`flex-1 border px-3 py-2.5 text-sm capitalize ${grout === g ? "border-statuario bg-statuario text-ink" : "border-statuario/30 hover:border-statuario"}`}>{g}</button>))}</div>
            </fieldset>
            <div className="border-t border-statuario/20 pt-5"><div className="lbl text-statuario/60">{s.origin}</div><p className="mt-2 text-statuario/80">{s.note}</p>
              <div className="mt-3 font-mono text-lg">{inr(s.price)} / sq ft</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Calculator */
export function Calculator() {
  const [L, setL] = useState(14), [W, setW] = useState(12), [id, setId] = useState("makrana"), [waste, setWaste] = useState(10), [lay, setLay] = useState(true);
  const s = STONES.find((x) => x.id === id)!;
  const r = useMemo(() => {
    const area = L * W, buy = Math.ceil(area * (1 + waste / 100));
    const layRate = s.kind === "Tile" ? 35 : 65, polish = s.kind === "Tile" ? 0 : 25;
    const material = buy * s.price, labour = lay ? area * (layRate + polish) : 0;
    return { area, buy, material, labour, total: material + labour, layRate, polish };
  }, [L, W, waste, lay, s]);
  const num = "mt-2 w-full border border-seam bg-statuario px-3 py-3 font-mono text-lg outline-none focus:border-ink";
  return (
    <section id="calculator" className="gutter py-24 md:py-36">
      <Head no="06" kicker="Estimate" title="What will my floor cost?" note="Enter your room size in feet. We add wastage for cutting and give a rough estimate. Final price after a site visit." />
      <div className="mt-12 grid gap-px bg-seam md:grid-cols-2">
        <div className="grid gap-5 bg-statuario p-6 sm:grid-cols-2 md:p-10">
          <label className="lbl text-grey">Length (ft)<input id="c-len" type="number" min={1} max={200} value={L} onChange={(e) => setL(Math.max(0, +e.target.value))} className={num} /></label>
          <label className="lbl text-grey">Width (ft)<input id="c-wid" type="number" min={1} max={200} value={W} onChange={(e) => setW(Math.max(0, +e.target.value))} className={num} /></label>
          <label className="lbl text-grey sm:col-span-2">Stone<select id="c-stone" value={id} onChange={(e) => setId(e.target.value)} className={num + " font-sans text-base"}>
            {STONES.map((x) => <option key={x.id} value={x.id}>{x.name} — {inr(x.price)}/sq ft</option>)}</select></label>
          <label className="lbl text-grey sm:col-span-2">Wastage for cuts · {waste}%<input id="c-waste" type="range" min={5} max={20} value={waste} onChange={(e) => setWaste(+e.target.value)} className="mt-3 w-full" /></label>
          <label className="flex items-center gap-3 text-sm sm:col-span-2"><input id="c-lay" type="checkbox" checked={lay} onChange={(e) => setLay(e.target.checked)} className="h-5 w-5 accent-[#9b3b2e]" />Include laying{s.kind !== "Tile" && " and polishing"} by our team</label>
        </div>
        <div className="flex flex-col justify-between gap-8 bg-ink p-6 text-statuario md:p-10">
          <dl className="space-y-3 font-mono text-sm tabular-nums">
            <div className="flex justify-between"><dt className="text-statuario/60">Floor area</dt><dd>{r.area.toLocaleString("en-IN")} sq ft</dd></div>
            <div className="flex justify-between"><dt className="text-statuario/60">To buy (+{waste}%)</dt><dd>{r.buy.toLocaleString("en-IN")} sq ft</dd></div>
            <div className="flex justify-between"><dt className="text-statuario/60">{s.name} @ {inr(s.price)}</dt><dd>{inr(r.material)}</dd></div>
            {lay && <div className="flex justify-between"><dt className="text-statuario/60">Laying {r.polish ? "+ polish " : ""}@ {inr(r.layRate + r.polish)}</dt><dd>{inr(r.labour)}</dd></div>}
          </dl>
          <div className="border-t border-statuario/20 pt-6">
            <div className="lbl text-statuario/60">Estimated total</div>
            <div className="disp mt-2 text-[clamp(48px,6vw,84px)] tabular-nums">{inr(r.total)}</div>
            <div className="lbl mt-2 text-statuario/50">Sample rates for this demo · GST extra</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* C054 process */
const STEPS = [["Pick your slab", "Walk the yard and choose the exact slab. We tag it with your name."], ["Cut and edge", "Slabs are cut to your floor plan on a bridge saw, edges profiled for steps and counters."],
  ["Deliver", "Our own truck, A-frame racks and a crew who carry 18 mm stone without chipping it."], ["Lay and polish", "Laid on a mortar bed, levelled, then machine-polished on site to a mirror finish."]];
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo(".pr-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } });
  }, { scope: ref });
  return (
    <section className="gutter grid gap-12 py-24 md:grid-cols-[1fr_1.3fr] md:py-36">
      <div className="md:sticky md:top-32 md:self-start"><Head no="07" kicker="Process" title="Yard to floor in seven days." /></div>
      <div ref={ref} className="relative pl-10">
        <span className="absolute left-3 top-0 h-full w-px bg-seam" /><span className="pr-fill absolute left-3 top-0 h-full w-px origin-top bg-rosso" />
        {STEPS.map(([t, d], i) => (
          <div key={t} className="relative pb-14 last:pb-0">
            <span className="absolute -left-10 top-1 grid h-7 w-7 rotate-45 place-items-center bg-statuario ring-1 ring-rosso"><span className="-rotate-45 font-mono text-xs text-rosso">{i + 1}</span></span>
            <h3 className="disp text-4xl italic">{t}</h3><p className="mt-3 max-w-[44ch] text-grey">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Visit + form */
export function Visit() {
  const [sent, setSent] = useState<string | null>(null);
  const f = "mt-2 w-full border border-seam bg-statuario px-4 py-3.5 text-base outline-none focus:border-ink font-sans normal-case tracking-normal text-ink";
  return (
    <section id="visit" className="gutter pb-24 md:pb-36">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[360px] bg-cover bg-center p-8" style={{ backgroundImage: `url(${IMG("udaipur")})` }}>
          <div className="relative flex h-full flex-col justify-end text-statuario">
            <div className="lbl text-statuario/70">The yard</div>
            <p className="disp mt-3 text-4xl italic">Naini Industrial Area<br />Prayagraj 211008</p>
            <p className="mt-3 text-statuario/80">Mon–Sat 9 AM – 7 PM · Sunday by appointment</p>
          </div>
        </div>
        <div className="bg-slab p-7 md:p-12">
          <div className="lbl text-grey"><span className="text-rosso">08</span> — Visit</div>
          <h2 className="disp mt-4 text-[clamp(36px,4vw,60px)]">See the slab before it's cut.</h2>
          {sent ? <p className="mt-8 bg-statuario p-6 text-lg">{sent}</p> : (
            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget);
              setSent(`Thanks ${d.get("name")}. We'll call to fix your yard visit and keep ${d.get("stone")} slabs ready to see.`); }}>
              <label className="lbl text-grey">Name<input id="v-name" name="name" required placeholder="Rohit Srivastava" className={f} /></label>
              <label className="lbl text-grey">Mobile<input id="v-phone" name="phone" required inputMode="tel" pattern="[0-9 +]{10,14}" placeholder="98xxxxxx45" className={f} /></label>
              <label className="lbl text-grey">Interested in<select id="v-stone" name="stone" className={f}>{STONES.map((x) => <option key={x.id}>{x.name}</option>)}</select></label>
              <label className="lbl text-grey">Project<select id="v-proj" name="proj" className={f}><option>New home</option><option>Renovation</option><option>Kitchen counter</option><option>Commercial</option></select></label>
              <button className="bg-ink px-6 py-4 font-medium text-statuario hover:bg-rosso sm:col-span-2">Request a yard visit</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* C091 */
const FAQ = [["Marble or vitrified tile, which is better?", "Marble is natural and can be re-polished for decades. Vitrified tiles are cheaper, uniform and need no polishing. We stock both and will show you each side by side."],
  ["Will marble stain in the kitchen?", "Light marble can stain from haldi and lemon. We seal every kitchen counter, and suggest granite or Nero Marquina for heavy cooking areas."],
  ["How much extra should I order?", "Add 8–10% for straight layouts and 15% for diagonal or herringbone. The calculator above does this for you."],
  ["Do you lay outside Prayagraj?", "Yes, across eastern Uttar Pradesh. Travel is charged at cost for sites beyond 50 km."],
  ["How long before I can walk on it?", "Light foot traffic after 24 hours. Polishing happens on day 3 or 4, then the floor is ready for furniture."]];
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="gutter grid gap-12 py-24 md:grid-cols-[1fr_1.4fr] md:py-36">
      <Head no="09" kicker="Questions" title="Before you choose." />
      <div className="border-t border-seam">{FAQ.map(([q, a], i) => (
        <div key={q} className="border-b border-seam">
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
            <span className="disp text-2xl">{q}</span><span className={`h-3 w-3 shrink-0 rotate-45 border border-rosso transition-colors ${open === i ? "bg-rosso" : ""}`} /></button>
          <div className={`grid transition-[grid-template-rows] duration-500 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-grey"><span className="block max-w-[54ch] pb-6">{a}</span></p></div>
        </div>))}
      </div>
    </section>
  );
}
