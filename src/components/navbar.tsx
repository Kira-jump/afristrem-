"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Crown, Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { daysLeft, isTrialActive } from "@/lib/access";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?type=series", label: "Séries" },
  { href: "/premium", label: "Premium" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trial = useMemo(() => {
    const t = session?.user?.trialEndsAt ?? null;
    return { active: isTrialActive(t), left: daysLeft(t) };
  }, [session]);

  const isPremium = !!session?.user?.isPremium;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-bg/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-bg/80 via-bg/40 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition",
                    active
                      ? "text-gold"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/catalogue"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white sm:flex"
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session?.user ? (
            <div className="hidden items-center gap-2 md:flex">
              {trial.active && !isPremium && (
                <Link
                  href="/premium"
                  className="hidden rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold lg:inline-flex"
                >
                  Essai · J-{trial.left}
                </Link>
              )}
              {isPremium && (
                <span className="hidden rounded-full bg-gold-gradient px-3 py-1 text-xs font-semibold text-bg lg:inline-flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
              {session.user.role === "ADMIN" && (
                <Link
                  href="/dashboard/admin"
                  className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:text-gold"
                >
                  Admin
                </Link>
              )}
              <span className="hidden text-sm text-white/60 lg:inline">
                {session.user.name ?? session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:border-gold/40 hover:text-gold"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/auth/login"
                className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 rounded-md bg-gold-gradient px-3 py-1.5 text-sm font-medium text-bg shadow-gold transition hover:brightness-110"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Essai gratuit 7 jours
              </Link>
            </div>
          )}

          <button
            className="grid h-9 w-9 place-items-center rounded-md text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-bg/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
              {session?.user ? (
                <>
                  {trial.active && !isPremium && (
                    <Link
                      href="/premium"
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-center text-xs text-gold"
                    >
                      Essai gratuit · J-{trial.left}
                    </Link>
                  )}
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                    >
                      Dashboard admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/80"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-white/10 px-3 py-2 text-center text-sm"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-gold-gradient px-3 py-2 text-center text-sm font-medium text-bg"
                  >
                    Essai gratuit 7 jours
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
