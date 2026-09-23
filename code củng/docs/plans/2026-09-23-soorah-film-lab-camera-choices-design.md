# Film Lab camera choices

## Decision

Film Lab is testing a 35 mm film roll in a film camera. The camera question offers only **Máy tự động** and **Máy chỉnh tay**, with **Máy tự động** selected on first load and after reset. The separate disposable camera product page stays as it is.

## Behavior

- Keep the two existing camera cards and their descriptions in the same two-column control layout.
- Remove the unknown and disposable camera values from the Film Lab input type, selectable cards, and camera-specific evaluation messages. Automatic and manual evaluation continue to explain their relevant limits. Automatic flash may still lower certainty because its behavior depends on the camera.
- Keep the film, scene, exposure, motion, distance, flash, preview, score, save, and share features unchanged.

## Verification

- Unit tests confirm the initial camera is automatic, manual camera guidance remains, and automatic flash still has limited certainty.
- Browser verification confirms exactly two camera buttons appear, automatic is selected initially and after reset, and manual can be selected across the supported viewports.
- Run lint, production build, and Film Lab browser checks before publishing.
