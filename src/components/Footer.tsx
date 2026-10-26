import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Logo } from "./Header";
import { useShop } from "../store/ShopContext";

const FOOTER_LINKS = [
  { label: "Sample catalog", href: "#catalog" },
  { label: "Sound lab", href: "#soundlab" },
  { label: "Room-fit preview", href: "#tools" },
  { label: "About this concept", href: "#demo-info" },
];

export const Footer: React.FC = () => {
  const { setQuizOpen } = useShop();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#080706]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-sand">
              An independent storefront concept built to demonstrate product discovery, comparison and browser-based audio interactions.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-faint">
              Not affiliated with or endorsed by Roland Corporation. Catalog details and prices are illustrative only.
            </p>
          </div>

          <nav aria-label="Demo sections">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-faint">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-cream/85">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}><a href={link.href} className="transition hover:text-brass2">{link.label}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-faint">Try the prototype</h2>
            <p className="mt-4 text-sm leading-relaxed text-sand">Use the sample finder to see how a guided product flow can work.</p>
            <button
              type="button"
              onClick={() => setQuizOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brass px-5 py-3 font-display text-sm font-bold text-ink transition hover:bg-brass2"
            >
              <Sparkles size={15} /> Open product finder <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="keystrip mx-auto h-[5px] max-w-7xl opacity-30" />
      <div aria-hidden className="select-none px-2 pb-2 pt-6 text-center font-display text-[12.5vw] font-extrabold leading-[0.95] tracking-tight">
        <span className="text-outline">88 KEYS</span>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs font-medium leading-relaxed text-faint sm:px-6 lg:flex-row lg:text-left">
          <p>© 2026 88 Keys · Independent portfolio concept. No real purchases or inquiries are processed.</p>
          <a href="#top" className="font-bold transition hover:text-cream">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
};
