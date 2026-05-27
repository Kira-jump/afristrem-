import Link from "next/link";
import { Sparkles } from "lucide-react";

export function PremiumCTA() {
  return (
    <section className="mx-4 mt-20 sm:mx-6">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-forest-900 via-bg to-bg p-8 text-center shadow-gold sm:p-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-forest/30 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> 7 jours offerts
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Tout AfriStream,
            <br />
            <span className="text-gold-gradient">gratuit pendant 7 jours.</span>
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Sans carte · Annulable à tout moment
          </p>
          <Link
            href="/auth/register"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-medium text-bg shadow-gold transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Démarrer mon essai
          </Link>
        </div>
      </div>
    </section>
  );
}
