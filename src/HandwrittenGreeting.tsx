import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GREETINGS } from "./greetings.data";

// The English demo draws for (0.7s + 2.8s) × 1.1.
const DRAW_SECONDS = 3.85;
const CLEAR_SECONDS = 0.5;
const HOLD_MS = 2100;
const GAP_MS = 500;
const penStart = { pathLength: 0, opacity: 0 };
const penEnd = { pathLength: 1, opacity: 1 };

export default function HandwrittenGreeting() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"writing" | "clearing" | "gap">("writing");

  const greeting = GREETINGS[reduced ? 0 : index];
  const timelineEnd = Math.max(...greeting.strokes.map(({ delay, duration }) => delay + duration));
  const timeScale = DRAW_SECONDS / timelineEnd;
  const clearAt = DRAW_SECONDS * 1000 + HOLD_MS;
  const gapAt = clearAt + CLEAR_SECONDS * 1000;

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

  return (
    <div className="greeting" role="img" aria-label={greeting.label}>
      {visiblePhase !== "gap" && (
        <motion.svg
          key={greeting.id}
          aria-hidden="true"
          viewBox={greeting.viewBox}
          fill="none"
          stroke="currentColor"
          strokeWidth={greeting.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: visiblePhase === "clearing" ? 0 : 1 }}
          transition={{ duration: reduced ? 0 : CLEAR_SECONDS, ease: "easeOut" }}
        >
          {greeting.strokes.map((stroke) => (
            <motion.path
              key={stroke.d}
              d={stroke.d}
              initial={reduced ? false : penStart}
              animate={penEnd}
              transition={reduced ? { duration: 0 } : {
                pathLength: { duration: stroke.duration * timeScale, delay: stroke.delay * timeScale, ease: stroke.ease },
                opacity: {
                  duration: stroke.opacityDuration * (greeting.id === "hello" ? 1 : timeScale),
                  delay: stroke.delay * timeScale,
                },
              }}
            />
          ))}
        </motion.svg>
      )}
    </div>
  );
}
