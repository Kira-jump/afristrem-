# AfriStream

Le cinéma africain en streaming — Next.js 14 + Tailwind + Prisma + NextAuth.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (thème sombre / or / vert forêt)
- Prisma + PostgreSQL (Supabase prêt)
- NextAuth.js (Credentials + Google)
- HLS.js (player vidéo)
- Stripe + Flutterwave (paiement diaspora + Mobile Money)
- Cloudinary (thumbnails)

## Démarrage rapide

```bash
# 1. Installer
npm install

# 2. Configurer
cp .env.example .env
# éditer .env (DATABASE_URL minimum, NEXTAUTH_SECRET = openssl rand -base64 32)

# 3. Base de données
npx prisma db push
node prisma/seed.mjs

# 4. Lancer
npm run dev
```

> Astuce : tant que `DATABASE_URL` n'est pas configuré, l'app utilise des données
> mock (12 films) pour que tu puisses voir l'UI immédiatement.

## Comptes de seed
- Admin : `admin@afristream.tv` / `admin1234`
- User : `user@afristream.tv` / `test1234`

## Structure
- `src/app` — App Router (pages + API routes)
- `src/components` — Composants UI (navbar, hero, film-card, player...)
- `src/lib` — `prisma`, `auth`, `films` (data layer + fallback mock)
- `prisma` — `schema.prisma` + `seed.mjs`

## Routes
- `/` — Accueil (hero, rangées, CTA Premium)
- `/catalogue` — Catalogue filtrable
- `/film/[slug]` — Fiche film + player HLS
- `/premium` — Plans d'abonnement
- `/auth/login` — Connexion
- `/auth/register` — Inscription
- `/dashboard/admin` — Back-office (rôle ADMIN requis)

## Déploiement Vercel
1. Push sur GitHub
2. Importer le repo sur Vercel
3. Ajouter les variables d'environnement (`.env.example`)
4. Ajouter Supabase Postgres + lancer `prisma db push` une fois
5. Build : `npm run build` (Prisma generate inclus)

## TODO (prochaines étapes)
- [ ] Brancher Stripe Checkout réel (`/api/checkout`)
- [ ] Brancher Flutterwave Hosted Payment (Mobile Money)
- [ ] Webhooks paiement → mise à jour `isPremium` + table `Subscription`
- [ ] Upload Cloudinary direct depuis l'admin
- [ ] Mux Direct Upload (vidéo)
- [ ] Watchlist + WatchHistory côté UI
- [ ] Téléchargement offline (PWA + service worker)
