import "dotenv/config";
import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DATA = [
  { slug: "meridian", name: "Meridian", tagline: "Stablecoins with on-chain programmable compliance.", category: "Finance", status: "PRIVATE_TESTNET" },
  { slug: "guarded-vault", name: "Guarded Vault", tagline: "Multi-sig vault with time-locked withdrawals.", category: "Finance", status: "PRIVATE_TESTNET" },
  { slug: "ermac", name: "Ermac", tagline: "Event-driven automation engine for on-chain actions.", category: "Automation", status: "PRIVATE_TESTNET" },
  { slug: "project-1337", name: "Project 1337", tagline: "1,337 market tickers streamed on-chain every 300ms.", category: "Markets", status: "PRIVATE_TESTNET" },
  { slug: "subway-predict", name: "Subway Predict", tagline: "Predict subway arrival times and stake on outcomes.", category: "Markets", status: "IDEA" },
] as const;

async function main() {
  for (const row of DATA) {
    const category = await prisma.category.upsert({
      where: { slug: row.category.toLowerCase() },
      update: {},
      create: { name: row.category, slug: row.category.toLowerCase() },
    });

    await prisma.project.upsert({
      where: { slug: row.slug },
      update: {},
      create: {
        slug: row.slug,
        name: row.name,
        tagline: row.tagline,
        status: row.status,
        categoryId: category.id,
      },
    });
  }
  console.log("seeded");
}

main().finally(() => prisma.$disconnect());
