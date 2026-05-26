import { prisma } from "./prisma";
import { getMockFilms, getMockFilmBySlug, type MockFilm } from "./mock-data";

export type FilmCard = MockFilm;

function dbAvailable() {
  return !!process.env.DATABASE_URL;
}

export async function getAllFilms(): Promise<FilmCard[]> {
  if (!dbAvailable()) return getMockFilms();
  try {
    const rows = await prisma.film.findMany({ orderBy: { createdAt: "desc" } });
    return rows as unknown as FilmCard[];
  } catch {
    return getMockFilms();
  }
}

export async function getFeaturedFilm(): Promise<FilmCard | null> {
  if (!dbAvailable()) return getMockFilms().find((f) => f.isFeatured) ?? getMockFilms()[0] ?? null;
  try {
    const row =
      (await prisma.film.findFirst({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
      })) ?? (await prisma.film.findFirst({ orderBy: { rating: "desc" } }));
    return (row as unknown as FilmCard) ?? null;
  } catch {
    return getMockFilms()[0] ?? null;
  }
}

export async function getFilmBySlug(slug: string): Promise<FilmCard | null> {
  if (!dbAvailable()) return getMockFilmBySlug(slug);
  try {
    const row = await prisma.film.findUnique({ where: { slug } });
    return (row as unknown as FilmCard) ?? null;
  } catch {
    return getMockFilmBySlug(slug);
  }
}

export async function getRelatedFilms(
  film: FilmCard,
  limit = 8,
): Promise<FilmCard[]> {
  const all = await getAllFilms();
  return all
    .filter((f) => f.id !== film.id && (f.genre === film.genre || f.origin === film.origin))
    .slice(0, limit);
}

export function groupByGenre(films: FilmCard[]) {
  const map = new Map<string, FilmCard[]>();
  for (const f of films) {
    const arr = map.get(f.genre) ?? [];
    arr.push(f);
    map.set(f.genre, arr);
  }
  return Array.from(map.entries()).map(([genre, items]) => ({ genre, items }));
}

export function groupByOrigin(films: FilmCard[]) {
  const map = new Map<string, FilmCard[]>();
  for (const f of films) {
    const arr = map.get(f.origin) ?? [];
    arr.push(f);
    map.set(f.origin, arr);
  }
  return Array.from(map.entries()).map(([origin, items]) => ({ origin, items }));
}
