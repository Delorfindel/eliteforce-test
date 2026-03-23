---
title: 'EliteForce Multiservices Mobile Foundation'
slug: 'eliteforce-multiservices-mobile-foundation'
created: '2026-03-23T21:05:00+01:00'
status: 'implemented'
stepsCompleted: [1, 2, 3, 4, 5, 6]
tech_stack:
  - 'npm 10+'
  - 'Node.js 20.19.4+'
  - 'TypeScript'
  - 'Expo SDK 55'
  - 'React Native'
  - 'Expo Router'
  - 'TanStack Query v5'
  - 'Zustand'
  - 'Tailwind CSS 3.4.x'
  - 'NativeWind 4.2.0'
  - 'react-native-css-interop 0.2.0'
  - 'gluestack-ui v3'
  - 'Supabase CLI'
  - 'supabase-js v2'
  - 'PostgreSQL with Row Level Security'
  - 'expo-sqlite localStorage polyfill'
  - 'expo-secure-store'
  - 'react-hook-form'
  - 'zod'
  - 'jest-expo'
  - 'ts-jest'
  - '@testing-library/react-native'
files_to_modify:
  - 'package.json'
  - '.nvmrc'
  - '.gitignore'
  - '.env.example'
  - 'README.md'
  - 'mobile/package.json'
  - 'mobile/.npmrc'
  - 'mobile/.env.example'
  - 'mobile/app.config.ts'
  - 'mobile/tsconfig.json'
  - 'mobile/metro.config.js'
  - 'mobile/global.css'
  - 'mobile/app/_layout.tsx'
  - 'mobile/app/index.tsx'
  - 'mobile/app/+not-found.tsx'
  - 'mobile/app/(auth)/_layout.tsx'
  - 'mobile/app/(auth)/login.tsx'
  - 'mobile/app/(auth)/register.tsx'
  - 'mobile/app/(auth)/forgot-password.tsx'
  - 'mobile/app/(auth)/update-password.tsx'
  - 'mobile/app/(app)/_layout.tsx'
  - 'mobile/app/(app)/(tabs)/_layout.tsx'
  - 'mobile/app/(app)/(tabs)/index.tsx'
  - 'mobile/app/(app)/(tabs)/search.tsx'
  - 'mobile/app/(app)/(tabs)/bookings.tsx'
  - 'mobile/app/(app)/(tabs)/profile.tsx'
  - 'mobile/src/providers/app-providers.tsx'
  - 'mobile/src/lib/env.ts'
  - 'mobile/src/lib/query-client.ts'
  - 'mobile/src/lib/storage.ts'
  - 'mobile/src/lib/supabase.ts'
  - 'mobile/src/components/ui/*'
  - 'mobile/src/tw/index.tsx'
  - 'mobile/src/tw/image.tsx'
  - 'mobile/src/tw/animated.tsx'
  - 'mobile/src/store/ui-store.ts'
  - 'mobile/src/store/search-filters-store.ts'
  - 'mobile/src/features/auth/api/sign-in.ts'
  - 'mobile/src/features/auth/api/sign-up.ts'
  - 'mobile/src/features/auth/api/request-password-reset.ts'
  - 'mobile/src/features/auth/api/update-password.ts'
  - 'mobile/src/features/auth/hooks/use-auth-session.ts'
  - 'mobile/src/features/auth/components/*'
  - 'mobile/src/features/auth/schemas/login-schema.ts'
  - 'mobile/src/features/auth/schemas/register-schema.ts'
  - 'mobile/src/features/auth/utils/recovery-params.ts'
  - 'mobile/src/features/services/api/search-services.ts'
  - 'mobile/src/features/services/api/list-categories.ts'
  - 'mobile/src/features/services/api/list-featured-services.ts'
  - 'mobile/src/features/services/hooks/use-services-search.ts'
  - 'mobile/src/features/services/components/service-card.tsx'
  - 'mobile/src/features/services/components/category-grid.tsx'
  - 'mobile/src/features/services/components/search-filters.tsx'
  - 'mobile/src/types/database.types.ts'
  - 'mobile/__tests__/router.test.tsx'
  - 'mobile/__tests__/register-screen.test.tsx'
  - 'mobile/__tests__/update-password-screen.test.tsx'
  - 'mobile/jest.setup.ts'
  - 'supabase/config.toml'
  - 'supabase/migrations/*_initial_foundation.sql'
  - 'supabase/seed.sql'
  - 'supabase/tests/rls.sql'
code_patterns:
  - 'confirmed-clean-slate'
  - 'expo-router-file-based-routing'
  - 'route-files-only-in-app-directory'
  - 'feature-first-src-organization'
  - 'javascript-tabs-for-stability'
  - 'tanstack-query-for-server-state'
  - 'zustand-for-local-client-state-only'
  - 'nativewind-css-wrapper-pattern'
  - 'gluestack-copy-paste-components'
  - 'supabase-auth-and-rls-first'
  - 'root-supabase-cli-plus-mobile-app-split'
test_patterns:
  - 'jest-expo-preset'
  - 'react-native-testing-library'
  - 'expo-router-testing-library'
  - '__tests__ kept outside app directory'
  - 'sql-smoke-tests-for-migrations-and-rls'
---

# Tech-Spec: EliteForce Multiservices Mobile Foundation

**Created:** 2026-03-23T21:05:00+01:00

## Overview

### Problem Statement

The client needs a senior-level technical test repository for a Moroccan home-services marketplace MVP. The original brief assumes a split `mobile/` plus `backend/` stack with Node.js, PostgreSQL, React Navigation, Redux Toolkit, and AsyncStorage. After discussion with the client, the implementation should instead demonstrate stronger architectural judgment by using Expo + Expo Router on mobile and Supabase as the backend platform, while still covering the same product intent: authentication, service discovery, bookings-ready navigation, and a professional app foundation.

