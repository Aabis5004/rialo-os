import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Start building on Rialo — Rialo OS",
  description:
    "How to get access to Rialo, what you can build on DevNet, and where the network is on the path to mainnet.",
};

const STEPS = [
  {
    n: "01",
    title: "Understand what Rialo is",
    body: "Rialo is an event-driven Layer 1 by Subzero Labs. Smart contracts make one-line HTTPS calls to real-world APIs, react to events automatically, and run without external bots. It is VM-flexible — RISC-V and Solana VM compatible — so existing programs port over.",
    action: { label: "Read the papers", href: "https://rialo.io" },
  },
  {
    n: "02",
    title: "Join the waitlist",
    body: "Access is invite-only. The DevNet is private and Subzero onboards developers directly ahead of the public launch. The way in is to join the waitlist and get on their radar — there is no self-serve signup yet.",
    action: { label: "Rialo.io", href: "https://rialo.io" },
  },
  {
    n: "03",
    title: "Get on the team's radar",
    body: "Beyond the waitlist, early builders get noticed through the community. Be active in the Discord, engage on X (@RialoHQ), and — most effectively — build something that shows you understand the chain. Demonstrated understanding beats a form submission.",
    action: { label: "Follow @RialoHQ", href: "https://x.com/RialoHQ" },
  },
  {
    n: "04",
    title: "Build on DevNet",
    body: "Once onboarded, DevNet lets you deploy and test smart contracts with no real economic risk. Connect on-chain logic to off-chain data via web hooks, use event-driven execution, and experiment with schedulers and native web calls before testnet or mainnet.",
    action: null,
  },
];

const STAGES = [
  { label: "Private DevNet", state: "live", note: "Invite-only. Live now for early builders." },
  { label: "Public Testnet", state: "next", note: "Opens after DevNet stabilizes. Not yet live." },
  { label: "Mainnet", state: "later", note: "Follows public testnet." },
];

export default function BuildPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32 pt-36">
      <Link href="/" className="text-sm text-ash transition-colors hover:text-bone">
        ← Ecosystem
      </Link>

      <div className="mt-10">
        <p className="eyebrow">Start here</p>
        <h1 className="mt-4 text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-bone">
          How to build on Rialo.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
          Rialo&apos;s DevNet is private and invite-only. Here is the honest path
          in, what you can do once you have access, and where the network stands
          on the way to mainnet.
        </p>
      </div>

      <div className="mt-16 space-y-px overflow-hidden rounded-2xl border border-edge bg-edge">
        {STEPS.map((s) => (
          <Reveal key={s.n}>
            <div className="bg-void p-8">
              <div className="flex items-start gap-6">
                <span className="font-[family-name:var(--font-geist-mono)] text-sm text-signal">
                  {s.n}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-bone">{s.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ash">{s.body}</p>
                  {s.action && (
                    <Link
                      href={s.action.href}
                      target="_blank"
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-edge px-4 py-2 text-sm text-ash transition-colors hover:border-edge-lit hover:text-bone"
                    >
                      {s.action.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20">
        <p className="eyebrow">Where the network is</p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight text-bone">
          The path to mainnet.
        </h2>
        <div className="mt-8 space-y-3">
          {STAGES.map((st) => (
            <div
              key={st.label}
              className="flex items-center gap-4 rounded-xl border border-edge bg-slate/40 p-5"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background:
                    st.state === "live" ? "#4ca97a" : st.state === "next" ? "#e8a33d" : "#5a564e",
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-bone">{st.label}</p>
                <p className="mt-0.5 text-sm text-ash">{st.note}</p>
              </div>
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-dust">
                {st.state === "live" ? "Live" : st.state === "next" ? "Next" : "Later"}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16 rounded-2xl border border-edge bg-slate/30 p-8">
        <p className="text-[15px] leading-relaxed text-ash">
          Have a question about how Rialo works before you apply?
        </p>
        <Link
          href="/ask"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
        >
          Ask Rialo →
        </Link>
      </Reveal>
    </main>
  );
}
