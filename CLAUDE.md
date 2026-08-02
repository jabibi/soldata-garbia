# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Soldata Garbia — a Basque/Spanish payroll (nómina) net-salary calculator scoped to the Territorio Histórico de
Álava, built on Firebase (Hosting + Cloud Functions + Firestore + Auth). Frontend is React 19 + Vite + Tailwind v4
+ shadcn/ui, with i18n in Spanish and Basque (Euskera).

This is **two separate npm projects** sharing one Firebase project, not a single workspace:
- `/` (root) — the Vite/React frontend, deployed as Firebase Hosting.
- `functions/` — Cloud Functions, its own `package.json`/`tsconfig.json`/`node_modules`, Node 22 runtime.

There is no test suite in this repository currently (no Jest/Vitest config or test files).

## Commands

Frontend (run from repo root):
```
npm install
npm run dev       # vite dev server
npm run build     # tsc -b && vite build -> dist/
npm run lint      # oxlint
npm run preview   # preview the production build
```

Functions (run from `functions/`):
```
npm install
npm run build         # tsc -> lib/
npm run build:watch
npm run serve          # build + firebase emulators:start --only functions
npm run shell          # build + firebase functions:shell
npm run deploy         # firebase deploy --only functions
npm run logs           # firebase functions:log
```

Full local stack (functions + firestore + auth + hosting, from repo root, requires the Firebase CLI):
```
firebase emulators:start
```
Ports come from `firebase.json`: functions 5001, firestore 8080, auth 9099, hosting 5000, emulator UI 4000
(`singleProjectMode` is enabled). The frontend auto-connects to these emulators when `import.meta.env.DEV`
(see `src/lib/firebase.ts`) — no separate env flag needed.

Deploying everything: `firebase deploy` from the repo root (deploys hosting, functions, and Firestore
rules/indexes per `firebase.json`).

## Architecture

**Domain logic is isolated in `functions/src/domain/`** and is pure/framework-free:
- `retencionAlava.ts` — IRPF withholding-rate tables and lookup (`calcularTipoRetencionAlava`), keyed by annual
  gross income, number of dependents, and disability degree.
- `seguridadSocial.ts` — Social Security contribution rates and monthly calculation
  (`calcularCotizacionSSMensual`), which differ by contract type (`indefinido` vs `temporal`).
- `calculadora.ts` — orchestrates the two into a full gross-to-net breakdown (`calcularNomina`).

These tables are legally dated (currently the 2026 Álava/state figures, with BOTHA/BOE citations in comments) and
now serve as **factory defaults only** — the live values an admin has edited take precedence, see below.

**`functions/src/domain/types.ts` and `src/lib/types.ts` are hand-duplicated**, as are
`functions/src/domain/configuracion.ts`'s types/`CONFIGURACION_DEFECTO` and their frontend counterparts in
`src/lib/types.ts`/`src/lib/configuracionDefecto.ts`. There's no shared package between the two npm projects, so
all of these must be kept in sync manually whenever a shape changes.

**Calculation parameters are admin-editable at runtime**, stored in a single Firestore document
`configuracion/parametros` (`functions/src/domain/configuracion.ts`):
- The document holds the IRPF withholding table, the disability-minoration table, and the Social Security rates,
  all as **whole-number percentages** (e.g. `4.7`, not `0.047` — conversion to a fraction happens only inside the
  calculation). The unbounded last tramo of each table is stored as `hasta: null` (Firestore has no `Infinity`);
  `resolverConfiguracion` converts `null` → `Infinity` and derives each tramo's `desde` from the previous tramo's
  `hasta` + 0.01 — `desde` itself is never stored or admin-edited, which rules out gaps/overlaps by construction.
- `calcularTipoRetencionAlava`/`calcularCotizacionSSMensual` no longer read the hardcoded tables directly; they
  take the resolved tables/rates as parameters. `calcularNomina` (`calculadora.ts`) takes a resolved
  `ConfiguracionCalculo` alongside the payroll input.
- If the Firestore doc is missing or fails validation (e.g. hand-edited into an inconsistent shape via the
  Firebase console), `functions/src/index.ts` falls back to `CONFIGURACION_DEFECTO` (the same hardcoded 2026
  tables) rather than failing the calculation — past `historial` entries are unaffected either way, since they
  store the resolved result, not a reference to the config.
- Updating the tables/rates only ever happens through the `actualizarConfiguracionCalculo` callable (admin-only,
  zod-validated, full-document overwrite — never a partial merge, so the tables and rates can't drift out of sync
  with each other).

**Callable functions (`functions/src/index.ts`, all region `europe-west1`):**
- `calcularNomina` — the only calculation entry point; validates input with zod, resolves the current
  configuration (Firestore doc or defaults), runs the domain calculation, and (only if the caller is
  authenticated) writes the result to the `historial` Firestore collection.
- `actualizarConfiguracionCalculo` — admin-only; overwrites `configuracion/parametros` wholesale after zod
  validation.
- `bootstrapFirstAdmin` / `setUserRole` (`functions/src/auth/adminOps.ts`) — role management, see below.
- `onUserCreate` (`functions/src/auth/onUserCreate.ts`) — a **v1** auth trigger (the others are v2 `onCall`) that
  creates the `users/{uid}` Firestore profile with `role: "usuario"` on signup.

**Auth/role model** is custom-claims-driven, mirrored into Firestore:
- The `admin` custom claim on the Firebase Auth token is the source of truth for authorization checks inside
  Cloud Functions; `users/{uid}.role` in Firestore is a read-friendly mirror of the same thing for the client/UI.
- `AuthContext` (`src/context/AuthContext.tsx`) calls `bootstrapFirstAdmin` automatically on every sign-in where
  the token doesn't already have the `admin` claim. The function is a no-op if any admin already exists — this is
  how the very first registered user becomes admin, with no manual console/service-key step.
- Once a caller has the `admin` claim, `setUserRole` lets them promote/demote other users.
- Firestore rules (`firestore.rules`) deny **all client-side writes** to `users`, `historial`, and `configuracion`
  — those collections are only ever written by the Admin SDK from within Cloud Functions. Reads are restricted to
  the owning `uid`/admins (`users`, `historial`) or admins only (`configuracion`, since only the admin-only
  `ConfiguracionPanel` needs to see it).

**Frontend structure:** `src/lib/firebase.ts` initializes the Firebase app (config is inline, not env-based) and
wires up `functions`/`auth`/`db`. `src/lib/api.ts`, `src/lib/auth.ts`, and `src/lib/config.ts` wrap the callable
functions with typed `httpsCallable` calls. `src/components/ui/` holds shadcn/ui primitives (style `base-nova`,
see `components.json`); the `@` path alias resolves to `src/` (`vite.config.ts`). Copy is externalized to
`src/i18n/locales/{es,eu}.json` via i18next, with Spanish as the fallback language.
