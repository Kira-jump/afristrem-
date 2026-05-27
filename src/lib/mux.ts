// Mux Direct Upload helper. Loaded lazily so the import only matters at request
// time on routes that actually use it (avoids build errors when env is unset).
export async function createMuxDirectUpload() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID / MUX_TOKEN_SECRET non configurés");
  }

  const Mux = (await import("@mux/mux-node")).default;
  const client = new Mux({ tokenId, tokenSecret });

  const upload = await client.video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: ["public"],
      encoding_tier: "smart",
    },
  });

  return {
    uploadId: upload.id,
    url: upload.url,
  };
}

export async function getMuxAsset(uploadId: string) {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) throw new Error("MUX env manquant");

  const Mux = (await import("@mux/mux-node")).default;
  const client = new Mux({ tokenId, tokenSecret });

  const upload = await client.video.uploads.retrieve(uploadId);
  if (!upload.asset_id) return { status: upload.status, playbackUrl: null };

  const asset = await client.video.assets.retrieve(upload.asset_id);
  const playbackId = asset.playback_ids?.[0]?.id;
  return {
    status: asset.status,
    assetId: asset.id,
    playbackUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null,
  };
}
