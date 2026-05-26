"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push("/");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-forest-900 via-bg to-bg md:block">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-bg via-bg/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              <span className="text-gold-gradient">7 jours gratuits</span>
              <br />
              sur tout AfriStream.
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Aucune carte requise pour commencer. Annulable à tout moment.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 font-display text-3xl font-semibold md:mt-0">Créer un compte</h1>
          <p className="mt-1 text-sm text-white/60">
            Déjà inscrit ?{" "}
            <Link href="/auth/login" className="text-gold hover:underline">
              Connexion
            </Link>
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5h-1.6V20H24v8h11.3c-1.7 4.6-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28.5l-6.6 5.1A20 20 0 0 0 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12.1 12.1 0 0 1-4.1 5l6.2 5.2A19.9 19.9 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            S'inscrire avec Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            ou
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs text-white/60">Nom complet</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-elevated py-3 pl-10 pr-3 text-sm outline-none focus:border-gold/60"
                  placeholder="Aminata Diallo"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-white/60">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-elevated py-3 pl-10 pr-3 text-sm outline-none focus:border-gold/60"
                  placeholder="vous@exemple.com"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-white/60">Mot de passe</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-elevated py-3 pl-10 pr-3 text-sm outline-none focus:border-gold/60"
                  placeholder="6 caractères minimum"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-gradient py-3 text-sm font-medium text-bg shadow-gold transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Démarrer mon essai gratuit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
