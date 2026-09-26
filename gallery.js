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

// Load all covers first; start every visible video without a concurrency cap.
const frames = [...document.querySelectorAll('.video-frame')];
const visibleFrames = new Set();
const players = new Map();
const downloads = new Map();
let pageReady = false;
const updateFrame = frame => {
  let video = players.get(frame);
  if (!pageReady || document.hidden || !visibleFrames.has(frame)) { video?.pause(); return; }
  if (!video) {
    const poster = frame.querySelector('.video-poster');
    video = document.createElement('video');
    video.controls = video.muted = video.defaultMuted = video.loop = video.playsInline = true;
    video.preload = 'auto';
    video.poster = poster.src;
    video.setAttribute('aria-label', frame.getAttribute('aria-label'));
    players.set(frame, video);
    poster.replaceWith(video);
    // A media document supplies a local, seekable Blob with one host request.
    const source = document.createElement('iframe');
    const url = new URL(frame.dataset.video, document.baseURI);
    url.pathname += '.svg';
    source.hidden = true;
    source.title = 'Video data';
    source.src = url.href;
    frame.append(source);
    downloads.set(source.contentWindow, { frame, source });
  }
  if (video.src) video.play().catch(() => {});
};
window.addEventListener('message', event => {
  const pending = downloads.get(event.source);
  if (!pending || event.data?.type !== 'video-data' || !(event.data.blob instanceof Blob)) return;
  players.get(pending.frame).src = URL.createObjectURL(event.data.blob);
  downloads.delete(event.source);
  pending.source.remove();
  updateFrame(pending.frame);
});
const updatePlayback = () => frames.forEach(updateFrame);
const pauseVideos = () => players.forEach(video => video.pause());
const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleFrames.add(target); else visibleFrames.delete(target);
    updateFrame(target);
  });
});
frames.forEach(frame => visibilityObserver.observe(frame));
window.addEventListener('load', () => { pageReady = true; updatePlayback(); }, { once: true });
document.addEventListener('visibilitychange', updatePlayback);
window.addEventListener('pagehide', pauseVideos);
window.addEventListener('pageshow', updatePlayback);
