import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AfriStream — Le cinéma africain en streaming",
  description:
    "Plongez dans le meilleur du cinéma africain : films, séries et documentaires en streaming HD. Du Sénégal au Caire, de Lagos à Kigali.",
  metadataBase: new URL("https://afristream.tv"),
  openGraph: {
    title: "AfriStream",
    description: "Le cinéma africain en streaming HD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-white antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
