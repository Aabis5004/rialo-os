import { Project } from "./types";

const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "meridian",
    name: "Meridian",
    tagline: "Stablecoins with on-chain programmable compliance.",
    category: "Finance",
    status: "PRIVATE_TESTNET",
  },
  {
    id: "2",
    slug: "guarded-vault",
    name: "Guarded Vault",
    tagline: "Multi-sig vault with time-locked withdrawals.",
    category: "Finance",
    status: "PRIVATE_TESTNET",
  },
  {
    id: "3",
    slug: "ermac",
    name: "Ermac",
    tagline: "Event-driven automation engine for on-chain actions.",
    category: "Automation",
    status: "PRIVATE_TESTNET",
  },
  {
    id: "4",
    slug: "project-1337",
    name: "Project 1337",
    tagline: "1,337 market tickers streamed on-chain every 300ms.",
    category: "Markets",
    status: "PRIVATE_TESTNET",
  },
  {
    id: "5",
    slug: "subway-predict",
    name: "Subway Predict",
    tagline: "Predict subway arrival times and stake on outcomes.",
    category: "Markets",
    status: "IDEA",
  },
];

export async function getProjects(): Promise<Project[]> {
  return PROJECTS;
}
