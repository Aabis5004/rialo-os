export type ProjectStatus =
  | "IDEA"
  | "BUILDING"
  | "PRIVATE_TESTNET"
  | "PUBLIC_TESTNET"
  | "MAINNET";

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  website?: string;
  twitter?: string;
};
