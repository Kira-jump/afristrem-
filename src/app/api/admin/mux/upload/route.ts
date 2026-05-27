import { NextResponse } from "next/server";
import { requireAdminAPI } from "@/lib/admin-guard";
import { createMuxDirectUpload, getMuxAsset } from "@/lib/mux";

export async function POST() {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { url, uploadId } = await createMuxDirectUpload();
    return NextResponse.json({ url, uploadId });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const auth = await requireAdminAPI();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  try {
    const status = await getMuxAsset(id);
    return NextResponse.json(status);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
