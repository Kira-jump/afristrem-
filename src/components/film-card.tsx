import Link from "next/link";
import Image from "next/image";
import { Crown, Play, Star } from "lucide-react";
import type { FilmCard as Film } from "@/lib/films";
import { formatDuration } from "@/lib/utils";

export function FilmCard({ film, size = "md" }: { film: Film; size?: "sm" | "md" | "lg" }) {
  const dims =
    size === "lg"
      ? "w-64 sm:w-72"
      : size === "sm"
      ? "w-40 sm:w-44"
      : "w-48 sm:w-56";

  return (
    <Link
      href={`/film/${film.slug}`}
      className={`group relative shrink-0 ${dims} overflow-hidden rounded-xl border border-white/5 bg-elevated transition hover:border-gold/40 hover:shadow-gold`}
    >
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={film.thumbnailUrl}
          alt={film.title}
          fill
          sizes="(max-width:640px) 50vw, 280px"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-90" />
        {film.isPremium && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-semibold text-bg shadow-gold">
            <Crown className="h-3 w-3" /> Premium
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-bg shadow-gold">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 font-display text-sm font-semibold text-white">
          {film.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>
            {film.origin} · {film.year}
          </span>
          <span className="inline-flex items-center gap-1 text-gold">
            <Star className="h-3 w-3 fill-current" />
            {film.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-[11px] text-white/40">{formatDuration(film.duration)}</p>
      </div>
    </Link>
  );
}
