import { useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { Cursor, Curtain, Marquee, Navbar, Preloader, ScrollProgress, SmoothScroll } from "./components/Core";
import { Hero } from "./components/Hero";
import { Library } from "./components/Library";
import { Slab3D } from "./components/Slab3D";
import { Calculator, Faq, Finishes, Intro, Process, Visit, Visualiser } from "./components/Sections";
import { Footer } from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  const [floor, setFloor] = useState("statuario");
  useEffect(() => {
    const fix = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    document.fonts.ready.then(fix); addEventListener("load", fix);
    return () => removeEventListener("load", fix);
  }, []);
  useEffect(() => { if (ready) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } }, [ready]);
  return (
    <SmoothScroll>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Curtain />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Intro />
        <Marquee items={["Makrana White", "Statuario", "Udaipur Green", "Nero Marquina", "Rosso Levanto", "Honey Onyx"]} />
        <Library onTry={setFloor} />
        <Slab3D />
        <Finishes />
        <Visualiser id={floor} setId={setFloor} />
        <Calculator />
        <Process />
        <Visit />
        <Faq />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
