import Link from "next/link";
import { Logo } from "./logo";

const cols = [
  {
    title: "Découvrir",
    links: [
      { href: "/catalogue", label: "Catalogue" },
      { href: "/catalogue?type=series", label: "Séries" },
      { href: "/catalogue?genre=Documentaire", label: "Documentaires" },
      { href: "/premium", label: "Abonnement Premium" },
    ],
  },
  {
    title: "AfriStream",
    links: [
      { href: "#", label: "À propos" },
      { href: "#", label: "Carrières" },
      { href: "#", label: "Presse" },
      { href: "#", label: "Producteurs" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "Centre d'aide" },
      { href: "#", label: "Contact" },
      { href: "#", label: "Statut" },
      { href: "#", label: "Appareils compatibles" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "#", label: "CGU" },
      { href: "#", label: "Confidentialité" },
      { href: "#", label: "Cookies" },
      { href: "#", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Le meilleur du cinéma et des séries d'Afrique, à portée d'écran.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 font-display text-sm uppercase tracking-wider text-gold">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-sm text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} AfriStream. Tous droits réservés.</p>
          <p>
            Fait avec <span className="text-gold">✦</span> pour le continent.
          </p>
        </div>
      </div>
    </footer>
  );
}
