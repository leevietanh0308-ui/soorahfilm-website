# SOORAH GitHub Pages root URL

## Goal

Publish the existing SOORAH website at `https://soorahfilm-website.github.io/`, without the personal GitHub name in the address. The visible brand remains SOORAH.

## Publishing design

Use a GitHub organization named `soorahfilm-website` and its user-site repository `soorahfilm-website.github.io`. Prepare the website on a separate branch while the current project site stays online. Once the organization and repository exist, publish the prepared code to the new repository and validate the public site before replacing the shared link.

GitHub must confirm that the organization name can be claimed. Public API currently returns 404 for the name, but this is not a reservation or a guarantee.

## Code and content changes

- Build GitHub Pages output for `/` rather than `/soorahfilm-website`, so internal navigation, images, fonts, and the checkout work at the new origin.
- Set the deployment workflow's public URL to `https://soorahfilm-website.github.io` and remove its project-path prefix.
- Update the local Google Sheets integration's store link and deployment documentation.
- Preserve the current `main` deployment until the new site is live. Keep existing untracked local editor settings untouched.

## Verification and handoff

Build a static export with root-path configuration and inspect output paths. Run lint and the site's existing browser checks. Publish only after the new GitHub organization and repository are available, then verify the public homepage and a nested page. Account or organization creation requires the owner's GitHub session; the local `gh` CLI is not authenticated.
