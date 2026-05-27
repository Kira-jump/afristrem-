import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await prisma.episode.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
