import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const perks = [
  "Accès illimité à tout le catalogue",
  "Qualité 4K HDR + audio Dolby",
  "Téléchargement hors-ligne",
  "Sans publicité",
  "Carte bancaire ou Mobile Money",
];

export function PremiumCTA() {
  return (
    <section className="relative mx-4 my-16 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-forest-900 via-bg to-bg p-8 shadow-gold sm:mx-6 sm:p-12">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-forest/30 blur-3xl" />

      <div className="relative grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> 7 jours offerts
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Tout le cinéma africain,
            <br />
            <span className="text-gold-gradient">gratuit pendant 7 jours.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Profitez de tout AfriStream sans payer un centime. Ensuite,
            <span className="font-semibold text-white"> 2,79 $/mois</span> (annuel) ou
            <span className="font-semibold text-white"> 3,99 $/mois</span>. Annulable
            à tout moment, même pendant l'essai.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-medium text-bg shadow-gold transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Commencer mon essai gratuit
            </Link>
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-white hover:bg-white/5"
            >
              Voir les plans
            </Link>
          </div>
        </div>

        <ul className="space-y-3">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-3 text-white/85">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-gold">
                <Check className="h-4 w-4" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
