import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { ProjectStatus } from "@/lib/types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  BUILDING: "Building",
  PRIVATE_TESTNET: "Private devnet",
  PUBLIC_TESTNET: "Public testnet",
  MAINNET: "Mainnet",
  LIVE: "Live",
  UPCOMING: "Upcoming",
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-t border-neutral-800 py-5">
      <dt className="text-xs uppercase tracking-wider text-neutral-600">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-neutral-300">
        {value ?? <span className="text-neutral-700">Not yet documented</span>}
      </dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
        ← Ecosystem
      </Link>

      <div className="mt-10 flex items-start justify-between gap-6">
        <h1 className="text-4xl font-medium tracking-tight">{project.name}</h1>
        <span className="mt-2 shrink-0 rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <p className="mt-4 text-lg leading-relaxed text-neutral-400">
        {project.tagline}
      </p>

      <dl className="mt-14">
        <Row label="Rialo primitive" value={project.primitive} />
        <Row label="Replaces" value={project.replaces} />
        <Row label="Category" value={project.category} />
        <Row label="Built by" value="Rialo" />
      </dl>

      <p className="mt-12 text-xs leading-relaxed text-neutral-600">
        Playground demo built by the Rialo team. Third-party ecosystem projects
        will appear here as public testnet opens.
      </p>
    </main>
  );
}