### Solution

Build a greenfield monorepo with two top-level product folders: `mobile/` for the Expo application and `supabase/` for database/auth configuration, migrations, seeds, SQL tests, and generated-schema workflows. Storage buckets, Edge Functions, and other Supabase platform features remain out of scope for this slice unless they become strictly necessary to complete password recovery or auth routing. The first implementation slice will establish Expo Router navigation, NativeWind + GlueStack UI primitives, Supabase auth/client wiring, Zustand for local state, TanStack Query for server state, and the initial authenticated shell needed to extend into the rest of the test.

### Scope

**In Scope:**
- Greenfield monorepo structure with `mobile/` and `supabase/`
- Expo Router application foundation targeting Expo Go first
- Auth flow shell: login, register, forgot password, protected tabs shell
- Expo Router tabs and native stack routing for home, search, bookings, and profile
- NativeWind v5 + Tailwind v4 + react-native-css setup
- GlueStack as the design-system primitive and theme layer
- Supabase client bootstrap, auth/session persistence strategy, and database-first backend structure
- Zustand for local UI/app state and TanStack Query for remote state
- Environment variable strategy, `.env.example` files, README substitution notes
- Initial mobile architecture ready for search, service categories, and bookings extension
- Password recovery request plus in-app password update completion flow

**Out of Scope:**
- Full delivery of all six test modules
- Stripe integration, real-time messaging, push notifications, and deployment
- Final production hardening, observability, and CI/CD pipelines
- Full service marketplace schema and all domain flows beyond the first vertical slice
- Supabase Storage buckets and Edge Functions unless later required by an approved spec revision

## Context for Development

### Codebase Patterns

- Confirmed Clean Slate: there is no existing `mobile/`, `supabase/`, `package.json`, TypeScript config, linting config, or `project-context.md`. The only implementation context is the BMAD scaffold plus the PDF brief.
- Root repository should own orchestration and documentation concerns: `README.md`, `.gitignore`, Node version pinning, shared environment examples, and helper scripts for mobile and Supabase workflows.
- Package manager is `npm` for both root and mobile. Root scripts should call `npm --prefix mobile ...` for app tasks and `npx supabase ...` for local database tasks.
- `mobile/app` is reserved for Expo Router route files and `_layout` files only. All feature code, components, stores, providers, and utilities live under `mobile/src`.
- Use a feature-first `mobile/src` layout: `features/auth`, `features/services`, `lib`, `providers`, `store`, `types`, and `tw`.
- Expo Router remains the navigation foundation, but current Expo documentation marks `expo-router/unstable-native-tabs` as alpha and notes known limitations around `FlatList` behavior. For this test foundation, prefer Expo Router JavaScript tabs for the four-tab shell, with native stack navigation above them.
- Keep route files thin. Fetching, validation, and mutation logic belongs in hooks, schemas, API helpers, and providers rather than in route components.
- Keep server state out of Zustand. Use TanStack Query for network-backed state, caching, invalidation, and mutations. Zustand is only for local client state such as UI flags and search filter drafts.
- Do not use AsyncStorage. Current Expo and Supabase guidance supports `expo-sqlite/localStorage/install` for session persistence in Expo apps. Reserve `expo-secure-store` for additional sensitive values or a future encrypted adapter.
- The Tailwind setup is CSS-first and version-sensitive: `nativewind@5.0.0-preview.2`, `react-native-css@0.0.0-nightly.5ce6396`, and `lightningcss@1.30.1` must be pinned exactly, with `metro.config.js`, `postcss.config.mjs`, and wrapper components under `mobile/src/tw`.
- GlueStack should be treated as a copy-paste component system and provider layer, not as an authority over project config. Its CLI currently modifies Babel and Tailwind-era files, so its generated changes must be reconciled manually with the Tailwind v4 / NativeWind v5 setup rather than accepted blindly.
- Styling fallback path: if the exact NativeWind v5 plus `react-native-css` stack fails to boot in Expo Go after version pinning and GlueStack reconciliation, remove GlueStack-generated config mutations first; if the app still does not boot, keep the route/data architecture intact and defer GlueStack components from this slice before changing the Tailwind strategy.
- Supabase local development should follow the standard CLI layout under `supabase/` with `config.toml`, migrations, seeds, and SQL tests committed to the repo. Database access rules must be enforced with RLS from the first migration onward.
- Expo Go startup assumes the developer has the Expo Go app on a physical device or a simulator/emulator configured locally, and Supabase local development assumes Docker Desktop or another Docker-compatible runtime is installed.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `Docs/test_senior_eliteforce.docx.pdf` | Original client brief, scoring criteria, and required product flows |
| `package.json` | Root orchestration scripts for mobile and Supabase workflows |
| `.env.example` | Root Supabase CLI and shared local-development environment template |
| `mobile/package.json` | App-specific dependencies including native modules required for Expo autolinking |
| `mobile/.env.example` | Client-safe Expo environment template for Supabase public keys and app metadata |
| `mobile/app/_layout.tsx` | Root provider composition and navigation bootstrap |
| `mobile/app/index.tsx` | Initial redirect based on auth/session state |
| `mobile/app/(auth)/register.tsx` | Full registration screen matching test requirements |
| `mobile/app/(auth)/login.tsx` | Login screen with Supabase auth wiring |
| `mobile/app/(auth)/update-password.tsx` | Deep-link target for completing password recovery inside the app |
| `mobile/app/(app)/(tabs)/_layout.tsx` | Stable Expo Router tabs shell for Home, Search, Bookings, and Profile |
| `mobile/src/providers/app-providers.tsx` | Query client, auth/session listener, theme, and app-wide providers |
| `mobile/src/lib/supabase.ts` | Typed Supabase client bootstrap and session persistence strategy |
| `mobile/src/lib/storage.ts` | Non-sensitive local persistence adapter backed by Expo-supported storage |
| `mobile/src/components/ui/*` | GlueStack component primitives copied into the app and reconciled with the Tailwind v4 setup |
| `mobile/src/tw/index.tsx` | CSS-enabled component wrappers for NativeWind v5 |
| `mobile/src/features/auth/components/*` | Shared auth form composition kept outside route files |
| `mobile/src/features/auth/api/update-password.ts` | Password recovery completion mutation wrapper |
| `mobile/src/store/search-filters-store.ts` | Local-only persisted search filters and UI state |
| `mobile/src/features/services/api/search-services.ts` | Query function for search and filters |
| `mobile/src/features/services/hooks/use-services-search.ts` | Debounced query orchestration for the Search screen |
| `mobile/src/types/database.types.ts` | Generated Supabase database types for client-side typing |
| `supabase/config.toml` | Local Supabase stack configuration |
| `supabase/migrations/*_initial_foundation.sql` | First schema, seed-safe constraints, indexes, and RLS policies |
| `supabase/tests/rls.sql` | SQL smoke coverage for auth ownership and policy enforcement |

