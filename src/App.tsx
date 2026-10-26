import React from "react";
import { MotionConfig } from "framer-motion";
import { Asterisk } from "lucide-react";
import { ShopProvider } from "./store/ShopContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Personas } from "./components/Personas";
import { Catalog } from "./components/Catalog";
import { SoundLab } from "./components/SoundLab";
import { Experience } from "./components/Experience";
import { DecisionTools } from "./components/DecisionTools";
import { DemoDetails } from "./components/DemoDetails";
import { Footer } from "./components/Footer";
import { ProductModal } from "./components/ProductModal";
import { Quiz } from "./components/Quiz";
import { CartDrawer, CompareBar, CompareModal, NowPlayingBar, SearchOverlay, Toasts } from "./components/Overlays";

const MARQUEE_ITEMS = [
  "9 sample models",
  "Synthesized audio demos",
  "Interactive comparison",
  "Room-fit preview",
  "Guided product finder",
  "Demo cart only",
];

const Marquee: React.FC = () => (
  <div className="relative overflow-hidden border-y border-line bg-coal py-3.5" aria-hidden>
    <div className="animate-marquee flex w-max">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-3 px-5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-sand sm:text-xs">
          <Asterisk size={15} className="shrink-0 text-brass" />
          {item}
        </span>
      ))}
    </div>
  </div>
);

const App: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <ShopProvider>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Personas />
        <Catalog />
        <SoundLab />
        <Experience />
        <DecisionTools />
        <DemoDetails />
      </main>
      <Footer />
      <ProductModal />
      <Quiz />
      <CartDrawer />
      <SearchOverlay />
      <CompareBar />
      <CompareModal />
      <NowPlayingBar />
      <Toasts />
    </ShopProvider>
  </MotionConfig>
);

export default App;
