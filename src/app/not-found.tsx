import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl text-gold-gradient">404</p>
        <h1 className="mt-3 font-display text-2xl">Page introuvable</h1>
        <p className="mt-1 text-white/60">
          Le contenu demandé n'existe pas ou a été déplacé.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
