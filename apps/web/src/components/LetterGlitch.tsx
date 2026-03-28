import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

type LetterGlitchProps = {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
};

type Cell = {
  char: string;
  color: string;
  targetColor: string;
  progress: number;
};

export function LetterGlitch({
  glitchColors = ["#24443b", "#4ec89f", "#5a8fca"],
  glitchSpeed = 60,
  centerVignette = true,
  outerVignette = true,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}: LetterGlitchProps) {
  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    background: "#05080f",
    overflow: "hidden",
  };

  const canvasStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
  };

  const vignetteStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lettersRef = useRef<Cell[]>([]);
  const gridRef = useRef({ columns: 0, rows: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchRef = useRef(Date.now());

  const chars = Array.from(characters);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)] ?? "A";
  const randomColor = () =>
    glitchColors[Math.floor(Math.random() * glitchColors.length)] ?? glitchColors[0] ?? "#4ec89f";

  const hexToRgb = (hex: string) => {
    const expanded = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, "$1$1$2$2$3$3");
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
    if (!result) return null;
    return {
      r: Number.parseInt(result[1] ?? "00", 16),
      g: Number.parseInt(result[2] ?? "00", 16),
      b: Number.parseInt(result[3] ?? "00", 16),
    };
  };

  const lerpColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    t: number
  ) => {
    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const calculateGrid = (width: number, height: number) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initLetters = (columns: number, rows: number) => {
    const total = columns * rows;
    gridRef.current = { columns, rows };
    lettersRef.current = Array.from({ length: total }, () => {
      const color = randomColor();
      return {
        char: randomChar(),
        color,
        targetColor: color,
        progress: 1,
      };
    });
  };

  const draw = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    lettersRef.current.forEach((cell, index) => {
      const x = (index % gridRef.current.columns) * charWidth;
      const y = Math.floor(index / gridRef.current.columns) * charHeight;
      ctx.fillStyle = cell.color;
      ctx.fillText(cell.char, x, y);
    });
  };

  const updateLetters = () => {
    const cells = lettersRef.current;
    if (!cells.length) return;

    const updates = Math.max(1, Math.floor(cells.length * 0.04));
    for (let i = 0; i < updates; i += 1) {
      const idx = Math.floor(Math.random() * cells.length);
      const cell = cells[idx];
      if (!cell) continue;
      cell.char = randomChar();
      cell.targetColor = randomColor();
      if (!smooth) {
        cell.color = cell.targetColor;
        cell.progress = 1;
      } else {
        cell.progress = 0;
      }
    }
  };

  const smoothStep = () => {
    if (!smooth) return;

    let needsRedraw = false;
    lettersRef.current.forEach((cell) => {
      if (cell.progress >= 1) return;
      const from = hexToRgb(cell.color);
      const to = hexToRgb(cell.targetColor);
      cell.progress = Math.min(1, cell.progress + 0.06);
      if (from && to) {
        cell.color = lerpColor(from, to, cell.progress);
        needsRedraw = true;
      }
    });

    if (needsRedraw) draw();
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchRef.current >= glitchSpeed) {
      updateLetters();
      draw();
      lastGlitchRef.current = now;
    }

    smoothStep();
    animationRef.current = window.requestAnimationFrame(animate);
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initLetters(columns, rows);
    draw();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    resize();
    animate();

    const onResize = () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      resize();
      animate();
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth, characters]);

  return (
    <div style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && (
        <div
          style={{
            ...vignetteStyle,
            background: "radial-gradient(circle, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 1) 100%)",
          }}
        />
      )}
      {centerVignette && (
        <div
          style={{
            ...vignetteStyle,
            background:
              "radial-gradient(circle, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0.78) 100%)",
          }}
        />
      )}
    </div>
  );
}
