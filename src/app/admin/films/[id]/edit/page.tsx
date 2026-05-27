import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMockFilms } from "@/lib/mock-data";
import { FilmForm, type FilmFormData } from "@/components/admin/film-form";
import { CloudinaryScript } from "@/components/admin/cloudinary-upload";

export const dynamic = "force-dynamic";

async function loadFilm(id: string): Promise<FilmFormData | null> {
  if (!process.env.DATABASE_URL) {
    const f = getMockFilms().find((m) => m.id === id);
    return f ? (f as FilmFormData) : null;
  }
  try {
    const f = await prisma.film.findUnique({ where: { id } });
    return f as unknown as FilmFormData | null;
  } catch {
    return null;
  }
}

export default async function EditFilmPage({ params }: { params: { id: string } }) {
  const film = await loadFilm(params.id);
  if (!film) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <CloudinaryScript />
      <Link
        href="/admin/films"
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux films
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">
        Modifier <span className="text-gold-gradient">{film.title}</span>
      </h1>

      <div className="mt-8 rounded-2xl border border-white/10 bg-elevated p-6 sm:p-8">
        <FilmForm initial={film} />
      </div>
    </div>
  );
}
