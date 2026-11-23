import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

function noise(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function tileColor(index, row, kind, theme) {
  const variation = noise(index, row);
  const color = kind === "violet" ? [124, 48, 218] : [71, 151, 141];
  const light = variation < 0.26 ? 0.035 : 0.13 + variation * 0.45;
  return `rgba(${color.join(",")},${light * (theme === "light" ? 0.55 : 0.7)})`;
}

export function PixelBackdrop({ kind, theme }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = canvas.current;
    const context = element.getContext("2d");
    if (!context) return undefined;
    let frame = 0;
    let width = 0;
    let height = 0;
    let tileSize = 0;
    let tiles = [];
    let twinkles = [];
    let elapsed = 0;
    let previousTime;
    const isSweep = kind === "sky";
    const lightTheme = theme === "light";

    const renderSweep = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = lightTheme ? "#69717b" : "#c5cbd3";
      // Wrap the light beyond the canvas edges so the next pass enters smoothly.
      const sweepCenter = ((elapsed * 0.08 + 0.9) % 2.2) - 0.6;
      for (const tile of tiles) {
        const distance = (tile.u + tile.v * 0.16 - sweepCenter) / 0.14;
        const sweep = Math.exp(-distance * distance * 0.5);
        const undercurrent = Math.sin(tile.u * 6 + tile.v * 3 - elapsed * 0.22) * 0.5 + 0.5;
        const brightness = 0.08 + tile.grain * 0.045 + undercurrent * 0.035
          + sweep * (0.24 + tile.grain * 0.09);
        context.globalAlpha = brightness * tile.envelope;
        context.fillRect(tile.x, tile.y, tileSize, tileSize);
      }
      context.globalAlpha = 1;
    };

    const paint = (x, y, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, tileSize, tileSize);
    };

    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const cell = isSweep ? (width < 640 ? 8 : 13) : (width < 640 ? 15 : 28);
      tileSize = cell - 1.4;
      tiles = [];
      twinkles = [];
      element.width = Math.ceil(width * ratio);
      element.height = Math.ceil(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      for (let row = 0; row * cell < height; row += 1) {
        for (let column = 0; column * cell < width; column += 1) {
          const x = column * cell;
          const y = row * cell;
          if (isSweep) {
            const u = x / width;
            const v = y / height;
            const grain = noise(column, row);
            // Slightly soften the field behind the name and introduction.
            const center = Math.exp(-((x / width - 0.5) ** 2 * 15 + (v - 0.58) ** 2 * 6));
            tiles.push({ x, y, u, v, grain, envelope: 1 - center * 0.28 });
            continue;
          }
          const color = tileColor(column, row, kind, theme);
          paint(x, y, color);
          if (noise(column + 21, row + 9) > 0.977) {
            twinkles.push({ x, y, color, phase: noise(column, row + 64) * 9, last: -1 });
          }
        }
      }
      if (isSweep) renderSweep();
    };

    const tick = (time) => {
      if (isSweep) {
        if (previousTime !== undefined) elapsed += Math.min(time - previousTime, 64) / 1000;
        previousTime = time;
        renderSweep();
      }
      for (const tile of twinkles) {
        const phase = time / 1700 + tile.phase;
        const glow = Math.round(Math.max(0, Math.sin(phase)) ** 3 * 9);
        if (glow === tile.last) continue;
        tile.last = glow;
        context.clearRect(tile.x, tile.y, tileSize, tileSize);
        paint(tile.x, tile.y, tile.color);
        if (glow) {
          context.globalAlpha = glow / 100;
          paint(tile.x, tile.y, "#ffffff");
          context.globalAlpha = 1;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    const updateVisibility = () => {
      window.cancelAnimationFrame(frame);
      previousTime = undefined;
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
