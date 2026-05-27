const partners = [
  "FESPACO",
  "Nollywood",
  "Cannes",
  "Sundance",
  "Toronto",
  "African Movie Academy",
  "Carthage",
  "Durban",
];

export function PartnerStrip() {
  return (
    <section className="border-y border-white/5 bg-surface/40 py-8">
      <p className="mx-auto mb-5 max-w-6xl px-4 text-center text-xs uppercase tracking-[0.3em] text-white/40 sm:px-6">
        Films primés dans les plus grands festivals
      </p>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
        {partners.map((p) => (
          <span
            key={p}
            className="font-display text-base font-semibold tracking-wider text-white/30 transition hover:text-gold/70 sm:text-lg"
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}
