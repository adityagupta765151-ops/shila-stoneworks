import { useEffect, useRef } from "react";
import { gsap, useGSAP, reduced } from "../lib/gsap";
import { Lines } from "./Core";

/* C093 live marble: fbm + domain warp in a fragment shader. Static slab image underneath as fallback. */
const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 6; i++){ v += a*n(p); p *= 2.03; a *= .5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / r.y; uv *= 1.6;
  vec2 q = vec2(fbm(uv + .03*t), fbm(uv + vec2(5.2, 1.3) - .02*t));
  vec2 w = vec2(fbm(uv + 2.*q + vec2(1.7, 9.2) + m*.4), fbm(uv + 2.*q + vec2(8.3, 2.8)));
  float s = (uv.x*.7 + uv.y*.45) * 2.2 + 3.2*fbm(uv + 2.6*w);
  float v = 1. - abs(sin(s * 3.14159));
  float vein = pow(v, 14.) + .28*pow(v, 3.);
  float fine = pow(1. - abs(sin((uv.x*1.3 - uv.y*.6)*5. + 4.*fbm(uv*1.7 + w) )), 40.) * .35;
  vec3 base = vec3(.953, .949, .937) - .05*fbm(uv*3. + w);
  vec3 col = mix(base, vec3(.42, .44, .43), clamp(vein, 0., 1.));
  col = mix(col, vec3(.62, .64, .62), fine);
  col = mix(col, vec3(.07, .19, .16), smoothstep(.985, 1., v) * .35);
  gl_FragColor = vec4(col, 1.);
}`;
function useMarble(canvas: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = canvas.current; if (!c || reduced()) return;
    const gl = c.getContext("webgl", { antialias: false, powerPreference: "low-power" }); if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}"));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
    gl.useProgram(p);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const ur = gl.getUniformLocation(p, "r"), ut = gl.getUniformLocation(p, "t"), um = gl.getUniformLocation(p, "m");
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const dpr = Math.min(devicePixelRatio, innerWidth < 769 ? 1 : 1.5);
    const size = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; gl.viewport(0, 0, c.width, c.height); };
    size(); addEventListener("resize", size);
    const mv = (e: PointerEvent) => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; };
    addEventListener("pointermove", mv);
    let raf = 0, vis = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) loop(); });
    io.observe(c);
    function loop() {
      if (!vis) return;
      mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
      gl!.uniform2f(ur, c!.width, c!.height); gl!.uniform1f(ut, (performance.now() - t0) / 1000); gl!.uniform2f(um, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3); c!.style.opacity = "1";
      raf = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", size); removeEventListener("pointermove", mv); };
  }, [canvas]);
}

export function Hero({ ready }: { ready: boolean }) {
  const sec = useRef<HTMLElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useMarble(cv);
  useGSAP(() => {
    if (!ready || reduced()) return;
    gsap.from(".hr-fade", { y: 24, opacity: 0, stagger: 0.1, duration: 0.9, delay: 0.5, ease: "power3.out" });
    gsap.from(".hr-card", { clipPath: "inset(100% 0 0 0)", duration: 1.2, delay: 0.7, ease: "power4.out" });
    gsap.to(".hr-copy", { yPercent: -18, opacity: 0.3, ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: sec, dependencies: [ready] });
  return (
    <section ref={sec} id="top" className="relative overflow-hidden" style={{ minHeight: "min(100svh, 980px)" }}>
      <img src="./img/statuario.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-statuario/80 via-statuario/30 to-transparent" />
      <div className="hr-copy gutter relative flex min-h-[inherit] flex-col justify-end pb-14 pt-32" style={{ minHeight: "min(100svh, 980px)" }}>
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="hr-fade lbl mb-6 text-grey">Marble · Granite · Designer tiles · Prayagraj</div>
            {ready && <Lines as="h1" onLoad text="Stone, cut for the way you live." className="disp max-w-[12ch] text-[clamp(52px,9vw,148px)]" />}
            {!ready && <h1 className="disp max-w-[12ch] text-[clamp(52px,9vw,148px)] opacity-0">Stone, cut for the way you live.</h1>}
            <p className="hr-fade mt-8 max-w-[44ch] text-lg text-ink/75">Indian and imported slabs, picked by hand in Rajasthan and Carrara, cut to size in our yard and laid by our own team.</p>
            <div className="hr-fade mt-8 flex flex-wrap gap-3">
              <a href="#stones" className="bg-ink px-7 py-4 font-medium text-statuario hover:bg-rosso">Browse the stone library</a>
              <a href="#visualiser" className="border border-ink px-7 py-4 font-medium hover:bg-ink hover:text-statuario">Try it on your floor</a>
            </div>
          </div>
          <aside className="hr-card bg-verde p-6 text-statuario md:col-span-4 md:justify-self-end md:max-w-xs">
            <div className="lbl text-statuario/60">Slab of the week</div>
            <div className="disp mt-3 text-4xl italic">Statuario</div>
            <dl className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-statuario/60">Origin</dt><dd>Carrara, Italy</dd>
              <dt className="text-statuario/60">Thickness</dt><dd className="font-mono">18 mm</dd>
              <dt className="text-statuario/60">Slab size</dt><dd className="font-mono">290 × 180 cm</dd>
              <dt className="text-statuario/60">Price</dt><dd className="font-mono">₹650 / sq ft</dd>
            </dl>
            <div className="lbl mt-5 text-statuario/50">Live marble · move your cursor</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
