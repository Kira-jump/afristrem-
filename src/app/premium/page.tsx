import Link from "next/link";
import { Check, Crown, CreditCard, Smartphone } from "lucide-react";

const plans = [
  {
    id: "monthly",
    name: "Mensuel",
    price: "3,99 $",
    period: "/ mois",
    note: "Sans engagement",
    perks: [
      "Catalogue Premium illimité",
      "Qualité HD",
      "Téléchargement hors-ligne",
      "Sans publicité",
    ],
    highlight: false,
  },
  {
    id: "yearly",
    name: "Annuel",
    price: "2,79 $",
    period: "/ mois",
    note: "Soit 33,49 $ /an — économisez 30%",
    perks: [
      "Tout du plan mensuel",
      "Qualité 4K HDR",
      "Audio Dolby",
      "2 mois offerts",
      "Accès prioritaire aux avant-premières",
    ],
    highlight: true,
  },
];

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
          <Crown className="h-3.5 w-3.5" /> AfriStream Premium
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
          Choisissez votre <span className="text-gold-gradient">plan</span>
        </h1>
        <p className="mt-3 text-white/70">
          7 jours gratuits. Sans engagement. Annulable en un clic.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative overflow-hidden rounded-2xl border p-8 transition ${
              plan.highlight
                ? "border-gold/40 bg-gradient-to-br from-forest-900/60 via-elevated to-elevated shadow-gold"
                : "border-white/10 bg-elevated"
            }`}
          >
            {plan.highlight && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-semibold uppercase text-bg">
                <Crown className="h-3 w-3" /> Recommandé
              </span>
            )}
            <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white">{plan.price}</span>
              <span className="text-white/60">{plan.period}</span>
            </p>
            <p className="mt-1 text-sm text-white/50">{plan.note}</p>

            <ul className="mt-6 space-y-3">
              {plan.perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <Link
              href={`/api/checkout?plan=${plan.id}`}
              className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                plan.highlight
                  ? "bg-gold-gradient text-bg shadow-gold hover:brightness-110"
                  : "border border-white/15 text-white hover:bg-white/10"
              }`}
            >
              <Crown className="h-4 w-4" />
              S'abonner
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-elevated p-6">
          <CreditCard className="h-6 w-6 text-gold" />
          <h3 className="mt-3 font-display text-lg font-semibold">Diaspora — Carte bancaire</h3>
          <p className="mt-1 text-sm text-white/60">
            Paiement sécurisé par Stripe. Visa, Mastercard, Amex, Apple Pay, Google Pay.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-elevated p-6">
          <Smartphone className="h-6 w-6 text-gold" />
          <h3 className="mt-3 font-display text-lg font-semibold">Afrique — Mobile Money</h3>
          <p className="mt-1 text-sm text-white/60">
            Paiement via Flutterwave : Orange Money, MTN MoMo, M-Pesa, Wave, Moov Money.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Questions fréquentes</h2>
        <div className="mt-4 space-y-3">
          {[
            {
              q: "Puis-je annuler à tout moment ?",
              a: "Oui. L'abonnement se résilie en un clic depuis votre espace compte. Vous gardez l'accès jusqu'à la fin de la période payée.",
            },
            {
              q: "Le paiement Mobile Money fonctionne-t-il dans tous les pays ?",
              a: "Flutterwave couvre 30+ pays africains : Sénégal, Côte d'Ivoire, Nigeria, Ghana, Cameroun, Kenya, RDC, etc.",
            },
            {
              q: "Combien d'écrans en simultané ?",
              a: "Jusqu'à 2 écrans en simultané sur le plan mensuel, 4 sur le plan annuel.",
            },
            {
              q: "Le téléchargement hors-ligne est-il disponible ?",
              a: "Oui, jusqu'à 25 titres téléchargeables sur mobile pour les abonnés Premium.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-white/10 bg-elevated p-4 open:border-gold/30"
            >
              <summary className="cursor-pointer list-none font-medium text-white">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-white/60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
