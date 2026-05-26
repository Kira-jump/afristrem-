import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, Play, Sparkles, Star } from "lucide-react";
import { getFilmBySlug, getRelatedFilms } from "@/lib/films";
import { FilmRow } from "@/components/film-row";
import { HlsPlayer } from "@/components/hls-player";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessState } from "@/lib/access";
import { formatDuration } from "@/lib/utils";

export default async function FilmPage({
  params,
}: {
  params: { slug: string };
}) {
  const film = await getFilmBySlug(params.slug);
  if (!film) notFound();

  const session = await getServerSession(authOptions);
  const access = getAccessState(session);
  const related = await getRelatedFilms(film);

  return (
    <article className="pb-12">
      <div className="relative h-[55vh] w-full overflow-hidden">
        <Image
          src={film.backdropUrl ?? film.thumbnailUrl}
          alt={film.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-fade-bottom" />
      </div>

      <div className="relative -mt-40 px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[260px_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-48 overflow-hidden rounded-xl border border-white/10 shadow-gold sm:w-60 md:mx-0">
            <Image
              src={film.thumbnailUrl}
              alt={film.title}
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>

          <div className="pt-4 md:pt-12">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
              <span className="text-gold-gradient">{film.title}</span>
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1 text-gold">
                <Star className="h-4 w-4 fill-current" /> {film.rating.toFixed(1)}
              </span>
              <span>{film.year}</span>
              <span>{formatDuration(film.duration)}</span>
              <span className="rounded-md border border-white/15 px-2 py-0.5 text-xs">
                {film.genre}
              </span>
              <span className="rounded-md border border-forest/40 bg-forest/20 px-2 py-0.5 text-xs text-forest-100">
                {film.origin}
              </span>
            </div>

            <p className="mt-5 max-w-3xl text-white/80">{film.synopsis}</p>

            <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {film.director && (
                <div>
                  <dt className="text-white/50">Réalisation</dt>
                  <dd className="text-white">{film.director}</dd>
                </div>
              )}
              {film.cast && (
                <div>
                  <dt className="text-white/50">Casting</dt>
                  <dd className="text-white">{film.cast}</dd>
                </div>
              )}
              <div>
                <dt className="text-white/50">Origine</dt>
                <dd className="text-white">{film.origin}</dd>
              </div>
              <div>
                <dt className="text-white/50">Année</dt>
                <dd className="text-white">{film.year}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="mx-auto mt-12 max-w-5xl">
          {access.canWatch ? (
            <>
              <div className="mb-3 flex items-end justify-between">
                <h2 className="font-display text-2xl font-semibold">Lecture</h2>
                {access.trialActive && !access.isPremium && (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
                    Essai gratuit · J-{access.trialDaysLeft}
                  </span>
                )}
              </div>
              <HlsPlayer
                src={film.videoUrl}
                poster={film.backdropUrl ?? film.thumbnailUrl}
              />
            </>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-forest-900 via-bg to-bg p-8 text-center shadow-gold sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                <Lock className="h-3.5 w-3.5" /> Réservé aux abonnés
              </span>
              <h3 className="mt-4 font-display text-2xl">
                Regarde <span className="text-gold-gradient">{film.title}</span>
                <br />
                <span className="text-gold-gradient">gratuitement pendant 7 jours.</span>
              </h3>
              <p className="mt-2 text-white/70">
                Tout AfriStream — sans engagement, annulable à tout moment.
                Ensuite, à partir de <span className="font-semibold text-white">2,79 $/mois</span>.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {!access.isLogged ? (
                  <>
                    <Link
                      href={`/auth/register?callbackUrl=/film/${film.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold hover:brightness-110"
                    >
                      <Sparkles className="h-4 w-4" />
                      Commencer mon essai gratuit
                    </Link>
                    <Link
                      href={`/auth/login?callbackUrl=/film/${film.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm hover:bg-white/10"
                    >
                      J'ai déjà un compte
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/premium"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold hover:brightness-110"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Choisir mon abonnement
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <FilmRow title="Films similaires" films={related} />
        </div>
      )}
    </article>
  );
}
