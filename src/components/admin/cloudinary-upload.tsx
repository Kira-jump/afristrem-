"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        opts: Record<string, unknown>,
        cb: (err: unknown, result: { event: string; info: { secure_url: string } }) => void,
      ) => { open: () => void };
    };
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function CloudinaryUpload({
  name,
  defaultValue,
  label = "Thumbnail",
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const widgetRef = useRef<{ open: () => void } | null>(null);

  useEffect(() => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) return;
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          folder: "afristream",
        },
        (err, result) => {
          if (!err && result?.event === "success") {
            setUrl(result.info.secure_url);
          }
        },
      );
    }
  }, []);

  const ready = !!CLOUD_NAME && !!UPLOAD_PRESET;

  return (
    <div>
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-bg">
          {url ? (
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-[10px] text-white/30">
              Aucun
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="w-full rounded-md border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
          {ready ? (
            <button
              type="button"
              onClick={() => widgetRef.current?.open()}
              className="inline-flex items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold hover:bg-gold/20"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Uploader vers Cloudinary
            </button>
          ) : (
            <p className="text-[11px] text-white/40">
              💡 Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
              NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (unsigned) sur Vercel pour
              activer l'upload en 1 clic. En attendant, colle une URL.
            </p>
          )}
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-red-400"
            >
              <X className="h-3 w-3" /> Retirer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CloudinaryScript() {
  if (!CLOUD_NAME) return null;
  return (
    <script
      async
      src="https://upload-widget.cloudinary.com/global/all.js"
      type="text/javascript"
    />
  );
}
