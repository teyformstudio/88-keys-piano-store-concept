import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, CheckCircle2, Info, Minus, Music2, Pause, Play, Plus, Search,
  ShoppingBag, Trash2, X,
} from "lucide-react";
import { PRODUCTS, fmt, monthly, productById, type Product } from "../data/products";
import { useShop } from "../store/ShopContext";
import { useDialogFocus } from "../hooks/useDialogFocus";

/* ---------------- Toasts ---------------- */
export const Toasts: React.FC = () => {
  const { toasts } = useShop();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2" aria-live="polite" aria-atomic="false">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="pointer-events-auto flex gap-3 rounded-2xl border border-brass/35 bg-panel/95 p-4 shadow-2xl backdrop-blur"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brass" />
            <span>
              <span className="block text-sm font-extrabold text-cream">{t.title}</span>
              {t.text && <span className="mt-0.5 block text-xs font-medium leading-snug text-sand">{t.text}</span>}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- Now playing bar ---------------- */
const Eq: React.FC = () => (
  <span className="flex h-4 items-end gap-[3px]" aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <span key={i} className="eq-bar w-[3px] rounded bg-brass" style={{ height: "100%", animationDelay: `${i * 0.13}s` }} />
    ))}
  </span>
);

export const NowPlayingBar: React.FC = () => {
  const { nowPlayingId, stopDemo, addToCart, openProduct } = useShop();
  const p = nowPlayingId ? productById(nowPlayingId) : null;
  return (
    <AnimatePresence>
      {p && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 left-3 right-3 z-40 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-md"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-brass/35 bg-coal/92 p-3 pl-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <Eq />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-faint">Synthesized demo</p>
              <p className="truncate text-sm font-extrabold text-cream">
                Roland {p.name} <span className="font-bold text-brass2">· {fmt(p.price)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => addToCart(p.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-brass px-3.5 py-2.5 text-xs font-extrabold text-ink transition hover:bg-brass2"
            >
              <ShoppingBag size={13} strokeWidth={2.6} /> Add to demo cart
            </button>
            <button
              type="button"
              onClick={() => openProduct(p.id)}
              className="shrink-0 rounded-full border border-line p-2.5 text-sand transition hover:text-cream"
              aria-label="View sample product details"
            >
              <ArrowUpRight size={14} />
            </button>
            <button
              type="button"
              onClick={stopDemo}
              className="shrink-0 rounded-full border border-line p-2.5 text-sand transition hover:bg-cream hover:text-ink"
              aria-label="Stop audio demo"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Compare bar + modal ---------------- */
export const CompareBar: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare, setCompareOpen, compareOpen, nowPlayingId } = useShop();
  if (compareIds.length === 0 || compareOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed left-3 right-3 z-40 sm:left-auto sm:right-5 sm:bottom-5 ${nowPlayingId ? "bottom-[86px]" : "bottom-3"}`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-coal/92 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="flex -space-x-2">
          {compareIds.map((id) => {
            const p = productById(id);
            return (
              <button key={id} onClick={() => toggleCompare(id)} title={`Remove ${p.name}`} className="group relative">
                <img src={p.image} alt={p.name} className="h-11 w-14 rounded-lg border border-line object-cover" />
                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70 text-cream opacity-0 transition group-hover:opacity-100">
                  <X size={14} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-cream">Compare · {compareIds.length} of 3</p>
          <p className="truncate text-xs font-semibold text-faint">
            {compareIds.length < 2 ? "Add one more sample model" : compareIds.map((id) => productById(id).name).join(" vs ")}
          </p>
        </div>
        <button
          type="button"
          disabled={compareIds.length < 2}
          onClick={() => setCompareOpen(true)}
          className="shrink-0 rounded-full bg-cream px-4 py-2.5 text-xs font-extrabold text-ink transition enabled:hover:bg-brass disabled:opacity-40"
        >
          Compare
        </button>
        <button type="button" onClick={clearCompare} className="shrink-0 rounded-full border border-line p-2.5 text-sand transition hover:text-cream" aria-label="Clear comparison">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

interface RowDef {
  label: string;
  get: (p: Product) => string;
  num?: (p: Product) => number;
  better?: "min" | "max";
}

const ROWS: RowDef[] = [
  { label: "Sample price", get: (p) => fmt(p.price), num: (p) => p.price, better: "min" },
  { label: "Example monthly split", get: (p) => `${fmt(monthly(p.price, 20))}/mo`, num: (p) => p.price, better: "min" },
  { label: "Keyboard", get: (p) => p.keyboard },
  { label: "Sample keyboard score", get: (p) => `${p.keyScore.toFixed(1)} / 10`, num: (p) => p.keyScore, better: "max" },
  { label: "Sample sound profile", get: (p) => p.soundEngine },
  { label: "Sample tone score", get: (p) => `${p.soundScore.toFixed(1)} / 10`, num: (p) => p.soundScore, better: "max" },
  { label: "Polyphony", get: (p) => p.polyphony },
  { label: "Tone count in sample data", get: (p) => String(p.tones), num: (p) => p.tones, better: "max" },
  { label: "Speakers", get: (p) => p.speakers, num: (p) => p.powerW, better: "max" },
  { label: "Bluetooth", get: (p) => (p.bluetooth ? "Yes" : "USB only") },
  { label: "Weight", get: (p) => `${p.weight} kg`, num: (p) => p.weight, better: "min" },
  { label: "Dimensions (W × D × H)", get: (p) => `${p.dims[0]}×${p.dims[1]}×${p.dims[2]} mm` },
];

export const CompareModal: React.FC = () => {
  const { compareOpen, setCompareOpen, compareIds, addToCart, openProduct, toggleCompare } = useShop();
  const items = compareIds.map(productById);
  const dialogRef = useDialogFocus<HTMLDivElement>(compareOpen && items.length >= 2);

  const winners = (row: RowDef): Set<string> => {
    if (!row.num || !row.better || items.length < 2) return new Set();
    const vals = items.map((p) => ({ id: p.id, v: row.num!(p) }));
    const best = row.better === "max" ? Math.max(...vals.map((x) => x.v)) : Math.min(...vals.map((x) => x.v));
    return new Set(vals.filter((x) => x.v === best).map((x) => x.id));
  };

  return (
    <AnimatePresence>
      {compareOpen && items.length >= 2 && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setCompareOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Compare sample models"
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-line bg-coal shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-coal/95 px-5 py-4 backdrop-blur sm:px-7">
              <h3 className="font-display text-lg font-bold text-cream">
                Sample comparison <span className="text-brass">· {items.map((p) => p.name).join(" vs ")}</span>
              </h3>
              <button onClick={() => setCompareOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cream transition hover:bg-brass hover:text-ink" aria-label="Close comparison">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-x-auto p-5 sm:p-7">
              <table className="w-full min-w-[640px] border-separate" style={{ borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th className="w-44 p-2 text-left align-bottom text-xs font-bold text-faint">Best sample value</th>
                    {items.map((p) => (
                      <th key={p.id} className="min-w-[200px] p-2 align-top">
                        <div className="relative overflow-hidden rounded-2xl border border-line">
                          <img src={p.image} alt={`Roland ${p.name}`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-cream backdrop-blur transition hover:bg-[#c74b2e]"
                            aria-label={`Remove ${p.name} from comparison`}
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <button onClick={() => { setCompareOpen(false); window.setTimeout(() => openProduct(p.id), 350); }} className="mt-3 font-display text-base font-bold text-cream transition hover:text-brass2">
                          Roland {p.name}
                        </button>
                        <div className="mt-0.5 text-sm font-bold text-brass2">{fmt(p.price)}</div>
                        <button
                          onClick={() => addToCart(p.id)}
                          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-cream py-2.5 text-xs font-extrabold text-ink transition hover:bg-brass"
                        >
                          <ShoppingBag size={13} strokeWidth={2.6} /> Add to demo cart
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, ri) => {
                    const win = winners(row);
                    return (
                      <tr key={row.label} className={ri % 2 ? "bg-white/[0.025]" : ""}>
                        <td className="rounded-l-xl px-3 py-3 text-xs font-extrabold uppercase tracking-wide text-faint">{row.label}</td>
                        {items.map((p) => (
                          <td key={p.id} className={`px-3 py-3 text-sm font-semibold ${win.has(p.id) ? "text-brass2" : "text-cream/85"}`}>
                            <span className="flex items-center gap-2">
                              {win.has(p.id) && <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />}
                              {row.get(p)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-5 text-sm font-medium text-faint">Product specifications and scores are illustrative sample data.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Cart drawer ---------------- */
const CART_MONTHS = [6, 10, 12, 20, 25];

export const CartDrawer: React.FC = () => {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart, cartTotal, cartCount, clearCart, scrollToCatalog } = useShop();
  const [months, setMonths] = useState(20);
  const [preview, setPreview] = useState<{ total: number; count: number } | null>(null);
  const dialogRef = useDialogFocus<HTMLElement>(cartOpen);

  const close = () => {
    setCartOpen(false);
    window.setTimeout(() => setPreview(null), 350);
  };

  const previewCheckout = () => {
    setPreview({ total: cartTotal, count: cartCount });
    clearCart();
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={close} />
          <motion.aside
            ref={dialogRef}
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-coal shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Demo cart"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-display text-lg font-bold text-cream">
                Demo cart {cartCount > 0 && <span className="text-brass">· {cartCount}</span>}
              </h3>
              <button onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cream transition hover:bg-brass hover:text-ink" aria-label="Close demo cart">
                <X size={16} />
              </button>
            </div>

            {preview ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-brass text-ink"
                >
                  <Music2 size={34} />
                </motion.span>
                <h4 className="mt-6 font-display text-2xl font-bold text-cream">Demo preview complete</h4>
                <p className="mt-3 text-sm leading-relaxed text-sand">
                  The sample cart contained {preview.count} item(s), totaling {fmt(preview.total)}. No order was created and no information was sent.
                </p>
                <button onClick={close} className="mt-7 rounded-full bg-cream px-7 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-brass">
                  Continue exploring
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] text-faint">
                  <Music2 size={32} />
                </span>
                <h4 className="mt-6 font-display text-xl font-bold text-cream">Your demo cart is empty</h4>
                <p className="mt-2 text-sm leading-relaxed text-sand">Explore the sample catalog and try the cart interaction.</p>
                <button
                  onClick={() => {
                    close();
                    window.setTimeout(scrollToCatalog, 150);
                  }}
                  className="mt-6 rounded-full bg-brass px-7 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-brass2"
                >
                  Browse sample models
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  {cart.map((item) => {
                    const p = productById(item.id);
                    return (
                      <div key={item.id} className="flex gap-3 rounded-2xl border border-line bg-panel/60 p-3">
                        <img src={p.image} alt={`Sample product image: Roland ${p.name}`} className="h-20 w-24 shrink-0 rounded-xl object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-sm font-bold text-cream">Roland {p.name}</p>
                            <button onClick={() => removeFromCart(p.id)} className="text-faint transition hover:text-[#f0956e]" aria-label={`Remove ${p.name}`}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-1 rounded-full border border-line px-1 py-1">
                              <button onClick={() => setQty(p.id, item.qty - 1)} className="flex h-6 w-6 items-center justify-center rounded-full text-sand hover:bg-white/10" aria-label="Decrease quantity">
                                <Minus size={13} />
                              </button>
                              <span className="min-w-5 text-center text-sm font-extrabold text-cream">{item.qty}</span>
                              <button onClick={() => setQty(p.id, item.qty + 1)} className="flex h-6 w-6 items-center justify-center rounded-full text-sand hover:bg-white/10" aria-label="Increase quantity">
                                <Plus size={13} />
                              </button>
                            </span>
                            <span className="font-display text-sm font-bold text-cream">{fmt(p.price * item.qty)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-faint">Demo checkout preview</p>
                    <div className="flex items-start gap-2.5 rounded-2xl border border-brass/25 bg-brass/[0.06] p-3 text-xs leading-relaxed text-sand">
                      <Info size={15} className="mt-0.5 shrink-0 text-brass" />
                      No name, phone number or address is requested. This demo does not send orders or personal data.
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sand">
                      <span className="mr-1">Illustrative split:</span>
                      {CART_MONTHS.map((monthCount) => (
                        <button
                          key={monthCount}
                          type="button"
                          onClick={() => setMonths(monthCount)}
                          aria-pressed={months === monthCount}
                          className={`rounded-full px-3 py-1.5 font-extrabold transition ${months === monthCount ? "bg-cream text-ink" : "border border-line text-sand hover:text-cream"}`}
                        >
                          {monthCount} mo
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-line px-5 py-5">
                  <div className="space-y-1.5 text-sm font-semibold text-sand">
                    <p className="flex items-center justify-between text-brass2">
                      <span>Sample split · {months} months</span>
                      <span className="font-extrabold">{fmt(monthly(cartTotal, months))}/mo</span>
                    </p>
                    <p className="flex items-center justify-between pt-1.5 text-base">
                      <span className="font-bold text-cream">Sample total</span>
                      <span className="font-display text-xl font-bold text-cream">{fmt(cartTotal)}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={previewCheckout}
                    className="mt-4 w-full rounded-full bg-brass py-4 font-display text-sm font-bold text-ink transition hover:bg-brass2"
                  >
                    Preview demo confirmation
                  </button>
                  <p className="mt-2.5 text-center text-[11px] font-medium text-faint">Sample prices and payment split only. No transaction takes place.</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Search overlay ---------------- */
export const SearchOverlay: React.FC = () => {
  const { searchOpen, setSearchOpen, setSearchQuery, openProduct, setPersonaFilter, scrollToCatalog, playDemo, nowPlayingId, setQuizOpen } = useShop();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(searchOpen);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return PRODUCTS.filter((p) => `${p.name} roland ${p.seriesLabel} ${p.tagline} ${p.keyboard} ${p.features.join(" ")}`.toLowerCase().includes(needle));
  }, [q]);

  const applyToCatalog = () => {
    setSearchQuery(q);
    setSearchOpen(false);
    window.setTimeout(scrollToCatalog, 350);
  };

  const openProductFromSearch = (id: string) => {
    setSearchOpen(false);
    window.setTimeout(() => openProduct(id), 350);
  };

  const openFinderFromSearch = () => {
    setSearchOpen(false);
    window.setTimeout(() => setQuizOpen(true), 350);
  };

  const popular: Array<{ label: string; act: () => void }> = [
    { label: "FP-30X sample model", act: () => openProductFromSearch("fp-30x") },
    { label: "For a young student", act: () => { setPersonaFilter("child"); setSearchOpen(false); window.setTimeout(scrollToCatalog, 350); } },
    { label: "Compact home piano", act: () => openProductFromSearch("f107") },
    { label: "Digital grand GP-6", act: () => openProductFromSearch("gp-6") },
    { label: "Help me explore", act: openFinderFromSearch },
  ];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/92 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search sample store"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:pt-32" onClick={(e) => e.stopPropagation()}>
            <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <label className="relative block">
                <Search size={22} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brass" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyToCatalog()}
                  placeholder="Search models, features or use cases…"
                  className="w-full rounded-3xl border border-brass/40 bg-coal py-5 pl-14 pr-14 font-display text-lg font-bold text-cream placeholder:text-faint focus:outline-none sm:text-xl"
                  aria-label="Search query"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-cream transition hover:bg-brass hover:text-ink" aria-label="Close search">
                  <X size={16} />
                </button>
              </label>
              <p className="mt-3 px-1 text-xs font-semibold text-faint">Enter filters the catalog · Esc closes search · Try “Bluetooth”, “grand” or “PHA-50”.</p>

              {q.trim() === "" ? (
                <div className="mt-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-faint">Try a sample search</p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {popular.map((x) => (
                      <button key={x.label} onClick={x.act} className="rounded-full border border-line bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-cream transition hover:border-brass/60 hover:text-brass2">
                        {x.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="mt-6 space-y-2">
                  <p className="px-1 text-xs font-extrabold uppercase tracking-[0.22em] text-faint">Sample models found: {results.length}</p>
                  {results.map((p) => (
                    <div
                      key={p.id}
                      className="flex w-full items-center gap-4 rounded-2xl border border-line bg-panel/70 p-3 transition hover:border-brass/45"
                    >
                      <button className="flex min-w-0 flex-1 items-center gap-4 text-left" onClick={() => openProductFromSearch(p.id)}>
                        <img src={p.image} alt={`Sample product image: Roland ${p.name}`} className="h-14 w-[74px] shrink-0 rounded-xl object-cover" loading="lazy" />
                        <span className="min-w-0">
                          <span className="block truncate font-display font-bold text-cream">Roland {p.name}</span>
                          <span className="block truncate text-sm text-sand">{p.tagline}</span>
                        </span>
                        <span className="ml-auto shrink-0 font-display font-bold text-brass2">{fmt(p.price)}</span>
                      </button>
                      <button
                        onClick={() => playDemo(p.id, true)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${nowPlayingId === p.id ? "bg-brass text-ink" : "border border-line text-cream hover:border-brass/60"}`}
                        aria-label={`Play synthesized demo for ${p.name}`}
                      >
                        {nowPlayingId === p.id ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current" />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-10 text-center">
                  <p className="font-display text-lg font-bold text-cream">No sample models match “{q}”.</p>
                  <p className="mt-2 text-sm text-sand">Try a model name or use the sample product finder.</p>
                  <button
                    onClick={openFinderFromSearch}
                    className="mt-5 rounded-full bg-brass px-6 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-brass2"
                  >
                    Open product finder
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
