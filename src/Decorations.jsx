import { useCallback, useEffect, useRef, useState } from "react";
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

function skyColor(x, y, index, row, kind, theme) {
  const variation = noise(index, row);
  if (kind !== "sky") {
    const color = kind === "violet" ? [124, 48, 218] : [71, 151, 141];
    const light = variation < 0.26 ? 0.035 : 0.13 + variation * 0.45;
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
  const light = Math.max(0, Math.min(1, 0.31 + wave * 0.35 + current + variation * 0.28));
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
    let frame = 0;
    let tileSize = 0;
    let twinkles = [];

    const paint = (x, y, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, tileSize, tileSize);
    };

    const resize = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const cell = kind === "sky" ? (width < 640 ? 8 : 13) : (width < 640 ? 15 : 28);
      const artWidth = kind === "sky" ? Math.max(width, 710) : width;
      const offset = (artWidth - width) / 2;
      tileSize = cell - 1.4;
      twinkles = [];
      element.width = Math.ceil(width * ratio);
      element.height = Math.ceil(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      for (let row = 0; row * cell < height; row += 1) {
        for (let column = 0; column * cell < width; column += 1) {
          const x = column * cell;
          const y = row * cell;
          const color = skyColor((x + offset) / artWidth, y / height, column, row, kind, theme);
          paint(x, y, color);
          if (noise(column + 21, row + 9) > 0.977) {
            twinkles.push({ x, y, color, phase: noise(column, row + 64) * 9, last: -1 });
          }
        }
      }
    };

    const tick = (time) => {
      for (const tile of twinkles) {
        const phase = time / 1700 + tile.phase;
        const glow = Math.round(Math.max(0, Math.sin(phase)) ** 3 * 9);
        if (glow === tile.last) continue;
        tile.last = glow;
        context.clearRect(tile.x, tile.y, tileSize, tileSize);
        paint(tile.x, tile.y, tile.color);
        if (glow) {
          context.globalAlpha = glow / 100;
          paint(tile.x, tile.y, kind === "sky" ? "#f6e6a7" : "#ffffff");
          context.globalAlpha = 1;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    const updateVisibility = () => {
      window.cancelAnimationFrame(frame);
      if (!reduced && !document.hidden) frame = window.requestAnimationFrame(tick);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      window.cancelAnimationFrame(frame);
    };
  }, [kind, theme, reduced]);

  return <canvas ref={canvas} aria-hidden="true" className={`pixels pixels--${kind}`} />;
}

const greetings = [
  {
    label: "hello", viewBox: "0 5 186 59", speed: 1, strokeWidth: 3.9,
    strokes: [
      ["M8 57 C27 46 48 20 44 10 C39 -2 28 16 21 64", 0, 0.8],
      ["M21 64 C30 42 53 34 46 50 C39 70 55 65 65 54 C73 53 86 46 85 40 C84 33 72 40 68 49 C62 62 76 69 99 58 C117 44 130 3 119 7 C107 12 97 50 101 61 C111 76 140 36 145 14 C150 -4 135 9 130 34 C124 56 126 69 140 61 C151 54 155 38 163 41 C178 41 165 67 152 61 C140 53 153 37 164 42 C169 45 175 46 181 39", 0.7, 2.8],
    ],
  },
  {
    label: "नमस्ते", viewBox: "0 10 139 56", speed: 0.8, strokeWidth: 3.2,
    strokes: [
      ["M21 48 C15 53 10 45 15 42 C23 36 32 43 35 53", 0, 0.6],
      ["M39 29 L33 67", 0.6, 0.4],
      ["M57 30 C57 44 48 49 50 53 C54 58 61 47 70 50", 1, 0.6],
      ["M78 28 C75 44 73 57 71 67", 1.6, 0.4],
      ["M85 31 C100 33 95 45 86 49 C78 52 83 57 90 53 C95 49 104 52 110 60", 2, 0.6],
      ["M104 43 C112 48 120 42 124 41", 2.6, 0.4],
      ["M105 51 C105 63 114 65 120 60", 3, 0.4],
      ["M126 29 C123 46 120 57 120 66", 3.4, 0.6],
      ["M129 26 C125 16 110 8 108 13 C107 17 115 20 119 20", 4, 0.6],
      ["M11 29 C50 28 90 29 133 29", 4.6, 0.8],
    ],
  },
  {
    label: "hola", viewBox: "0 6 162 56", speed: 0.8, strokeWidth: 3.9,
    strokes: [
      ["M10 54 C25 51 49 20 44 9 C39 -1 25 17 20 64", 0, 0.8],
      ["M20 64 C30 45 53 29 49 46 C41 69 55 66 68 51", 0.7, 0.8],
      ["M69 50 C76 37 90 38 88 50 C85 63 68 66 67 54 C65 44 78 37 87 43 C99 48 115 19 114 9 C112 -3 100 13 95 35 C89 55 92 69 104 60 L115 49", 1.4, 1.6],
      ["M115 49 C126 39 142 37 135 52 C131 61 119 66 116 59 C111 52 126 39 135 42", 2.9, 0.7],
      ["M135 42 C137 51 130 67 153 54", 3.5, 0.8],
    ],
  },
  {
    label: "xin chào", viewBox: "0 8 269 54", speed: 0.8, strokeWidth: 3.9,
    strokes: [
      ["M37 29 Q28 46 9 55", 0, 0.3],
      ["M8 35 C22 28 32 45 33 52 Q37 60 49 47", 0.4, 0.7],
      ["M55 35 C41 52 47 66 68 45", 1, 0.5],
      ["M59 24 L61 21", 1.5, 0.3],
      ["M73 35 L67 56 Q90 27 94 36 C91 49 86 63 111 47", 1.8, 0.9],
      ["M147 36 C132 27 119 62 137 56 C149 52 161 39 171 23", 2.6, 1.1],
      ["M171 23 C180 6 168 0 156 58 C171 41 183 29 184 38 C182 59 181 61 198 47", 3.6, 1],
      ["M198 47 C208 30 223 30 220 43 C218 53 203 63 200 54 C194 45 212 31 219 36 C214 49 213 66 231 49", 4.6, 0.8],
      ["M231 49 C236 34 255 28 256 42 C252 54 237 65 232 55 C226 47 241 33 255 39 Q261 42 266 37", 5.4, 1.5],
      ["M201 17 L211 26", 7, 0.8],
    ],
  },
];

export function Greeting() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const timer = useRef(0);
  const { label, viewBox, speed, strokeWidth, strokes } = greetings[reduced ? 0 : index];

  useEffect(() => () => window.clearTimeout(timer.current), [reduced]);
  const advanceAfterHold = useCallback(() => {
    if (reduced) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIndex((current) => (current + 1) % greetings.length), 900);
  }, [reduced]);

  return (
    <div className="greeting" role="img" aria-label="Hello in English, Hindi, Spanish, and Vietnamese">
      <AnimatePresence mode="wait">
        <motion.svg key={label} aria-hidden="true" viewBox={viewBox} strokeWidth={strokeWidth}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}>
          {strokes.map(([path, delay, duration], stroke) => (
            <motion.path key={path} d={path}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={reduced ? { duration: 0 } : {
                pathLength: { delay: delay * speed, duration: duration * speed, ease: "easeInOut" },
                opacity: { delay: delay * speed, duration: Math.min(duration, 0.45) * speed },
              }}
              onAnimationComplete={stroke === strokes.length - 1 ? advanceAfterHold : undefined} />
          ))}
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
