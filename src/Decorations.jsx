import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const stars = [
  [0.049, 0.39, 0.076], [0.25, 0.075, 0.085], [0.35, 0.45, 0.139],
  [0.46, 0.055, 0.074], [0.745, 0.43, 0.09], [0.89, 0.10, 0.125],
  [0.97, 0.33, 0.073], [0.83, 0.633, 0.105],
];

function noise(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const skyCurl = [
  [0.519, 0.225], [0.528, 0.138], [0.543, 0.071], [0.564, 0.023],
  [0.594, -0.003], [0.62, 0.015], [0.646, 0.055], [0.664, 0.111],
  [0.674, 0.182], [0.676, 0.256], [0.666, 0.323], [0.648, 0.374],
  [0.625, 0.4], [0.601, 0.378], [0.59, 0.327], [0.591, 0.267],
  [0.602, 0.216], [0.62, 0.198], [0.631, 0.227], [0.629, 0.274],
];

function curlDistance(x, y) {
  let closest = Infinity;
  for (let index = 1; index < skyCurl.length; index += 1) {
    const [ax, ay] = skyCurl[index - 1];
    const [bx, by] = skyCurl[index];
    const vx = (bx - ax) * 3.55;
    const vy = by - ay;
    const dx = (x - ax) * 3.55;
    const dy = y - ay;
    const t = Math.max(0, Math.min(1, (dx * vx + dy * vy) / (vx * vx + vy * vy)));
    closest = Math.min(closest, (dx - t * vx) ** 2 + (dy - t * vy) ** 2);
  }
  return closest;
}

function skyColor(x, y, index, row, phase, kind, theme, cursor) {
  const variation = noise(index, row);
  const glow = cursor ? Math.max(0, 1 - Math.hypot((x - cursor.x) * 2.7, y - cursor.y) * 7) : 0;
  const flicker = Math.sin(phase + variation * 13) * 0.045 + glow * 0.23;
  if (kind !== "sky") {
    const color = kind === "violet" ? [124, 48, 218] : [71, 151, 141];
    const light = variation < 0.26 ? 0.035 : 0.13 + variation * 0.45 + flicker;
    return `rgba(${color.join(",")},${Math.max(0, light * (theme === "light" ? 0.55 : 0.7))})`;
  }

  for (const [cx, cy, radius] of stars) {
    const distance = Math.hypot((x - cx) * 3.55, y - cy);
    if (distance < radius + (variation - 0.5) * 0.035) {
      return distance < radius * 0.46 ? "#c98b3d" : variation > 0.45 ? "#d6b84f" : "#af9847";
    }
  }

  if (x > 0.5 && x < 0.695 && y < 0.44 && curlDistance(x, y) < (0.024 + variation * 0.014) ** 2) {
    return y < 0.12 && x > 0.55 ? "#be8546" : variation < 0.35 ? "#b7a049" : "#d4b84c";
  }

  const treeWidth = Math.max(0, y + 0.1) * 0.042;
  const treeCenter = 0.185 + 0.015 * Math.sin(y * 2) - 0.023 * y;
  if (y > -0.015 && Math.abs(x - treeCenter) < treeWidth + variation * 0.006) {
    const value = Math.round(22 + variation * 20);
    return `rgb(${value},${value + 3},${value + 8})`;
  }

  const wave = Math.sin(x * 32 + y * 4 + Math.sin(x * 25) * 1.6);
  const current = Math.sin(x * 51 - y * 3.5 + Math.sin(x * 26) * 1.6) * 0.24;
  const light = Math.max(0, Math.min(1, 0.31 + wave * 0.35 + current + variation * 0.28 + flicker));
  const color = [20 + light * 78, 34 + light * 110, 77 + light * 101].map(Math.round);
  return `rgba(${color.join(",")},${theme === "light" ? 0.82 : 0.94})`;
}

export function PixelBackdrop({ kind, theme }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = canvas.current;
    const context = element.getContext("2d");
    if (!context) return undefined;
    let width, height, ratio, cursor;
    let frame = 0;
    let lastDraw = -Infinity;

    const draw = (time) => {
      const cell = kind === "sky" ? (width < 640 ? 8 : 13) : (width < 640 ? 15 : 28);
      const artWidth = Math.max(width, kind === "sky" ? 710 : width);
      const offset = (artWidth - width) / 2;
      context.clearRect(0, 0, width, height);
      for (let row = 0; row * cell < height; row += 1) {
        for (let column = 0; column * cell < width; column += 1) {
          const x = (column * cell + offset) / artWidth;
          const y = row * cell / height;
          context.fillStyle = skyColor(x, y, column, row, time / 1900, kind, theme, cursor);
          context.fillRect(column * cell, row * cell, cell - 1.4, cell - 1.4);
        }
      }
    };

    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.ceil(width * ratio);
      element.height = Math.ceil(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    };

    const onPointer = (event) => {
      cursor = event.clientY <= height ? {
        x: (event.clientX + Math.max(0, 710 - width) / 2) / Math.max(710, width),
        y: event.clientY / height,
      } : undefined;
    };
    const clearPointer = () => { cursor = undefined; };
    const tick = (time) => {
      if (!document.hidden && time - lastDraw > 100) {
        draw(time);
        lastDraw = time;
      }
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerleave", clearPointer);
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", clearPointer);
      window.cancelAnimationFrame(frame);
    };
  }, [kind, theme, reduced]);

  return <canvas ref={canvas} aria-hidden="true" className={`pixels pixels--${kind}`} />;
}

