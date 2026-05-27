import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Defense-in-depth: middleware blocks the route, this re-verifies in every page/action. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");
  return session;
}

export async function requireAdminAPI(): Promise<{
  ok: true;
  userId: string;
} | { ok: false; status: number; error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { ok: false, status: 401, error: "Non authentifié" };
  if (session.user.role !== "ADMIN")
    return { ok: false, status: 403, error: "Accès refusé" };
  return { ok: true, userId: session.user.id };
}
