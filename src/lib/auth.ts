import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { trialEndDate } from "./access";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as never,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: creds.email.toLowerCase().trim() },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id: string }).id;
      }
      if (token.email) {
        const db = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, isPremium: true, trialEndsAt: true },
        });
        if (db) {
          token.uid = db.id;
          token.role = db.role;
          token.isPremium = db.isPremium;
          token.trialEndsAt = db.trialEndsAt ? db.trialEndsAt.toISOString() : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string;
          role?: string;
          isPremium?: boolean;
          trialEndsAt?: string | null;
        };
        u.id = token.uid as string;
        u.role = token.role as string;
        u.isPremium = token.isPremium as boolean;
        u.trialEndsAt = (token.trialEndsAt as string | null) ?? null;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Démarre l'essai 7 jours dès la création de compte (OAuth/Google).
      // Les inscriptions Credentials sont déjà gérées dans /api/register.
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { trialEndsAt: trialEndDate() },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
