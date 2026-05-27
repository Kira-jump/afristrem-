"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { CloudinaryUpload } from "./cloudinary-upload";
import { GENRES, ORIGINS, slugify } from "@/lib/slug";

export type FilmFormData = {
  id?: string;
  title?: string;
  slug?: string;
  synopsis?: string;
  origin?: string;
  genre?: string;
  year?: number;
  duration?: number;
  isPremium?: boolean;
  videoUrl?: string;
  trailerUrl?: string | null;
  thumbnailUrl?: string;
  backdropUrl?: string | null;
  rating?: number;
  cast?: string | null;
  director?: string | null;
};

export function FilmForm({ initial }: { initial?: FilmFormData }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

  const isEdit = !!initial?.id;

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    form.forEach((value, key) => {
      body[key] = value;
    });
    body.isPremium = form.get("isPremium") === "on";
    body.year = Number(body.year);
    body.duration = Number(body.duration);
    body.rating = Number(body.rating || 0);

    start(async () => {
      const res = await fetch(
        isEdit ? `/api/admin/films/${initial!.id}` : "/api/admin/films",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur lors de la sauvegarde");
        return;
      }
      router.push("/admin/films");
      router.refresh();
    });
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("Supprimer ce film ? Cette action est définitive.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/films/${initial!.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (res.ok) {
      router.push("/admin/films");
      router.refresh();
    } else {
      setError("Échec de la suppression");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Titre"
          name="title"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Field
          label="Slug (URL)"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="auto-généré"
        />
      </div>

      <Textarea label="Synopsis" name="synopsis" rows={4} required defaultValue={initial?.synopsis} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Pays d'origine"
          name="origin"
          required
          defaultValue={initial?.origin ?? ""}
          options={[...ORIGINS]}
        />
        <Select
          label="Genre"
          name="genre"
          required
          defaultValue={initial?.genre ?? ""}
          options={[...GENRES]}
        />
        <Field
          label="Année"
          name="year"
          type="number"
          min={1900}
          max={2100}
          required
          defaultValue={initial?.year}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Durée (min)"
          name="duration"
          type="number"
          min={1}
          required
          defaultValue={initial?.duration}
        />
        <Field
          label="Note (0-10)"
          name="rating"
          type="number"
          step="0.1"
          min={0}
          max={10}
          defaultValue={initial?.rating ?? 0}
        />
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            name="isPremium"
            defaultChecked={initial?.isPremium}
            className="h-4 w-4 accent-gold"
          />
          <span className="text-sm text-white/80">Contenu Premium uniquement</span>
        </label>
      </div>

      <Field label="Réalisateur" name="director" defaultValue={initial?.director ?? ""} />
      <Field
        label="Casting (séparé par des virgules)"
        name="cast"
        defaultValue={initial?.cast ?? ""}
      />

      <Field
        label="URL vidéo HLS (.m3u8 ou Mux playback)"
        name="videoUrl"
        required
        placeholder="https://stream.mux.com/<playback-id>.m3u8"
        defaultValue={initial?.videoUrl}
      />
      <Field
        label="URL bande-annonce (optionnel)"
        name="trailerUrl"
        defaultValue={initial?.trailerUrl ?? ""}
      />

      <CloudinaryUpload
        name="thumbnailUrl"
        label="Thumbnail (portrait 2:3)"
        defaultValue={initial?.thumbnailUrl}
      />
      <CloudinaryUpload
        name="backdropUrl"
        label="Backdrop (paysage 16:9, optionnel)"
        defaultValue={initial?.backdropUrl ?? ""}
      />

      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting || pending}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Publier le film"}
        </button>
      </div>
    </form>
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

function Select({
  label,
  options,
  ...props
}: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <select
        {...props}
        className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60"
      >
        <option value="">— Sélectionner —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
