import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Armchair, AudioLines, BadgePercent, Building2, CalendarClock, Car, Crown, Feather,
  Gem, Gift, GraduationCap, History, Infinity as InfinityIcon, Mic, MoonStar, Pause, Piano,
  PiggyBank, Play, RotateCcw, ShoppingBag, SlidersHorizontal, Sofa, Sparkles, Sprout, Sunset,
  Users, Wallet, X, type LucideIcon,
} from "lucide-react";
import { PRODUCTS, fmt, monthly, type Product } from "../data/products";
import { useShop } from "../store/ShopContext";
import { useDialogFocus } from "../hooks/useDialogFocus";

interface Option { id: string; label: string; sub: string; icon: LucideIcon; }
interface Question { id: string; title: string; options: Option[]; }

const QUESTIONS: Question[] = [
  { id: "who", title: "Who will use the piano?", options: [
    { id: "child", label: "A young student", sub: "Explore weighted-key sample models", icon: GraduationCap },
    { id: "beginner", label: "A new hobby for me", sub: "Start with a simple sample shortlist", icon: Sprout },
    { id: "returning", label: "Returning to piano", sub: "Compare familiar and newer formats", icon: History },
    { id: "stage", label: "Stage or studio use", sub: "Look at portable sample models", icon: Mic },
    { id: "gift", label: "A gift for someone", sub: "Explore a few product styles", icon: Gift },
  ] },
  { id: "place", title: "Where will it be used?", options: [
    { id: "compact", label: "A small apartment", sub: "Space is limited", icon: Building2 },
    { id: "living", label: "A living room", sub: "Cabinet style matters", icon: Sofa },
    { id: "mobile", label: "Moving between places", sub: "Rehearsals, lessons or travel", icon: Car },
    { id: "studio", label: "A studio or classroom", sub: "A regular practice setup", icon: SlidersHorizontal },
  ] },
  { id: "budget", title: "What sample budget feels comfortable?", options: [
    { id: "b30", label: "Under UAH 30,000", sub: "Entry sample range", icon: PiggyBank },
    { id: "b60", label: "UAH 30,000–60,000", sub: "Mid-range sample", icon: Wallet },
    { id: "b120", label: "UAH 60,000–120,000", sub: "Premium sample", icon: Gem },
    { id: "b200", label: "UAH 120,000 and up", sub: "High-end sample", icon: Crown },
    { id: "dream", label: "Show me the top range", sub: "Ignore the sample budget", icon: InfinityIcon },
  ] },
  { id: "priority", title: "What matters most?", options: [
    { id: "keys", label: "Keyboard feel", sub: "Focus on the sample key specs", icon: Piano },
    { id: "sound", label: "Sound profile", sub: "Explore generated tones", icon: AudioLines },
    { id: "design", label: "Design and footprint", sub: "How it could fit the room", icon: Armchair },
    { id: "mobility", label: "Portability", sub: "Compare weight and dimensions", icon: Feather },
    { id: "value", label: "Sample price-to-feature balance", sub: "Compare the example data", icon: BadgePercent },
  ] },
  { id: "when", title: "When do you expect to play?", options: [
    { id: "evening", label: "After work", sub: "An evening practice routine", icon: Sunset },
    { id: "night", label: "Late at night", sub: "Headphone use is important", icon: MoonStar },
    { id: "family", label: "With family or guests", sub: "A shared home instrument", icon: Users },
    { id: "daily", label: "On a regular schedule", sub: "A daily practice setup", icon: CalendarClock },
  ] },
];

const BUDGET_MAX: Record<string, number> = { b30: 32000, b60: 65000, b120: 125000, b200: 260000, dream: Infinity };

