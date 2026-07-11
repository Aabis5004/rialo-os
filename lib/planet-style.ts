export type PlanetStyle = {
  color: string;
  accent: string;
  radius: number;
  glow: number;
  ring: boolean;
  satellites: number;
  particles: number;
  labelColor: string;
  labelSize: number;
  texture: string | null;
};

const PRIMITIVE: PlanetStyle = {
  color: "#e8a33d",
  accent: "#ffd89b",
  radius: 13,
  glow: 0.14,
  ring: false,
  satellites: 0,
  particles: 0,
  labelColor: "#f5c26b",
  labelSize: 6.5,
  texture: null,
};

const BACKER: PlanetStyle = {
  color: "#4a453e",
  accent: "#4a453e",
  radius: 2.6,
  glow: 0,
  ring: false,
  satellites: 0,
  particles: 0,
  labelColor: "#4a453e",
  labelSize: 0,
  texture: null,
};

const BY_CATEGORY: Record<string, Partial<PlanetStyle>> = {
  Finance: {
    color: "#d4a44c",
    accent: "#f0d199",
    ring: true,
    glow: 0.1,
  },
  Automation: {
    color: "#4ca97a",
    accent: "#8fe3ba",
    satellites: 2,
    glow: 0.09,
  },
  Markets: {
    color: "#3fa8c4",
    accent: "#9fe0ef",
    particles: 14,
    glow: 0.09,
  },
  "AI Agents": {
    color: "#5a7ee0",
    accent: "#a8beff",
    ring: true,
    satellites: 1,
    glow: 0.12,
  },
};

const PROJECT_BASE: PlanetStyle = {
  color: "#f2ede1",
  accent: "#f2ede1",
  radius: 5.5,
  glow: 0.08,
  ring: false,
  satellites: 0,
  particles: 0,
  labelColor: "#a8a29e",
  labelSize: 4,
  texture: null,
};

export function planetStyle(node: {
  type: string;
  category?: string;
  logoUrl?: string;
}): PlanetStyle {
  if (node.type === "PRIMITIVE") return PRIMITIVE;
  if (node.type === "BACKER") return BACKER;

  const overrides = node.category ? BY_CATEGORY[node.category] ?? {} : {};
  return {
    ...PROJECT_BASE,
    ...overrides,
    texture: node.logoUrl ?? null,
  };
}
