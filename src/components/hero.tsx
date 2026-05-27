import Image from "next/image";
import Link from "next/link";
import { Info, Play, Sparkles, Star } from "lucide-react";
import type { FilmCard as Film } from "@/lib/films";
import { formatDuration } from "@/lib/utils";
import { getAccessState, safeGetSession } from "@/lib/access";

export async function Hero({ film }: { film: Film }) {
  const session = await safeGetSession();
  const access = getAccessState(session);

  return (
    <section className="relative isolate min-h-[88vh] w-full overflow-hidden">
      <Image
        src={film.backdropUrl ?? film.thumbnailUrl}
        alt={film.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-fade-bottom" />
      <div className="absolute inset-0 bg-fade-left" />
      <div className="absolute inset-0 bg-bg/30" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-bg/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          Film à la une
        </span>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          <span className="text-gold-gradient">{film.title}</span>
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-1 text-gold">
            <Star className="h-4 w-4 fill-current" /> {film.rating.toFixed(1)}
          </span>
          <span>{film.year}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{formatDuration(film.duration)}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="rounded-md border border-white/15 px-2 py-0.5 text-xs">
            {film.genre}
          </span>
          <span className="rounded-md border border-forest/40 bg-forest/20 px-2 py-0.5 text-xs text-forest-100">
            {film.origin}
          </span>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {film.synopsis}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {access.canWatch ? (
            <Link
              href={`/film/${film.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-medium text-bg shadow-gold transition hover:brightness-110"
            >
              <Play className="h-4 w-4 fill-current" />
              Regarder
            </Link>
          ) : (
            <Link
              href={access.isLogged ? "/premium" : "/auth/register"}
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-medium text-bg shadow-gold transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Essai gratuit 7 jours
            </Link>
          )}
          <Link
            href={`/film/${film.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-white backdrop-blur transition hover:bg-white/10"
          >
            <Info className="h-4 w-4" />
            Plus d'infos
          </Link>
        </div>

        {!access.isLogged && (
          <p className="mt-3 text-xs text-white/50">
            Sans engagement · Annulable à tout moment · Carte ou Mobile Money
          </p>
        )}
      </div>
    </section>
  );
}
