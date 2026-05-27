import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  synopsis: z.string().min(1),
  origin: z.string().min(1),
  genre: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  duration: z.number().int().min(1),
  rating: z.number().min(0).max(10).optional(),
  isPremium: z.boolean().optional(),
  videoUrl: z.string().url(),
  trailerUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().url(),
  backdropUrl: z.string().optional().nullable(),
  director: z.string().optional().nullable(),
  cast: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const film = await prisma.film.create({
      data: {
        ...data,
        slug: data.slug && data.slug.length ? data.slug : slugify(data.title),
        rating: data.rating ?? 0,
        trailerUrl: data.trailerUrl || null,
        backdropUrl: data.backdropUrl || null,
        director: data.director || null,
        cast: data.cast || null,
      },
    });
    return NextResponse.json({ ok: true, film });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
