import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Architecture — Rialo OS",
  description:
    "How Rialo OS is built today, and how it plugs into the chain when public testnet opens.",
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-edge py-16">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight text-bone">
        {title}
      </h2>
      <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ash">
        {children}
      </div>
    </Reveal>
  );
}

function Seam({ label, now, later }: { label: string; now: string; later: string }) {
  return (
    <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-edge bg-edge sm:grid-cols-2">
      <div className="bg-void p-5">
        <p className="eyebrow text-dust">Today</p>
        <p className="mt-2 text-sm text-ash">{now}</p>
      </div>
      <div className="bg-void p-5">
        <p className="eyebrow" style={{ color: "#e8a33d" }}>
          When testnet opens
        </p>
        <p className="mt-2 text-sm text-ash">{later}</p>
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32 pt-36">
      <Link href="/" className="text-sm text-ash transition-colors hover:text-bone">
        ← Ecosystem
      </Link>

      <div className="mt-10">
        <p className="eyebrow">Architecture</p>
        <h1 className="mt-4 text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-bone">
          Built to plug into the chain.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
          Rialo&apos;s DevNet is private. There is no public RPC, no public
          indexer, no token. Rather than fake the data that doesn&apos;t exist
          yet, Rialo OS is built so the chain layer drops in without a rewrite.
          This page is how.
        </p>
      </div>

      <Section eyebrow="Principle" title="Store facts. Derive everything else.">
        <p>
          Every relationship on this site is computed, not stored. A project
          links to a primitive because its <code className="text-bone">replaces</code>{" "}
          field names one — not because an edge was hand-drawn. Shared investors,
          shared categories, the entire bubble map: all derived from the same
          nine tables with a SQL join.
        </p>
        <p>
          This matters because derived data can never drift out of sync with the
          facts it comes from. Add a project, and its edges appear. There is no
          second place to update.
        </p>
      </Section>

      <Section
        eyebrow="The seam"
        title="Metrics are a time-series, waiting for a source."
      >
        <p>
          Project metrics — TVL, transaction counts — do not live on the project
          row. They live in an append-only{" "}
          <code className="text-bone">metric_snapshots</code> table, each row
          tagged with where it came from.
        </p>
        <p>
          Today every row reads <code className="text-bone">source = manual</code>.
          The day Rialo ships a public RPC, an indexer writes rows tagged{" "}
          <code className="text-bone">source = rialo-rpc</code> — and nothing
          else in the codebase changes. The pages already read through the
          function that reads the table.
        </p>
        <Seam
          label="metrics"
          now="Metrics entered by hand, tagged source=manual."
          later="An indexer inserts rows tagged source=rialo-rpc. Same table, same query, same page."
        />
      </Section>

      <Section
        eyebrow="The primitive"
        title="Grant milestones as reactive-transaction escrow."
      >
        <p>
          Rialo&apos;s reactive transactions let a predicate, evaluated by
          validators during block execution, trigger a transaction automatically
          — no keeper bot, no cron, no external watcher.
        </p>
        <p>
          Applied to this product: a grants portal where milestone funds are held
          in escrow and released when an on-chain predicate becomes true. &ldquo;Contract
          deployed to mainnet&rdquo; or &ldquo;100 unique callers reached&rdquo; becomes a
          condition the chain checks itself. No committee clicks approve. No bot
          watches for the event. The release is part of consensus.
        </p>
        <p>
          That is the difference between a grants dashboard and grants
          infrastructure. One shows you a status. The other enforces it.
        </p>
      </Section>

      <Section
        eyebrow="Agent keys"
        title="An assistant that never holds a raw credential."
      >
        <p>
          Rialo OS includes a grounded assistant that answers only from
          Rialo&apos;s papers. It calls a model API, which means it holds a key —
          and an agent holding a raw key is a leak waiting to happen.
        </p>
        <p>
          The right shape is a governed token: scoped to one model, rate-limited,
          logged, revocable in one click without rotating the real credential.
          That is exactly what Latch — from Subzero Labs, the team behind Rialo —
          exists to provide. The assistant is designed to hold its key through a
          governed token, not the key itself.
        </p>
      </Section>

      <Section eyebrow="Stack" title="What runs this today.">
        <p>
          Next.js on Vercel, server components reading Postgres through Prisma.
          Supabase hosts the database. The 3D map is force-directed WebGL. No
          separate backend, one deploy, one trust model.
        </p>
        <p>
          The whole thing is a database problem wearing a chain&apos;s clothes —
          which is precisely why it can exist before the chain is public, and
          why it will still be here when it isn&apos;t.
        </p>
      </Section>

      <div className="mt-16 border-t border-edge pt-10">
        <Link
          href="/map"
          className="inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
        >
          Explore the map →
        </Link>
      </div>
    </main>
  );
}