### Technical Decisions

- Repo structure: `mobile/` for the Expo app and `supabase/` for auth configuration, migrations, seed data, SQL tests, and generated-type workflows.
- Navigation: use Expo Router instead of manually wiring React Navigation. Route groups will model `(auth)` and `(app)` flows, with a dedicated `(tabs)` group for the signed-in shell.
- Tabs: use Expo Router JavaScript tabs for the four-tab shell in this foundation. Current Expo documentation describes native tabs as alpha and lists known limitations, so the stable tabs API is the safer choice for a technical test repo that will render lists and form-heavy screens.
- Expo target: prioritize Expo Go compatibility for the foundation stage. Avoid native-only dependencies that force a custom dev client.
- Styling: use Tailwind CSS v4 with NativeWind v5 and `react-native-css` wrappers. Route files remain thin; UI primitives live in shared component folders. Because this setup relies on preview/nightly packages, versions must be pinned exactly and not floated: `nativewind@5.0.0-preview.2`, `react-native-css@0.0.0-nightly.5ce6396`, and `lightningcss@1.30.1`.
- Design system: use GlueStack as the primitive and theming layer on top of the Expo/NativeWind setup instead of introducing a competing styling abstraction. Prefer adding only the components needed for the first slice and review any CLI-generated config changes before accepting them.
- Images: standardize on `expo-image`.
- State: Supabase session state is the single source of truth for authentication. Zustand stores only local client state such as UI preferences, current search filters, and transient onboarding flags; it must never persist session, JWT, or profile records.
- Remote data: use TanStack Query for services, categories, profile, and session-aware remote reads/mutations.
- Networking: prefer `fetch`/`expo/fetch` with typed error handling and `AbortController`; do not introduce Axios.
- Auth/session: use Supabase Auth. Session persistence should follow the current Expo-compatible quickstart guidance with `expo-sqlite/localStorage/install`, `persistSession: true`, `autoRefreshToken: true`, and `detectSessionInUrl: false`.
- Auth/signup behavior: local and demo environments must disable email confirmation so a successful registration can create an immediate session and route directly into the authenticated app shell, matching the brief's expected UX.
- Sensitive storage: avoid broad token duplication in Zustand. Any additional sensitive client secrets should use `expo-secure-store`, but the baseline Supabase session storage should follow the official Expo quickstart path for now.
- Local persistence: if Zustand persistence is required in the first slice, persist only non-sensitive slices through a custom storage adapter backed by the Expo-supported local storage layer.
- Auth/profile provisioning: profile creation must be handled by a database trigger on `auth.users`, not by client-side mutation and not by an Edge Function. The app should treat a missing profile after signup as an account-provisioning failure, sign the user back out, and show a normalized provisioning error.
- Data model posture: design the schema for database-enforced access using RLS from day one. Policies should use indexed ownership columns and the `select auth.uid()` optimization pattern for performance.
- Schema contract: `profiles` must contain `id uuid primary key references auth.users(id) on delete cascade`, `email text not null`, `first_name text not null`, `last_name text not null`, `phone text not null unique`, `accepted_terms_at timestamptz not null`, `role text not null default 'client'`, `created_at timestamptz not null default now()`, and `updated_at timestamptz not null default now()`.
- Schema contract: `service_categories` must contain `id bigint generated always as identity primary key`, `slug text not null unique`, `name text not null unique`, `icon_key text not null`, `sort_order integer not null unique`, `created_at timestamptz not null default now()`. The required seeded ordering is `menage`, `plomberie`, `electricite`, `jardinage`, `demenagement`, `peinture`.
- Schema contract: `services` must contain `id bigint generated always as identity primary key`, `category_id bigint not null references service_categories(id)`, `slug text not null unique`, `name text not null`, `short_description text not null`, `base_price numeric(10,2) not null`, `rating numeric(2,1) not null default 0`, `review_count integer not null default 0`, `image_url text`, `is_featured boolean not null default false`, `featured_rank integer`, `is_active boolean not null default true`, `created_at timestamptz not null default now()`, and `updated_at timestamptz not null default now()`.
- Index contract: create `profiles_id_idx` only if required by policy checks, keep the unique phone constraint indexed, create `services_category_price_idx` on `(category_id, base_price)`, `services_category_rating_idx` on `(category_id, rating)`, `services_featured_rank_idx` on `(is_featured, featured_rank)`, and a trigram-supported search index for `services.name` and `services.short_description` if `pg_trgm` is enabled; otherwise keep search MVP-sized and document the limitation.
- RLS policy matrix: `profiles` allow `select` and `update` only for the owning authenticated user, deny direct `insert` and `delete` from the client; `service_categories` allow `select` to `anon` and `authenticated`; `services` allow `select` to `anon` and `authenticated` only where `is_active = true`.
- Search contract: all search filtering is server-side through Supabase queries. Defaults are `query = ''`, `category = null`, `minPrice = 0`, `maxPrice = null`, `minRating = 0`. Empty query with no filters returns active services sorted by `is_featured desc`, `featured_rank asc nulls last`, `rating desc`, `review_count desc`, `base_price asc`.
- Home contract: featured services are seeded rows where `is_featured = true` ordered by `featured_rank asc`; the Home screen must render the six seeded categories in the brief's order and a maximum of six featured service cards.
- Error contract: normalize auth errors into fixed UI strings. Duplicate email becomes `An account already exists for this email.`, invalid credentials becomes `Email or password is incorrect.`, account provisioning failure becomes `We could not finish creating your account. Please try again.`, and forgot-password requests always resolve to `If an account exists for this email, you will receive a reset link.`.
- Password recovery contract: the auth flow must include an in-app `update-password` route that handles the recovery deep link, allows the user to enter a new password and confirmation, and completes the reset with Supabase before redirecting to login.
- Supabase local workflow: use `supabase init`, keep `supabase/config.toml` in version control, keep secrets in repo-root `.env`, and generate mobile database types from the local or linked project schema into `mobile/src/types/database.types.ts`.
- Generated types contract: commit `mobile/src/types/database.types.ts` to the repo and regenerate it with `npx supabase gen types typescript --local > mobile/src/types/database.types.ts` after every schema change. Drift between schema and committed types should be treated as a failing condition during verification.
- Runtime constraints: Node.js 20.19.4+ is required by the current Expo SDK 55 / React Native 0.84 dependency graph, so the repo should pin that baseline in `.nvmrc` and README prerequisites.
- Bootstrap UX contract: while session hydration is unresolved, the app must render a dedicated full-screen bootstrap state and must not render either the guest stack or the authenticated tab shell.
- README posture: document every deliberate substitution from the original brief and explain why the chosen stack improves delivery speed, maintainability, and platform coherence.