function score(product: Product, answers: Record<string, string>): number {
  let total = 0;
  const personas: Record<string, string[]> = {
    child: ["child"], beginner: ["beginner"], returning: ["home", "beginner"], stage: ["stage"], gift: ["beginner", "home"],
  };
  if ((personas[answers.who] ?? []).some((value) => product.personas.includes(value as Product["personas"][number]))) total += 4;
  if (answers.place === "compact" && product.dims[1] <= 360) total += 3.5;
  if (answers.place === "living" && product.series !== "portable") total += 3;
  if (answers.place === "mobile" && product.series === "portable") total += 4.5;
  if (answers.place === "studio" && ["fp-90x", "hp704", "fp-30x"].includes(product.id)) total += 3;
  const budget = BUDGET_MAX[answers.budget] ?? Infinity;
  if (answers.budget === "dream") total += Math.min(4, product.price / 110000);
  else if (product.price <= budget) total += 3 + (product.price / budget) * 1.5;
  else if (product.price <= budget * 1.18) total += 0.6;
  else total -= 2.5;
  if (answers.priority === "keys") total += product.keyScore * 0.45;
  if (answers.priority === "sound") total += product.soundScore * 0.45;
  if (answers.priority === "design" && ["f107", "lx708", "gp-6", "hp704"].includes(product.id)) total += 3.2;
  if (answers.priority === "mobility") total += product.weight <= 16 ? 3.4 : product.weight <= 25 ? 1.6 : -1;
  if (answers.priority === "value") total += ((product.keyScore + product.soundScore) * 10000) / product.price;
  if (answers.when === "night" && product.bluetooth) total += 0.7;
  if (answers.when === "family" && product.series !== "portable") total += 0.8;
  return total;
}

function reasons(product: Product, answers: Record<string, string>): string[] {
  const items: string[] = [];
  if (answers.who === "child") items.push(`The sample catalog lists a ${product.keyboard.split(",")[0]} keyboard.`);
  if (answers.who === "beginner") items.push("The concept includes a guided finder and playable keyboard.");
  if (answers.who === "returning") items.push("Compare the sample keyboard and sound-profile details side by side.");
  if (answers.who === "stage") items.push("This sample shortlist favors portable models.");
  if (answers.who === "gift") items.push("This result is a starting point for exploring the sample catalog.");
  if (answers.place === "compact") items.push(`The sample depth is ${(product.dims[1] / 10).toFixed(0)} cm.`);
  if (answers.place === "mobile") items.push(`The sample weight is ${product.weight} kg.`);
  if (answers.place === "living") items.push("This sample belongs to a cabinet-style product series.");
  if (answers.priority === "keys") items.push(`Sample keyboard profile: ${product.keyboard}.`);
  if (answers.priority === "sound") items.push(`The interface uses a generated ${product.soundEngine} profile for its audio demo.`);
  if (answers.priority === "value") items.push(`The sample catalog price is ${fmt(product.price)}.`);
  if (answers.when === "night") items.push("The concept includes a visual headphone-practice scenario.");
  return items.slice(0, 3);
}

