import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewFilmPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
      <Link href="/dashboard/admin" className="text-sm text-white/60 hover:text-gold">
        ← Retour au dashboard
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold">
        <span className="text-gold-gradient">Ajouter</span> un film
      </h1>
      <p className="mt-2 text-white/60">
        Renseignez les informations puis téléversez le fichier vidéo (HLS .m3u8) et la
        miniature.
      </p>

      <form
        action="/api/films"
        method="POST"
        className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-elevated p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre" name="title" required />
          <Field label="Slug (URL)" name="slug" required placeholder="lor-de-bandiagara" />
        </div>
        <Textarea label="Synopsis" name="synopsis" rows={4} required />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Origine" name="origin" placeholder="Mali" required />
          <Field label="Genre" name="genre" placeholder="Drame" required />
          <Field label="Année" name="year" type="number" placeholder="2025" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Durée (min)" name="duration" type="number" required />
          <Field label="Note (0-10)" name="rating" type="number" step="0.1" />
          <label className="flex items-end gap-2 pb-2">
            <input type="checkbox" name="isPremium" className="h-4 w-4 accent-gold" />
            <span className="text-sm text-white/80">Contenu Premium</span>
          </label>
        </div>
        <Field label="Réalisateur" name="director" />
        <Field label="Casting" name="cast" placeholder="Acteur 1, Actrice 2" />
        <Field
          label="URL vidéo HLS (.m3u8 ou Mux playback)"
          name="videoUrl"
          required
          placeholder="https://stream.mux.com/<playback-id>.m3u8"
        />
        <Field label="Miniature (URL Cloudinary)" name="thumbnailUrl" required />
        <Field label="Backdrop (URL Cloudinary)" name="backdropUrl" />

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/dashboard/admin"
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold"
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60"
      />
    </label>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <textarea
        {...props}
        className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60"
      />
    </label>
  );
}
