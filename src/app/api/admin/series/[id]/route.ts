import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await req.json();
  try {
    const s = await prisma.series.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        synopsis: body.synopsis,
        origin: body.origin,
        genre: body.genre,
        seasons: Number(body.seasons || 1),
        rating: Number(body.rating ?? 0),
        isPremium: !!body.isPremium,
        thumbnailUrl: body.thumbnailUrl,
        backdropUrl: body.backdropUrl || null,
      },
    });
    return NextResponse.json({ ok: true, series: s });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await prisma.series.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
