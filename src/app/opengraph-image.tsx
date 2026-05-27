import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AfriStream — Le cinéma africain en streaming";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(at top right, #065F46 0%, #080808 55%), linear-gradient(135deg, #080808, #161616)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#F2DC95 0%,#E8B84B 40%,#B58722 100%)",
              color: "#080808",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 36,
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: 1,
              display: "flex",
            }}
          >
            Afri<span style={{ color: "#E8B84B" }}>Stream</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#E8B84B",
              display: "flex",
            }}
          >
            7 jours offerts
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 800,
              display: "flex",
            }}
          >
            Le cinéma africain,
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 800,
              display: "flex",
              backgroundImage:
                "linear-gradient(135deg,#F8ECC4 0%,#E8B84B 50%,#B58722 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            sans limite.
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>afristream.tv</span>
          <span>Diaspora · Mobile Money · Sans pub</span>
        </div>
      </div>
    ),
    size,
  );
}
