import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EpisodesManager } from "@/components/admin/episodes-manager";

export const dynamic = "force-dynamic";

export default async function EpisodesPage({ params }: { params: { id: string } }) {
  if (!process.env.DATABASE_URL) notFound();
  const series = await prisma.series.findUnique({
    where: { id: params.id },
    include: { episodes: { orderBy: [{ season: "asc" }, { episode: "asc" }] } },
  });
  if (!series) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/series" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Retour aux séries
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">
        Épisodes — <span className="text-gold-gradient">{series.title}</span>
      </h1>
      <p className="mt-1 text-sm text-white/60">
        {series.seasons} saison{series.seasons > 1 ? "s" : ""} ·{" "}
        {series.episodes.length} épisode{series.episodes.length > 1 ? "s" : ""}
      </p>

      <div className="mt-8">
        <EpisodesManager
          seriesId={series.id}
          seasons={series.seasons}
          episodes={series.episodes.map((e) => ({
            id: e.id,
            season: e.season,
            episode: e.episode,
            title: e.title,
            duration: e.duration,
            videoUrl: e.videoUrl,
            synopsis: e.synopsis,
          }))}
        />
      </div>
    </div>
  );
}
