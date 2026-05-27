import Link from "next/link";
import { Logo } from "./logo";

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/premium", label: "Premium" },
  { href: "#", label: "Aide" },
  { href: "#", label: "Légal" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <Logo />

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-white/60 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} AfriStream
        </p>
      </div>
    </footer>
  );
}
