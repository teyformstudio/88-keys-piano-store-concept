import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { piano } from "../lib/audio";
import { PRODUCTS, productById, type PersonaId, type Product } from "../data/products";

export interface CartItem {
  id: string;
  qty: number;
}

interface Toast {
  id: number;
  title: string;
  text?: string;
}

interface ShopState {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: string, openCart?: boolean) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (v: boolean) => void;
  activeProduct: Product | null;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  personaFilter: PersonaId | null;
  setPersonaFilter: (v: PersonaId | null) => void;
  quizOpen: boolean;
  setQuizOpen: (v: boolean) => void;
  nowPlayingId: string | null;
  playDemo: (id: string, short?: boolean) => void;
  stopDemo: () => void;
  toasts: Toast[];
  toast: (title: string, text?: string) => void;
  scrollToCatalog: () => void;
}

const Ctx = createContext<ShopState | null>(null);

export const useShop = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
};

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("klavish88-cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    const validIds = new Set(PRODUCTS.map((product) => product.id));
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.id === "string" && validIds.has(item.id) && Number.isInteger(item.qty) && item.qty > 0)
      : [];
  } catch {
    return [];
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [personaFilter, setPersonaFilter] = useState<PersonaId | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem("klavish88-cart", JSON.stringify(cart));
    } catch {
      /* private mode */
    }
  }, [cart]);

  const toast = useCallback((title: string, text?: string) => {
    const id = ++toastSeq.current;
    setToasts((t) => [...t.slice(-2), { id, title, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const addToCart = useCallback(
    (id: string, openCart = false) => {
      setCart((c) => {
        const found = c.find((i) => i.id === id);
        if (found) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
        return [...c, { id, qty: 1 }];
      });
      if (openCart) {
        setCartOpen(true);
      } else {
        toast(`Roland ${productById(id).name} added to the demo cart`, "No order will be sent. Keep exploring the sample catalog.");
      }
    },
    [toast]
  );

  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((i) => i.id !== id)), []);
  const setQty = useCallback(
    (id: string, qty: number) => {
      if (qty <= 0) return removeFromCart(id);
      setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)));
    },
    [removeFromCart]
  );
  const clearCart = useCallback(() => setCart([]), []);

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((ids) => {
        if (ids.includes(id)) return ids.filter((x) => x !== id);
        if (ids.length >= 3) {
          toast("The comparison has 3 models", "Remove one to add another sample model.");
          return ids;
        }
        return [...ids, id];
      });
    },
    [toast]
  );
  const clearCompare = useCallback(() => setCompareIds([]), []);

  const openProduct = useCallback((id: string) => setActiveId(id), []);
  const closeProduct = useCallback(() => setActiveId(null), []);

  const stopDemo = useCallback(() => {
    piano.stopDemo();
    setNowPlayingId(null);
  }, []);

  const playDemo = useCallback(
    (id: string, short = false) => {
      if (nowPlayingId === id) {
        stopDemo();
        return;
      }
      const p = productById(id);
      try {
        piano.playDemo(p.voice, {
          short,
          onEnd: () => setNowPlayingId((cur) => (cur === id ? null : cur)),
        });
        setNowPlayingId(id);
      } catch {
        toast("Audio demo unavailable", "This browser does not support the Web Audio API.");
      }
    },
    [nowPlayingId, stopDemo, toast]
  );

  const scrollToCatalog = useCallback(() => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Lock body scroll when any overlay is open
  useEffect(() => {
    const locked = cartOpen || compareOpen || !!activeId || searchOpen || quizOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, compareOpen, activeId, searchOpen, quizOpen]);

  // Cmd+K / Ctrl+K search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCartOpen(false);
        setCompareOpen(false);
        setQuizOpen(false);
        setActiveId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + productById(i.id).price * i.qty, 0), [cart]);
  const activeProduct = activeId ? productById(activeId) : null;

  const value: ShopState = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    cartOpen,
    setCartOpen,
    compareIds,
    toggleCompare,
    clearCompare,
    compareOpen,
    setCompareOpen,
    activeProduct,
    openProduct,
    closeProduct,
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    personaFilter,
    setPersonaFilter,
    quizOpen,
    setQuizOpen,
    nowPlayingId,
    playDemo,
    stopDemo,
    toasts,
    toast,
    scrollToCatalog,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