## Implementation Plan

### Tasks

- [x] Task 1: Create the root repository scaffold and orchestration scripts
  - File: `package.json`
  - Action: Create the root package manifest with npm-based scripts for `mobile:start`, `mobile:test`, `mobile:lint`, `supabase:start`, `supabase:stop`, `supabase:reset`, and `supabase:types`.
  - Notes: Use `npm --prefix mobile ...` for app tasks and `npx supabase ...` for database tasks; keep native dependencies in `mobile/package.json`.
  - File: `.nvmrc`
  - Action: Pin Node.js 20 to satisfy Supabase CLI and current Expo tooling expectations.
  - Notes: Mirror the Node requirement in `README.md`.
  - File: `.gitignore`
  - Action: Ignore Expo caches, Supabase local artifacts, `.env` files, and platform build outputs.
  - Notes: Preserve committed migrations, seeds, and generated database types.
  - File: `.env.example`
  - Action: Document root-only variables used for Supabase CLI linking and optional remote type generation.
  - Notes: Keep this separate from client-safe Expo variables and document that local Supabase development requires Docker.

- [x] Task 2: Bootstrap the Expo application in `mobile/` with Router-first configuration
  - File: `mobile/package.json`
  - Action: Create the Expo app from `create-expo-app` and align the manifest with Expo Router, TanStack Query, Zustand, Supabase, GlueStack, NativeWind v5, and testing dependencies.
  - Notes: Ensure `main` points to `expo-router/entry`; do not keep template demo dependencies that are not used; pin `nativewind@5.0.0-preview.2`, `react-native-css@0.0.0-nightly.5ce6396`, and the `lightningcss` resolution explicitly.
  - File: `mobile/app.config.ts`
  - Action: Define app name, slug, scheme, orientation, icon placeholders, and typed access to Expo public environment variables.
  - Notes: Use a stable deep-linking scheme from day one for auth redirects, password recovery, and future notifications.
  - File: `mobile/tsconfig.json`
  - Action: Configure strict TypeScript and path aliases such as `@/*`.
  - Notes: Route files should consume aliases rather than relative traversal imports.
  - File: `mobile/app/_layout.tsx`
  - Action: Set the root navigation shell and ensure the app is wrapped by a single providers component.
  - Notes: The root layout should not contain page logic beyond provider composition and top-level stack configuration.
  - File: `mobile/app/index.tsx`
  - Action: Implement the entry redirect that sends guests to `(auth)` and authenticated users to `(app)/(tabs)`.
  - Notes: The redirect must wait for session hydration before navigating and render a dedicated bootstrap screen while hydration is unresolved.
  - File: `mobile/app/+not-found.tsx`
  - Action: Add a minimal not-found route consistent with Expo Router conventions.
  - Notes: Keep it lightweight and inside the routing system.

