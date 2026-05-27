"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { CloudinaryUpload } from "./cloudinary-upload";
import { GENRES, ORIGINS, slugify } from "@/lib/slug";

export type SeriesFormData = {
  id?: string;
  title?: string;
  slug?: string;
  synopsis?: string;
  origin?: string;
  genre?: string;
  seasons?: number;
  isPremium?: boolean;
  thumbnailUrl?: string;
  backdropUrl?: string | null;
  rating?: number;
};

export function SeriesForm({ initial }: { initial?: SeriesFormData }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

  const isEdit = !!initial?.id;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    form.forEach((v, k) => (body[k] = v));
    body.isPremium = form.get("isPremium") === "on";
    body.seasons = Number(body.seasons || 1);
    body.rating = Number(body.rating || 0);

    start(async () => {
      const res = await fetch(
        isEdit ? `/api/admin/series/${initial!.id}` : "/api/admin/series",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur");
        return;
      }
      router.push("/admin/series");
      router.refresh();
    });
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("Supprimer cette série et ses épisodes ?")) return;
    const res = await fetch(`/api/admin/series/${initial!.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/series");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Titre"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
        <Field
          label="Slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
        />
      </div>

      <Textarea label="Synopsis" name="synopsis" rows={4} required defaultValue={initial?.synopsis} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Select label="Origine" name="origin" required defaultValue={initial?.origin ?? ""} options={[...ORIGINS]} />
        <Select label="Genre" name="genre" required defaultValue={initial?.genre ?? ""} options={[...GENRES]} />
        <Field label="Saisons" name="seasons" type="number" min={1} defaultValue={initial?.seasons ?? 1} />
        <Field label="Note (0-10)" name="rating" type="number" step="0.1" min={0} max={10} defaultValue={initial?.rating ?? 0} />
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isPremium" defaultChecked={initial?.isPremium} className="h-4 w-4 accent-gold" />
        <span className="text-sm text-white/80">Premium uniquement</span>
      </label>

      <CloudinaryUpload name="thumbnailUrl" label="Thumbnail (portrait)" defaultValue={initial?.thumbnailUrl} />
      <CloudinaryUpload name="backdropUrl" label="Backdrop (paysage)" defaultValue={initial?.backdropUrl ?? ""} />

      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}

      <div className="flex justify-between border-t border-white/5 pt-5">
        {isEdit && (
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        )}
        <button type="submit" disabled={pending} className="ml-auto inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Créer la série"}
        </button>
      </div>
    </form>
  );
}

function Field(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <input {...rest} className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60" />
    </label>
  );
}

function Textarea(props: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <textarea {...rest} className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60" />
    </label>
  );
}

function Select(props: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { label, options, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <select {...rest} className="w-full rounded-md border border-white/10 bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold/60">
        <option value="">— Sélectionner —</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </label>
  );
}
