import { prisma } from "./db";
import { Project } from "./types";

export async function getCategories(): Promise<string[]> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });
  return rows.map((c) => c.name);
}

export async function getProjects(category?: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: category ? { category: { name: category } } : undefined,
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } },
  });

  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category.name,
    status: p.status,
    website: p.website ?? undefined,
    twitter: p.twitter ?? undefined,
  }));
}
