# EliteForce Multiservices Mobile Foundation

This repository is a greenfield technical-test foundation for a Moroccan home-services marketplace MVP. The implementation intentionally departs from the original brief where that improves delivery speed and platform coherence:

- `supabase/` replaces a custom `backend/` folder so auth, schema, RLS, seed data, and local database workflows live in one platform-native place.
- Expo Router replaces a manual React Navigation setup, keeping route state file-based and easier to audit.
- Zustand replaces Redux Toolkit for small local-only UI state, while TanStack Query owns all remote state.
- `expo-sqlite/localStorage/install` replaces AsyncStorage for Expo-compatible Supabase session persistence.
- The package manager is `npm` only.

## Repository layout

- `mobile/`: Expo SDK 55 app with Expo Router, NativeWind v4 styling, auth flows, and the seeded Home/Search/Profile shell.
- `supabase/`: local Supabase CLI configuration, SQL migrations, seed data, and RLS smoke tests.

There is deliberately no custom `backend/` directory in this slice.

## Prerequisites

Install these tools before starting:

1. Node.js 20.19.4+
2. npm 10+
3. Docker Desktop (required for local Supabase)
4. Expo Go on a physical device or a simulator/emulator
5. `psql` if you want to run the SQL smoke test locally

Use the pinned Node version in [.nvmrc](/Users/dany/Projects/EliteForce/TaskRabbit/.nvmrc).

## Environment setup

Copy the environment templates:

```bash
cp .env.example .env
cp mobile/.env.example mobile/.env
```

`mobile/.env` must contain client-safe values only:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_APP_NAME`

The root `.env` is only for optional Supabase linking and remote workflows. Local development does not require a remote project link.

## Install dependencies

```bash
npm install
npm --prefix mobile install
```

The mobile app now uses the stable NativeWind v4 plus
`react-native-css-interop` stack instead of the earlier `react-native-css`
preview runtime.

## Local Supabase workflow

Start the local stack:

```bash
npm run supabase:start
```

Reset the database, apply migrations, and seed demo data:

```bash
npm run supabase:reset
```

Generate and commit database types after any schema change:

```bash
npm run supabase:types
```

Run the SQL smoke test for trigger/index/RLS coverage:

```bash
npm run supabase:test:rls
```

Local auth email confirmations are disabled in [supabase/config.toml](/Users/dany/Projects/EliteForce/TaskRabbit/supabase/config.toml) so successful registration creates an immediate session, matching the expected technical-test UX.

## Run the mobile app

Start Expo:

```bash
npm run mobile:start
```

Then scan the QR code with Expo Go or open an emulator. This foundation is designed to boot in Expo Go first.

## Mobile capabilities in this slice

- Bootstrap gate that shows a full-screen loading state until auth hydration finishes
- Auth flow with login, registration, forgot-password, and in-app password update
- Protected tabs shell for Home, Search, Bookings, and Profile
- Home screen backed by seeded categories and featured services
- Search screen with server-side filters, 400ms text debounce, and pull-to-refresh
- Profile screen backed by the `profiles` table with sign-out handling

## Commands

- `npm run mobile:start`
- `npm run mobile:test`
- `npm run mobile:lint`
- `npm run supabase:start`
- `npm run supabase:stop`
- `npm run supabase:reset`
- `npm run supabase:types`
- `npm run supabase:test:rls`

## Testing notes

The project establishes its own baseline tests for this first slice:

- [mobile/__tests__/router.test.tsx](/Users/dany/Projects/EliteForce/TaskRabbit/mobile/__tests__/router.test.tsx)
- [mobile/__tests__/register-screen.test.tsx](/Users/dany/Projects/EliteForce/TaskRabbit/mobile/__tests__/register-screen.test.tsx)
- [mobile/__tests__/update-password-screen.test.tsx](/Users/dany/Projects/EliteForce/TaskRabbit/mobile/__tests__/update-password-screen.test.tsx)
- [supabase/tests/rls.sql](/Users/dany/Projects/EliteForce/TaskRabbit/supabase/tests/rls.sql)

The current Jest baseline runs through `ts-jest` for stable unit coverage under
the Expo 55 dependency graph. `jest-expo` remains installed for future
render-heavy React Native tests once that stack is expanded.

## Screenshot placeholders

Capture these after the app is running locally:

- [ ] Login screen
- [ ] Register screen
- [ ] Home screen
- [ ] Search screen
- [ ] Profile screen

## Known limitations

- The Bookings tab is a deliberate placeholder shell for future work.
- The service catalog is seeded demo data, not live provider inventory.
- GlueStack is kept lightweight in this slice to avoid config drift against the NativeWind runtime and Expo Router shell.
