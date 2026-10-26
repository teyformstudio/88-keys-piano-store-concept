import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAS } from "../data/products";
import { useShop } from "../store/ShopContext";

export const Personas: React.FC = () => {
  const { setPersonaFilter, scrollToCatalog } = useShop();

  const pick = (id: (typeof PERSONAS)[number]["id"]) => {
    setPersonaFilter(id);
    scrollToCatalog();
  };

  return (
    <section id="personas" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brass">01 · Find your use case</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-5xl">
              Start with the player. <span className="text-brass">Then compare the models.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-sand">
            Choose a scenario to filter the sample catalog. The recommendations are illustrative, not professional buying advice.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => pick(p.id)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-line text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <div className="aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 bg-black/40 text-cream backdrop-blur transition group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
                <ArrowUpRight size={17} strokeWidth={2.4} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold leading-snug text-cream">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{p.text}</p>
                <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brass2">{p.pick}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
