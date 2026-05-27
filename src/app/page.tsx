import { Hero } from "@/components/hero";
import { FilmRow } from "@/components/film-row";
import { PremiumCTA } from "@/components/premium-cta";
import {
  getAllFilms,
  getFeaturedFilm,
  groupByGenre,
  groupByOrigin,
} from "@/lib/films";

// Page dynamique (Hero lit la session pour adapter le CTA).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedFilm(), getAllFilms()]);

  const trending = [...all].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const newReleases = [...all].sort((a, b) => b.year - a.year).slice(0, 10);
  const byGenre = groupByGenre(all);
  const byOrigin = groupByOrigin(all);

  return (
    <div className="pb-12">
      {featured && <Hero film={featured} />}

      <div className="relative -mt-24 space-y-2">
        <FilmRow
          title="Tendances en ce moment"
          subtitle="Les films les plus regardés cette semaine"
          films={trending}
        />
        <FilmRow
          title="Nouveautés"
          subtitle="Fraîchement ajoutés au catalogue"
          films={newReleases}
        />

        <PremiumCTA />

        {byGenre.slice(0, 3).map(({ genre, items }) => (
          <FilmRow key={genre} title={genre} films={items} />
        ))}

        {byOrigin.slice(0, 4).map(({ origin, items }) => (
          <FilmRow
            key={origin}
            title={`Cinéma du ${origin}`}
            subtitle={`Le meilleur venu du ${origin}`}
            films={items}
          />
        ))}
      </div>
    </div>
  );
}
