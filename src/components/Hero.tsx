import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, MousePointerClick, Sparkles } from "lucide-react";
import { PianoKeyboard } from "./PianoKeyboard";
import { DEFAULT_VOICE } from "../lib/audio";
import { useShop } from "../store/ShopContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export const Hero: React.FC = () => {
  const { setQuizOpen, scrollToCatalog } = useShop();

  return (
    <section id="top" className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
      <motion.img
        src="/img/hero.jpg"
        alt="Digital piano in a warm home interior"
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div aria-hidden className="text-outline pointer-events-none absolute -right-6 top-24 hidden select-none font-display text-[300px] font-extrabold leading-none lg:block">
        88
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-40 sm:px-6 lg:pt-44">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-black/45 px-3 py-1.5 text-xs font-bold text-sand backdrop-blur">
            <span className="live-dot h-2 w-2 rounded-full bg-brass" />
            Independent storefront concept
          </span>
        </motion.div>

        <h1 className="mt-7 font-display font-extrabold leading-[1.02] tracking-tight">
          <motion.span variants={fadeUp} initial="hidden" animate="show" custom={1} className="block text-[13.5vw] text-cream sm:text-7xl lg:text-[86px]">
            Choose.
          </motion.span>
          <motion.span variants={fadeUp} initial="hidden" animate="show" custom={2} className="text-outline-brass block text-[13.5vw] sm:text-7xl lg:text-[86px]">
            Listen.
          </motion.span>
          <motion.span variants={fadeUp} initial="hidden" animate="show" custom={3} className="block text-[13.5vw] text-brass sm:text-7xl lg:text-[86px]">
            Compare.
          </motion.span>
        </h1>

        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
          A digital piano storefront concept for the Ukrainian market. Explore a sample catalog, compare models, and try the interactive tools. Product data and prices are illustrative.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="group flex items-center gap-2.5 rounded-full bg-brass px-7 py-4 font-display text-sm font-bold text-ink shadow-[0_18px_40px_rgba(217,166,72,0.25)] transition hover:bg-brass2"
          >
            Explore the sample catalog
            <ArrowDown size={17} strokeWidth={2.6} className="transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="flex items-center gap-2.5 rounded-full border border-cream/25 bg-black/35 px-7 py-4 font-display text-sm font-bold text-cream backdrop-blur transition hover:border-brass hover:text-brass2"
          >
            <Sparkles size={16} /> Try the product finder
          </button>
          <span className="text-sm font-semibold text-sand">9 sample models · prices in UAH</span>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm font-semibold text-cream/80">
          <span>Interactive comparison</span>
          <span>Synthesized sound demos</span>
          <span>Demo cart · no orders submitted</span>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7} className="mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-line bg-black/50 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brass2 sm:text-sm">
                <MousePointerClick size={16} /> Play a synthesized demo
              </span>
              <span className="hidden text-xs font-semibold text-faint sm:inline">Mouse · touch · A–K keys</span>
            </div>
            <div className="mx-3 mb-3 sm:mx-4 sm:mb-4">
              <div className="h-2 rounded-t-md bg-gradient-to-r from-[#3a2410] via-[#6b4a22] to-[#3a2410]" />
              <PianoKeyboard from={60} to={84} voice={DEFAULT_VOICE} enableKeyboard showHints className="h-32 sm:h-40" />
            </div>
          </div>
          <p className="mt-3 pl-1 text-xs leading-relaxed text-faint">
            Browser-generated tones are for interaction only; they are not official Roland recordings.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
