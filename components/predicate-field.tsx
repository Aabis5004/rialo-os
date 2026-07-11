"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; heat: number; phase: number };

export function PredicateField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    const GAP = 38;
    const LINK = 54;
    const RADIUS = 130;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          pts.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            heat: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(cv);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    let sparkAt = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (now > sparkAt && pts.length) {
        sparkAt = now + 900 + Math.random() * 1400;
        const seed = pts[(Math.random() * pts.length) | 0];
        seed.heat = 1;
      }

      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < RADIUS) {
          const target = 1 - d / RADIUS;
          if (target > p.heat) p.heat = target;
        }
        p.heat = Math.max(0, p.heat - dt * 0.7);
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        if (a.heat < 0.05) continue;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          if (dx > LINK || dx < -LINK) continue;
          const dy = a.y - b.y;
          if (dy > LINK || dy < -LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;

          if (a.heat > 0.35 && b.heat < a.heat * 0.75) {
            b.heat = Math.min(1, b.heat + a.heat * dt * 1.4);
          }

          const o = Math.min(a.heat, Math.max(b.heat, 0.12)) * 0.5;
          ctx.strokeStyle = `rgba(232,163,61,${o})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of pts) {
        const t = now / 1000;
        const bob = Math.sin(t * 0.5 + p.phase) * 0.4;
        const r = 0.9 + p.heat * 2.4;

        if (p.heat > 0.02) {
          ctx.fillStyle = `rgba(255,216,155,${p.heat * 0.16})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y + bob, r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        const base = 0.1 + p.heat * 0.9;
        ctx.fillStyle = p.heat > 0.1
          ? `rgba(255,216,155,${base})`
          : `rgba(156,150,138,${base})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y + bob, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