const greetings = [
  { label: "hello", width: 185, path: "M13 48 C34 46 54 17 47 10 C39 4 29 35 25 59 C38 38 58 28 55 43 C51 63 57 63 70 51 C87 34 90 40 79 49 C64 61 86 62 100 47 C112 35 116 11 110 12 C101 14 93 59 103 59 C116 58 132 28 131 14 C128 3 113 51 123 59 C131 64 143 53 144 44 C146 38 157 37 159 44 C162 54 148 65 143 59 C137 50 149 39 158 43 C163 46 169 46 177 41" },
  { label: "नमस्ते", width: 184 },
  { label: "hola", width: 155, path: "M12 51 C26 51 52 15 44 9 C35 2 25 34 21 60 C30 45 48 31 47 45 C42 66 53 62 66 50 C70 40 84 35 84 48 C83 60 64 64 65 52 C65 45 73 38 82 43 C91 48 104 32 107 18 C113 -2 100 7 95 28 C88 50 88 62 100 59 C109 58 126 37 130 42 C135 49 119 63 114 57 C106 50 123 36 131 42 C131 51 128 66 147 53" },
  { label: "xin chào", width: 202, path: "M9 58 Q21 37 33 42 L47 59 M34 40 L15 59 M48 56 Q55 46 56 42 L53 58 Q62 62 76 43 L73 59 Q88 35 90 47 L87 57 Q92 65 105 52 M123 41 C110 36 104 62 117 59 Q127 56 138 43 C149 28 152 9 146 11 Q134 14 130 59 C145 38 153 40 150 50 Q145 65 159 56 C161 47 177 36 177 44 C178 52 162 65 160 55 Q160 44 177 43 Q173 61 183 59 C190 59 201 47 193 43 C183 38 177 56 186 59 Q195 60 200 53 M164 24 L173 31 M57 29 L58 29" },
];

export function Greeting() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % greetings.length), 3000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const { label, path, width } = greetings[reduced ? 0 : index];
  return (
    <div className="greeting" role="img" aria-label="Hello in English, Hindi, Spanish, and Vietnamese">
      <AnimatePresence>
        <motion.svg key={label} aria-hidden="true" viewBox={`0 0 ${width} 70`}
          initial={false} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {path ? <motion.path d={path} initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: "easeInOut" }} />
            : <motion.text x="92" y="52" textAnchor="middle" initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.15 }}>{label}</motion.text>}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

const flowers = [
  [" UUU ", " (_)", "  | ", " \\|/", "^^^^^"],
  ["  ,,, ", " {({})}", "  -Y-", "  \\|/", "  ^^^"],
  ["   @", "  \\|/", " ^^^"],
  [" (o)", " \\|/", "^^^^"],
  ["  . ", "  |/", " ^^^"],
  [" UUUUU", " (___)", " \\-Y-/", "  \\|/", " ^^^^^"],
];

export function Garden() {
  return (
    <footer id="garden" className="garden" aria-label="Footer">
      <div className="garden-plants" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => {
          const random = noise(index, 44);
          const plant = flowers[index % flowers.length];
          return (
            <pre key={index} className="flower" style={{
              "--x": `${index * 2.84}%`, "--y": `${noise(index, 2) * 88}px`,
              "--delay": `${-random * 7}s`, "--bloom": index % 5,
            }}>
              {plant.map((line, lineIndex) => (
                <span key={lineIndex} className={lineIndex < plant.length - 2 ? "flower-bloom" : ""}>{line}{"\n"}</span>
              ))}
            </pre>
          );
        })}
        {Array.from({ length: 23 }, (_, index) => (
          <span key={index} className="garden-star" style={{
            left: `${noise(index, 9) * 100}%`, bottom: `${noise(index, 13) * 120 + 18}px`,
            animationDelay: `${-noise(index, 16) * 8}s`,
          }}>*</span>
        ))}
      </div>
    </footer>
  );
}

export function Note({ variant, title, children }) {
  return <figure className={`note note--${variant}`} aria-label={title}>
    <figcaption>{title}</figcaption><p>{children}</p>
  </figure>;
}

export function Sticker({ type }) {
  if (type === "flower") {
    return (
      <svg viewBox="0 0 100 100" className="sticker sticker--flower" aria-hidden="true">
        <defs>
          <radialGradient id="petal-color">
            <stop stopColor="#b33e70" /><stop offset="1" stopColor="#f8bad0" />
          </radialGradient>
        </defs>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path key={angle} transform={`rotate(${angle} 50 50)`} d="M50 51 C20 32 28 6 47 11 C67 4 78 29 50 51Z" fill="url(#petal-color)" stroke="#ffe5ed" strokeWidth="2.4" />
        ))}
        <circle cx="50" cy="50" r="5" fill="#ffdb86" />
      </svg>
    );
  }
  return <span className="sticker sticker--mirror" aria-hidden="true">✦</span>;
}
