import Link from "next/link";
import Image from "next/image";
import { Crown, ListVideo, Pencil, PlusCircle, Tv } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getAllSeries() {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await prisma.series.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { episodes: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminSeriesPage() {
  const series = await getAllSeries();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Séries <span className="text-white/40">({series.length})</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Gère les séries TV et leurs épisodes
          </p>
        </div>
        <Link
          href="/admin/series/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter une série
        </Link>
      </header>

      {series.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Tv className="h-10 w-10 text-white/30" />
          <p className="mt-4 font-display text-xl text-white">Aucune série</p>
          <p className="mt-1 text-sm text-white/50">
            Crée ta première série pour commencer.
          </p>
          <Link
            href="/admin/series/new"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold"
          >
            <PlusCircle className="h-4 w-4" />
            Créer une série
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {series.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-elevated p-4"
            >
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-white/10">
                <Image src={s.thumbnailUrl} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{s.title}</p>
                <p className="text-xs text-white/50">
                  {s.origin} · {s.genre} · {s.seasons} saison{s.seasons > 1 ? "s" : ""} ·{" "}
                  {s._count.episodes} épisode{s._count.episodes > 1 ? "s" : ""}
                </p>
              </div>
              {s.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
              <Link
                href={`/admin/series/${s.id}/episodes`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-bg px-3 py-1.5 text-xs text-white/80 hover:border-gold/40 hover:text-gold"
              >
                <ListVideo className="h-3 w-3" />
                Épisodes
              </Link>
              <Link
                href={`/admin/series/${s.id}/edit`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-bg px-3 py-1.5 text-xs text-white/80 hover:border-gold/40 hover:text-gold"
              >
                <Pencil className="h-3 w-3" />
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
