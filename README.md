# DexWeave project website

[Open the anonymous review site](https://anonymous.4open.science/w/review-site-f533e2f81fcb/index.html).

Edit `index.html` for content and `styles.css` for appearance. Commit to `main`, then refresh the review mirror in the Anonymous GitHub dashboard.

## Figures and tables

- Teaser: manuscript Figure 1, `figures/robot.pdf` → `assets/teaser.webp`.
- Method: manuscript Figure 2, `figures/retarget_pipeline.pdf` → `assets/method-overview.webp`.
- Tables: main-text retargeting and MuJoCo sim-to-sim policy results from the current manuscript. Ablation tables are omitted.

When replacing either image, also update its `-small.webp` version and the HTML image dimensions.

## Videos

The galleries use compressed H.264 MP4 files at up to 1280×720 (720p), with yuv420p pixels and fast-start metadata. Original frame counts and complete motions are retained; sources below 720p keep their original resolution. All videos are silent and have small JPEG cover images. Covers are embedded in the page. Every video currently visible on screen starts loading immediately and autoplays muted in a loop, without waiting for unrelated page assets and without a concurrency cap or playback queue. A video receives its MP4 source on its first visible appearance. Scrolling it offscreen or leaving the page pauses playback and stops requesting subsequent parts; returning resumes from the same position with the existing source and buffer. An already requested part is allowed to finish and is retained, avoiding a repeated download. Offscreen videos that have never been viewed do not download. The hosting service still controls its own request limits.

Retargeting and Sim-to-Sim Loco-Manipulation videos use four desktop columns. Sim-to-Sim Locomotion has three columns at the same card width. Real robot results has separate three-video Loco-Manipulation and Locomotion grids spanning the full gallery width. Real-robot MP4s have no audio tracks and no visible per-video captions.

The anonymous host does not provide MP4 byte-range responses and fails to serve large script payloads. The build script remuxes each MP4 into fragmented MP4 with stream copy (no quality loss), then packages it as `.mp4.partNN.js` files with at most 1 MiB of video data per part. Every visible clip requests its next part independently after its current part has been received and appended. All visible clips can load concurrently; there is no limit on their number. Only one part per clip is in flight, and no additional parts are requested while it is offscreen or the page is hidden. The player appends received data in order to a MediaSource and can play the first fragments while later parts are still downloading. Different network response times can still produce different playback start times. WebKit binds the media source directly to the video; other engines use its object URL. iPhone uses ManagedMediaSource with remote playback disabled. The current gallery uses 158 video-part requests if every clip is viewed. MP4 files remain available as downloadable source assets.

Refreshing resets the page to the top and removes the section fragment. Opening a section link normally still scrolls to that section.

Edit a frame's `data-video` for the MP4 path and its image's `data-poster` for the cover path. After adding or replacing a video or cover, run `python3 scripts/build-video-payloads.py` (requires FFmpeg and FFprobe) and commit the MP4, generated `.mp4.partNN.js` files, and updated HTML together. Edit `aria-label` for the accessible description and `.simulation-label` where a visible caption is used. Mobile uses the same cards in a native scroll-snap gallery with previous/next controls; no video nodes are cloned.

## Template and fonts

Layout, typography, and video presentation are adapted from OmniRetarget, whose template credits Nerfies and BeyondMimic. Titles use Google Sans and body text uses Noto Sans. Fonts and Bulma CSS are hosted locally; their licenses are included in `assets/fonts/` and `assets/vendor/`.
