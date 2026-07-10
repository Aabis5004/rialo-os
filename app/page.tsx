import { getProjects } from "@/lib/projects";
import { ProjectStatus } from "@/lib/types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  BUILDING: "Building",
  PRIVATE_TESTNET: "Private devnet",
  PUBLIC_TESTNET: "Public testnet",
  MAINNET: "Mainnet",
};

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-medium tracking-tight">Rialo OS</h1>
      <p className="mt-3 text-neutral-400">
        The operating system for the Rialo ecosystem.
      </p>

      <div className="mt-14 flex items-baseline justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500">
          Ecosystem
        </h2>
        <span className="text-sm text-neutral-500">
          {projects.length} projects
        </span>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 transition-colors hover:border-neutral-600"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium">{p.name}</h3>
              <span className="shrink-0 rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs text-neutral-400">
                {STATUS_LABEL[p.status]}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {p.tagline}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-neutral-600">
              {p.category}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
