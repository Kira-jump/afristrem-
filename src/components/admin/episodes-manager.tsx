"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Episode = {
  id: string;
  season: number;
  episode: number;
  title: string;
  duration: number;
  videoUrl: string;
  synopsis: string | null;
};

export function EpisodesManager({
  seriesId,
  seasons,
  episodes,
}: {
  seriesId: string;
  seasons: number;
  episodes: Episode[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    season: 1,
    episode: 1,
    title: "",
    duration: 0,
    videoUrl: "",
    synopsis: "",
  });
  const [error, setError] = useState<string | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await fetch(`/api/admin/series/${seriesId}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur");
        return;
      }
      setForm({ ...form, title: "", videoUrl: "", synopsis: "", episode: form.episode + 1 });
      router.refresh();
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet épisode ?")) return;
    await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const bySeason = new Map<number, Episode[]>();
  episodes.forEach((e) => {
    const arr = bySeason.get(e.season) ?? [];
    arr.push(e);
    bySeason.set(e.season, arr);
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-elevated p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Ajouter un épisode</h2>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-6">
          <label className="sm:col-span-1">
            <span className="mb-1 block text-xs text-white/60">Saison</span>
            <select
              value={form.season}
              onChange={(e) => setForm({ ...form, season: Number(e.target.value) })}
              className="w-full rounded-md border border-white/10 bg-bg px-2 py-2 text-sm outline-none"
            >
              {Array.from({ length: seasons }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>S{n}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-xs text-white/60">Épisode #</span>
            <input
              type="number"
              min={1}
              value={form.episode}
              onChange={(e) => setForm({ ...form, episode: Number(e.target.value) })}
              className="w-full rounded-md border border-white/10 bg-bg px-2 py-2 text-sm outline-none"
            />
          </label>
          <label className="sm:col-span-3">
            <span className="mb-1 block text-xs text-white/60">Titre</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="sm:col-span-1">
            <span className="mb-1 block text-xs text-white/60">Durée (min)</span>
            <input
              type="number"
              min={1}
              required
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="w-full rounded-md border border-white/10 bg-bg px-2 py-2 text-sm outline-none"
            />
          </label>
          <label className="sm:col-span-6">
            <span className="mb-1 block text-xs text-white/60">URL vidéo HLS (Mux .m3u8)</span>
            <input
              required
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="sm:col-span-6">
            <span className="mb-1 block text-xs text-white/60">Synopsis (optionnel)</span>
            <textarea
              rows={2}
              value={form.synopsis}
              onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-bg px-3 py-2 text-sm outline-none"
            />
          </label>
          {error && (
            <p className="sm:col-span-6 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="sm:col-span-6 ml-auto inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2 text-sm font-medium text-bg shadow-gold disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Ajouter
          </button>
        </form>
      </section>

      {Array.from(bySeason.entries())
        .sort(([a], [b]) => a - b)
        .map(([season, eps]) => (
          <section key={season} className="rounded-2xl border border-white/10 bg-elevated p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Saison {season}</h2>
            <ul className="divide-y divide-white/5">
              {eps.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-12 shrink-0 text-xs text-gold">S{e.season}·E{e.episode}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{e.title}</p>
                    <p className="truncate text-xs text-white/40">
                      {e.duration} min · {e.videoUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(e.id)}
                    className="rounded-md p-1.5 text-white/50 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