- [x] Task 3: Configure Tailwind v4, NativeWind v5, and the shared UI foundation
  - File: `mobile/metro.config.js`
  - Action: Wrap the default Expo Metro config with `withNativewind` and disable inline variables per the `react-native-css` guidance.
  - Notes: Do not add legacy NativeWind Babel setup.
  - File: `mobile/postcss.config.mjs`
  - Action: Add the Tailwind v4 PostCSS plugin configuration.
  - Notes: Keep configuration CSS-first.
  - File: `mobile/global.css`
  - Action: Import Tailwind theme, preflight, and utilities layers, then define shared theme tokens and platform font variables.
  - Notes: Add project color tokens for the Moroccan home-services brand instead of default template colors.
  - File: `mobile/src/tw/index.tsx`
  - Action: Implement the CSS-enabled wrappers for `View`, `Text`, `ScrollView`, `Pressable`, `TextInput`, and `Link`.
  - Notes: Follow the `react-native-css` wrapper pattern exactly so `className` works in Expo.
  - File: `mobile/src/tw/image.tsx`
  - Action: Wrap `expo-image` for CSS-based `objectFit` and `objectPosition`.
  - Notes: Standardize all app imagery on this component.
  - File: `mobile/src/tw/animated.tsx`
  - Action: Export the Reanimated bridge for CSS-wrapped animated components.
  - Notes: Keep this small and purpose-built.
  - File: `mobile/src/components/ui/*`
  - Action: Add only the GlueStack primitives needed for the first slice such as button, input, form-control, checkbox, spinner, and text helpers.
  - Notes: Review any CLI-generated Babel or Tailwind config mutations and reconcile them manually with the Tailwind v4 setup instead of accepting them wholesale. If Expo Go does not boot after reconciling GlueStack changes, defer GlueStack primitives before changing the Tailwind strategy.

- [x] Task 4: Establish providers, environment parsing, storage, and remote-state infrastructure
  - File: `mobile/.env.example`
  - Action: Document client-safe Expo variables such as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - Notes: Do not include secrets or service-role credentials.
  - File: `mobile/src/lib/env.ts`
  - Action: Centralize access to Expo public environment variables and fail fast on missing required values.
  - Notes: Validate values once at startup rather than scattering `process.env` usage across features. Include the package-manager and local-tooling expectations in README rather than in code.
  - File: `mobile/src/lib/query-client.ts`
  - Action: Create the shared TanStack Query client with sensible defaults for stale time, retries, and focus refetch behavior on mobile.
  - Notes: Prefer conservative retries for auth flows and list reads.
  - File: `mobile/src/lib/storage.ts`
  - Action: Create a typed non-sensitive persistence adapter on top of `expo-sqlite/localStorage/install`.
  - Notes: This storage is for UI state only, not for auth tokens.
  - File: `mobile/src/lib/supabase.ts`
  - Action: Create the Supabase client with Expo-compatible session persistence, URL polyfill, `persistSession`, `autoRefreshToken`, and `detectSessionInUrl: false`.
  - Notes: Use generated database types and keep the client singleton outside React components. Supabase session state is the only auth source of truth.
  - File: `mobile/src/providers/app-providers.tsx`
  - Action: Compose `GluestackUIProvider`, `QueryClientProvider`, and auth/session listeners into a single provider tree.
  - Notes: This is the only provider imported directly by `mobile/app/_layout.tsx`. It must expose a bootstrap/loading state until auth hydration resolves.
  - File: `mobile/src/store/ui-store.ts`
  - Action: Add a local-only Zustand store for app hydration state, theme/UI toggles, and non-sensitive shell state.
  - Notes: Keep selectors narrow and avoid mirroring server data.
  - File: `mobile/src/store/search-filters-store.ts`
  - Action: Persist draft search filters such as category, price range, and minimum rating.
  - Notes: Persist only values that improve UX across app restarts.

- [x] Task 5: Implement the Supabase schema, seed data, RLS, and generated types
  - File: `supabase/config.toml`
  - Action: Initialize the Supabase project and commit the local config for repeatable developer setup.
  - Notes: Keep any secrets out of this file and disable email confirmations for local/demo auth flows so successful signup creates an immediate session.
  - File: `supabase/migrations/*_initial_foundation.sql`
  - Action: Create the initial schema covering `profiles`, `service_categories`, and `services`.
  - Notes: `profiles` must include first name, last name, email, phone, accepted terms timestamp, role, and timestamps; `service_categories` must contain the six required categories in fixed sort order; `services` must hold searchable catalog rows with featured rank, rating, review count, price, and active state.
  - File: `supabase/migrations/*_initial_foundation.sql`
  - Action: Add the `public.handle_new_user()` database function and trigger on `auth.users` that provisions a `profiles` row from auth metadata.
  - Notes: This keeps the mobile app thin and avoids manual profile bootstrapping after signup. The app must treat a missing profile after signup as a provisioning failure.
  - File: `supabase/migrations/*_initial_foundation.sql`
  - Action: Enforce constraints, foreign-key indexes, and composite indexes aligned with search queries and RLS filters.
  - Notes: Include a Morocco phone format check, the explicit service indexes in the spec, and ownership indexes used by policies.
  - File: `supabase/migrations/*_initial_foundation.sql`
  - Action: Enable and define RLS policies so users can read and update only their own profiles while service catalog data remains publicly readable or readable to authenticated users per design choice.
  - Notes: Use the `select auth.uid()` optimization pattern inside policies where applicable. The policy matrix must explicitly cover `profiles`, `service_categories`, and `services`.
  - File: `supabase/seed.sql`
  - Action: Seed the six required categories and a realistic set of featured/searchable services with prices and ratings.
  - Notes: Seed categories in brief order and seed at least six featured services with deterministic `featured_rank` values.
  - File: `mobile/src/types/database.types.ts`
  - Action: Generate and commit typed database definitions from the Supabase schema for app-side type safety.
  - Notes: Regenerate this file with `npx supabase gen types typescript --local > mobile/src/types/database.types.ts` after schema changes and treat drift as a verification failure.
  - File: `supabase/tests/rls.sql`
  - Action: Add SQL smoke tests covering profile ownership and public catalog reads.
  - Notes: These tests should fail if policies regress.

