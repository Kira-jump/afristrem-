# AfriStream

Le cinéma africain en streaming — modèle **100 % Premium avec 7 jours d'essai gratuit** (façon Prime Video).

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma · NextAuth · HLS.js · Stripe + Flutterwave.

---

## 🚦 État au 2026-05-27

- ✅ **Scaffold complet** (homepage, catalogue, fiche film + player, auth, premium, admin)
- ✅ **Déployé sur Vercel** (repo `github.com/Kira-jump/afristrem-`)
- ✅ **Pivot 100% Premium + essai 7 jours** committé (commit `14b6b88`)
- ✅ **Hardening session** committé (commit `3042f40`) — l'app ne crashe plus si NEXTAUTH_SECRET manque
- ⏳ **À pousser** : commits `14b6b88` + `3042f40` pas encore sur GitHub
- ⏳ **À configurer sur Vercel** : variables d'environnement (cf. plus bas)

---

## ▶️ Tes prochaines étapes manuelles

### 1. Pousser les commits en attente
```bash
cd ~/afristream
git push origin main
```
Vercel rebuildera tout seul. La home devrait redevenir verte même sans env vars (grâce au `safeGetSession`).

### 2. Ajouter les variables d'environnement sur Vercel
**Vercel → Project → Settings → Environment Variables** :

| Variable | Pour quoi | Comment l'obtenir |
|---|---|---|
| `NEXTAUTH_SECRET` | **Obligatoire** pour l'auth en prod | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL publique de l'app | `https://<ton-projet>.vercel.app` |
| `DATABASE_URL` | Postgres (sinon fallback mock data) | Supabase → Project → Settings → Database → Connection string |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Login Google | console.cloud.google.com → OAuth credentials |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_MONTHLY` + `STRIPE_PRICE_YEARLY` + `STRIPE_WEBHOOK_SECRET` | Paiement diaspora | dashboard.stripe.com |
| `FLUTTERWAVE_PUBLIC_KEY` + `FLUTTERWAVE_SECRET_KEY` + `FLUTTERWAVE_ENCRYPTION_KEY` | Mobile Money | dashboard.flutterwave.com |
| `MUX_TOKEN_ID` + `MUX_TOKEN_SECRET` | Upload vidéo | mux.com |
| `CLOUDINARY_URL` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Thumbnails | cloudinary.com |

Après ajout → **Deployments → ⋯ → Redeploy**.

### 3. Initialiser la base Supabase (une seule fois)
Quand `DATABASE_URL` est dans Vercel :
```bash
# en local :
cd ~/afristream
echo "DATABASE_URL=postgresql://..." > .env
npx prisma db push      # crée les tables
node prisma/seed.mjs    # insère 12 films + 2 users
```
Comptes de seed :
- Admin : `admin@afristream.tv` / `admin1234`
- User (essai 7j actif) : `user@afristream.tv` / `test1234`

### 4. (Optionnel) Réécrire l'historique git
5 commits portent l'email `dashguinee@gmail.com` (`01a1004 → 14b6b88`).
Pour les anonymiser :
```bash
git filter-branch -f --env-filter '
  OLD="dashguinee@gmail.com"
  NEW="noreply@afristream.local"
  [ "$GIT_COMMITTER_EMAIL" = "$OLD" ] && export GIT_COMMITTER_EMAIL="$NEW" GIT_COMMITTER_NAME="AfriStream Dev"
  [ "$GIT_AUTHOR_EMAIL" = "$OLD" ]    && export GIT_AUTHOR_EMAIL="$NEW"    GIT_AUTHOR_NAME="AfriStream Dev"
' -- --all
git push origin main --force
```
⚠️ Force-push = irréversible. À faire toi-même quand tu décides.

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                      Hero + rangées + CTA (force-dynamic)
│   ├── catalogue/                    Recherche + filtres (genre/pays/année)
│   ├── film/[slug]/                  Fiche + player HLS + paywall
│   ├── premium/                      Hero "7 jours gratuits" + 2 plans
│   ├── auth/{login,register}/        NextAuth Credentials + Google
│   ├── dashboard/admin/              Stats + table films + form add
│   └── api/{auth,register,films,checkout}/   Routes serveur
├── components/  navbar, hero, film-card, film-row, hls-player, premium-cta, footer
├── lib/
│   ├── auth.ts          NextAuth config + trial start sur createUser
│   ├── access.ts        safeGetSession() + canWatch logic (7j trial)
│   ├── films.ts         Data layer (Prisma → fallback mock)
│   ├── mock-data.ts     12 films africains pour rendu sans DB
│   └── prisma.ts        Client singleton
└── types/{next-auth,lucide-react}.d.ts
```

## 🎨 Design system

- Background `#080808`, surface `#101010`, elevated `#161616`
- **Or** `#E8B84B` (CTA, accents) + gradient `#F2DC95→#E8B84B→#B58722`
- **Vert forêt** `#065F46` (badges pays, sections)
- **Typo** : Playfair Display (titres) + DM Sans (texte)

## 💎 Modèle business (Prime Video)

- **7 jours offerts** à l'inscription (Credentials *ou* Google), sans CB
- Ensuite : Mensuel **3,99 $** ou Annuel **2,79 $/mois** (33,49 $/an)
- `User.trialEndsAt` posée sur `now + 7d` automatiquement
- `getAccessState(session)` retourne `canWatch = isPremium || trialActive`
- Badge "Essai · J-N" dans la navbar décompte les jours restants

## 🔧 Dev local (Termux)

⚠️ **Next.js ne tourne pas sur Termux** — le binding SWC `@next/swc-linux-arm64-gnu` crashe silencieusement sur bionic libc Android. Pas de workaround propre. Pour preview design, ouvrir `preview.html` (HTML statique Tailwind-CDN, gitignored).

Pour vraiment dev → repo cloné sur PC/Mac/Linux/Codespaces :
```bash
git clone https://github.com/Kira-jump/afristrem-.git
cd afristrem-
npm install
cp .env.example .env  # éditer
npx prisma db push
npm run dev           # http://localhost:3000
```

## 📋 Roadmap

- [ ] Brancher Stripe Checkout réel sur `/api/checkout`
- [ ] Brancher Flutterwave Hosted Payment (Mobile Money)
- [ ] Webhooks paiement → maj `isPremium` + table `Subscription`
- [ ] Upload Cloudinary direct depuis l'admin
- [ ] Mux Direct Upload (vidéo)
- [ ] Watchlist + WatchHistory côté UI
- [ ] Téléchargement offline (PWA + service worker)
- [ ] Bump `next@14.2.30` (CVE 2025-12-11)

## 📜 Historique des commits

| Commit | Description |
|---|---|
| `01a1004` | feat: initial AfriStream scaffold |
| `360a860` | chore: add vercel config + ignore local preview |
| `7dcadaa` | fix(vercel): remove `.babelrc` (cassait `next/font` + SWC) |
| `8ce8977` | fix(login): wrap `useSearchParams` in Suspense |
| `14b6b88` | feat: pivot to 100% Premium with 7-day free trial |
| `3042f40` | fix: harden session reads + make homepage dynamic |
