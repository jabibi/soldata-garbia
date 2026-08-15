# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Soldata Garbia — a payroll (nómina) net-salary calculator covering Araba, Bizkaia, Gipuzkoa, Nafarroa, and the
rest of Spain (`"estado"`, régimen común), built on Firebase (Hosting + Cloud Functions + Firestore + Auth).
Frontend is React 19 + Vite + Tailwind v4 + shadcn/ui, with i18n in Spanish, Basque (Euskera), Galician (Galego),
and Catalan (Català).

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
- `retencionIrpf.ts` — IRPF withholding-rate/minoración tables and table lookup (`calcularTipoRetencion`) for the
  four **foral** territories, keyed by annual gross income, number of dependents, and disability degree.
  Territory-agnostic itself: it just operates on whichever table is passed in.
- `retencionEstado.ts` — a **formula-based** (not table-based) calculation (`calcularTipoRetencionEstado`) for the
  "estado" (régimen común) territory — see below, this is structurally different from the other four.
- `seguridadSocial.ts` — Social Security contribution rates and monthly calculation
  (`calcularCotizacionSSMensual`), which differ by contract type (`indefinido` vs `temporal`). SS rates are
  **national**, not per-territory, and apply the same regardless of `territorio`.
- `calculadora.ts` — orchestrates the above into a full gross-to-net breakdown (`calcularNomina`): branches on
  `input.territorio` to pick table-lookup vs. formula, then applies the shared SS calculation and the optional
  user-supplied manual override.

**The calculator supports five territories** (`Territorio` = `TerritorioConTabla | "estado"`, `TERRITORIOS` in
`types.ts`), but they are **not structurally uniform**:
- **`TerritorioConTabla`** = `"araba" | "bizkaia" | "gipuzkoa" | "nafarroa"` — each has its own independently
  admin-editable IRPF withholding table and disability-minoración table
  (`ConfiguracionCalculo.territorios: Record<TerritorioConTabla, ConfiguracionTerritorio>`, four keys, no
  "estado"). All four tables in `retencionIrpf.ts` are **real, legally-sourced 2026 figures**, not placeholders:
  Araba/Bizkaia/Gipuzkoa's tables are — confirmed independently against each territory's own Decreto Foral, not
  assumed — byte-for-byte identical (`TABLA_RETENCION_ARABA_BIZKAIA_GIPUZKOA_2026`), while Nafarroa has a
  genuinely different table (`TABLA_RETENCION_NAFARROA_2026`, different brackets, and its own minoración grouping
  by ≥33%/≥65% rather than sin/con-movilidad). Nafarroa's real table has 11 dependant columns (0..."10 o más");
  since this app's UI/data model caps at 7 (0..5 and "más de 5"), columns 6-10 are deliberately collapsed into
  "más de 5" using Nafarroa's real value for exactly 6 dependants — a documented, deliberate approximation for
  large families, not an error. Nafarroa's ≥33%/≥65% minoración split is likewise mapped onto this app's "a"/"bc"
  columns as faithfully as the fixed 2-column model allows (see comments in `retencionIrpf.ts` for the exact
  mapping and its one known edge-case inaccuracy).
- **`"estado"`** (régimen común, i.e. all of Spain outside the four foral territories) has **no official simple
  table** — the AEAT computes it via a genuine formula/algorithm (mínimo personal y familiar, escala progresiva,
  reducciones) that depends on inputs this app doesn't collect (marital status, ascendientes). Because there is
  nothing to store per-territory here, `"estado"` is intentionally **excluded** from
  `ConfiguracionCalculo.territorios` and has **no admin UI** — `ConfiguracionPanel`'s territory tabs only iterate
  `TERRITORIOS_CON_TABLA` (4 tabs), while `CalculatorForm`'s selector iterates the full `TERRITORIOS` (5 options).
  `calcularTipoRetencionEstado` reproduces the official 2026 AEAT algorithm (art. 19/20/60/85 LIRPF figures,
  hardcoded with citations in `retencionEstado.ts`) under a documented simplifying assumption: single taxpayer,
  no cónyuge/ascendientes a cargo. `ResultCard` shows an extra disclaimer (`result.disclaimerEstado`) only when
  `resultado.territorio === "estado"` to flag this.