- [x] Task 6: Build the authentication feature and form validation layer
  - File: `mobile/src/features/auth/schemas/register-schema.ts`
  - Action: Define the registration validation rules for first name, last name, email, Morocco phone number, password strength, password confirmation, and mandatory terms acceptance.
  - Notes: Use `zod` so rules are shared between UI validation and submit guards.
  - File: `mobile/src/features/auth/schemas/login-schema.ts`
  - Action: Define validation for email and password fields.
  - Notes: Keep it minimal but explicit.
  - File: `mobile/src/features/auth/api/sign-up.ts`
  - Action: Implement the Supabase sign-up mutation and pass profile metadata needed by the `profiles` bootstrap trigger.
  - Notes: Normalize Supabase error responses into user-facing messages such as duplicate email.
  - File: `mobile/src/features/auth/api/sign-in.ts`
  - Action: Implement the Supabase sign-in mutation with typed error handling.
  - Notes: Avoid storing credentials or tokens in Zustand.
  - File: `mobile/src/features/auth/api/request-password-reset.ts`
  - Action: Implement the forgot-password request using Supabase auth reset APIs.
  - Notes: Route users to a success state even when no account disclosure should occur.
  - File: `mobile/src/features/auth/api/update-password.ts`
  - Action: Implement the authenticated recovery mutation that sets a new password after a recovery deep link is consumed.
  - Notes: Reuse the same password policy as registration.
  - File: `mobile/src/features/auth/hooks/use-auth-session.ts`
  - Action: Expose the hydrated session, current user, and profile lookup needed for route gating and welcome messaging.
  - Notes: Query the profile table through TanStack Query keyed by user id rather than manually caching server results in Zustand.
  - File: `mobile/src/features/auth/components/*`
  - Action: Extract shared form fields, validation messages, and loading button patterns outside route files.
  - Notes: Keep route components focused on layout and navigation.
  - File: `mobile/app/(auth)/_layout.tsx`
  - Action: Define the auth stack options and titles for login, register, and forgot-password routes.
  - Notes: Keep stack behavior native and minimal.
  - File: `mobile/app/(auth)/register.tsx`
  - Action: Build the full registration screen with real-time validation, disabled submit until valid, loading state, and success redirect.
  - Notes: The screen must satisfy the form requirements from the brief.
  - File: `mobile/app/(auth)/login.tsx`
  - Action: Build the login screen with password visibility toggle, loading state, and invalid-credential feedback.
  - Notes: Respect hydrated auth state to avoid flashing the login screen for signed-in users.
  - File: `mobile/app/(auth)/forgot-password.tsx`
  - Action: Build the forgot-password screen with a single email field and reset-request action.
  - Notes: Keep this simple but production-shaped.
  - File: `mobile/app/(auth)/update-password.tsx`
  - Action: Build the password-update screen that handles the recovery deep link, collects new password plus confirmation, and redirects back to login on success.
  - Notes: This route completes the reset flow; the request screen alone is not sufficient.

- [x] Task 7: Build the protected app shell, tabs, and session-aware routing
  - File: `mobile/app/(app)/_layout.tsx`
  - Action: Define the authenticated stack wrapper and protect its children behind session state.
  - Notes: Redirect guests away from this group without route loops.
  - File: `mobile/app/(app)/(tabs)/_layout.tsx`
  - Action: Configure the stable Expo Router tabs for Home, Search, Bookings, and Profile.
  - Notes: Use titles and icons that are consistent with the brief and the chosen icon strategy.
  - File: `mobile/app/(app)/(tabs)/bookings.tsx`
  - Action: Add the Bookings route as a presentable placeholder shell that is structurally ready for future booking data.
  - Notes: Out-of-scope business logic can remain a placeholder, but the route must feel intentional and use explicit empty-state copy rather than seeded fake bookings.
  - File: `mobile/app/(app)/(tabs)/profile.tsx`
  - Action: Add the Profile screen with current user/profile details and sign-out action.
  - Notes: Signing out should clear route access and return the user to the auth flow.

- [x] Task 8: Build the Home screen against seeded catalog data
  - File: `mobile/src/features/services/api/list-categories.ts`
  - Action: Create the query function to fetch seeded service categories in display order.
  - Notes: This should be cache-friendly and reusable across screens.
  - File: `mobile/src/features/services/api/list-featured-services.ts`
  - Action: Create the query function to fetch featured services for the horizontal list on Home.
  - Notes: Support a compact card payload only.
  - File: `mobile/src/features/services/components/category-grid.tsx`
  - Action: Render the six service categories in a polished grid with icon placeholders and responsive spacing.
  - Notes: Keep this component purely presentational.
  - File: `mobile/src/features/services/components/service-card.tsx`
  - Action: Create the reusable service card for featured and search results.
  - Notes: Use `expo-image` and avoid inline heavy logic.
  - File: `mobile/app/(app)/(tabs)/index.tsx`
  - Action: Build the Home screen with a welcome message using the user first name, a non-functional quick-search input, category grid, and horizontal featured services list.
  - Notes: Use a vertical scroll container and a performant horizontal list instead of mapping all cards into a basic `ScrollView`. Render categories in brief order and featured services by `featured_rank`.

