# SOORAH Film Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a beginner-focused Film Lab that evaluates shot risks for Ultramax 400 and gives concrete advice.

**Architecture:** Keep scenario data and a deterministic evaluator in `lib/film-lab.ts`; use a client component to collect input and render results. The App Router page supplies metadata. Reuse product data and the browser-only analytics event dispatcher.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS, Node 24 test runner, Playwright verification.

---

## File map

- `lib/film-lab.ts`: input types, scene presets, pure risk evaluator and recommendation rules.
- `lib/film-lab.test.ts`: representative scenario assertions; run with `node --experimental-strip-types --test lib/film-lab.test.ts`.
- `components/film-lab/FilmLab.tsx`: beginner controls, live result, image illustration, shot card and share/download.
- `app/film-lab/page.tsx`: route and metadata.
- `app/film-lab/film-lab.css`: scoped layout, mobile and reduced motion rules.
- `app/page.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `app/guide/page.tsx`, `components/ProductDetails.tsx`: entry points.
- `lib/analytics.ts`, `scripts/verify.mjs`, `README.md`: events, browser smoke checks and route documentation.

### Task 1: Risk evaluator

- [ ] Define `ShotInput` with `camera`, `scene`, `light`, `subject`, `distance`, and `flash`; define `ShotResult` with risk bands, explanation, three or fewer suggestions and illustrative treatment.
- [ ] Add representative failing tests before implementing the evaluator:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { evaluateShot, initialShot } from "./film-lab.ts";

test("distant flash cannot rescue a concert stage", () => {
  const result = evaluateShot({ ...initialShot, scene: "concert", distance: 20, flash: "on" });
  assert.equal(result.flashRisk, "high");
  assert.ok(result.suggestions.some((item) => item.includes("Flash")));
});
```

- [ ] Run `node --experimental-strip-types --test lib/film-lab.test.ts` and confirm failure before implementation.
- [ ] Implement the pure evaluator with stable rule ordering: scene brightness + light adjustment; nearby active flash can lower exposure risk; distant flash cannot; motion and low light raise blur risk; unknown camera lowers confidence. Keep output qualitative.
- [ ] Run the same test command and confirm all cases pass.
- [ ] Commit evaluator and tests.

### Task 2: Film Lab route and interaction

- [ ] Add `app/film-lab/page.tsx` with metadata and the `FilmLab` component.
- [ ] Build the controls in `components/film-lab/FilmLab.tsx`: camera including unknown, scene presets, light, subject motion, distance and flash. Evaluate live with `evaluateShot`.
- [ ] Render three risks, why explanations, up to three suggestions, an illustrative photo with label, flash range visualization, and a setup card. Add download/share fallback using browser APIs only.
- [ ] Track start, choice changes, result and product click via the existing event dispatcher. Do not persist personal data.
- [ ] Add `app/film-lab/film-lab.css` with a two-column desktop layout, one-column mobile layout, accessible focus states and reduced motion support.
- [ ] Run `npm run lint` and `npm run build`; fix all errors.
- [ ] Commit route and interaction.

### Task 3: Entry points and verification

- [ ] Add Film Lab to the navigation, footer, homepage feature section and guide/product cross-links. Keep product details and checkout untouched.
- [ ] Extend `AnalyticsEvent` with Film Lab events and update the existing destination count in `scripts/verify.mjs` if a destination card is added.
- [ ] Add a Film Lab browser check at desktop and mobile sizes: route loads, choices change output, no horizontal scroll, no WCAG A/AA violations, and reduced motion works.
- [ ] Run `node --experimental-strip-types --test lib/film-lab.test.ts`, `npm run lint`, `npm run build`, `GITHUB_PAGES=true npm run build`, and the browser smoke check.
- [ ] Update `README.md` route map, then commit the implementation.

## Review

The plan covers the approved quick shot check, unknown-camera path, one-variable changes, flash range illustration and saved setup card. It keeps a single-film MVP and does not claim accurate image prediction. User approval already authorizes inline execution; no subagent delegation is requested.
