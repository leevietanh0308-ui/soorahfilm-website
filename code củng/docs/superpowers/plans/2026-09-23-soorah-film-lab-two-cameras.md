# Film Lab Two Cameras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Limit the film-roll simulator to automatic and manual cameras, with automatic selected by default.

**Architecture:** `lib/film-lab.ts` owns the valid camera type, default input, and camera-specific guidance. `components/film-lab/FilmLab.tsx` renders the two choices. Existing tests cover the evaluator, while Playwright checks the interactive selection and reset.

**Tech Stack:** TypeScript, React, Next.js, Node test runner, Playwright.

---

### Task 1: Camera input and evaluator

**Files:**
- Modify: `lib/film-lab.test.ts`
- Modify: `lib/film-lab.ts`

- [x] **Step 1: Replace the unknown-camera test with valid camera behavior**

```ts
test("automatic camera is the starting choice; manual guidance and auto flash remain", () => {
  assert.equal(initialShot.camera, "auto");
  assert.match(evaluateShot({ ...initialShot, camera: "manual" }).reasons.join(" "), /khẩu độ và tốc độ/);
  assert.equal(evaluateShot({ ...initialShot, flash: "auto" }).certainty, "limited");
});
```

- [x] **Step 2: Run the unit tests and confirm the default assertion fails**

```sh
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test lib/film-lab.test.ts
```

Expected: the new `initialShot.camera` assertion fails because it is currently `unknown`.

- [x] **Step 3: Narrow the camera model and remove obsolete camera messages**

```ts
export type CameraType = "auto" | "manual";
export const initialShot: ShotInput = {
  camera: "auto", scene: "cafe", light: 2, subject: "still", distance: 2, flash: "off",
};
const certainty = input.flash === "auto" ? "limited" : "contextual";
if (input.camera === "manual") {
  reasons.push("Máy chỉnh tay còn phụ thuộc khẩu độ và tốc độ bạn chọn; Film Lab chưa nhận hai thông số này.");
}
```

Delete the old `unknown` and `disposable` branches in `evaluateShot`.

- [x] **Step 4: Run the unit tests again**

```sh
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test lib/film-lab.test.ts
```

Expected: all Film Lab unit tests pass.

### Task 2: Choice controls and browser verification

**Files:**
- Modify: `components/film-lab/FilmLab.tsx`
- Modify: `scripts/verify-film-lab.mjs`

- [x] **Step 1: Render only the two valid choices and delete the unknown hint**

```ts
const cameraOptions: { value: CameraType; label: string; detail: string }[] = [
  { value: "auto", label: "Máy tự động", detail: "Máy tự đo sáng" },
  { value: "manual", label: "Máy chỉnh tay", detail: "Bạn tự chọn thông số" },
];
```

Delete the conditional paragraph shown only for the unknown camera directly after `.lab-camera-grid`.

- [x] **Step 2: Check default, manual selection, and reset in each viewport**

```js
const cameraChoices = page.locator(".lab-camera-grid button");
assert.equal(await cameraChoices.count(), 2);
assert.equal(await page.getByRole("button", { name: /Máy tự động/ }).getAttribute("aria-pressed"), "true");
await page.getByRole("button", { name: /Máy chỉnh tay/ }).click();
assert.equal(await page.getByRole("button", { name: /Máy chỉnh tay/ }).getAttribute("aria-pressed"), "true");
await page.getByRole("button", { name: /THỬ LẠI TỪ ĐẦU/ }).click();
assert.equal(await page.getByRole("button", { name: /Máy tự động/ }).getAttribute("aria-pressed"), "true");
```

- [x] **Step 3: Run the browser check**

```sh
npm run dev
node scripts/verify-film-lab.mjs
```

Expected: all five viewports pass, including accessibility checks.

### Task 3: Final verification and publication

**Files:**
- Modify: `docs/superpowers/plans/2026-09-23-soorah-film-lab-two-cameras.md`
- Modify: `README.md`

- [x] **Step 1: Verify lint and production build**

```sh
npm run lint
npm run build
git diff --check
```

Expected: all commands succeed.

- [x] **Step 2: Commit and push**

```sh
git add README.md lib/film-lab.ts lib/film-lab.test.ts components/film-lab/FilmLab.tsx scripts/verify-film-lab.mjs docs/superpowers/plans/2026-09-23-soorah-film-lab-two-cameras.md
git commit -m "Limit Film Lab to automatic and manual cameras"
git push origin main
```

Expected: GitHub Pages deploys the updated Film Lab.
