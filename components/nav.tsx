"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Ecosystem" },
  { href: "/map", label: "Map" },
  { href: "/build", label: "Build" },
  { href: "/architecture", label: "Architecture" },
  { href: "/ask", label: "Ask" },
];

export function Nav() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const on = () => setLit(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        lit
          ? "border-b border-edge bg-void/85 backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_rgba(255,99,33,0.8)] transition-all group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(255,99,33,1)]" />
          <span className="text-[18px] font-bold tracking-tight text-bone">
            Rialo OS
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ash transition-colors hover:text-bone"
            >
              {l.label}
            </Link>
          ))}
          
          <a
            href="https://rialo.io"
            target="_blank"
            rel="noreferrer"
            className="glass-panel rounded-full px-5 py-2 text-sm font-semibold text-bone transition-all hover:bg-white/5"
          >
            rialo.io
          </a>
        </div>
      </nav>
    </header>
  );
}
