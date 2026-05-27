"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Crown, Loader2, Shield, ShieldOff } from "lucide-react";

type Row = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  isPremium: boolean;
  trialEndsAt: string | null;
  country: string | null;
  createdAt: string;
};

export function UsersTable({ users }: { users: Row[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, start] = useTransition();
  const [q, setQ] = useState("");

  const filtered = users.filter((u) =>
    (u.email + " " + (u.name ?? "")).toLowerCase().includes(q.toLowerCase()),
  );

  async function toggle(id: string, field: "isPremium" | "role") {
    setPendingId(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field }),
    });
    setPendingId(null);
    start(() => router.refresh());
  }

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher email ou nom..."
        className="mb-4 w-full max-w-sm rounded-md border border-white/10 bg-elevated px-3 py-2 text-sm outline-none focus:border-gold/60"
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-elevated">
        <div className="hidden grid-cols-[1fr_120px_120px_140px_180px] gap-4 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-wider text-white/50 md:grid">
          <span>Utilisateur</span>
          <span>Pays</span>
          <span>Rôle</span>
          <span>Statut</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-white/5">
          {filtered.map((u) => (
            <li key={u.id} className="grid gap-2 px-4 py-3 hover:bg-white/5 md:grid-cols-[1fr_120px_120px_140px_180px] md:items-center md:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{u.name ?? "—"}</p>
                <p className="truncate text-xs text-white/50">{u.email}</p>
              </div>
              <span className="text-xs text-white/60">{u.country ?? "—"}</span>
              <span>
                {u.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">
                    <Shield className="h-3 w-3" /> Admin
                  </span>
                ) : (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/60">
                    User
                  </span>
                )}
              </span>
              <span className="text-xs">
                {u.isPremium ? (
                  <span className="inline-flex items-center gap-1 text-gold">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                ) : trialActive(u.trialEndsAt) ? (
                  <span className="text-forest-100">
                    Essai · J-{daysLeft(u.trialEndsAt)}
                  </span>
                ) : (
                  <span className="text-white/40">Aucun</span>
                )}
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                <button
                  onClick={() => toggle(u.id, "isPremium")}
                  disabled={pendingId === u.id}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-bg px-2 py-1.5 text-[11px] text-white/80 hover:border-gold/40 hover:text-gold disabled:opacity-50"
                >
                  {pendingId === u.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Crown className="h-3 w-3" />
                  )}
                  {u.isPremium ? "Retirer Premium" : "Activer Premium"}
                </button>
                <button
                  onClick={() => toggle(u.id, "role")}
                  disabled={pendingId === u.id}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-bg px-2 py-1.5 text-[11px] text-white/80 hover:border-gold/40 hover:text-gold disabled:opacity-50"
                >
                  {u.role === "ADMIN" ? (
                    <>
                      <ShieldOff className="h-3 w-3" /> Retirer admin
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3" /> Passer admin
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function trialActive(d: string | null) {
  if (!d) return false;
  return new Date(d).getTime() > Date.now();
}
function daysLeft(d: string | null) {
  if (!d) return 0;
  return Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / 86400000));
}
