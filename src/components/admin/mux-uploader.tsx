"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Copy, Loader2, UploadCloud, X } from "lucide-react";

type Phase = "idle" | "creating" | "uploading" | "encoding" | "ready" | "error";

export function MuxUploader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setPhase("idle");
    setProgress(0);
    setFile(null);
    setUploadId(null);
    setPlaybackUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function pickFile(f: File) {
    setError(null);
    setFile(f);
    setPhase("creating");

    try {
      const res = await fetch("/api/admin/mux/upload", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Création de l'upload Mux échouée");
      }
      const { url, uploadId: id } = await res.json();
      setUploadId(id);

      setPhase("uploading");
      // Use UpChunk dynamically — avoids SSR bundle bloat.
      const UpChunk = (await import("@mux/upchunk")).default;
      const upload = UpChunk.createUpload({ endpoint: url, file: f, chunkSize: 30720 });

      upload.on("progress", (e) => setProgress(Math.round(e.detail)));
      upload.on("success", async () => {
        setProgress(100);
        setPhase("encoding");
        // Poll asset status
        const start = Date.now();
        while (Date.now() - start < 5 * 60 * 1000) {
          await new Promise((r) => setTimeout(r, 3000));
          const r = await fetch(`/api/admin/mux/upload?id=${id}`);
          const data = await r.json();
          if (data.playbackUrl) {
            setPlaybackUrl(data.playbackUrl);
            setPhase("ready");
            return;
          }
        }
        setError("L'encodage prend trop de temps — réessaie depuis le dashboard Mux");
        setPhase("error");
      });
      upload.on("error", (e) => {
        setError(e.detail.message);
        setPhase("error");
      });
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }

  return (
    <div className="space-y-4">
      {phase === "idle" && (
        <label
          htmlFor="mux-file"
          className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-white/15 bg-bg p-12 text-center transition hover:border-gold/40"
        >
          <UploadCloud className="h-10 w-10 text-gold" />
          <p className="mt-3 font-display text-lg">Glisse une vidéo ici</p>
          <p className="text-sm text-white/50">ou clique pour parcourir (.mp4, .mov, .mkv)</p>
          <input
            ref={inputRef}
            id="mux-file"
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pickFile(f);
            }}
          />
        </label>
      )}

      {phase !== "idle" && file && (
        <div className="rounded-2xl border border-white/10 bg-bg p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{file.name}</p>
              <p className="text-xs text-white/50">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button onClick={reset} className="text-white/40 hover:text-white" aria-label="Annuler">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs text-white/60">
              <span>
                {phase === "creating" && "Préparation..."}
                {phase === "uploading" && `Envoi vers Mux — ${progress}%`}
                {phase === "encoding" && "Mux encode la vidéo..."}
                {phase === "ready" && "Prêt à diffuser ✓"}
                {phase === "error" && "Erreur"}
              </span>
              {(phase === "creating" || phase === "uploading" || phase === "encoding") && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
              )}
              {phase === "ready" && <CheckCircle2 className="h-3.5 w-3.5 text-gold" />}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-gold-gradient transition-all"
                style={{
                  width: phase === "ready" ? "100%" : phase === "encoding" ? "100%" : `${progress}%`,
                }}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {playbackUrl && (
            <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
              <p className="text-xs uppercase tracking-wider text-gold">URL HLS</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-bg/60 px-2 py-1.5 text-xs text-white">
                  {playbackUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(playbackUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold hover:bg-gold/20"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
