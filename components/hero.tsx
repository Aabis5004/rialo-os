import Link from "next/link";
import { PredicateField } from "./predicate-field";

export function Hero({ live, total }: { live: number; total: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-edge">
      <div className="absolute inset-0 opacity-70">
        <PredicateField />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 40%, #08080a 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-44">
        <p className="eyebrow">Independent ecosystem map</p>

        <h1 className="mt-7 max-w-3xl text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-bone sm:text-7xl">
          The map of what
          <br />
          Rialo actually is.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash">
          Every demo, the primitive it runs on, and the offchain service it
          deletes.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-3">
          <Link
            href="/map"
            className="group rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            Explore the map
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          
          <a
            href="#ecosystem"
            className="rounded-full border border-edge px-6 py-3 text-sm text-ash transition-colors hover:border-edge-lit hover:text-bone"
          >
            {total} projects · {live} live
          </a>
        </div>

        <p className="mt-16 max-w-md text-xs leading-relaxed text-dust">
          Each point is a predicate. Move your cursor — the ones near it evaluate
          true, and the result propagates. That is how Rialo executes.
        </p>
      </div>
    </section>
  );
}
