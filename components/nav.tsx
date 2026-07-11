"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Ecosystem" },
  { href: "/map", label: "Map" },
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
          ? "border-b border-edge bg-void/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-signal" />
          <span className="text-sm font-medium tracking-tight text-bone">
            Rialo OS
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ash transition-colors hover:text-bone"
            >
              {l.label}
            </Link>
          ))}
          
          <a
            href="https://rialo.io"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-edge px-4 py-1.5 text-sm text-ash transition-colors hover:border-edge-lit hover:text-bone"
          >
            rialo.io
          </a>
        </div>
      </nav>
    </header>
  );
}
