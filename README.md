# 🎬 AfriStream

Plateforme de streaming dédiée au cinéma africain — modèle **100% Premium avec 7 jours d'essai gratuit** (façon Prime Video).

**🌍 En ligne :** https://afristream-seven.vercel.app
**📦 Repo :** https://github.com/Kira-jump/afristrem-

---

## 📋 État du projet (2026-05-27)

| Composant | Statut |
|---|---|
| Frontend (Next.js 14) | ✅ Déployé sur Vercel |
| Pages publiques (home, catalogue, fiche film, premium, auth) | ✅ Fonctionnelles |
| Console admin `/admin` (CRUD films/séries/users + upload Mux) | ✅ Codée |
| **Base de données** | ⏳ **À configurer (Supabase)** |
| **Variables d'env Vercel** | ⏳ **À ajouter** |
| Paiement Stripe + Flutterwave | ⏳ À brancher (routes stubbées) |
| Upload Mux (vidéos) | ⏳ À configurer |
| Upload Cloudinary (thumbnails) | ⏳ À configurer |

---

## 🚀 Setup pas à pas — par où commencer

### Étape 1 — Base de données Supabase (~10 min, gratuit)

1. Va sur **https://supabase.com** → Sign in (GitHub conseillé)
2. **New Project** :
   - Name : `afristream`
   - Database password : note-le bien
   - Region : `West EU (London)` ou `Central EU (Frankfurt)`
3. Attends ~2 min que le projet se crée
4. **Settings → Database → Connection string → URI** :
   - Coche **"Use connection pooling"** (mode `Transaction`)
   - Le format ressemble à :
     ```
     postgresql://postgres.xxxx:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Remplace `[PASSWORD]` par ton mot de passe → copie le résultat complet

### Étape 2 — Variables d'environnement Vercel

**Vercel → Project `afristream-seven` → Settings → Environment Variables** → ajoute :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL Supabase de l'étape 1 (avec pgbouncer) |
| `DIRECT_URL` | Même URL mais **port 5432**, pas 6543, sans `?pgbouncer=true` (pour les migrations Prisma) |
| `NEXTAUTH_SECRET` | Lance `openssl rand -base64 32` → colle le résultat |
| `NEXTAUTH_URL` | `https://afristream-seven.vercel.app` |

Puis **Deployments → ⋯ → Redeploy** (sans cache).

> 💡 Sans `NEXTAUTH_SECRET`, la connexion plantera en prod. C'est la variable la plus critique.

### Étape 3 — Créer les tables + l'admin

**En local (Termux)** :
```bash
cd ~/afristream

# Crée un .env local avec la même URL Supabase (port 5432 cette fois)
echo 'DATABASE_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"' > .env

# Crée toutes les tables
npx prisma db push

# Insère le compte admin + 12 films de démo
node prisma/seed.mjs
```

Sortie attendue :
```
🌱 Seeding AfriStream...
✅ Seeded 12 films + 2 users.
```

### Étape 4 — Se connecter en admin

1. Va sur https://afristream-seven.vercel.app/auth/login
2. **Email** : `admin@afristream.tv`
3. **Mot de passe** : `admin1234`
4. Clique sur **"Admin"** (apparaît en haut à droite) → tu arrives sur `/admin`

🎯 **À faire tout de suite** : crée TON compte via `/auth/register`, puis depuis `/admin/users` passe ton compte en `ADMIN` et **supprime ou change** le mot de passe de `admin@afristream.tv` (il est public dans le repo).

---

## 🎥 Upload de vidéos (Mux — ~10 min)

### Configuration

1. **Crée un compte Mux** : https://mux.com → Sign up (carte requise mais $20 de crédit gratuit)
2. **Settings → Access Tokens → Generate new token** :
   - Permissions : `Mux Video — Full Access`
   - Note `Token ID` et `Token Secret`
3. **Vercel → Env Variables** → ajoute :
   ```
   MUX_TOKEN_ID     = <ton token id>
   MUX_TOKEN_SECRET = <ton token secret>
   ```
4. Redeploy

### Comment uploader

1. `/admin/uploads` → glisse ta vidéo (.mp4, .mov, .mkv)
2. Mux encode en HLS adaptatif (quelques minutes selon la taille)
3. Tu obtiens une URL type `https://stream.mux.com/<playback-id>.m3u8`
4. **Copie l'URL** → va sur `/admin/films/new` → colle dans le champ "URL vidéo"

---

## 🖼️ Upload des thumbnails (Cloudinary — ~5 min)

### Configuration

