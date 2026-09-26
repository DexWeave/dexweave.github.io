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
document.querySelectorAll('.video-preview img').forEach(image => posterObserver.observe(image));

// Attach the only player and its MP4 source after an explicit click.
const player = document.createElement('video');
player.controls = true;
player.muted = true;
player.defaultMuted = true;
player.playsInline = true;
player.loop = true;
player.preload = 'none';
let activePreview = null;
const releasePlayer = () => {
  if (!activePreview) return;
  playbackObserver.unobserve(activePreview.parentElement);
  player.pause();
  player.removeAttribute('src');
  player.load();
  player.remove();
  activePreview.hidden = false;
  activePreview = null;
};
const playbackObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.target === activePreview?.parentElement && !entry.isIntersecting)) releasePlayer();
});
document.querySelectorAll('.video-preview').forEach(preview => {
  preview.addEventListener('click', () => {
    releasePlayer();
    activePreview = preview;
    preview.hidden = true;
    preview.parentElement.append(player);
    player.setAttribute('aria-label', preview.getAttribute('aria-label').replace(/^Play /, ''));
    player.muted = true;
    player.src = preview.dataset.video;
    playbackObserver.observe(preview.parentElement);
    player.play().catch(() => {}); // Native controls stay available; never retry requests automatically.
  });
});
document.addEventListener('visibilitychange', () => { if (document.hidden) releasePlayer(); });
window.addEventListener('pagehide', releasePlayer);