- [x] Task 9: Build the Search screen with debounce, filters, and pull-to-refresh
  - File: `mobile/src/features/services/api/search-services.ts`
  - Action: Implement the typed Supabase query builder for text search, category filtering, minimum price, maximum price, and minimum rating.
  - Notes: Keep query composition readable and aligned with the indexed columns defined in Supabase. Empty query with no filters must still return active services in the default sort order.
  - File: `mobile/src/features/services/hooks/use-services-search.ts`
  - Action: Add the debounced query orchestration so requests wait 400ms after the user stops typing.
  - Notes: The debounce should apply to text input; filter toggles should refetch immediately against the latest debounced search term without duplicating stale requests.
  - File: `mobile/src/features/services/components/search-filters.tsx`
  - Action: Build the filter controls for category chips, price range, and minimum rating.
  - Notes: Use GlueStack primitives and persist values through the search filters store.
  - File: `mobile/app/(app)/(tabs)/search.tsx`
  - Action: Build the Search screen with a query input, 400ms debounce, filter controls, result list, empty state, loading state, and pull-to-refresh.
  - Notes: Use a virtualized list for results and ensure the first render handles both no-query and no-results states cleanly.

- [x] Task 10: Establish the project testing baseline and evaluator-facing documentation
  - File: `mobile/jest.setup.ts`
  - Action: Configure Jest mocks and testing-library setup for Expo Router, Supabase client mocking, and React Native test ergonomics.
  - Notes: Keep network and auth mocks centralized.
  - File: `mobile/__tests__/router.test.tsx`
  - Action: Add a route-gating smoke test covering unauthenticated entry, authenticated entry, and logout redirect.
  - Notes: This verifies the provider and router contract without over-testing implementation details.
  - File: `mobile/__tests__/register-screen.test.tsx`
  - Action: Add tests for real-time validation, disabled submit until valid, and duplicate-email error rendering.
  - Notes: Use realistic form interactions rather than snapshot-only coverage.
  - File: `mobile/__tests__/update-password-screen.test.tsx`
  - Action: Add tests for password recovery deep-link handling, password confirmation validation, and success redirect back to login.
  - Notes: This verifies the second half of the forgot-password flow that the original spec was missing.
  - File: `README.md`
  - Action: Document the project goal, deliberate stack substitutions, prerequisites, environment setup, local Supabase workflow, mobile startup, testing commands, and screenshot placeholders required by the brief.
  - Notes: Explicitly explain why `supabase/` replaces `backend/`, why Expo Router replaces direct React Navigation setup, why Zustand replaces Redux Toolkit, that npm is the package manager, that Docker is required for local Supabase, and the exact type-generation command.

### Acceptance Criteria

- [ ] AC 1: Given a fresh clone of the repository, when the developer reads `README.md`, then they can install Node 20.19.4+, Docker, Expo Go, copy the documented env files, run the documented npm and Supabase commands, generate database types, and launch the Expo app without external clarification.
- [x] AC 2: Given the repository root, when the developer inspects the file structure, then they see `mobile/` and `supabase/` as the two product directories alongside root-level config and documentation files, and no custom `backend/` folder.
- [ ] AC 3: Given the mobile app dependencies are installed, when `npx expo start` runs, then the app boots through Expo Router and is compatible with Expo Go.
- [x] AC 4: Given no active authenticated session exists, when the app opens, then the user is routed to the auth flow and not to the protected tab shell.
- [x] AC 5: Given the app is hydrating a previously persisted session, when the root route resolves, then it shows only a dedicated bootstrap screen until hydration completes and renders neither the guest stack nor the authenticated tab shell beforehand.
- [x] AC 6: Given the Register screen is open, when the user enters invalid first name, invalid last name, invalid email, invalid Morocco phone in `+212XXXXXXXXX` format, weak password, mismatched confirmation, or leaves terms unchecked, then inline validation errors appear and the submit button remains disabled.
- [ ] AC 7: Given the Register screen has valid input, when the user submits and local auth email confirmation is disabled, then the app creates a Supabase auth user, provisions a `profiles` row through the database trigger, shows a loading state during submission, and routes the user into the authenticated app on success.
- [x] AC 8: Given the submitted email already exists, when registration fails, then the screen renders a clear duplicate-email error without crashing or losing the current form values.
- [ ] AC 9: Given the Login screen is open, when the user submits valid credentials, then the app signs the user in, restores the session through Supabase persistence, and routes to the authenticated app shell.
- [x] AC 10: Given the Login screen is open, when the user submits wrong credentials, then the screen renders an authentication error and allows retry without a full reset.
- [ ] AC 11: Given an authenticated user lands on the Home screen, when catalog seed data is available, then the screen shows a welcome message sourced from the fetched `profiles.first_name`, the six service categories in brief order, and a horizontal featured-services list ordered by `featured_rank`.
- [x] AC 12: Given the Search screen is open, when the user types into the search field, then server-side service queries are delayed by 400ms of inactivity rather than firing on every keystroke.
- [x] AC 13: Given the Search screen has category, price, and minimum-rating filters applied, when the query runs, then the server-side result list reflects the combined filters, uses the default sort order when the text query is empty, and supports pull-to-refresh.
- [x] AC 14: Given the Search query returns no matching services, when the request completes, then the UI shows an explicit empty-state message instead of a blank list.
- [x] AC 15: Given a user opens the Profile tab and chooses to sign out, when sign-out completes, then the session is cleared and the app returns to the auth flow.
- [x] AC 16: Given the Forgot Password screen is used, when a user requests a reset and then opens the recovery deep link inside the app, then they can set a new password on the `update-password` route and are redirected back to login after success.
- [ ] AC 17: Given the Supabase database is reset locally, when migrations and seeds run, then the schema, required indexes, `handle_new_user` trigger, RLS policies, and seed data recreate a working catalog and profile foundation.
- [ ] AC 18: Given RLS is enabled, when one authenticated user tries to read or update another user’s profile, then the database denies access, while active categories and active services remain readable through the documented catalog policies.
- [ ] AC 19: Given the local test suite runs, when the router test, registration test, and SQL RLS smoke test execute, then they validate the bootstrap state, auth shell, form behavior, password-recovery completion path, and database access boundaries for the first slice.

