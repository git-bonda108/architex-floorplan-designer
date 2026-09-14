# Hardening

Production-readiness assessment of what is actually in the code, followed by a staged ladder to a hardened deployment.

## Current posture

**Authentication and authorization.** None. Both API routes are public reads; there are no writes to protect yet. `next-auth`, `jsonwebtoken`, and `bcryptjs` are installed but unused — auth is an intention, not a feature. Acceptable today only because the API is read-only over non-sensitive template data.

**Secrets handling.** `DATABASE_URL` is read from the environment via Prisma; `.env` is gitignored in `nextjs_space/` and (as of this commit) at the repository root. `.env.example` contains placeholders only. Historically this repository committed real credentials in documentation files — see the appendix below; those values are now redacted at HEAD but **remain in git history and must be rotated**.

**Input handling.** Query parameters are passed into a Prisma `where` object built from an `any`-typed map — parameterized by Prisma, so no SQL injection, but also unvalidated (any string is accepted as a `bhkType`). The `Json` template columns are consumed with no runtime schema validation. Client dimension inputs go through `parseFloat` with no NaN/range guard.

**Rendering safety.** Doors, windows, fixtures, and furniture are injected into the SVG via `dangerouslySetInnerHTML` from string-building generators. Inputs are currently typed numbers/enums originating in code, so this is safe *today*; it becomes an XSS vector the moment template data can be authored by users. No Content-Security-Policy is configured.

**Third-party exposure.** `app/layout.tsx` loads an external script from `apps.abacus.ai` on every page with no Subresource Integrity attribute — a supply-chain trust on that host, and not required by any feature in this repository's code. The dependency tree is also far larger than the code requires (AWS SDK, Mapbox, Plotly, chart.js, next-auth, and others are unimported), inflating audit surface.

**Error handling and observability.** Server errors are caught and logged with `console.log/warn/error`; the templates route deliberately converts database failures into successful fallback responses, so an outage is invisible to consumers and to any uptime check that hits the API. No structured logging, no metrics, no tracing, no health endpoint.

**Build/deploy hygiene.** TypeScript errors fail the build (good); ESLint is skipped during builds. `prisma/schema.prisma` hard-codes a generator `output` path under `/home/ubuntu/architect_pro/…` from the original build machine, which breaks `prisma generate` portability on other layouts. Prisma migrations are gitignored (`nextjs_space/.gitignore` ignores `migrations`), so schema history relies on `db push` — no auditable migration trail.

## Ladder to production

### Stage 1 — Identity, keys, and repo hygiene (do first)

1. Rotate every credential listed in the appendix; they are recoverable from git history regardless of HEAD redaction.
2. Purge the secrets from history (`git filter-repo` or BFG) and force-push, or archive and re-cut the repository if history rewrite is unacceptable.
3. Remove or SRI-pin the `apps.abacus.ai` script tag; it is unused by the application code.
4. Fix the Prisma generator `output` to the default (remove the absolute path) so any machine can `prisma generate`.
5. Validate API input: constrain `bhkType`/`propertyType` to their known unions (the Zod dependency already present is the natural tool), and parse template `Json` columns through the same schemas at the API boundary.
6. When Save lands, put authentication in front of any write route before it ships (next-auth is already a dependency), and scope designs to their owners.

### Stage 2 — Monitoring and failure visibility

1. Add a `/api/health` route that actually queries the database, so fallback mode is detectable from outside.
2. Distinguish fallback responses (e.g. an `X-Data-Source: fallback` header or response field) instead of silently masking outages.
3. Replace `console.*` with structured logging; forward to the platform's log drain. Add error tracking (e.g. Sentry) for both the API routes and the client designer.
4. Track the one metric that matters first: fallback-serve rate. A nonzero rate is a database incident.

### Stage 3 — Deployment discipline

1. Commit Prisma migrations (stop gitignoring `migrations/`); move from `db push` to `migrate deploy` in the release pipeline.
2. CI gate: `yarn build` + the test harness proposed in [EVALUATION.md](./EVALUATION.md); re-enable ESLint in builds once the existing violations are burned down.
3. Prune unused dependencies (AWS SDK, Mapbox, Plotly, chart.js, and the rest of the unimported set) to shrink the audit and CVE surface, and drop the `ie >= 11` browserslist target, which no longer matches the React 18 baseline.
4. Add a CSP (script-src limited to self plus any deliberately retained third parties) and standard security headers via `next.config.js` headers.
5. Pin the connection-pool posture for serverless (pooled connection string / PgBouncer as the Supabase guide in this repo describes) so Prisma does not exhaust Postgres connections under concurrency.

### Stage 4 — Compliance and data protection (relevant once user accounts and saved designs exist)

1. Define retention and deletion for `Design`/`UserPreference` rows; add a delete-my-data path.
2. TLS-only database access (`sslmode=require` everywhere), least-privilege DB roles (the app needs read on `Template`, read/write on user tables only).
3. Secret management via the deployment platform's encrypted store; no `.env` files on servers.
4. Dependency and license audit as a release step (`yarn audit` / OSV scanning) — particularly important given the large dependency tree.

---

## Secrets removed from HEAD — rotate these credentials and purge history

The following files contained real credential values at HEAD. Values are now replaced with `<REDACTED-ROTATE-ME>` (or the file removed where redaction was impossible), but **all of them persist in git history until history is rewritten. Rotate every one of these at the provider immediately.**

| Location | What was exposed | Action taken at HEAD |
|---|---|---|
| `SUPABASE_CONNECTION_GUIDE.md` | Supabase Postgres password (with live project host) in four connection strings | Password redacted |
| `DEPLOYMENT_STATUS.md` | Same Supabase Postgres password in two connection strings | Password redacted |
| `API_KEYS_SETUP.md` | Real OpenAI, DeepSeek, Groq, and Gemini API keys in a sample `.env` block | All four values redacted |
| `SUPABASE_CONNECTION_GUIDE.pdf` | PDF render of the guide, embedding the same database credentials | File deleted (PDF cannot be redacted in place) |
| `DEPLOYMENT_STATUS.pdf` | PDF render embedding the same database credentials | File deleted |
| `VERCEL_DEPLOYMENT_GUIDE.pdf` | PDF embedding the same database credentials | File deleted |
| `.abacus.donotdelete` | Opaque encrypted platform token from the original hosting platform | File deleted and pattern gitignored |

Additional hygiene applied: root `.gitignore` now excludes `.env`/`.env.*` (keeping `.env.example`).
