"use client";

import { useEffect, useRef } from "react";

type Signal = {
  x: number; y: number; vx: number; vy: number;
  captured: boolean; snapY: number; pulse: number; label: string;
};

const LABELS = ["price", "api", "sms", "timer", "oracle", "event", "webhook", "score"];

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, spineX = 0;
    let signals: Signal[] = [];
    const mouse = { x: -9999, y: -9999 };

    const spawn = (): Signal => ({
      x: -40 - Math.random() * 200,
      y: 60 + Math.random() * (h - 120),
      vx: 0.4 + Math.random() * 0.5,
      vy: (Math.random() - 0.5) * 0.15,
      captured: false,
      snapY: 0,
      pulse: 0,
      label: LABELS[(Math.random() * LABELS.length) | 0],
    });

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spineX = w * 0.62;
      if (signals.length === 0) {
        for (let i = 0; i < 9; i++) {
          const s = spawn();
          s.x = Math.random() * spineX;
          signals.push(s);
        }
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(cv);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255, 99, 33, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(spineX, 30);
      ctx.lineTo(spineX, h - 30);
      ctx.stroke();
      for (let y = 50; y < h - 30; y += 34) {
        ctx.fillStyle = "rgba(255, 99, 33, 0.35)";
        ctx.fillRect(spineX - 1.5, y, 3, 3);
      }

      for (const s of signals) {
        if (!s.captured) {
          const dm = Math.hypot(s.x - mouse.x, s.y - mouse.y);
          const boost = dm < 120 ? 1.8 : 1;
          s.x += s.vx * boost;
          s.y += s.vy;

          if (s.x >= spineX - 60) {
            s.captured = true;
            s.snapY = s.y;
          }

          const prog = Math.min(1, s.x / spineX);
          ctx.fillStyle = `rgba(157,151,139,${0.3 + prog * 0.4})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          if (s.x > spineX - 160) {
            ctx.strokeStyle = `rgba(255, 99, 33, ${(s.x - (spineX - 160)) / 160 * 0.6})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(spineX, s.snapY || s.y);
            ctx.stroke();
          }

          ctx.fillStyle = `rgba(157,151,139,${0.25 + prog * 0.35})`;
          ctx.font = "10px ui-monospace, monospace";
          ctx.fillText(s.label, s.x + 6, s.y - 6);
        } else {
          s.pulse += 0.04;
          const glow = Math.max(0, Math.sin(s.pulse)) ;
          ctx.fillStyle = `rgba(255, 133, 79, ${0.4 + glow * 0.6})`;
          ctx.beginPath();
          ctx.arc(spineX, s.snapY, 3 + glow * 2, 0, Math.PI * 2);
          ctx.fill();
          if (s.pulse > Math.PI * 2.2) Object.assign(s, spawn());
        }
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

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
