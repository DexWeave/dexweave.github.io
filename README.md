# DexWeave project website

[Open the anonymous review site](https://anonymous.4open.science/w/review-site-f533e2f81fcb/index.html).

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`.
- Tables: current manuscript experiments and ablation tables. Unreported policy results use an em dash.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

The galleries use repository-local H.264 MP4 files and small JPEG poster frames. Only nearby posters load. Videos start muted automatically when at least half visible, with at most two players buffering/playing at a time. On completion, a player gives its slot to the next waiting visible video; once the visible queue is exhausted, the remaining players repeat without replacing their sources. Scrolling a video offscreen or hiding the page releases its source. There is no offscreen video prefetch or automatic retry of failed requests. The hosting service still controls its own request limits.

Retargeting and Sim-to-Sim Loco-Manipulation videos use four desktop columns. Sim-to-Sim Locomotion has three columns at the same card width. Real robot results has separate three-video Loco-Manipulation and Locomotion grids spanning the full gallery width. Real-robot MP4s have no audio tracks and no visible per-video captions.

Edit a frame's `data-video` for the MP4 path and its image's `data-src` for the poster. Edit `aria-label` for the accessible description and `.simulation-label` where a visible caption is used. Mobile uses the same cards in a native scroll-snap gallery with previous/next controls; no video nodes are cloned.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and Bulma CSS are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.
