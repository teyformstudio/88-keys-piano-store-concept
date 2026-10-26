import React, { useState } from "react";
import { Check, Ruler, ShoppingBag, Wallet } from "lucide-react";
import { PRODUCTS, fmt, monthly, perDay, productById } from "../data/products";
import { useShop } from "../store/ShopContext";

const m = (mm: number) => (mm / 1000).toFixed(2);

const Installment: React.FC = () => {
  const { addToCart } = useShop();
  const [modelId, setModelId] = useState("fp-30x");
  const [months, setMonths] = useState(20);
  const p = productById(modelId);
  const perMonth = monthly(p.price, months);
  const perD = perDay(p.price, months);

  return (
    <div className="rounded-3xl border border-line bg-panel/60 p-6 sm:p-8">
      <p className="flex items-center gap-2.5 font-display text-lg font-bold text-cream">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass/12 text-brass">
          <Wallet size={19} />
        </span>
        Sample monthly split
      </p>
      <p className="mt-3 text-sm leading-relaxed text-sand">
        Illustrative calculation only. No financing provider or payment method is connected to this demo.
      </p>

      <label className="mt-6 block text-xs font-extrabold uppercase tracking-wider text-faint">Sample model</label>
      <select
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        className="mt-2 w-full cursor-pointer rounded-2xl border border-line bg-coal px-4 py-3.5 font-bold text-cream focus:border-brass/60 focus:outline-none"
        aria-label="Sample model for monthly estimate"
      >
        {PRODUCTS.map((x) => (
          <option key={x.id} value={x.id}>
            Roland {x.name} — {fmt(x.price)}
          </option>
        ))}
      </select>

      <label className="mt-6 flex items-baseline justify-between text-xs font-extrabold uppercase tracking-wider text-faint">
        Term <span className="font-display text-base normal-case tracking-normal text-brass2">{months} installments</span>
      </label>
      <input
        type="range"
        min={3}
        max={25}
        step={1}
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        className="slider mt-3 w-full"
        style={{ ["--fill" as string]: `${((months - 3) / 22) * 100}%` }}
        aria-label="Number of sample installments"
      />
      <div className="mt-1.5 flex justify-between text-[11px] font-bold text-faint">
        <span>3 installments</span>
        <span>25 installments</span>
      </div>

      <div className="mt-6 rounded-2xl border border-brass/30 bg-brass/[0.06] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="font-display text-4xl font-bold leading-none text-cream">
            {fmt(perMonth)}
            <span className="text-base text-sand"> /mo</span>
          </span>
          <span className="text-right text-sm font-bold text-brass2">
            ≈ {perD} ₴ / day
            <span className="block text-xs font-semibold text-sand">Illustrative estimate</span>
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Sample price data", "No provider connected"].map((b) => (
            <span key={b} className="flex items-center gap-1.5 rounded-full border border-line bg-black/30 px-2.5 py-1.5 text-[11px] font-bold text-cream/85">
              <Check size={12} className="text-brass" strokeWidth={3} /> {b}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => addToCart(modelId, true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream py-4 font-display text-sm font-bold text-ink transition hover:bg-brass"
      >
        <ShoppingBag size={16} strokeWidth={2.5} /> Add to demo cart
      </button>
      <p className="mt-3 text-center text-xs font-medium text-faint">No real purchase or financing request is submitted.</p>
    </div>
  );
};

const RoomFit: React.FC = () => {
  const [modelId, setModelId] = useState("f107");
  const p = productById(modelId);
  // SVG room: 440 x 330 units = 4.4m x 3.3m (1 unit = 1 cm)
  const pw = p.dims[0] / 10;
  const pd = p.dims[1] / 10;
  const px = (440 - pw) / 2;
  const benchDepth = 55;

  return (
    <div className="rounded-3xl border border-line bg-panel/60 p-6 sm:p-8">
      <p className="flex items-center gap-2.5 font-display text-lg font-bold text-cream">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass/12 text-brass">
          <Ruler size={19} />
        </span>
        Room-fit preview
      </p>
      <p className="mt-3 text-sm leading-relaxed text-sand">
        Switch sample models in a 4.4 × 3.3 m room diagram. Check exact measurements before making a real purchase.
      </p>

      <div className="no-scrollbar mt-5 flex gap-1.5 overflow-x-auto pb-1">
        {PRODUCTS.map((x) => (
          <button
            key={x.id}
            onClick={() => setModelId(x.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-extrabold transition ${
              modelId === x.id ? "bg-brass text-ink" : "border border-line text-sand hover:text-cream"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-[#0e0c09]">
        <svg viewBox="0 0 440 330" className="w-full" role="img" aria-label={`Sample room-fit diagram for Roland ${p.name}`}>
          <defs>
            <pattern id="grid50" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="rgba(243,237,226,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="8" y="8" width="424" height="314" fill="url(#grid50)" stroke="rgba(243,237,226,0.28)" strokeWidth="2" />
          {/* window on right wall */}
          <rect x="428" y="110" width="6" height="110" fill="rgba(240,205,126,0.5)" />
          <text x="420" y="170" fill="#a89f8d" fontSize="10" fontWeight="700" textAnchor="middle" transform="rotate(90 420 170)">window</text>
          {/* sofa */}
          <rect x="130" y="242" width="200" height="72" rx="14" fill="rgba(243,237,226,0.07)" stroke="rgba(243,237,226,0.22)" />
          <line x1="196" y1="248" x2="196" y2="308" stroke="rgba(243,237,226,0.15)" />
          <line x1="263" y1="248" x2="263" y2="308" stroke="rgba(243,237,226,0.15)" />
          <text x="230" y="282" fill="#a89f8d" fontSize="11" fontWeight="700" textAnchor="middle">sofa · 2.0 m</text>
          {/* rug */}
          <rect x="150" y="150" width="160" height="70" rx="8" fill="none" stroke="rgba(243,237,226,0.12)" strokeDasharray="5 5" />
          {/* bench zone */}
          <rect
            style={{ transition: "x .55s cubic-bezier(.22,1,.36,1), y .55s cubic-bezier(.22,1,.36,1), width .55s cubic-bezier(.22,1,.36,1)" }}
            x={px}
            y={10 + pd}
            width={pw}
            height={benchDepth}
            fill="rgba(217,166,72,0.07)"
            stroke="rgba(217,166,72,0.45)"
            strokeDasharray="6 5"
            rx="6"
          />
          {/* piano */}
          <g style={{ transform: `translateX(${px}px)`, transition: "transform .55s cubic-bezier(.22,1,.36,1)" }}>
            <rect
              style={{ transition: "width .55s cubic-bezier(.22,1,.36,1), height .55s cubic-bezier(.22,1,.36,1)" }}
              x="0"
              y="10"
              width={pw}
              height={pd}
              rx="5"
              fill="rgba(217,166,72,0.28)"
              stroke="#d9a648"
              strokeWidth="2"
            />
            <rect
              x="0"
              y={10 + pd - 9}
              width={pw}
              height="7"
              fill="#f3ede2"
              opacity="0.85"
              style={{ transition: "y .55s cubic-bezier(.22,1,.36,1), width .55s cubic-bezier(.22,1,.36,1)" }}
            />
          </g>
          <text
            x={px + pw / 2}
            y={10 + pd + benchDepth / 2 + 4}
            fill="#f0cd7e"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            style={{ transition: "x .55s cubic-bezier(.22,1,.36,1), y .55s cubic-bezier(.22,1,.36,1)" }}
          >
            bench area
          </text>
          <text
            x={px + pw / 2}
            y="30"
            fill="#0b0a08"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            style={{ paintOrder: "stroke", stroke: "rgba(240,205,126,0.9)", strokeWidth: 3, transition: "x .55s cubic-bezier(.22,1,.36,1)" }}
          >
            Roland {p.name}
          </text>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-line px-2 py-3">
          <div className="font-display text-base font-bold text-cream">{m(p.dims[0])} m</div>
          <div className="mt-0.5 text-[11px] font-semibold text-faint">sample width</div>
        </div>
        <div className="rounded-xl border border-line px-2 py-3">
          <div className="font-display text-base font-bold text-cream">{m(p.dims[1])} m</div>
          <div className="mt-0.5 text-[11px] font-semibold text-faint">
            {p.dims[1] <= 360 ? "compact depth" : p.dims[1] <= 520 ? "cabinet depth" : "grand piano depth"}
          </div>
        </div>
        <div className="rounded-xl border border-line px-2 py-3">
          <div className="font-display text-base font-bold text-cream">{m(p.dims[1] + 550)} m</div>
          <div className="mt-0.5 text-[11px] font-semibold text-faint">with bench clearance</div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-medium text-faint">
        Sample dimensions: {m(p.dims[2])} m high · {p.weight} kg. Product details are illustrative.
      </p>
    </div>
  );
};

export const DecisionTools: React.FC = () => (
  <section id="tools" className="relative scroll-mt-24 bg-coal py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">07 · Explore the details</p>
      <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
        Compare a sample price. <span className="text-brass">Preview the fit.</span>
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand sm:text-base">
        These tools demonstrate how a storefront can help visitors compare options. All values are sample data.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Installment />
        <RoomFit />
      </div>
    </div>
  </section>
);
