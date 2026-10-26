import React, { useEffect, useMemo, useRef, useState } from "react";
import { isBlack, midiName, piano, type VoiceParams } from "../lib/audio";

interface Props {
  from: number;
  to: number;
  voice: VoiceParams;
  enableKeyboard?: boolean;
  className?: string;
  showHints?: boolean;
}

/* Computer-key map: two chromatic rows starting at C */
const KEYMAP: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ";": 16,
};

export const PianoKeyboard: React.FC<Props> = ({ from, to, voice, enableKeyboard = false, className = "", showHints = false }) => {
  const [active, setActive] = useState<ReadonlySet<number>>(new Set());
  const timers = useRef<Map<number, number>>(new Map());
  const isDown = useRef(false);
  const visible = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const whites = useMemo(() => {
    const arr: number[] = [];
    for (let m = from; m <= to; m++) if (!isBlack(m)) arr.push(m);
    return arr;
  }, [from, to]);

  const blacks = useMemo(() => {
    const arr: Array<{ midi: number; afterWhiteIdx: number }> = [];
    let wi = -1;
    for (let m = from; m <= to; m++) {
      if (!isBlack(m)) wi++;
      else arr.push({ midi: m, afterWhiteIdx: wi });
    }
    return arr;
  }, [from, to]);

  const baseC = useMemo(() => {
    let m = from;
    while (m % 12 !== 0) m++;
    return m + 12 <= to ? m + 12 : m; // prefer second C so the row sits comfortably
  }, [from, to]);

  const hintFor = (midi: number): string | undefined => {
    if (!showHints) return undefined;
    const entry = Object.entries(KEYMAP).find(([, off]) => baseC + off === midi);
    return entry ? entry[0].toUpperCase() : undefined;
  };

  const strike = (midi: number, velocity = 0.8) => {
    if (!piano.isSupported()) return;
    piano.noteOn(midi, velocity, voice);
    setActive((prev) => {
      const next = new Set(prev);
      next.add(midi);
      return next;
    });
    const old = timers.current.get(midi);
    if (old) window.clearTimeout(old);
    timers.current.set(
      midi,
      window.setTimeout(() => {
        setActive((prev) => {
          const next = new Set(prev);
          next.delete(midi);
          return next;
        });
      }, 380)
    );
  };

  const velocityFromEvent = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rel = (e.clientY - rect.top) / rect.height;
    return 0.45 + 0.55 * Math.min(1, Math.max(0, rel));
  };

  useEffect(() => {
    const up = () => (isDown.current = false);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  useEffect(() => {
    if (!enableKeyboard || !rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0].intersectionRatio > 0.3;
      },
      { threshold: [0, 0.3, 0.6] }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [enableKeyboard]);

  useEffect(() => {
    if (!enableKeyboard) return;
    const held = new Set<string>();
    const down = (e: KeyboardEvent) => {
      if (!visible.current || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true']"))) return;
      if (target?.closest("button, a") && !rootRef.current?.contains(target)) return;
      const key = e.key.toLowerCase();
      const off = KEYMAP[key];
      if (off === undefined || held.has(key)) return;
      const midi = baseC + off;
      if (midi < from || midi > to) return;
      held.add(key);
      strike(midi, 0.78);
    };
    const up = (e: KeyboardEvent) => held.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
    // strike is stable enough for this use
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableKeyboard, baseC, from, to, voice]);

  const whiteW = 100 / whites.length;

  return (
    <div ref={rootRef} className={`relative select-none ${className}`} role="group" aria-label="Interactive piano keyboard">
      <div className="flex h-full w-full overflow-hidden rounded-b-xl">
        {whites.map((midi) => (
          <button
            key={midi}
            type="button"
            aria-label={`Note ${midiName(midi)}`}
            className={`wkey relative flex-1 cursor-pointer ${active.has(midi) ? "active" : ""}`}
            onPointerDown={(e) => {
              e.preventDefault();
              isDown.current = true;
              strike(midi, velocityFromEvent(e));
            }}
            onPointerEnter={(e) => {
              if (isDown.current) strike(midi, velocityFromEvent(e));
            }}
            onClick={(e) => {
              if (e.detail === 0) strike(midi, 0.78);
            }}
          >
            {midi % 12 === 0 && (
              <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-wide text-[#8a7c5c]">
                {midiName(midi)}
              </span>
            )}
            {hintFor(midi) && midi % 12 !== 0 && (
              <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded border border-[#c9bfa5] bg-white/50 px-1 text-[9px] font-bold text-[#8a7c5c]">
                {hintFor(midi)}
              </span>
            )}
          </button>
        ))}
      </div>
      {blacks.map(({ midi, afterWhiteIdx }) => (
        <button
          key={midi}
          type="button"
          aria-label={`Note ${midiName(midi)}`}
          className={`bkey absolute top-0 z-10 h-[62%] cursor-pointer rounded-b-md ${active.has(midi) ? "active" : ""}`}
          style={{
            left: `${(afterWhiteIdx + 1) * whiteW}%`,
            width: `${whiteW * 0.62}%`,
            transform: "translateX(-50%)",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isDown.current = true;
            strike(midi, velocityFromEvent(e));
          }}
          onPointerEnter={(e) => {
            if (isDown.current) strike(midi, velocityFromEvent(e));
          }}
          onClick={(e) => {
            if (e.detail === 0) strike(midi, 0.78);
          }}
        >
          {hintFor(midi) && (
            <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#a89f8d]">
              {hintFor(midi)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
