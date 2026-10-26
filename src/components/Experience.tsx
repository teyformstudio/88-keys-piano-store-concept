import React, { useState } from "react";
import { motion } from "framer-motion";
import { AudioWaveform, Headphones, MoonStar, Piano, Ruler, Sparkles, Volume2 } from "lucide-react";
import { useShop } from "../store/ShopContext";

const ListeningScenario: React.FC = () => {
  const [value, setValue] = useState(35);
  const late = value > 68;
  const timeMinutes = 19 * 60 + Math.round((480 * value) / 100);
  const time = `${String(Math.floor(timeMinutes / 60) % 24).padStart(2, "0")}:${String(timeMinutes % 60).padStart(2, "0")}`;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">04 · Listening scenario</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
            Practice at <span className="text-brass">your own pace.</span>
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-sand">
            Move through an illustrative evening-to-night scene. The slider changes the visual only; it is not a sound-level measurement.
          </p>
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-5xl font-bold tabular-nums text-cream">{time}</span>
              <span className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold ${late ? "bg-brass text-ink" : "bg-white/[0.06] text-cream"}`}>
                {late ? <Headphones size={15} /> : <Volume2 size={15} />}
                {late ? "Headphone scene" : "Speaker scene"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="slider mt-5 w-full"
              style={{ ["--fill" as string]: `${value}%` }}
              aria-label="Move through the sample evening scene"
            />
            <div className="mt-2 flex justify-between text-xs font-bold text-faint"><span>7:00 pm</span><span>3:00 am</span></div>
            <p className="mt-5 min-h-[28px] text-sm font-semibold text-brass2">
              {late ? "A visual preview of quiet, headphone-based practice." : "A visual preview of a daytime listening setup."}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-line">
          <img
            src="/img/lx708.jpg"
            alt="Sample digital piano product image"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-[filter] duration-300"
            style={{ filter: `brightness(${1.05 - (value / 100) * 0.4}) saturate(${1.05 - (value / 100) * 0.2})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <motion.div
            animate={{ opacity: late ? 1 : 0, y: late ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-sm font-extrabold text-brass2 backdrop-blur"
          >
            <MoonStar size={16} /> Sample headphone scene
          </motion.div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cream/70">Illustrative visual · not a product measurement</span>
            <span className="h-2.5 w-36 rounded-full bg-gradient-to-r from-brass to-white/20" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
};

const CONCEPT_FEATURES = [
  { icon: AudioWaveform, title: "Generated sound", text: "A lightweight Web Audio synth makes the keyboard interactive without external audio files." },
  { icon: Piano, title: "Keyboard interaction", text: "Play notes by touch, mouse or computer keyboard and hear immediate feedback." },
  { icon: Ruler, title: "Decision tools", text: "Compare sample product details and preview a room-fit diagram." },
  { icon: Sparkles, title: "Guided discovery", text: "A short finder filters the sample catalog by use case and budget." },
];

const ConceptFeatures: React.FC = () => (
  <section className="relative bg-coal py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">05 · Interface details</p>
      <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
        More than a <span className="text-brass">product grid.</span>
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand sm:text-base">
        The concept combines product discovery with small tools that help visitors explore before choosing.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CONCEPT_FEATURES.map(({ icon: Icon, title, text }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            className="group rounded-3xl border border-line bg-panel/60 p-6 transition-colors hover:border-brass/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/12 text-brass transition group-hover:bg-brass group-hover:text-ink"><Icon size={22} /></span>
            <h3 className="mt-5 font-display text-base font-bold leading-snug text-cream">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-sand">{text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

const PrototypeFlow: React.FC = () => {
  const { setQuizOpen } = useShop();
  const steps = [
    { when: "01", title: "Choose a use case", text: "Browse the sample audience scenarios." },
    { when: "02", title: "Explore models", text: "Filter the catalog and open product details." },
    { when: "03", title: "Compare and listen", text: "Try the synthesized keyboard and comparison view." },
    { when: "04", title: "Preview the cart", text: "Test the interface without placing a real order." },
  ];

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">06 · Prototype flow</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
              From first question to <span className="text-brass">shortlist.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-sand">A compact path through the main storefront interactions.</p>
        </div>
        <div className="relative mt-12">
          <div aria-hidden className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-brass/60 via-line to-transparent md:left-0 md:top-[7px] md:h-px md:w-full md:bg-gradient-to-r" />
          <div className="grid gap-8 md:grid-cols-4 md:gap-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.when}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative pl-8 md:pl-0 md:pt-8"
              >
                <span className="absolute left-0 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border-[3px] border-brass bg-ink md:top-0" />
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brass">{step.when}</p>
                <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-cream">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-brass2"
        >
          Try the product finder <Sparkles size={15} />
        </button>
      </div>
    </section>
  );
};

export const Experience: React.FC = () => (
  <>
    <ListeningScenario />
    <ConceptFeatures />
    <PrototypeFlow />
  </>
);
