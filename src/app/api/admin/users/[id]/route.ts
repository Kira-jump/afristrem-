import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { field } = (await req.json()) as { field: "isPremium" | "role" };
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "User introuvable" }, { status: 404 });

  // Safety: can't demote yourself.
  if (field === "role" && user.id === auth.userId) {
    return NextResponse.json(
      { error: "Tu ne peux pas changer ton propre rôle" },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data:
      field === "isPremium"
        ? { isPremium: !user.isPremium }
        : { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });

  return NextResponse.json({ ok: true, user: updated });
}
