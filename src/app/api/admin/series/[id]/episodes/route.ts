import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/admin-guard";

const schema = z.object({
  season: z.number().int().min(1),
  episode: z.number().int().min(1),
  title: z.string().min(1),
  duration: z.number().int().min(1),
  videoUrl: z.string().url(),
  synopsis: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const data = schema.parse({
      season: Number(body.season),
      episode: Number(body.episode),
      title: body.title,
      duration: Number(body.duration),
      videoUrl: body.videoUrl,
      synopsis: body.synopsis,
    });
    const ep = await prisma.episode.create({
      data: {
        seriesId: params.id,
        season: data.season,
        episode: data.episode,
        title: data.title,
        duration: data.duration,
        videoUrl: data.videoUrl,
        synopsis: data.synopsis || null,
      },
    });
    return NextResponse.json({ ok: true, episode: ep });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
