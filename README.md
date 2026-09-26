# DexWeave project website

[Open the anonymous review site](https://anonymous.4open.science/w/review-site-f533e2f81fcb/index.html).

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`.
- Tables: current manuscript experiments and ablation tables. Unreported policy results use an em dash.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

The galleries use repository-local H.264 MP4 files and PNG poster frames. Keep one MP4 source per video to limit requests to the anonymous review host. Retargeting and Sim-to-Sim videos use four desktop columns; Real robot results has separate three-video Loco-Manipulation and Locomotion grids. Real-robot MP4s have no audio tracks and no visible per-video captions.

Edit a video's `aria-label` for its accessible description and `.simulation-label` where a visible caption is used. `gallery.js` builds the mobile carousels from the desktop grids, so each item only needs to be edited once.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and template libraries are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.

The carousel includes a local resize fix: slide dimensions are recalculated on every viewport resize, including within the same breakpoint.