1. **Crée un compte Cloudinary** : https://cloudinary.com → Sign up (gratuit jusqu'à 25 GB)
2. Note ton **Cloud Name** (en haut du dashboard)
3. **Settings → Upload → Upload presets → Add upload preset** :
   - Signing Mode : **Unsigned** (important !)
   - Folder : `afristream`
   - Save → note le **Preset name**
4. **Vercel → Env Variables** :
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     = <ton cloud name>
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  = <ton preset name>
   ```
5. Redeploy

### Utilisation

Sur `/admin/films/new` ou `/admin/films/[id]/edit` :
- Clique sur **"Uploader vers Cloudinary"** sous le champ Thumbnail
- Le widget s'ouvre → choisis ton image → l'URL Cloudinary se remplit automatiquement

Sans cette config, tu peux toujours **coller une URL d'image** manuellement.

---

## 💳 Paiement (Stripe + Flutterwave — quand prêt à monétiser)

### Stripe (diaspora)

1. https://dashboard.stripe.com → crée 2 produits récurrents :
   - **Mensuel** : 3.99 USD/mois → note le `price_xxx`
   - **Annuel** : 33.49 USD/an → note le `price_xxx`
2. **Vercel** :
   ```
   STRIPE_SECRET_KEY     = sk_live_...  (ou sk_test_ pour tester)
   STRIPE_WEBHOOK_SECRET = whsec_...
   STRIPE_PRICE_MONTHLY  = price_xxx
   STRIPE_PRICE_YEARLY   = price_xxx
   ```
3. Webhook endpoint à créer dans Stripe : `https://afristream-seven.vercel.app/api/webhooks/stripe` (à coder)

### Flutterwave (Mobile Money Afrique)

1. https://dashboard.flutterwave.com → crée un compte business
2. **Vercel** :
   ```
   FLUTTERWAVE_PUBLIC_KEY     = FLWPUBK_TEST-...
   FLUTTERWAVE_SECRET_KEY     = FLWSECK_TEST-...
   FLUTTERWAVE_ENCRYPTION_KEY = ...
   ```

> ⚠️ Les routes `/api/checkout`, `/api/webhooks/stripe`, `/api/webhooks/flutterwave` sont stubbées — à brancher dans la prochaine itération.

---

## 🎨 Comment ajouter un film (workflow complet)

1. **Upload la vidéo** dans Mux via `/admin/uploads` → copie l'URL HLS
2. **Upload la thumbnail** dans Cloudinary (portrait 2:3, recommandé 600×900) → copie l'URL
3. **Optionnel** : upload une backdrop (paysage 16:9, recommandé 1920×1080)
4. Va sur `/admin/films/new` :
   - Titre, Synopsis
   - Pays d'origine (dropdown 22 pays africains)
   - Genre (dropdown 11 genres)
   - Année, Durée
   - Note (0-10) optionnelle
   - Coche **"Premium uniquement"** si tu veux qu'il soit derrière le paywall
   - Colle URL vidéo HLS (Mux)
   - Colle URLs thumbnail + backdrop (ou utilise le widget Cloudinary)
   - Réalisateur, Casting (optionnels)
5. **Publier** → le film apparaît immédiatement sur le site

---

## 🛡️ Sécurité — Console admin

