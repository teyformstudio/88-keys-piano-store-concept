import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight, Bluetooth, Check, Pause, Piano, Play, Ruler, ShoppingBag, Weight, X, Zap,
} from "lucide-react";
import { fmt, monthly, perDay } from "../data/products";
import { useShop } from "../store/ShopContext";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { PianoKeyboard } from "./PianoKeyboard";

const MONTHS = [3, 6, 10, 12, 20, 25];

export const ProductModal: React.FC = () => {
  const { activeProduct: p, closeProduct, addToCart, toggleCompare, compareIds, playDemo, nowPlayingId } = useShop();
  const [months, setMonths] = useState(20);
  const dialogRef = useDialogFocus<HTMLDivElement>(Boolean(p));

  const playing = p ? nowPlayingId === p.id : false;

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={closeProduct}
          role="dialog"
          aria-modal="true"
          aria-label={`Sample product details: Roland ${p.name}`}
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-line bg-coal shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProduct}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-cream backdrop-blur transition hover:bg-brass hover:text-ink"
              aria-label="Close product details"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left: photo + playable voice */}
              <div className="border-b border-line bg-panel/50 p-4 sm:p-5 md:border-b-0 md:border-r">
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={p.image} alt={`Sample product image: Roland ${p.name}`} className="aspect-[4/3] w-full object-cover" />
                </div>

                <button
                  type="button"
                  onClick={() => playDemo(p.id, false)}
                  className={`mt-4 flex w-full items-center justify-center gap-3 rounded-full py-4 font-display text-sm font-bold transition ${
                    playing ? "bg-cream text-ink" : "bg-brass text-ink hover:bg-brass2"
                  }`}
                >
                  {playing ? <Pause size={17} className="fill-current" /> : <Play size={17} className="fill-current" />}
                  {playing ? "Stop demo" : "Play synthesized demo"}
                </button>
                <p className="mt-2.5 text-center text-xs font-semibold text-faint">Sample tone profile: {p.voiceName}</p>

                <div className="mt-5 rounded-2xl border border-line bg-black/35 p-3">
                  <p className="flex items-center gap-2 px-1 pb-2.5 text-xs font-extrabold uppercase tracking-wider text-brass2">
                    <Piano size={14} /> Play the synthesized keyboard
                  </p>
                  <div className="h-1.5 rounded-t bg-gradient-to-r from-[#3a2410] via-[#6b4a22] to-[#3a2410]" />
                  <PianoKeyboard from={57} to={76} voice={p.voice} className="h-24" />
                </div>

              </div>

              {/* Right: details */}
              <div className="p-5 sm:p-7">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brass">{p.seriesLabel} · sample listing</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-cream sm:text-4xl">Roland {p.name}</h3>
                <p className="mt-3 text-xs font-semibold text-faint">Sample product content · verify specifications before real use</p>
                <p className="mt-3 font-semibold text-brass2">{p.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/80">{p.description}</p>

                <div className="mt-6 space-y-3 rounded-2xl border border-line bg-black/25 p-4 text-sm">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-faint">Sample specifications</p>
                  <div className="flex justify-between gap-4"><span className="text-sand">Keyboard</span><span className="text-right font-semibold text-cream">{p.keyboard}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-sand">Sound engine</span><span className="text-right font-semibold text-cream">{p.soundEngine}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-sand">Speakers</span><span className="text-right font-semibold text-cream">{p.speakers}</span></div>
                </div>

                <ul className="mt-5 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm leading-snug text-cream/85">
                      <Check size={16} className="mt-0.5 shrink-0 text-brass" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs font-semibold text-sand sm:grid-cols-4">
                  <span className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-2">
                    <Zap size={13} className="text-brass" /> {p.polyphony}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-2">
                    <Weight size={13} className="text-brass" /> {p.weight} kg
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-2">
                    <Ruler size={13} className="text-brass" /> {(p.dims[0] / 1000).toFixed(2)}×{(p.dims[1] / 1000).toFixed(2)} m
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-2">
                    <Bluetooth size={13} className="text-brass" /> {p.bluetooth ? "Bluetooth" : "USB connection"}
                  </span>
                </div>

                {/* Installment */}
                <div className="mt-6 rounded-2xl border border-brass/30 bg-brass/[0.06] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-brass2">Illustrative payment split</span>
                    <span className="text-xs font-bold text-sand">Sample calculation only</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {MONTHS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                          months === m ? "bg-brass text-ink" : "border border-line text-sand hover:text-cream"
                        }`}
                      >
                        {m} mo
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-cream">
                    <span className="font-display text-xl font-bold text-brass2">{fmt(monthly(p.price, months))}</span> / month · approx. {perDay(p.price, months)} ₴ / day
                  </p>
                </div>

                {/* Price + CTA */}
                <div className="mt-6 flex items-end gap-3">
                  <div>
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-faint">Sample price</span>
                    <div className="font-display text-3xl font-bold leading-none text-cream">{fmt(p.price)}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brass py-4 font-display text-sm font-bold text-ink transition hover:bg-brass2"
                  >
                    <ShoppingBag size={16} strokeWidth={2.5} /> Add to demo cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p.id, true);
                      closeProduct();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-cream/25 py-4 font-display text-sm font-bold text-cream transition hover:border-brass hover:text-brass2"
                  >
                    Preview cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    className={`flex items-center justify-center gap-2 rounded-full border px-4 py-4 text-sm font-bold transition ${
                      compareIds.includes(p.id) ? "border-brass bg-brass/15 text-brass2" : "border-line text-sand hover:text-cream"
                    }`}
                    aria-label="Compare sample model"
                  >
                    <ArrowLeftRight size={16} />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-sand">
                  <span className="flex items-center gap-1.5">Sample content</span>
                  <span className="flex items-center gap-1.5">No order is submitted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
