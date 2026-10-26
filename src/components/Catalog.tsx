import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, ArrowUpRight, Play, Search, ShoppingBag, X } from "lucide-react";
import { PRODUCTS, fmt, monthly, type Product, type SeriesId } from "../data/products";
import { useShop } from "../store/ShopContext";

const EqBars: React.FC = () => (
  <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
    {[0, 1, 2].map((i) => (
      <span key={i} className="eq-bar w-[3px] rounded bg-brass2" style={{ height: "100%", animationDelay: `${i * 0.16}s` }} />
    ))}
  </span>
);

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product: p, index }) => {
  const { addToCart, openProduct, toggleCompare, compareIds, playDemo, nowPlayingId } = useShop();
  const playing = nowPlayingId === p.id;
  const inCompare = compareIds.includes(p.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-3xl border border-line bg-panel/60 p-3 transition-colors hover:border-brass/35"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[4/3] w-full overflow-hidden bg-coal">
          <img
            src={p.image}
            alt={`Sample digital piano product: Roland ${p.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playDemo(p.id, true);
          }}
          className={`absolute bottom-3 right-3 flex items-center gap-2 rounded-full py-2 pl-3 pr-3.5 text-xs font-extrabold backdrop-blur transition ${
            playing ? "bg-brass text-ink" : "bg-black/60 text-cream ring-1 ring-cream/25 hover:bg-brass hover:text-ink"
          }`}
          aria-label={playing ? `Stop synthesized demo for ${p.name}` : `Play synthesized demo for ${p.name}`}
        >
          {playing ? <EqBars /> : <Play size={13} className="fill-current" />}
          {playing ? "Playing…" : "Play demo"}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-faint">{p.seriesLabel}</span>
          <span className="rounded-full border border-line px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">Sample data</span>
        </div>
        <button type="button" onClick={() => openProduct(p.id)} className="mt-1.5 text-left">
          <h3 className="font-display text-xl font-bold text-cream transition group-hover:text-brass2">Roland {p.name}</h3>
        </button>
        <p className="mt-1 line-clamp-2 min-h-[40px] text-sm leading-snug text-sand">{p.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-sand">
          <span className="rounded-full border border-line px-2 py-1">{p.keyboard.split(",")[0]}</span>
          <span className="rounded-full border border-line px-2 py-1">{p.polyphony}</span>
          <span className="rounded-full border border-line px-2 py-1">{p.weight} kg</span>
          {p.bluetooth && <span className="rounded-full border border-line px-2 py-1">Bluetooth</span>}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-faint">Sample price</span>
            <div className="font-display text-[22px] font-bold leading-none text-cream">{fmt(p.price)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-brass2">Example split</div>
            <div className="text-[11px] font-semibold text-faint">{fmt(monthly(p.price, 20))}/mo · illustrative</div>
          </div>
        </div>

        <p className="mt-2.5 text-xs font-semibold text-faint">Sample listing · not available to order</p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => addToCart(p.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-extrabold text-ink transition hover:bg-brass"
          >
            <ShoppingBag size={15} strokeWidth={2.5} /> Add to demo cart
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(p.id)}
            className={`flex items-center justify-center rounded-full border px-3.5 transition ${
              inCompare ? "border-brass bg-brass/15 text-brass2" : "border-line text-sand hover:border-brass/50 hover:text-cream"
            }`}
            aria-label={inCompare ? "Remove from comparison" : "Add to comparison"}
            title="Compare"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => openProduct(p.id)}
            className="flex items-center justify-center rounded-full border border-line px-3.5 text-sand transition hover:border-brass/50 hover:text-cream"
            aria-label={`Details for Roland ${p.name}`}
            title="Details"
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const SERIES_TABS: Array<{ id: SeriesId | "all"; label: string }> = [
  { id: "all", label: "All models" },
  { id: "portable", label: "Portable" },
  { id: "home", label: "Home" },
  { id: "premium", label: "Premium" },
  { id: "grand", label: "Grand" },
];

const PRICE_TABS = [
  { id: "all", label: "Any sample price" },
  { id: "lt40", label: "Under UAH 40k" },
  { id: "mid", label: "UAH 40k–90k" },
  { id: "gt90", label: "Over UAH 90k" },
] as const;

type PriceBand = (typeof PRICE_TABS)[number]["id"];
type SortId = "featured" | "priceAsc" | "priceDesc";

const PERSONA_LABEL: Record<string, string> = {
  child: "For a student",
  beginner: "For a beginner",
  home: "For home",
  stage: "For the stage",
};

export const Catalog: React.FC = () => {
  const { searchQuery, setSearchQuery, personaFilter, setPersonaFilter, setQuizOpen } = useShop();
  const [series, setSeries] = useState<SeriesId | "all">("all");
  const [band, setBand] = useState<PriceBand>("all");
  const [sort, setSort] = useState<SortId>("featured");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (series !== "all" && p.series !== series) return false;
      if (personaFilter && !p.personas.includes(personaFilter)) return false;
      if (band === "lt40" && p.price >= 40000) return false;
      if (band === "mid" && (p.price < 40000 || p.price > 90000)) return false;
      if (band === "gt90" && p.price <= 90000) return false;
      if (q) {
        const hay = `${p.name} roland ${p.seriesLabel} ${p.tagline} ${p.keyboard} ${p.features.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "featured":
          return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
        default:
          return 0;
      }
    });
    return list;
  }, [series, band, sort, searchQuery, personaFilter]);

  const reset = () => {
    setSeries("all");
    setBand("all");
    setSearchQuery("");
    setPersonaFilter(null);
  };

  return (
    <section id="catalog" className="relative scroll-mt-24 py-20 sm:py-28">
      <div aria-hidden className="text-outline pointer-events-none absolute left-0 top-6 hidden select-none font-display text-[130px] font-extrabold leading-none xl:block">
        ROLAND
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">02 · Sample catalog</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
              Nine models. <span className="text-brass">One to explore.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-sand">
            Browse the sample product cards, compare illustrative specifications and try the synthesized audio controls.
          </p>
        </div>

        {/* Toolbar */}
        <div className="sticky top-[74px] z-20 mt-10 rounded-3xl border border-line bg-ink/85 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:top-[84px]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {SERIES_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSeries(t.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition ${
                    series === t.id ? "bg-brass text-ink" : "bg-white/[0.04] text-sand hover:bg-white/10 hover:text-cream"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
              <label className="relative flex-1 lg:max-w-64">
                <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FP-30X, grand piano, Bluetooth…"
                  className="w-full rounded-full border border-line bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm font-semibold text-cream placeholder:text-faint focus:border-brass/60 focus:outline-none"
                  aria-label="Search sample catalog"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-cream" aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="cursor-pointer rounded-full border border-line bg-panel px-4 py-2.5 text-sm font-bold text-cream focus:border-brass/60 focus:outline-none"
                aria-label="Sort sample products"
              >
                <option value="featured">Featured order</option>
                <option value="priceAsc">Sample price: low to high</option>
                <option value="priceDesc">Sample price: high to low</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {PRICE_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setBand(t.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  band === t.id ? "bg-cream text-ink" : "border border-line text-sand hover:text-cream"
                }`}
              >
                {t.label}
              </button>
            ))}
            {personaFilter && (
              <button
                onClick={() => setPersonaFilter(null)}
                className="flex items-center gap-1.5 rounded-full bg-brass/15 px-3 py-1.5 text-xs font-extrabold text-brass2 ring-1 ring-brass/40 transition hover:bg-brass hover:text-ink"
              >
                Use case: {PERSONA_LABEL[personaFilter]} <X size={13} strokeWidth={3} />
              </button>
            )}
            <span className="ml-auto text-xs font-bold text-faint">
              Showing {filtered.length} of {PRODUCTS.length}
            </span>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
            <p className="font-display text-xl font-bold text-cream">No matching sample products.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-sand">
              Adjust the filters, or use the product finder to explore the sample catalog.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={reset} className="rounded-full bg-cream px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-brass2">
                Reset filters
              </button>
              <button onClick={() => setQuizOpen(true)} className="rounded-full border border-brass/50 px-6 py-3 text-sm font-extrabold text-brass2 transition hover:bg-brass hover:text-ink">
                Try the product finder
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
