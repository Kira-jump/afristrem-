// Generic shimmer SVG used as blur placeholder for next/image.
// Avoids per-image plaiceholder generation while still preventing layout pop-in.
function shimmer(w: number, h: number) {
  return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#161616" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#161616" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#101010" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.4s" repeatCount="indefinite" />
</svg>`;
}

function toBase64(str: string) {
  if (typeof window === "undefined") return Buffer.from(str).toString("base64");
  return window.btoa(str);
}

export function blurFor(w = 400, h = 600) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}
