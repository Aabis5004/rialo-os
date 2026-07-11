import { prisma } from "./db";

export type GraphNode = {
  id: string;
  label: string;
  type: "PROJECT" | "PRIMITIVE" | "BACKER";
  slug: string;
  category?: string;
  tagline?: string;
  replaces?: string;
  logoUrl?: string;
};

export type GraphLink = {
  source: string;
  target: string;
  kind: "USES" | "BACKS";
};

export async function getGraph(): Promise<{
  nodes: GraphNode[];
  links: GraphLink[];
}> {
  const [nodes, edges, projects] = await Promise.all([
    prisma.node.findMany(),
    prisma.edge.findMany(),
    prisma.project.findMany({
      select: {
        slug: true,
        tagline: true,
        replaces: true,
        logoUrl: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const meta = new Map(projects.map((p) => [p.slug, p]));

  return {
    nodes: nodes.map((n) => {
      const m = meta.get(n.slug);
      return {
        id: n.id,
        label: n.label,
        type: n.type,
        slug: n.slug,
        category: m?.category.name ?? undefined,
        tagline: m?.tagline ?? undefined,
        replaces: m?.replaces ?? undefined,
        logoUrl: m?.logoUrl ?? undefined,
      };
    }),
    links: edges.map((e) => ({
      source: e.sourceId,
      target: e.targetId,
      kind: e.kind,
    })),
  };
}