export const Quiz: React.FC = () => {
  const { quizOpen, setQuizOpen, addToCart, openProduct, playDemo, nowPlayingId, setCartOpen } = useShop();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const dialogRef = useDialogFocus<HTMLDivElement>(quizOpen);
  const done = step >= QUESTIONS.length;
  const { best, alt } = useMemo(() => {
    if (!done) return { best: null as Product | null, alt: null as Product | null };
    const ranked = [...PRODUCTS].sort((left, right) => score(right, answers) - score(left, answers));
    const top = ranked[0];
    const lower = ranked.slice(1, 5).filter((product) => product.price < top.price).sort((left, right) => right.price - left.price)[0] ?? ranked[1];
    return { best: top, alt: lower };
  }, [done, answers]);

  const choose = (questionId: string, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    window.setTimeout(() => setStep((current) => current + 1), 160);
  };
  const reset = () => { setStep(0); setAnswers({}); };
  const close = () => { setQuizOpen(false); window.setTimeout(reset, 300); };

  return (
    <AnimatePresence>
      {quizOpen && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close} role="dialog" aria-modal="true" aria-label="Sample piano product finder"
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[94svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-coal shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-line bg-coal/92 px-5 py-4 backdrop-blur sm:px-7">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 font-display text-sm font-bold text-cream"><Sparkles size={16} className="text-brass" /> Sample product finder</p>
                <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cream transition hover:bg-brass hover:text-ink" aria-label="Close product finder"><X size={16} /></button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div className="h-full bg-gradient-to-r from-[#8a6524] to-brass2" animate={{ width: `${(Math.min(step + 1, QUESTIONS.length) / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.35 }} />
                </div>
                <span className="text-xs font-bold text-faint">{done ? "Complete" : `Step ${step + 1} of ${QUESTIONS.length}`}</span>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className="font-display text-2xl font-bold text-cream">{QUESTIONS[step].title}</h3>
                    <div className="mt-5 space-y-2.5">
                      {QUESTIONS[step].options.map((option) => {
                        const Icon = option.icon;
                        const active = answers[QUESTIONS[step].id] === option.id;
                        return (
                          <button key={option.id} type="button" onClick={() => choose(QUESTIONS[step].id, option.id)} className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${active ? "border-brass bg-brass/12" : "border-line bg-white/[0.03] hover:border-brass/45 hover:bg-white/[0.05]"}`}>
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-brass text-ink" : "bg-white/[0.06] text-brass"}`}><Icon size={20} /></span>
                            <span><span className="block font-bold text-cream">{option.label}</span><span className="mt-0.5 block text-sm text-sand">{option.sub}</span></span>
                          </button>
                        );
                      })}
                    </div>
                    {step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)} className="mt-5 flex items-center gap-1.5 text-sm font-bold text-sand transition hover:text-cream"><ArrowLeft size={15} /> Back</button>}
                  </motion.div>
                ) : best && (
                  <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                    <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-brass">Sample match</p>
                    <h3 className="mt-2 font-display text-3xl font-bold text-cream">Roland {best.name}</h3>
                    <div className="relative mt-5 overflow-hidden rounded-2xl border border-line">
                      <img src={best.image} alt={`Sample product image: Roland ${best.name}`} className="aspect-[16/9] w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                        <div><p className="text-xs font-bold uppercase tracking-wide text-cream/70">Sample price</p><p className="mt-1 font-display text-2xl font-bold text-cream">{fmt(best.price)} <span className="text-sm font-bold text-brass2">· example split {fmt(monthly(best.price, 20))}/mo</span></p></div>
                        <button type="button" onClick={() => playDemo(best.id, false)} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold backdrop-blur transition ${nowPlayingId === best.id ? "bg-cream text-ink" : "bg-brass text-ink hover:bg-brass2"}`}>
                          {nowPlayingId === best.id ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
                          {nowPlayingId === best.id ? "Stop demo" : "Play demo"}
                        </button>
                      </div>
                    </div>
                    <p className="mt-5 text-sm font-extrabold uppercase tracking-wider text-sand">Why it matched</p>
                    <ul className="mt-2.5 space-y-2">{reasons(best, answers).map((reason) => <li key={reason} className="flex gap-2.5 text-sm leading-relaxed text-cream/85"><Sparkles size={15} className="mt-0.5 shrink-0 text-brass" /> {reason}</li>)}</ul>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => { addToCart(best.id); close(); window.setTimeout(() => setCartOpen(true), 350); }} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brass py-4 font-display text-sm font-bold text-ink transition hover:bg-brass2"><ShoppingBag size={16} strokeWidth={2.5} /> Add to demo cart</button>
                      <button type="button" onClick={() => { close(); window.setTimeout(() => openProduct(best.id), 350); }} className="flex flex-1 items-center justify-center rounded-full border border-cream/25 py-4 font-display text-sm font-bold text-cream transition hover:border-brass hover:text-brass2">View sample details</button>
                    </div>
                    {alt && alt.id !== best.id && <button type="button" onClick={() => { close(); window.setTimeout(() => openProduct(alt.id), 350); }} className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-line bg-white/[0.03] p-3 text-left transition hover:border-brass/40">
                      <img src={alt.image} alt={`Sample product image: Roland ${alt.name}`} className="h-16 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                      <span className="min-w-0"><span className="block text-[11px] font-extrabold uppercase tracking-wider text-faint">Lower sample price</span><span className="mt-0.5 block truncate font-display font-bold text-cream">Roland {alt.name} · {fmt(alt.price)}</span><span className="block truncate text-sm text-sand">{alt.tagline}</span></span>
                    </button>}
                    <button type="button" onClick={reset} className="mt-5 flex items-center gap-1.5 text-sm font-bold text-sand transition hover:text-cream"><RotateCcw size={15} /> Start over</button>
                    <p className="mt-3 text-xs leading-relaxed text-faint">This result uses sample product data and is for demonstrating the interface only.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
