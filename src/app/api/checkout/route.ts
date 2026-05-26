import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stub : redirige vers /premium tant que Stripe/Flutterwave ne sont pas configurés.
// Pour activer Stripe, ajouter STRIPE_SECRET_KEY + STRIPE_PRICE_MONTHLY/YEARLY puis
// remplacer le corps par stripe.checkout.sessions.create({...}).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") ?? "monthly";
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=/premium`, req.url));
  }

  // TODO: brancher Stripe Checkout / Flutterwave Hosted Payment ici.
  // Pour l'instant on retourne sur /premium avec un flag.
  return NextResponse.redirect(new URL(`/premium?pending=${plan}`, req.url));
}
