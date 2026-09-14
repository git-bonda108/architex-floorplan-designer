# Architecture

Architex is a Next.js 14 App Router application with a thin server surface (two read-only API routes backed by Prisma/PostgreSQL) and a client-heavy designer that turns a handful of parameters into an SVG floor-plan drawing. This document maps the real modules, traces the data flow, and records the design decisions visible in the code.

## Component map

| Layer | File | Responsibility |
|---|---|---|
| Pages | `nextjs_space/app/page.tsx` | Static marketing/landing page linking to `/designer`. |
| | `nextjs_space/app/designer/page.tsx` | Shell page: header plus `DesignerWorkspace`. |
| | `nextjs_space/app/layout.tsx` | Root layout, metadata/OG tags, theme provider; loads an external `apps.abacus.ai` script tag. |
| Designer | `app/designer/_components/designer-workspace.tsx` | The orchestrator. Owns all design state; fetches templates; derives sections, placed rooms, and scaled geometry. |
| | `app/designer/_components/controls-panel.tsx` | Left panel: property type, BHK type, shape, dimensions, wall/ceiling inputs. Drainage/sewage selects are rendered but not bound to state; Save/Export buttons are `disabled`. |
| | `app/designer/_components/floor-plan-canvas.tsx` | Renders the plan as a single `<svg>`: grid pattern, room rects with labels/dimensions/areas, doors, windows, fixtures, furniture, outer boundary, north arrow, overall dimension lines, plus an info bar and legend. |
| Domain logic | `lib/shape-layout-utils.ts` | `generateSections` (Regular/L/H/M decomposition into rectangles), `calculateRoomDimensions` (min-size + aspect-ratio sizing), `placeRoomsInShape` (per-shape room placement), `calculateShapeArea`, `validateShapeLayout`. |
| | `lib/floor-plan-utils.ts` | Total area, bounding box, unit conversion (m/ft), room-type color map. |
| | `lib/architectural-symbols.ts` | String-returning SVG generators: door leaf + swing arc per wall side and type, window glyphs, bathroom/kitchen fixtures, furniture, north arrow, dimension lines with extension lines and arrowheads. |
| | `lib/types.ts` | The shared vocabulary: `Room`, `Door`, `Window`, `Fixture`, `Furniture`, `Section`, `Template`, BHK/property/shape unions. |
| Data | `app/api/templates/route.ts` | `GET` list with optional `bhkType`/`propertyType` filters; falls back to two in-code templates on DB failure or empty result. |
| | `app/api/templates/[bhkType]/route.ts` | `GET` newest template for a BHK type; 400 on missing param, 404 on no match, 500 on error. |
| | `lib/db.ts` | Prisma client singleton (cached on `globalThis` outside production). |
| | `prisma/schema.prisma` | `Template` (JSON columns for rooms/doors/windows/fixtures/furniture), `Design`, `Configuration`, `UserPreference`. Only `Template` is read by any route today. |
| Seeding | `scripts/seed.ts` | Wired to `yarn prisma db seed`; clears templates and inserts a 2BHK and 3BHK with rooms only. |
| | `scripts/seed_new.ts` | Richer 2BHK/3BHK templates (doors, windows, fixtures, furniture); not referenced by `package.json` — must be run manually. |
| UI kit | `components/ui/*` | ~50 shadcn/ui primitives. Only a handful (button, input, label, separator) are imported by the designer; the rest are scaffold inventory. |

## Data flow, end to end

