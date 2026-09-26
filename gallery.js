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

const posterObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    target.src = target.dataset.src;
    delete target.dataset.src;
    posterObserver.unobserve(target);
  });
}, { rootMargin: '150px' });
document.querySelectorAll('.video-poster').forEach(image => posterObserver.observe(image));

// Autoplay only visible cards, with at most two downloads/decoders at a time.
const visibleFrames = new Map();
const activePlayers = new Map();
const releasePlayer = frame => {
  const video = activePlayers.get(frame);
  if (!video) return;
  activePlayers.delete(frame);
  video.pause();
  video.removeAttribute('src');
  video.load();
  video.remove();
  frame.querySelector('.video-poster').hidden = false;
};
const fillPlayers = () => {
  if (document.hidden) return;
  for (const [frame, state] of visibleFrames) {
    if (activePlayers.size >= 2) break;
    if (state.played || activePlayers.has(frame)) continue;
    state.played = true;
    const video = document.createElement('video');
    video.controls = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = frame.querySelector('.video-poster').src;
    video.setAttribute('aria-label', frame.getAttribute('aria-label'));
    video.addEventListener('ended', () => {
      if ([...visibleFrames.values()].some(candidate => !candidate.played)) {
        releasePlayer(frame);
        fillPlayers();
      } else {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });
    activePlayers.set(frame, video);
    frame.querySelector('.video-poster').hidden = true;
    frame.append(video);
    video.src = frame.dataset.video;
    video.play().catch(() => {}); // Keep native controls available; never retry failed requests automatically.
  }
};
const playbackObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target: frame, isIntersecting, intersectionRatio }) => {
    if (intersectionRatio >= 0.5 && !visibleFrames.has(frame)) visibleFrames.set(frame, { played: false });
    else if (!isIntersecting) {
      visibleFrames.delete(frame);
      releasePlayer(frame);
    }
  });
  fillPlayers();
}, { threshold: [0, 0.5] });
document.querySelectorAll('.video-frame').forEach(frame => playbackObserver.observe(frame));
const stopPlayers = () => {
  [...activePlayers.keys()].forEach(releasePlayer);
  visibleFrames.forEach(state => { state.played = false; });
};
document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlayers(); else fillPlayers(); });
window.addEventListener('pagehide', stopPlayers);
window.addEventListener('pageshow', fillPlayers);
