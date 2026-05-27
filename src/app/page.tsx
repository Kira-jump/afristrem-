import { Hero } from "@/components/hero";
import { FilmRow } from "@/components/film-row";
import { PremiumCTA } from "@/components/premium-cta";
import { getAllFilms, getFeaturedFilm } from "@/lib/films";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedFilm(), getAllFilms()]);
  const trending = [...all].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div className="pb-24">
      {featured && <Hero film={featured} />}

      <div className="relative -mt-24">
        <FilmRow title="À la une" films={trending} />
      </div>

      <PremiumCTA />
    </div>
  );
}
