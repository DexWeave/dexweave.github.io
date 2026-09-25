document.querySelectorAll('.simulation-grid').forEach(grid => {
  const carousel = document.createElement('div');
  carousel.id = `${grid.id}-mobile`;
  carousel.className = 'results-carousel mobile-carousel';
  carousel.setAttribute('aria-label', grid.getAttribute('aria-label'));
  carousel.append(...[...grid.children].map(item => item.cloneNode(true)));
  grid.after(carousel);
  new bulmaCarousel(carousel, { slidesToScroll: 1, slidesToShow: 1, loop: true, infinite: false, autoplay: false, breakpoints: [] });
  carousel.querySelectorAll('.slider-navigation-previous, .slider-navigation-next').forEach(control => {
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');
    control.setAttribute('aria-label', control.classList.contains('slider-navigation-next') ? 'Next video' : 'Previous video');
    control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); control.click(); } });
  });
});

const resultVideoObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target: video, intersectionRatio }) => {
    if (intersectionRatio >= 0.5) video.play().catch(() => {});
    else video.pause();
  });
}, { threshold: [0, 0.5] });
document.querySelectorAll('.retargeting-item video, #simulation-gallery video, #simulation-gallery-mobile video').forEach(video => resultVideoObserver.observe(video));
