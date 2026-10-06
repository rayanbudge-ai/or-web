/* ── PAGES GÉNÉRÉES (services, blog, légal, projets, 404) ──
   Bundle à part (build.js : reveal.js + ce fichier), chargé en defer par les
   pages de build-pages.js. Le reveal au scroll démarre dans reveal.js. */
(function () {
  'use strict';
  // Header : fond plein une fois la page défilée
  const nav = document.getElementById('navbar');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

  // Études de cas : démos live en iframe 1440 × 900 mises à l'échelle du
  // cadre (dont la hauteur est fixée en CSS par aspect-ratio : aucun CLS).
  const frames = document.querySelectorAll('.browser-frame iframe');
  if (!frames.length) return;
  function scale() {
    frames.forEach(f => { f.style.transform = `scale(${f.parentElement.offsetWidth / 1440})`; });
  }
  scale();
  addEventListener('resize', scale, { passive: true });

  // Écran d'une section précise de la démo : défilement DANS l'iframe (un
  // #fragment dans src ferait défiler la page parente). Même origine.
  frames.forEach(f => {
    const id = f.dataset.anchor;
    if (!id) return;
    f.addEventListener('load', () => {
      try {
        const t = f.contentDocument.getElementById(id);
        if (t) f.contentWindow.scrollTo(0, t.getBoundingClientRect().top + f.contentWindow.scrollY);
      } catch (e) { /* démo inaccessible : on garde le haut de page */ }
    });
  });
})();
