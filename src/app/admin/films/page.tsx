import Link from "next/link";
import Image from "next/image";
import { Crown, Pencil, PlusCircle } from "lucide-react";
import { getAllFilms } from "@/lib/films";

export const dynamic = "force-dynamic";

export default async function AdminFilmsPage() {
  const films = await getAllFilms();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Films <span className="text-white/40">({films.length})</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Gère le catalogue de longs-métrages
          </p>
        </div>
        <Link
          href="/admin/films/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter un film
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-elevated">
        <div className="hidden grid-cols-[80px_1fr_140px_140px_100px_80px] gap-4 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-wider text-white/50 md:grid">
          <span></span>
          <span>Titre</span>
          <span>Pays</span>
          <span>Genre</span>
          <span>Accès</span>
          <span className="text-right">Action</span>
        </div>
        <ul className="divide-y divide-white/5">
          {films.map((f) => (
            <li key={f.id} className="px-4 py-3 hover:bg-white/5">
              <div className="grid grid-cols-[64px_1fr] gap-3 md:grid-cols-[80px_1fr_140px_140px_100px_80px] md:items-center md:gap-4">
                <div className="relative aspect-[2/3] w-16 overflow-hidden rounded-md border border-white/10 md:w-20">
                  <Image
                    src={f.thumbnailUrl}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{f.title}</p>
                  <p className="truncate text-xs text-white/40">
                    {f.year} · {f.director ?? "—"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60 md:hidden">
                    <span>{f.origin}</span>
                    <span>·</span>
                    <span>{f.genre}</span>
                    {f.isPremium && (
                      <span className="inline-flex items-center gap-1 text-gold">
                        <Crown className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>
                </div>
                <span className="hidden text-sm text-white/70 md:inline">
                  {f.origin}
                </span>
                <span className="hidden text-sm text-white/70 md:inline">
                  {f.genre}
                </span>
                <span className="hidden md:inline">
                  {f.isPremium ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  ) : (
                    <span className="rounded-full bg-forest/20 px-2 py-0.5 text-xs text-forest-100">
                      Gratuit
                    </span>
                  )}
                </span>
                <div className="col-span-2 mt-2 flex justify-end md:col-span-1 md:mt-0">
                  <Link
                    href={`/admin/films/${f.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-bg px-3 py-1.5 text-xs text-white/80 hover:border-gold/40 hover:text-gold"
                  >
                    <Pencil className="h-3 w-3" />
                    Modifier
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
