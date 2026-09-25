# DexWeave project website

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`.
- Tables: current manuscript experiments and ablation tables. Unreported policy results use an em dash.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

`#retargeting-gallery` contains 16 locally hosted MP4s, with PNG poster frames in `assets/videos/retargeting/posters/`. Its desktop grid has four videos per row. `#simulation-gallery` contains 12 locally hosted MP4s, with PNG posters in `assets/videos/simulation/posters/`, arranged four per row. The real-robot gallery still has three placeholders. Duplicate a `.simulation-item` to add more, using a repository-local media path.

Edit `.simulation-label` for the caption. The real-robot gallery uses the OmniRetarget three-column desktop grid; mobile uses its Bulma Carousel library. `gallery.js` builds the mobile carousel from the same items, so each video only needs to be edited once.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and template libraries are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.

The carousel includes a local resize fix: slide dimensions are recalculated on every viewport resize, including within the same breakpoint.
