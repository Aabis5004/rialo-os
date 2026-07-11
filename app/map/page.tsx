import Link from "next/link";
import { getGraph } from "@/lib/graph";
import { Graph } from "./graph";

export default async function MapPage() {
  const { nodes, links } = await getGraph();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
        ← Ecosystem
      </Link>

      <h1 className="mt-8 text-4xl font-medium tracking-tight">Ecosystem map</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-neutral-400">
        Every Rialo demo, the primitive it runs on, and who backs the chain.
        Orange edges show which apps depend on which primitive.
      </p>

      <div className="mt-6 flex gap-6 text-xs text-neutral-500">
        <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-neutral-50" />Project</span>
        <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />Primitive</span>
        <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-500" />Backer</span>
      </div>

      <div className="mt-8">
        <Graph nodes={nodes} links={links} />
      </div>
    </main>
  );
}