- **Middleware Next.js Edge** (`src/middleware.ts`) bloque toute requête `/admin/*` sans JWT `role === "ADMIN"`. Inviolable.
- **Double-check serveur** dans chaque page admin via `requireAdmin()`
- **API admin** : chaque route `/api/admin/*` vérifie le rôle, renvoie 401/403 propre
- **Safety** : un admin ne peut pas se rétrograder lui-même
- **Comptes seed à changer** dès le premier login : `admin1234` est dans le repo public

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                Home (Hero + Pillars + 1 row + CTA)
│   ├── catalogue/              Recherche + filtres
│   ├── film/[slug]/            Fiche + player HLS + paywall
│   ├── premium/                Pricing + FAQ
│   ├── auth/{login,register}/  NextAuth (Credentials + Google)
│   ├── admin/                  Console privée
│   │   ├── page.tsx                 Dashboard 6 KPI
│   │   ├── films/                   CRUD + form
│   │   ├── series/[id]/episodes/    Gestion par saison
│   │   ├── users/                   Toggle Premium / promote ADMIN
│   │   └── uploads/                 Drag-drop Mux
│   ├── api/
│   │   ├── auth/[...nextauth]/      NextAuth handler
│   │   ├── register/                Inscription
│   │   ├── checkout/                Stub (à brancher Stripe/FLW)
│   │   └── admin/                   CRUD films/series/users/mux
│   └── opengraph-image.tsx     OG image dynamique pour partages
├── components/
│   ├── navbar, hero, footer, film-card, film-row, hls-player
│   ├── pillars, premium-cta, cookie-banner
│   └── admin/{sidebar, film-form, series-form, episodes-manager,
│              users-table, mux-uploader, cloudinary-upload}
├── lib/
│   ├── prisma, auth, films, mock-data         Data layer
│   ├── access (trial logic), admin-guard      Permissions
│   ├── slug, mux, blur, utils                 Helpers
└── middleware.ts                Bloque /admin/* sans role ADMIN
```

### Stack
- **Next.js 14** (App Router) · TypeScript · Tailwind CSS
- **Prisma** + PostgreSQL (Supabase)
- **NextAuth** (Credentials + Google OAuth + JWT)
- **HLS.js** (player vidéo adaptatif)
- **Mux** + UpChunk (upload vidéo direct chunked)
- **Cloudinary** (thumbnails via widget unsigned)
- **Stripe** + **Flutterwave** (paiement, à brancher)
- **Vercel** (déploiement + Edge middleware)

### Design system
- Background `#080808` · Surface `#101010` · Elevated `#161616`
- **Or** `#E8B84B` (CTA, accents) + dégradé `#F2DC95→#E8B84B→#B58722`
- **Vert forêt** `#065F46` (badges pays)
- **Typo** : Playfair Display (titres) + DM Sans (texte)

---

## 💎 Modèle business

- **7 jours offerts** dès l'inscription (Credentials ou Google), **sans CB**
- Ensuite : Mensuel **3,99 $** ou Annuel **2,79 $/mois** (33,49 $/an = -30%)
- `User.trialEndsAt` posée sur `now + 7d` automatiquement
- `getAccessState(session)` → `canWatch = isPremium || trialActive`
- Badge **"Essai · J-N"** dans la navbar décompte les jours restants
- Tout le catalogue est verrouillé pour les visiteurs non connectés

---

## 🛠️ Dev local

⚠️ **Next.js ne tourne pas sur Termux** — le binding SWC `@next/swc-linux-arm64-gnu` crashe sur bionic libc. Pour vraiment développer :

```bash
# Sur PC/Mac/Linux/Codespaces :
git clone https://github.com/Kira-jump/afristrem-.git
cd afristrem-
npm install
cp .env.example .env  # renseigner DATABASE_URL + NEXTAUTH_SECRET
npx prisma db push
node prisma/seed.mjs
npm run dev           # http://localhost:3000
```

**Preview design sans Next** (Termux uniquement) : ouvre `preview.html` dans Chrome (statique, Tailwind CDN, snapshot de la home).

---

## 📋 Roadmap

### V1.1 (à faire dans l'ordre)
- [ ] Configurer Supabase + variables Vercel (5 min)
- [ ] Créer ton compte admin perso + supprimer le seed (2 min)
- [ ] Configurer Mux + Cloudinary (15 min)
- [ ] Uploader tes 5-10 premiers vrais films (1-2 h)
- [ ] Tester `/auth/register` + flux trial 7 jours (5 min)

### V1.2
- [ ] Brancher Stripe Checkout réel (route `/api/checkout`)
- [ ] Brancher Flutterwave Hosted Payment (Mobile Money)
- [ ] Webhooks paiement → update `User.isPremium` + `Subscription`
- [ ] Email de rappel "il te reste 1 jour d'essai" (Resend ou Postmark)
- [ ] Page `/account` (mon abonnement, mes téléchargements)

### V1.3
- [ ] Watchlist + Continue Watching côté UI
- [ ] PWA + service worker (téléchargement offline réel)
- [ ] Recommandations basées sur l'historique
- [ ] Multi-langue (FR + EN + AR + SW)
- [ ] App mobile via Capacitor (réutilise les API)
- [ ] Bump `next@14.2.30` (CVE de sécurité 2025-12-11)

---

## 📜 Historique des commits

| Hash | Description |
|---|---|
| `01a1004` | feat: initial AfriStream scaffold |
| `360a860` | chore: vercel config |
| `7dcadaa` | fix(vercel): remove `.babelrc` |
| `8ce8977` | fix(login): Suspense for `useSearchParams` |
| `14b6b88` | feat: pivot 100% Premium + 7-day trial |
| `3042f40` | fix: harden session reads + dynamic home |
| `5f5c856` | docs: deploy state + manual next steps |
| `9e47181` | design: simplify homepage + footer |
| `8ccd335` | feat(admin): complete `/admin` panel |
| `2b8c80b` | design: hero trailer + pillars + cookies + OG + blur |
