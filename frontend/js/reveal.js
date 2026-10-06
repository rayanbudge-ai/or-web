/* ── REVEAL — langage d'animation partagé (accueil + pages internes) ──
   Extrait de js/accueil.js : moteur de timelines (Web Animations) et les
   deux effets d'entrée des panneaux — titre ligne par ligne derrière son
   masque, contenu qui monte en décalé. Durées, décalages et distance sont
   lus dans les tokens --rv-* de :root (base.css) : une seule source.

   - window.OrReveal : primitives utilisées par accueil.js (ouverture des
     panneaux) et par le reveal au scroll ci-dessous.
   - Pages internes : chaque titre / bloc de contenu s'anime une fois, à son
     entrée dans le viewport (IntersectionObserver). Ce qui est déjà visible
     au chargement s'anime tout de suite, en transform seul (jamais masqué).
   Fichier autonome (ES2017, aucune dépendance) : inclus dans le bundle de
   l'accueil et dans celui des pages générées (build.js). */
(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const css = getComputedStyle(root);
  const token = (n, fb) => css.getPropertyValue(n).trim() || fb;
  const ms = (n, fb) => parseFloat(token(n, '')) || fb;

  const M = {
    ease: token('--ease', 'cubic-bezier(.16, 1, .3, 1)'),
    titleDur: ms('--rv-title-dur', 550),
    titleStep: ms('--rv-title-step', 90),
    itemDur: ms('--rv-item-dur', 400),
    itemStep: ms('--rv-item-step', 40),
    itemAfter: ms('--rv-item-after', 60),
    rise: token('--rv-rise', '1.25rem'),
  };

  /* ── MOTEUR DE TIMELINES ──
     Une timeline = liste d'étapes { el, kf, at, dur, ease }. Chaque étape
     devient une animation dont delay/endDelay la calent sur la durée totale :
     reverse() rejoue alors exactement la même timeline à l'envers. fill both
     (par défaut) : avant son départ, chaque élément tient sa première image. */
  function play(steps, opts) {
    opts = opts || {};
    steps = steps.filter(s => s.el);
    const total = Math.max(0, ...steps.map(s => s.at + s.dur));
    const anims = steps.map(s => {
      const a = s.el.animate(s.kf, {
        duration: s.dur, delay: s.at, endDelay: total - s.at - s.dur,
        easing: s.ease || M.ease, fill: opts.fill || 'both',
      });
      if (opts.reverse) a.reverse();
      if (opts.rate) a.playbackRate = (opts.reverse ? -1 : 1) * opts.rate;
      return a;
    });
    return Promise.all(anims.map(a => a.finished.catch(() => {}))).then(() => anims);
  }

  const fade = (a, b) => [{ opacity: a }, { opacity: b }];
  /* Montée depuis le bas (translateY + opacity) ; en mouvement réduit,
     simple fondu : aucune timeline ne déplace quoi que ce soit. */
  const rise = d => reduce.matches ? fade(0, 1)
    : [{ opacity: 0, transform: `translateY(${d})` }, { opacity: 1, transform: 'none' }];

  const linesOf = title => title ? Array.from(title.querySelectorAll('.ht-in')) : [];

  /* Titre ligne par ligne : chaque .ht-in monte de `from` dans son masque */
  function titleSteps(title, at, from) {
    return linesOf(title).map((l, i) => ({
      el: l, at: at + i * M.titleStep, dur: M.titleDur,
      kf: [{ transform: `translateY(${from || '105%'})` }, { transform: 'none' }],
    }));
  }
  /* Contenu en décalé */
  function itemSteps(items, at, kf) {
    return items.map((n, i) => ({ el: n, at: at + i * M.itemStep, dur: M.itemDur, kf: kf || rise(M.rise) }));
  }

  /* ── REVEAL AU SCROLL (pages internes) ──
     Titres h2 / h3 de section : ligne par ligne (balisage .ht-line > .ht-in
     généré ici s'il manque). Blocs : eyebrows, paragraphes, cartes, lignes
     de liste, tags, CTA, éléments de grille (un décalage par élément).
     L'en-tête de page (.page-head) est animé en CSS (css/reveal.css). */
  const TITLES = '.sec-title, .prose h2, .proj-h2';
  const ITEMS = [
    '.marginalia', '.sec-p', '.prose > :not(h2)', '.actions', '.link-list', '.tags',
    '.card-grid > li', '.row-item', '.info-row', '.faq-item', '.proof',
    '.port-filters-wrap > *', '.form-field', '.form-foot', '.proj-screens > *', '.proj-hero-shot',
  ].join(', ');

  function wrapLines(h) {
    if (!h.querySelector('.ht-line')) h.innerHTML = `<span class="ht-line"><span class="ht-in">${h.innerHTML}</span></span>`;
  }

  function scroll(scope) {
    if (!scope || reduce.matches || !('IntersectionObserver' in window)) return;
    const skip = n => n.closest('.page-head, .card, .row-link, .rv-skip');
    const titles = Array.from(scope.querySelectorAll(TITLES)).filter(n => !skip(n));
    titles.forEach(wrapLines);
    const items = Array.from(scope.querySelectorAll(ITEMS))
      .filter(n => !skip(n) && !n.closest(TITLES))
      // Un bloc contenu dans un autre bloc animé s'anime avec lui
      .filter((n, _, all) => !all.some(o => o !== n && o.contains(n)));
    const targets = titles.concat(items).sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    if (!targets.length) return;

    const isTitle = n => titles.includes(n);
    /* Une vague = les cibles qui entrent ensemble, dans l'ordre du document :
       un titre ouvre la vague, le contenu suit en décalé. Plafonné pour
       qu'une longue liste n'attende pas. */
    function wave(nodes, inView) {
      let t = 0;
      const steps = [];
      nodes.forEach(n => {
        if (isTitle(n)) {
          // Déjà peint au chargement : finit de monter (jamais masqué)
          steps.push(...titleSteps(n, t, inView ? '55%' : '105%'));
          t += M.itemAfter;
        } else {
          steps.push(...itemSteps([n], t, inView ? [{ transform: `translateY(${M.rise})` }, { transform: 'none' }] : null));
          t += M.itemStep;
        }
        t = Math.min(t, 8 * M.itemStep + M.itemAfter);
        n.classList.remove('rv-hide', 'rv-mask');
      });
      // fill backwards : l'état de départ est tenu pendant le délai, puis
      // l'élément revient à son style normal (aucun état résiduel).
      play(steps, { fill: 'backwards' });
    }

    // Lectures d'abord (une seule mise en page), écritures ensuite
    const vh = innerHeight;
    const now = [], later = [];
    targets.forEach(n => {
      const r = n.getBoundingClientRect();
      // Déjà au-dessus du viewport (défilement restauré) : laissé tel quel
      if (r.height && r.bottom <= 0) return;
      (r.height && r.top < vh ? now : later).push(n);
    });
    if (now.length) wave(now, true);
    if (!later.length) return;

    const pending = new Set(later);
    later.forEach(n => n.classList.add(isTitle(n) ? 'rv-mask' : 'rv-hide'));
    const io = new IntersectionObserver(entries => {
      const hits = entries.filter(e => e.isIntersecting).map(e => e.target);
      if (!hits.length) return;
      hits.forEach(n => { io.unobserve(n); pending.delete(n); });
      wave(hits.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1), false);
    }); // marge nulle : tout ce qui est visible part, même après un décalage dû aux polices
    later.forEach(n => io.observe(n));

    /* Saut de défilement (fin de page, ancre, geste rapide) : un élément peut
       passer de « sous » à « au-dessus » du viewport entre deux images sans
       jamais intersecter — l'observer ne le signale pas. Une fois le
       défilement posé, ce qui est déjà passé est simplement affiché. */
    let settle = 0;
    function sweep() {
      pending.forEach(n => {
        const r = n.getBoundingClientRect();
        if (r.height && r.bottom <= 0) { io.unobserve(n); pending.delete(n); n.classList.remove('rv-hide', 'rv-mask'); }
      });
      if (!pending.size) removeEventListener('scroll', onScroll);
    }
    function onScroll() { clearTimeout(settle); settle = setTimeout(sweep, 150); }
    addEventListener('scroll', onScroll, { passive: true });
  }

  window.OrReveal = { M, reduce, play, fade, rise, titleSteps, itemSteps, scroll };

  /* Démarrage : la page active (routes SSR de index.html) ou le <main> des
     pages générées. L'accueil a ses propres timelines (accueil.js). */
  const scope = document.querySelector('.page.active') || document.getElementById('main-content');
  if (scope && scope.id !== 'page-home') scroll(scope);
})();
