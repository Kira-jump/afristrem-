"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const KEY = "afristream.cookies.ack";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-white/10 bg-bg/95 p-3 shadow-gold backdrop-blur sm:bottom-4 sm:p-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
          <Cookie className="h-4 w-4" />
        </span>
        <p className="flex-1 text-xs text-white/70 sm:text-sm">
          On utilise des cookies pour faire tourner le service (auth, préférences de lecture).
          En continuant, tu acceptes notre <a href="#" className="text-gold underline">politique de confidentialité</a>.
        </p>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={dismiss}
            className="rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-medium text-bg shadow-gold"
          >
            J'accepte
          </button>
          <button
            onClick={dismiss}
            className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
