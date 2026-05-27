import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/users-table";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function loadUsers() {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true,
        trialEndsAt: true,
        country: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await loadUsers();
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Utilisateurs <span className="text-white/40">({users.length})</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Gère les rôles et statuts Premium
          </p>
        </div>
      </header>

      {users.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Users className="h-10 w-10 text-white/30" />
          <p className="mt-4 font-display text-xl text-white">Aucun utilisateur</p>
          <p className="mt-1 text-sm text-white/50">
            Configure DATABASE_URL et seed les données.
          </p>
        </div>
      ) : (
        <UsersTable
          users={users.map((u) => ({
            ...u,
            trialEndsAt: u.trialEndsAt ? u.trialEndsAt.toISOString() : null,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
