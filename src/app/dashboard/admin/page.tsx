import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Film as FilmIcon,
  Users,
  CreditCard,
  Eye,
  PlusCircle,
} from "lucide-react";
import { getAllFilms } from "@/lib/films";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login?callbackUrl=/dashboard/admin");
  if (session.user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Accès refusé</h1>
        <p className="mt-2 text-white/60">
          Cette page est réservée aux administrateurs.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const films = await getAllFilms();
  const totalFilms = films.length;
  const premiumFilms = films.filter((f) => f.isPremium).length;

  const stats = [
    { label: "Films", value: totalFilms, icon: FilmIcon },
    { label: "Premium", value: premiumFilms, icon: CreditCard },
    { label: "Vues totales", value: "—", icon: Eye },
    { label: "Utilisateurs", value: "—", icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">
            <span className="text-gold-gradient">Dashboard</span> admin
          </h1>
          <p className="mt-1 text-white/60">
            Bienvenue, {session.user.name ?? session.user.email}.
          </p>
        </div>
        <Link
          href="/dashboard/admin/films/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-bg shadow-gold"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter un film
        </Link>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-elevated p-5"
          >
            <s.icon className="h-5 w-5 text-gold" />
            <p className="mt-3 text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-white/50">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Films</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/60">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Origine</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Année</th>
                <th className="px-4 py-3">Accès</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {films.map((f) => (
                <tr key={f.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{f.title}</td>
                  <td className="px-4 py-3 text-white/70">{f.origin}</td>
                  <td className="px-4 py-3 text-white/70">{f.genre}</td>
                  <td className="px-4 py-3 text-white/70">{f.year}</td>
                  <td className="px-4 py-3">
                    {f.isPremium ? (
                      <span className="rounded-md bg-gold/10 px-2 py-0.5 text-xs text-gold">
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-md bg-forest/20 px-2 py-0.5 text-xs text-forest-100">
                        Gratuit
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/film/${f.slug}`}
                      className="text-xs text-gold hover:underline"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
