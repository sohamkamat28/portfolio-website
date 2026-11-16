import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

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
