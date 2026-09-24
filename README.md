# DexWeave project website

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`. Only the surrounding blank page area is cropped.
- Tables: current manuscript Tables 1–3. Rows with unreported policy results are omitted.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

Each category has three placeholders: `#retargeting-gallery`, `#simulation-gallery`, and `#real-robot-gallery`. Duplicate a `.simulation-item` to add more. Replace its `.video-placeholder` with a video element and a repository-local media path.

Edit `.simulation-label` for the caption. Desktop uses the OmniRetarget three-column grid; mobile uses its Bulma Carousel library. `gallery.js` builds the mobile carousel from the same items, so each video only needs to be edited once.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and template libraries are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.

The carousel includes a local resize fix: slide dimensions are recalculated on every viewport resize, including within the same breakpoint.