### Implementation Closeout

- Verified on 2026-03-23: `npm --prefix mobile install`, `npx tsc --noEmit`, `npm run lint`, and `npm test -- --runInBand`.
- Local Supabase verification remains blocked in this environment because the Docker daemon is not running, so `npm run supabase:start`, `npm run supabase:reset`, and `npm run supabase:test:rls` could not be completed here.
- Implementation deviated from the original styling plan after Expo Go runtime failures in `react-native-worklets`: the app now uses stable NativeWind 4 plus `react-native-css-interop` instead of the earlier NativeWind 5 plus `react-native-css` preview stack.
- The mobile install path is now reproducible from the documented command without relying on the removed `react-native-css` preview runtime.
- Auth hydration now fails closed instead of hanging on the bootstrap screen if `supabase.auth.getSession()` rejects during startup.
- Password recovery deep links now accept both query-string tokens and fragment-based tokens before establishing the recovery session.
- The committed Jest baseline currently runs through `ts-jest` for stable unit coverage, while `jest-expo` stays installed for future render-heavy React Native tests.

## Additional Context

### Dependencies

- Root: `supabase` CLI as a dev dependency plus helper scripts for local stack, reset, and type generation.
- Package manager: `npm` only for this repository; do not mix `pnpm`, Yarn, or Bun lockfiles into the initial slice.
- Mobile runtime: `expo`, `react`, `react-native`, `expo-router`, `@supabase/supabase-js`, `@tanstack/react-query`, `zustand`, `expo-image`, `expo-secure-store`, `expo-sqlite`, `react-native-url-polyfill`.
- Mobile forms and validation: `react-hook-form`, `@hookform/resolvers`, and `zod`.
- Mobile styling: `tailwindcss@3.4.x`, `nativewind@4.2.0`, `react-native-css-interop@0.2.0`, `tailwind-merge`, and `clsx`.
- UI system: `gluestack-ui` components added selectively after base configuration is stable, plus icon/runtime dependencies such as `react-native-svg` and the chosen icon package if GlueStack components require them.
- Testing: `jest-expo`, `jest`, `@types/jest`, `@testing-library/react-native`, and `expo-router/testing-library`.
- External services: a Supabase project for local and optionally linked remote development; no separate Node API service is required for this slice.
- Task dependencies: Supabase schema and generated types must be in place before finalizing auth/profile queries and service search APIs.

### Testing Strategy

- No existing tests are present, so the project must establish its own testing baseline.
- Use `jest-expo` and `@testing-library/react-native` for component and screen tests.
- Use `expo-router/testing-library` for route-level navigation and auth-gate smoke tests, keeping test files outside `mobile/app`.
- Add at least one validation-focused test for registration form behavior and one router/auth hydration test for guest-versus-authenticated entry.
- Add SQL smoke coverage under `supabase/tests` for profile ownership policies and public-versus-authenticated service reads.
- Add one test for the password-recovery completion route to verify deep-link handling plus password confirmation validation.
- Manually verify the 400ms search debounce by observing request timing while typing and clearing the query quickly.
- Manually verify Expo Go startup after any GlueStack integration changes to ensure no CLI-generated config regression forces a custom development build.
- Manually verify that seeded categories and featured services render correctly after `supabase db reset`.
- Manually verify that signup without email confirmation immediately lands in the authenticated shell and that a provisioning failure signs the user back out with the normalized provisioning error.

### Notes

- Original brief required React Navigation, Redux Toolkit, AsyncStorage, Node.js, and PostgreSQL. This spec intentionally replaces those pieces with Expo Router, Zustand, Supabase, and Expo-compatible persistence because the client approved architectural freedom.
- The first implementation slice is broader than pure setup: it must leave the project ready to implement user registration, login, search, and protected tabs without structural rework.
- Confirmed Clean Slate means all implementation anchor points in this spec are file creations, not modifications to existing product code.
- The current Expo and Supabase documentation changed one earlier assumption from Step 1: the recommended session persistence path for Expo is `expo-sqlite/localStorage/install`, not MMKV and not a handcrafted SecureStore-first approach.
- The current Expo documentation also means the spec should favor stable JavaScript tabs over alpha native tabs for this repository, even though Expo Router remains the navigation foundation.
- Highest-risk integration point: NativeWind, Expo Router, and GlueStack configuration still converge in the styling layer, so config drift remains the most likely early blocker.
- Highest-risk backend point: the profile bootstrap trigger and RLS policies must be correct before auth flows are considered stable, otherwise signup may appear successful while the app lacks a readable profile row.
- Known limitation for this slice: the Bookings tab is structural only; it proves navigation completeness but does not implement booking creation or history logic yet.
- Known limitation for this slice: the service catalog is seeded demo data, not a full provider marketplace with live provider availability.
- Known limitation for this slice: password recovery is complete only for the in-app email-link flow; broader auth hardening such as MFA, rate limiting, or advanced email templates is out of scope.
- Future consideration: if the CSS-first Tailwind stack proves too unstable for the target Expo SDK after the documented fallback steps, the UI layer should be revisited in a new spec revision rather than changed ad hoc during implementation.
- Future consideration: if Expo native tabs stabilize for the SDK version in use, the tab shell can be revisited later for a more platform-native experience without reshaping the route tree.
- Future consideration: if session encryption requirements increase, replace baseline session storage with a secure adapter strategy that still satisfies Supabase’s storage contract.
