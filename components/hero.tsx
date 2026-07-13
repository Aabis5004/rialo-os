import Link from "next/link";
import { HeroCanvas } from "./hero-canvas";

export function Hero({ live, total }: { live: number; total: number }) {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden border-b border-edge">
      <div className="absolute inset-0 opacity-90"><HeroCanvas /></div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(130% 90% at 30% 20%, transparent 30%, #060608 90%)" }} />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6">
        <div style={{ animation: "rise .9s var(--ease-out-quint) both" }}>
          <span className="eyebrow">The real-world blockchain</span>
        </div>
        <h1 className="mt-7 max-w-3xl text-5xl font-medium leading-[1.04] tracking-[-0.04em] text-bone sm:text-7xl" style={{ animation: "rise 1s var(--ease-out-quint) .1s both" }}>
          Where the real world
          <br />
          meets the chain.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash" style={{ animation: "rise 1s var(--ease-out-quint) .2s both" }}>
          Rialo pulls live data, web calls, and real-world events onchain natively. No bots. No bridges. No glue.
        </p>
        <div className="mt-11 flex flex-wrap items-center gap-3" style={{ animation: "rise 1s var(--ease-out-quint) .3s both" }}>
          <Link href="/map" className="group rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]">
            Explore the ecosystem
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <a href="#problem" className="rounded-full border border-edge px-6 py-3 text-sm text-ash transition-colors hover:border-edge-lit hover:text-bone">
            {total} demos · {live} live
          </a>
        </div>
      </div>
    </section>
  );
}
