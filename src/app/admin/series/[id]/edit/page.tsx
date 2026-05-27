import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SeriesForm, type SeriesFormData } from "@/components/admin/series-form";
import { CloudinaryScript } from "@/components/admin/cloudinary-upload";

export const dynamic = "force-dynamic";

export default async function EditSeriesPage({ params }: { params: { id: string } }) {
  if (!process.env.DATABASE_URL) notFound();
  const series = await prisma.series.findUnique({ where: { id: params.id } });
  if (!series) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <CloudinaryScript />
      <Link href="/admin/series" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">
        Modifier <span className="text-gold-gradient">{series.title}</span>
      </h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-elevated p-6 sm:p-8">
        <SeriesForm initial={series as unknown as SeriesFormData} />
      </div>
    </div>
  );
}
