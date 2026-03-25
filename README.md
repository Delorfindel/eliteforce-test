# EliteForce Multiservices Foundation

Base technique d'une app mobile marketplace de services a domicile (client + prestataire), construite avec Expo Router + Supabase.

Ce repository contient:
- une application mobile React Native (Expo) dans `mobile/`
- un backend local-first Supabase (schema SQL, RLS, seed, tests SQL) dans `supabase/`

## Table des matieres

- [1. Vision du projet](#1-vision-du-projet)
- [2. Fonctionnalites existantes (etat actuel du code)](#2-fonctionnalites-existantes-etat-actuel-du-code)
- [3. Arborescence du projet](#3-arborescence-du-projet)
- [4. Stack technique](#4-stack-technique)
- [5. Prerequis](#5-prerequis)
- [6. Installation et configuration](#6-installation-et-configuration)
- [7. Lancer le projet localement](#7-lancer-le-projet-localement)
- [8. Commandes utiles (check, format, migrations, types, tests)](#8-commandes-utiles-check-format-migrations-types-tests)
- [9. Base de donnees et securite (RLS)](#9-base-de-donnees-et-securite-rls)
- [10. Tests existants](#10-tests-existants)
- [11. Captures d'ecran (auth, client, prestataire)](#11-captures-decran-auth-client-prestataire)
- [12. Limites connues de ce slice](#12-limites-connues-de-ce-slice)

## 1. Vision du projet

EliteForce est un MVP marketplace orientee services a domicile.

Le scope actuellement implemente couvre:
- authentication complete (inscription, connexion, reset mot de passe)
- recherche et selection de prestataires
- tunnel de reservation (planification, details, confirmation)
- gestion des reservations (liste, detail, annulation, notation client)
- espace prestataire (gestion des offres par categorie + edition profil)
- backend Supabase avec RLS active sur les tables metier

## 2. Fonctionnalites existantes (etat actuel du code)

Cette section est volontairement exhaustive et basee sur les routes, composants, APIs et migrations presentes.

### 2.1 Routes et navigation (Expo Router)

#### Routes publiques / auth
- `/`:
  - route d'entree avec bootstrap d'hydratation de session
  - redirection conditionnelle vers `/login` ou `/(app)/(tabs)`
- `/login`:
  - connexion email + mot de passe
  - validation formulaire (Zod)
  - gestion erreurs utilisateur
- `/register`:
  - inscription avec prenom, nom, email, telephone marocain, mot de passe
  - acceptation CGU obligatoire
  - preference opt-out marketing
- `/forgot-password`:
  - demande de lien de reinitialisation via email
  - ecran de succes post-envoi
- `/update-password`:
  - prise en charge recovery Supabase via query params ou fragment URL
  - creation d'une session de recovery (token pair ou token_hash)
  - changement de mot de passe + deconnexion forcee
- `+not-found`:
  - ecran fallback pour routes inexistantes

#### Routes protegees (app)
- `/(app)/(tabs)`:
  - shell onglets protege (Home/Search/Bookings/Profile + Services pour prestataires)
  - affichage conditionnel selon role (`client` / `provider`)
- `/(app)/(tabs)/index` (Accueil client):
  - header adresse + acces recherche
  - categories populaires et tendance
- `/(app)/(tabs)/search`:
  - recherche categories par texte
- `/(app)/(tabs)/bookings`:
  - liste reservations (mode client ou prestataire)
  - badges de statut temporel (A venir, Passee, Annulee)
- `/(app)/(tabs)/services` (prestataire uniquement):
  - edition bio prestataire avec autosave debounce
  - gestion des offres de service
- `/(app)/(tabs)/profile`:
  - profil utilisateur + role + deconnexion

#### Parcours recherche / reservation
- `/(app)/search/address`:
  - edition adresse par defaut (profil)
  - historique local des adresses recentes (persisted store)
- `/(app)/search/confirm`:
  - recap categorie + adresse
  - verrouillage avant passage aux resultats
- `/(app)/search/results`:
  - recherche prestataires avec filtres
  - tri dynamique et panneau de filtres
- `/(app)/taskers/[offeringId]`:
  - fiche detaillee prestataire + avis
  - ouverture d'une sheet de planification
- `/(app)/booking/details`:
  - saisie notes de mission
- `/(app)/booking/confirm`:
  - recap final + creation reservation
- `/(app)/bookings/[bookingId]`:
  - detail reservation
  - annulation conditionnelle (si a venir)
  - notation client conditionnelle (si passee, non annulee, non notee)

#### Parcours prestataire (offres)
- `/(app)/services/new`:
  - creation d'une offre categorie
- `/(app)/services/[offeringId]`:
  - edition/suppression d'une offre existante

### 2.2 Auth, session et profil

- Hydratation session Supabase au demarrage via `AppProviders`
- Stockage session persistant via `expo-sqlite/localStorage/install`
- Normalisation erreurs auth (email duplique, credentials invalides)
- Validation stricte des formulaires via Zod + React Hook Form
- Verification format telephone `+212XXXXXXXXX`
- Password policy:
  - min 8 caracteres
  - majuscule, minuscule, chiffre requis
- Provisioning profil au signup avec polling de disponibilite du profil
- Raccourcis de redirection selon etat auth/hydratation

### 2.3 Recherche marketplace (client)

- Lecture categories depuis `service_categories`
- Recherche prestataires sur `provider_category_offerings`
- Filtres metier disponibles:
  - categorie
  - disponibilite (`all` / `within_7_days`)
  - prix max
  - note minimale
  - tri (`recommended`, `price_asc`, `price_desc`)
- Debounce de recherche (400ms dans le hook dedie)
- Persistance locale des filtres de recherche (Zustand persist)

### 2.4 Reservation et suivi

- Creation de reservation (`task_bookings`) avec:
  - categorie, prestataire, date/heure
  - adresse + details
  - notes client
  - devise MAD
  - statut initial `confirmed`
  - payment_status `pending`
- Listing reservations pour client et prestataire
- Affichage detail reservation avec metadonnees completes
- Annulation reservation:
  - uniquement si client proprietaire
  - uniquement reservation `confirmed`
  - uniquement si date future
- Notation reservation:
  - note 1..5
  - uniquement client proprietaire
  - uniquement apres la date de mission
  - interdite si annulee
  - interdite si deja notee

### 2.5 Espace prestataire

- Edition bio prestataire avec:
  - autosave debounced (5s)
  - flush a la sortie ecran
  - invalidation cache recherche/profil
- Gestion des offres par categorie:
  - lister mes offres
  - creer une offre
  - modifier categorie / tarif / statut actif
  - activer/desactiver une offre (toggle)
  - supprimer une offre
- Optimistic updates sur toggle/suppression
- Blocage de duplication categorie (contrainte unique provider+category + gestion erreur 23505)

### 2.6 Stores locaux (Zustand)

- `search-filters-store`:
  - filtres recherche persists
- `booking-flow-store`:
  - etat temporaire du tunnel de reservation
- `address-history-store`:
  - historique d'adresses recentes (max 5)
- `ui-store`:
  - etat UI global (hydration, preferences)

### 2.7 Backend Supabase (fonctionnel)

- Triggers et fonctions:
  - `set_updated_at()`
  - `handle_new_user()` (provisioning profil)
  - `prevent_profile_role_change()`
- Tables metier actives:
  - `profiles`
  - `service_categories`
  - `provider_profiles`
  - `provider_category_offerings`
  - `provider_reviews`
  - `task_bookings`
- RLS activee + forcee sur tables metier
- Policies lecture/ecriture selon ownership et role
- Index de performance pour recherche et listings
- Seed local incluant:
  - categories de services
  - comptes client + prestataires de demo
  - offres prestataires
  - reservations de demo
  - avis prestataires

## 3. Arborescence du projet

```text
.
├── README.md
├── package.json
├── .env.example
├── .nvmrc
├── Docs/
├── mobile/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   │   ├── (tabs)/
│   │   │   ├── booking/
│   │   │   ├── bookings/
│   │   │   ├── search/
│   │   │   ├── services/
│   │   │   └── taskers/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── +not-found.tsx
│   ├── src/
│   │   ├── components/ui/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── services/
│   │   ├── lib/
│   │   ├── providers/
│   │   ├── store/
│   │   ├── tw/
│   │   └── types/
│   ├── __tests__/
│   ├── app.config.ts
│   ├── biome.json
│   ├── tailwind.config.js
│   └── package.json
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── tests/rls.sql
└── _bmad/
```

## 4. Stack technique

### Mobile
- Expo SDK 55
- React Native 0.83
- React 19
- Expo Router (file-based routing)
- NativeWind v4 + Tailwind CSS
- TypeScript strict

### Data, state et formulaires
- Supabase JS v2
- TanStack Query v5 (remote state, cache, mutations)
- Zustand (state local/persist)
- React Hook Form + Zod (forms + validation)

### Qualite et tests
- Biome (lint + format)
- Jest + ts-jest
- SQL smoke tests RLS (`supabase/tests/rls.sql`)

### Backend local
- Supabase CLI (v2.83.0)
- Postgres local via Docker (`supabase start`)

## 5. Prerequis

- Node.js `20.19.4` (voir `.nvmrc`)
- npm `10+`
- Docker Desktop lance
- CLI Supabase via `npx` (deja en devDependency)
- Xcode + simulateur iOS (pour `--ios`) ou device Expo Go

## 6. Installation et configuration

### 6.1 Installer les dependances

```bash
npm install
npm --prefix mobile install
```

### 6.2 Variables d'environnement

```bash
cp .env.example .env
cp mobile/.env.example mobile/.env
```

Variables cote mobile requises:
- `EXPO_PUBLIC_APP_NAME`
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Variables racine optionnelles (workflow remote Supabase):
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_DB_HOST`
- `SUPABASE_DB_PORT`

## 7. Lancer le projet localement

### 7.1 Demarrer Supabase local (Docker)

Depuis la racine du repo:

```bash
npm run supabase:start
```

Puis reinitialiser DB + migrations + seed:

```bash
npm run supabase:reset
```

Comptes de demo seeds (mot de passe commun `EliteForce123!`):
- `client.demo@eliteforce.local` (role client)
- `prestataire.demo@eliteforce.local` (role provider)
- `alban.demo@eliteforce.local` (role provider)
- `juba.demo@eliteforce.local` (role provider)
- `hassen.demo@eliteforce.local` (role provider)

Identifiants des 2 comptes principaux (seed):

- Client:
  - Email: `client.demo@eliteforce.local`
  - Mot de passe: `EliteForce123!`
- Prestataire:
  - Email: `prestataire.demo@eliteforce.local`
  - Mot de passe: `EliteForce123!`

Optionnel, verifier les endpoints/cles locales:

```bash
npx supabase status
```

### 7.2 Lancer Expo en iOS

Dans `mobile/`:

```bash
npx expo start --ios
```

Alternative depuis la racine:

```bash
npm --prefix mobile run ios
```

## 8. Commandes utiles (check, format, migrations, types, tests)

### 8.1 Commandes npm deja preconfigurees

Depuis la racine:

```bash
npm run mobile:start          # expo start --clear
npm run mobile:test           # jest
npm run mobile:lint           # biome check

npm run supabase:start        # demarre stack Supabase local
npm run supabase:stop         # stop stack local
npm run supabase:reset        # reset db locale + migrations + seed
npm run supabase:types        # regenere mobile/src/types/database.types.ts depuis la DB locale
npm run supabase:test:rls     # execute supabase/tests/rls.sql
```

Depuis `mobile/`:

```bash
npm run lint                  # biome check .
npm run lint:fix              # biome check --write .
npm run format                # biome format --write .
npm run test                  # jest --runInBand
```

### 8.2 Lancer les tests Jest (mobile)

Option rapide depuis la racine:

```bash
npm run mobile:test
```

Option depuis `mobile/`:

```bash
npm run test
```

Mode watch (developpement):

```bash
npm run test:watch
```

Lancer un seul fichier de test:

```bash
npm --prefix mobile run test -- --runTestsByPath __tests__/search-taskers.test.ts
```

Resultat attendu:
- Jest termine sans erreur
- code de sortie shell a `0`

### 8.3 Lancer le test SQL RLS (Supabase)

Pre-requis:
- Docker Desktop lance
- stack Supabase locale demarree
- `psql` installe (le script `supabase:test:rls` l'utilise)

Execution recommandee:

```bash
# 1) Demarrer Supabase local
npm run supabase:start

# 2) Rejouer migrations + seed pour partir d'un etat propre
npm run supabase:reset

# 3) Executer le smoke test RLS
npm run supabase:test:rls
```

Ce que fait le test:
- verifie triggers attendus
- verifie indexes critiques
- verifie les policies RLS selon plusieurs roles (`anon`, `authenticated`, provider, client)

Resultat attendu:
- aucune exception SQL
- commande terminee avec code de sortie `0`

### 8.4 Workflow migrations local

```bash
# 1) Creer un fichier de migration
npx supabase migration new <nom_migration>

# 2) Editer le SQL dans supabase/migrations/<timestamp>_<nom_migration>.sql

# 3) Rejouer schema local + seed
npm run supabase:reset

# 4) Regenerer les types TS
npm run supabase:types

# 5) Valider les policies RLS
npm run supabase:test:rls
```

### 8.5 Push migrations vers un projet Supabase distant

```bash
# Auth CLI (si necessaire)
npx supabase login

# Lier le repo au projet distant
npx supabase link --project-ref "$SUPABASE_PROJECT_REF" --password "$SUPABASE_DB_PASSWORD"

# Pousser les migrations locales non appliquees
npx supabase db push
```

Commandes remote utiles:

```bash
npx supabase migration list
npx supabase db pull
npx supabase gen types --linked > mobile/src/types/database.types.ts
```

## 9. Base de donnees et securite (RLS)

### 9.1 Tables principales

- `profiles`: profil utilisateur applicatif (role, phone, adresse par defaut)
- `service_categories`: catalogue des categories
- `provider_profiles`: profil public/metier du prestataire
- `provider_category_offerings`: offres prestataire par categorie (tarif, disponibilite, actif)
- `provider_reviews`: avis publics prestataire
- `task_bookings`: reservations client/prestataire, statut, paiement, rating client

### 9.2 Regles de securite notables

- lecture profil strictement sur son propre profil (`profiles_select_own`)
- update profil strictement sur son propre profil (`profiles_update_own`)
- role profil non modifiable cote client (`prevent_profile_role_change`)
- offres prestataire:
  - lecture publique uniquement si active
  - le proprietaire voit aussi ses offres inactives
  - insert/update/delete reserves au prestataire proprietaire
- reservations:
  - lecture reservee aux participants (client ou prestataire)
  - creation reservee au client proprietaire
  - update reservee au client proprietaire (utilise pour annulation/notation)

## 10. Tests existants

### 10.1 Tests mobile (Jest)

- `mobile/__tests__/router.test.tsx`
- `mobile/__tests__/register-screen.test.tsx`
- `mobile/__tests__/update-password-screen.test.tsx`
- `mobile/__tests__/search-taskers.test.ts`
- `mobile/__tests__/tasker-mapping.test.ts`
- `mobile/__tests__/provider-category-offering-utils.test.ts`

### 10.2 Test SQL RLS

- `supabase/tests/rls.sql`
  - valide triggers attendus
  - valide indexes critiques
  - valide policies RLS owner/public selon role (`anon`, `authenticated`, provider, client)

## 11. Captures d'ecran (auth, client, prestataire)

Arborescence actuelle:

```text
Docs/
└── screenshots/
    ├── auth/
    ├── client/
    └── presta/
```

### 11.1 Parcours Auth

<table>
  <tr>
    <td><img src="Docs/screenshots/auth/auth-login.png" alt="Auth - Login" /></td>
    <td><img src="Docs/screenshots/auth/auth-signup.png" alt="Auth - Signup" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/auth/auth-reset.png" alt="Auth - Reset Password" /></td>
    <td></td>
  </tr>
</table>

### 11.2 Parcours Client

#### Accueil et recherche

<table>
  <tr>
    <td><img src="Docs/screenshots/client/home.png" alt="Client - Home" /></td>
    <td><img src="Docs/screenshots/client/recherche-categorie.png" alt="Client - Recherche categorie" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/client/recherche-confirmation.png" alt="Client - Recherche confirmation" /></td>
    <td><img src="Docs/screenshots/client/adresse.png" alt="Client - Adresse" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/client/recherche-resultat.png" alt="Client - Recherche resultat" /></td>
    <td><img src="Docs/screenshots/client/recherche-filtres.png" alt="Client - Recherche filtres" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/client/recherche-profil.png" alt="Client - Recherche profil" /></td>
    <td></td>
  </tr>
</table>

#### Planification et booking

<table>
  <tr>
    <td><img src="Docs/screenshots/client/recherche-planning.png" alt="Client - Recherche planning" /></td>
    <td><img src="Docs/screenshots/client/recheche-planning-date.png" alt="Client - Recherche planning date" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/client/booking-details.png" alt="Client - Booking details" /></td>
    <td><img src="Docs/screenshots/client/booking-confirmation.png" alt="Client - Booking confirmation" /></td>
  </tr>
</table>

#### Reservations et profil

<table>
  <tr>
    <td><img src="Docs/screenshots/client/reservations-list.png" alt="Client - Reservations list" /></td>
    <td><img src="Docs/screenshots/client/reservations-detail.png" alt="Client - Reservations detail" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/client/client-profil.png" alt="Client - Profil" /></td>
    <td></td>
  </tr>
</table>

### 11.3 Parcours Prestataire

<table>
  <tr>
    <td><img src="Docs/screenshots/presta/reservations-list.png" alt="Presta - Reservations list" /></td>
    <td><img src="Docs/screenshots/presta/reservations-detail.png" alt="Presta - Reservations detail" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/presta/mes-services.png" alt="Presta - Mes services" /></td>
    <td><img src="Docs/screenshots/presta/mes-services-ajout.png" alt="Presta - Ajout service" /></td>
  </tr>
  <tr>
    <td><img src="Docs/screenshots/presta/presta-profil.png" alt="Presta - Profil" /></td>
    <td></td>
  </tr>
</table>

## 12. Limites connues de ce slice

- Le bloc paiement dans `booking/confirm` est un placeholder UX (pas de PSP integre)
- Les entrées `Parametres`, `Aide & support`, `A propos` du profil sont visuelles uniquement
- Le scope actuel couvre reservation + notation client, pas un moteur complet d'orchestration ops
