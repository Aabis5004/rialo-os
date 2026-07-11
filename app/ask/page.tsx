"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What is a reactive transaction?",
  "What does a predicate reference?",
  "What does Rialo replace?",
];

export default function AskPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send(q: string) {
    if (!q.trim() || loading) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json();
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: data.answer ?? data.error ?? "Something went wrong." },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "Connection failed." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-8 pt-36">
      <Link href="/" className="text-sm text-ash transition-colors hover:text-bone">
        ← Ecosystem
      </Link>

      <div className="mt-10">
        <p className="eyebrow">Grounded assistant</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-bone">
          Ask Rialo
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ash">
          Answers only from Rialo&apos;s papers, with the source cited. If the
          papers don&apos;t cover it, it says so — it won&apos;t guess.
        </p>
      </div>

      <div className="mt-10 flex-1 space-y-5">
        {msgs.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-edge px-4 py-2 text-sm text-ash transition-colors hover:border-edge-lit hover:text-bone"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {msgs.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl bg-slate px-4 py-3 text-sm text-bone"
                  : "max-w-[85%] rounded-2xl border border-edge px-4 py-3 text-sm leading-relaxed text-ash"
              }
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-edge px-4 py-3 text-sm text-dust">
              Reading the papers…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-6 mt-6">
        <div className="flex gap-2 rounded-2xl border border-edge bg-ink/80 p-2 backdrop-blur">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about Rialo…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-dust focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={loading}
            className="rounded-xl bg-bone px-5 py-2 text-sm font-medium text-void transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Ask
          </button>
        </div>
      </div>
    </main>
  );
}
