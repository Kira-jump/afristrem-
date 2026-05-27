import {
  Film as FilmIcon,
  Tv,
  Crown,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllFilms } from "@/lib/films";

async function getStats() {
  const dbAvailable = !!process.env.DATABASE_URL;

  if (!dbAvailable) {
    const films = await getAllFilms();
    return {
      films: films.length,
      series: 0,
      premiumUsers: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      activeTrials: 0,
      mock: true,
    };
  }

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  try {
    const [films, series, premiumUsers, totalUsers, activeTrials, subs] =
      await Promise.all([
        prisma.film.count(),
        prisma.series.count(),
        prisma.user.count({ where: { isPremium: true } }),
        prisma.user.count(),
        prisma.user.count({
          where: { trialEndsAt: { gt: new Date() }, isPremium: false },
        }),
        prisma.subscription.findMany({
          where: { status: "ACTIVE", createdAt: { gte: start } },
          select: { amount: true },
        }),
      ]);

    const monthlyRevenue = subs.reduce((s, x) => s + x.amount, 0);
    return {
      films,
      series,
      premiumUsers,
      totalUsers,
      activeTrials,
      monthlyRevenue,
      mock: false,
    };
  } catch {
    return {
      films: 0,
      series: 0,
      premiumUsers: 0,
      totalUsers: 0,
      activeTrials: 0,
      monthlyRevenue: 0,
      mock: true,
    };
  }
}

export default async function AdminDashboard() {
  const s = await getStats();

  const cards = [
    { label: "Films", value: s.films, icon: FilmIcon, href: "/admin/films" },
    { label: "Séries", value: s.series, icon: Tv, href: "/admin/series" },
    {
      label: "Abonnés Premium",
      value: s.premiumUsers,
      icon: Crown,
      href: "/admin/users?filter=premium",
    },
    {
      label: "Revenus du mois",
      value: `${s.monthlyRevenue.toFixed(2)} $`,
      icon: DollarSign,
    },
    {
      label: "Utilisateurs",
      value: s.totalUsers,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Essais actifs",
      value: s.activeTrials,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          <span className="text-gold-gradient">Vue d'ensemble</span>
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Console d'administration AfriStream — {new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}
        </p>
        {s.mock && (
          <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
            ⚠️ Base de données non connectée — affichage des données mock. Configure
            <code className="mx-1 rounded bg-bg px-1 py-0.5">DATABASE_URL</code>
            sur Vercel pour activer les stats réelles.
          </p>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Inner = (
            <div className="group relative h-full rounded-2xl border border-white/10 bg-elevated p-5 transition hover:border-gold/30">
              <div className="flex items-start justify-between">
                <c.icon className="h-5 w-5 text-gold" />
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{c.value}</p>
              <p className="text-sm text-white/50">{c.label}</p>
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>
              {Inner}
            </Link>
          ) : (
            <div key={c.label}>{Inner}</div>
          );
        })}
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/films/new"
          className="rounded-2xl border border-gold/20 bg-gradient-to-br from-forest-900/40 to-elevated p-5 transition hover:border-gold/40 hover:shadow-gold"
        >
          <FilmIcon className="h-5 w-5 text-gold" />
          <h3 className="mt-3 font-display text-lg font-semibold">
            Ajouter un film
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Crée une nouvelle fiche avec vidéo + thumbnail
          </p>
        </Link>
        <Link
          href="/admin/uploads"
          className="rounded-2xl border border-white/10 bg-elevated p-5 hover:border-gold/30"
        >
          <Tv className="h-5 w-5 text-gold" />
          <h3 className="mt-3 font-display text-lg font-semibold">
            Upload vidéo (Mux)
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Envoie un fichier vidéo directement vers Mux
          </p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-2xl border border-white/10 bg-elevated p-5 hover:border-gold/30"
        >
          <Users className="h-5 w-5 text-gold" />
          <h3 className="mt-3 font-display text-lg font-semibold">
            Gérer les utilisateurs
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Promouvoir admin, activer Premium, voir essais
          </p>
        </Link>
      </section>
    </div>
  );
}
