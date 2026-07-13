import Link from "next/link";
import { Hero } from "@/components/hero";
import { getProjects, getCategories } from "@/lib/projects";
import { ProjectStatus } from "@/lib/types";
import { FilterBar } from "./filter-bar";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  BUILDING: "Building",
  PRIVATE_TESTNET: "Private devnet",
  PUBLIC_TESTNET: "Public testnet",
  MAINNET: "Mainnet",
  LIVE: "Live",
  UPCOMING: "Upcoming",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [projects, categories] = await Promise.all([
    getProjects(category),
    getCategories(),
  ]);

  return (
    <main>
      <Hero live={projects.filter((p) => p.status === "LIVE").length} total={projects.length} />
      <div className="mx-auto max-w-5xl px-6 py-24" id="ecosystem">
      <h1 className="sr-only">Rialo OS</h1>

      <Link
        href="/map"
        className="mt-6 inline-flex items-center gap-2 rounded-full glass-panel px-5 py-2.5 text-sm font-semibold text-bone transition-all hover:bg-white/5 hover:text-white"
      >
        View ecosystem map →
      </Link>

      <div className="mt-14 flex items-baseline justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500">
          Ecosystem
        </h2>
        <span className="text-sm text-neutral-500">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      <FilterBar categories={categories} active={category} />

      {projects.length === 0 ? (
        <p className="mt-16 text-center text-sm text-neutral-500">
          No projects in this category yet.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="group glass-panel rounded-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href={`/projects/${p.slug}`} className="block p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-bone">{p.name}</h3>
                  <span className="shrink-0 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ash transition-colors group-hover:text-bone/90">
                  {p.tagline}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(255,99,33,1)] transition-all" />
                  <p className="text-xs uppercase tracking-wider text-dust group-hover:text-ash transition-colors">
                    {p.category}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </main>
  );
}
