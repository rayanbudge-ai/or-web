/* ── SCROLL REVEAL ── */
function triggerReveal() {
  const els = document.querySelectorAll('#page-' + currentPage() + ' .reveal:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

function currentPage() {
  const p = document.querySelector('.page.active');
  return p ? p.id.replace('page-', '') : 'home';
}

setTimeout(() => triggerReveal(), 200);
