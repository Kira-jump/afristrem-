import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SeriesForm } from "@/components/admin/series-form";
import { CloudinaryScript } from "@/components/admin/cloudinary-upload";

export default function NewSeriesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <CloudinaryScript />
      <Link href="/admin/series" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">
        <span className="text-gold-gradient">Nouvelle</span> série
      </h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-elevated p-6 sm:p-8">
        <SeriesForm />
      </div>
    </div>
  );
}
