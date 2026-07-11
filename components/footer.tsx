import Link from "next/link";

const LINKS = [
  { href: "https://rialo.io", label: "Docs" },
  { href: "https://x.com/RialoHQ", label: "X" },
  { href: "https://github.com/rialo", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-bone">Rialo OS</p>
          <p className="mt-1.5 text-xs leading-relaxed text-dust">
            An independent map of the Rialo ecosystem. Not affiliated with Rialo
            Labs.
          </p>
        </div>
        <div className="flex gap-6 text-xs text-dust">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_blank"
              className="transition-colors hover:text-ash"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
