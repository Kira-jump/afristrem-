import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FilmForm } from "@/components/admin/film-form";
import { CloudinaryScript } from "@/components/admin/cloudinary-upload";

export default function NewFilmPage() {
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
        <span className="text-gold-gradient">Nouveau</span> film
      </h1>
      <p className="mt-1 text-sm text-white/60">
        Renseigne les infos, ajoute la vidéo (via Mux ou URL HLS) et publie.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-elevated p-6 sm:p-8">
        <FilmForm />
      </div>
    </div>
  );
}
