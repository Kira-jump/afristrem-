import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const get = (k: string) => (form.get(k) ?? "").toString();
  const num = (k: string) => Number(form.get(k) ?? 0);

  try {
    await prisma.film.create({
      data: {
        title: get("title"),
        slug: get("slug"),
        synopsis: get("synopsis"),
        origin: get("origin"),
        genre: get("genre"),
        year: num("year"),
        duration: num("duration"),
        rating: num("rating") || 0,
        isPremium: form.get("isPremium") === "on",
        videoUrl: get("videoUrl"),
        thumbnailUrl: get("thumbnailUrl"),
        backdropUrl: get("backdropUrl") || null,
        director: get("director") || null,
        cast: get("cast") || null,
      },
    });
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
