import { getAllFilms } from "@/lib/films";
import { CatalogueClient } from "./catalogue-client";

export const revalidate = 60;

export default async function CataloguePage() {
  const films = await getAllFilms();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gold-gradient">Catalogue</span>
        </h1>
        <p className="mt-2 max-w-2xl text-white/60">
          Explorez l'intégralité de notre cinémathèque africaine. Filtrez par pays,
          genre, année ou type d'accès.
        </p>
      </header>
      <CatalogueClient films={films} />
    </div>
  );
}
