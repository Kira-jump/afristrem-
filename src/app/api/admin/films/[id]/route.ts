import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const film = await prisma.film.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        synopsis: body.synopsis,
        origin: body.origin,
        genre: body.genre,
        year: Number(body.year),
        duration: Number(body.duration),
        rating: Number(body.rating ?? 0),
        isPremium: !!body.isPremium,
        videoUrl: body.videoUrl,
        trailerUrl: body.trailerUrl || null,
        thumbnailUrl: body.thumbnailUrl,
        backdropUrl: body.backdropUrl || null,
        director: body.director || null,
        cast: body.cast || null,
      },
    });
    return NextResponse.json({ ok: true, film });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    await prisma.film.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
