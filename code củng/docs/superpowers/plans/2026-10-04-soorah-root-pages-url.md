# SOORAH Root GitHub Pages URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare SOORAH for `https://soorahfilm-website.github.io/` while keeping the current site online until the new publishing account is ready.

**Architecture:** The Next.js static export must omit the project `basePath`. The root GitHub Actions workflow supplies the new public origin; the image loader and metadata already read the same path and origin variables. Documentation and the Google Sheets integration must use the new URL.

**Tech Stack:** Next.js 15, TypeScript, GitHub Actions, GitHub Pages, Google Apps Script source.

---

### Task 1: Root-path static export

**Files:**
- Modify: `code củng/next.config.ts`
- Modify: `.github/workflows/deploy-pages.yml`

- [x] **Step 1: Remove the default project path**

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
// Inside the GitHub Pages conditional config:
...(basePath ? { basePath } : {}),
```

The workflow's build environment must set `NEXT_PUBLIC_BASE_PATH` to an empty string and `NEXT_PUBLIC_SITE_URL` to `https://soorahfilm-website.github.io`.

- [x] **Step 2: Build root static output**

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH='' NEXT_PUBLIC_SITE_URL=https://soorahfilm-website.github.io npm run build
```

Expected: `out/index.html` and `out/film-lab/index.html` exist, and emitted asset URLs start at `/_next/` or `/images/` rather than `/soorahfilm-website/`.

### Task 2: References and documentation

**Files:**
- Modify: `code củng/integrations/google-sheets/Code.gs`
- Modify: `code củng/README.md`

- [x] **Step 1: Update the store link**

```js
const STORE_URL = "https://soorahfilm-website.github.io/";
```

- [x] **Step 2: Document the new GitHub organization and repository**

```text
Organization: soorahfilm-website
Repository: soorahfilm-website.github.io
Pages source: GitHub Actions
Public site: https://soorahfilm-website.github.io/
```

Mention that the current project site stays online until the root site passes a public check.

### Task 3: Verify and publish preparation

**Files:**
- Modify: `code củng/docs/superpowers/plans/2026-10-04-soorah-root-pages-url.md`

- [x] **Step 1: Run quality checks**

```sh
npm run lint
git diff --check
```

Expected: both commands succeed. Inspect exported HTML and confirm the new metadata origin.

- [x] **Step 2: Commit the migration branch**

```sh
git add .github/workflows/deploy-pages.yml 'code củng/next.config.ts' 'code củng/integrations/google-sheets/Code.gs' 'code củng/README.md' 'code củng/docs/superpowers/plans/2026-10-04-soorah-root-pages-url.md'
git commit -m 'Prepare SOORAH for root GitHub Pages URL'
git push origin pages-root-url
```

Expected: current `main` deployment remains unchanged. Publishing the new live URL depends on creating the named GitHub organization and its user-site repository; then push the prepared source, enable GitHub Actions for Pages, and verify `/` and `/film-lab/`.

### Task 4: Activate the new public URL

- [ ] Create the GitHub organization `soorahfilm-website` and public repository `soorahfilm-website.github.io` using the owner's GitHub account.
- [ ] Publish the tested branch as `main` in the new repository and set Pages source to GitHub Actions.
- [ ] Confirm the deployment workflow succeeds and both `https://soorahfilm-website.github.io/` and `/film-lab/` load correctly.
