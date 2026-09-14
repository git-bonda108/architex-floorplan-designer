# Evaluation

## What exists today

**There is no automated test suite in this repository.** No test files, no test runner configuration, and no `test` script in `nextjs_space/package.json`. (Earlier documentation referenced `yarn test`; that command does not exist.) No coverage or quality metrics have ever been produced, so none are cited here.

What the codebase does have:

- **Type checking as a build gate.** `next.config.js` sets `typescript.ignoreBuildErrors: false`, so `yarn build` fails on TypeScript errors. This is the only automated correctness gate. Note that ESLint is *not* a gate (`eslint.ignoreDuringBuilds: true`).
- **An unused validation function.** `lib/shape-layout-utils.ts` exports `validateShapeLayout(rooms, sections)`, which checks that all four required room types are present and that every room lies inside some section. Nothing calls it. It is the natural seed of a property-based test.

## Edge cases the code visibly handles

Enumerated from the source, not from intent:

| Concern | Where | Behavior |
|---|---|---|
| Database down or unreachable | `app/api/templates/route.ts` | Inner try/catch around the Prisma query; logs a warning and serves in-code fallback templates. Outer catch returns fallbacks even on unexpected errors. |
| Database empty | same | `templates.length > 0` check; empty results also fall through to fallbacks. |
| Missing path parameter | `app/api/templates/[bhkType]/route.ts` | Returns 400. Unknown BHK type returns 404; query failure returns 500. |
| Template fetch failure on the client | `designer-workspace.tsx` | try/catch/finally around `fetch`; errors are logged, `loading` always cleared, previous rooms retained. |
| Empty or missing room arrays | `floor-plan-utils.ts`, `floor-plan-canvas.tsx` | `calculateBounds` returns `{0,0}` for empty input; the canvas renders an explicit "No floor plan available" empty state; a `loading` state shows a spinner. |
| Malformed template JSON | throughout designer components and utils | Pervasive optional chaining and `??` defaults (`room?.width ?? 0`, `rooms?.map?.(…) ?? null`) degrade to empty/zero rendering instead of throwing. |
| Rooms too small to label | `floor-plan-canvas.tsx` | Labels suppressed below 1.5 m width; dimension text below 2.5 × 2.0 m; area text below 3.0 m height. |
| Tight sections in room sizing | `shape-layout-utils.ts` | `calculateRoomDimensions` falls back to minimum dimensions when available area ≤ 1.2× the minimum area, and re-fits width/height when either exceeds the section. |
| Unknown room type color | `floor-plan-utils.ts` | Color map falls back to a default grey. |

Not handled (visible gaps): no request timeouts or retries anywhere (Prisma and `fetch` both run with defaults); no runtime schema validation of the `Json` template columns (Zod is installed but unused); `parseFloat` on the dimension inputs can produce `NaN`, which propagates into the scale factors with no guard; the fallback path masks database outages from API consumers.

## Proposed evaluation harness

*This section is a design proposal; none of it exists yet.*

The system is well suited to cheap, deterministic testing because stages 2–4 of the pipeline are pure functions.

### 1. Unit and property tests (highest value, lowest cost)

Runner: Vitest (or Jest) + `@testing-library/react` for component smoke tests. Add `"test": "vitest run"` to `package.json`.

- **Golden dataset shape:** a directory of JSON cases, one per `(shape, overallWidth, overallHeight)` triple — e.g. the four shapes × {small 8×6, default 12×10, large 20×16, degenerate 3×3} — each recording the expected section rectangles and placed-room rectangles. Regenerate deliberately; diff on change.
- **Property tests** over randomized dimensions (within UI-plausible ranges):
  - Every placed room lies inside a section (`validateShapeLayout` finally gets called — promote it to the assertion).
  - No two rooms overlap (pairwise rectangle intersection).
  - All four required room types are present.
  - `calculateShapeArea(sections)` ≤ overall width × height.
  - Unit conversion round-trips within tolerance (`convertUnits(convertUnits(x, m, ft), ft, m) ≈ x`).
- **Symbol library tests:** each `generate*SVG` output parses as valid XML for every enum value and wall side; dimension-line labels match the requested text.

### 2. API tests

Run the route handlers directly (they are plain functions) with a test database and with `DATABASE_URL` unset:

- Filtered and unfiltered `/api/templates` queries return arrays with the expected shapes.
- DB-down path returns fallback templates (assert on the known fallback ids).
- `/api/templates/{bhkType}` returns 400/404/200 as specified.

### 3. Visual regression

Playwright screenshot tests of `/designer` for each shape at the default dimensions, compared against committed baselines. This is the only practical way to gate the SVG rendering (label suppression thresholds, door swing arcs, dimension lines) without hand-writing hundreds of geometry assertions.

### 4. Gates

- CI (e.g. GitHub Actions): `yarn build` (type check) + unit/property tests on every push; API + visual tests on PRs to `master`.
- Merge gate: all property invariants green; visual diffs require explicit approval.
- Proposed metrics to start tracking honestly: line coverage of `lib/` (target the pure logic first — realistic near-term target is high coverage of `shape-layout-utils.ts` and `floor-plan-utils.ts`, which contain the algorithms that can actually regress silently).
