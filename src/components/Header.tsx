import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useShop } from "../store/ShopContext";

const NAV = [
  { label: "Catalog", href: "#catalog" },
  { label: "Sound lab", href: "#soundlab" },
  { label: "Room fit", href: "#tools" },
  { label: "About this demo", href: "#faq" },
];

export const Logo: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <a href="#top" className="group flex items-center gap-3" aria-label="88 Keys — home">
    <span className="relative flex h-10 w-10 items-end gap-[3px] overflow-hidden rounded-lg border border-line bg-panel px-[7px] pb-[7px]">
      <span className="w-[6px] rounded-sm bg-cream transition-all duration-300 group-hover:h-[26px] h-[22px]" />
      <span className="w-[6px] rounded-sm bg-cream transition-all duration-300 group-hover:h-[26px] h-[22px]" />
      <span className="w-[6px] rounded-sm bg-brass transition-all duration-300 group-hover:h-[26px] h-[22px]" />
      <span className="absolute left-[13px] top-0 h-[14px] w-[5px] rounded-b-sm bg-ink" />
      <span className="absolute left-[22px] top-0 h-[14px] w-[5px] rounded-b-sm bg-ink" />
    </span>
    {!compact && (
      <span className="leading-none">
        <span className="block font-display text-[15px] font-extrabold tracking-wide text-cream">
          88&nbsp;KEYS
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-brass">
          INDEPENDENT STORE CONCEPT
        </span>
      </span>
    )}
  </a>
);

export const Header: React.FC = () => {
  const { cartCount, setCartOpen, compareIds, setCompareOpen, setSearchOpen, setQuizOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Demo disclosure */}
      <div
        className={`overflow-hidden bg-brass text-ink transition-all duration-500 ${scrolled ? "max-h-0" : "max-h-10"}`}
        aria-label="Demo disclosure"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider sm:gap-6 sm:text-xs">
          <span>Portfolio concept</span>
          <span className="hidden sm:inline">Not affiliated with Roland</span>
          <span className="hidden md:inline">Demo only · no orders or data are submitted</span>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "border-b border-line bg-ink/85 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-sand transition hover:bg-white/5 hover:text-cream"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => setQuizOpen(true)}
              className="ml-1 flex items-center gap-1.5 rounded-full bg-brass/15 px-3.5 py-2 text-sm font-bold text-brass2 ring-1 ring-brass/40 transition hover:bg-brass hover:text-ink"
            >
              <Sparkles size={15} /> Find a piano
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line bg-white/[0.04] px-3 py-2 text-sm font-semibold text-sand transition hover:border-brass/50 hover:text-cream"
              aria-label="Open search"
            >
              <Search size={16} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-line bg-black/40 px-1.5 text-[10px] font-bold text-faint md:inline">⌘K</kbd>
            </button>
            <button
              onClick={() => compareIds.length > 0 && setCompareOpen(true)}
              className="relative rounded-full border border-line bg-white/[0.04] p-2.5 text-sand transition hover:border-brass/50 hover:text-cream"
              aria-label="Compare models"
            >
              <ArrowLeftRight size={17} />
              {compareIds.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[10px] font-extrabold text-ink">
                  {compareIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-cream px-3.5 py-2.5 text-sm font-extrabold text-ink transition hover:bg-brass2"
              aria-label="Open demo cart"
            >
              <ShoppingBag size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Demo cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-brass2">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full border border-line bg-white/[0.04] p-2.5 text-cream lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        <div className="keystrip h-[3px] w-full opacity-25" />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mx-3 mt-2 rounded-2xl border border-line bg-coal/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-semibold text-cream transition hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                setQuizOpen(true);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brass px-4 py-3.5 font-extrabold text-ink"
            >
              <Sparkles size={17} /> Find a piano
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
