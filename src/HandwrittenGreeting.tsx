import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GREETINGS } from "./greetings.data";

const HOLD_MS = 2100;
const GAP_MS = 500;
const penStart = { pathLength: 0, opacity: 0 };
const penEnd = { pathLength: 1, opacity: 1 };

export default function HandwrittenGreeting() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"writing" | "clearing" | "gap">("writing");

  const greeting = GREETINGS[reduced ? 0 : index];
  const timeScale = greeting.timeScale ?? 1;
  const duration = Math.max(...greeting.strokes.map(({ delay, duration }) => delay + duration)) * timeScale * 1000;
  const clearAt = duration + HOLD_MS;
  const gapAt = clearAt + greeting.clear * 1000;

  useEffect(() => {
    if (reduced) return;
    setPhase("writing");
    const timers = [
      window.setTimeout(() => setPhase("clearing"), clearAt),
      window.setTimeout(() => setPhase("gap"), gapAt),
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % GREETINGS.length);
        setPhase("writing");
      }, gapAt + GAP_MS),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [index, reduced, clearAt, gapAt]);

  const visiblePhase = reduced ? "writing" : phase;
  const artHeight = greeting.timeScale ? "var(--apple-greeting-height)" : (greeting.h * 64) / 386;

  return (
    <div className="greeting" role="img" aria-label={greeting.label}>
      {visiblePhase !== "gap" && (
        <motion.svg
          key={greeting.id}
          aria-hidden="true"
          viewBox={`0 0 ${greeting.w} ${greeting.h}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={greeting.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ height: artHeight }}
          initial={false}
          animate={{ opacity: visiblePhase === "clearing" ? 0 : 1 }}
          transition={{ duration: reduced ? 0 : greeting.clear, ease: "easeOut" }}
        >
          {greeting.strokes.map((stroke) => (
            <motion.path
              key={stroke.d}
              d={stroke.d}
              initial={reduced ? false : penStart}
              animate={penEnd}
              transition={reduced ? { duration: 0 } : {
                pathLength: { duration: stroke.duration * timeScale, delay: stroke.delay * timeScale, ease: stroke.ease },
                opacity: { duration: stroke.opacityDuration, delay: stroke.delay * timeScale },
              }}
            />
          ))}
        </motion.svg>
      )}
    </div>
  );
}
