"use client";

import { useEffect, useMemo, useState } from "react";
import { GREETINGS, type Greeting } from "./greetings.data";

/**
 * Cycles through greetings (hello → नमस्ते → hola → xin chào), writing each one
 * stroke-by-stroke in yellow ink, holding it, clearing it, then moving on.
 *
 * Pattern (matched to your screen recording):
 *   write  ~ stroke length / WRITE_SPEED, pen-lift pause between strokes
 *   hold   ~ 2.1s once fully written
 *   clear  ~ near-instant fade
 *   gap    ~ 0.5s blank before the next greeting starts
 * Devanagari is written letters first, top bar (shirorekha) last.
 *
 * No animation library needed: each stroke is an SVG <path pathLength=1>
 * animated with stroke-dashoffset.
 */

const WRITE_SPEED = 900; // viewBox units per second
const PEN_LIFT_MS = 90;
const HOLD_MS = 2100;
const CLEAR_MS = 150;
const GAP_MS = 500;

type Props = {
  /** Ink colour. Sampled from the recording. */
  color?: string;
  /** Rendered height of the tallest greeting, in px. */
  size?: number;
  /** Override or reorder greetings. */
  greetings?: Greeting[];
  className?: string;
};

function plan(g: Greeting) {
  let t = 0;
  const strokes = g.strokes.map((s) => {
    const dur = (s.len / WRITE_SPEED) * 1000;
    const item = { ...s, delay: t, dur };
    t += dur + PEN_LIFT_MS;
    return item;
  });
  return { strokes, total: t - PEN_LIFT_MS };
}

export default function HandwrittenGreeting({
  color = "#f2cb30",
  size = 64,
  greetings = GREETINGS,
  className,
}: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"writing" | "clearing" | "gap">("writing");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const g = greetings[reduced ? 0 : index % greetings.length];
  const visiblePhase = reduced ? "writing" : phase;
  const { strokes, total } = useMemo(() => plan(g), [g]);

  useEffect(() => {
    if (reduced) return;
    setPhase("writing");
    const t1 = setTimeout(() => setPhase("clearing"), total + HOLD_MS);
    const t2 = setTimeout(() => setPhase("gap"), total + HOLD_MS + CLEAR_MS);
    const t3 = setTimeout(() => {
      setIndex((i) => (i + 1) % greetings.length);
      setPhase("writing");
    }, total + HOLD_MS + CLEAR_MS + GAP_MS);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [index, total, reduced, greetings.length]);

  // One scale for every greeting so letter size stays consistent between them.
  const maxH = Math.max(...greetings.map((x) => x.h));
  const scale = size / maxH;

  return (
    <div
      role="img"
      aria-label={g.label}
      className={className}
      style={{
        height: size,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes hg-write {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          1%   { stroke-dashoffset: 1; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      {visiblePhase !== "gap" && (
        <svg
          key={g.id + index}
          aria-hidden="true"
          viewBox={`0 0 ${g.w} ${g.h}`}
          width={g.w * scale}
          height={g.h * scale}
          fill="none"
          stroke={color}
          strokeWidth={g.stem * 0.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            overflow: "visible",
            opacity: visiblePhase === "clearing" ? 0 : 1,
            transition: `opacity ${CLEAR_MS}ms ease-out`,
          }}
        >
          {strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              pathLength={1}
              style={{
                strokeDasharray: "1",
                strokeDashoffset: reduced ? 0 : 1,
                opacity: reduced ? 1 : 0,
                animation: reduced
                  ? "none"
                  : `hg-write ${s.dur}ms cubic-bezier(.45,.05,.35,1) ${s.delay}ms both`,
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
