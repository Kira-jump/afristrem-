import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  synopsis: z.string().min(1),
  origin: z.string().min(1),
  genre: z.string().min(1),
  seasons: z.number().int().min(1).optional(),
  rating: z.number().min(0).max(10).optional(),
  isPremium: z.boolean().optional(),
  thumbnailUrl: z.string().url(),
  backdropUrl: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const series = await prisma.series.create({
      data: {
        ...data,
        slug: data.slug && data.slug.length ? data.slug : slugify(data.title),
        seasons: data.seasons ?? 1,
        rating: data.rating ?? 0,
        backdropUrl: data.backdropUrl || null,
      },
    });
    return NextResponse.json({ ok: true, series });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