**Calculation parameters are admin-editable at runtime**, stored in a single Firestore document
`configuracion/parametros` (`functions/src/domain/configuracion.ts`):
- The document holds, per foral territory, the IRPF withholding table and the disability-minoración table, plus
  one shared (non-per-territory) Social Security rates object — all as **whole-number percentages** (e.g. `4.7`,
  not `0.047` — conversion to a fraction happens only inside the calculation). The unbounded last tramo of each
  table is stored as `hasta: null` (Firestore has no `Infinity`); `resolverConfiguracion` converts `null` →
  `Infinity` and derives each tramo's `desde` from the previous tramo's `hasta` + 0.01 — `desde` itself is never
  stored or admin-edited, which rules out gaps/overlaps by construction. This resolution happens independently
  per territory.
- `calcularTipoRetencion`/`calcularCotizacionSSMensual` don't read the hardcoded tables directly; they take the
  resolved tables/rates as parameters. `calcularNomina` (`calculadora.ts`) takes a resolved `ConfiguracionResuelta`
  (the four foral territories only) alongside the payroll input.
- If the Firestore doc is missing or fails validation (e.g. hand-edited into an inconsistent shape via the
  Firebase console), `functions/src/index.ts` falls back to `CONFIGURACION_DEFECTO` (the same hardcoded 2026
  tables) rather than failing the calculation — past `historial` entries are unaffected either way, since they
  store the resolved result, not a reference to the config.
- Updating the tables/rates only ever happens through the `actualizarConfiguracionCalculo` callable (admin-only,
  zod-validated, full-document overwrite of all four foral territories at once — never a partial merge, so a
  territory's table and rates can't drift out of sync with each other).
- There is intentionally **no admin-configurable fixed override** for the IRPF table or the minoración table
  (an earlier `irpfPorcentajeFijo`/`minoracionPuntosFijo` pair on `ConfiguracionCalculo` was removed — not useful
  enough in practice to justify per-territory duplication, and wouldn't even make sense for "estado"'s
  formula-based calculation). Instead, `CalculoNominaInput.irpfPorcentajeManual` (`number | null`) is a
  **per-calculation, user-supplied** override entered directly in `CalculatorForm` — if set, `calculadora.ts`
  applies it as the final `tipoAplicado` uniformly regardless of which territory/method computed the base rate,
  bypassing both the table lookup/minoración (foral) or the formula (estado) entirely.
  `CalculoNominaResultado.retencionIrpf.manual` records whether this happened, so `ResultCard` can suppress the
  now-irrelevant "tabla general − puntos" note.

**All callable (`onCall`) functions must set `cors: true` explicitly** — it is not on by default in this project,
and a missing `cors: true` produces a browser-side preflight failure with no server-side error/log at all (easy to
mistake for a code bug). Additionally, newly-created v2 functions may not automatically get the public Cloud Run
invoker permission (`allUsers`) on this GCP project — if a callable returns a generic Cloud Run/Google-Frontend
403 (not a Firebase `HttpsError`) even with `cors: true` set, check the Cloud Run service's IAM permissions
(Console → Cloud Run → service → Permissions → add `allUsers` as "Cloud Run Invoker").

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

**No shared package between frontend and functions:** `src/lib/types.ts` hand-duplicates the domain types
(`CalculoNominaInput`/`Resultado`, `ConfiguracionCalculo`, `Territorio`, etc.) from `functions/src/domain/types.ts`
— there's no monorepo-shared package, so the two must be kept in sync manually whenever either side's shape
changes.

