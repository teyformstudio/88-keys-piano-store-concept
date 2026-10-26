import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, GitCompareArrows, Ruler, Sparkles } from "lucide-react";
import { FAQS } from "../data/products";

const DEMO_FEATURES = [
  { icon: GitCompareArrows, title: "Browse and compare", text: "Filter a sample catalog and open product details without leaving the page." },
  { icon: AudioLines, title: "Try generated audio", text: "Play simple browser-synthesized tones and use the on-screen keyboard." },
  { icon: Ruler, title: "Explore decision tools", text: "Preview a sample monthly split and a room-fit diagram. Neither is a real offer or measurement." },
];

const DemoFeatures: React.FC = () => (
  <section id="demo-info" className="relative scroll-mt-24 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">08 · Portfolio concept</p>
      <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
        A storefront designed to help people <span className="text-brass">choose by exploring.</span>
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand sm:text-base">
        This independent concept demonstrates product discovery, interactive comparison, browser-generated audio and a simulated cart flow.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {DEMO_FEATURES.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border border-line bg-panel/60 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass/12 text-brass"><Icon size={20} /></span>
            <h3 className="mt-5 font-display text-lg font-bold text-cream">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-sand">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const DemoFAQ: React.FC = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative scroll-mt-24 bg-coal py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">09 · Demo details</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">What this demo does—and doesn’t do.</h2>
          <p className="mt-5 text-sm leading-relaxed text-sand">
            The catalog, prices, specifications and promotional details are sample content. No order, email or contact information is sent anywhere.
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;
            const answerId = `demo-faq-answer-${index}`;
            return (
              <div key={faq.q} className={`overflow-hidden rounded-3xl border transition-colors ${isOpen ? "border-brass/40 bg-panel" : "border-line bg-panel/50"}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="font-display text-[15px] font-bold leading-snug text-cream sm:text-base">{faq.q}</span>
                  <span aria-hidden className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "rotate-45 bg-brass text-ink" : "bg-white/[0.06] text-cream"}`}>
                    <Sparkles size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-cream/80 sm:text-[15px]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const DemoDetails: React.FC = () => (
  <>
    <DemoFeatures />
    <DemoFAQ />
  </>
);
