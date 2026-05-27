"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film as FilmIcon,
  LayoutDashboard,
  Tv,
  Users,
  UploadCloud,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const links = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/films", label: "Films", icon: FilmIcon },
  { href: "/admin/series", label: "Séries", icon: Tv },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/uploads", label: "Uploads vidéo", icon: UploadCloud },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-surface md:flex md:flex-col">
      <div className="border-b border-white/5 px-5 py-5">
        <Logo />
        <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gold">
          <Crown className="h-3 w-3" /> Console Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                active
                  ? "bg-gold/10 text-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-1 w-full rounded-md px-3 py-2 text-left text-xs text-white/50 hover:bg-white/5 hover:text-white"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-30 flex items-center gap-1 overflow-x-auto border-b border-white/5 bg-bg/95 px-3 py-2 backdrop-blur md:hidden">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs",
              active
                ? "bg-gold/10 text-gold"
                : "text-white/70 hover:bg-white/5",
            )}
          >
            <l.icon className="h-3.5 w-3.5" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