**Frontend structure:** `src/lib/firebase.ts` initializes the Firebase app (config is inline, not env-based) and
wires up `functions`/`auth`/`db`. `src/lib/api.ts`, `src/lib/auth.ts`, and `src/lib/config.ts` wrap the callable
functions with typed `httpsCallable` calls. `src/components/ui/` holds shadcn/ui primitives (style `base-nova`,
see `components.json`); the `@` path alias resolves to `src/` (`vite.config.ts`). Copy is externalized to
`src/i18n/locales/{es,eu,gl,ca}.json` via i18next, with Spanish as the fallback language; all four files must keep
identical key sets (no per-language additions) since components look up the same keys regardless of active
language. Language detection order is `["querystring", "localStorage", "navigator"]` with
`lookupQuerystring: "lang"`, so `?lang=eu`/`?lang=gl`/`?lang=ca` force a language (used by `sitemap.xml`'s
hreflang alternates) and the choice is cached to `localStorage` afterwards. `src/lib/locale.ts`'s `localeIntl()`
maps an i18next language code to its Intl/BCP47 tag (`eu` → `eu-ES`, etc.) for `Intl.NumberFormat`/currency
formatting — use it instead of re-deriving the tag inline. `src/lib/fecha.ts`'s custom date formatter still
special-cases only `eu` for ISO (YYYY/MM/DD) order; Galician and Catalan use the DD/MM/YYYY order like Spanish.

**Language switcher** (`LanguageSwitcher.tsx`): an icon-triggered Popover (lucide-react's `Languages` icon, same
pattern as `NavMenu`/`AuthStatus`) that opens to the same flag-button row shown inline in earlier iterations — an
"ES" text button plus one button per non-Spanish language with an inline SVG flag (Ikurriña/Galicia/Senyera, all
viewBox `0 0 50 30` for consistent aspect ratio), no name labels next to them. Selecting one calls
`i18n.changeLanguage` and closes the popover.

**Icon-triggered popovers** (`NavMenu.tsx`, `AuthStatus.tsx`, `LanguageSwitcher.tsx`): wrap
`src/components/ui/popover.tsx` (a thin wrapper around `@base-ui/react/popover`, same pattern as `ui/select.tsx`)
around an icon-only `Button` (`variant="ghost" size="icon"`, from lucide-react) instead of showing text/links
inline in the header — keeps the sticky top bar narrow enough to avoid horizontal scroll on mobile. Open state is
controlled locally (`useState` + `onOpenChange`) so a link/action inside the popup can close it explicitly;
outside-click/Escape-to-close comes for free from Base UI. `LoginForm` has no box styling of its own (no
border/shadow/bg) since it's only ever rendered inside `PopoverContent`, which already provides that chrome.
`NavMenu` skips the popover entirely and renders a direct `Link`-as-icon-button (`Home` icon) when there are no
items besides "inicio" to show (i.e. logged out or non-admin) — the hamburger `Menu` icon with the dropdown only
appears once history/settings/admin links are actually available. `AuthStatus` shows a `ShieldCheck` icon (with
`aria-label`/`title` for accessibility) next to the email instead of a "· administración" text badge when the
signed-in user is an admin.

**Routing** (`src/App.tsx`, react-router-dom): the calculator lives at `/`; `HistorialList`, `ConfiguracionPanel`,
and `AdminPanel` were moved off the main page onto their own routes (`/history`, `/settings`, `/admin`
respectively, guarded by small `SoloConectado`/`SoloAdmin` wrapper components that redirect to `/` otherwise) and
are reached via `NavMenu.tsx`, which only lists the items the current user can access. **Route slugs are always
in English regardless of UI language** (a deliberate choice — the app only has two languages and neither es/eu
paths nor per-language route translation were wanted). The top bar (`NavMenu` + `LanguageSwitcher` + `AuthStatus`)
uses `position: sticky` (not `fixed`) so it stays visible while scrolling without needing a manual offset/padding
hack; the `<h1>`/subtitle block sits just below it in normal document flow and scrolls away normally. Firebase
Hosting's wildcard rewrite (`firebase.json`, `"source": "**" → "/index.html"`) already makes these client-side
routes work on hard refresh/direct link — no hosting config changes needed when adding routes.
