// One card per video on every screen; mobile uses native horizontal scrolling.
document.querySelectorAll('.simulation-grid').forEach(grid => {
  const shell = document.createElement('div');
  shell.className = 'gallery-shell';
  grid.before(shell);
  shell.append(grid);
  [-1, 1].forEach(direction => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-nav gallery-${direction < 0 ? 'prev' : 'next'}`;
    button.setAttribute('aria-label', direction < 0 ? 'Previous video' : 'Next video');
    button.setAttribute('aria-controls', grid.id);
    button.textContent = direction < 0 ? '‹' : '›';
    button.addEventListener('click', () => {
      const index = (Math.round(grid.scrollLeft / grid.clientWidth) + direction + grid.children.length) % grid.children.length;
      grid.scrollTo({ left: index * grid.clientWidth, behavior: 'smooth' });
    });
    shell.append(button);
  });
});

// Start every visible video without waiting for unrelated page assets.
const frames = [...document.querySelectorAll('.video-frame')];
const visibleFrames = new Set();
const players = new Map();
let pageActive = true;
const isVisible = frame => pageActive && !document.hidden && visibleFrames.has(frame);
const updateFrame = frame => {
  let player = players.get(frame);
  if (!isVisible(frame)) { player?.video.pause(); return; }
  if (!player) {
    const poster = frame.querySelector('.video-poster');
    const video = document.createElement('video');
    video.controls = video.muted = video.defaultMuted = video.loop = video.playsInline = true;
    video.disableRemotePlayback = true;
    video.preload = 'auto';
    video.poster = poster.src;
    video.setAttribute('aria-label', frame.getAttribute('aria-label'));
    poster.replaceWith(video);
    // Append fragmented MP4 data as it arrives, without waiting for the whole clip.
    const partCount = Number(frame.dataset.parts);
    const media = new (window.MediaSource || window.ManagedMediaSource)();
    let buffer, pendingPart, nextPart = 0, loading = false;
    const appendPart = () => {
      if (!buffer || buffer.updating) return;
      if (pendingPart) { buffer.appendBuffer(pendingPart); pendingPart = null; nextPart++; }
      else if (nextPart === partCount && media.readyState === 'open') media.endOfStream();
    };
    media.addEventListener('sourceopen', () => {
      media.duration = Number(frame.dataset.duration);
      buffer = media.addSourceBuffer(`video/mp4; codecs="${frame.dataset.codec}"`);
      buffer.addEventListener('updateend', () => { appendPart(); updateFrame(frame); });
      appendPart();
    }, { once: true });
    // WebKit binds the source directly; other engines attach its object URL.
    if (window.ManagedMediaSource) video.srcObject = media; else video.src = URL.createObjectURL(media);
    const loadPart = () => {
      if (!isVisible(frame) || loading || pendingPart || buffer?.updating || nextPart === partCount) return;
      loading = true;
      const source = document.createElement('script');
      const url = new URL(frame.dataset.video, document.baseURI);
      url.pathname += `.part${String(nextPart + 1).padStart(2, '0')}.js`;
      source.src = url.href;
      source.addEventListener('video-data', ({ detail }) => {
        pendingPart = detail;
        loading = false;
        appendPart();
      }, { once: true });
      source.addEventListener('load', () => source.remove(), { once: true });
      frame.append(source);
    };
    player = { video, loadPart };
    players.set(frame, player);
  }
  player.loadPart();
  player.video.play().catch(() => {});
};
const updatePlayback = () => frames.forEach(updateFrame);
const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleFrames.add(target); else visibleFrames.delete(target);
  });
  updatePlayback();
});
frames.forEach(frame => visibilityObserver.observe(frame));
document.addEventListener('visibilitychange', updatePlayback);
window.addEventListener('pagehide', () => { pageActive = false; updatePlayback(); });
window.addEventListener('pageshow', () => { pageActive = true; updatePlayback(); });
