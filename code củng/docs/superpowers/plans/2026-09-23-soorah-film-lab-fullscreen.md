# SOORAH Film Lab Fullscreen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep Film Lab controls, preview and three-color assessment together within one browser viewport.

**Architecture:** Extend the pure evaluator with display signals, then arrange the existing workbench into one `100dvh` grid whose controls scroll internally. Keep the original image and illustrative estimate side by side behind an accessible comparison slider.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Node test runner, Playwright, axe-core.

---

## File map

- `lib/film-lab.ts`: pure overall status and three factor signals.
- `lib/film-lab.test.ts`: status behavior for bright light, dim scenes, flash far/off and unknown equipment.
- `components/film-lab/FilmLab.tsx`: compact workbench, comparison slider, signals and in-view quick actions.
- `app/film-lab/film-lab.css`: viewport layout at desktop, tablet, mobile and short heights.
- `scripts/verify-film-lab.mjs`: browser assertions for visibility, slider keyboard use, colors, scrolling, WCAG.
- `README.md`: revised Film Lab description.

### Task 1: Three-color assessment

- [x] Add failing tests for `assessShot`:

```ts
const bright = assessShot(initialShot, evaluateShot({ ...initialShot, scene: "sunny", light: 5 }));
assert.equal(bright.overall, "low");
const distant = { ...initialShot, scene: "concert", distance: 20, flash: "on" } as const;
assert.equal(assessShot(distant, evaluateShot(distant)).flash.status, "high");
```

- [x] Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test lib/film-lab.test.ts`; confirm failure.
- [x] Add `assessShot(input, result)` in `lib/film-lab.ts`: expose overall risk, light/motion/flash status and one-line finding; keep flash OFF neutral and excluded from worst-risk calculation.
- [x] Run the same tests; confirm pass.

### Task 2: One-viewport workbench

- [x] In `FilmLab.tsx`, replace the before/after toggle with a labeled range input `min=0 max=100` that clips the illustrative image by its percentage. Keep source and estimate labels visible.
- [x] Move the quick-change buttons and flash-range note inside the scrollable controls region.
- [x] Render three colored dots with one active for `assessShot().overall` and three factor signals with status text and short finding.
- [x] Replace the tall workbench heading with a compact header; keep science, recommendations, save card and disclosure below the workbench.
- [x] In `film-lab.css`, set workbench height to `100dvh`, make controls independently scrollable, and keep preview plus score visible. On mobile stack preview/score over the controls; on short screens let the image shrink before hiding text.
- [x] Run lint and build; fix errors.

### Task 3: Browser and deployment

- [x] Extend `scripts/verify-film-lab.mjs` to assert that the workbench fits the viewport, the image and score remain in view after control changes, and keyboard input changes the comparison slider.
- [x] Check three-color behavior for bright, dim, moving and far-flash setups; run WCAG A/AA at desktop, tablet, mobile and short-height viewports.
- [x] Run the existing SOORAH regression script, normal build and `GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/soorahfilm-website npm run build`.
- [x] Update `README.md`, commit, push `main` and confirm GitHub Pages returns the revised Film Lab page.

## Review

The user selected an in-page fullscreen workbench and authorized pushing the completed change. Inline execution is used; no subagent delegation was requested.
