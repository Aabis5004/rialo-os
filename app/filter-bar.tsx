import Link from "next/link";

export function FilterBar({
  categories,
  active,
}: {
  categories: string[];
  active?: string;
}) {
  const pill = "rounded-full border px-3.5 py-1.5 text-xs transition-colors";
  const on = "border-neutral-400 bg-neutral-100 text-neutral-900";
  const off = "border-neutral-800 text-neutral-400 hover:border-neutral-600";

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
