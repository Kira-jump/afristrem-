"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { FilmCard } from "@/components/film-card";
import type { FilmCard as Film } from "@/lib/films";

type Access = "all" | "free" | "premium";

export function CatalogueClient({ films }: { films: Film[] }) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [access, setAccess] = useState<Access>("all");
  const [open, setOpen] = useState(false);

  const genres = useMemo(
    () => Array.from(new Set(films.map((f) => f.genre))).sort(),
    [films],
  );
  const origins = useMemo(
    () => Array.from(new Set(films.map((f) => f.origin))).sort(),
    [films],
  );
  const years = useMemo(
    () =>
      Array.from(new Set(films.map((f) => f.year)))
        .sort()
        .reverse(),
    [films],
  );

  const filtered = useMemo(() => {
    return films.filter((f) => {
      if (q && !`${f.title} ${f.synopsis} ${f.cast ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (genre && f.genre !== genre) return false;
      if (origin && f.origin !== origin) return false;
      if (year && String(f.year) !== year) return false;
      if (access === "free" && f.isPremium) return false;
      if (access === "premium" && !f.isPremium) return false;
      return true;
    });
  }, [films, q, genre, origin, year, access]);

  function reset() {
    setQ("");
    setGenre("");
    setOrigin("");
    setYear("");
    setAccess("all");
  }

  const hasFilters = q || genre || origin || year || access !== "all";

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-white/5 bg-bg/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un film, un réalisateur, un acteur..."
              className="w-full rounded-md border border-white/10 bg-elevated py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-elevated px-3 py-2.5 text-sm text-white/80 hover:border-gold/40"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </button>
          {hasFilters && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-white/60 hover:text-gold"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </button>
          )}
          <span className="ml-auto text-xs text-white/40">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {open && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select label="Genre" value={genre} onChange={setGenre} options={genres} />
            <Select label="Pays" value={origin} onChange={setOrigin} options={origins} />
            <Select label="Année" value={year} onChange={setYear} options={years.map(String)} />
            <div>
              <span className="mb-1 block text-xs text-white/60">Accès</span>
              <div className="flex gap-1 rounded-md border border-white/10 bg-elevated p-1">
                {(["all", "free", "premium"] as Access[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAccess(a)}
                    className={`flex-1 rounded px-2 py-1.5 text-xs transition ${
                      access === a
                        ? "bg-gold-gradient text-bg"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {a === "all" ? "Tout" : a === "free" ? "Gratuit" : "Premium"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-white/10 p-12 text-center">
          <p className="font-display text-xl text-white">Aucun résultat</p>
          <p className="mt-1 text-sm text-white/50">
            Essayez d'élargir vos filtres ou de modifier votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((f) => (
            <FilmCard key={f.id} film={f} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-elevated px-3 py-2 text-sm outline-none focus:border-gold/60"
      >
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
