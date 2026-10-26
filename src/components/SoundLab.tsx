import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Ear, Pause, Play, ShoppingBag } from "lucide-react";
import { PRODUCTS, fmt, monthly, productById } from "../data/products";
import { piano } from "../lib/audio";
import { PianoKeyboard } from "./PianoKeyboard";
import { useShop } from "../store/ShopContext";

const Visualizer: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const data = new Uint8Array(128);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const analyser = piano.getAnalyser();
      const bars = 56;
      const gap = 3;
      const bw = (width - gap * (bars - 1)) / bars;
      let active = false;
      if (analyser) {
        analyser.getByteFrequencyData(data);
        active = data.some((v) => v > 6);
      }
      for (let i = 0; i < bars; i++) {
        let v: number;
        if (analyser && active) {
          const idx = 2 + Math.floor(Math.pow(i / bars, 1.35) * 82);
          v = data[idx] / 255;
        } else {
          v = 0.05 + 0.035 * (1 + Math.sin(Date.now() / 900 + i * 0.55));
        }
        const h = Math.max(3, v * height);
        const x = i * (bw + gap);
        const grad = ctx.createLinearGradient(0, height - h, 0, height);
        grad.addColorStop(0, "#f0cd7e");
        grad.addColorStop(1, "#8a6524");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, height - h, bw, h, 3);
        ctx.fill();
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} width={980} height={150} className="h-20 w-full sm:h-24" aria-hidden />;
};

export const SoundLab: React.FC = () => {
  const { playDemo, nowPlayingId, openProduct, addToCart } = useShop();
  const [selectedId, setSelectedId] = useState("fp-30x");
  const selected = productById(selectedId);
  const playing = nowPlayingId === selectedId;

  return (
    <section id="soundlab" className="grain relative scroll-mt-24 overflow-hidden bg-coal py-20 sm:py-28">
      <div aria-hidden className="text-outline pointer-events-none absolute -right-4 bottom-4 hidden select-none font-display text-[120px] font-extrabold leading-none xl:block">
        SOUND
      </div>
      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">03 · Synthesized sound lab</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
              One phrase, <span className="text-brass">nine sample profiles</span>
            </h2>
          </div>
          <p className="flex max-w-sm items-start gap-2.5 text-sm leading-relaxed text-sand">
            <Ear size={18} className="mt-0.5 shrink-0 text-brass" />
            Switch profiles to hear how the browser-generated tone changes. These are illustrative synth settings, not recordings of Roland instruments.
          </p>
        </div>

        {/* Voice selector */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose a sample sound profile">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={selectedId === p.id}
              onClick={() => setSelectedId(p.id)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                selectedId === p.id
                  ? "border-brass bg-brass/12 text-cream"
                  : "border-line bg-white/[0.03] text-sand hover:border-brass/40 hover:text-cream"
              }`}
            >
              <span className="block font-display text-sm font-bold">{p.name}</span>
              <span className="mt-0.5 block text-[11px] font-bold text-faint">{fmt(p.price)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_330px]">
          {/* Keyboard side */}
          <motion.div
            key={selectedId}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-3xl border border-line bg-black/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-faint">Selected sample profile</p>
                <p className="mt-1 font-display text-lg font-bold text-cream">
                  Roland {selected.name} <span className="ml-1 text-sm font-semibold text-brass2">· {selected.voiceName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => playDemo(selectedId, false)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition ${
                  playing ? "bg-cream text-ink" : "bg-brass text-ink hover:bg-brass2"
                }`}
              >
                {playing ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current" />}
                {playing ? "Stop demo" : "Play synthesized demo"}
              </button>
            </div>

            <div className="px-5 pt-2">
              <Visualizer />
            </div>

            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="h-2.5 rounded-t-md bg-gradient-to-r from-[#3a2410] via-[#6b4a22] to-[#3a2410]" />
              <PianoKeyboard from={48} to={83} voice={selected.voice} enableKeyboard showHints className="h-40 sm:h-52" />
              <p className="mt-3 text-center text-xs font-semibold text-faint">
                Play with a mouse, touch, or keyboard (A–K). Press lower on a key for a louder note.
              </p>
            </div>
          </motion.div>

          {/* Selected model card */}
          <motion.div
            key={`card-${selectedId}`}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden rounded-3xl border border-line bg-panel/70"
          >
            <div className="relative">
              <img src={selected.image} alt={`Roland ${selected.name}`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-cream">Roland {selected.name}</h3>
                <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">Sample product</span>
              </div>
              <p className="mt-1.5 text-sm leading-snug text-sand">{selected.tagline}</p>

              <div className="mt-4 space-y-2.5 text-xs font-bold">
                {[
                  ["Keyboard", selected.keyboard],
                  ["Sound engine", selected.soundEngine],
                  ["Polyphony", selected.polyphony],
                ].map(([label, v]) => (
                  <div key={label as string} className="flex items-start justify-between gap-3">
                    <span className="shrink-0 uppercase tracking-wider text-faint">{label}</span>
                    <span className="text-right text-cream/85">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <div className="flex items-end justify-between">
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-faint">Sample price</span>
                    <span className="font-display text-2xl font-bold text-cream">{fmt(selected.price)}</span>
                  </span>
                  <span className="text-right text-xs font-bold text-brass2">Example split<br />{fmt(monthly(selected.price, 20))}/mo</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(selected.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream py-3.5 text-sm font-extrabold text-ink transition hover:bg-brass"
                  >
                    <ShoppingBag size={15} strokeWidth={2.5} /> Add to demo cart
                  </button>
                  <button
                    type="button"
                    onClick={() => openProduct(selected.id)}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-3.5 text-sm font-bold text-cream transition hover:border-brass/60 hover:text-brass2"
                  >
                    Details <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
