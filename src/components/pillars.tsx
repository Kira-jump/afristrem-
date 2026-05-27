import { Globe2, ShieldOff, Smartphone, Download } from "lucide-react";

const pillars = [
  {
    icon: Globe2,
    title: "Toute l'Afrique, en un seul écran",
    body: "Du Sénégal au Caire, de Lagos à Kigali — fiction, séries, documentaires, en VO sous-titrée.",
  },
  {
    icon: ShieldOff,
    title: "Zéro publicité",
    body: "Aucune coupure pub, jamais. Le film commence quand tu cliques, et continue jusqu'au générique.",
  },
  {
    icon: Smartphone,
    title: "Payez comme vous voulez",
    body: "Carte bancaire pour la diaspora · Orange Money, MTN MoMo, M-Pesa, Wave pour l'Afrique.",
  },
  {
    icon: Download,
    title: "Hors-ligne, partout",
    body: "Téléchargez jusqu'à 25 titres et regardez sans connexion — métro, bus, brousse, avion.",
  },
];

export function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-white/5 bg-elevated p-5 transition hover:border-gold/30"
          >
            <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-gold/10 text-gold">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">
              {p.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
