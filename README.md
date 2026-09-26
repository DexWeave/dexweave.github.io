# DexWeave project website

[Open the anonymous review site](https://anonymous.4open.science/w/review-site-f533e2f81fcb/index.html).

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`.
- Tables: current manuscript experiments and ablation tables. Unreported policy results use an em dash.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

The galleries use compressed H.264 MP4 files at up to 1280×720 (720p), with yuv420p pixels and fast-start metadata. Original frame counts and complete motions are retained; sources below 720p keep their original resolution. All videos are silent and have small JPEG cover images. The page and all covers load first. Every video currently visible on screen then autoplays muted in a loop, with no concurrency cap or playback queue. A video receives its MP4 source on its first visible appearance. Scrolling it offscreen or leaving the page pauses it; returning resumes from the same position and retains the existing source and buffer. Offscreen videos that have never been viewed do not download. The hosting service still controls its own request limits.

Retargeting and Sim-to-Sim Loco-Manipulation videos use four desktop columns. Sim-to-Sim Locomotion has three columns at the same card width. Real robot results has separate three-video Loco-Manipulation and Locomotion grids spanning the full gallery width. Real-robot MP4s have no audio tracks and no visible per-video captions.

The anonymous host does not provide MP4 byte-range responses. The player loads each visible clip's generated `.mp4.js` payload once and gives its original MP4 bytes to a browser Blob URL. This supplies a local, seekable media source without relying on host range or CORS support. Only the payload is downloaded during playback; MP4 files remain available as downloadable source assets.

Edit a frame's `data-video` for the MP4 path and its image's `src` for the cover image. After adding or replacing a video, run `python3 scripts/build-video-payloads.py` and commit the MP4, generated `.mp4.js`, and updated HTML together. Edit `aria-label` for the accessible description and `.simulation-label` where a visible caption is used. Mobile uses the same cards in a native scroll-snap gallery with previous/next controls; no video nodes are cloned.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and Bulma CSS are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.