1. **Template fetch (async, server round-trip).** On mount and whenever `bhkType` or `propertyType` changes, `DesignerWorkspace.fetchTemplate` calls `GET /api/templates?bhkType=…&propertyType=…`. The route tries Prisma; on any DB error *or* an empty result it filters and returns `FALLBACK_TEMPLATES` instead, so the client never distinguishes DB data from fallback data. The first template in the response populates `templateRooms/Doors/Windows/Fixtures/Furniture` state.
2. **Section generation (sync, client).** A `useEffect` on `[shape, overallWidth, overallHeight]` runs `generateSections`, which decomposes the footprint into 1–3 rectangles (Regular: one; L: horizontal + vertical wing; H: two wings + bridge; M: center + two wings) using fixed percentage splits of the overall dimensions.
3. **Room placement (sync, client).** The same effect calls `placeRoomsInShape`, which lays a fixed four-room program (Living Room, Kitchen, Maid's Room, Garage) into the sections. `calculateRoomDimensions` sizes each room from a `REQUIRED_ROOMS` table of minimum width/height and preferred aspect ratio, clamped to the section. **This overwrites the fetched template's rooms** — the last writer between the fetch effect and the shape effect wins, which is the most consequential behavior in the workspace (see trade-offs).
4. **Scaling (sync, memoized).** Five `useMemo` blocks derive scaled copies of rooms, doors, windows, fixtures, and furniture: `scaleX = overallWidth / templateBounds.width` (same for Y), positions and sizes multiplied through; door/window widths use `min(scaleX, scaleY)` to stay proportional.
5. **Render (sync).** `FloorPlanCanvas` computes bounds and total area, then emits one `<svg>` with a `viewBox` in **meters as user units** — all stroke widths, font sizes, and symbol dimensions are expressed in real-world meters and scaled by the browser. Doors/windows/fixtures/furniture are injected via `dangerouslySetInnerHTML` from the string-generating symbol library. Labels are suppressed for rooms below threshold sizes (label needs width > 1.5 m; dimensions need 2.5 × 2.0 m).

## Orchestration analysis: what is parallel, sequential, async — and why

- **Sequential by construction.** Stages 2–5 are synchronous pure derivations chained through React state and `useMemo`; each depends on the previous stage's output, so there is nothing to parallelize. This is the right shape for a parametric generator: determinism and referential transparency make re-render cheap and predictable.
- **Async only at the data edge.** The single asynchronous operation is the template fetch (stage 1). It sets a `loading` flag consumed by the canvas, and errors are caught and logged, leaving the previous state intact.
- **No queue, no workers, no LLM.** Despite the AI-key placeholders in `.env.example`, the runtime contains no model calls, no background jobs, and no multi-agent coordination. Calling this anything other than a client-side sequential pipeline would misdescribe the code.

## State and context

- **Session state lives entirely in the browser.** `DesignerWorkspace` holds ~10 `useState` values (selections, template element arrays, sections, loading, a `specifications` object). There is no URL state, no localStorage, and no server-side session. Refreshing the page resets the design.
- **Persistence is schema-only.** `Design`, `Configuration`, and `UserPreference` models exist in `schema.prisma` with sensible columns (per-design specs, unit preferences), but no API route or client code writes them. The disabled Save/Export buttons in `controls-panel.tsx` are the visible edge of this planned-but-unbuilt layer.
- **Context assembly and bounding.** The "context" given to the renderer is assembled by composition: template arrays (or generated rooms) + specifications, bounded by `calculateBounds` and the section rectangles. `validateShapeLayout` exists to check that every room falls inside a section and that required room types are present, but nothing calls it — it is available invariant-checking, not enforced invariant-checking.

## Design decisions and trade-offs visible in the code

1. **Meters as SVG user units.** The `viewBox` is sized in real-world meters and every symbol/stroke/font is specified in meters (e.g. label font 0.28 m, grid stroke 0.02 m). This makes geometry code unit-free and dimension-true at any zoom, at the cost of unintuitive constants and text that scales with the drawing rather than the screen.
2. **Fallback-first resilience over error surfacing.** The templates route treats DB failure and DB emptiness identically and silently serves fallbacks. Users always see a plan; operators lose the signal that the database is down (it appears only in server logs). A deliberate availability-over-observability trade.
3. **String-generated SVG via `dangerouslySetInnerHTML`.** The symbol library returns SVG markup strings rather than JSX. This keeps the symbol code framework-independent and easy to port, but bypasses React's escaping — safe today because inputs are typed numbers/enums from code, and a real risk the moment template JSON becomes user-supplied (see HARDENING.md).
4. **Fixed percentage-based decomposition.** Shape sections and room widths are fixed fractions (L-shape: 60/40 height split; rectangular program: 28/22/32/18% widths) with 0.3–0.5 m padding between rooms. Simple, deterministic, overlap-free by construction — but not constraint-solved: the four-room shape program ignores the selected BHK type, and min-size clamps in `calculateRoomDimensions` can in principle exceed a very small section since `Math.max(width, minWidth)` is applied after the fit check.
5. **Defensive optional chaining everywhere.** Nearly every property access in the designer and utils uses `?.`/`??` (`rooms?.map?.(…) ?? null`). The app degrades to empty renders rather than crashing on malformed template JSON — appropriate given `roomsData` is an untyped `Json` column with no runtime schema validation (Zod is a dependency but is not used for this).
6. **Two seed scripts, one wired.** `seed.ts` (rooms only) is what `prisma db seed` runs; the richer `seed_new.ts` must be invoked manually. The fallback templates in the API route are a third, independent copy of template data. Three sources of truth for templates is the price paid for the no-database quickstart.
7. **Broad dependency surface.** `package.json` carries next-auth, AWS S3 SDK, Mapbox, Plotly, chart.js, jsonwebtoken, bcryptjs, and more with no imports in `app/`, `lib/`, or `components/` beyond the UI kit's needs — scaffold inventory from the template the app was generated from, kept rather than pruned.
