import Link from "next/link";

export function FilterBar({
  categories,
  active,
}: {
  categories: string[];
  active?: string;
}) {
  const pill = "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300";
  const on = "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(255,99,33,0.2)]";
  const off = "glass-panel text-ash hover:text-bone hover:border-accent/50";

  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <Link href="/" className={`${pill} ${!active ? on : off}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c}
          href={`/?category=${encodeURIComponent(c)}`}
          className={`${pill} ${active === c ? on : off}`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
