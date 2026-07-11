import Link from "next/link";
import { getGraph } from "@/lib/graph";
import { Graph } from "./graph";

export default async function MapPage() {
  const { nodes, links } = await getGraph();

  return (
    <div className="relative h-full w-full">
      <Link
        href="/"
        className="absolute left-6 top-6 z-[110] flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
      >
        ← Back
      </Link>

      <div className="pointer-events-none absolute left-6 bottom-6 z-[110] flex gap-5 text-[11px] text-white/40">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#e8a33d]" />Primitive</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#d4a44c]" />Finance</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#4ca97a]" />Automation</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3fa8c4]" />Markets</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#5a7ee0]" />AI</span>
      </div>

      <Graph nodes={nodes} links={links} />
    </div>
  );
}
