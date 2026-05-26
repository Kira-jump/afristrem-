"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilmCard } from "./film-card";
import type { FilmCard as Film } from "@/lib/films";

export function FilmRow({
  title,
  subtitle,
  films,
}: {
  title: string;
  subtitle?: string;
  films: Film[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.85;
    ref.current.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  if (!films.length) return null;

  return (
    <section className="group/section relative py-6">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
        </div>
        <div className="hidden gap-1 md:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Précédent"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:border-gold/40 hover:text-gold"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Suivant"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:border-gold/40 hover:text-gold"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6"
      >
        {films.map((f) => (
          <div key={f.id} className="snap-start">
            <FilmCard film={f} />
          </div>
        ))}
      </div>
    </section>
  );
}
